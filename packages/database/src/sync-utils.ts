import { PrismaClient } from '@prisma/client';

export interface SyncReport {
  table: string;
  primaryCount: number;
  backupCount: number;
  inSync: boolean;
  difference: number;
  lastSyncCheck: Date;
}

export interface SyncStatus {
  overall: boolean;
  reports: SyncReport[];
  errors: Error[];
  timestamp: Date;
}

export class SyncVerifier {
  private primaryClient: PrismaClient;
  private backupClient: PrismaClient;

  constructor(primaryClient: PrismaClient, backupClient: PrismaClient) {
    this.primaryClient = primaryClient;
    this.backupClient = backupClient;
  }

  async verifySyncStatus(): Promise<SyncStatus> {
    const reports: SyncReport[] = [];
    const errors: Error[] = [];
    
    const tables = [
      'user',
      'userProfile',
      'userPreferences',
      'userSettings',
      'userSubscription',
      'session',
      'itinerary',
      'activity',
      'collaborator',
      'traveler',
      'transportation',
      'accommodation',
      'booking',
      'payment',
      'review',
      'notification',
      'follow',
      'block',
      'report'
    ];

    for (const table of tables) {
      try {
        const report = await this.checkTableSync(table);
        reports.push(report);
      } catch (error) {
        errors.push(new Error(`Failed to check sync for table ${table}: ${error instanceof Error ? error.message : String(error)}`));
      }
    }

    const overall = reports.every(report => report.inSync) && errors.length === 0;

    return {
      overall,
      reports,
      errors,
      timestamp: new Date(),
    };
  }

  private async checkTableSync(table: string): Promise<SyncReport> {
    const [primaryCount, backupCount] = await Promise.all([
      (this.primaryClient as any)[table].count(),
      (this.backupClient as any)[table].count(),
    ]);

    const difference = Math.abs(primaryCount - backupCount);
    const inSync = difference === 0;

    return {
      table,
      primaryCount,
      backupCount,
      inSync,
      difference,
      lastSyncCheck: new Date(),
    };
  }

  async findSyncGaps(table: string, limit: number = 100): Promise<{
    missingInBackup: any[];
    missingInPrimary: any[];
  }> {
    const primaryRecords = await (this.primaryClient as any)[table].findMany({
      select: { id: true, createdAt: true, updatedAt: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const backupRecords = await (this.backupClient as any)[table].findMany({
      select: { id: true, createdAt: true, updatedAt: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const primaryIds = new Set(primaryRecords.map((r: any) => r.id));
    const backupIds = new Set(backupRecords.map((r: any) => r.id));

    const missingInBackup = primaryRecords.filter((r: any) => !backupIds.has(r.id));
    const missingInPrimary = backupRecords.filter((r: any) => !primaryIds.has(r.id));

    return {
      missingInBackup,
      missingInPrimary,
    };
  }

  async syncMissingRecords(table: string, recordIds: string[]): Promise<{
    synced: number;
    failed: number;
    errors: Error[];
  }> {
    const result = {
      synced: 0,
      failed: 0,
      errors: [] as Error[],
    };

    for (const id of recordIds) {
      try {
        const record = await (this.primaryClient as any)[table].findUnique({
          where: { id },
        });

        if (record) {
          await (this.backupClient as any)[table].upsert({
            where: { id },
            update: record,
            create: record,
          });
          result.synced++;
        }
      } catch (error) {
        result.failed++;
        result.errors.push(new Error(`Failed to sync record ${id}: ${error instanceof Error ? error.message : String(error)}`));
      }
    }

    return result;
  }

  async generateSyncReport(): Promise<string> {
    const status = await this.verifySyncStatus();
    
    let report = `# Database Sync Report\n`;
    report += `Generated: ${status.timestamp.toISOString()}\n`;
    report += `Overall Status: ${status.overall ? '✅ IN SYNC' : '❌ OUT OF SYNC'}\n\n`;

    if (status.errors.length > 0) {
      report += `## Errors\n`;
      status.errors.forEach(error => {
        report += `- ${error.message}\n`;
      });
      report += '\n';
    }

    report += `## Table Status\n`;
    report += `| Table | Primary | Backup | Difference | Status |\n`;
    report += `|-------|---------|--------|-----------|---------|\n`;
    
    status.reports.forEach(tableReport => {
      const statusIcon = tableReport.inSync ? '✅' : '❌';
      report += `| ${tableReport.table} | ${tableReport.primaryCount} | ${tableReport.backupCount} | ${tableReport.difference} | ${statusIcon} |\n`;
    });

    if (!status.overall) {
      report += `\n## Recommendations\n`;
      report += `1. Check network connectivity between primary and backup databases\n`;
      report += `2. Review application logs for dual-write errors\n`;
      report += `3. Consider running manual sync for affected tables\n`;
      report += `4. Monitor backup database performance\n`;
    }

    return report;
  }

  async performHealthCheck(): Promise<{
    primary: { healthy: boolean; error?: string };
    backup: { healthy: boolean; error?: string };
    latency: { primary: number; backup: number };
  }> {
    const start = Date.now();
    
    const primaryCheck = async () => {
      try {
        await this.primaryClient.$queryRaw`SELECT 1 as health_check`;
        return { healthy: true };
      } catch (error) {
        return { healthy: false, error: error instanceof Error ? error.message : String(error) };
      }
    };

    const backupCheck = async () => {
      try {
        await this.backupClient.$queryRaw`SELECT 1 as health_check`;
        return { healthy: true };
      } catch (error) {
        return { healthy: false, error: error instanceof Error ? error.message : String(error) };
      }
    };

    const [primaryResult, backupResult] = await Promise.all([
      primaryCheck(),
      backupCheck(),
    ]);

    const primaryLatency = Date.now() - start;
    
    const backupStart = Date.now();
    await backupCheck();
    const backupLatency = Date.now() - backupStart;

    return {
      primary: primaryResult,
      backup: backupResult,
      latency: {
        primary: primaryLatency,
        backup: backupLatency,
      },
    };
  }
}
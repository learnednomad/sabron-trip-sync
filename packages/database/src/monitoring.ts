import { DualWriteResult } from './dual-write';
import { SyncVerifier, SyncStatus } from './sync-utils';

export interface AlertConfig {
  webhook?: string;
  email?: string;
  slack?: string;
  enabled: boolean;
  thresholds: {
    maxFailureRate: number; // percentage (0-100)
    maxLatency: number; // milliseconds
    maxSyncGap: number; // number of records
  };
}

export interface MetricPoint {
  timestamp: Date;
  metric: string;
  value: number;
  tags?: Record<string, string>;
}

export class DatabaseMonitor {
  private alertConfig: AlertConfig;
  private metrics: MetricPoint[] = [];
  private maxMetricsHistory = 1000;

  constructor(alertConfig: AlertConfig) {
    this.alertConfig = alertConfig;
  }

  recordDualWriteResult<T>(operation: string, result: DualWriteResult<T>): void {
    const timestamp = new Date();
    
    // Record success metrics
    this.addMetric({
      timestamp,
      metric: 'database.dual_write.primary_success',
      value: result.primarySuccess ? 1 : 0,
      tags: { operation },
    });

    this.addMetric({
      timestamp,
      metric: 'database.dual_write.backup_success',
      value: result.backupSuccess ? 1 : 0,
      tags: { operation },
    });

    // Record error metrics
    if (result.errors.primary) {
      this.addMetric({
        timestamp,
        metric: 'database.dual_write.primary_errors',
        value: 1,
        tags: { operation, error: result.errors.primary.name },
      });
    }

    if (result.errors.backup) {
      this.addMetric({
        timestamp,
        metric: 'database.dual_write.backup_errors',
        value: 1,
        tags: { operation, error: result.errors.backup.name },
      });
    }

    // Check if alert should be triggered
    this.checkFailureRate(operation);
  }

  recordSyncStatus(syncStatus: SyncStatus): void {
    const timestamp = new Date();
    
    this.addMetric({
      timestamp,
      metric: 'database.sync.overall_status',
      value: syncStatus.overall ? 1 : 0,
    });

    this.addMetric({
      timestamp,
      metric: 'database.sync.tables_in_sync',
      value: syncStatus.reports.filter(r => r.inSync).length,
    });

    this.addMetric({
      timestamp,
      metric: 'database.sync.tables_out_of_sync',
      value: syncStatus.reports.filter(r => !r.inSync).length,
    });

    this.addMetric({
      timestamp,
      metric: 'database.sync.total_errors',
      value: syncStatus.errors.length,
    });

    // Check for sync gaps that exceed threshold
    syncStatus.reports.forEach(report => {
      if (report.difference > this.alertConfig.thresholds.maxSyncGap) {
        this.triggerAlert('SYNC_GAP_THRESHOLD_EXCEEDED', {
          table: report.table,
          difference: report.difference,
          threshold: this.alertConfig.thresholds.maxSyncGap,
        });
      }
    });
  }

  recordLatency(operation: string, database: 'primary' | 'backup', latency: number): void {
    this.addMetric({
      timestamp: new Date(),
      metric: 'database.latency',
      value: latency,
      tags: { operation, database },
    });

    if (latency > this.alertConfig.thresholds.maxLatency) {
      this.triggerAlert('HIGH_LATENCY_DETECTED', {
        operation,
        database,
        latency,
        threshold: this.alertConfig.thresholds.maxLatency,
      });
    }
  }

  private addMetric(metric: MetricPoint): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }
  }

  private checkFailureRate(operation: string): void {
    const recentWindow = 5 * 60 * 1000; // 5 minutes
    const cutoff = new Date(Date.now() - recentWindow);
    
    const recentMetrics = this.metrics.filter(
      m => m.timestamp >= cutoff && 
           m.tags?.operation === operation &&
           (m.metric === 'database.dual_write.primary_success' || 
            m.metric === 'database.dual_write.backup_success')
    );

    if (recentMetrics.length < 10) return; // Need sufficient data

    const failures = recentMetrics.filter(m => m.value === 0).length;
    const failureRate = (failures / recentMetrics.length) * 100;

    if (failureRate > this.alertConfig.thresholds.maxFailureRate) {
      this.triggerAlert('HIGH_FAILURE_RATE', {
        operation,
        failureRate: Math.round(failureRate),
        threshold: this.alertConfig.thresholds.maxFailureRate,
        windowMinutes: 5,
      });
    }
  }

  private async triggerAlert(type: string, details: Record<string, any>): Promise<void> {
    if (!this.alertConfig.enabled) return;

    const alert = {
      type,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type),
      message: this.formatAlertMessage(type, details),
      details,
    };

    console.error('DATABASE ALERT:', alert);

    // Send to configured alert channels
    const promises: Promise<any>[] = [];

    if (this.alertConfig.webhook) {
      promises.push(this.sendWebhookAlert(alert));
    }

    if (this.alertConfig.slack) {
      promises.push(this.sendSlackAlert(alert));
    }

    if (this.alertConfig.email) {
      promises.push(this.sendEmailAlert(alert));
    }

    // Don't wait for alerts to complete
    Promise.allSettled(promises).catch(console.error);
  }

  private getAlertSeverity(type: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    switch (type) {
      case 'HIGH_FAILURE_RATE':
        return 'CRITICAL';
      case 'SYNC_GAP_THRESHOLD_EXCEEDED':
        return 'HIGH';
      case 'HIGH_LATENCY_DETECTED':
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }

  private formatAlertMessage(type: string, details: Record<string, any>): string {
    switch (type) {
      case 'HIGH_FAILURE_RATE':
        return `High failure rate detected for ${details.operation}: ${details.failureRate}% (threshold: ${details.threshold}%)`;
      case 'SYNC_GAP_THRESHOLD_EXCEEDED':
        return `Sync gap exceeded for table ${details.table}: ${details.difference} records (threshold: ${details.threshold})`;
      case 'HIGH_LATENCY_DETECTED':
        return `High latency detected for ${details.operation} on ${details.database}: ${details.latency}ms (threshold: ${details.threshold}ms)`;
      default:
        return `Database alert: ${type}`;
    }
  }

  private async sendWebhookAlert(alert: any): Promise<void> {
    try {
      const response = await fetch(this.alertConfig.webhook!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
      
      if (!response.ok) {
        console.error('Webhook alert failed:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  private async sendSlackAlert(alert: any): Promise<void> {
    try {
      const slackPayload = {
        text: `🚨 Database Alert: ${alert.type}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${alert.severity}* ${alert.message}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Timestamp: ${alert.timestamp}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(this.alertConfig.slack!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload),
      });

      if (!response.ok) {
        console.error('Slack alert failed:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  private async sendEmailAlert(alert: any): Promise<void> {
    // Email implementation would depend on your email service
    // This is a placeholder for email alert functionality
    console.log('Email alert would be sent to:', this.alertConfig.email, alert);
  }

  getMetrics(since?: Date): MetricPoint[] {
    if (!since) return [...this.metrics];
    return this.metrics.filter(m => m.timestamp >= since);
  }

  getFailureRate(operation: string, windowMinutes: number = 60): number {
    const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(
      m => m.timestamp >= cutoff && 
           m.tags?.operation === operation &&
           (m.metric === 'database.dual_write.primary_success' || 
            m.metric === 'database.dual_write.backup_success')
    );

    if (recentMetrics.length === 0) return 0;

    const failures = recentMetrics.filter(m => m.value === 0).length;
    return (failures / recentMetrics.length) * 100;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}
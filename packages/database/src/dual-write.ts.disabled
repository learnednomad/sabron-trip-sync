import type { PrismaClient } from '@prisma/client';

export interface DualWriteConfig {
  primaryRetries: number;
  backupRetries: number;
  primaryTimeout: number;
  backupTimeout: number;
  failOnBackupError: boolean;
  enableSync: boolean;
}

export interface DualWriteResult<T> {
  primaryResult: T;
  backupResult?: T;
  primarySuccess: boolean;
  backupSuccess: boolean;
  errors: {
    primary?: Error;
    backup?: Error;
  };
}

export class DualWriteManager {
  private primaryClient: PrismaClient;
  private backupClient: PrismaClient;
  private config: DualWriteConfig;

  constructor(
    primaryClient: PrismaClient,
    backupClient: PrismaClient,
    config: Partial<DualWriteConfig> = {}
  ) {
    this.primaryClient = primaryClient;
    this.backupClient = backupClient;
    this.config = {
      primaryRetries: 3,
      backupRetries: 2,
      primaryTimeout: 5000,
      backupTimeout: 10000,
      failOnBackupError: false,
      enableSync: true,
      ...config,
    };
  }

  async executeWithDualWrite<T>(
    operation: (client: PrismaClient) => Promise<T>,
    operationBackup: (client: PrismaClient) => Promise<T>
  ): Promise<DualWriteResult<T>> {
    const result: DualWriteResult<T> = {
      primaryResult: null as T,
      primarySuccess: false,
      backupSuccess: false,
      errors: {},
    };

    // Execute primary operation
    try {
      result.primaryResult = await this.executeWithRetry(
        () => operation(this.primaryClient),
        this.config.primaryRetries,
        this.config.primaryTimeout
      );
      result.primarySuccess = true;
    } catch (error) {
      result.errors.primary = error as Error;
      throw error; // Primary failure should always throw
    }

    // Execute backup operation if sync is enabled
    if (this.config.enableSync) {
      try {
        result.backupResult = await this.executeWithRetry(
          () => operationBackup(this.backupClient),
          this.config.backupRetries,
          this.config.backupTimeout
        );
        result.backupSuccess = true;
      } catch (error) {
        result.errors.backup = error as Error;
        
        // Log backup failure but don't throw unless configured to
        console.error('Backup database operation failed:', error);
        
        if (this.config.failOnBackupError) {
          throw error;
        }
      }
    }

    return result;
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries: number,
    timeout: number
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= retries; i++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        return await Promise.race([
          operation(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Operation timeout')), timeout)
          ),
        ]);
      } catch (error) {
        lastError = error as Error;
        if (i < retries) {
          // Exponential backoff - note: this is intentionally sequential for retry logic
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError!;
  }

  // Helper methods for common operations
  create<T>(
    model: string,
    data: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as Record<string, { create: (args: unknown) => Promise<T> }>)[model].create({ data, include }),
      (client) => (client as Record<string, { create: (args: unknown) => Promise<T> }>)[model].create({ data, include })
    );
  }

  update<T>(
    model: string,
    where: Record<string, unknown>,
    data: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as Record<string, { update: (args: unknown) => Promise<T> }>)[model].update({ where, data, include }),
      (client) => (client as Record<string, { update: (args: unknown) => Promise<T> }>)[model].update({ where, data, include })
    );
  }

  delete<T>(
    model: string,
    where: Record<string, unknown>
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as Record<string, { delete: (args: unknown) => Promise<T> }>)[model].delete({ where }),
      (client) => (client as Record<string, { delete: (args: unknown) => Promise<T> }>)[model].delete({ where })
    );
  }

  upsert<T>(
    model: string,
    where: Record<string, unknown>,
    update: Record<string, unknown>,
    create: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as Record<string, { upsert: (args: unknown) => Promise<T> }>)[model].upsert({ where, update, create, include }),
      (client) => (client as Record<string, { upsert: (args: unknown) => Promise<T> }>)[model].upsert({ where, update, create, include })
    );
  }

  // Read operations (only from primary)
  findUnique<T>(
    model: string,
    where: Record<string, unknown>,
    include?: Record<string, unknown>
  ): Promise<T> {
    return (this.primaryClient as Record<string, { findUnique: (args: unknown) => Promise<T> }>)[model].findUnique({ where, include });
  }

  findMany<T>(
    model: string,
    options: Record<string, unknown> = {}
  ): Promise<T[]> {
    return (this.primaryClient as Record<string, { findMany: (args: unknown) => Promise<T[]> }>)[model].findMany(options);
  }

  findFirst<T>(
    model: string,
    options: Record<string, unknown> = {}
  ): Promise<T | null> {
    return (this.primaryClient as Record<string, { findFirst: (args: unknown) => Promise<T | null> }>)[model].findFirst(options);
  }

  count(
    model: string,
    where?: Record<string, unknown>
  ): Promise<number> {
    return (this.primaryClient as Record<string, { count: (args: unknown) => Promise<number> }>)[model].count({ where });
  }

  // Transaction support
  transaction<T>(
    operations: ((client: PrismaClient) => Promise<unknown>)[],
    operationsBackup: ((client: PrismaClient) => Promise<unknown>)[]
  ): Promise<DualWriteResult<T[]>> {
    return this.executeWithDualWrite(
      (client) => client.$transaction((tx: PrismaClient) => {
        return Promise.all(operations.map(op => op(tx)));
      }),
      (client) => client.$transaction((tx: PrismaClient) => {
        return Promise.all(operationsBackup.map(op => op(tx)));
      })
    );
  }

  // Health check
  async healthCheck(): Promise<{
    primary: boolean;
    backup: boolean;
    errors: { primary?: Error; backup?: Error };
  }> {
    const result = {
      primary: false,
      backup: false,
      errors: {} as { primary?: Error; backup?: Error },
    };

    try {
      await this.primaryClient.$queryRaw`SELECT 1`;
      result.primary = true;
    } catch (error) {
      result.errors.primary = error as Error;
    }

    try {
      await this.backupClient.$queryRaw`SELECT 1`;
      result.backup = true;
    } catch (error) {
      result.errors.backup = error as Error;
    }

    return result;
  }

  async disconnect(): Promise<void> {
    await Promise.all([
      this.primaryClient.$disconnect(),
      this.backupClient.$disconnect(),
    ]);
  }
}
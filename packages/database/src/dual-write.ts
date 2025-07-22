import { PrismaClient } from '@prisma/client';

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
      primaryResult: null as any,
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
        return await Promise.race([
          operation(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Operation timeout')), timeout)
          ),
        ]);
      } catch (error) {
        lastError = error as Error;
        if (i < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError!;
  }

  // Helper methods for common operations
  async create<T>(
    model: string,
    data: any,
    include?: any
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as any)[model].create({ data, include }),
      (client) => (client as any)[model].create({ data, include })
    );
  }

  async update<T>(
    model: string,
    where: any,
    data: any,
    include?: any
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as any)[model].update({ where, data, include }),
      (client) => (client as any)[model].update({ where, data, include })
    );
  }

  async delete<T>(
    model: string,
    where: any
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as any)[model].delete({ where }),
      (client) => (client as any)[model].delete({ where })
    );
  }

  async upsert<T>(
    model: string,
    where: any,
    update: any,
    create: any,
    include?: any
  ): Promise<DualWriteResult<T>> {
    return this.executeWithDualWrite(
      (client) => (client as any)[model].upsert({ where, update, create, include }),
      (client) => (client as any)[model].upsert({ where, update, create, include })
    );
  }

  // Read operations (only from primary)
  async findUnique<T>(
    model: string,
    where: any,
    include?: any
  ): Promise<T> {
    return (this.primaryClient as any)[model].findUnique({ where, include });
  }

  async findMany<T>(
    model: string,
    options: any = {}
  ): Promise<T[]> {
    return (this.primaryClient as any)[model].findMany(options);
  }

  async findFirst<T>(
    model: string,
    options: any = {}
  ): Promise<T | null> {
    return (this.primaryClient as any)[model].findFirst(options);
  }

  async count(
    model: string,
    where?: any
  ): Promise<number> {
    return (this.primaryClient as any)[model].count({ where });
  }

  // Transaction support
  async transaction<T>(
    operations: ((client: PrismaClient) => Promise<any>)[],
    operationsBackup: ((client: PrismaClient) => Promise<any>)[]
  ): Promise<DualWriteResult<T[]>> {
    return this.executeWithDualWrite(
      (client) => client.$transaction(async (tx: any) => {
        return Promise.all(operations.map(op => op(tx)));
      }),
      (client) => client.$transaction(async (tx: any) => {
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
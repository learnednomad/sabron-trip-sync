import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientBackup } from '@prisma/client-backup';
import { DualWriteManager } from './dual-write';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const prismaBackup = new PrismaClientBackup({
  log: ['query', 'info', 'warn', 'error'],
});

const dualWriteManager = new DualWriteManager(prisma, prismaBackup, {
  enableSync: process.env.ENABLE_BACKUP_SYNC === 'true',
  failOnBackupError: process.env.FAIL_ON_BACKUP_ERROR === 'true',
});

export * from '@prisma/client';
export { prisma, prismaBackup, dualWriteManager };
export { DualWriteManager } from './dual-write';
export type { DualWriteConfig, DualWriteResult } from './dual-write';
export { SyncVerifier } from './sync-utils';
export type { SyncReport, SyncStatus } from './sync-utils';

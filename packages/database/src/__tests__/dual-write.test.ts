import { DualWriteManager, DualWriteConfig } from '../dual-write';
import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientBackup } from '@prisma/client-backup';

// Mock Prisma clients
const mockPrimaryClient = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn(),
} as unknown as PrismaClient;

const mockBackupClient = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn(),
} as unknown as PrismaClientBackup;

describe('DualWriteManager', () => {
  let dualWriteManager: DualWriteManager;
  let config: DualWriteConfig;

  beforeEach(() => {
    config = {
      primaryRetries: 3,
      backupRetries: 2,
      primaryTimeout: 5000,
      backupTimeout: 10000,
      failOnBackupError: false,
      enableSync: true,
    };

    dualWriteManager = new DualWriteManager(
      mockPrimaryClient,
      mockBackupClient,
      config
    );

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create operation', () => {
    it('should create record in both databases successfully', async () => {
      const userData = { id: '1', email: 'test@example.com', name: 'Test User' };
      const expectedResult = { ...userData, createdAt: new Date() };

      (mockPrimaryClient.user.create as jest.Mock).mockResolvedValue(expectedResult);
      (mockBackupClient.user.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dualWriteManager.create('user', userData);

      expect(result.primarySuccess).toBe(true);
      expect(result.backupSuccess).toBe(true);
      expect(result.primaryResult).toEqual(expectedResult);
      expect(result.backupResult).toEqual(expectedResult);
      expect(Object.keys(result.errors)).toHaveLength(0);

      expect(mockPrimaryClient.user.create).toHaveBeenCalledWith({
        data: userData,
        include: undefined,
      });
      expect(mockBackupClient.user.create).toHaveBeenCalledWith({
        data: userData,
        include: undefined,
      });
    });

    it('should handle primary database failure', async () => {
      const userData = { id: '1', email: 'test@example.com', name: 'Test User' };
      const primaryError = new Error('Primary database connection failed');

      (mockPrimaryClient.user.create as jest.Mock).mockRejectedValue(primaryError);

      await expect(dualWriteManager.create('user', userData)).rejects.toThrow(
        'Primary database connection failed'
      );

      expect(mockPrimaryClient.user.create).toHaveBeenCalled();
      expect(mockBackupClient.user.create).not.toHaveBeenCalled();
    });

    it('should handle backup database failure gracefully', async () => {
      const userData = { id: '1', email: 'test@example.com', name: 'Test User' };
      const expectedResult = { ...userData, createdAt: new Date() };
      const backupError = new Error('Backup database connection failed');

      (mockPrimaryClient.user.create as jest.Mock).mockResolvedValue(expectedResult);
      (mockBackupClient.user.create as jest.Mock).mockRejectedValue(backupError);

      const result = await dualWriteManager.create('user', userData);

      expect(result.primarySuccess).toBe(true);
      expect(result.backupSuccess).toBe(false);
      expect(result.primaryResult).toEqual(expectedResult);
      expect(result.errors.backup).toEqual(backupError);
    });

    it('should fail when backup error occurs and failOnBackupError is true', async () => {
      const configWithFailOnBackup = { ...config, failOnBackupError: true };
      const dualWriteManagerStrict = new DualWriteManager(
        mockPrimaryClient,
        mockBackupClient,
        configWithFailOnBackup
      );

      const userData = { id: '1', email: 'test@example.com', name: 'Test User' };
      const expectedResult = { ...userData, createdAt: new Date() };
      const backupError = new Error('Backup database connection failed');

      (mockPrimaryClient.user.create as jest.Mock).mockResolvedValue(expectedResult);
      (mockBackupClient.user.create as jest.Mock).mockRejectedValue(backupError);

      await expect(dualWriteManagerStrict.create('user', userData)).rejects.toThrow(
        'Backup database connection failed'
      );
    });

    it('should skip backup when sync is disabled', async () => {
      const configWithoutSync = { ...config, enableSync: false };
      const dualWriteManagerNoSync = new DualWriteManager(
        mockPrimaryClient,
        mockBackupClient,
        configWithoutSync
      );

      const userData = { id: '1', email: 'test@example.com', name: 'Test User' };
      const expectedResult = { ...userData, createdAt: new Date() };

      (mockPrimaryClient.user.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dualWriteManagerNoSync.create('user', userData);

      expect(result.primarySuccess).toBe(true);
      expect(result.backupSuccess).toBe(false);
      expect(result.primaryResult).toEqual(expectedResult);
      expect(mockPrimaryClient.user.create).toHaveBeenCalled();
      expect(mockBackupClient.user.create).not.toHaveBeenCalled();
    });
  });

  describe('update operation', () => {
    it('should update record in both databases successfully', async () => {
      const where = { id: '1' };
      const data = { name: 'Updated Name' };
      const expectedResult = { id: '1', name: 'Updated Name', updatedAt: new Date() };

      (mockPrimaryClient.user.update as jest.Mock).mockResolvedValue(expectedResult);
      (mockBackupClient.user.update as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dualWriteManager.update('user', where, data);

      expect(result.primarySuccess).toBe(true);
      expect(result.backupSuccess).toBe(true);
      expect(result.primaryResult).toEqual(expectedResult);

      expect(mockPrimaryClient.user.update).toHaveBeenCalledWith({
        where,
        data,
        include: undefined,
      });
      expect(mockBackupClient.user.update).toHaveBeenCalledWith({
        where,
        data,
        include: undefined,
      });
    });
  });

  describe('read operations', () => {
    it('should read from primary database only', async () => {
      const where = { id: '1' };
      const expectedResult = { id: '1', name: 'Test User' };

      (mockPrimaryClient.user.findUnique as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dualWriteManager.findUnique('user', where);

      expect(result).toEqual(expectedResult);
      expect(mockPrimaryClient.user.findUnique).toHaveBeenCalledWith({
        where,
        include: undefined,
      });
      expect(mockBackupClient.user.findUnique).not.toHaveBeenCalled();
    });

    it('should find many records from primary database', async () => {
      const options = { take: 10, orderBy: { createdAt: 'desc' } };
      const expectedResult = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];

      (mockPrimaryClient.user.findMany as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dualWriteManager.findMany('user', options);

      expect(result).toEqual(expectedResult);
      expect(mockPrimaryClient.user.findMany).toHaveBeenCalledWith(options);
      expect(mockBackupClient.user.findMany).not.toHaveBeenCalled();
    });
  });

  describe('health check', () => {
    it('should check health of both databases', async () => {
      (mockPrimaryClient.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);
      (mockBackupClient.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);

      const result = await dualWriteManager.healthCheck();

      expect(result.primary).toBe(true);
      expect(result.backup).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should handle database connection failures in health check', async () => {
      const primaryError = new Error('Primary connection failed');
      const backupError = new Error('Backup connection failed');

      (mockPrimaryClient.$queryRaw as jest.Mock).mockRejectedValue(primaryError);
      (mockBackupClient.$queryRaw as jest.Mock).mockRejectedValue(backupError);

      const result = await dualWriteManager.healthCheck();

      expect(result.primary).toBe(false);
      expect(result.backup).toBe(false);
      expect(result.errors.primary).toEqual(primaryError);
      expect(result.errors.backup).toEqual(backupError);
    });
  });

  describe('disconnect', () => {
    it('should disconnect both clients', async () => {
      (mockPrimaryClient.$disconnect as jest.Mock).mockResolvedValue(undefined);
      (mockBackupClient.$disconnect as jest.Mock).mockResolvedValue(undefined);

      await dualWriteManager.disconnect();

      expect(mockPrimaryClient.$disconnect).toHaveBeenCalled();
      expect(mockBackupClient.$disconnect).toHaveBeenCalled();
    });
  });
});
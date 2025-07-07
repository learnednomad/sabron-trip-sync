import * as FileSystem from 'expo-file-system';
import { apiClient } from '@/lib/api-client';
import type { ApiRequestConfig } from '@sabron/types';

interface QueuedRequest {
  id: string;
  config: ApiRequestConfig;
  timestamp: string;
}

const QUEUE_FILE = \`\${FileSystem.documentDirectory}offline-queue.json\`;

export async function addToOfflineQueue(config: ApiRequestConfig): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    const request: QueuedRequest = {
      id: crypto.randomUUID(),
      config,
      timestamp: new Date().toISOString(),
    };
    queue.push(request);
    await FileSystem.writeAsStringAsync(QUEUE_FILE, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to add to offline queue:', error);
  }
}

export async function getOfflineQueue(): Promise<QueuedRequest[]> {
  try {
    const exists = await FileSystem.getInfoAsync(QUEUE_FILE);
    if (!exists.exists) {
      return [];
    }
    const content = await FileSystem.readAsStringAsync(QUEUE_FILE);
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read offline queue:', error);
    return [];
  }
}

export async function processOfflineQueue(): Promise<void> {
  try {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    for (const request of queue) {
      try {
        await apiClient.request(request.config);
        // Remove successful request from queue
        const updatedQueue = queue.filter((q) => q.id !== request.id);
        await FileSystem.writeAsStringAsync(QUEUE_FILE, JSON.stringify(updatedQueue));
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }
  } catch (error) {
    console.error('Failed to process offline queue:', error);
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    await FileSystem.deleteAsync(QUEUE_FILE, { idempotent: true });
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
  }
}

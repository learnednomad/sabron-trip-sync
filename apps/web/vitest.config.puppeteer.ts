/**
 * Vitest Configuration for Puppeteer E2E Tests
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    name: 'puppeteer-e2e',
    root: './src/test/puppeteer',
    testTimeout: 60000, // 60 seconds for E2E tests
    hookTimeout: 30000, // 30 seconds for setup/teardown
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-reports/puppeteer-results.json'
    },
    setupFiles: ['./setup-tests.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'node14'
  }
});
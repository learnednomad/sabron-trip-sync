/**
 * Puppeteer Test Setup
 * Global setup for all Puppeteer E2E tests
 */

import { beforeAll, afterAll } from 'vitest';

import { PUPPETEER_CONFIG } from './puppeteer.config';

// Extend the global timeout for E2E tests
beforeAll(() => {
  // Ensure test environment variables are set
  process.env.TEST_URL = process.env.TEST_URL || PUPPETEER_CONFIG.BASE_URL;
  process.env.API_URL = process.env.API_URL || PUPPETEER_CONFIG.API_URL;
  
  console.log('🔧 Puppeteer E2E Test Setup');
  console.log(`📍 Testing URL: ${process.env.TEST_URL}`);
  console.log(`🔗 API URL: ${process.env.API_URL}`);
});

afterAll(() => {
  console.log('🧹 Puppeteer E2E Test Cleanup Complete');
});
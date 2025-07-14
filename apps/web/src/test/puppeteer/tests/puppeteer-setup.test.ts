/**
 * Puppeteer Setup Test
 * Test to verify Puppeteer installation and basic functionality
 */

import puppeteer from 'puppeteer';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';

import { PUPPETEER_CONFIG } from '../puppeteer.config';

import type { Browser, Page } from 'puppeteer';

describe('Puppeteer Setup Test', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch(PUPPETEER_CONFIG.BROWSER_OPTIONS);
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport(PUPPETEER_CONFIG.VIEWPORTS.DESKTOP);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('should launch browser successfully', async () => {
    expect(browser).toBeDefined();
    expect(page).toBeDefined();
  });

  test('should navigate to example.com', async () => {
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });

    const title = await page.title();
    const url = page.url();
    
    console.log(`Example.com title: "${title}"`);
    console.log(`Example.com URL: ${url}`);
    
    expect(url).toContain('example.com');
    expect(title).toBeTruthy();
  });

  test('should handle different viewport sizes', async () => {
    const viewports = [
      { name: 'Mobile', ...PUPPETEER_CONFIG.VIEWPORTS.MOBILE },
      { name: 'Tablet', ...PUPPETEER_CONFIG.VIEWPORTS.TABLET },
      { name: 'Desktop', ...PUPPETEER_CONFIG.VIEWPORTS.DESKTOP }
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto('https://example.com', { 
        waitUntil: 'networkidle2',
        timeout: 15000 
      });

      const actualViewport = page.viewport();
      console.log(`${viewport.name}: ${actualViewport?.width}x${actualViewport?.height}`);
      
      expect(actualViewport?.width).toBe(viewport.width);
      expect(actualViewport?.height).toBe(viewport.height);
    }
  });

  test('should capture screenshot', async () => {
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });

    // Take a screenshot
    const screenshot = await page.screenshot({ 
      type: 'png',
      encoding: 'base64'
    });

    expect(screenshot).toBeTruthy();
    expect(typeof screenshot).toBe('string');
    console.log(`Screenshot captured: ${screenshot.length} characters`);
  });

  test('should evaluate JavaScript', async () => {
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });

    const result = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      };
    });

    expect(result.title).toBeTruthy();
    expect(result.url).toContain('example.com');
    expect(result.userAgent).toBeTruthy();
    expect(result.timestamp).toBeGreaterThan(0);
    
    console.log('Page evaluation result:', result);
  });

  test('should handle network requests', async () => {
    const responses: string[] = [];
    
    page.on('response', (response) => {
      responses.push(`${response.status()} ${response.url()}`);
    });

    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });

    expect(responses.length).toBeGreaterThan(0);
    
    // Should have at least one successful response
    const successfulResponses = responses.filter(r => r.startsWith('200'));
    expect(successfulResponses.length).toBeGreaterThan(0);
    
    console.log(`Captured ${responses.length} network responses`);
    console.log('Sample responses:', responses.slice(0, 3));
  });
});
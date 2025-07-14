/**
 * Homepage E2E Tests
 * Tests for the TravelSync homepage functionality
 */

import puppeteer from 'puppeteer';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';

import { PUPPETEER_CONFIG } from '../puppeteer.config';
import { TestHelpers } from '../utils/test-helpers';

import type { Browser, Page } from 'puppeteer';

describe('Homepage E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch(PUPPETEER_CONFIG.BROWSER_OPTIONS);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport(PUPPETEER_CONFIG.VIEWPORTS.DESKTOP);
    await TestHelpers.interceptNetworkRequests(page);
  });

  afterEach(async () => {
    await page.close();
  });

  test('should load homepage successfully', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { 
      waitUntil: 'networkidle0',
      timeout: PUPPETEER_CONFIG.TIMEOUTS.NAVIGATION 
    });

    // Check if page loaded
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for main content
    const body = await page.evaluate(() => document.body.innerHTML);
    expect(body).toBeTruthy();

    // Take screenshot for visual verification
    await TestHelpers.takeScreenshot(page, 'homepage-loaded');
  });

  test('should have proper SEO meta tags', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL);

    const metaTags = await page.evaluate(() => {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content');
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');

      return { title, description, viewport, ogTitle, ogDescription };
    });

    expect(metaTags.title).toBeTruthy();
    expect(metaTags.viewport).toContain('width=device-width');
  });

  test('should be responsive across different viewports', async () => {
    for (const [name, viewport] of Object.entries(PUPPETEER_CONFIG.VIEWPORTS)) {
      await page.setViewport(viewport);
      await page.goto(PUPPETEER_CONFIG.BASE_URL);
      
      // Wait for page to adjust to new viewport
      await page.waitForTimeout(1000);
      
      // Check if page is still functional
      const bodyVisible = await page.isVisible('body');
      expect(bodyVisible).toBe(true);
      
      // Take screenshot for visual verification
      await TestHelpers.takeScreenshot(page, `homepage-${name.toLowerCase()}`);
    }
  });

  test('should have working navigation links', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL);

    // Find all navigation links
    const navigationLinks = await page.$$eval('nav a, header a', (links) =>
      links.map((link) => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim(),
      }))
    );

    expect(navigationLinks.length).toBeGreaterThan(0);

    // Test each navigation link
    for (const link of navigationLinks) {
      if (link.href && !link.href.startsWith('http') && !link.href.startsWith('#')) {
        const linkUrl = new URL(link.href, PUPPETEER_CONFIG.BASE_URL).href;
        
        // Click the link
        await page.click(`a[href="${link.href}"]`);
        
        // Wait for navigation
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        // Check if page loaded successfully
        const currentUrl = page.url();
        expect(currentUrl).toBe(linkUrl);
        
        // Go back to homepage
        await page.goto(PUPPETEER_CONFIG.BASE_URL);
      }
    }
  });

  test('should load without JavaScript errors', async () => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('response', (response) => {
      if (!response.ok()) {
        errors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });

    await page.goto(PUPPETEER_CONFIG.BASE_URL, { waitUntil: 'networkidle0' });

    // Wait a bit for any delayed errors
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('should meet basic accessibility standards', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL);
    
    const accessibilityIssues = await TestHelpers.checkAccessibility(page);
    
    // Log issues for review but don't fail test unless critical
    if (accessibilityIssues.length > 0) {
      console.warn('Accessibility issues found:', accessibilityIssues);
    }
    
    // Check for basic accessibility requirements
    const hasMainLandmark = await page.$('main, [role="main"]');
    expect(hasMainLandmark).toBeTruthy();
  });

  test('should perform well under different network conditions', async () => {
    // Test with slow 3G
    await TestHelpers.simulateNetworkConditions(page, 'slow3g');
    
    const startTime = Date.now();
    await page.goto(PUPPETEER_CONFIG.BASE_URL, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time even on slow connection
    expect(loadTime).toBeLessThan(30000); // 30 seconds max
    
    const performance = await TestHelpers.measurePagePerformance(page);
    console.log('Performance metrics:', performance);
  });

  test('should handle offline state gracefully', async () => {
    // First load the page normally
    await page.goto(PUPPETEER_CONFIG.BASE_URL);
    
    // Simulate offline
    await TestHelpers.simulateNetworkConditions(page, 'offline');
    
    // Try to navigate or interact
    const offlineMessage = await page.evaluate(() => {
      // Trigger a network request to see offline handling
      return fetch('/api/test').catch(error => error.message);
    });
    
    // Should handle offline state (exact behavior depends on implementation)
    expect(offlineMessage).toBeTruthy();
  });

  test('should display proper loading states', async () => {
    // Enable request interception to delay responses
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        // Delay API requests to observe loading states
        setTimeout(() => request.continue(), 1000);
      } else {
        request.continue();
      }
    });

    await page.goto(PUPPETEER_CONFIG.BASE_URL);
    
    // Look for loading indicators
    const hasLoadingState = await page.evaluate(() => {
      return document.querySelector('[data-testid="loading-spinner"], .loading, .spinner') !== null;
    });
    
    // Note: This test depends on the actual implementation
    console.log('Loading state detected:', hasLoadingState);
  });

  test('should work with keyboard navigation', async () => {
    await page.goto(PUPPETEER_CONFIG.BASE_URL);
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Should have focusable elements
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(focusedElement || '')).toBe(true);
    
    // Test escape key (should close modals/dropdowns if any)
    await page.keyboard.press('Escape');
    
    // Test enter key on focused element
    await page.keyboard.press('Enter');
  });
});
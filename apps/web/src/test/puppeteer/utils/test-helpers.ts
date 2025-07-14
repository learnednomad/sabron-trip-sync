/**
 * Puppeteer Test Helper Utilities
 * Common functions for TravelSync web app testing
 */

import { Browser } from 'puppeteer';

import { PUPPETEER_CONFIG } from '../puppeteer.config';

import type { Page, ElementHandle } from 'puppeteer';

export class TestHelpers {
  static async waitForPageLoad(page: Page, timeout = PUPPETEER_CONFIG.TIMEOUTS.NAVIGATION): Promise<void> {
    await page.waitForLoadState('networkidle2', { timeout });
  }

  static async waitForElement(
    page: Page,
    selector: string,
    timeout = PUPPETEER_CONFIG.TIMEOUTS.ELEMENT_WAIT
  ): Promise<ElementHandle<Element>> {
    return await page.waitForSelector(selector, { timeout });
  }

  static async waitForText(
    page: Page,
    text: string,
    timeout = PUPPETEER_CONFIG.TIMEOUTS.ELEMENT_WAIT
  ): Promise<void> {
    await page.waitForFunction(
      (searchText) => document.body.innerText.includes(searchText),
      { timeout },
      text
    );
  }

  static async typeWithDelay(page: Page, selector: string, text: string, delay = 50): Promise<void> {
    await page.type(selector, text, { delay });
  }

  static async clickAndWait(
    page: Page,
    selector: string,
    waitForSelector?: string,
    timeout = PUPPETEER_CONFIG.TIMEOUTS.ELEMENT_WAIT
  ): Promise<void> {
    await page.click(selector);
    if (waitForSelector) {
      await this.waitForElement(page, waitForSelector, timeout);
    }
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
      path: `src/test/puppeteer/screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  static async checkAccessibility(page: Page): Promise<any[]> {
    // Basic accessibility checks
    const violations = await page.evaluate(() => {
      const issues: any[] = [];
      
      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img, index) => {
        issues.push({
          type: 'missing-alt-text',
          element: `img:nth-child(${index + 1})`,
          message: 'Image missing alt text',
        });
      });

      // Check for missing form labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach((input, index) => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`);
        if (!hasLabel) {
          issues.push({
            type: 'missing-form-label',
            element: `input:nth-child(${index + 1})`,
            message: 'Form input missing associated label',
          });
        }
      });

      // Check for sufficient color contrast (basic check)
      const elements = document.querySelectorAll('*');
      elements.forEach((element, index) => {
        const styles = window.getComputedStyle(element);
        const bg = styles.backgroundColor;
        const color = styles.color;
        
        // Simple contrast check (would need more sophisticated algorithm in real scenario)
        if (bg === 'rgb(255, 255, 255)' && color === 'rgb(255, 255, 255)') {
          issues.push({
            type: 'poor-contrast',
            element: `element:nth-child(${index + 1})`,
            message: 'Poor color contrast detected',
          });
        }
      });

      return issues;
    });

    return violations;
  }

  static async simulateNetworkConditions(page: Page, condition: 'slow3g' | 'fast3g' | 'offline'): Promise<void> {
    const conditions = {
      slow3g: {
        offline: false,
        downloadThroughput: 500 * 1024 / 8, // 500kb/s
        uploadThroughput: 500 * 1024 / 8,
        latency: 400,
      },
      fast3g: {
        offline: false,
        downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6Mb/s
        uploadThroughput: 750 * 1024 / 8, // 750kb/s
        latency: 150,
      },
      offline: {
        offline: true,
        downloadThroughput: 0,
        uploadThroughput: 0,
        latency: 0,
      },
    };

    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', conditions[condition]);
  }

  static async measurePagePerformance(page: Page): Promise<any> {
    const metrics = await page.metrics();
    
    const performanceData = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });

    return {
      ...metrics,
      ...performanceData,
    };
  }

  static async interceptNetworkRequests(page: Page): Promise<void> {
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      // Log all network requests
      console.log(`Request: ${request.method()} ${request.url()}`);
      request.continue();
    });

    page.on('response', (response) => {
      // Log all responses
      console.log(`Response: ${response.status()} ${response.url()}`);
    });
  }

  static async fillForm(page: Page, formData: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await page.waitForSelector(selector);
      await page.click(selector, { clickCount: 3 });
      await this.typeWithDelay(page, selector, value);
    }
  }

  static async waitForAPIResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout = PUPPETEER_CONFIG.TIMEOUTS.API_RESPONSE
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`API response timeout for pattern: ${urlPattern}`));
      }, timeout);

      page.on('response', async (response) => {
        const url = response.url();
        const matches = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);
          
        if (matches) {
          clearTimeout(timeoutId);
          try {
            const data = await response.json();
            resolve({ status: response.status(), data });
          } catch (error) {
            resolve({ status: response.status(), error });
          }
        }
      });
    });
  }

  static async generateTestReport(testResults: any[]): Promise<string> {
    const timestamp = new Date().toISOString();
    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;

    const report = {
      timestamp,
      summary: {
        total: testResults.length,
        passed,
        failed,
        passRate: `${((passed / testResults.length) * 100).toFixed(2)}%`,
      },
      results: testResults,
    };

    return JSON.stringify(report, null, 2);
  }

  static async simulateUserInteraction(page: Page, interactions: Array<{
    type: 'click' | 'type' | 'select' | 'hover' | 'scroll';
    selector?: string;
    value?: string;
    options?: any;
  }>): Promise<void> {
    for (const interaction of interactions) {
      switch (interaction.type) {
        case 'click':
          if (interaction.selector) {
            await page.click(interaction.selector);
          }
          break;
        case 'type':
          if (interaction.selector && interaction.value) {
            await this.typeWithDelay(page, interaction.selector, interaction.value);
          }
          break;
        case 'hover':
          if (interaction.selector) {
            await page.hover(interaction.selector);
          }
          break;
        case 'scroll':
          await page.evaluate((options) => {
            window.scrollTo(options?.x || 0, options?.y || window.innerHeight);
          }, interaction.options);
          break;
      }
      
      // Add small delay between interactions for realism
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}
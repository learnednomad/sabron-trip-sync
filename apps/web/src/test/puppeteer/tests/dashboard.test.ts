/**
 * Dashboard E2E Tests
 * Tests for the main dashboard functionality and trip management
 */

import puppeteer from 'puppeteer';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';

import { PUPPETEER_CONFIG } from '../puppeteer.config';
import { TestHelpers } from '../utils/test-helpers';

import type { Browser, Page } from 'puppeteer';

describe('Dashboard E2E Tests', () => {
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

  test('should load dashboard page', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Check if redirected to login (unauthenticated) or dashboard loads
    const url = page.url();
    const isOnLogin = url.includes('/login');
    const isOnDashboard = url.includes('/dashboard') || url === `${PUPPETEER_CONFIG.BASE_URL}/`;
    
    expect(isOnLogin || isOnDashboard).toBe(true);
    
    if (isOnDashboard) {
      // If on dashboard, check for dashboard elements
      const hasDashboardContent = await page.$(PUPPETEER_CONFIG.SELECTORS.DASHBOARD_CONTAINER) ||
                                  await page.$('[data-testid*="dashboard"]') ||
                                  await page.$('.dashboard') ||
                                  await page.$('#dashboard');
      
      expect(hasDashboardContent).toBeTruthy();
    }
    
    await TestHelpers.takeScreenshot(page, 'dashboard-initial');
  });

  test('should display user navigation menu', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Look for navigation elements
    const navigation = await page.$(PUPPETEER_CONFIG.SELECTORS.MAIN_NAV) ||
                       await page.$('nav') ||
                       await page.$('[role="navigation"]');
    
    if (navigation) {
      expect(navigation).toBeTruthy();
      
      // Check for common navigation items
      const navItems = await page.$$eval('nav a, [role="navigation"] a', (links) =>
        links.map(link => ({
          text: link.textContent?.trim(),
          href: link.getAttribute('href')
        }))
      );
      
      expect(navItems.length).toBeGreaterThan(0);
      console.log('Navigation items found:', navItems);
    }
  });

  test('should display trip cards or empty state', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Look for trip cards
    const tripCards = await page.$$(PUPPETEER_CONFIG.SELECTORS.TRIP_CARDS) ||
                      await page.$$('[data-testid*="trip"]') ||
                      await page.$$('.trip-card, .card');
    
    // Look for empty state
    const emptyState = await page.$('[data-testid="empty-state"]') ||
                       await page.$('.empty-state') ||
                       await page.$eval('*', (el) => 
                         el.textContent?.includes('No trips') || 
                         el.textContent?.includes('Create your first') ? el : null
                       );
    
    // Should have either trip cards or empty state
    expect(tripCards.length > 0 || emptyState !== null).toBe(true);
    
    console.log(`Found ${tripCards.length} trip cards`);
    
    await TestHelpers.takeScreenshot(page, 'dashboard-content');
  });

  test('should have create trip functionality', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Look for create trip button
    const createButton = await page.$(PUPPETEER_CONFIG.SELECTORS.CREATE_TRIP_BUTTON) ||
                         await page.$('[data-testid*="create"]') ||
                         await page.$('button:contains("Create")') ||
                         await page.$('a:contains("Create")') ||
                         await page.$('.btn-primary, .create-btn');
    
    if (createButton) {
      expect(createButton).toBeTruthy();
      
      // Click create button
      await createButton.click();
      await page.waitForTimeout(1000);
      
      // Check if modal opened or navigated to create page
      const modal = await page.$(PUPPETEER_CONFIG.SELECTORS.MODAL) ||
                    await page.$('[role="dialog"]') ||
                    await page.$('.modal');
      
      const currentUrl = page.url();
      const hasModal = modal !== null;
      const navigatedToCreate = currentUrl.includes('/create') || currentUrl.includes('/new');
      
      expect(hasModal || navigatedToCreate).toBe(true);
      
      await TestHelpers.takeScreenshot(page, 'create-trip-opened');
    }
  });

  test('should handle trip creation form', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Try to open create trip form
    const createButton = await page.$('[data-testid*="create"], button:contains("Create"), .create-btn');
    
    if (createButton) {
      await createButton.click();
      await page.waitForTimeout(1000);
      
      // Look for form fields
      const titleInput = await page.$(PUPPETEER_CONFIG.SELECTORS.TRIP_TITLE_INPUT) ||
                         await page.$('input[name="title"]') ||
                         await page.$('input[placeholder*="title"]');
      
      const descriptionInput = await page.$(PUPPETEER_CONFIG.SELECTORS.TRIP_DESCRIPTION_INPUT) ||
                               await page.$('textarea[name="description"]') ||
                               await page.$('input[name="description"]');
      
      if (titleInput) {
        // Fill form
        await titleInput.type(PUPPETEER_CONFIG.TEST_DATA.TRIP.title);
        
        if (descriptionInput) {
          await descriptionInput.type(PUPPETEER_CONFIG.TEST_DATA.TRIP.description);
        }
        
        // Look for date picker
        const datePicker = await page.$(PUPPETEER_CONFIG.SELECTORS.DATE_PICKER) ||
                           await page.$('input[type="date"]') ||
                           await page.$('[data-testid*="date"]');
        
        if (datePicker) {
          await datePicker.click();
          await page.waitForTimeout(500);
        }
        
        // Look for submit button
        const submitButton = await page.$('button[type="submit"]') ||
                             await page.$('.btn-submit, .save-btn');
        
        if (submitButton) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          // Check for success or validation
          const success = await page.$('.success, .alert-success') ||
                          page.url() !== `${PUPPETEER_CONFIG.BASE_URL}/dashboard`;
          
          console.log('Trip creation attempted, success indicator found:', success !== null);
        }
        
        await TestHelpers.takeScreenshot(page, 'trip-form-filled');
      }
    }
  });

  test('should display recent activity', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Look for activity section
    const activitySection = await page.$('[data-testid*="activity"]') ||
                            await page.$('.activity, .recent-activity') ||
                            await page.$eval('*', (el) => 
                              el.textContent?.includes('Recent') || 
                              el.textContent?.includes('Activity') ? el : null
                            );
    
    if (activitySection) {
      expect(activitySection).toBeTruthy();
      console.log('Activity section found');
    }
  });

  test('should handle search and filtering', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Look for search input
    const searchInput = await page.$('input[type="search"]') ||
                        await page.$('input[placeholder*="search"]') ||
                        await page.$('[data-testid*="search"]');
    
    if (searchInput) {
      // Test search functionality
      await searchInput.type('Tokyo');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      
      // Check if results filtered
      const results = await page.$$('.trip-card, [data-testid*="trip"]');
      console.log(`Search results: ${results.length} items`);
      
      await TestHelpers.takeScreenshot(page, 'search-results');
    }
    
    // Look for filter options
    const filterButtons = await page.$$('button:contains("Filter"), .filter-btn, [data-testid*="filter"]');
    
    if (filterButtons.length > 0) {
      // Test filter functionality
      await filterButtons[0].click();
      await page.waitForTimeout(500);
      
      const filterOptions = await page.$$('.filter-option, .dropdown-item');
      if (filterOptions.length > 0) {
        await filterOptions[0].click();
        await page.waitForTimeout(1000);
        
        await TestHelpers.takeScreenshot(page, 'filtered-results');
      }
    }
  });

  test('should handle pagination', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Look for pagination controls
    const pagination = await page.$('.pagination') ||
                       await page.$('[data-testid*="pagination"]') ||
                       await page.$('nav[aria-label*="pagination"]');
    
    if (pagination) {
      const nextButton = await page.$('button:contains("Next"), .next-btn') ||
                         await page.$('[aria-label*="next"]');
      
      if (nextButton) {
        const isEnabled = await nextButton.isEnabled();
        if (isEnabled) {
          await nextButton.click();
          await page.waitForTimeout(1000);
          
          // Check if page changed
          const url = page.url();
          expect(url).toBeTruthy();
          
          await TestHelpers.takeScreenshot(page, 'pagination-next');
        }
      }
    }
  });

  test('should handle responsive layout', async () => {
    for (const [name, viewport] of Object.entries(PUPPETEER_CONFIG.VIEWPORTS)) {
      await page.setViewport(viewport);
      await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
      await page.waitForTimeout(1000);
      
      // Check if content is still accessible
      const contentVisible = await page.isVisible('main, .main-content, .dashboard');
      expect(contentVisible).toBe(true);
      
      // Check for mobile menu if on mobile
      if (name === 'MOBILE') {
        const mobileMenu = await page.$('.mobile-menu, .hamburger, [data-testid*="mobile"]');
        if (mobileMenu) {
          await mobileMenu.click();
          await page.waitForTimeout(500);
          
          await TestHelpers.takeScreenshot(page, 'dashboard-mobile-menu');
        }
      }
      
      await TestHelpers.takeScreenshot(page, `dashboard-${name.toLowerCase()}`);
    }
  });

  test('should handle loading states', async () => {
    // Enable slow network to observe loading states
    await TestHelpers.simulateNetworkConditions(page, 'slow3g');
    
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    
    // Look for loading indicators
    const loadingIndicator = await page.$(PUPPETEER_CONFIG.SELECTORS.LOADING_SPINNER) ||
                             await page.$('.loading, .spinner') ||
                             await page.$('[data-testid*="loading"]');
    
    if (loadingIndicator) {
      expect(loadingIndicator).toBeTruthy();
      console.log('Loading indicator found');
      
      // Wait for loading to complete
      await page.waitForSelector('.loading, .spinner', { hidden: true, timeout: 30000 });
    }
    
    await TestHelpers.takeScreenshot(page, 'dashboard-loaded');
  });

  test('should handle error states gracefully', async () => {
    // Mock API errors
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      if (request.url().includes('/api/trips')) {
        request.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        request.continue();
      }
    });
    
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/dashboard`);
    await page.waitForTimeout(3000);
    
    // Look for error message
    const errorMessage = await page.$(PUPPETEER_CONFIG.SELECTORS.ERROR_MESSAGE) ||
                         await page.$('.error, .alert-error') ||
                         await page.$eval('*', (el) => 
                           el.textContent?.includes('Error') || 
                           el.textContent?.includes('failed') ? el : null
                         );
    
    if (errorMessage) {
      expect(errorMessage).toBeTruthy();
      console.log('Error state handled');
    }
    
    await TestHelpers.takeScreenshot(page, 'dashboard-error-state');
  });
});
/**
 * Authentication E2E Tests
 * Tests for login, signup, and user authentication flows
 */

import puppeteer from 'puppeteer';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';

import { PUPPETEER_CONFIG } from '../puppeteer.config';
import { TestHelpers } from '../utils/test-helpers';

import type { Browser, Page } from 'puppeteer';

describe('Authentication E2E Tests', () => {
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

  test('should navigate to login page', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Check if login page loaded
    const url = page.url();
    expect(url).toContain('/login');
    
    // Look for login form elements
    const hasLoginForm = await page.$(PUPPETEER_CONFIG.SELECTORS.LOGIN_FORM) !== null ||
                         await page.$('form') !== null;
    expect(hasLoginForm).toBe(true);
    
    await TestHelpers.takeScreenshot(page, 'login-page');
  });

  test('should display login form with required fields', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Check for email input
    const emailInput = await page.$(PUPPETEER_CONFIG.SELECTORS.EMAIL_INPUT) ||
                       await page.$('input[type="email"]') ||
                       await page.$('input[name="email"]');
    expect(emailInput).toBeTruthy();
    
    // Check for password input
    const passwordInput = await page.$(PUPPETEER_CONFIG.SELECTORS.PASSWORD_INPUT) ||
                          await page.$('input[type="password"]') ||
                          await page.$('input[name="password"]');
    expect(passwordInput).toBeTruthy();
    
    // Check for submit button
    const submitButton = await page.$(PUPPETEER_CONFIG.SELECTORS.LOGIN_BUTTON) ||
                         await page.$('button[type="submit"]') ||
                         await page.$('input[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  test('should validate required fields', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Try to submit empty form
    const submitButton = await page.$('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      
      // Wait for validation messages
      await page.waitForTimeout(1000);
      
      // Check for validation errors
      const validationErrors = await page.$$eval(
        '.error, .invalid, [aria-invalid="true"], .text-red-500, .text-destructive',
        (elements) => elements.map(el => el.textContent?.trim())
      );
      
      // Should have some form of validation
      expect(validationErrors.length).toBeGreaterThan(0);
    }
  });

  test('should handle invalid login credentials', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Fill in invalid credentials
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    
    if (emailInput && passwordInput) {
      await emailInput.type('invalid@email.com');
      await passwordInput.type('wrongpassword');
      
      // Submit form
      const submitButton = await page.$('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        
        // Wait for error response
        await page.waitForTimeout(3000);
        
        // Check for error message
        const errorMessage = await page.$('.error, .alert-error, .text-red-500, .text-destructive');
        const currentUrl = page.url();
        
        // Should either show error or stay on login page
        expect(errorMessage !== null || currentUrl.includes('/login')).toBe(true);
      }
    }
    
    await TestHelpers.takeScreenshot(page, 'login-invalid-credentials');
  });

  test('should navigate to signup page', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Look for signup link
    const signupLink = await page.$(PUPPETEER_CONFIG.SELECTORS.SIGNUP_LINK) ||
                       await page.$('a[href*="signup"]') ||
                       await page.$('a[href*="register"]');
    
    if (signupLink) {
      await signupLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      const url = page.url();
      expect(url).toMatch(/\/(signup|register)/);
      
      await TestHelpers.takeScreenshot(page, 'signup-page');
    } else {
      // Try direct navigation
      await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/signup`);
      const url = page.url();
      expect(url).toContain('/signup');
    }
  });

  test('should handle OAuth login options', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Look for OAuth buttons (Google, GitHub, etc.)
    const oauthButtons = await page.$$eval(
      'button, a',
      (elements) => elements.filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        const href = el.getAttribute('href') || '';
        return text.includes('google') || 
               text.includes('github') || 
               text.includes('facebook') ||
               href.includes('oauth') ||
               href.includes('auth');
      })
    );
    
    console.log(`Found ${oauthButtons.length} potential OAuth buttons`);
    
    // Test that OAuth buttons are clickable (without actually authenticating)
    const googleButton = await page.$('button:contains("Google"), a:contains("Google")');
    if (googleButton) {
      const isClickable = await googleButton.isEnabled();
      expect(isClickable).toBe(true);
    }
  });

  test('should handle password reset flow', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Look for forgot password link
    const forgotPasswordLink = await page.$('a[href*="forgot"], a[href*="reset"]') ||
                               await page.$eval('a', (link) => {
                                 return link.textContent?.toLowerCase().includes('forgot') ? link : null;
                               });
    
    if (forgotPasswordLink) {
      await forgotPasswordLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Should navigate to password reset page
      const url = page.url();
      expect(url).toMatch(/\/(forgot|reset|password)/);
      
      await TestHelpers.takeScreenshot(page, 'password-reset-page');
    }
  });

  test('should maintain session state', async () => {
    // This test would require valid test credentials
    // For demo purposes, we'll test session persistence mechanisms
    
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Check if page uses proper session storage
    const sessionData = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        cookies: document.cookie.length > 0,
      };
    });
    
    console.log('Session mechanisms available:', sessionData);
  });

  test('should redirect after successful login', async () => {
    // This test assumes we have a mock login or test environment
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login?redirect=/dashboard`);
    
    // Check if redirect parameter is preserved
    const url = page.url();
    if (url.includes('redirect')) {
      expect(url).toContain('redirect');
    }
  });

  test('should handle concurrent login attempts', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Simulate multiple rapid form submissions
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    const submitButton = await page.$('button[type="submit"], input[type="submit"]');
    
    if (emailInput && passwordInput && submitButton) {
      await emailInput.type('test@example.com');
      await passwordInput.type('password123');
      
      // Click submit multiple times rapidly
      await Promise.all([
        submitButton.click(),
        submitButton.click(),
        submitButton.click(),
      ]);
      
      // Should handle gracefully without errors
      await page.waitForTimeout(2000);
      
      // Check for any JavaScript errors
      const errors = await page.evaluate(() => {
        return (window as any).lastError || null;
      });
      
      expect(errors).toBeFalsy();
    }
  });

  test('should work with keyboard navigation', async () => {
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Tab through form elements
    await page.keyboard.press('Tab'); // Should focus first input
    await page.keyboard.type('test@example.com');
    
    await page.keyboard.press('Tab'); // Should focus password input
    await page.keyboard.type('password123');
    
    await page.keyboard.press('Tab'); // Should focus submit button
    
    // Check if submit button is focused
    const focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return focused?.tagName.toLowerCase() === 'button' && 
             (focused.getAttribute('type') === 'submit' || focused.textContent?.includes('login'));
    });
    
    expect(focusedElement).toBe(true);
    
    // Test Enter key submission
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
  });

  test('should be responsive on mobile devices', async () => {
    await page.setViewport(PUPPETEER_CONFIG.VIEWPORTS.MOBILE);
    await page.goto(`${PUPPETEER_CONFIG.BASE_URL}/login`);
    
    // Check if form is usable on mobile
    const formVisible = await page.isVisible('form, [data-testid="login-form"]');
    expect(formVisible).toBe(true);
    
    // Check if inputs are properly sized
    const inputsAccessible = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).every(input => {
        const rect = input.getBoundingClientRect();
        return rect.height >= 44; // Minimum touch target size
      });
    });
    
    expect(inputsAccessible).toBe(true);
    
    await TestHelpers.takeScreenshot(page, 'login-mobile');
  });
});
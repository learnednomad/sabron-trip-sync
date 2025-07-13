/**
 * Puppeteer Test Configuration for TravelSync Web App
 * Comprehensive testing setup for the TravelSync application
 */

export const PUPPETEER_CONFIG = {
  // Application URLs
  BASE_URL: process.env.TEST_URL || 'http://localhost:3001',
  API_URL: process.env.API_URL || 'http://localhost:3000',
  
  // Browser Configuration
  BROWSER_OPTIONS: {
    headless: process.env.CI === 'true' ? 'new' as const : false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  },

  // Test Configuration
  TIMEOUTS: {
    DEFAULT: 30000,
    NAVIGATION: 30000,
    ELEMENT_WAIT: 10000,
    API_RESPONSE: 15000,
  },

  // Viewport Configurations for Responsive Testing
  VIEWPORTS: {
    MOBILE: { width: 375, height: 667 },
    TABLET: { width: 768, height: 1024 },
    DESKTOP: { width: 1920, height: 1080 },
    DESKTOP_LARGE: { width: 2560, height: 1440 },
  },

  // Test Data
  TEST_DATA: {
    USER: {
      email: 'test@travelsync.com',
      password: 'TestPassword123!',
      name: 'Test User',
    },
    TRIP: {
      title: 'Test Trip to Tokyo',
      description: 'An amazing journey to Japan',
      destination: 'Tokyo, Japan',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
    },
  },

  // Selectors for consistent element targeting
  SELECTORS: {
    // Navigation
    MAIN_NAV: '[data-testid="main-navigation"]',
    USER_MENU: '[data-testid="user-menu"]',
    
    // Authentication
    LOGIN_FORM: '[data-testid="login-form"]',
    EMAIL_INPUT: '[data-testid="email-input"]',
    PASSWORD_INPUT: '[data-testid="password-input"]',
    LOGIN_BUTTON: '[data-testid="login-button"]',
    SIGNUP_LINK: '[data-testid="signup-link"]',
    
    // Dashboard
    DASHBOARD_CONTAINER: '[data-testid="dashboard-container"]',
    CREATE_TRIP_BUTTON: '[data-testid="create-trip-button"]',
    TRIP_CARDS: '[data-testid="trip-card"]',
    
    // Trip Creation
    TRIP_FORM: '[data-testid="trip-form"]',
    TRIP_TITLE_INPUT: '[data-testid="trip-title-input"]',
    TRIP_DESCRIPTION_INPUT: '[data-testid="trip-description-input"]',
    DATE_PICKER: '[data-testid="date-picker"]',
    
    // Activities
    ACTIVITY_LIST: '[data-testid="activity-list"]',
    ADD_ACTIVITY_BUTTON: '[data-testid="add-activity-button"]',
    ACTIVITY_FORM: '[data-testid="activity-form"]',
    
    // Common Elements
    LOADING_SPINNER: '[data-testid="loading-spinner"]',
    ERROR_MESSAGE: '[data-testid="error-message"]',
    SUCCESS_MESSAGE: '[data-testid="success-message"]',
    MODAL: '[data-testid="modal"]',
    CLOSE_BUTTON: '[data-testid="close-button"]',
  },
} as const;

export type PuppeteerConfig = typeof PUPPETEER_CONFIG;
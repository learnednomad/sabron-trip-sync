/**
 * Puppeteer Test Runner
 * Comprehensive E2E test runner for TravelSync web application
 */

import puppeteer, { Browser } from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { PUPPETEER_CONFIG } from './puppeteer.config';
import { TestHelpers } from './utils/test-helpers';

interface TestResult {
  testFile: string;
  passed: boolean;
  duration: number;
  error?: string;
  screenshots: string[];
}

class PuppeteerTestRunner {
  private browser?: Browser;
  private results: TestResult[] = [];

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Puppeteer Test Runner...');
    
    // Create screenshots directory
    await this.ensureDirectoryExists('screenshots');
    await this.ensureDirectoryExists('test-reports');
    
    // Launch browser
    this.browser = await puppeteer.launch(PUPPETEER_CONFIG.BROWSER_OPTIONS);
    console.log('✅ Browser launched successfully');
  }

  async runAllTests(): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    console.log('🧪 Running Puppeteer E2E Tests...');
    
    const testFiles = [
      'tests/homepage.test.ts',
      'tests/authentication.test.ts', 
      'tests/dashboard.test.ts',
    ];

    for (const testFile of testFiles) {
      await this.runTestFile(testFile);
    }
  }

  private async runTestFile(testFile: string): Promise<void> {
    console.log(`\n📝 Running ${testFile}...`);
    const startTime = Date.now();
    
    try {
      // Run the test file using vitest
      const command = `npx vitest run ${testFile} --reporter=json`;
      const output = execSync(command, { 
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      
      this.results.push({
        testFile,
        passed: true,
        duration,
        screenshots: [], // Would be populated by actual test run
      });
      
      console.log(`✅ ${testFile} passed (${duration}ms)`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.results.push({
        testFile,
        passed: false,
        duration,
        error: errorMessage,
        screenshots: [],
      });
      
      console.error(`❌ ${testFile} failed (${duration}ms):`, errorMessage);
    }
  }

  async generateReport(): Promise<void> {
    console.log('\n📊 Generating test report...');
    
    const report = await TestHelpers.generateTestReport(this.results);
    const reportPath = path.join('test-reports', `e2e-report-${Date.now()}.json`);
    
    await fs.writeFile(reportPath, report);
    
    // Generate HTML report
    const htmlReport = this.generateHtmlReport();
    const htmlReportPath = path.join('test-reports', `e2e-report-${Date.now()}.html`);
    await fs.writeFile(htmlReportPath, htmlReport);
    
    console.log(`📄 Reports generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);
  }

  private generateHtmlReport(): string {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    const passRate = ((passed / total) * 100).toFixed(2);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TravelSync E2E Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .metric.passed { border-color: #4caf50; }
        .metric.failed { border-color: #f44336; }
        .test-result { margin: 10px 0; padding: 15px; border-radius: 8px; }
        .test-result.passed { background: #e8f5e8; border-left: 4px solid #4caf50; }
        .test-result.failed { background: #ffeaea; border-left: 4px solid #f44336; }
        .error { background: #fff; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 TravelSync E2E Test Report</h1>
        <p>Generated: ${new Date().toISOString()}</p>
        <p>Test Environment: ${PUPPETEER_CONFIG.BASE_URL}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <p style="font-size: 2em; margin: 0;">${total}</p>
        </div>
        <div class="metric passed">
            <h3>Passed</h3>
            <p style="font-size: 2em; margin: 0; color: #4caf50;">${passed}</p>
        </div>
        <div class="metric failed">
            <h3>Failed</h3>
            <p style="font-size: 2em; margin: 0; color: #f44336;">${failed}</p>
        </div>
        <div class="metric">
            <h3>Pass Rate</h3>
            <p style="font-size: 2em; margin: 0;">${passRate}%</p>
        </div>
    </div>

    <div class="results">
        <h2>Test Results</h2>
        ${this.results.map(result => `
            <div class="test-result ${result.passed ? 'passed' : 'failed'}">
                <h3>${result.passed ? '✅' : '❌'} ${result.testFile}</h3>
                <p>Duration: ${result.duration}ms</p>
                ${result.error ? `<div class="error">${result.error}</div>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }

  private async ensureDirectoryExists(dir: string): Promise<void> {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    const passRate = ((passed / total) * 100).toFixed(2);

    console.log('\n📈 Test Summary:');
    console.log(`   Total: ${total}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Pass Rate: ${passRate}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`   - ${result.testFile}: ${result.error}`);
      });
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const runner = new PuppeteerTestRunner();
  
  try {
    await runner.initialize();
    await runner.runAllTests();
    await runner.generateReport();
    runner.printSummary();
    
    const failedTests = runner.results.filter(r => !r.passed).length;
    process.exit(failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  } finally {
    await runner.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default PuppeteerTestRunner;
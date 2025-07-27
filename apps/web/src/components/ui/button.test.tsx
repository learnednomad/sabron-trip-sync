import { describe, test, expect } from 'vitest';

describe('Basic Test Suite', () => {
  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });

  test('arrays work correctly', () => {
    const items = ['apple', 'banana', 'cherry'];
    expect(items).toHaveLength(3);
    expect(items).toContain('banana');
  });

  test('string operations work', () => {
    const greeting = 'Hello World';
    expect(greeting).toMatch(/Hello/);
    expect(greeting.toLowerCase()).toBe('hello world');
  });
});
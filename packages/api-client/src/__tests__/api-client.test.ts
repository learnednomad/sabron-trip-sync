import { describe, it, expect, vi } from 'vitest';
import { ApiClient } from '../index';
import axios from 'axios';

vi.mock('axios');

describe('ApiClient', () => {
  const baseURL = 'http://localhost:3000';
  const client = new ApiClient(baseURL);

  it('initializes with correct configuration', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  });

  it('adds authorization header when token exists', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-token');
    const config = { method: 'GET', url: '/test' };
    await client.request(config);
    expect(axios.create().request).toHaveBeenCalledWith({
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer test-token',
      },
    });
  });

  it('handles successful response', async () => {
    const mockResponse = { data: { id: '1' }, headers: { 'x-request-id': '123' } };
    vi.spyOn(axios.create(), 'request').mockResolvedValue(mockResponse);
    const response = await client.get('/test');
    expect(response).toEqual({
      success: true,
      data: mockResponse.data,
      metadata: {
        requestId: '123',
        timestamp: expect.any(String),
        version: '1.0.0',
      },
    });
  });

  it('handles error response', async () => {
    const mockError = {
      response: { status: 400, data: { code: 'BAD_REQUEST', message: 'Invalid input' } },
    };
    vi.spyOn(axios.create(), 'request').mockRejectedValue(mockError);
    const response = await client.get('/test');
    expect(response).toEqual({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        details: undefined,
        stack: expect.any(String),
        statusCode: 400,
        timestamp: expect.any(String),
      },
    });
  });
});

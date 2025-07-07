import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';
import { useItineraries, useCreateItinerary } from '../hooks';
import { apiClient } from '../index';

vi.mock('../index', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('API Hooks', () => {
  it('fetches itineraries', async () => {
    const mockData = {
      success: true,
      items: [{ id: '1', title: 'Test Trip' }],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasMore: false },
    };
    vi.spyOn(apiClient, 'get').mockResolvedValue(mockData);

    const { result, waitFor } = renderHook(() => useItineraries(), { wrapper });

    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual(mockData);
    expect(apiClient.get).toHaveBeenCalledWith('/itineraries', { params: { page: 1, limit: 20 } });
  });

  it('creates an itinerary', async () => {
    const mockItinerary = { id: '1', title: 'New Trip' };
    vi.spyOn(apiClient, 'post').mockResolvedValue({ success: true, data: mockItinerary });

    const { result, waitFor } = renderHook(() => useCreateItinerary(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ title: 'New Trip', destinations: [], dateRange: { start: '', end: '' } });
    });

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockItinerary);
  });
});

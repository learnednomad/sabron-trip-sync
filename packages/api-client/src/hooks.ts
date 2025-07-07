import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './index';
import type {
  Itinerary,
  PaginatedResponse,
  Activity,
} from '@sabron/types';
import { 
  CreateItinerarySchema, 
  UpdateItinerarySchema, 
  CreateActivitySchema, 
  UpdateActivitySchema,
  SearchItinerariesSchema,
  SearchActivitiesSchema,
  type CreateItinerary,
  type UpdateItinerary,
  type SearchItineraries,
  type CreateActivity,
  type UpdateActivity,
  type SearchActivities,
} from '@sabron/validation';

// Itinerary hooks
export function useItineraries(params: SearchItineraries = { offset: 0, limit: 20, sortBy: 'updatedAt', sortOrder: 'desc' }) {
  return useQuery<PaginatedResponse<Itinerary>, Error>({
    queryKey: ['itineraries', params],
    queryFn: async () => {
      const validatedParams = SearchItinerariesSchema.parse(params);
      const response = await apiClient.get<PaginatedResponse<Itinerary>>('/itineraries', { params: validatedParams });
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch itineraries');
      }
      return response.data!;
    },
  });
}

export function useItinerary(id: string) {
  return useQuery<Itinerary, Error>({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      const response = await apiClient.get<Itinerary>(`/itineraries/${id}`);
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    },
  });
}

export function useCreateItinerary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateItinerary) => {
      const validatedData = CreateItinerarySchema.parse(data);
      const response = await apiClient.post<Itinerary>('/itineraries', validatedData);
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
    },
  });
}

export function useUpdateItinerary(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateItinerary) => {
      const validatedData = UpdateItinerarySchema.parse(data);
      const response = await apiClient.patch<Itinerary>(`/itineraries/${id}`, validatedData);
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['itinerary', id] });
    },
  });
}

// Activity hooks
export function useActivities(itineraryId: string, params: SearchActivities = { limit: 20, offset: 0, sortBy: 'startTime', sortOrder: 'asc' }) {
  return useQuery<PaginatedResponse<Activity>, Error>({
    queryKey: ['activities', itineraryId, params],
    queryFn: async () => {
      const validatedParams = SearchActivitiesSchema.parse(params);
      const response = await apiClient.get<PaginatedResponse<Activity>>(
        `/itineraries/${itineraryId}/activities`,
        { params: validatedParams }
      );
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch activities');
      }
      return response.data!;
    },
  });
}

export function useActivity(id: string) {
  return useQuery<Activity, Error>({
    queryKey: ['activity', id],
    queryFn: async () => {
      const response = await apiClient.get<Activity>(`/activities/${id}`);
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    },
  });
}

export function useCreateActivity(itineraryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateActivity) => {
      const validatedData = CreateActivitySchema.parse(data);
      const response = await apiClient.post<Activity>(
        `/itineraries/${itineraryId}/activities`,
        validatedData
      );
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', itineraryId] });
    },
  });
}

export function useUpdateActivity(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateActivity) => {
      const validatedData = UpdateActivitySchema.parse(data);
      const response = await apiClient.patch<Activity>(`/activities/${id}`, validatedData);
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
    },
  });
}

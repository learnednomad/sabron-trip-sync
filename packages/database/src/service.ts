import { supabase } from './index';
import type {
  User,
  Itinerary,
  Activity,
  Transaction as Expense,
  UserProfile,
  UserPreferences,
  UserSettings,
} from '@sabron/types';

import {
  mapUserWithProfileToUser,
  mapUserRowToUser,
  mapItineraryWithDetailsToItinerary,
  mapItineraryRowToItinerary,
  mapActivityRowToActivity,
  mapExpenseRowToExpense,
  mapUserToUserInsert,
  mapItineraryToItineraryInsert,
  mapActivityToActivityInsert,
  mapExpenseToExpenseInsert,
} from './mappers';

import type {
  CreateResult,
  UpdateResult,
  DeleteResult,
  FetchResult,
  FetchSingleResult,
  UserInsert,
  UserUpdate,
  ItineraryInsert,
  ItineraryUpdate,
  ActivityInsert,
  ActivityUpdate,
  ExpenseInsert,
  ExpenseUpdate,
} from './helpers';

/**
 * High-level service layer that provides typed application objects
 * This layer bridges database operations with application types
 */

// User service
export const userService = {
  async getById(id: string): Promise<FetchSingleResult<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return {
      data: data ? mapUserRowToUser(data) : null,
      error,
    };
  },

  async getByEmail(email: string): Promise<FetchSingleResult<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return {
      data: data ? mapUserRowToUser(data) : null,
      error,
    };
  },

  async getWithProfile(id: string): Promise<FetchSingleResult<User & {
    profile?: UserProfile;
    preferences?: UserPreferences;
    settings?: UserSettings;
  }>> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_profiles (*),
        user_preferences (*),
        user_settings (*),
        user_subscriptions (*)
      `)
      .eq('id', id)
      .single();
    
    return {
      data: data ? mapUserWithProfileToUser(data as any) : null,
      error,
    };
  },

  async create(userData: Partial<User>): Promise<CreateResult<User>> {
    const insertData = mapUserToUserInsert(userData) as UserInsert;
    
    const { data, error } = await supabase
      .from('users')
      .insert(insertData)
      .select()
      .single();
    
    return {
      data: data ? mapUserRowToUser(data) : null,
      error,
    };
  },

  async update(id: string, userData: Partial<User>): Promise<UpdateResult<User>> {
    const updateData = mapUserToUserInsert(userData) as UserUpdate;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    return {
      data: data ? mapUserRowToUser(data) : null,
      error,
    };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { error, count } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async search(query: string, limit = 10): Promise<FetchResult<User>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(limit);
    
    return {
      data: data ? data.map(mapUserRowToUser) : null,
      error,
    };
  },
};

// Itinerary service
export const itineraryService = {
  async getById(id: string): Promise<FetchSingleResult<Itinerary>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();
    
    return {
      data: data ? mapItineraryRowToItinerary(data) : null,
      error,
    };
  },

  async getWithDetails(id: string): Promise<FetchSingleResult<Itinerary>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        activities (*),
        accommodations (*),
        transportation (*),
        budgets (*),
        collaborators (*, users (*)),
        travelers (*)
      `)
      .eq('id', id)
      .single();
    
    return {
      data: data ? mapItineraryWithDetailsToItinerary(data as any) : null,
      error,
    };
  },

  async getByUserId(userId: string, limit = 20): Promise<FetchResult<Itinerary>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return {
      data: data ? data.map(mapItineraryRowToItinerary) : null,
      error,
    };
  },

  async create(itineraryData: Partial<Itinerary>): Promise<CreateResult<Itinerary>> {
    const insertData = mapItineraryToItineraryInsert(itineraryData) as ItineraryInsert;
    
    const { data, error } = await supabase
      .from('itineraries')
      .insert(insertData)
      .select()
      .single();
    
    return {
      data: data ? mapItineraryRowToItinerary(data) : null,
      error,
    };
  },

  async update(id: string, itineraryData: Partial<Itinerary>): Promise<UpdateResult<Itinerary>> {
    const updateData = mapItineraryToItineraryInsert(itineraryData) as ItineraryUpdate;
    
    const { data, error } = await supabase
      .from('itineraries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    return {
      data: data ? mapItineraryRowToItinerary(data) : null,
      error,
    };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { error, count } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async getShared(shareToken: string): Promise<FetchSingleResult<Itinerary>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('share_token', shareToken)
      .single();
    
    return {
      data: data ? mapItineraryRowToItinerary(data) : null,
      error,
    };
  },

  async search(query: string, limit = 10): Promise<FetchResult<Itinerary>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,destination.ilike.%${query}%`)
      .eq('visibility', 'public')
      .limit(limit);
    
    return {
      data: data ? data.map(mapItineraryRowToItinerary) : null,
      error,
    };
  },
};

// Activity service
export const activityService = {
  async getById(id: string): Promise<FetchSingleResult<Activity>> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();
    
    return {
      data: data ? mapActivityRowToActivity(data) : null,
      error,
    };
  },

  async getByItineraryId(itineraryId: string): Promise<FetchResult<Activity>> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('start_time', { ascending: true });
    
    return {
      data: data ? data.map(mapActivityRowToActivity) : null,
      error,
    };
  },

  async create(activityData: Partial<Activity>): Promise<CreateResult<Activity>> {
    const insertData = mapActivityToActivityInsert(activityData) as ActivityInsert;
    
    const { data, error } = await supabase
      .from('activities')
      .insert(insertData)
      .select()
      .single();
    
    return {
      data: data ? mapActivityRowToActivity(data) : null,
      error,
    };
  },

  async update(id: string, activityData: Partial<Activity>): Promise<UpdateResult<Activity>> {
    const updateData = mapActivityToActivityInsert(activityData) as ActivityUpdate;
    
    const { data, error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    return {
      data: data ? mapActivityRowToActivity(data) : null,
      error,
    };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { error, count } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async getByLocation(latitude: number, longitude: number, radius = 5000): Promise<FetchResult<Activity>> {
    // Note: This would require a PostGIS extension for proper geospatial queries
    // For now, using a simple bounding box approach
    const latDelta = radius / 111000; // Rough conversion: 1 degree ≈ 111km
    const lngDelta = radius / (111000 * Math.cos(latitude * Math.PI / 180));
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .gte('latitude', latitude - latDelta)
      .lte('latitude', latitude + latDelta)
      .gte('longitude', longitude - lngDelta)
      .lte('longitude', longitude + lngDelta)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    return {
      data: data ? data.map(mapActivityRowToActivity) : null,
      error,
    };
  },
};

// Expense service
export const expenseService = {
  async getById(id: string): Promise<FetchSingleResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    
    return {
      data: data ? mapExpenseRowToExpense(data) : null,
      error,
    };
  },

  async getByItineraryId(itineraryId: string): Promise<FetchResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('created_at', { ascending: false });
    
    return {
      data: data ? data.map(mapExpenseRowToExpense) : null,
      error,
    };
  },

  async getByUserId(userId: string, limit = 50): Promise<FetchResult<Expense>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return {
      data: data ? data.map(mapExpenseRowToExpense) : null,
      error,
    };
  },

  async create(expenseData: Partial<Expense>): Promise<CreateResult<Expense>> {
    const insertData = mapExpenseToExpenseInsert(expenseData) as ExpenseInsert;
    
    const { data, error } = await supabase
      .from('expenses')
      .insert(insertData)
      .select()
      .single();
    
    return {
      data: data ? mapExpenseRowToExpense(data) : null,
      error,
    };
  },

  async update(id: string, expenseData: Partial<Expense>): Promise<UpdateResult<Expense>> {
    const updateData = mapExpenseToExpenseInsert(expenseData) as ExpenseUpdate;
    
    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    return {
      data: data ? mapExpenseRowToExpense(data) : null,
      error,
    };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { error, count } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async getTotalByItinerary(itineraryId: string): Promise<FetchSingleResult<{ total: number; currency: string }>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, currency')
      .eq('itinerary_id', itineraryId)
      .is('deleted_at', null);
    
    if (error) return { data: null, error };
    
    // Group by currency and sum amounts
    const totals = data?.reduce((acc, expense) => {
      const currency = expense.currency || 'USD';
      acc[currency] = (acc[currency] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // For simplicity, return the first currency total
    const firstCurrency = Object.keys(totals)[0];
    const total = firstCurrency ? totals[firstCurrency] : 0;
    
    return { 
      data: { 
        total, 
        currency: firstCurrency || 'USD' 
      }, 
      error: null 
    };
  },
};

// Analytics service (using application types)
export const analyticsService = {
  async getUserStats(userId: string) {
    const [itinerariesResult, expensesResult] = await Promise.all([
      supabase.from('itineraries').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('expenses').select('amount, currency').eq('user_id', userId),
    ]);

    const totalExpenses = expensesResult.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    return {
      itinerariesCount: itinerariesResult.count || 0,
      totalExpenses,
      error: itinerariesResult.error || expensesResult.error,
    };
  },

  async getItineraryStats(itineraryId: string) {
    const [activitiesResult, expensesResult, collaboratorsResult] = await Promise.all([
      supabase.from('activities').select('id', { count: 'exact' }).eq('itinerary_id', itineraryId),
      supabase.from('expenses').select('amount, currency').eq('itinerary_id', itineraryId),
      supabase.from('collaborators').select('id', { count: 'exact' }).eq('itinerary_id', itineraryId),
    ]);

    const totalExpenses = expensesResult.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    return {
      activitiesCount: activitiesResult.count || 0,
      totalExpenses,
      collaboratorsCount: collaboratorsResult.count || 0,
      error: activitiesResult.error || expensesResult.error || collaboratorsResult.error,
    };
  },
};

// Realtime subscriptions (using application types)
export const realtimeService = {
  subscribeToItinerary(itineraryId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`itinerary-${itineraryId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activities',
        filter: `itinerary_id=eq.${itineraryId}`,
      }, (payload) => {
        // Map the payload data to application types before calling callback
        if (payload.new) {
          callback({
            ...payload,
            new: mapActivityRowToActivity(payload.new as any),
          });
        } else {
          callback(payload);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `itinerary_id=eq.${itineraryId}`,
      }, (payload) => {
        // Map the payload data to application types before calling callback
        if (payload.new) {
          callback({
            ...payload,
            new: mapExpenseRowToExpense(payload.new as any),
          });
        } else {
          callback(payload);
        }
      })
      .subscribe();
  },

  subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, callback)
      .subscribe();
  },

  subscribeToChatRoom(chatRoomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat-${chatRoomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_room_id=eq.${chatRoomId}`,
      }, callback)
      .subscribe();
  },
};
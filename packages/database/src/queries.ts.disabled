import { supabase } from './index';
import type {
  UserWithProfile,
  ItineraryWithDetails,
  ActivityWithDetails,
  ExpenseWithSplits,
  PostWithEngagement,
  ChatRoomWithMembers,
  CreateResult,
  UpdateResult,
  DeleteResult,
  FetchResult,
  FetchSingleResult,
  UserRow,
  UserInsert,
  UserUpdate,
  ItineraryRow,
  ItineraryInsert,
  ItineraryUpdate,
  ActivityRow,
  ActivityInsert,
  ActivityUpdate,
  ExpenseRow,
  ExpenseInsert,
  ExpenseUpdate,
} from './helpers';

// User queries
export const userQueries = {
  async getById(id: string): Promise<FetchSingleResult<UserRow>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getByEmail(email: string): Promise<FetchSingleResult<UserRow>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return { data, error };
  },

  async getWithProfile(id: string): Promise<FetchSingleResult<UserWithProfile>> {
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
    
    return { data, error };
  },

  async create(userData: UserInsert): Promise<CreateResult<UserRow>> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    return { data, error };
  },

  async update(id: string, userData: UserUpdate): Promise<UpdateResult<UserRow>> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { data, error, count } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async search(query: string, limit = 10): Promise<FetchResult<UserRow>> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(limit);
    
    return { data, error };
  },
};

// Itinerary queries
export const itineraryQueries = {
  async getById(id: string): Promise<FetchSingleResult<ItineraryRow>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getWithDetails(id: string): Promise<FetchSingleResult<ItineraryWithDetails>> {
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
    
    return { data, error };
  },

  async getByUserId(userId: string, limit = 20): Promise<FetchResult<ItineraryRow>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async create(itineraryData: ItineraryInsert): Promise<CreateResult<ItineraryRow>> {
    const { data, error } = await supabase
      .from('itineraries')
      .insert(itineraryData)
      .select()
      .single();
    
    return { data, error };
  },

  async update(id: string, itineraryData: ItineraryUpdate): Promise<UpdateResult<ItineraryRow>> {
    const { data, error } = await supabase
      .from('itineraries')
      .update(itineraryData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { data, error, count } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async getShared(shareToken: string): Promise<FetchSingleResult<ItineraryRow>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('share_token', shareToken)
      .single();
    
    return { data, error };
  },

  async search(query: string, limit = 10): Promise<FetchResult<ItineraryRow>> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,destination.ilike.%${query}%`)
      .eq('visibility', 'public')
      .limit(limit);
    
    return { data, error };
  },
};

// Activity queries
export const activityQueries = {
  async getById(id: string): Promise<FetchSingleResult<ActivityRow>> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getWithDetails(id: string): Promise<FetchSingleResult<ActivityWithDetails>> {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        itineraries (*),
        expenses (*),
        travel_log_entries (*)
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getByItineraryId(itineraryId: string): Promise<FetchResult<ActivityRow>> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('start_time', { ascending: true });
    
    return { data, error };
  },

  async create(activityData: ActivityInsert): Promise<CreateResult<ActivityRow>> {
    const { data, error } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single();
    
    return { data, error };
  },

  async update(id: string, activityData: ActivityUpdate): Promise<UpdateResult<ActivityRow>> {
    const { data, error } = await supabase
      .from('activities')
      .update(activityData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { data, error, count } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async getByLocation(latitude: number, longitude: number, radius = 5000): Promise<FetchResult<ActivityRow>> {
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
    
    return { data, error };
  },
};

// Expense queries
export const expenseQueries = {
  async getById(id: string): Promise<FetchSingleResult<ExpenseRow>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getWithSplits(id: string): Promise<FetchSingleResult<ExpenseWithSplits>> {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits (*, users (*))
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async getByItineraryId(itineraryId: string): Promise<FetchResult<ExpenseRow>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getByUserId(userId: string, limit = 50): Promise<FetchResult<ExpenseRow>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async create(expenseData: ExpenseInsert): Promise<CreateResult<ExpenseRow>> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expenseData)
      .select()
      .single();
    
    return { data, error };
  },

  async update(id: string, expenseData: ExpenseUpdate): Promise<UpdateResult<ExpenseRow>> {
    const { data, error } = await supabase
      .from('expenses')
      .update(expenseData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string): Promise<DeleteResult> {
    const { error, count } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    return { data: { count: count || 0 }, error };
  },

  async getTotalByItinerary(itineraryId: string): Promise<FetchSingleResult<{ total: number }>> {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('itinerary_id', itineraryId)
      .is('deleted_at', null);
    
    if (error) return { data: null, error };
    
    const total = data?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
    return { data: { total }, error: null };
  },
};

// Analytics queries
export const analyticsQueries = {
  async getUserStats(userId: string) {
    const [itineraries, activities, expenses] = await Promise.all([
      supabase.from('itineraries').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('activities').select('id', { count: 'exact' }).eq('itinerary_id', userId),
      supabase.from('expenses').select('amount').eq('user_id', userId),
    ]);

    const totalExpenses = expenses.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    return {
      itinerariesCount: itineraries.count || 0,
      activitiesCount: activities.count || 0,
      totalExpenses,
      error: itineraries.error || activities.error || expenses.error,
    };
  },

  async getItineraryStats(itineraryId: string) {
    const [activities, expenses, collaborators] = await Promise.all([
      supabase.from('activities').select('id', { count: 'exact' }).eq('itinerary_id', itineraryId),
      supabase.from('expenses').select('amount').eq('itinerary_id', itineraryId),
      supabase.from('collaborators').select('id', { count: 'exact' }).eq('itinerary_id', itineraryId),
    ]);

    const totalExpenses = expenses.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    return {
      activitiesCount: activities.count || 0,
      totalExpenses,
      collaboratorsCount: collaborators.count || 0,
      error: activities.error || expenses.error || collaborators.error,
    };
  },
};

// Realtime subscriptions
export const subscriptions = {
  subscribeToItinerary(itineraryId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`itinerary-${itineraryId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activities',
        filter: `itinerary_id=eq.${itineraryId}`,
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'expenses',
        filter: `itinerary_id=eq.${itineraryId}`,
      }, callback)
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
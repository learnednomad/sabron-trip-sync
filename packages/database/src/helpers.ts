import type { Database, Tables, TablesInsert, TablesUpdate } from './types';

// Database table helpers with proper typing
export type Row<T extends keyof Database['public']['Tables']> = Tables<T>;
export type InsertData<T extends keyof Database['public']['Tables']> = TablesInsert<T>;
export type UpdateData<T extends keyof Database['public']['Tables']> = TablesUpdate<T>;

// Specific table type helpers
export type UserRow = Row<'users'>;
export type UserInsert = InsertData<'users'>;
export type UserUpdate = UpdateData<'users'>;

export type ItineraryRow = Row<'itineraries'>;
export type ItineraryInsert = InsertData<'itineraries'>;
export type ItineraryUpdate = UpdateData<'itineraries'>;

export type ActivityRow = Row<'activities'>;
export type ActivityInsert = InsertData<'activities'>;
export type ActivityUpdate = UpdateData<'activities'>;

export type AccommodationRow = Row<'accommodations'>;
export type AccommodationInsert = InsertData<'accommodations'>;
export type AccommodationUpdate = UpdateData<'accommodations'>;

export type TransportationRow = Row<'transportation'>;
export type TransportationInsert = InsertData<'transportation'>;
export type TransportationUpdate = UpdateData<'transportation'>;

export type ExpenseRow = Row<'expenses'>;
export type ExpenseInsert = InsertData<'expenses'>;
export type ExpenseUpdate = UpdateData<'expenses'>;

export type ExpenseSplitRow = Row<'expense_splits'>;
export type ExpenseSplitInsert = InsertData<'expense_splits'>;
export type ExpenseSplitUpdate = UpdateData<'expense_splits'>;

export type BudgetRow = Row<'budgets'>;
export type BudgetInsert = InsertData<'budgets'>;
export type BudgetUpdate = UpdateData<'budgets'>;

export type CollaboratorRow = Row<'collaborators'>;
export type CollaboratorInsert = InsertData<'collaborators'>;
export type CollaboratorUpdate = UpdateData<'collaborators'>;

export type TravelerRow = Row<'travelers'>;
export type TravelerInsert = InsertData<'travelers'>;
export type TravelerUpdate = UpdateData<'travelers'>;

export type ReviewRow = Row<'reviews'>;
export type ReviewInsert = InsertData<'reviews'>;
export type ReviewUpdate = UpdateData<'reviews'>;

export type PostRow = Row<'posts'>;
export type PostInsert = InsertData<'posts'>;
export type PostUpdate = UpdateData<'posts'>;

export type CommentRow = Row<'comments'>;
export type CommentInsert = InsertData<'comments'>;
export type CommentUpdate = UpdateData<'comments'>;

export type LikeRow = Row<'likes'>;
export type LikeInsert = InsertData<'likes'>;
export type LikeUpdate = UpdateData<'likes'>;

export type FollowRow = Row<'follows'>;
export type FollowInsert = InsertData<'follows'>;
export type FollowUpdate = UpdateData<'follows'>;

export type BlockRow = Row<'blocks'>;
export type BlockInsert = InsertData<'blocks'>;
export type BlockUpdate = UpdateData<'blocks'>;

export type ReportRow = Row<'reports'>;
export type ReportInsert = InsertData<'reports'>;
export type ReportUpdate = UpdateData<'reports'>;

export type NotificationRow = Row<'notifications'>;
export type NotificationInsert = InsertData<'notifications'>;
export type NotificationUpdate = UpdateData<'notifications'>;

export type MessageRow = Row<'messages'>;
export type MessageInsert = InsertData<'messages'>;
export type MessageUpdate = UpdateData<'messages'>;

export type ChatRoomRow = Row<'chat_rooms'>;
export type ChatRoomInsert = InsertData<'chat_rooms'>;
export type ChatRoomUpdate = UpdateData<'chat_rooms'>;

export type ChatRoomMemberRow = Row<'chat_room_members'>;
export type ChatRoomMemberInsert = InsertData<'chat_room_members'>;
export type ChatRoomMemberUpdate = UpdateData<'chat_room_members'>;

export type LocationRow = Row<'locations'>;
export type LocationInsert = InsertData<'locations'>;
export type LocationUpdate = UpdateData<'locations'>;

export type CountryRow = Row<'countries'>;
export type CountryInsert = InsertData<'countries'>;
export type CountryUpdate = UpdateData<'countries'>;

export type CurrencyRow = Row<'currencies'>;
export type CurrencyInsert = InsertData<'currencies'>;
export type CurrencyUpdate = UpdateData<'currencies'>;

export type EmbassyRow = Row<'embassies'>;
export type EmbassyInsert = InsertData<'embassies'>;
export type EmbassyUpdate = UpdateData<'embassies'>;

export type TravelAdvisoryRow = Row<'travel_advisories'>;
export type TravelAdvisoryInsert = InsertData<'travel_advisories'>;
export type TravelAdvisoryUpdate = UpdateData<'travel_advisories'>;

export type VisaRequirementRow = Row<'visa_requirements'>;
export type VisaRequirementInsert = InsertData<'visa_requirements'>;
export type VisaRequirementUpdate = UpdateData<'visa_requirements'>;

export type VisaApplicationRow = Row<'visa_applications'>;
export type VisaApplicationInsert = InsertData<'visa_applications'>;
export type VisaApplicationUpdate = UpdateData<'visa_applications'>;

export type CulturalTipRow = Row<'cultural_tips'>;
export type CulturalTipInsert = InsertData<'cultural_tips'>;
export type CulturalTipUpdate = UpdateData<'cultural_tips'>;

export type TravelLogEntryRow = Row<'travel_log_entries'>;
export type TravelLogEntryInsert = InsertData<'travel_log_entries'>;
export type TravelLogEntryUpdate = UpdateData<'travel_log_entries'>;

export type BookingRow = Row<'bookings'>;
export type BookingInsert = InsertData<'bookings'>;
export type BookingUpdate = UpdateData<'bookings'>;

export type PaymentRow = Row<'payments'>;
export type PaymentInsert = InsertData<'payments'>;
export type PaymentUpdate = UpdateData<'payments'>;

export type PriceAlertRow = Row<'price_alerts'>;
export type PriceAlertInsert = InsertData<'price_alerts'>;
export type PriceAlertUpdate = UpdateData<'price_alerts'>;

export type EmergencyContactRow = Row<'emergency_contacts'>;
export type EmergencyContactInsert = InsertData<'emergency_contacts'>;
export type EmergencyContactUpdate = UpdateData<'emergency_contacts'>;

export type UserProfileRow = Row<'user_profiles'>;
export type UserProfileInsert = InsertData<'user_profiles'>;
export type UserProfileUpdate = UpdateData<'user_profiles'>;

export type UserPreferencesRow = Row<'user_preferences'>;
export type UserPreferencesInsert = InsertData<'user_preferences'>;
export type UserPreferencesUpdate = UpdateData<'user_preferences'>;

export type UserSettingsRow = Row<'user_settings'>;
export type UserSettingsInsert = InsertData<'user_settings'>;
export type UserSettingsUpdate = UpdateData<'user_settings'>;

export type UserSubscriptionRow = Row<'user_subscriptions'>;
export type UserSubscriptionInsert = InsertData<'user_subscriptions'>;
export type UserSubscriptionUpdate = UpdateData<'user_subscriptions'>;

export type UserAnalyticsRow = Row<'user_analytics'>;
export type UserAnalyticsInsert = InsertData<'user_analytics'>;
export type UserAnalyticsUpdate = UpdateData<'user_analytics'>;

export type SessionRow = Row<'sessions'>;
export type SessionInsert = InsertData<'sessions'>;
export type SessionUpdate = UpdateData<'sessions'>;

export type AuditLogRow = Row<'audit_logs'>;
export type AuditLogInsert = InsertData<'audit_logs'>;
export type AuditLogUpdate = UpdateData<'audit_logs'>;

export type SupportTicketRow = Row<'support_tickets'>;
export type SupportTicketInsert = InsertData<'support_tickets'>;
export type SupportTicketUpdate = UpdateData<'support_tickets'>;

export type SupportMessageRow = Row<'support_messages'>;
export type SupportMessageInsert = InsertData<'support_messages'>;
export type SupportMessageUpdate = UpdateData<'support_messages'>;

export type TranslationRow = Row<'translations'>;
export type TranslationInsert = InsertData<'translations'>;
export type TranslationUpdate = UpdateData<'translations'>;

// Database query result helpers
export type DatabaseResult<T> = {
  data: T[] | null;
  error: Error | null;
  count?: number;
};

export type DatabaseSingleResult<T> = {
  data: T | null;
  error: Error | null;
};

// Common query patterns with proper typing
export type WithRelations<T, R = unknown> = T & R;

export type UserWithProfile = WithRelations<UserRow, {
  user_profiles: UserProfileRow | null;
  user_preferences: UserPreferencesRow | null;
  user_settings: UserSettingsRow | null;
  user_subscriptions: UserSubscriptionRow | null;
}>;

export type ItineraryWithDetails = WithRelations<ItineraryRow, {
  activities: ActivityRow[];
  accommodations: AccommodationRow[];
  transportation: TransportationRow[];
  budgets: BudgetRow | null;
  collaborators: (CollaboratorRow & { users: UserRow })[];
  travelers: TravelerRow[];
}>;

export type ActivityWithDetails = WithRelations<ActivityRow, {
  itinerary: ItineraryRow;
  expenses: ExpenseRow[];
  travel_log_entries: TravelLogEntryRow | null;
}>;

export type ExpenseWithSplits = WithRelations<ExpenseRow, {
  expense_splits: (ExpenseSplitRow & { user: UserRow })[];
}>;

export type PostWithEngagement = WithRelations<PostRow, {
  user: UserRow;
  comments: (CommentRow & { user: UserRow })[];
  likes: LikeRow[];
  activity?: ActivityRow | null;
  itinerary?: ItineraryRow | null;
}>;

export type ChatRoomWithMembers = WithRelations<ChatRoomRow, {
  chat_room_members: (ChatRoomMemberRow & { user: UserRow })[];
  messages: (MessageRow & { sender: UserRow })[];
}>;

// Utility types for better type safety
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Database operation result types
export type CreateResult<T> = DatabaseSingleResult<T>;
export type UpdateResult<T> = DatabaseSingleResult<T>;
export type DeleteResult = DatabaseSingleResult<{ count: number }>;
export type FetchResult<T> = DatabaseResult<T>;
export type FetchSingleResult<T> = DatabaseSingleResult<T>;
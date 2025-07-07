export interface Analytics {
  id: string;
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalItineraries: number;
  totalActivities: number;
  popularDestinations: string[];
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  event?: string;
  deviceType?: string;
}
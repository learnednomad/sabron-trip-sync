export interface Notification {
  id: string;
  userId: string;
  type: string;
  channel: string;
  status: string;
  priority: string;
  title: string;
  message: string;
  entity?: any;
  actions: any[];
  readAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationRequest {
  userId: string;
  type: string;
  channel: string;
  priority: string;
  title: string;
  message: string;
  entity?: any;
  actions?: any[];
  metadata?: any;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  categories: {
    itinerary: boolean;
    collaboration: boolean;
    booking: boolean;
    social: boolean;
    system: boolean;
  };
}

export interface NotificationFilter {
  status?: string;
  type?: string;
  priority?: string;
  readStatus?: 'read' | 'unread' | 'all';
  startDate?: Date;
  endDate?: Date;
}
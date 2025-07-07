export interface Review {
  id: string;
  userId: string;
  entityId: string;
  entityType: string;
  rating: number;
  title?: string;
  content: string;
  pros: string[];
  cons: string[];
  visitedAt: Date;
  images: any[];
  helpful: number;
  verified: boolean;
  response?: any;
  status: string;
  tags: string[];
  helpfulUsers: string[];
  reportedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  entityId: string;
  entityType: string;
  rating: number;
  title?: string;
  content: string;
  pros?: string[];
  cons?: string[];
  visitedAt: Date;
  images?: any[];
  tags?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
  visitedAt?: Date;
  images?: any[];
  tags?: string[];
}
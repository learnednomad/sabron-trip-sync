export interface Payment {
  id: string;
  userId: string;
  type: string;
  method: string;
  amount: {
    value: number;
    currency: string;
  };
  status: string;
  reference: any;
  paymentDetails: any;
  metadata?: any;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  type: string;
  method: string;
  amount: {
    value: number;
    currency: string;
  };
  paymentDetails: any;
  metadata?: any;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  name: string;
  details: any;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentStatus {
  pending: 'pending';
  processing: 'processing';
  completed: 'completed';
  failed: 'failed';
  cancelled: 'cancelled';
  refunded: 'refunded';
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason: string;
}
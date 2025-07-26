import { z } from 'zod';

import {
  IdSchema,
  MoneySchema,
  EmailSchema,
  CountryCodeSchema,
} from './common';

// Payment type
export const PaymentTypeSchema = z.enum([
  'purchase',
  'refund',
  'partial-refund',
  'authorization',
  'capture',
  'void',
  'chargeback',
]);

// Payment method
export const PaymentMethodSchema = z.enum([
  'credit-card',
  'debit-card',
  'bank-transfer',
  'digital-wallet',
  'buy-now-pay-later',
  'cryptocurrency',
  'gift-card',
  'loyalty-points',
]);

// Payment status
export const PaymentStatusSchema = z.enum([
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'refunded',
  'partially-refunded',
  'disputed',
]);

// Card brand
export const CardBrandSchema = z.enum([
  'visa',
  'mastercard',
  'amex',
  'discover',
  'diners',
  'jcb',
  'unionpay',
  'other',
]);

// Digital wallet type
export const WalletTypeSchema = z.enum([
  'apple-pay',
  'google-pay',
  'paypal',
  'venmo',
  'alipay',
  'wechat-pay',
]);

// Subscription status
export const SubscriptionStatusSchema = z.enum([
  'trialing',
  'active',
  'past-due',
  'cancelled',
  'expired',
  'paused',
]);

// Invoice status
export const InvoiceStatusSchema = z.enum([
  'draft',
  'open',
  'paid',
  'void',
  'uncollectible',
]);

// Billing address schema
export const BillingAddressSchema = z.object({
  name: z.string().min(1).max(200),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: CountryCodeSchema,
  phone: z.string().optional(),
  email: EmailSchema.optional(),
});

// Card details schema for payment
export const CardDetailsSchema = z.object({
  number: z.string().regex(/^\d{13,19}$/, 'Invalid card number'),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
  holderName: z.string().min(1).max(100),
});

// Bank account schema
export const BankAccountSchema = z.object({
  accountHolderName: z.string().min(1).max(200),
  accountNumber: z.string().min(1).max(34),
  routingNumber: z.string().optional(),
  swift: z.string().optional(),
  iban: z.string().optional(),
  bankName: z.string().min(1).max(100),
  bankAddress: BillingAddressSchema.optional(),
  accountType: z.enum(['checking', 'savings']).optional(),
});

// Create payment schema
export const CreatePaymentSchema = z.object({
  type: PaymentTypeSchema.default('purchase'),
  method: PaymentMethodSchema,
  amount: MoneySchema,
  currency: z.string().length(3),
  description: z.string().max(500).optional(),
  reference: z.object({
    orderId: IdSchema.optional(),
    bookingId: IdSchema.optional(),
    invoiceId: IdSchema.optional(),
    subscriptionId: IdSchema.optional(),
    externalId: z.string().optional(),
  }),
  paymentDetails: z.discriminatedUnion('method', [
    z.object({
      method: z.literal('credit-card'),
      card: CardDetailsSchema,
      billingAddress: BillingAddressSchema,
      saveCard: z.boolean().default(false),
      threeDSecure: z.boolean().default(true),
    }),
    z.object({
      method: z.literal('debit-card'),
      card: CardDetailsSchema,
      billingAddress: BillingAddressSchema,
      saveCard: z.boolean().default(false),
    }),
    z.object({
      method: z.literal('bank-transfer'),
      bankAccount: BankAccountSchema,
      transferType: z.enum(['ach', 'wire', 'sepa', 'local']),
    }),
    z.object({
      method: z.literal('digital-wallet'),
      walletType: WalletTypeSchema,
      token: z.string(),
      deviceId: z.string().optional(),
    }),
    z.object({
      method: z.literal('cryptocurrency'),
      currency: z.string(), // BTC, ETH, etc.
      walletAddress: z.string(),
      network: z.string().optional(),
    }),
  ]),
  metadata: z.record(z.unknown()).optional(),
});

// Process refund schema
export const ProcessRefundSchema = z.object({
  paymentId: IdSchema,
  amount: MoneySchema.optional(), // If not provided, full refund
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'customer-request',
    'product-not-received',
    'product-unacceptable',
    'cancellation',
    'other',
  ]),
  description: z.string().max(500).optional(),
  notify: z.boolean().default(true),
});

// Create subscription schema
export const CreateSubscriptionSchema = z.object({
  planId: IdSchema,
  paymentMethodId: IdSchema,
  trialDays: z.number().int().nonnegative().optional(),
  couponCode: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Update subscription schema
export const UpdateSubscriptionSchema = z.object({
  planId: IdSchema.optional(),
  paymentMethodId: IdSchema.optional(),
  autoRenew: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Cancel subscription schema
export const CancelSubscriptionSchema = z.object({
  reason: z.enum([
    'too-expensive',
    'not-using',
    'missing-features',
    'found-alternative',
    'quality-issues',
    'other',
  ]),
  feedback: z.string().max(1000).optional(),
  cancelImmediately: z.boolean().default(false),
});

// Add payment method schema
export const AddPaymentMethodSchema = z.object({
  type: PaymentMethodSchema,
  isDefault: z.boolean().default(false),
  details: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('credit-card'),
      card: CardDetailsSchema,
      billingAddress: BillingAddressSchema,
    }),
    z.object({
      type: z.literal('debit-card'),
      card: CardDetailsSchema,
      billingAddress: BillingAddressSchema,
    }),
    z.object({
      type: z.literal('bank-transfer'),
      bankAccount: BankAccountSchema,
    }),
    z.object({
      type: z.literal('digital-wallet'),
      walletType: WalletTypeSchema,
      email: EmailSchema,
      token: z.string(),
    }),
  ]),
});

// Update payment method schema
export const UpdatePaymentMethodSchema = z.object({
  isDefault: z.boolean().optional(),
  billingAddress: BillingAddressSchema.optional(),
  expiryMonth: z.number().int().min(1).max(12).optional(),
  expiryYear: z.number().int().min(new Date().getFullYear()).optional(),
});

// Payment intent schema (for payment processing)
export const CreatePaymentIntentSchema = z.object({
  amount: MoneySchema,
  currency: z.string().length(3),
  paymentMethodTypes: z.array(PaymentMethodSchema),
  setupFutureUsage: z.boolean().default(false),
  captureMethod: z.enum(['automatic', 'manual']).default('automatic'),
  description: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Confirm payment schema
export const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  paymentMethodId: z.string(),
  returnUrl: z.string().url().optional(),
  savePaymentMethod: z.boolean().default(false),
});

// Dispute evidence schema
export const DisputeEvidenceSchema = z.object({
  disputeId: IdSchema,
  evidence: z.object({
    productDescription: z.string().max(1000).optional(),
    customerCommunication: z.array(z.string().url()).optional(),
    receipt: z.string().url().optional(),
    shippingDocumentation: z.string().url().optional(),
    serviceDocumentation: z.string().url().optional(),
    cancellationPolicy: z.string().url().optional(),
    refundPolicy: z.string().url().optional(),
    accessActivityLog: z.string().url().optional(),
    duplicateChargeDocumentation: z.string().url().optional(),
    other: z.array(z.string().url()).optional(),
  }),
  response: z.string().max(5000),
});

// Payout schema
export const CreatePayoutSchema = z.object({
  amount: MoneySchema,
  currency: z.string().length(3),
  method: z.enum(['standard', 'instant']),
  description: z.string().max(500).optional(),
  statementDescriptor: z.string().max(22).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Tax information schema
export const TaxInfoSchema = z.object({
  type: z.enum(['individual', 'business']),
  country: CountryCodeSchema,
  taxId: z.string().optional(),
  vatNumber: z.string().optional(),
  exemptionCertificate: z.string().optional(),
  address: BillingAddressSchema,
});

// Export types
export type PaymentType = z.infer<typeof PaymentTypeSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type CardBrand = z.infer<typeof CardBrandSchema>;
export type WalletType = z.infer<typeof WalletTypeSchema>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;
export type BillingAddress = z.infer<typeof BillingAddressSchema>;
export type CardDetails = z.infer<typeof CardDetailsSchema>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type ProcessRefund = z.infer<typeof ProcessRefundSchema>;
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;
export type CancelSubscription = z.infer<typeof CancelSubscriptionSchema>;
export type AddPaymentMethod = z.infer<typeof AddPaymentMethodSchema>;
export type UpdatePaymentMethod = z.infer<typeof UpdatePaymentMethodSchema>;
export type CreatePaymentIntent = z.infer<typeof CreatePaymentIntentSchema>;
export type ConfirmPayment = z.infer<typeof ConfirmPaymentSchema>;
export type DisputeEvidence = z.infer<typeof DisputeEvidenceSchema>;
export type CreatePayout = z.infer<typeof CreatePayoutSchema>;
export type TaxInfo = z.infer<typeof TaxInfoSchema>;

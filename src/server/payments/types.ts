export interface CheckoutSessionOptions {
  orderId: string;
  orderNumber: string;
  amountCents: number;
  currency: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  itemsDescription: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderId: string;
  paymentId?: string;
  amountCents: number;
  currency: string;
  isSuccess: boolean;
  statusCode: number;
  rawPayload: Record<string, any>;
  errorMessage?: string;
}

export interface PaymentProvider {
  name: string;
  createCheckout(options: CheckoutSessionOptions): Promise<{
    actionUrl: string;
    fields: Record<string, string>;
  }>;
  verifyWebhook(payload: Record<string, any>): Promise<WebhookVerificationResult>;
}

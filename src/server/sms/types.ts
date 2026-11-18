export interface SendSmsOptions {
  recipient: string; // Phone number e.g. "+94718008533" or "0718008533"
  message: string;
}

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  errorMessage?: string;
}

export interface SmsProvider {
  name: string;
  sendSms(options: SendSmsOptions): Promise<SendSmsResult>;
  sendOtp(phoneNumber: string, otpCode: string): Promise<SendSmsResult>;
}

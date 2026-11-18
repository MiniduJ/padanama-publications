import { SendSmsOptions, SendSmsResult, SmsProvider } from "./types";

export class SmsLenzProvider implements SmsProvider {
  name = "SMS_LENZ";
  private apiKey: string;
  private senderId: string;
  private apiUrl: string;

  constructor(config?: { apiKey?: string; senderId?: string; apiUrl?: string }) {
    this.apiKey = config?.apiKey ?? process.env.SMSLENZ_API_KEY ?? "";
    this.senderId = config?.senderId ?? process.env.SMSLENZ_SENDER_ID ?? "Padanama";
    this.apiUrl = config?.apiUrl ?? "https://smslenz.lk/api/v1/sms/send";
  }

  /**
   * Normalizes local Sri Lankan numbers (0718008533 or 94718008533 -> 94718008533)
   */
  public normalizePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("94") && cleaned.length === 11) {
      return cleaned;
    }
    if (cleaned.startsWith("0") && cleaned.length === 10) {
      return `94${cleaned.slice(1)}`;
    }
    if (cleaned.length === 9) {
      return `94${cleaned}`;
    }
    return cleaned;
  }

  async sendSms(options: SendSmsOptions): Promise<SendSmsResult> {
    const normalizedPhone = this.normalizePhoneNumber(options.recipient);

    // Development or test fallback if no API key configured
    if (!this.apiKey || this.apiKey.includes("sample")) {
      console.log(`[SMS_LENZ:MOCK] To: ${normalizedPhone} | Sender: ${this.senderId} | Msg: "${options.message}"`);
      return {
        success: true,
        messageId: `mock-sms-${Date.now()}`,
      };
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          sender_id: this.senderId,
          to: normalizedPhone,
          message: options.message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          errorMessage: data?.message || `HTTP ${response.status}: SMS Lenz request failed`,
        };
      }

      return {
        success: true,
        messageId: data?.data?.message_id || data?.message_id || `lenz-${Date.now()}`,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error?.message || "Network error dispatching SMS via SMS Lenz",
      };
    }
  }

  async sendOtp(phoneNumber: string, otpCode: string): Promise<SendSmsResult> {
    const message = `Padanama Publications: Your verification code is ${otpCode}. Valid for 5 minutes. Do not share this code with anyone.`;
    return this.sendSms({ recipient: phoneNumber, message });
  }
}

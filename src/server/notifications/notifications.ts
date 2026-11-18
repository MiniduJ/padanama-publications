import { SmsLenzProvider } from "@/server/sms/smslenz";
import { formatLkr } from "@/lib/money";

export interface OrderNotificationParams {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  totalCents: number;
  paymentMethod: string;
  deliveryCity: string;
}

export interface DispatchNotificationParams {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  courierName: string;
  waybillNumber: string;
  trackingUrl: string;
}

export class NotificationEngine {
  private sms: SmsLenzProvider;

  constructor() {
    this.sms = new SmsLenzProvider();
  }

  /**
   * Dispatched upon order placement
   */
  async notifyOrderPlaced(params: OrderNotificationParams): Promise<boolean> {
    const totalFormatted = formatLkr(params.totalCents, "en");
    let message = "";

    if (params.paymentMethod === "CASH_ON_DELIVERY") {
      message = `Padanama Publications: Order ${params.orderNumber} confirmed. Total: ${totalFormatted} (COD). Delivery to ${params.deliveryCity} via Domex. Tracking will be sent once dispatched.`;
    } else if (params.paymentMethod === "BANK_TRANSFER") {
      message = `Padanama Publications: Order ${params.orderNumber} placed. Total: ${totalFormatted}. Please transfer to the bank account shown at checkout and upload your slip at padanamapublication.lk.`;
    } else {
      message = `Padanama Publications: Order ${params.orderNumber} received. Total: ${totalFormatted}. Thank you for choosing Sri Lanka's trusted book publisher.`;
    }

    const res = await this.sms.sendSms({
      recipient: params.phone,
      message,
    });

    return res.success;
  }

  /**
   * Dispatched when PayHere succeeds or Bank Slip is approved by admin
   */
  async notifyPaymentApproved(params: { orderNumber: string; phone: string; amountCents: number }): Promise<boolean> {
    const amount = formatLkr(params.amountCents, "en");
    const message = `Padanama Publications: Payment of ${amount} for Order ${params.orderNumber} is verified. Your books are being packed for courier dispatch.`;

    const res = await this.sms.sendSms({
      recipient: params.phone,
      message,
    });

    return res.success;
  }

  /**
   * Dispatched when order is handed over to Domex / Koombiyo
   */
  async notifyCourierDispatched(params: DispatchNotificationParams): Promise<boolean> {
    const message = `Padanama Publications: Order ${params.orderNumber} has been dispatched via ${params.courierName}! Tracking No: ${params.waybillNumber}. Track here: ${params.trackingUrl}`;

    const res = await this.sms.sendSms({
      recipient: params.phone,
      message,
    });

    return res.success;
  }

  /**
   * Dispatched for customer login / COD confirmation OTP
   */
  async notifyOtp(phone: string, otp: string): Promise<boolean> {
    const message = `Padanama Publications: Your verification code is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;

    const res = await this.sms.sendSms({
      recipient: phone,
      message,
    });

    return res.success;
  }
}

export const notificationEngine = new NotificationEngine();

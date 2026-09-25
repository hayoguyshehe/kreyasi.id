import crypto from "crypto";

// ============================================
// Midtrans Payment Gateway Helper
// ============================================

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const MIDTRANS_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com"
  : "https://app.sandbox.midtrans.com";

const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

interface SnapTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemName: string;
}

interface SnapResponse {
  token: string;
  redirect_url: string;
}

/**
 * Buat Snap Token untuk menampilkan popup pembayaran Midtrans.
 */
export async function createSnapTransaction(
  params: SnapTransactionParams
): Promise<SnapResponse> {
  const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone || "",
    },
    item_details: [
      {
        id: params.orderId,
        price: params.grossAmount,
        quantity: 1,
        name: params.itemName,
      },
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`,
    },
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${authString}`,
  };

  // Jika URL publik aktif (misal production atau tunnel ngrok), kirim notifikasi otomatis
  if (appUrl && !appUrl.includes("localhost") && !appUrl.includes("127.0.0.1")) {
    headers["X-Override-Notification"] = `${appUrl.replace(/\/$/, "")}/api/webhooks/midtrans`;
  }

  const response = await fetch(`${MIDTRANS_BASE_URL}/snap/v1/transactions`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Midtrans Snap error: ${response.status} - ${errorBody}`
    );
  }

  return response.json();
}

/**
 * Verifikasi signature webhook notification dari Midtrans.
 * Wajib diverifikasi sebelum mengubah status Order.
 *
 * Signature key = SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifyWebhookSignature(notification: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const { order_id, status_code, gross_amount, signature_key } = notification;

  const payload = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");

  return expectedSignature === signature_key;
}

/**
 * Buat signature valid untuk pengujian / internal verification
 */
export function generateWebhookSignature(notification: {
  order_id: string;
  status_code: string;
  gross_amount: string;
}): string {
  const { order_id, status_code, gross_amount } = notification;
  const payload = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
  return crypto.createHash("sha512").update(payload).digest("hex");
}

/**
 * Ambil status transaksi dari Midtrans API (untuk double-check).
 */
export async function getTransactionStatus(orderId: string) {
  const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const response = await fetch(
    `${MIDTRANS_API_URL}/v2/${orderId}/status`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Midtrans status check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Mapping status transaksi Midtrans ke OrderStatus internal.
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): "PAID" | "PENDING" | "FAILED" | "EXPIRED" {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "PAID" : "PENDING";
  }

  switch (transactionStatus) {
    case "settlement":
      return "PAID";
    case "pending":
      return "PENDING";
    case "deny":
    case "cancel":
      return "FAILED";
    case "expire":
      return "EXPIRED";
    default:
      return "PENDING";
  }
}

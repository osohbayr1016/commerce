import { env } from "./env";

const AUTH_PATH = "/auth/token";
const INVOICE_PATH = "/invoice";
const PAYMENT_CHECK_PATH = "/payment/check";

interface QpayTokenResponse {
  access_token: string;
  expires_in?: number;
  token_type?: string;
}

export interface QpayInvoiceRequest {
  amount: number;
  senderInvoiceNo: string;
  description: string;
  callbackUrl?: string;
  customerCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface QpayInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  urls?: {
    name?: string;
    description?: string;
    link?: string;
    logo?: string;
  }[];
}

async function getAccessToken(): Promise<string> {
  const url = `${env.qpay.baseUrl}${AUTH_PATH}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${env.qpay.clientId}:${env.qpay.clientSecret}`
      ).toString("base64")}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `QPay auth failed (${res.status}): ${text || res.statusText}`
    );
  }

  const data = (await res.json()) as QpayTokenResponse;

  if (!data.access_token) {
    throw new Error("QPay auth response missing access_token");
  }

  return data.access_token;
}

export async function createQpayInvoice(
  payload: QpayInvoiceRequest
): Promise<QpayInvoiceResponse> {
  const accessToken = await getAccessToken();

  const body = {
    invoice_code: env.qpay.invoiceCode,
    sender_invoice_no: payload.senderInvoiceNo,
    invoice_receiver_code: payload.customerCode || "terminal",
    invoice_receiver_data: {
      register: payload.customerCode || undefined,
      name: payload.customerName || undefined,
      email: payload.customerEmail || undefined,
      phone: payload.customerPhone || undefined,
    },
    invoice_description: payload.description,
    amount: payload.amount,
    callback_url: payload.callbackUrl,
  };

  const res = await fetch(`${env.qpay.baseUrl}${INVOICE_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `QPay invoice create failed (${res.status}): ${
        text || res.statusText
      }`
    );
  }

  const data = (await res.json()) as QpayInvoiceResponse;

  if (!data.invoice_id || !data.qr_image) {
    throw new Error("QPay invoice response missing required fields");
  }

  return data;
}

export async function checkQpayPayment(objectId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${env.qpay.baseUrl}${PAYMENT_CHECK_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: objectId,
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `QPay payment check failed (${res.status}): ${
        text || res.statusText
      }`
    );
  }

  return res.json() as Promise<{
    count: number;
    paid_amount: number;
    rows: {
      payment_id: string;
      payment_status: string;
      payment_amount: string;
    }[];
  }>;
}


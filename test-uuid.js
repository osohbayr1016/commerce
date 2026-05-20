const baseUrl = "https://merchant.qpay.mn/v2";
const clientId = "MAAYAA_UVUU";
const clientSecret = "brGVZMiC";
const invoiceCode = "MAAYAA_UVUU_INVOICE";

const AUTH_PATH = "/auth/token";
const INVOICE_PATH = "/invoice";

async function testUuid() {
  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  
  const tokenRes = await fetch(`${baseUrl}${AUTH_PATH}`, {
    method: "POST",
    headers: { Authorization: authHeader }
  });
  
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  
  // Test 1: UUID with hyphens (e.g. standard UUID)
  const uuidWithHyphens = "6ecba385-a6f0-46e2-9a07-549debe2e3e7";
  console.log("Testing invoice with UUID with hyphens:", uuidWithHyphens);
  
  const body1 = {
    invoice_code: invoiceCode,
    sender_invoice_no: uuidWithHyphens,
    invoice_receiver_code: "terminal",
    invoice_receiver_data: {
      name: "Test Customer",
      email: "test@example.com",
      phone: "99999999",
    },
    invoice_description: "Test UUID",
    amount: 100,
  };

  const res1 = await fetch(`${baseUrl}${INVOICE_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body1),
  });

  console.log("Response with hyphens status:", res1.status, res1.statusText);
  const text1 = await res1.text();
  console.log("Response with hyphens body:", text1);
}

testUuid();

import { getServerConfig } from "../config.server";
import { creditWallet } from "./wallet.functions";
import { execute, queryOne } from "../db/index.server";

export interface Invoice {
  paymentRequest: string;
  paymentHash: string;
  amountSats: number;
  expiresAt: string;
  mock?: boolean;
}

// Create a Lightning invoice (Blink or mock)
export async function createLightningInvoice(
  userId: string,
  amountSats: number,
  memo?: string
): Promise<Invoice> {
  const config = getServerConfig();

  if (config.mockBlink) {
    const mockHash = `mock_${Date.now()}_${userId.slice(0, 8)}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Store pending transaction
    await execute(
      `INSERT INTO transactions(user_id, type, amount_sats, status, method, lightning_invoice, lightning_payment_hash)
       VALUES($1,'deposit',$2,'pending','lightning',$3,$4)`,
      [userId, amountSats, `lnbc_mock_${mockHash}`, mockHash]
    );

    return {
      paymentRequest: `lnbc${amountSats}n1p_mock_invoice_${mockHash}`,
      paymentHash: mockHash,
      amountSats,
      expiresAt,
      mock: true,
    };
  }

  // Real Blink API
  const query = `
    mutation LnInvoiceCreate($input: LnInvoiceCreateInput!) {
      lnInvoiceCreate(input: $input) {
        invoice { paymentRequest paymentHash satoshis }
        errors { message }
      }
    }
  `;

  const res = await fetch(config.blinkApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": config.blinkApiKey!,
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          walletId: config.blinkWalletId,
          amount: amountSats,
          memo: memo ?? "UStack deposit",
        },
      },
    }),
  });

  const json = await res.json() as {
    data?: { lnInvoiceCreate?: { invoice?: { paymentRequest: string; paymentHash: string; satoshis: number }; errors?: { message: string }[] } }
  };
  const result = json.data?.lnInvoiceCreate;
  if (!result?.invoice) {
    throw new Error(result?.errors?.[0]?.message ?? "Failed to create invoice");
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await execute(
    `INSERT INTO transactions(user_id, type, amount_sats, status, method, lightning_invoice, lightning_payment_hash)
     VALUES($1,'deposit',$2,'pending','lightning',$3,$4)`,
    [userId, amountSats, result.invoice.paymentRequest, result.invoice.paymentHash]
  );

  return {
    paymentRequest: result.invoice.paymentRequest,
    paymentHash: result.invoice.paymentHash,
    amountSats,
    expiresAt,
    mock: false,
  };
}

// Pay a Lightning invoice (withdraw via Blink or mock)
export async function payLightningInvoice(
  userId: string,
  paymentRequest: string,
  amountSats: number
): Promise<{ success: boolean; paymentHash?: string }> {
  const config = getServerConfig();

  if (config.mockBlink) {
    const hash = `mock_pay_${Date.now()}`;
    await execute(
      `INSERT INTO transactions(user_id, type, amount_sats, status, method, lightning_invoice, lightning_payment_hash)
       VALUES($1,'withdraw',$2,'confirmed','lightning',$3,$4)`,
      [userId, amountSats, paymentRequest, hash]
    );
    return { success: true, paymentHash: hash };
  }

  const mutation = `
    mutation LnInvoicePaymentSend($input: LnInvoicePaymentInput!) {
      lnInvoicePaymentSend(input: $input) {
        status
        errors { message }
      }
    }
  `;

  const res = await fetch(config.blinkApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": config.blinkApiKey!,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          walletId: config.blinkWalletId,
          paymentRequest,
        },
      },
    }),
  });

  const json = await res.json() as {
    data?: { lnInvoicePaymentSend?: { status: string; errors?: { message: string }[] } }
  };
  const result = json.data?.lnInvoicePaymentSend;
  if (!result || result.status === "FAILURE") {
    throw new Error(result?.errors?.[0]?.message ?? "Payment failed");
  }

  return { success: true };
}

// Confirm a mock invoice payment (dev/testing tool)
export async function confirmMockPayment(paymentHash: string): Promise<void> {
  const tx = await queryOne<{ user_id: string; amount_sats: string }>(
    `SELECT user_id, amount_sats FROM transactions WHERE lightning_payment_hash=$1 AND status='pending'`,
    [paymentHash]
  );
  if (!tx) throw new Error("Transaction not found or already confirmed");

  await execute(`UPDATE transactions SET status='confirmed', updated_at=NOW() WHERE lightning_payment_hash=$1`, [paymentHash]);
  await creditWallet(tx.user_id, Number(tx.amount_sats));
}

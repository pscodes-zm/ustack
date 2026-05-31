import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { queryOne, execute } from "../db/index.server";
import { verifyToken } from "../auth.server";

export const getWallet = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const payload = await verifyToken(data.token);
    if (!payload) throw new Error("Unauthorized");

    const wallet = await queryOne<{ available_sats: string; vault_sats: string }>(
      `SELECT available_sats, vault_sats FROM wallets WHERE user_id=$1`,
      [payload.sub]
    );
    if (!wallet) throw new Error("Wallet not found");

    return {
      availableSats: Number(wallet.available_sats),
      vaultSats: Number(wallet.vault_sats),
      totalSats: Number(wallet.available_sats) + Number(wallet.vault_sats),
    };
  });

// Add sats to available balance (called after confirmed deposit)
export async function creditWallet(userId: string, amountSats: number): Promise<void> {
  await execute(
    `UPDATE wallets SET available_sats = available_sats + $1, updated_at = NOW() WHERE user_id = $2`,
    [amountSats, userId]
  );
}

// Move sats from available → vault balance
export async function lockIntoVault(userId: string, amountSats: number): Promise<void> {
  const wallet = await queryOne<{ available_sats: string }>(
    `SELECT available_sats FROM wallets WHERE user_id=$1 FOR UPDATE`,
    [userId]
  );
  if (!wallet || Number(wallet.available_sats) < amountSats) {
    throw new Error("Insufficient available balance.");
  }
  await execute(
    `UPDATE wallets SET available_sats = available_sats - $1, vault_sats = vault_sats + $1, updated_at = NOW() WHERE user_id = $2`,
    [amountSats, userId]
  );
}

// Move sats from vault → available balance
export async function unlockFromVault(userId: string, amountSats: number): Promise<void> {
  await execute(
    `UPDATE wallets SET vault_sats = vault_sats - $1, available_sats = available_sats + $1, updated_at = NOW() WHERE user_id = $2`,
    [amountSats, userId]
  );
}

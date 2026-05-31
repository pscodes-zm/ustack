import process from "node:process";

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || process.env.SESSION_SECRET,
    blinkApiKey: process.env.BLINK_API_KEY,
    blinkApiUrl: "https://api.blink.sv/graphql",
    blinkWalletId: process.env.BLINK_WALLET_ID,
    mockBlink: !process.env.BLINK_API_KEY,
    coingeckoUrl: "https://api.coingecko.com/api/v3",
  };
}

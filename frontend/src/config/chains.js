import { defineChain } from "viem";

/**
 * Monad Testnet Chain Definition
 *
 * Monad is an EVM-compatible blockchain.
 * This defines the testnet for development and testing.
 */
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      // In dev: use Vite proxy (/rpc) to avoid CORS from localhost
      // In prod: use the real RPC directly (CORS not an issue from deployed origin)
      http: [import.meta.env.DEV ? "/rpc" : "https://testnet.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});

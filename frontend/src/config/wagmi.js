import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "./chains";

/**
 * Wagmi Configuration
 *
 * This sets up:
 * - RainbowKit (wallet connection UI)
 * - Wagmi (React hooks for blockchain interactions)
 * - Monad Testnet as the default network
 *
 * The projectId is required for WalletConnect (mobile wallet support).
 * Get a free one from: https://cloud.walletconnect.com/
 */
export const wagmiConfig = getDefaultConfig({
  appName: "TodoList DApp",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "default_project_id",
  chains: [monadTestnet],
  ssr: false, // Disable SSR since this is client-side only
});

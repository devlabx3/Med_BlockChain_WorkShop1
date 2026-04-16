// config.js — Configuración de wagmi + RainbowKit
//
// INSTRUCCIONES:
//   1. Cambia la chain importada por la que necesites (ver wagmi/chains)
//   2. Agrega tus contratos debajo del comentario indicado
//   3. Asegúrate de tener las variables de entorno en .env (ver env.example)

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains"; // <- sustituir por tu chain
import { http } from "wagmi";

// Re-exportar la chain para que App.jsx la importe desde un solo lugar
export { monadTestnet };

// ── Contratos ─────────────────────────────────────────────────────────────────
// Agrega una línea por cada contrato que uses:
//
// export const MY_CONTRACT_ADDRESS = import.meta.env.VITE_MY_CONTRACT_ADDRESS;
// export const MY_CONTRACT_ABI = [
//   {
//     inputs: [{ internalType: "uint256", name: "num", type: "uint256" }],
//     name: "store",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "retrieve",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// ── wagmi config ──────────────────────────────────────────────────────────────
export const wagmiConfig = getDefaultConfig({
  appName: "My dApp",                                          // <- cambia el nombre
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [monadTestnet],                                      // <- sustituir chain
  transports: {
    [monadTestnet.id]: http(import.meta.env.VITE_CHAIN_RPC_URL),
  },
  ssr: false,                                                  // siempre false en SPA
});

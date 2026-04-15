// ─────────────────────────────────────────────────────────────────────────────
// config.js — Configuración central de wagmi + RainbowKit
//
// Este archivo hace dos cosas:
//   1. Importa la definición de la red Monad Testnet desde wagmi/chains
//      (chain ID 10143, moneda nativa MON). No necesitamos definirla a mano
//      porque wagmi ya la incluye.
//   2. Crea el objeto `wagmiConfig` con getDefaultConfig(), que integra
//      wagmi + WalletConnect + RainbowKit en una sola llamada.
// ─────────────────────────────────────────────────────────────────────────────

// getDefaultConfig simplifica el setup: internamente crea el cliente wagmi,
// registra los conectores (MetaMask, WalletConnect, Coinbase, etc.)
// y expone la config lista para pasar a <WagmiProvider>.
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// wagmi/chains exporta definiciones de redes EVM listas para usar.
// monadTestnet incluye: chainId, nombre, símbolo MON, RPC público y explorador.
import { monadTestnet } from "wagmi/chains";

// http() crea un "transport": el canal de comunicación entre la app y el nodo RPC.
// Aquí usamos Alchemy como proveedor RPC para mayor estabilidad y velocidad.
import { http } from "wagmi";

// Re-exportamos monadTestnet para que otros archivos (App.jsx) puedan importarlo
// desde un solo lugar en lugar de repetir el import de wagmi/chains.
export { monadTestnet };

// ─── Contrato Storage desplegado en Monad Testnet ────────────────────────────
export const STORAGE_CONTRACT_ADDRESS = import.meta.env
  .VITE_STORAGE_CONTRACT_ADDRESS;

export const STORAGE_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
      }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const wagmiConfig = getDefaultConfig({
  // Nombre visible de tu app en el modal de WalletConnect
  appName: "Monad Wallet",

  // Project ID de WalletConnect (cloud.reown.com).
  // Necesario para que el conector WalletConnect (QR code) funcione.
  // MetaMask funciona sin él ya que se conecta directamente por browser extension.
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

  // Lista de redes que soporta la app.
  // Puedes agregar más: [monadTestnet, mainnet, sepolia, ...]
  chains: [monadTestnet],

  // transports define cómo se hacen las llamadas RPC por cada red.
  // http("url") = llamadas JSON-RPC estándar al endpoint indicado.
  // Si no defines transports, wagmi usa el RPC público de la chain (menos estable).
  transports: {
    [monadTestnet.id]: http(import.meta.env.VITE_MONAD_RPC_URL),
  },

  // ssr: false porque esta app es una SPA (Single Page App) corriendo en el browser.
  // Pon true solo si usas frameworks con Server-Side Rendering como Next.js.
  ssr: false,
});

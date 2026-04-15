// ─────────────────────────────────────────────────────────────────────────────
// config.js — Configuración central de wagmi + RainbowKit
//
// Este archivo hace dos cosas:
//   1. Importa la definición de la red Monad Testnet desde wagmi/chains
//      (chain ID 10143, moneda nativa MON).
//   2. Crea el objeto `wagmiConfig` con getDefaultConfig(), que integra
//      wagmi + WalletConnect + RainbowKit en una sola llamada.
// ─────────────────────────────────────────────────────────────────────────────

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains";
import { http } from "wagmi";

export { monadTestnet };

// ─── Contrato TodoList desplegado en Monad Testnet ───────────────────────────
export const TODOLIST_CONTRACT_ADDRESS = import.meta.env
  .VITE_TODOLIST_CONTRACT_ADDRESS;

export const TODOLIST_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "text", "type": "string" }],
    "name": "addTodo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "deleteTodo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "toggleTodo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "newText", "type": "string" }
    ],
    "name": "updateTodo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTodos",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "text", "type": "string" },
          { "internalType": "bool", "name": "completed", "type": "bool" }
        ],
        "internalType": "struct TodoList.Todo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "text", "type": "string" }
    ],
    "name": "TodoAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "TodoDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "completed", "type": "bool" }
    ],
    "name": "TodoToggled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "newText", "type": "string" }
    ],
    "name": "TodoUpdated",
    "type": "event"
  }
];

export const wagmiConfig = getDefaultConfig({
  appName: "TodoList Monad",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(import.meta.env.VITE_MONAD_RPC_URL),
  },
  ssr: false,
});

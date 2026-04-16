import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains";
import { http } from "wagmi";

export { monadTestnet };

// Contract Configuration
export const CULEBRITA_CONTRACT_ADDRESS = import.meta.env.VITE_CULEBRITA_CONTRACT_ADDRESS;

export const CULEBRITA_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "playerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "nickname",
        type: "string",
      },
    ],
    name: "PlayerRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_nickname",
        type: "string",
      },
    ],
    name: "registerPlayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "playerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newScore",
        type: "uint256",
      },
    ],
    name: "ScoreUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newScore",
        type: "uint256",
      },
    ],
    name: "updateScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_playerAddress",
        type: "address",
      },
    ],
    name: "getPlayer",
    outputs: [
      {
        internalType: "string",
        name: "nickname",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "topScore",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_playerAddress",
        type: "address",
      },
    ],
    name: "playerExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "players",
    outputs: [
      {
        internalType: "string",
        name: "nickname",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "topScore",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const wagmiConfig = getDefaultConfig({
  appName: "🐍 Culebrita - Monad",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(import.meta.env.VITE_CHAIN_RPC_URL),
  },
  ssr: false,
});

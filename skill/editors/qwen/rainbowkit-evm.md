# RainbowKit EVM dApp — Reglas para Qwen Code

Aplica cuando el usuario diga **"usa RainbowKit con [chain]"** o construya una dApp EVM con wagmi + viem + RainbowKit.

> Coloca este contenido en un archivo `QWEN.md` en la raíz del proyecto para que Qwen Code lo tome como contexto persistente.

## Stack

React + Vite | wagmi v2 | viem v2 | @rainbow-me/rainbowkit v2 | @tanstack/react-query v5

La chain es un parámetro que indica el usuario. El ejemplo por defecto es Monad Testnet (`monadTestnet`), pero el patrón es idéntico para cualquier chain en `wagmi/chains`.

## Reglas no negociables

1. Chain importada de `wagmi/chains` — nunca definir con objeto literal `{ id, name, ... }`
2. Provider order: `WagmiProvider` → `QueryClientProvider` → `RainbowKitProvider` — nunca reordenar
3. `ssr: false` siempre en `getDefaultConfig`
4. `@rainbow-me/rainbowkit/styles.css` solo en `main.jsx`, una vez
5. RPC: `import.meta.env.VITE_CHAIN_RPC_URL` — nunca hardcodeada
6. Contract addresses: `import.meta.env.VITE_*_CONTRACT_ADDRESS` — nunca hardcodeadas
7. ABI y address se exportan desde `config.js`, no se definen en `App.jsx`
8. Post-TX: `useEffect(() => { if (isSuccess) refetch(); }, [isSuccess])`
9. Botones TX: `disabled={isPending || isConfirming}`
10. `msg.sender` dependent: añadir `account: address` a `useReadContract`
11. CSS: opcional — puede reemplazarse por Tailwind, shadcn, etc.

## Patrón 1 — config.js

```js
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains"; // <- chain del usuario
import { http } from "wagmi";

export { monadTestnet };

// export const MY_CONTRACT_ADDRESS = import.meta.env.VITE_MY_CONTRACT_ADDRESS;
// export const MY_ABI = [...];

export const wagmiConfig = getDefaultConfig({
  appName: "My dApp",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [monadTestnet],
  transports: { [monadTestnet.id]: http(import.meta.env.VITE_CHAIN_RPC_URL) },
  ssr: false,
});
```

## Patrón 2 — main.jsx (provider stack, orden obligatorio)

```jsx
<WagmiProvider config={wagmiConfig}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider
      theme={darkTheme({ accentColor: "#836EF9", accentColorForeground: "white", borderRadius: "large" })}
    >
      <App />
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

## Patrón 3 — Balance nativo

```jsx
const { data, isLoading } = useBalance({ address, chainId: chain.id });
// Display: {parseFloat(data.formatted).toFixed(4)} {data.symbol}
```

## Patrón 4 — Leer contrato

```jsx
const { data, isLoading, refetch } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: "myViewFn",
  // account: address  ← si depende de msg.sender
});
```

## Patrón 5 — Escribir contrato + ciclo TX completo

```jsx
const { writeContract, isPending, data: txHash } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

useEffect(() => { if (isSuccess) refetch(); }, [isSuccess]);

writeContract({
  address: CONTRACT_ADDRESS, abi: CONTRACT_ABI,
  functionName: "myWriteFn",
  args: [BigInt(value)],  // uint256 → BigInt; string → string directo
});

// Botón: disabled={isPending || isConfirming}
// Label: isPending → "Firmando…" | isConfirming → "Confirmando…"
```

## Variables de entorno

```
VITE_WALLETCONNECT_PROJECT_ID=   # cloud.reown.com
VITE_CHAIN_RPC_URL=              # RPC del chain elegido
VITE_MY_CONTRACT_ADDRESS=0x...
```

## Instalación

```bash
npm create vite@latest my-dapp -- --template react
cd my-dapp
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

## Chains disponibles (wagmi/chains)

| Chain | Import name |
|-------|------------|
| Monad Testnet | `monadTestnet` |
| Ethereum Mainnet | `mainnet` |
| Sepolia | `sepolia` |
| Base | `base` |
| Base Sepolia | `baseSepolia` |
| Arbitrum One | `arbitrum` |
| Optimism | `optimism` |
| Polygon | `polygon` |

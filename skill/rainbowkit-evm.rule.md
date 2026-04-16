# RainbowKit EVM dApp — Regla Canónica

## Activación

Aplica esta regla cuando el usuario diga **"usa RainbowKit con [chain]"** o pida construir una dApp EVM con RainbowKit + wagmi + viem.

La chain es un parámetro que indica el usuario. El ejemplo por defecto es **Monad Testnet** (`monadTestnet`), pero el patrón es idéntico para cualquier chain en `wagmi/chains` (Sepolia, Base, Arbitrum, etc.).

## Stack

- React + Vite (SPA)
- wagmi v2
- viem v2
- @rainbow-me/rainbowkit v2
- @tanstack/react-query v5

## Reglas no negociables

1. **Chain**: siempre importada de `wagmi/chains` — nunca definir la chain manualmente con un objeto `{ id, name, ... }`.
2. **Provider order**: `WagmiProvider` → `QueryClientProvider` → `RainbowKitProvider` → `App`. Nunca reordenar.
3. **SSR**: `ssr: false` siempre en `getDefaultConfig` (es una SPA, no SSR).
4. **Estilos RainbowKit**: `import "@rainbow-me/rainbowkit/styles.css"` solo en `main.jsx`, una sola vez.
5. **RPC URL**: siempre de `import.meta.env.VITE_CHAIN_RPC_URL` — nunca hardcodeada.
6. **Contract addresses**: siempre de `import.meta.env.VITE_*_CONTRACT_ADDRESS` — nunca hardcodeadas.
7. **ABI y address**: se exportan desde `config.js`, nunca se definen directamente en `App.jsx`.
8. **Refetch post-TX**: después de cualquier `isSuccess`, llamar `refetch()` dentro de `useEffect`.
9. **Botones TX**: siempre `disabled={isPending || isConfirming}` mientras hay una tx en vuelo.
10. **msg.sender**: para funciones que dependen de quién llama (ej. `getTodos`), añadir `account: address` a `useReadContract`.
11. **CSS**: el template incluye un tema oscuro de ejemplo. Es opcional — puede reemplazarse por Tailwind, shadcn/ui, CSS Modules, o cualquier otro sistema.

## Patrón 1 — config.js

```js
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains"; // <- sustituir por la chain elegida
import { http } from "wagmi";

export { monadTestnet }; // re-exportar para que App.jsx lo importe desde aquí

// Contratos: agregar address y ABI debajo
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

## Patrón 2 — main.jsx (provider stack)

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./config";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#836EF9",
            accentColorForeground: "white",
            borderRadius: "large",
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

## Patrón 3 — Wallet Connect + Balance nativo

```jsx
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { monadTestnet } from "./config"; // o la chain elegida

function Balance({ address }) {
  const { data, isLoading } = useBalance({ address, chainId: monadTestnet.id });
  if (isLoading) return <span>...</span>;
  if (!data) return null;
  return (
    <div className="balance-card">
      <span className="balance-label">Balance</span>
      <span className="balance-value">
        {parseFloat(data.formatted).toFixed(4)}{" "}
        <span className="balance-symbol">{data.symbol}</span>
      </span>
    </div>
  );
}

export default function App() {
  const { address, isConnected } = useAccount();
  return (
    <div className="container">
      <div className="card">
        <div className="connect-row"><ConnectButton /></div>
        {isConnected && <Balance address={address} />}
      </div>
    </div>
  );
}
```

## Patrón 4 — Leer contrato

```jsx
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

const { data, isLoading, refetch } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: "myViewFunction",
  // account: address  ← agregar si la función depende de msg.sender
});
// Las funciones `view` no requieren wallet conectada
```

## Patrón 5 — Escribir contrato + ciclo de vida TX

```jsx
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";

const { writeContract, isPending, data: txHash } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

// CRÍTICO: refetch después de confirmación
useEffect(() => {
  if (isSuccess) refetch();
}, [isSuccess]);

function handleSubmit(e) {
  e.preventDefault();
  writeContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "myWriteFunction",
    args: [value],       // ajustar tipos: BigInt para uint256, string para string, etc.
  });
}

// Estados del botón:
// isPending    → "Firmando…"      (usuario debe firmar en wallet)
// isConfirming → "Confirmando…"  (tx enviada, esperando bloque)
// isSuccess    → refetch() se dispara automáticamente
// disabled: isPending || isConfirming
```

## Variables de entorno (.env)

```
VITE_WALLETCONNECT_PROJECT_ID=    # https://cloud.reown.com
VITE_CHAIN_RPC_URL=               # RPC del chain elegido (Alchemy, Infura, público, etc.)
VITE_MY_CONTRACT_ADDRESS=0x...    # Una variable por contrato
```

## Instalación (proyecto nuevo)

```bash
npm create vite@latest my-dapp -- --template react
cd my-dapp
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

## Chains disponibles en wagmi/chains (ejemplos)

| Chain | Import name |
|-------|------------|
| Monad Testnet | `monadTestnet` |
| Ethereum Mainnet | `mainnet` |
| Sepolia Testnet | `sepolia` |
| Base | `base` |
| Base Sepolia | `baseSepolia` |
| Arbitrum One | `arbitrum` |
| Optimism | `optimism` |
| Polygon | `polygon` |

Ver lista completa: `import * as chains from "wagmi/chains"`

## Templates de referencia

Copiar y adaptar desde `skill/templates/`:
- `config.js` — config base con ABI pattern
- `main.jsx` — provider stack completo
- `App.balance.jsx` — wallet + saldo nativo (Patrón 3)
- `App.read-contract.jsx` — lectura de contrato (Patrón 4)
- `App.write-contract.jsx` — escritura + TX + toast (Patrón 5, el más completo)
- `index.css` — tema oscuro opcional (colores configurables)

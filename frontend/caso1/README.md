# Caso 1 — Wallet Connect + Balance en Monad Testnet

> **Nivel:** Principiante | **Tiempo estimado:** 15–20 min
>
> **Qué vas a aprender:** cómo conectar una wallet de browser a una app React y leer el saldo de una cuenta desde la blockchain.

---

## Prerrequisitos

- Node.js 18+ instalado
- MetaMask (u otra wallet EVM) instalada en el browser
- Cuenta con algunos MON de prueba ([faucet de Monad Testnet](https://faucet.monad.xyz))
- Conocimientos básicos de React (componentes, hooks, JSX)

No necesitas saber Solidity ni haber desplegado contratos. Este caso no interactúa con ningún contrato.

---

## Qué hace esta app

App minimalista construida con **Vite + React + RainbowKit + wagmi** que:

1. Muestra un botón "Connect Wallet" usando RainbowKit
2. Cuando el usuario conecta su wallet, lee su saldo nativo en **MON** desde Monad Testnet
3. Muestra el saldo en pantalla con 4 decimales

---

## Stack

| Librería | Rol |
|---|---|
| [Vite](https://vitejs.dev) | Bundler y dev server ultrarrápido |
| [React 18](https://react.dev) | UI declarativa basada en componentes |
| [wagmi v2](https://wagmi.sh) | Hooks de React para interactuar con la blockchain |
| [viem v2](https://viem.sh) | Cliente Ethereum de bajo nivel (usado internamente por wagmi) |
| [RainbowKit v2](https://rainbowkit.com) | Modal de conexión de wallets con UI lista para producción |
| [TanStack Query v5](https://tanstack.com/query) | Caché de datos async (requerido por wagmi) |

---

## Conceptos clave

### 1. El árbol de Providers en `main.jsx`

Cuando abres `main.jsx` verás que `<App />` está envuelta por tres providers anidados:

```
WagmiProvider
  └── QueryClientProvider
        └── RainbowKitProvider
              └── App
```

Esto puede parecer excesivo para una app pequeña, pero cada provider tiene una responsabilidad específica:

| Provider | Responsabilidad |
|---|---|
| `WagmiProvider` | Inyecta el contexto de wagmi. Sin él, ningún hook (`useAccount`, `useBalance`, etc.) funciona. |
| `QueryClientProvider` | wagmi usa React Query para cachear las llamadas RPC. Evita hacer la misma petición dos veces innecesariamente. |
| `RainbowKitProvider` | Agrega el modal visual de selección de wallets. Va *dentro* de `WagmiProvider` porque necesita leer el estado de conexión. |

> **Regla práctica:** el orden importa. `WagmiProvider` siempre va afuera porque los demás dependen de él.

---

### 2. `getDefaultConfig()` — una función para configurarlo todo

En `config.js` encontrarás:

```js
export const wagmiConfig = getDefaultConfig({
  appName: "Monad Wallet",
  projectId: "...",         // WalletConnect Project ID
  chains: [monadTestnet],   // redes que soporta la app
  transports: {
    [monadTestnet.id]: http("https://...")  // URL del nodo RPC
  },
});
```

`getDefaultConfig` es un helper de RainbowKit que internamente hace varias cosas de una vez:

- Crea el cliente wagmi (`createConfig`)
- Registra los conectores: MetaMask, WalletConnect, Coinbase Wallet, Rainbow
- Configura los transports (canales de comunicación con los nodos RPC)

Sin RainbowKit tendrías que hacer todo esto manualmente con `createConfig`. Para aprender es más claro así.

---

### 3. `monadTestnet` desde `wagmi/chains`

wagmi incluye definiciones de cientos de redes EVM. No necesitas escribir la configuración de Monad a mano:

```js
import { monadTestnet } from "wagmi/chains";
// chain ID: 10143 | símbolo: MON | decimals: 18
```

El objeto `monadTestnet` tiene el chain ID, el nombre de la red, la URL del RPC público, el explorador de bloques y el símbolo de la moneda nativa. Todo listo para usar.

---

### 4. `transports` — por qué apuntar a Alchemy en lugar del RPC público

```js
transports: {
  [monadTestnet.id]: http("https://monad-testnet.g.alchemy.com/v2/API_KEY"),
}
```

Un **transport** es el canal que usa wagmi para hacer llamadas a la blockchain (equivalente a `ethers.provider` en la librería ethers.js). Sin `transports`, wagmi usa el RPC público de la chain, que en testnets puede tener:

- Rate limiting (límite de peticiones por segundo)
- Caídas frecuentes
- Latencia alta

Con un RPC de Alchemy o QuickNode tienes un endpoint dedicado más estable. Para este taller usamos las URLs configuradas en el `.env`.

---

### 5. Los hooks `useAccount` y `useBalance`

Estos son los dos hooks de wagmi que usa la app:

```jsx
// Lee el estado de la wallet actualmente conectada.
// Se actualiza automáticamente cuando el usuario conecta/desconecta.
const { address, isConnected } = useAccount();

// Lee el saldo nativo de una dirección en la blockchain.
// Hace una llamada eth_getBalance al RPC configurado.
const { data, isLoading } = useBalance({
  address,
  chainId: monadTestnet.id, // fuerza la consulta en Monad aunque la wallet esté en otra red
});

// Qué contiene `data` cuando llega la respuesta:
// data.formatted → "1.2345678901234567890"  (string, ya dividido entre 10^18)
// data.symbol    → "MON"
// data.value     → 1234567890123456789n     (BigInt en wei, la unidad mínima)
```

> **¿Qué es un wei?** Es la unidad mínima de MON (igual que en ETH). 1 MON = 10^18 wei. Siempre que veas un saldo grande en la blockchain sin procesar, es en wei. `data.formatted` ya hace la conversión por ti.

---

### 6. `ConnectButton` — el componente que lo hace todo

```jsx
<ConnectButton />
```

Este único componente de RainbowKit maneja automáticamente todos los estados de la wallet:

| Estado | Qué muestra |
|---|---|
| Sin wallet conectada | Botón "Connect Wallet" |
| Click en el botón | Modal con lista de wallets disponibles |
| Wallet conectada | Address abreviada + avatar + nombre de la red |
| Red incorrecta | Botón "Wrong Network" con opción de cambiar |
| Click en la address | Menú con opción de desconectar |

---

## Estructura del proyecto

```
caso1/
├── index.html              # HTML base, punto de entrada de Vite
├── vite.config.js          # Configuración de Vite + plugin React
├── .env                    # Variables de entorno (RPC URL, WalletConnect ID)
├── package.json
└── src/
    ├── config.js           # wagmiConfig: redes, transports, WalletConnect
    ├── main.jsx            # Entry point: árbol de providers
    ├── App.jsx             # UI: ConnectButton + Balance
    └── index.css           # Estilos minimalistas dark
```

---

## Correr localmente

```bash
cd frontend/caso1
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | Project ID de [cloud.reown.com](https://cloud.reown.com). Necesario para el conector WalletConnect (QR code). MetaMask funciona sin él. |
| `VITE_MONAD_RPC_URL` | URL de tu nodo RPC (Alchemy, QuickNode, etc.) |

---

## Errores comunes

**"Error: WalletConnect project ID not found"**
→ Agrega tu `VITE_WALLETCONNECT_PROJECT_ID` en el `.env`. MetaMask sigue funcionando sin él.

**El saldo siempre aparece en 0**
→ Verifica que tu `VITE_MONAD_RPC_URL` esté correctamente configurada y que la cuenta tenga fondos en Monad Testnet.

**"ChainId mismatch" o "Wrong Network"**
→ La app está configurada solo para Monad Testnet (chain ID 10143). Cambia tu MetaMask a esa red.

---

## Diagrama de flujo

```
Usuario hace click en "Connect Wallet"
         │
         ▼
  RainbowKit abre modal
  con lista de wallets disponibles
         │
         ▼
  Usuario elige MetaMask
         │
         ▼
  wagmi conecta con el proveedor
  inyectado por la extensión del browser
         │
         ▼
  useAccount() devuelve
  { address: "0xAbc...", isConnected: true }
         │
         ▼
  App renderiza el componente <Balance>
  pasándole la address como prop
         │
         ▼
  useBalance() llama eth_getBalance
  al RPC de Monad Testnet (vía Alchemy)
         │
         ▼
  Muestra "X.XXXX MON" en pantalla
```

---

## Siguiente paso

Una vez que entiendas cómo conectar una wallet y leer datos, el siguiente paso es interactuar con un Smart Contract: [Caso 2 — Storage Contract](../caso2/README.md).

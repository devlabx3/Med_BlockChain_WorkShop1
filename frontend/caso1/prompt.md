# Prompt — Caso 1: Wallet Connection + Balance Reader en Monad Testnet

## Objetivo del proyecto

Construir una aplicación web3 React mínima llamada **"Monad Wallet"** que:

1. Permita conectar una wallet EVM (MetaMask, WalletConnect, Coinbase Wallet) con un botón listo para usar
2. Muestre el balance nativo **MON** de la wallet conectada en **Monad Testnet**

No requiere ningún smart contract. Solo lee el balance nativo de la red. Es una SPA completamente client-side, sin backend.

---

## Red objetivo: Monad Testnet

| Propiedad | Valor |
|-----------|-------|
| Chain ID | `10143` |
| Token nativo | `MON` |
| Decimales | `18` |
| Nombre en wagmi/chains | `monadTestnet` |
| RPC recomendado | Alchemy: `https://monad-testnet.g.alchemy.com/v2/<API_KEY>` |

---

## Stack sugerido

Empezá desde cero con Vite y luego instalá las dependencias:

```bash
npm create vite@latest caso1 -- --template react
cd caso1
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

| Librería | Versión de referencia | Documentación |
|----------|-----------------------|---------------|
| React | `^18.3.1` | — |
| Vite | `^5.4.8` | https://vite.dev/guide/ |
| wagmi | `^2.12.17` | https://wagmi.sh/react/getting-started |
| viem | `^2.21.19` | https://viem.sh |
| RainbowKit | `^2.2.4` | https://www.rainbowkit.com/docs/installation |
| TanStack Query | `^5.56.2` | https://tanstack.com/query/latest |

Las versiones son una referencia para que sepas qué docs consultar — no es necesario que coincidan exactamente.

---

## Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con:

```
VITE_WALLETCONNECT_PROJECT_ID=<obtener en cloud.reown.com>
VITE_MONAD_RPC_URL=https://monad-testnet.g.alchemy.com/v2/<tu_api_key>
```

Accedé a ellas en el código como `import.meta.env.VITE_*`.

---

## ¿Qué tiene que hacer tu app?

En lugar de darte una estructura fija, estos son los **comportamientos que debe tener** la app. Cómo organizás los archivos es decisión tuya:

**1. Al abrir la app → aparece un botón para conectar wallet**

RainbowKit provee un `<ConnectButton />` listo para usar. Para que funcione necesitás configurar los providers (WagmiProvider → QueryClientProvider → RainbowKitProvider) alrededor de tu app.

→ Seguí la guía oficial: https://www.rainbowkit.com/docs/installation

---

**2. Al conectar MetaMask → la UI refleja el estado de la wallet**

Una vez conectada la wallet, podés leer la address del usuario y saber si está conectado o no.

→ Hook a usar: `useAccount` — https://wagmi.sh/react/api/hooks/useAccount

---

**3. Estando conectado → mostrar el balance MON en Monad Testnet**

Podés leer el balance nativo de cualquier address en cualquier red.

→ Hook a usar: `useBalance` — https://wagmi.sh/react/api/hooks/useBalance

> **Tip:** pasá `chainId: 10143` al hook para forzar la consulta en Monad Testnet aunque el usuario tenga otra red configurada en su wallet.

---

**4. Funciona con MetaMask, WalletConnect y Coinbase Wallet**

Esto lo maneja RainbowKit automáticamente si usás `getDefaultConfig` al configurar wagmi.

→ Ver configuración: https://www.rainbowkit.com/docs/installation

---

## Referencias de documentación

| Tecnología | URL |
|------------|-----|
| RainbowKit — Instalación y getDefaultConfig | https://www.rainbowkit.com/docs/installation |
| RainbowKit — ConnectButton | https://www.rainbowkit.com/docs/connect-button |
| RainbowKit — Temas (darkTheme) | https://www.rainbowkit.com/docs/theming |
| wagmi — Getting Started + Providers | https://wagmi.sh/react/getting-started |
| wagmi — useAccount | https://wagmi.sh/react/api/hooks/useAccount |
| wagmi — useBalance | https://wagmi.sh/react/api/hooks/useBalance |
| wagmi — http transport | https://wagmi.sh/core/api/transports/http |
| viem | https://viem.sh |
| Vite | https://vite.dev/guide/ |

# Caso 1: Mi primera Wallet Web3 en Monad

## Objetivo

Quiero una app web llamada **"Monad Wallet"** que:

1. Tenga un botón para conectar mi wallet (MetaMask, WalletConnect, Coinbase Wallet)
2. Muestre mi balance en **MON** (el token de Monad) cuando la wallet esté conectada

No necesita backend ni contratos. Solo conectar la wallet y leer el balance.

---

## Red: Monad Testnet

| Dato | Valor |
|------|-------|
| Nombre | Monad Testnet |
| Chain ID | `10143` |
| Token | `MON` |
| RPC | `https://monad-testnet.g.alchemy.com/v2/<tu_api_key>` |

---

## Variables de entorno

Crea un archivo `.env` con:

```
VITE_WALLETCONNECT_PROJECT_ID=<obtener gratis en cloud.reown.com>
VITE_CHAIN_RPC_URL=https://monad-testnet.g.alchemy.com/v2/<tu_api_key>
```

---

## Qué debe hacer la app

1. Al abrir → aparece un botón para conectar wallet
2. Al conectar → muestra la dirección de la wallet y el balance en MON
3. Al desconectar → vuelve a mostrar solo el botón de conexión

---

## Instrucción

Usa el skill RainbowKit para construir esta app en Monad Testnet.

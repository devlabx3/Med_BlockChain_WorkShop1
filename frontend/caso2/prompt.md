# Prompt — Caso 2: Storage Contract Interaction en Monad Testnet

## Objetivo del proyecto

Construir una DApp educativa React llamada **"Storage Contract"** que enseña a interactuar con un smart contract en Monad Testnet:

1. **Leer** el `uint256` guardado en el contrato (gratis, sin wallet, función `view`)
2. **Escribir** un nuevo número en el contrato (requiere wallet + gas MON)
3. **Rastrear** el ciclo completo de una transacción: firma → envío → confirmación → actualización UI

---

## Parte 1: Smart Contract en Solidity

### Qué hace el contrato

Un contrato `Storage` mínimo con dos funciones:
- `store(uint256 num)` — guarda un número en el estado del contrato (modifica estado, cuesta gas)
- `retrieve()` — devuelve el número guardado (solo lectura, gratis)

### Archivo: `Storage.sol`

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Storage {
    uint256 number;

    function store(uint256 num) public {
        number = num;
    }

    function retrieve() public view returns (uint256) {
        return number;
    }
}
```

### Despliegue

- **Herramienta:** Remix IDE (https://remix.ethereum.org)
  1. Crear archivo `Storage.sol` con el código de arriba
  2. Compilar con Solidity `>=0.8.2`
  3. En "Deploy & Run": seleccionar `Injected Provider - MetaMask`
  4. Asegurarse que MetaMask esté en **Monad Testnet** (Chain ID `10143`)
  5. Hacer clic en "Deploy" y confirmar en MetaMask
  6. Copiar la dirección del contrato desplegado

- **Address de referencia en este workshop:** `0xB1BF996AF730333610b26c61C1518e92755bCFfc`

### ABI del contrato

El ABI describe las funciones del contrato para que el frontend sepa cómo llamarlas. Para `Storage.sol`:

```json
[
  {
    "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
]
```

> Remix genera el ABI automáticamente después de compilar. Se puede copiar desde la sección "ABI" del compilador.

---

## Parte 2: Frontend React

### Red objetivo: Monad Testnet

| Propiedad | Valor |
|-----------|-------|
| Chain ID | `10143` |
| Token nativo | `MON` |
| Nombre en wagmi/chains | `monadTestnet` |
| RPC recomendado | `https://monad-testnet.g.alchemy.com/v2/<API_KEY>` |

### Stack sugerido

Empezá desde cero con Vite y luego instalá las dependencias:

```bash
npm create vite@latest caso2 -- --template react
cd caso2
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

### Variables de entorno

Creá un archivo `.env` en la raíz del proyecto con:

```
VITE_WALLETCONNECT_PROJECT_ID=<obtener en cloud.reown.com>
VITE_MONAD_RPC_URL=https://monad-testnet.g.alchemy.com/v2/<tu_api_key>
VITE_STORAGE_CONTRACT_ADDRESS=0xB1BF996AF730333610b26c61C1518e92755bCFfc
```

---

## ¿Qué tiene que hacer tu app?

En lugar de darte una estructura fija, estos son los **comportamientos que debe tener** la app. Cómo organizás los archivos es decisión tuya:

**1. Al abrir la app → mostrar el número actualmente guardado en el contrato**

La lectura del contrato es gratuita y no requiere wallet conectada. El valor se muestra apenas carga la página.

→ Hook a usar: `useReadContract` — https://wagmi.sh/react/api/hooks/useReadContract

---

**2. Al abrir la app → aparece un botón para conectar wallet**

RainbowKit provee un `<ConnectButton />` listo para usar. Para que funcione necesitás configurar los providers (WagmiProvider → QueryClientProvider → RainbowKitProvider) alrededor de tu app.

→ Seguí la guía oficial: https://www.rainbowkit.com/docs/installation

---

**3. Estando conectado → mostrar un formulario para guardar un número nuevo**

Una vez conectada la wallet, el usuario puede ingresar un número y enviarlo al contrato.

→ Hook a usar: `useAccount` — https://wagmi.sh/react/api/hooks/useAccount

> **Tip:** el valor del input es un `string`. Convertilo a `BigInt` antes de pasarlo como argumento al contrato.

---

**4. Al hacer clic en "Guardar" → enviar la transacción y mostrar el estado**

El botón dispara la escritura en el contrato. La UI debe reflejar cada etapa del proceso.

→ Hook a usar: `useWriteContract` — https://wagmi.sh/react/api/hooks/useWriteContract

→ Hook a usar: `useWaitForTransactionReceipt` — https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt

> La transacción pasa por tres estados: `isPending` (el usuario está firmando en MetaMask) → `isConfirming` (la transacción está en mempool) → `isSuccess` (incluida en un bloque).

---

**5. Al confirmar la transacción → actualizar el número mostrado sin recargar la página**

Cuando la transacción se confirma, el valor en el contrato cambió. La UI debe reflejar el nuevo valor automáticamente.

→ Combiná `useEffect` con el `refetch` que devuelve `useReadContract`.

---

## Ciclo de vida de una transacción

```
Usuario escribe número → clic "Guardar"
→ writeContract() llamado
→ isPending = true → MetaMask abre popup de firma
→ Usuario firma → isPending = false, txHash disponible
→ isConfirming = true → transacción en mempool
→ Bloque minado en Monad → isSuccess = true
→ refetch() → storedValue se actualiza en pantalla
```

---

## Referencias de documentación

| Tecnología | URL |
|------------|-----|
| RainbowKit — Instalación y getDefaultConfig | https://www.rainbowkit.com/docs/installation |
| RainbowKit — ConnectButton | https://www.rainbowkit.com/docs/connect-button |
| RainbowKit — Temas (darkTheme) | https://www.rainbowkit.com/docs/theming |
| wagmi — Getting Started + Providers | https://wagmi.sh/react/getting-started |
| wagmi — useAccount | https://wagmi.sh/react/api/hooks/useAccount |
| wagmi — useReadContract | https://wagmi.sh/react/api/hooks/useReadContract |
| wagmi — useWriteContract | https://wagmi.sh/react/api/hooks/useWriteContract |
| wagmi — useWaitForTransactionReceipt | https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt |
| wagmi — http transport | https://wagmi.sh/core/api/transports/http |
| Remix IDE (desplegar contrato) | https://remix.ethereum.org |

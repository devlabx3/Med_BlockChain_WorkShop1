# Caso 2 — Leer y escribir en un Smart Contract

> **Nivel:** Principiante-Intermedio | **Tiempo estimado:** 20–30 min
>
> **Qué vas a aprender:** cómo leer datos de un contrato inteligente (sin gas) y cómo enviar transacciones para modificar el estado de la blockchain (con gas).

> **Prerrequisito:** haber entendido el [Caso 1](../caso1/README.md). Asumimos que ya sabes cómo funciona la conexión de wallets con RainbowKit y wagmi.

---

## Qué hace esta app

Interactúa con un contrato **Storage** desplegado en Monad Testnet. El contrato guarda un único número en la blockchain. La app permite:

1. **Leer** el número guardado (cualquiera puede verlo, sin wallet)
2. **Escribir** un nuevo número (requiere wallet conectada y gas para pagar la transacción)

---

## El contrato Storage

El contrato que usamos es uno de los más simples posibles:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    uint256 private number;  // el número guardado

    // Guarda un número (modifica estado → cuesta gas)
    function store(uint256 num) public {
        number = num;
    }

    // Lee el número guardado (solo lectura → gratis)
    function retrieve() public view returns (uint256) {
        return number;
    }
}
```

La palabra clave `view` indica que la función solo **lee** el estado sin modificarlo. Estas funciones son gratuitas (no gastan gas).

---

## Stack

El mismo que caso1 + la interacción con contratos:

| Librería | Rol |
|---|---|
| wagmi `useReadContract` | Llama funciones `view` del contrato (lectura, sin gas) |
| wagmi `useWriteContract` | Envía transacciones que modifican el estado (escribe, gasta gas) |
| wagmi `useWaitForTransactionReceipt` | Espera a que la transacción sea confirmada en un bloque |

---

## Conceptos clave

### 1. Qué es el ABI

Para que la app pueda comunicarse con el contrato, necesita saber qué funciones tiene y qué parámetros aceptan. Esa descripción se llama **ABI** (Application Binary Interface).

```js
// config.js
export const STORAGE_ABI = [
  {
    name: "store",
    type: "function",
    stateMutability: "nonpayable",  // modifica estado → cuesta gas
    inputs: [{ name: "num", type: "uint256" }],
    outputs: [],
  },
  {
    name: "retrieve",
    type: "function",
    stateMutability: "view",        // solo lee → gratis
    inputs: [],
    outputs: [{ type: "uint256" }],
  }
];
```

El ABI es generado automáticamente cuando compilas el contrato con Hardhat o Foundry. En esta app lo pegamos directamente en `config.js`.

> **`stateMutability`** describe si la función modifica o no el estado de la blockchain:
> - `view` → solo lee, sin gas
> - `pure` → ni siquiera lee el estado, solo computa
> - `nonpayable` → modifica estado, cuesta gas, no acepta ETH
> - `payable` → modifica estado, cuesta gas, acepta ETH como pago

---

### 2. Leer datos con `useReadContract`

Para leer el valor guardado en el contrato usamos `useReadContract`:

```jsx
const {
  data: storedValue,  // el valor devuelto por el contrato
  isLoading,          // true mientras espera respuesta
  refetch,            // función para releer (útil después de escribir)
} = useReadContract({
  address: STORAGE_CONTRACT_ADDRESS,  // dirección del contrato en la blockchain
  abi: STORAGE_ABI,                   // descripción de las funciones
  functionName: "retrieve",           // qué función queremos llamar
});
```

- **No requiere wallet conectada** — es solo una consulta de lectura al nodo RPC
- **No gasta gas** — es equivalente a leer un dato de una base de datos
- `storedValue` es de tipo `BigInt` (ej: `42n`). Para mostrarlo usa `.toString()`

---

### 3. Escribir datos con `useWriteContract`

Para enviar una transacción que modifica el contrato:

```jsx
const {
  writeContract,   // función que llamas para enviar la transacción
  isPending,       // true mientras el usuario está firmando en MetaMask
  data: txHash,    // hash de la transacción, disponible después de firmar
} = useWriteContract();

// Para llamarla:
function handleStore(e) {
  e.preventDefault();
  writeContract({
    address: STORAGE_CONTRACT_ADDRESS,
    abi: STORAGE_ABI,
    functionName: "store",
    args: [BigInt(inputValue)],  // argumentos de la función (siempre en array)
  });
}
```

> **¿Por qué `BigInt(inputValue)`?** Los contratos Solidity usan enteros de 256 bits (`uint256`). JavaScript no tiene ese tipo nativo, por lo que wagmi y viem usan `BigInt` para representarlos. Un input de texto devuelve un string, así que hay que convertirlo.

---

### 4. Esperar la confirmación con `useWaitForTransactionReceipt`

Cuando llamas `writeContract`, obtienes el hash de la transacción casi de inmediato, pero eso no significa que el contrato ya cambió. La transacción aún tiene que ser incluida en un bloque y confirmada por la red.

```jsx
const {
  isLoading: isConfirming,  // true mientras la tx no está en un bloque
  isSuccess,                // true cuando la tx fue confirmada
} = useWaitForTransactionReceipt({
  hash: txHash,  // el hash que devolvió writeContract
});

// Cuando se confirma, volvemos a leer el contrato para actualizar la UI:
useEffect(() => {
  if (isSuccess) refetch();
}, [isSuccess]);
```

**Ciclo de vida completo de una transacción:**

```
Usuario llama writeContract()
         │
         ▼
  MetaMask abre popup de firma
  isPending = true
         │
         ▼
  Usuario aprueba → tx enviada a la red
  txHash disponible, isPending = false
         │
         ▼
  La tx espera ser incluida en un bloque
  isConfirming = true
         │
         ▼
  Bloque minado → tx confirmada
  isSuccess = true, isConfirming = false
         │
         ▼
  useEffect dispara refetch()
  → la UI muestra el nuevo valor
```

---

### 5. Los estados del botón "Guardar"

El botón tiene tres estados para guiar al usuario:

```jsx
<button
  disabled={isPending || isConfirming || !inputValue}
>
  {isPending    ? "Firmando…"    :
   isConfirming ? "Confirmando…" : "Guardar"}
</button>
```

| Estado | Descripción |
|---|---|
| `isPending` | MetaMask está abierto esperando la firma del usuario |
| `isConfirming` | La transacción fue firmada y enviada, esperando confirmación del bloque |
| Normal | Listo para enviar una nueva transacción |

---

## Estructura del proyecto

```
caso2/
├── index.html
├── vite.config.js
├── .env                    # VITE_STORAGE_CONTRACT_ADDRESS, VITE_MONAD_RPC_URL
├── package.json
└── src/
    ├── config.js           # wagmiConfig + STORAGE_ABI + STORAGE_CONTRACT_ADDRESS
    ├── main.jsx            # Árbol de providers (igual que caso1)
    ├── App.jsx             # UI: lectura + escritura del contrato
    └── index.css
```

---

## Correr localmente

```bash
cd frontend/caso2
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | Project ID de [cloud.reown.com](https://cloud.reown.com) |
| `VITE_MONAD_RPC_URL` | URL de tu nodo RPC |
| `VITE_STORAGE_CONTRACT_ADDRESS` | Dirección del contrato Storage desplegado en Monad Testnet |

---

## Errores comunes

**El valor en el contrato no se actualiza después de guardar**
→ `isSuccess` debe disparar `refetch()`. Revisa que el `useEffect` esté escuchando el cambio de `isSuccess`.

**"execution reverted" al guardar**
→ La wallet conectada puede no tener suficiente MON para pagar el gas. Consigue fondos en el faucet.

**`storedValue` es undefined**
→ El contrato aún no tiene ningún valor guardado (primera vez que se usa). Muestra `"0"` como fallback: `storedValue?.toString() ?? "0"`.

**"invalid BigInt value"**
→ El usuario ingresó texto en el input numérico, o dejó el campo vacío. El botón está deshabilitado si `!inputValue`, pero igualmente valida antes de hacer `BigInt(inputValue)`.

---

## Diagrama de flujo

```
App carga
    │
    ├──► useReadContract("retrieve") ──► muestra valor actual
    │
Usuario conecta wallet
    │
    ├──► escribe un número en el input
    │
    ├──► click "Guardar" → writeContract("store", [número])
    │         │
    │         ▼
    │    MetaMask abre popup de firma (isPending = true)
    │         │
    │         ▼
    │    Usuario firma → txHash disponible
    │         │
    │         ▼
    │    Red procesa la tx (isConfirming = true)
    │         │
    │         ▼
    │    Tx confirmada (isSuccess = true)
    │         │
    │         ▼
    └──► refetch() → useReadContract() vuelve a leer → UI actualizada
```

---

## Siguiente paso

Ya sabes leer y escribir en la blockchain. El siguiente paso es construir una app completa con múltiples operaciones: [Caso 3 — TodoList CRUD](../caso3/README.md).

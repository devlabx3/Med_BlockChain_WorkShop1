# Caso 2: Guardar y leer un número en la blockchain

## Objetivo

Quiero una app web llamada **"Storage Contract"** que:

1. Muestre el número guardado actualmente en el contrato (sin necesidad de conectar wallet)
2. Permita conectar mi wallet y guardar un nuevo número en el contrato
3. Muestre el progreso mientras la transacción se procesa

---

## Red: Monad Testnet

| Dato | Valor |
|------|-------|
| Nombre | Monad Testnet |
| Chain ID | `10143` |
| Token | `MON` |
| RPC | `https://monad-testnet.g.alchemy.com/v2/<tu_api_key>` |

---

## Contrato desplegado

**Dirección:** `0xB1BF996AF730333610b26c61C1518e92755bCFfc`

**Qué hace:**
- `retrieve()` — lee el número guardado (gratis, sin wallet)
- `store(número)` — guarda un número nuevo (cuesta gas MON, requiere wallet)

**ABI:**

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

---

## Variables de entorno

Crea un archivo `.env` con:

```
VITE_WALLETCONNECT_PROJECT_ID=<obtener gratis en cloud.reown.com>
VITE_CHAIN_RPC_URL=https://monad-testnet.g.alchemy.com/v2/<tu_api_key>
VITE_STORAGE_CONTRACT_ADDRESS=0xB1BF996AF730333610b26c61C1518e92755bCFfc
```

---

## Qué debe hacer la app

1. Al abrir → muestra el número guardado en el contrato (sin wallet)
2. Al abrir → aparece un botón para conectar wallet
3. Al conectar → aparece un campo para escribir un número y un botón "Guardar"
4. Al hacer clic en "Guardar" → se envía la transacción y se muestra el estado ("Firmando…", "Confirmando…", "¡Listo!")
5. Al confirmar → el número en pantalla se actualiza automáticamente sin recargar la página

---

## Instrucción

Usa el skill RainbowKit para construir esta app en Monad Testnet.

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

**ABI** (el contrato expone dos operaciones: leer el número guardado y guardar uno nuevo):

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

Imagina que el contrato es una caja fuerte en la blockchain que guarda un solo número. Cualquier persona puede ver qué número hay adentro, pero solo quien tenga una wallet puede cambiarlo.

La app debe funcionar así:

1. **Cuando alguien abre la página** — la app consulta automáticamente la caja fuerte y muestra el número que tiene guardado en este momento. No hace falta conectar nada para ver esto.

2. **Botón para conectar wallet** — visible desde el inicio, para que el usuario pueda identificarse antes de hacer cambios.

3. **Una vez conectado** — aparece un formulario simple donde el usuario escribe el número que quiere guardar y un botón que dice "Guardar en la blockchain".

4. **Al guardar** — la app muestra en pantalla qué está pasando paso a paso: primero pide confirmar en la wallet, luego espera que la red lo procese, y finalmente avisa cuando ya quedó guardado.

5. **Al terminar** — el número que se ve en pantalla se actualiza solo con el nuevo valor, sin necesidad de recargar la página.

---

## Instrucción

Usa el skill RainbowKit para construir esta app en Monad Testnet.

# Caso 2: Guardar y leer un número en la blockchain

## Objetivo

Quiero una app web llamada **"Storage Contract"** que:

1. Muestre el número guardado actualmente en el contrato (sin necesidad de conectar wallet)
2. Permita conectar mi wallet y guardar un nuevo número en el contrato
3. Muestre el progreso mientras la transacción se procesa

---

## Stack y configuración

Usa **RainbowKit** en la cadena **Monad Testnet**.

La interfaz debe mostrar:
- **Botón de conexión** (visible siempre, cuando no hay wallet conectada)
- **Botón de desconexión** (visible cuando hay wallet conectada)

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

```
PROJECT_ID=05b0564c6afd9cca5c24433117d22f43
CHAIN_RPC_URL=https://monad-testnet.g.alchemy.com/v2/uAf5-PCiQhSYESR3WOt81
CONTRACT_ADDRESS=0xB1BF996AF730333610b26c61C1518e92755bCFfc
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

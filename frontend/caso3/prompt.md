# Caso 3: Lista de tareas descentralizada en Monad

## Objetivo

Quiero una app web llamada **"TodoList"** donde cada wallet tiene su propia lista de tareas guardada en la blockchain. Quiero CRUD completo:

- **Agregar** tareas nuevas
- **Ver** mis tareas (solo las mías, de mi wallet)
- **Marcar** tareas como completadas o pendientes
- **Editar** el texto de una tarea
- **Eliminar** tareas

Cada operación de escritura es una transacción real en Monad que cuesta gas MON.

> La wallet conectada actúa como el usuario: el contrato separa las tareas automáticamente por dirección de wallet, así que cada persona solo ve las suyas.

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

**Dirección:** `0x89481D342CBB56635868B90f8E8D413e2c32F66f`

**Qué hace cada función:**
- `getTodos()` — devuelve todas las tareas de la wallet conectada (gratis, sin gas)
- `addTodo(texto)` — agrega una tarea nueva
- `toggleTodo(id)` — alterna entre completada / pendiente
- `updateTodo(id, nuevoTexto)` — cambia el texto de una tarea
- `deleteTodo(id)` — elimina una tarea

> Nota: cuando se elimina una tarea, el contrato deja el slot vacío (con texto `""`). La app debe filtrar y no mostrar las tareas con texto vacío.

**ABI:**

```json
[
  {
    "inputs": [{ "internalType": "string", "name": "text", "type": "string" }],
    "name": "addTodo", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "deleteTodo", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "toggleTodo", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "newText", "type": "string" }
    ],
    "name": "updateTodo", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [],
    "name": "getTodos",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "string", "name": "text", "type": "string" },
        { "internalType": "bool", "name": "completed", "type": "bool" }
      ],
      "internalType": "struct TodoList.Todo[]", "name": "", "type": "tuple[]"
    }],
    "stateMutability": "view", "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "text", "type": "string" }
    ],
    "name": "TodoAdded", "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "TodoDeleted", "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "completed", "type": "bool" }
    ],
    "name": "TodoToggled", "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "newText", "type": "string" }
    ],
    "name": "TodoUpdated", "type": "event"
  }
]
```

---

## Variables de entorno

Crea un archivo `.env` con:

```
VITE_WALLETCONNECT_PROJECT_ID=<obtener gratis en cloud.reown.com>
VITE_CHAIN_RPC_URL=https://monad-testnet.g.alchemy.com/v2/<tu_api_key>
VITE_TODOLIST_CONTRACT_ADDRESS=0x89481D342CBB56635868B90f8E8D413e2c32F66f
```

---

## Qué debe hacer la app

1. Al abrir → aparece un botón para conectar wallet
2. Al conectar → muestra la lista de tareas de esa wallet
3. Formulario para agregar una tarea nueva (con campo de texto y botón "Agregar")
4. Cada tarea muestra:
   - Checkbox para marcarla como completada o pendiente
   - Botón para editar el texto (edición inline)
   - Botón para eliminar
5. Durante cualquier transacción → mostrar estado ("Firmando…", "Confirmando…", "¡Listo!")
6. Al confirmar → la lista se actualiza automáticamente sin recargar la página

---

## Instrucción

Usa el skill RainbowKit para construir esta app en Monad Testnet.

# Caso 3: Lista de tareas descentralizada en Monad

## Objetivo

Quiero una app web llamada **"TodoList"** donde cada wallet tiene su propia lista de tareas guardada en la blockchain. CRUD completo:

1. **Agregar** tareas nuevas
2. **Ver** mis tareas (solo las de mi wallet)
3. **Marcar** tareas como completadas o pendientes
4. **Editar** el texto de una tarea
5. **Eliminar** tareas

---

## Stack y configuración

Usa **RainbowKit** en la cadena **Monad Testnet**.

La interfaz debe mostrar:
- **Botón de conexión** (visible siempre, cuando no hay wallet conectada)
- **Botón de desconexión** (visible cuando hay wallet conectada)

---

## Contrato desplegado

**Dirección:** `0x89481D342CBB56635868B90f8E8D413e2c32F66f`

**ABI** (el contrato expone 5 operaciones: agregar, ver, marcar, editar y eliminar tareas. Nota: al eliminar, queda un slot vacío que la app debe filtrar):

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

```
VITE_WALLETCONNECT_PROJECT_ID=<obtener gratis en cloud.reown.com>
VITE_CHAIN_RPC_URL=https://monad-testnet.g.alchemy.com/v2/<tu_api_key>
VITE_TODOLIST_CONTRACT_ADDRESS=0x89481D342CBB56635868B90f8E8D413e2c32F66f
```

---

## Qué debe hacer la app

1. **Al abrir la página** — aparece un botón para conectar wallet. Una vez conectado, muestra la lista de tareas de esa wallet.

2. **Formulario para agregar** — campo de texto y botón "Agregar" para crear tareas nuevas.

3. **Para cada tarea** — checkbox para marcarla como completada o pendiente, botón para editar el texto (inline), y botón para eliminar.

4. **Durante transacciones** — mostrar el estado paso a paso: "Firmando…", "Confirmando…", "¡Listo!"

5. **Al confirmar cambios** — la lista se actualiza automáticamente sin recargar la página.

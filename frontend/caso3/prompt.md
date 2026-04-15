# Prompt — Caso 3: TodoList DApp (CRUD completo en blockchain)

## Objetivo del proyecto

Construir una DApp de lista de tareas descentralizada llamada **"TodoList"** sobre **Monad Testnet**. Cada wallet tiene su propia lista privada e independiente almacenada en la blockchain. Implementa CRUD completo:

- **CREATE:** Agregar tareas nuevas
- **READ:** Leer las tareas del usuario desde el contrato
- **UPDATE:** Toggle completado/pendiente y edición inline del texto
- **DELETE:** Eliminar tareas

Cada operación de escritura es una transacción blockchain real que cuesta gas MON.

---

## Parte 1: Smart Contract en Solidity

### Conceptos Solidity que se aplican en este contrato

| Concepto | Qué hace |
|----------|----------|
| `msg.sender` | Identifica automáticamente la wallet que llama la función. Así cada usuario solo accede a sus propias tareas sin pasar su dirección como parámetro |
| `mapping` | Diccionario `wallet → lista de tareas`. Cada dirección tiene su propia lista aislada |
| `struct` | Agrupa campos relacionados (id, text, completed) en un solo tipo de dato |
| `event` | Notificaciones que emite el contrato. El frontend puede escucharlas para reaccionar a cambios |
| `delete` | En Solidity, `delete array[i]` **resetea** el slot a valores por defecto (`""`, `false`, `0`), no elimina el elemento del array. El frontend debe filtrar los elementos con `text === ""` |

### Archivo: `TodoList.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TodoList {

    struct Todo {
        uint256 id;        // posición en el array (asignado automáticamente)
        string  text;      // descripción de la tarea
        bool    completed; // true = completada
    }

    // Cada wallet tiene su propio array de tareas (privado)
    mapping(address => Todo[]) private _todos;

    // Eventos — el frontend puede escucharlos
    event TodoAdded(address indexed owner, uint256 indexed id, string text);
    event TodoToggled(address indexed owner, uint256 indexed id, bool completed);
    event TodoUpdated(address indexed owner, uint256 indexed id, string newText);
    event TodoDeleted(address indexed owner, uint256 indexed id);

    function addTodo(string calldata text) external {
        require(bytes(text).length > 0, "El texto no puede estar vacio");
        uint256 newId = _todos[msg.sender].length;
        _todos[msg.sender].push(Todo({ id: newId, text: text, completed: false }));
        emit TodoAdded(msg.sender, newId, text);
    }

    function getTodos() external view returns (Todo[] memory) {
        return _todos[msg.sender];
    }

    function toggleTodo(uint256 id) external {
        require(id < _todos[msg.sender].length, "Tarea no encontrada");
        Todo storage todo = _todos[msg.sender][id];
        todo.completed = !todo.completed;
        emit TodoToggled(msg.sender, id, todo.completed);
    }

    function updateTodo(uint256 id, string calldata newText) external {
        require(id < _todos[msg.sender].length, "Tarea no encontrada");
        require(bytes(newText).length > 0, "El texto no puede estar vacio");
        _todos[msg.sender][id].text = newText;
        emit TodoUpdated(msg.sender, id, newText);
    }

    function deleteTodo(uint256 id) external {
        require(id < _todos[msg.sender].length, "Tarea no encontrada");
        delete _todos[msg.sender][id];
        emit TodoDeleted(msg.sender, id);
    }
}
```

### Despliegue

- **Herramienta:** Remix IDE (https://remix.ethereum.org)
  1. Crear `TodoList.sol` con el código de arriba
  2. Compilar con Solidity `^0.8.24`
  3. En "Deploy & Run": `Injected Provider - MetaMask`, red **Monad Testnet** (Chain ID `10143`)
  4. Deploy → confirmar en MetaMask → copiar la address del contrato

- **Address de referencia en este workshop:** `0x89481D342CBB56635868B90f8E8D413e2c32F66f`

### ABI del contrato (JSON completo)

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

> El ABI también se puede copiar desde Remix después de compilar.

---

## Parte 2: Frontend React

### Red objetivo

| Propiedad | Valor |
|-----------|-------|
| Chain ID | `10143` |
| Token nativo | `MON` |
| Nombre en wagmi/chains | `monadTestnet` |

### Stack sugerido

Empezá desde cero con Vite y luego instalá las dependencias:

```bash
npm create vite@latest caso3 -- --template react
cd caso3
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

| Librería | Versión de referencia | Documentación |
|----------|-----------------------|---------------|
| React | `^19.0.0` ← este caso usa React 19 | — |
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
VITE_TODOLIST_CONTRACT_ADDRESS=0x89481D342CBB56635868B90f8E8D413e2c32F66f
```

---

## ¿Qué tiene que hacer tu app?

En lugar de darte una estructura fija, estos son los **comportamientos que debe tener** la app. Cómo organizás los archivos es decisión tuya:

**1. Al abrir la app → aparece un botón para conectar wallet**

RainbowKit provee un `<ConnectButton />` listo para usar. Para que funcione necesitás configurar los providers (WagmiProvider → QueryClientProvider → RainbowKitProvider) alrededor de tu app.

→ Seguí la guía oficial: https://www.rainbowkit.com/docs/installation

---

**2. Estando conectado → mostrar la lista de tareas de esa wallet**

El contrato separa las tareas por wallet gracias a `msg.sender`. Cada address solo ve las suyas.

→ Hook a usar: `useReadContract` llamando a `getTodos` — https://wagmi.sh/react/api/hooks/useReadContract

> **Tip:** pasá `account: address` al hook. Sin este parámetro, `msg.sender` en el contrato es `address(0)` y `getTodos()` devuelve siempre una lista vacía aunque el usuario tenga tareas guardadas.

> **Tip:** `delete` en Solidity resetea el slot pero no elimina el elemento del array. Antes de renderizar, filtrá las tareas con `text` vacío para no mostrar huecos de tareas eliminadas.

---

**3. Estando conectado → mostrar un formulario para agregar tareas**

El usuario escribe el texto de la tarea y la envía al contrato.

→ Hook a usar: `useWriteContract` con `functionName: "addTodo"` — https://wagmi.sh/react/api/hooks/useWriteContract

---

**4. En cada tarea → botón para marcar como completada o pendiente**

Alterna el estado `completed` de la tarea en el contrato.

→ `useWriteContract` con `functionName: "toggleTodo"`, pasando el `id` de la tarea.

---

**5. En cada tarea → modo de edición inline del texto**

Al activar la edición, el texto de la tarea se reemplaza por un input. Al confirmar, se envía la actualización al contrato.

→ `useWriteContract` con `functionName: "updateTodo"`, pasando el `id` y el nuevo texto.

---

**6. En cada tarea → botón para eliminar**

Elimina la tarea del contrato.

→ `useWriteContract` con `functionName: "deleteTodo"`, pasando el `id` de la tarea.

> **Tip:** podés usar un solo `useWriteContract` para las 4 operaciones de escritura. Solo cambiás `functionName` y `args` en cada llamada. La contrapartida: no podés saber qué operación específica está en curso — solo que *alguna* transacción está pendiente.

---

**7. En cualquier operación de escritura → mostrar progreso y notificar al confirmar**

La UI debe reflejar cada etapa de la transacción y actualizar la lista automáticamente al confirmar.

→ Hook a usar: `useWaitForTransactionReceipt` — https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt

→ Al confirmar: llamá `refetch()` del hook de lectura para actualizar la lista.

---

## Ciclo de vida de una transacción

```
Usuario agrega tarea → writeContract({ functionName: "addTodo", args: [text] })
→ isPending = true → MetaMask popup
→ Usuario firma → txHash disponible
→ isConfirming = true → "⛏️ Confirmando…"
→ Bloque minado → isSuccess = true
→ refetch() → lista actualizada en pantalla
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
| wagmi — useReadContract (+ parámetro account) | https://wagmi.sh/react/api/hooks/useReadContract |
| wagmi — useWriteContract | https://wagmi.sh/react/api/hooks/useWriteContract |
| wagmi — useWaitForTransactionReceipt | https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt |
| wagmi — http transport | https://wagmi.sh/core/api/transports/http |
| Remix IDE (desplegar contrato) | https://remix.ethereum.org |

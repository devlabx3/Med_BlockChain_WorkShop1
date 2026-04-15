# Caso 3 — CRUD completo en la blockchain (TodoList)

> **Nivel:** Intermedio | **Tiempo estimado:** 30–45 min
>
> **Qué vas a aprender:** cómo construir una app con operaciones completas de creación, lectura, actualización y eliminación (CRUD) sobre un smart contract. Además: el concepto de `msg.sender`, eventos de Solidity, y cómo combinar estado local de React con estado en la blockchain.

> **Prerrequisito:** haber entendido el [Caso 2](../caso2/README.md). Asumimos que ya sabes cómo funcionan `useReadContract`, `useWriteContract` y el ciclo de vida de una transacción.

---

## Qué hace esta app

App completa de lista de tareas donde **cada tarea vive en la blockchain**. El contrato es un TodoList donde:

- Cada wallet tiene **su propia lista privada** de tareas
- Las tareas se guardan permanentemente en Monad Testnet
- Nadie puede ver ni modificar las tareas de otro usuario

Operaciones disponibles:
- **Agregar** una nueva tarea
- **Completar/descompletar** (toggle) una tarea
- **Editar** el texto de una tarea
- **Eliminar** una tarea

---

## El contrato TodoList

### Estructura de datos

```solidity
contract TodoList {

    // Un "struct" es como un objeto en Solidity: agrupa varios campos
    struct Todo {
        uint256 id;        // Identificador único (posición en el array)
        string  text;      // Texto de la tarea
        bool    completed; // true = completada | false = pendiente
    }

    // "mapping" es como un diccionario: cada address (wallet) tiene su propio array
    // Private: solo el contrato puede acceder directamente
    mapping(address => Todo[]) private _todos;
}
```

> **¿Qué es `msg.sender`?** En Solidity, `msg.sender` es la dirección de la wallet que está llamando la función en ese momento. Cada función del contrato que usa `msg.sender` opera automáticamente sobre los datos de quien la llama. Por eso cada usuario tiene su lista separada, sin necesidad de pasar la dirección como parámetro.

### Las funciones del contrato

```solidity
// READ — Solo lectura, gratis, no modifica nada
function getTodos() external view returns (Todo[] memory) {
    return _todos[msg.sender];  // devuelve los todos DEL usuario que llama
}

// CREATE — Modifica estado, cuesta gas
function addTodo(string calldata text) external {
    uint256 newId = _todos[msg.sender].length;  // el id es la posición en el array
    _todos[msg.sender].push(Todo({ id: newId, text: text, completed: false }));
    emit TodoAdded(msg.sender, newId, text);     // notifica al frontend
}

// UPDATE — Cambia completed true↔false
function toggleTodo(uint256 id) external {
    Todo storage todo = _todos[msg.sender][id];
    todo.completed = !todo.completed;
    emit TodoToggled(msg.sender, id, todo.completed);
}

// UPDATE — Edita el texto
function updateTodo(uint256 id, string calldata newText) external {
    _todos[msg.sender][id].text = newText;
    emit TodoUpdated(msg.sender, id, newText);
}

// DELETE — Resetea el slot a valores por defecto (id=0, text="", completed=false)
function deleteTodo(uint256 id) external {
    delete _todos[msg.sender][id];
    emit TodoDeleted(msg.sender, id);
}
```

> **Nota sobre `delete` en Solidity:** En Solidity no se puede reducir el tamaño de un array de forma eficiente dentro de un mapping. El operador `delete` resetea el slot a sus valores por defecto (0, "", false), pero el slot sigue ocupando espacio. El frontend debe filtrar los todos con `text === ""` para no mostrar los eliminados.

### Eventos

Los **eventos** son notificaciones que el contrato emite cuando algo cambia. El frontend puede escucharlos para actualizar la UI en tiempo real (en esta app usamos `refetch` por simplicidad, pero los eventos son la base de UX reactivo).

```solidity
event TodoAdded(address indexed owner, uint256 indexed id, string text);
event TodoToggled(address indexed owner, uint256 indexed id, bool completed);
event TodoUpdated(address indexed owner, uint256 indexed id, string newText);
event TodoDeleted(address indexed owner, uint256 indexed id);
```

Los campos marcados con `indexed` permiten filtrar eventos por ese valor (ej: buscar todos los eventos de una wallet específica).

---

## Stack

El mismo que caso2. Ninguna librería nueva:

| Hook | Uso en esta app |
|---|---|
| `useAccount` | Obtener la address conectada (necesaria para `account` en `useReadContract`) |
| `useReadContract` | Leer la lista de todos con `getTodos` |
| `useWriteContract` | Enviar transacciones: `addTodo`, `toggleTodo`, `updateTodo`, `deleteTodo` |
| `useWaitForTransactionReceipt` | Esperar confirmación y hacer `refetch` |

---

## Conceptos clave

### 1. El parámetro `account` en `useReadContract`

Este detalle es crítico y fácil de olvidar:

```jsx
const { data: todos, refetch } = useReadContract({
  address: TODOLIST_CONTRACT_ADDRESS,
  abi: TODOLIST_ABI,
  functionName: "getTodos",
  account: address,  // ← sin esto, msg.sender en el contrato será address(0)
});
```

La función `getTodos` usa `msg.sender` para saber qué lista devolver. Cuando la llamada viene desde el frontend (a través del nodo RPC), wagmi necesita saber qué dirección poner como `msg.sender`. Sin `account`, el contrato "ve" `address(0)` (la dirección cero) y devuelve una lista vacía.

---

### 2. Un solo `useWriteContract` para múltiples operaciones

En la app, todas las operaciones de escritura comparten el mismo `useWriteContract`:

```jsx
const { writeContract, isPending, data: txHash } = useWriteContract();

// Agregar
writeContract({ functionName: "addTodo",    args: [newText] });

// Toggle
writeContract({ functionName: "toggleTodo", args: [id] });

// Editar
writeContract({ functionName: "updateTodo", args: [id, editText] });

// Eliminar
writeContract({ functionName: "deleteTodo", args: [id] });
```

Ventaja: `isPending` y `txHash` reflejan el estado de **la última transacción enviada**. El botón de submit se deshabilita mientras `isPending || isConfirming`, lo que previene que el usuario envíe múltiples transacciones simultáneas.

Limitación: no puedes saber qué operación específica está pendiente. Para apps más complejas, podrías tener un `useWriteContract` por operación.

---

### 3. Estado local de React vs estado en la blockchain

La app combina dos tipos de estado:

| Estado | Dónde vive | Cuándo cambia |
|---|---|---|
| Lista de todos | Blockchain (contrato) | Al confirmar una transacción + `refetch()` |
| Input de nueva tarea | React (`useState`) | Al escribir en el input |
| ID/texto en edición | React (`useState`) | Al hacer click en "Editar"/"Cancelar" |
| Toast de notificación | React (`useState`) | Al confirmar una transacción |

El estado de React es **inmediato** (cambia en millisegundos). El estado de la blockchain es **eventual** (puede tardar segundos hasta que se mina un bloque). La UX debe comunicar esta diferencia al usuario.

---

### 4. El modo edición inline

El componente renderiza cada todo en dos modos distintos según `editingId`:

```jsx
{editingId === todo.id ? (
  // Modo edición: muestra un input con el texto actual + botones Guardar/Cancelar
  <div className="edit-row">
    <input value={editText} onChange={...} autoFocus />
    <button onClick={() => handleUpdate(todo.id)}>✓</button>
    <button onClick={cancelEdit}>✕</button>
  </div>
) : (
  // Modo normal: muestra el texto + botones Editar/Eliminar
  <>
    <button onClick={() => handleToggle(todo.id)}>checkbox</button>
    <span>{todo.text}</span>
    <button onClick={() => startEdit(todo)}>✏️</button>
    <button onClick={() => handleDelete(todo.id)}>🗑️</button>
  </>
)}
```

`editingId` y `editText` son estado local de React. El contrato no sabe que el usuario está "editando" — solo recibe la transacción cuando el usuario hace click en "Guardar".

---

### 5. Toast de notificación

La app muestra un mensaje de éxito temporal cuando se confirma una transacción:

```jsx
const [toast, setToast] = useState(null); // { type: "success" | "error", msg: string }

// Al confirmar tx:
useEffect(() => {
  if (isSuccess) {
    refetch();
    setToast({ type: "success", msg: "¡Transacción confirmada!" });
  }
}, [isSuccess]);

// Auto-cerrar después de 3 segundos:
useEffect(() => {
  if (!toast) return;
  const t = setTimeout(() => setToast(null), 3000);
  return () => clearTimeout(t); // cleanup: cancela el timer si el componente se desmonta
}, [toast]);
```

---

## El ABI completo

El ABI describe todas las funciones y eventos del contrato. Lo encontrarás en `config.js`:

```js
export const TODOLIST_ABI = [
  // Funciones de escritura (nonpayable: modifican estado, cuestan gas)
  { name: "addTodo",    inputs: [{ name: "text", type: "string" }], ... },
  { name: "toggleTodo", inputs: [{ name: "id",   type: "uint256" }], ... },
  { name: "updateTodo", inputs: [{ name: "id", type: "uint256" }, { name: "newText", type: "string" }], ... },
  { name: "deleteTodo", inputs: [{ name: "id",   type: "uint256" }], ... },

  // Función de lectura (view: no modifica estado, gratis)
  {
    name: "getTodos",
    stateMutability: "view",
    inputs: [],
    outputs: [{
      type: "tuple[]",  // array de structs
      components: [
        { name: "id",        type: "uint256" },
        { name: "text",      type: "string" },
        { name: "completed", type: "bool" }
      ]
    }]
  },

  // Eventos (el contrato los emite cuando algo cambia)
  { name: "TodoAdded",   type: "event", inputs: [...] },
  { name: "TodoToggled", type: "event", inputs: [...] },
  { name: "TodoUpdated", type: "event", inputs: [...] },
  { name: "TodoDeleted", type: "event", inputs: [...] },
];
```

> **`tuple[]`** es como Solidity representa un array de structs en el ABI. wagmi lo convierte automáticamente a un array de objetos JavaScript cuando llega la respuesta.

---

## Estructura del proyecto

```
caso3/
├── index.html
├── vite.config.js
├── .env                    # VITE_TODOLIST_CONTRACT_ADDRESS, VITE_MONAD_RPC_URL
├── package.json
└── src/
    ├── config.js           # wagmiConfig + TODOLIST_ABI + TODOLIST_CONTRACT_ADDRESS
    ├── main.jsx            # Árbol de providers (mismo que caso1 y caso2)
    ├── App.jsx             # UI completa: lista, formulario, edición inline, toast
    └── index.css
```

---

## Correr localmente

```bash
cd frontend/caso3
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
| `VITE_TODOLIST_CONTRACT_ADDRESS` | Dirección del contrato TodoList desplegado en Monad Testnet |

---

## Errores comunes

**La lista de todos aparece vacía aunque el contrato tiene datos**
→ Verifica que estés pasando `account: address` en `useReadContract`. Sin ese campo, `msg.sender` en el contrato es `address(0)` y devuelve una lista vacía.

**Los todos eliminados aparecen como tareas vacías**
→ `delete` en Solidity no elimina el slot, solo lo resetea a valores por defecto. El frontend debe filtrar: `todos.filter(t => t.text !== "")`. Si ves tareas en blanco, este filtro puede estar faltando.

**"execution reverted: El texto no puede estar vacio"**
→ El contrato tiene validación: no acepta strings vacíos. El botón "Agregar" está deshabilitado si `!newText.trim()`, pero igualmente el contrato rechazará la transacción.

**Las transacciones funcionan pero la lista no se actualiza**
→ Asegúrate de que `refetch` se llama dentro del `useEffect` que escucha `isSuccess`.

**Solo veo mis propias tareas, no las de otros**
→ Eso es correcto. El contrato usa `msg.sender` para aislar la lista de cada usuario. Si quisieras una lista compartida, el contrato tendría que ser diferente.

---

## Diagrama de flujo: agregar una tarea

```
Usuario escribe texto → click "Agregar"
         │
         ▼
  handleAdd() llama writeContract()
  con functionName: "addTodo", args: [texto]
         │
         ▼
  MetaMask abre popup (isPending = true)
  Input y botón se deshabilitan
         │
         ▼
  Usuario firma la transacción
  txHash disponible, isPending = false
         │
         ▼
  La tx viaja a la red y espera ser minada
  (isConfirming = true)
         │
         ▼
  Bloque confirmado → isSuccess = true
         │
         ├──► refetch() → getTodos() → lista actualizada en la UI
         └──► setToast("¡Transacción confirmada!") → aparece notificación
```

---

## Comparación de los 3 casos

| Concepto | Caso 1 | Caso 2 | Caso 3 |
|---|---|---|---|
| Conexión de wallet | ✓ | ✓ | ✓ |
| Leer datos de la blockchain | Solo balance | `useReadContract` | `useReadContract` + `account` |
| Escribir en la blockchain | — | `useWriteContract` | `useWriteContract` (múltiples ops) |
| Esperar confirmación | — | `useWaitForTransactionReceipt` | ✓ |
| Estado local de React | Mínimo | Input numérico | Inputs + modo edición + toast |
| `msg.sender` | — | — | Clave para aislar datos por usuario |
| Eventos del contrato | — | — | Emitidos (lectura vía `refetch`) |
| CRUD completo | — | Solo write | Create, Read, Update, Delete |

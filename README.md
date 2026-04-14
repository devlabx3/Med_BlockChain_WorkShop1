# TodoList DApp — BlockChain Workshop

Un proyecto educativo completo para aprender blockchain desde cero: un contrato inteligente multi-usuario en Solidity y una interfaz web moderna con Vite + React + RainbowKit.

**Público objetivo:** Principiantes 100% sin conocimiento de programación ni contratos inteligentes.

---

## 🎯 Objetivos del Workshop

1. Entender cómo funciona un **mapping en Solidity** (estructura datos)
2. Escribir un **contrato inteligente simple** con CRUD
3. Desplegar a **Monad Testnet** usando Remix IDE (sin CLI)
4. Conectar una **interfaz web** a un contrato via Web3
5. Aprender la diferencia entre **write** (transacciones) y **read** (vistas)

---

## 📋 Requisitos Previos

- **MetaMask** instalado (extension de Chrome/Firefox)
- **MON tokens** en MetaMask (gratis desde faucet.monad.xyz)
- **Node.js 18+** (`npm --version` para verificar)
- Un editor de texto (VS Code recomendado)
- **Remix IDE**: accedes desde el navegador en remix.ethereum.org

---

## 🚀 Estructura del Proyecto

```
Med_BlockChain_WorkShop1/
├── contract/
│   └── TodoList.sol          ← Contrato que se despliega en Remix
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/        ← Botones, formularios, listas
    │   ├── hooks/            ← Conexión con blockchain
    │   └── config/           ← RainbowKit, ABI, chains
    └── package.json
```

---

## 📖 Guía Paso a Paso

### Fase 1: El Contrato Inteligente (20 min)

1. **Abrir Remix IDE**
   ```
   https://remix.ethereum.org
   ```

2. **Crear nuevo archivo**
   - Panel izquierdo → "+" → nuevo archivo
   - Nombre: `TodoList.sol`
   - Copiar todo el contenido de `contract/TodoList.sol`

3. **Compilar**
   - Panel izquierdo → "Solidity Compiler"
   - Seleccionar versión: `0.8.24`
   - Click en "Compile TodoList.sol"
   - Verifica que no haya errores (⚠️ warnings están OK)

4. **Desplegar en Monad Testnet**
   - Asegúrate de tener MON en MetaMask (testnet)
   - Panel izquierdo → "Deploy & Run Transactions"
   - Environment: "Injected Provider - MetaMask"
   - Network en MetaMask: **Monad Testnet** (chainId 10143)
   - Click en "Deploy"
   - Confirma la transacción en MetaMask

5. **Copiar dirección y ABI**
   - Después del deploy, verás la dirección del contrato (comienza con `0x`)
   - **Copia esa dirección** → la necesitarás en `frontend/.env`
   - Click en "Compilation Details" → copia el **ABI** completo
   - **Copia el ABI** → lo necesitarás en `frontend/src/config/abi.js`

### Fase 2: Setup del Frontend (15 min)

1. **Scaffold con Vite**
   ```bash
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install
   ```

2. **Instalar librerías Web3**
   ```bash
   npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
   ```

3. **Crear archivo `.env`**
   ```bash
   # frontend/.env
   VITE_CONTRACT_ADDRESS=0x...          # ← la dirección de Remix
   VITE_WALLETCONNECT_PROJECT_ID=...    # ← obtén gratis en cloud.walletconnect.com
   ```

### Fase 3: Configuración de Web3 (10 min)

Crea estos archivos en `frontend/src/config/`:

**chains.js** — Define la red Monad

**wagmi.js** — Configura RainbowKit y wagmi

**abi.js** — El ABI del contrato (pega el que copiaste de Remix)

### Fase 4: Los Componentes (45 min)

Crea componentes en `frontend/src/components/`:

- **ConnectButton.jsx** — Botón de conexión de wallet
- **NetworkBadge.jsx** — Muestra qué red estás conectado
- **TodoForm.jsx** — Formulario para agregar tareas
- **TodoList.jsx** — Lista de tareas
- **TodoItem.jsx** — Cada tarea (checkbox, editar, eliminar)

### Fase 5: Los Hooks (30 min)

Crea hooks en `frontend/src/hooks/` que conectan los componentes con el contrato:

- **useTodos.js** — Lee todas las tareas (getTodos)
- **useAddTodo.js** — Agrega una tarea (write)
- **useToggleTodo.js** — Marca completa/incompleta
- **useUpdateTodo.js** — Edita el texto
- **useDeleteTodo.js** — Elimina una tarea

### Fase 6: Probar en el Browser

```bash
cd frontend
npm run dev
```

Abre http://localhost:5173 — deberías ver:
1. Un botón "Connect Wallet"
2. Al conectar, un formulario para agregar tareas
3. Cada tarea aparece en la lista

---

## ⚠️ Troubleshooting

### "Contract not found" o dirección inválida
- Verifica que `VITE_CONTRACT_ADDRESS` en `.env` sea exacta
- Debe comenzar con `0x` y tener 42 caracteres

### "Wrong network"
- NetworkBadge debe decir "Monad Testnet"
- En MetaMask: verifica que hayas agregado Monad Testnet correctamente
  - RPC: `https://testnet.monad.xyz/`
  - chainId: `10143`

### "Sin MON para gas"
- Faucet: https://faucet.monad.xyz/
- Espera ~30 segundos después de solicitar

### ABI error / "function not found"
- Recompila el contrato en Remix
- Re-copia el ABI completo desde "Compilation Details"
- Reemplaza completamente el contenido de `src/config/abi.js`

### RainbowKit error sobre projectId
- Obtén uno gratis: https://cloud.walletconnect.com/
- Agrega a `frontend/.env`: `VITE_WALLETCONNECT_PROJECT_ID=tu_id_aqui`

---

## 🏗️ Cómo Funciona (Arquitectura)

```
┌─────────────────┐
│   MetaMask      │  ← Billetera (guarda claves privadas)
└────────┬────────┘
         │ firma transacciones
         ▼
┌─────────────────────────────────────────┐
│  Frontend (Vite + React)                │
│  ┌─────────────────────────────────────┐│
│  │  RainbowKit → Conexión bonita       ││
│  │  wagmi → Hooks para leer/escribir   ││
│  │  viem → Cliente Ethereum            ││
│  └─────────────────────────────────────┘│
└────────┬────────────────────────────────┘
         │ JSON-RPC (web3 calls)
         ▼
┌──────────────────────────┐
│  Monad Testnet (RPC)     │
│  └─ TodoList.sol         │  ← Tu contrato
└──────────────────────────┘
```

---

## 📚 Conceptos Clave

### `msg.sender`
En Solidity, `msg.sender` **siempre** es la dirección que envió la transacción. En una DApp web3, eso es la wallet conectada en MetaMask.

```solidity
// cada usuario ve solo sus propios todos
mapping(address => Todo[]) private _todos;

function getTodos() external view returns (Todo[] memory) {
    return _todos[msg.sender];  // ← automáticamente su wallet
}
```

### Write vs Read

- **Write** (transacciones)
  - Cambian estado del blockchain
  - Cuestan GAS (MON)
  - Necesitan confirmación
  - Ej: `addTodo()`, `deleteTodo()`

- **Read** (vistas)
  - Solo consultan, no cambian
  - Gratis (sin gas)
  - Inmediato
  - Ej: `getTodos()`

### Events
El contrato emite eventos para que el frontend sepa qué ocurrió:

```solidity
event TodoAdded(address indexed owner, uint256 id, string text);
emit TodoAdded(msg.sender, newId, text);
```

El frontend puede escuchar estos eventos o simplemente **refetch** los datos.

---

## 🎓 Qué Aprendiste

✅ Solidity básico (structs, mappings, modifiers)
✅ Desplegar en una testnet
✅ Conectar MetaMask a una web
✅ Leer/escribir datos en blockchain
✅ Que un DApp es solo HTML + JS + Web3

---

## 🚢 Próximos Pasos (fuera del scope del workshop)

- Agregar persistencia local (localStorage) para UX offline
- Tests en Solidity (Hardhat, Foundry)
- Deploy en mainnet (con tu propio dinero)
- Agregar permisos (solo el propietario puede ver X)
- Tokenizar (ERC-20, NFTs)

---

## 📖 Enlaces Útiles

- [Remix IDE](https://remix.ethereum.org)
- [Monad Docs](https://docs.monad.xyz/)
- [Faucet Monad](https://faucet.monad.xyz/)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Wagmi Docs](https://wagmi.sh/)
- [Solidity by Example](https://solidity-by-example.org/)

---

**Creado para:** Hackathon BlockChain Workshop | **Nivel:** Principiantes | **Tiempo total:** ~2 horas

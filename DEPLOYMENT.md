# Deployment Guide — TodoList DApp

Complete step-by-step guide to deploy and test the TodoList DApp on Monad Testnet.

---

## 📋 Checklist Previo

- [ ] MetaMask instalado y creada una wallet
- [ ] MON tokens en la wallet (obtén gratis en faucet.monad.xyz)
- [ ] Monad Testnet agregado a MetaMask (ver "Agregar Monad Testnet" más abajo)
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Este repo clonado o descargado

---

## 🔧 Fase 1: Agregar Monad Testnet a MetaMask

Monad Testnet no viene pre-agregado en MetaMask, debes agregarlo manualmente.

### Opción A: Manual (paso a paso)

1. Abre MetaMask
2. Click en el selector de redes (arriba) → "Add Network"
3. Llena los datos:
   - **Network Name:** Monad Testnet
   - **RPC URL:** https://testnet.monad.xyz/
   - **Chain ID:** 10143
   - **Currency Symbol:** MON
   - **Block Explorer URL:** https://testnet.monadexplorer.com
4. Click "Save"

### Opción B: Automático (MetaMask sugerirá agregar)

Cuando intentes desplegar desde Remix (Fase 2), si no tienes Monad Testnet agregado, MetaMask te pedirá que lo agregues automáticamente.

---

## 💎 Fase 2: Obtener MON Tokens

1. Ve a https://faucet.monad.xyz/
2. Conecta tu wallet de MetaMask
3. Click "Request Tokens"
4. Espera ~30 segundos — verás el MON en tu wallet

---

## 🚀 Fase 3: Desplegar el Contrato en Remix

### Paso 1: Abrir Remix IDE

```
https://remix.ethereum.org
```

### Paso 2: Crear el Contrato

1. En el panel izquierdo, click en "File Explorer"
2. Click en el botón "+" para crear nuevo archivo
3. Nombre: `TodoList.sol`
4. Copia TODO el contenido de `contract/TodoList.sol` del repo y pégalo

### Paso 3: Compilar

1. Panel izquierdo → "Solidity Compiler"
2. Versión: `0.8.24`
3. Click "Compile TodoList.sol"
4. Verifica que no haya errores (⚠️ advertencias están bien)

### Paso 4: Desplegar

1. Panel izquierdo → "Deploy & Run Transactions"
2. Environment: Selecciona "Injected Provider - MetaMask"
3. Verifica en MetaMask que:
   - Wallet está conectada
   - Red es "Monad Testnet" (no Mainnet ni otra red)
4. En Remix, bajo "Contract", selecciona "TodoList"
5. Click el botón "Deploy"
6. MetaMask pedirá confirmar → click "Confirm"
7. **Espera 10-30 segundos** mientras la transacción se confirma

### Paso 5: Copiar la Dirección del Contrato

Después del deploy, verás en la sección "Deployed Contracts":

```
TodoList at 0x1234567890ABCDEF...
```

**Copia esa dirección completa** (comienza con `0x`). La necesitarás para el frontend.

### Paso 6: Copiar el ABI

1. En el panel izquierdo de Remix, todavía en "Solidity Compiler"
2. Click en "Compilation Details" (abajo)
3. Busca el bloque `"abi": [ ... ]`
4. Click en el botón pequeño que aparece a la derecha para copiar al clipboard
5. El ABI está ahora copiado

---

## 🎨 Fase 4: Configurar el Frontend

### Paso 1: Crear el `.env`

En la carpeta `frontend/`, crea un archivo llamado `.env` (sin extensión):

```bash
VITE_CONTRACT_ADDRESS=0x...          # ← Pega la dirección de Remix aquí
VITE_WALLETCONNECT_PROJECT_ID=abc... # ← Sigue el Paso 2 abajo
```

**Obtén un WalletConnect Project ID (gratis):**

1. Ve a https://cloud.walletconnect.com/
2. Click "Create New Project"
3. Ingresa un nombre: "TodoList DApp"
4. Copia el Project ID (es un string largo)
5. Pégalo en `.env` como `VITE_WALLETCONNECT_PROJECT_ID`

### Paso 2: Actualizar el ABI

1. Abre `frontend/src/config/abi.js`
2. Reemplaza todo lo que está dentro de `export const TODO_LIST_ABI = [ ... ]`
3. **Pega el ABI que copiaste de Remix**
4. Guarda el archivo

La estructura debe verse así:

```javascript
export const TODO_LIST_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "text",
        "type": "string"
      }
    ],
    // ... más funciones, events, etc.
  }
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
```

---

## 🏃 Fase 5: Correr el Frontend

### Paso 1: Instalar dependencias (si aún no las instalaste)

```bash
cd frontend
npm install
```

### Paso 2: Iniciar el servidor de desarrollo

```bash
npm run dev
```

Verás algo como:

```
  VITE v6.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

### Paso 3: Abrir en el navegador

1. Ve a http://localhost:5173/
2. Deberías ver el DApp con un botón "Connect Wallet"

---

## 🧪 Fase 6: Probar el DApp

### Test 1: Conectar Wallet

1. Click en "Connect Wallet"
2. MetaMask modal abre mostrando opciones de wallet
3. Click en "MetaMask"
4. Confirma en MetaMask
5. Deberías ver tu dirección conectada en RainbowKit

### Test 2: Verificar Red

- NetworkBadge (arriba) debe decir "Connected to Monad Testnet"
- Si dice algo diferente, cambia la red en MetaMask a "Monad Testnet"

### Test 3: Crear Tu Primer Todo

1. Escribe un task en el input: "Learn Solidity"
2. Click "Add Task"
3. MetaMask pide confirmar la transacción → click "Confirm"
4. **Espera 5-10 segundos** mientras se confirma
5. Deberías ver el todo aparecer en la lista

### Test 4: Operaciones CRUD

- **Toggle (Checkbox):** Click en el checkbox → debe tacharse y ponerse gris
- **Edit (Editar):** Doble click en el texto → entra en modo editar → escribe nuevo texto → presiona Enter
- **Delete (Eliminar):** Click botón "✕" → confirma en el alert → el todo desaparece

### Test 5: Multi-Usuario

1. Abre una ventana incógnito/privada
2. Ve a http://localhost:5173/
3. Conecta una DIFERENTE wallet (crea una segunda en MetaMask o importa otra)
4. Deberías ver una lista VACÍA de todos
5. Crea un todo en esta segunda wallet
6. Vuelve a la primera ventana (actualiza la página)
7. **Los todos de la segunda wallet NO deben aparecer aquí**

✅ Esto comprueba que el aislamiento multi-usuario funciona (`msg.sender`).

---

## 🔍 Verificar Transacciones en Blockchain

1. Después de cualquier operación, copia el hash de la transacción (MetaMask te lo muestra)
2. Ve a https://testnet.monadexplorer.com/
3. Pega el hash en la search bar
4. Deberías ver:
   - Tu wallet como "From"
   - La dirección del contrato como "To"
   - Los datos llamados (función que ejecutaste)
   - Estado: "Success"

---

## ⚠️ Troubleshooting

### "No todos encontrados" / "Empty state"

- Verifica que `VITE_CONTRACT_ADDRESS` en `.env` sea correcto (comienza con `0x`, 42 caracteres)
- Verifica que estés conectado a **Monad Testnet** en MetaMask
- Recarga la página (`Ctrl+R` o `Cmd+R`)
- Abre la consola del navegador (`F12` → pestaña "Console") y busca errores

### "Contract not found" en la consola

- El ABI no fue actualizado correctamente en `src/config/abi.js`
- Recompila el contrato en Remix y re-copia el ABI completo
- Verifica que sea un array válido de JSON

### "Conexión rechazada" / MetaMask no abre

- Verifica que tengas MON tokens en la wallet (sino, usa el faucet)
- Intenta desconectar y reconectar la wallet

### La transacción se "queda pendiente" por >30 segundos

- Las redes de testnet pueden ser lentas
- Espera un poco más, o verifica en el explorer si se confirmó
- Si realmente se atascó, en MetaMask → Settings → Advanced → Clear activity tab

### RainbowKit muestra error sobre projectId

- Obtén un Project ID gratis en https://cloud.walletconnect.com/
- Asegúrate de que `VITE_WALLETCONNECT_PROJECT_ID` en `.env` sea correcto

---

## 📦 Build para Producción

Cuando todo funcione y quieras desplegarlo (opcional):

```bash
cd frontend
npm run build
npm run preview
```

Esto crea una carpeta `dist/` que puedes subir a:
- Vercel (drag & drop)
- Netlify (drag & drop)
- GitHub Pages
- Cualquier hosting estático

---

## 📚 Conceptos Clave Reforzados

**msg.sender:** En Solidity, siempre es la wallet que llamó la función. Por eso cada wallet ve solo sus própios todos.

**Write vs Read:**
- Write (add, toggle, update, delete) = transacción en blockchain = cuesta gas = lento (5-10s)
- Read (get todos) = solo consulta = gratis = muy rápido (milisegundos)

**Events:** Cada operación emite un evento (TodoAdded, TodoToggled, etc.). El frontend escucha o simplemente refetch cada 4s.

**Soft Delete:** En lugar de eliminar del array (caro en gas), marcamos `exists=false`. El frontend filtra.

---

## ✅ Checklist Final

- [ ] MetaMask setup con Monad Testnet
- [ ] MON tokens obtenidos del faucet
- [ ] Contrato desplegado en Remix
- [ ] Dirección del contrato copiada a `.env`
- [ ] ABI copiado a `src/config/abi.js`
- [ ] WalletConnect Project ID en `.env`
- [ ] Frontend `npm run dev` ejecutándose
- [ ] Wallet conectada en el DApp
- [ ] Primer todo creado exitosamente
- [ ] CRUD operaciones probadas
- [ ] Multi-usuario verificado
- [ ] Transacciones visibles en Monad Explorer

---

**¡Felicidades! Tu TodoList DApp está completamente funcional.** 🎉

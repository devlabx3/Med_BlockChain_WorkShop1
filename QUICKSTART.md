# QuickStart — TodoList DApp

Comienza en 5 minutos. Lee esto primero.

---

## 🎯 ¿Qué vamos a construir?

Una aplicación web (DApp) que:
1. Te conectas con tu wallet (MetaMask)
2. Creas, editas, completas y eliminas tareas
3. **Todo se guarda en blockchain** (Monad Testnet)
4. Cada wallet tiene su propia lista (privada)

---

## 📦 Proyecto Incluye

- **Smart Contract** (Solidity) — lógica en blockchain
- **Frontend** (React + Vite) — interfaz web
- **Web3 Connection** (RainbowKit + wagmi) — conectar wallet

---

## ⚡ El Flujo (Super Simple)

```
Tu Navegador
     ↓
[React App con botón "Add Task"]
     ↓
[Se conecta a tu MetaMask wallet]
     ↓
[Envía transacción al Smart Contract en Monad Testnet]
     ↓
[Contrato guarda: { id: 1, text: "Learn", owner: tu_wallet }]
     ↓
[App recibe confirmación y muestra la tarea]
```

---

## 📋 Requisitos (5 min de setup)

- [ ] **MetaMask** instalado (extension de Chrome/Firefox)
- [ ] **MON tokens** (gratis de faucet.monad.xyz)
- [ ] **Node.js 18+** (`npm --version`)
- [ ] Este repo descargado

---

## 🚀 En 3 Pasos Llegamos a Funcionando

### Paso 1: Desplegar Contrato (20 min)

**Abre:** https://remix.ethereum.org

1. Crear archivo `TodoList.sol`
2. Copiar contenido de `contract/TodoList.sol` del repo
3. Compilar (Solidity Compiler → v0.8.24)
4. Deploy (Deploy & Run Transactions → Injected Provider)
5. **Copiar dirección** que aparece después (ej: `0x1234...`)

**Guardar:** Esa dirección te la va a pedir el frontend.

---

### Paso 2: Configurar Frontend (5 min)

En la carpeta `frontend/`, crear archivo `.env`:

```
VITE_CONTRACT_ADDRESS=0x...    # ← pega lo del paso 1
VITE_WALLETCONNECT_PROJECT_ID=a1b2c3...  # ← obtén aquí: cloud.walletconnect.com
```

También copiar el ABI del contrato (desde Remix → Compilation Details) y pegarlo en:
```
frontend/src/config/abi.js
```

---

### Paso 3: Correr la App (2 min)

```bash
cd frontend
npm install    # (solo la primera vez)
npm run dev
```

Abre: http://localhost:5173/

---

## ✅ Test Quick Checklist

- [ ] Página carga (ves botón "Connect Wallet")
- [ ] Conectas wallet (MetaMask pide confirmación)
- [ ] Escribes "Buy groceries" y haces click "Add Task"
- [ ] Aparece en la lista en ~5 segundos
- [ ] Haces click checkbox → se tacha
- [ ] Doble click el texto → puedes editar
- [ ] Click "✕" → se elimina

**¡Si todo funciona, felicidades! 🎉**

---

## 📖 Documentación Completa

- **README.md** — Guía paso a paso con conceptos
- **DEPLOYMENT.md** — Setup detallado + troubleshooting
- **contract/TodoList.sol** — Contrato con comentarios
- **frontend/src/** — Componentes bien comentados

---

## 🧠 Lo Que Aprendiste (en 1-2 horas)

✅ Escribir un smart contract en Solidity
✅ Desplegar en blockchain (Monad Testnet)
✅ Conectar wallet con RainbowKit
✅ Leer/escribir datos en blockchain desde web
✅ Que "write" cuesta gas y es lento, "read" es gratis y rápido
✅ Que `msg.sender` == la wallet que hace la llamada

---

## 🎯 Próximos Desafíos (opcional)

- Agregar persistencia local (localStorage) para UX offline
- Agregar permisos (solo el owner puede ver X)
- Agregar categorías/tags a los todos
- Hacer el deploy público (Vercel, Netlify)
- Auditar el contrato (seguridad)

---

## 💬 Si Algo No Funciona

1. **Lee** la sección "⚠️ Troubleshooting" en DEPLOYMENT.md
2. **Verifica** que tengas MON tokens (faucet.monad.xyz)
3. **Abre** consola del navegador (`F12` → Console) y ve si hay errores
4. **Comprueba** que la dirección del contrato en `.env` sea correcta

---

**Ya estás listo. ¡Adelante!** 🚀

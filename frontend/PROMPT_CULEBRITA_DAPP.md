# 🐍 PROMPT - Construir Culebrita dApp con RainbowKit

## 📋 Requisitos

**Objetivo**: Crear una dApp del clásico juego Snake (Culebrita) integrada con blockchain en Monad Testnet.

**Tecnologías**:
- React 18 + Vite (SPA)
- Wagmi v2 + Viem v2
- RainbowKit v2
- TanStack React Query v5
- Solidity (smart contract)

**Red**: Monad Testnet  
**Contract**: 0xF6F99CE3FFe2747EdAF79402a7F48414340A3a5C

---

## 🔑 Consideraciones Clave (Reglas de RainbowKit)

### 1. **Chain Configuration**
- ⚠️ **NUNCA** hardcodear la chain en un objeto `{id, name, rpc, ...}`
- ✅ **SIEMPRE** importar de `wagmi/chains` (ej: `import { monadTestnet } from "wagmi/chains"`)
- Re-exportar la chain desde `config.js` para que `App.jsx` la importe de un único lugar

### 2. **Provider Stack Order** (CRÍTICO)
```
WagmiProvider 
  ↓
QueryClientProvider 
  ↓
RainbowKitProvider
  ↓
App
```
❌ **No** reordenar. Si los cambias de orden, se rompen los hooks de wagmi.

### 3. **RPC URL**
- ✅ Siempre desde variable de entorno: `import.meta.env.VITE_CHAIN_RPC_URL`
- ✅ Guardar en `.env` (y `.env.example` para documentación)
- ❌ Nunca hardcodeada en el código

### 4. **Smart Contract Address y ABI**
- ✅ Address desde: `import.meta.env.VITE_CULEBRITA_CONTRACT_ADDRESS`
- ✅ ABI se define/importa en `config.js` y se exporta
- ✅ App.jsx importa address y ABI desde `config.js`
- ❌ Nunca definir contract details directamente en componentes

### 5. **useReadContract** (lectura de datos)
```javascript
const { data, isLoading, refetch } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: "getPlayer",
  args: [playerAddress],
  account: playerAddress,  // ← Si la función depende de msg.sender
});
```

### 6. **useWriteContract + useWaitForTransactionReceipt**
```javascript
const { writeContract, isPending, data: txHash } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
  hash: txHash 
});

// CRÍTICO: Refetch después de éxito
useEffect(() => {
  if (isSuccess) {
    refetch();  // ← Esto es obligatorio
  }
}, [isSuccess]);

// Botón siempre tiene:
<button disabled={isPending || isConfirming}>
```

### 7. **Estilos de RainbowKit**
```javascript
// main.jsx - UNA SOLA VEZ, al inicio
import "@rainbow-me/rainbowkit/styles.css";
```

### 8. **SSR siempre false**
```javascript
const wagmiConfig = getDefaultConfig({
  // ...
  ssr: false,  // ← Es una SPA, no SSR
});
```

---

## 🏗️ Estructura del Proyecto

```
frontend/casoX/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx        # Renderiza el tablero 20x20
│   │   ├── GameBoard.css
│   │   ├── PlayerPanel.jsx      # Panel de registro y score
│   │   ├── PlayerPanel.css
│   │   ├── Leaderboard.jsx      # Top 10 jugadores
│   │   └── Leaderboard.css
│   ├── config.js                # ⭐ Wagmi + ABI + Chain
│   ├── App.jsx                  # Lógica principal del juego
│   ├── App.css
│   ├── main.jsx                 # Provider stack
│   ├── index.css                # Estilos globales
│   └── index.html
├── package.json
├── vite.config.js
├── .env                         # Variables del entorno
├── .env.example                 # Template (incluir en repo)
└── README.md
```

---

## 📝 Pasos para Construir

### Paso 1: Inicializar Proyecto
```bash
npm create vite@latest culebrita-dapp -- --template react
cd culebrita-dapp
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

### Paso 2: Crear `config.js`
- Importar `getDefaultConfig` de RainbowKit
- Importar `monadTestnet` de `wagmi/chains`
- Exportar `wagmiConfig` con provider stack
- Exportar `CULEBRITA_ABI` (el ABI del contrato)
- Exportar `CULEBRITA_CONTRACT_ADDRESS` desde env

### Paso 3: Crear `main.jsx` (Provider Stack)
- Importar `QueryClient`, `QueryClientProvider`
- Importar `WagmiProvider`, `RainbowKitProvider`
- Importar `@rainbow-me/rainbowkit/styles.css` ⭐
- Provider order: WagmiProvider → QueryClientProvider → RainbowKitProvider
- Renderizar App

### Paso 4: Crear `App.jsx` (Lógica del Juego)

**Estado necesario**:
```javascript
const [gameState, setGameState] = useState("menu"); // menu, playing, gameOver
const [score, setScore] = useState(0);
const [snake, setSnake] = useState([{x, y}]);
const [food, setFood] = useState({x, y});
const [direction, setDirection] = useState({x, y});
const [nextDirection, setNextDirection] = useState({x, y});
```

**Lógica clave**:
- useEffect para manejar input de teclado (↑↓←→, WASD, Enter)
- useEffect para el game loop (setInterval)
- Detección de colisiones:
  - ✅ Paredes (Game Over si toca límites)
  - ✅ Comida (crecer y sumar puntos)
  - ✅ Cuerpo propio (Game Over si se choca)
- generateFood() para generar comida en posición aleatoria sin colisionar con snake

**Opcionales pero recomendados**:
- Audio de fondo (fetch de URL o local)
- useAccount hook para obtener dirección del usuario

### Paso 5: Crear `GameBoard.jsx`
- Renderizar grid 20x20 con CSS Grid
- Mostrar posiciones de snake (cabeza diferente)
- Mostrar posición de food
- Cada celda debe actualizar su clase según si es cabeza, cuerpo, comida o vacía

### Paso 6: Crear `PlayerPanel.jsx`
**Funcionalidad**:
- useReadContract para `getPlayer(address)` - obtener nickname y topScore
- useReadContract para `playerExists(address)` - verificar si está registrado
- useWriteContract para `registerPlayer(nickname)`
- useWriteContract para `updateScore(newScore)` - solo si newScore > topScore actual
- useWaitForTransactionReceipt para ambas escrituras
- useEffect con refetch() después de isSuccess

**Flujo**:
1. Si no está registrado → mostrar form de registro
2. Si está registrado → mostrar datos (nickname, topScore, currentScore)
3. Si currentScore > topScore → mostrar botón "Guardar Score"
4. Guardar en localStorage también (para leaderboard)

### Paso 7: Crear `Leaderboard.jsx`
- Leer desde localStorage
- Mostrar top 10 ordenado por score descendente
- Escuchar evento `leaderboard-updated` para refrescar en tiempo real
- Mostrar rank, nombre y score

### Paso 8: Crear CSS
**Requisitos**:
- Tema espacial: fondo oscuro (#000814 o similar)
- Estrellas animadas de fondo
- Colores neón: verde primario (#00ff88), azul secundario (#0099ff)
- Efectos glow en bordes y textos (text-shadow, box-shadow)
- Grid del juego con gradientes
- Tablero con borde brillante
- Responsive para mobile

---

## 🎮 Mecánica del Juego

### Colisiones:
1. **Pared**: newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT → **Game Over**
2. **Comida**: newHead coincide con food → **+10 puntos**, generar nueva comida, **crecer**
3. **Cuerpo**: newHead coincide con snake segment → **Game Over**

### Movimiento:
- Prevenir que gire 180° (si va derecha, no puede ir izquierda inmediatamente)
- Usar `nextDirection` para input y `direction` para movimiento actual

### Game Loop:
- Interval de ~200ms es suficiente
- En cada tick:
  1. Calcular newHead
  2. Verificar colisiones
  3. Mover snake
  4. Actualizar score/comida

---

## 🔗 Blockchain Integration

### Smart Contract Funciones:
```solidity
registerPlayer(string nickname)      // Registra nuevo jugador
updateScore(uint256 newScore)        // Actualiza score si es mayor
getPlayer(address) → (nickname, topScore)
playerExists(address) → bool
```

### En la dApp:
- **Registro**: Llamar `registerPlayer` cuando el usuario ingresa nickname
- **Save Score**: Llamar `updateScore` con el score actual cuando termina el juego
- **Lectura**: `getPlayer` para mostrar datos en PlayerPanel
- **Verificación**: `playerExists` para mostrar form o datos existentes

---

## 📋 Checklist de Implementación

- [ ] Proyecto Vite + React instalado
- [ ] Dependencias: wagmi, viem, rainbowkit, react-query
- [ ] `.env` con variables de Monad Testnet
- [ ] `config.js` con wagmiConfig, ABI, Chain
- [ ] `main.jsx` con provider stack correcto
- [ ] `App.jsx` con lógica del juego
  - [ ] Estado del juego
  - [ ] Input handling (teclado)
  - [ ] Game loop
  - [ ] Detección de paredes ✅
  - [ ] Detección de comida
  - [ ] Detección de colisión con cuerpo
- [ ] `GameBoard.jsx` renderiza 20x20 grid
- [ ] `PlayerPanel.jsx` lee/escribe en contrato
  - [ ] Registro de jugador
  - [ ] Lectura de datos
  - [ ] Save score
  - [ ] localStorage
- [ ] `Leaderboard.jsx` muestra top 10
  - [ ] Lee localStorage
  - [ ] Escucha eventos
  - [ ] Se recarga
- [ ] CSS con tema espacial
- [ ] Build sin errores: `npm run build`
- [ ] Deploy listo

---

## ⚠️ Errores Comunes a Evitar

1. ❌ **Reordenar providers** → Wagmi hooks se rompen
2. ❌ **Hardcodear chain** → Usar `wagmi/chains`
3. ❌ **Hardcodear RPC/Address** → Usar `.env`
4. ❌ **Olvidar refetch()** → Datos no se actualizan post-TX
5. ❌ **Olvidar disabled states** → Botones pueden doblarse
6. ❌ **No definir ABI** → Contract calls fallan
7. ❌ **Wrap-around en walls** → Usar modulo % hace que aparezca al otro lado
8. ❌ **No validar input** → Nicknamen vacíos o inválidos

---

## 🎯 Resultado Final Esperado

✅ Juego Snake funcional con:
- Controles con teclado
- Colisión con paredes = Game Over
- Crecimiento al comer comida
- Sistema de puntos
- Conexión de wallet con RainbowKit
- Registro en smart contract
- Guardado de score en blockchain
- Top 10 leaderboard
- Tema visual futurista/espacial
- Música de fondo
- Responsive design

---

## 📚 Referencias

- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Wagmi v2 Docs](https://wagmi.sh/)
- [wagmi/chains](https://wagmi.sh/react/chains)
- [Vite Docs](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/)

---

## 💡 Tips Bonus

1. **Testing**: Prueba primero sin contrato (game loop + UI)
2. **Debugging**: Console.log en useEffect para ver qué se dispara
3. **Performance**: useCallback para funciones que se pasan como deps
4. **Música**: Usa Audio API de JS, con control de volumen
5. **localStorage**: Sirve como "backend temporal" para leaderboard
6. **Events**: Usar `window.dispatchEvent` para comunicación entre componentes
7. **CSS Grid**: Perfecto para tableros 2D como Snake
8. **Vite Env**: Solo `.env` files con prefijo `VITE_` son expuestos

---

**¡Ahora tú! 🚀**

Usa esta guía para reconstruir la Culebrita dApp desde cero.

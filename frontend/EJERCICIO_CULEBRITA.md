# 🐍 EJERCICIO - Culebrita dApp con RainbowKit

## Enunciado

Construye una dApp del clásico juego Snake (Culebrita) integrada con blockchain en **Monad Testnet** usando **RainbowKit + Wagmi + React + Vite**.

### Requisitos Funcionales

1. **Juego Snake**
   - Tablero 20x20
   - Controles: flechas (↑↓←→) o WASD
   - Serpiente crece al comer comida
   - Puntuación: +10 por comida
   - Game Over si:
     - Choca contra pared
     - Choca consigo misma
   
2. **Blockchain Integration**
   - Conectar wallet con RainbowKit
   - Registrar nickname en smart contract
   - Guardar top score en blockchain
   - Permitir actualizar score solo si es mayor al actual
   
3. **UI Components**
   - GameBoard: Renderizar grid con snake + comida
   - PlayerPanel: Mostrar perfil, registro, save score
   - Leaderboard: Top 10 jugadores ordenados por score
   
4. **Persistencia**
   - localStorage para leaderboard local
   - Blockchain para data permanente

5. **Diseño**
   - Tema espacial: fondo oscuro con estrellas
   - Colores neón: verde (#00ff88) + azul (#0099ff)
   - Responsive (mobile + desktop)
   - Música de fondo (opcional)

### Red & Contrato

```
Chain: Monad Testnet
Contract: 0xF6F99CE3FFe2747EdAF79402a7F48414340A3a5C
RPC: https://monad-testnet.g.alchemy.com/v2/uAf5-PCiQhSYESR3WOt81
Project ID: 05b0564c6afd9cca5c24433117d22f43

Contract ABI:
- registerPlayer(nickname) → void
- updateScore(newScore) → void
- getPlayer(address) → (nickname, topScore)
- playerExists(address) → bool
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite (SPA) |
| Web3 | Wagmi v2 + Viem v2 |
| Wallet | RainbowKit v2 |
| Data | TanStack Query v5 |
| Blockchain | Solidity (contrato existente) |

---

## Estructura Esperada

```
frontend/caso4/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx      # Grid 20x20, snake + food
│   │   ├── GameBoard.css
│   │   ├── PlayerPanel.jsx    # Perfil, registro, save
│   │   ├── PlayerPanel.css
│   │   ├── Leaderboard.jsx    # Top 10
│   │   └── Leaderboard.css
│   ├── config.js              # ⭐ Wagmi config, ABI, Chain
│   ├── App.jsx                # Lógica del juego
│   ├── App.css
│   ├── main.jsx               # Provider stack
│   ├── index.css
│   └── index.html
├── package.json
├── vite.config.js
├── .env
└── .env.example
```

---

## Puntos Clave a Recordar

### 🚨 CRÍTICO - Reglas de RainbowKit

1. **Chain**: Importar de `wagmi/chains`, nunca hardcodear
   ```javascript
   import { monadTestnet } from "wagmi/chains";
   ```

2. **Provider Stack** (orden FIJO):
   ```
   WagmiProvider
     → QueryClientProvider
       → RainbowKitProvider
         → App
   ```

3. **Config.js**:
   - Exportar `wagmiConfig` (getDefaultConfig)
   - Exportar `CULEBRITA_ABI` 
   - Exportar `CULEBRITA_CONTRACT_ADDRESS` (desde env)
   - Re-exportar `monadTestnet`

4. **Variables de Entorno**:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=...
   VITE_CHAIN_RPC_URL=...
   VITE_CULEBRITA_CONTRACT_ADDRESS=...
   ```

5. **useReadContract** → para leer datos del contrato
   ```javascript
   const { data, refetch } = useReadContract({
     address: CONTRACT_ADDRESS,
     abi: ABI,
     functionName: "getPlayer",
     args: [address],
   });
   ```

6. **useWriteContract + useWaitForTransactionReceipt**:
   ```javascript
   const { writeContract, isPending, data: txHash } = useWriteContract();
   const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
   
   // OBLIGATORIO:
   useEffect(() => {
     if (isSuccess) refetch();
   }, [isSuccess]);
   
   // Botón: disabled={isPending || isConfirming}
   ```

7. **RainbowKit Styles**: Solo una vez en `main.jsx`
   ```javascript
   import "@rainbow-me/rainbowkit/styles.css";
   ```

---

## Pasos Recomendados

### Fase 1: Setup
- [ ] Crear proyecto Vite + React
- [ ] Instalar deps: wagmi, viem, rainbowkit, react-query
- [ ] Crear `.env` con variables Monad

### Fase 2: Web3 Setup
- [ ] Crear `config.js` con wagmiConfig
- [ ] Crear `main.jsx` con provider stack
- [ ] Verificar que RainbowKit conecta wallet

### Fase 3: Juego Base
- [ ] `App.jsx`: Estado + game loop (sin blockchain primero)
- [ ] `GameBoard.jsx`: Renderizar grid
- [ ] Controles de teclado
- [ ] Colisión con paredes
- [ ] Colisión con comida
- [ ] Colisión consigo mismo

### Fase 4: Blockchain
- [ ] `PlayerPanel.jsx`: Conectar useReadContract
- [ ] Mostrar si está registrado
- [ ] Formulario de registro
- [ ] Botón de save score
- [ ] useWaitForTransactionReceipt + refetch

### Fase 5: UI & Leaderboard
- [ ] `Leaderboard.jsx`: Leer localStorage
- [ ] CSS tema espacial
- [ ] Responsive design
- [ ] localStorage integration

### Fase 6: Pulido
- [ ] Música de fondo
- [ ] Efectos visuales
- [ ] Testing
- [ ] Build: `npm run build`

---

## Validación

Tu dApp debe cumplir:

- ✅ Game Over cuando choca contra pared
- ✅ Game Over cuando choca consigo mismo
- ✅ Come comida y crece
- ✅ Score aumenta (+10 por comida)
- ✅ RainbowKit conecta wallet
- ✅ Register nickname en contrato
- ✅ Save score solo si > topScore
- ✅ Leaderboard muestra top 10
- ✅ Tema espacial con colores neón
- ✅ Responsive en mobile
- ✅ Build sin errores

---

## Tips & Gotchas

### 🎯 Tips
- Construye el juego **sin blockchain primero**, luego integra
- Usa `console.log()` en useEffects para debugging
- Test en devtools → Network para ver TX confirmadas
- Usa `mockAddress` para testing sin wallet real

### ⚠️ Gotchas Comunes
- ❌ Reordenar providers → se rompen los hooks
- ❌ Olvidar refetch() → datos no actualizan
- ❌ Hardcodear chain/RPC → breaker en prod
- ❌ Wrapping con modulo (%) → snake aparece al otro lado (debe morir)
- ❌ Olvidar `disabled` en botones → pueden doblarse during TX
- ❌ No validar input → registro con nickname vacío
- ❌ No escuchar eventos → leaderboard no refresca

---

## Recursos

- Guía completa: `PROMPT_CULEBRITA_DAPP.md`
- Referencia: [wagmi.sh](https://wagmi.sh/)
- RainbowKit: [rainbowkit.com](https://www.rainbowkit.com/)

---

## ¡A Por Ello! 🚀

Construye la Culebrita dApp siguiendo estos pasos. 

Si te atascas, consulta:
1. La guía `PROMPT_CULEBRITA_DAPP.md`
2. Código actual en `frontend/caso4/`
3. Documentación de wagmi y RainbowKit

**Objetivo**: Que entiendas cada pieza del puzzle, no solo copiar-pegar.

Buena suerte! 🐍💚

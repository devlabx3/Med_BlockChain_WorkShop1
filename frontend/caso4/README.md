# 🐍 Culebrita - Monad Edition

Una dApp del clásico juego de la Culebrita integrada con Web3 en **Monad Testnet**.

## 🎮 Características

- **Juego Culebrita Clásico**: Controla la serpiente con teclado (↑↓←→ o WASD)
- **Web3 Integración**: Conecta tu wallet con RainbowKit
- **Smart Contract**: Guarda tu nickname y top score en blockchain
- **Estética Espacial**: Tema visual futurista con gradientes y efectos de luz
- **Música de Fondo**: Sonoridad inmersiva durante el juego
- **Responsive Design**: Juega en desktop o mobile

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env desde el template
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 📋 Variables de Entorno

```env
VITE_WALLETCONNECT_PROJECT_ID=05b0564c6afd9cca5c24433117d22f43
VITE_CHAIN_RPC_URL=https://monad-testnet.g.alchemy.com/v2/uAf5-PCiQhSYESR3WOt81
VITE_CULEBRITA_CONTRACT_ADDRESS=0xF6F99CE3FFe2747EdAF79402a7F48414340A3a5C
```

## 🕹️ Cómo Jugar

1. **Conecta tu wallet** - Haz clic en "Connect" y selecciona tu wallet
2. **Regístrate** - Ingresa tu nickname para ser identificado en blockchain
3. **Inicia el juego** - Presiona "Iniciar Juego"
4. **Come comida** - Controla la serpiente para comer las naranjas
5. **Guarda tu score** - Cuando termines, guarda tu puntaje en el smart contract

## 🎯 Controles

- **Flechas o WASD** - Mover la serpiente
- **Enter** - Iniciar/Reiniciar juego

## 🏗️ Stack Tecnológico

- **React 18** - Framework UI
- **Vite** - Build tool rápido
- **Wagmi v2** - Web3 hooks
- **Viem v2** - Blockchain primitives
- **RainbowKit v2** - Wallet connection UI
- **TanStack Query v5** - Data fetching

## 📱 Estructura

```
src/
├── components/
│   ├── GameBoard.jsx      # Tablero del juego
│   ├── PlayerPanel.jsx    # Panel de jugador y contrato
│   └── Leaderboard.jsx    # Tabla de puntuaciones
├── config.js              # Configuración de wagmi
├── App.jsx                # Componente principal
├── main.jsx               # Entry point
└── App.css                # Estilos principales
```

## 🔗 Smart Contract

**Dirección**: `0xF6F99CE3FFe2747EdAF79402a7F48414340A3a5C`

**Funciones**:
- `registerPlayer(nickname)` - Registrar jugador
- `updateScore(newScore)` - Actualizar puntuación
- `getPlayer(address)` - Obtener datos del jugador
- `playerExists(address)` - Verificar si existe jugador

## 🌐 Red

**Chain**: Monad Testnet  
**RPC**: https://monad-testnet.g.alchemy.com/v2/uAf5-PCiQhSYESR3WOt81

## 📝 Licencia

GPL-3.0

## 🎨 Diseño

- Tema oscuro con colores neón
- Gradientes azul-púrpura para fondo
- Verde neón (#00ff88) como color primario
- Efectos de brillo y sombras para profundidad
- Animaciones suaves para feedback visual

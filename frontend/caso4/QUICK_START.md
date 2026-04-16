# 🚀 Guía Rápida - Culebrita dApp

## ¡Ya está lista para jugar!

### Prerequisitos
- ✅ Node.js instalado
- ✅ Wallet conectada a Monad Testnet (MetaMask, Rainbow, etc.)
- ✅ MonadTest (tokens de prueba)

### Pasos para ejecutar

```bash
# 1. Instalar dependencias (ya hecho)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abre en tu navegador
# http://localhost:5173
```

### Para producción

```bash
# Build
npm run build

# Previsualizar
npm run preview
```

## 🎮 Cómo Jugar

1. **Abre la aplicación** en tu navegador
2. **Conecta tu wallet** - Haz clic en "Connect" en la esquina superior derecha
3. **Registra tu nickname** - Necesitas registrarte una sola vez en el contrato
4. **¡Comienza!** - Presiona "Iniciar Juego"
5. **Controla la culebrita** con las flechas (↑↓←→) o WASD
6. **Come las naranjas** para crecer y ganar puntos
7. **Evita chocar** contigo mismo
8. **Guarda tu score** al terminar

## 📝 Configuración Monad Testnet

El archivo `.env` ya contiene:
- **Chain RPC**: Alchemy Monad Testnet
- **WalletConnect Project ID**: 05b0564c6afd9cca5c24433117d22f43
- **Contrato Culebrita**: 0xF6F99CE3FFe2747EdAF79402a7F48414340A3a5C

## 🔧 Troubleshooting

### Error de conexión a wallet
- Verifica que tu wallet esté en **Monad Testnet**
- Recarga la página si es necesario
- Intenta cambiar de wallet (MetaMask, Rainbow, WalletConnect)

### Error al registrar
- Asegúrate de tener tokens MON para pagar el gas
- El nickname no puede estar vacío
- Ya podrías estar registrado con esa dirección

### Juego lento
- Verifica tu conexión a internet
- Reduce otras pestañas abiertas
- Intenta F5 para refrescar

## 🎨 Características Principales

✨ **Estética Espacial**
- Fondo con estrellas animadas
- Colores neón en verde y azul
- Efectos de brillo (glow) en UI

🎵 **Música de Fondo**
- Sonido ambient mientras juegas
- Control automático de volumen

🔗 **Blockchain**
- Registra tu nickname en el contrato
- Guarda tu top score permanentemente
- Verifica datos on-chain

📱 **Responsive**
- Juega en desktop o mobile
- Interfaz adaptativa

## 📊 Stack Tecnológico

- React 18 + Vite
- Wagmi v2 + Viem v2 (Web3)
- RainbowKit v2 (Wallet UI)
- TanStack Query v5

## 🤝 Soporte

Para problemas o sugerencias, revisa el README.md completo.

¡Que disfrutes el juego! 🐍

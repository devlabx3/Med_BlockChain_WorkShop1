<p align="center">
  <img src="Monad.png" alt="Monad Header" width="100%">
</p>

# 🚀 Taller de Desarrollo en Monad Blitz

¡Bienvenido al taller de desarrollo en **Monad**! Este repositorio está diseñado para que personas que nunca han interactuado con la blockchain puedan aprender desde lo más básico hasta crear una aplicación funcional (dApp) con operaciones completas.


Este evento es organizado por [**Medellín Block**](https://x.com/MedellinBlock) y el taller ha sido elaborado con mucho ❤️ por [**DevLabX3**](https://x.com/devlabx3).

## 📋 Tabla de Contenidos
1. [Prerrequisitos](#-prerrequisitos)
2. [Despliegue de Contratos (Remix)](#-despliegue-de-contratos-remix)
3. [Configuración del Proyecto](#-configuración-del-proyecto)
4. [Ruta de Aprendizaje (Casos de Uso)](#-ruta-de-aprendizaje-casos-de-uso)
5. [Cómo Ejecutar](#-cómo-ejecutar)

---

## 🛠️ Prerrequisitos

Antes de empezar, asegúrate de tener lo siguiente:

1.  **Wallet de Web3:** Descarga e instala [MetaMask](https://metamask.io/) o [Rabby Wallet](https://rabby.io/).
2.  **Red Monad Testnet:** Agregue la red a su wallet si aún no la tiene.
3.  **Fondos de Prueba (Faucet):** Obtén tokens MON gratuitos para pagar las transacciones en:
    *   👉 [Monad Testnet Faucet](https://faucet.trade/monad-testnet-mon-faucet)
4.  **Entorno Local:** Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

---

## 📜 Despliegue de Contratos (Remix)

Vamos a subir nuestros contratos inteligentes a la red de Monad usando **Remix IDE**.

1. Abre [Remix IDE](https://remix.ethereum.org/).
2. Crea dos archivos nuevos en la carpeta `contracts`: `Storage.sol` y `TodoList.sol`.
3. Copia el código de los archivos correspondientes de la carpeta `contract/` de este repositorio.
4. **Compilar:** Ve a la pestaña "Solidity Compiler" y haz clic en "Compile".
5. **Desplegar:**
   * Ve a "Deploy & Run Transactions".
   * En el campo "Environment", selecciona **Injected Provider - MetaMask**.
   * Asegúrate de que tu wallet esté en la red **Monad Testnet**.
   * Haz clic en "Deploy".
6. **Guardar Direcciones:** Una vez desplegados, copia las direcciones de los contratos (Contract Address). Las necesitarás para el archivo `.env`.

---

## ⚙️ Configuración del Proyecto

1. Crea una cuenta en [Reown (anteriormente WalletConnect)](https://cloud.reown.com/) y obtén un `Project ID`.
2. En la raíz del proyecto, verás un archivo llamado `.env.example`.
3. **Copia** su contenido y crea un nuevo archivo llamado `.env` en cada una de las carpetas de los casos:
   * `frontend/caso1/.env`
   * `frontend/caso2/.env`
   * `frontend/caso3/.env`
4. Llena los campos con tu `VITE_WALLETCONNECT_PROJECT_ID` y las direcciones de los contratos que desplegaste.

---

## 🗺️ Ruta de Aprendizaje (Casos de Uso)

El frontend está dividido en 3 niveles progresivos:

### 🔹 Caso 1: Conexión de Wallet
Aprende lo más básico: cómo permitir que un usuario conecte su wallet de MetaMask a tu sitio web usando **RainbowKit** y **Wagmi**.
*   **Ubicación:** `frontend/caso1`

### 🔹 Caso 2: Lectura y Escritura Simple
Interactuamos con el contrato `Storage.sol`. Aprenderás a leer un número de la blockchain y a guardar uno nuevo enviando una transacción.
*   **Ubicación:** `frontend/caso2`

### 🔹 Caso 3: CRUD Completo (TodoList)
El nivel final. Interactuamos con `TodoList.sol` para crear, leer, editar y eliminar tareas. Cada wallet tiene su propia lista privada en la blockchain.
*   **Ubicación:** `frontend/caso3`

---

## 🚀 Cómo Ejecutar

Para cualquiera de los casos (reemplazar `casoX` por 1, 2 o 3):

```bash
# Entrar a la carpeta del caso
cd frontend/casoX

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Luego, abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

¡Disfruta construyendo en Monad! 💜

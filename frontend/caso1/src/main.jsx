// ─────────────────────────────────────────────────────────────────────────────
// main.jsx — Punto de entrada de la aplicación
//
// Aquí se monta el árbol de Providers que envuelve toda la app.
// El orden importa: WagmiProvider va afuera porque RainbowKit depende de wagmi.
//
// Stack de providers (de afuera hacia adentro):
//   WagmiProvider          → gestión de wallets y estado de la red
//     QueryClientProvider  → caché de datos async (balances, contratos, etc.)
//       RainbowKitProvider → UI del modal de conexión
//         App              → tu aplicación
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";

// React Query: maneja el estado asíncrono (fetching, caching, revalidación).
// wagmi usa React Query internamente para leer datos de la blockchain.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// WagmiProvider: inyecta el contexto de wagmi en toda la app.
// Todos los hooks de wagmi (useAccount, useBalance, etc.) necesitan este provider.
import { WagmiProvider } from "wagmi";

// RainbowKitProvider: renderiza el modal de selección de wallets.
// darkTheme() genera un objeto de estilos con las variables de color de RainbowKit.
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

// CSS base de RainbowKit: estilos del modal, animaciones y fuentes.
// Debe importarse una sola vez, aquí en el entry point.
import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig } from "./config";
import App from "./App";
import "./index.css";

// QueryClient es la instancia del caché de React Query.
// Se crea fuera del componente para que no se reinicie en cada render.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode activa advertencias adicionales en desarrollo (doble render, etc.)
  <React.StrictMode>
    {/* WagmiProvider recibe la config con redes, transports y conectores */}
    <WagmiProvider config={wagmiConfig}>
      {/* QueryClientProvider habilita el caché para todos los hooks de wagmi */}
      <QueryClientProvider client={queryClient}>
        {/* RainbowKitProvider controla el tema visual del modal de conexión */}
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#836EF9",        // color morado de Monad
            accentColorForeground: "white",
            borderRadius: "large",
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

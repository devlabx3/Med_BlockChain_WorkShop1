# RainbowKit EVM dApp — Skill

Instrucciones y plantillas reutilizables para construir dApps en cualquier chain EVM usando:

- RainbowKit v2
- wagmi v2
- viem v2
- React + Vite

## Cómo usar el skill

Instala el archivo correspondiente a tu editor (ver abajo) y luego dile al AI:

> **"Usa RainbowKit con [chain]. Crea una dApp que [lo que necesites]"**

El AI aplicará automáticamente todos los patrones correctos. Solo cambia la chain y la RPC URL — el resto del código es idéntico para cualquier red EVM.

**Ejemplos de prompts:**
- `"Usa RainbowKit con Monad Testnet. Crea una dApp que muestre mi saldo"`
- `"Usa RainbowKit con Sepolia. Crea una dApp que lea y escriba un contrato Storage"`
- `"Usa RainbowKit con Base. Crea una dApp de lista de tareas con un contrato TodoList"`

---

## Instalación por editor

### Claude Code

Copia el CLAUDE.md al proyecto donde lo necesites:

```bash
cp skill/editors/claude/CLAUDE.md ./CLAUDE.md
```

O a nivel de proyecto en `.claude/`:

```bash
mkdir -p .claude && cp skill/editors/claude/CLAUDE.md .claude/CLAUDE.md
```

Claude Code leerá la regla canónica (`skill/rainbowkit-evm.rule.md`) y los templates directamente desde el repositorio.

---

### Cursor

```bash
mkdir -p .cursor/rules
cp skill/editors/cursor/rainbowkit-evm.mdc .cursor/rules/rainbowkit-evm.mdc
```

El archivo `.mdc` tiene frontmatter YAML con `globs` que limita la activación del skill a archivos React (`src/**/*.jsx`, `src/**/*.tsx`). No interfiere con `vite.config.js`, `package.json`, u otros archivos.

---

### Windsurf

**Opción A** — Carpeta de reglas (recomendado):
```bash
mkdir -p .windsurf/rules
cp skill/editors/windsurf/rainbowkit-evm.md .windsurf/rules/rainbowkit-evm.md
```

**Opción B** — Archivo único en raíz:
```bash
cp skill/editors/windsurf/rainbowkit-evm.md .windsurfrules
# o agregar el contenido al .windsurfrules existente
```

---

### Antigravity

```bash
mkdir -p .antigravity/rules
cp skill/editors/antigravity/rainbowkit-evm.md .antigravity/rules/rainbowkit-evm.md
```

> Nota: la ubicación exacta puede variar según la versión de Antigravity. Consulta la documentación del editor si la carpeta es diferente.

---

### Qwen Code

```bash
cp skill/editors/qwen/rainbowkit-evm.md ./QWEN.md
```

Qwen Code es un fork de Gemini CLI y usa `QWEN.md` en la raíz del proyecto como contexto persistente (equivalente al `GEMINI.md` de Gemini CLI). El archivo se carga automáticamente en cada sesión.

> Fuente: [https://qwen.ai/qwencode](https://qwen.ai/qwencode)

---

### OpenCode

```bash
cp skill/editors/opencode/rainbowkit-evm.md ./AGENTS.md
```

OpenCode usa `AGENTS.md` en la raíz del proyecto para contexto persistente. El archivo ayuda a OpenCode a entender la estructura del proyecto y los patrones de código, y debe ser commiteado a Git.

> Fuente: [https://opencode.ai/](https://opencode.ai/)

---

## Estructura de archivos

```
skill/
├── README.md                           # Este archivo
├── rainbowkit-evm.rule.md              # Regla canónica (fuente única de verdad)
├── env.example                         # Variables de entorno requeridas
├── templates/
│   ├── config.js                       # wagmiConfig + patrón de exportación de contratos
│   ├── main.jsx                        # Provider stack completo
│   ├── App.balance.jsx                 # Wallet + saldo nativo
│   ├── App.read-contract.jsx           # Lectura de contrato (sin wallet requerida)
│   ├── App.write-contract.jsx          # Lectura + escritura + TX lifecycle + toast
│   └── index.css                       # Tema oscuro opcional
└── editors/
    ├── claude/CLAUDE.md
    ├── cursor/rainbowkit-evm.mdc
    ├── windsurf/rainbowkit-evm.md
    ├── antigravity/rainbowkit-evm.md
    ├── qwen/rainbowkit-evm.md
    └── opencode/rainbowkit-evm.md
```

## Usar los templates

Los templates en `skill/templates/` son puntos de partida listos para copiar:

| Template | Cuándo usarlo |
|----------|---------------|
| `config.js` | Siempre — base de toda dApp |
| `main.jsx` | Siempre — provider stack |
| `App.balance.jsx` | Solo necesitas mostrar el saldo nativo |
| `App.read-contract.jsx` | Solo necesitas leer un contrato |
| `App.write-contract.jsx` | Necesitas leer Y escribir un contrato |
| `index.css` | Opcional — tema oscuro de referencia |

## Variables de entorno

Ver `skill/env.example`. Siempre necesitas al menos:

```
VITE_WALLETCONNECT_PROJECT_ID=    # https://cloud.reown.com (gratis)
VITE_CHAIN_RPC_URL=               # RPC del chain que uses
```

## Recursos útiles

- WalletConnect Project ID: https://cloud.reown.com
- Alchemy (RPC provider): https://alchemy.com
- Monad Testnet faucet: https://faucet.trade/monad-testnet-mon-faucet
- Monad Explorer: https://testnet.monadexplorer.com
- wagmi/chains lista completa: `import * as chains from "wagmi/chains"` y ver todas las exports

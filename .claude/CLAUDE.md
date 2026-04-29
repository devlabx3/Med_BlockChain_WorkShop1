# CLAUDE.md — RainbowKit EVM dApp Skill

Cuando el usuario diga **"usa RainbowKit con [chain]"** o pida construir una dApp EVM con RainbowKit + wagmi + viem, leer y seguir todas las reglas en:

```
skill/rainbowkit-evm.rule.md
```

## Templates disponibles (copiar y adaptar)

| Archivo | Cuándo usarlo |
|---------|---------------|
| `skill/templates/config.js` | Siempre — base de toda dApp |
| `skill/templates/main.jsx` | Siempre — provider stack |
| `skill/templates/App.balance.jsx` | Solo lectura de saldo nativo |
| `skill/templates/App.read-contract.jsx` | Solo lectura de contrato |
| `skill/templates/App.write-contract.jsx` | Lectura + escritura + TX lifecycle |
| `skill/templates/index.css` | Opcional — tema oscuro de referencia |
| `skill/env.example` | Variables de entorno requeridas |

## Resumen de reglas críticas

- Chain: importar de `wagmi/chains`, nunca definir manualmente
- Provider order: `WagmiProvider → QueryClientProvider → RainbowKitProvider`
- RPC: siempre `import.meta.env.VITE_CHAIN_RPC_URL`
- Contratos: address y ABI se exportan desde `config.js`
- Post-TX: `useEffect(() => { if (isSuccess) refetch(); }, [isSuccess])`
- Botones: `disabled={isPending || isConfirming}`

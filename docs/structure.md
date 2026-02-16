# Structure du projet

```
swifty-proteins/
├── expo/                    # App mobile (React Native)
│   ├── app/                 # Expo Router (file-based routing)
│   ├── components/          # Composants réutilisables
│   ├── lib/                 # Utilitaires (auth, trpc, storage)
│   ├── hooks/               # Custom hooks
│   ├── types/               # Types TypeScript
│   └── constants/           # Constantes (couleurs CPK, thème)
│
├── nextjs/                  # Backend API
│   ├── app/                 # Next.js App Router
│   ├── trpc/                # tRPC router & procedures
│   ├── prisma/              # Schema & migrations
│   ├── actions/             # Server actions
│   └── schemas/             # Zod schemas
│
├── docs/                    # Documentation
├── shared/                  # Code partagé (types)
└── CLAUDE.md
```

## Workflow de navigation

```
┌─────────────┐
│ Launch App  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Check Auth      │
│ (secure-store)  │
└────┬───────┬────┘
     │       │
     ▼       ▼
┌────────┐ ┌────────────┐
│ Login  │ │ Proteins   │
│ View   │ │ List       │
└────────┘ └─────┬──────┘
                 │
                 ▼
          ┌─────────────┐
          │ Protein     │
          │ 3D Viewer   │
          └─────────────┘
```

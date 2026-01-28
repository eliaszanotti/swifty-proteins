# Project Structure

## Monorepo Architecture

This project uses **pnpm workspaces** to manage both the mobile app and backend API in a single repository.

```
swifty-proteins/
├── expo/                    # Mobile app (React Native)
│   ├── app/                 # Expo Router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities & helpers
│   ├── hooks/               # Custom React hooks
│   └── package.json
│
├── nextjs/                  # Backend API (Next.js)
│   ├── app/                 # App Router pages & API routes
│   ├── server/              # tRPC routers & backend logic
│   ├── prisma/              # Database schema & migrations
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── docs/                    # Documentation
│   ├── commits.md           # Commit conventions
│   ├── tech-stack.md        # Technology choices
│   └── structure.md         # This file
│
├── .husky/                  # Git hooks
│   └── commit-msg           # Commitlint hook
│
├── pnpm-workspace.yaml      # Workspace configuration
├── package.json             # Root package.json
├── commitlint.config.js     # Commitlint rules
└── README.md                # Project overview
```

## Expo (Mobile App)

```
expo/
├── app/                     # Expo Router (file-based routing)
│   ├── (auth)/              # Auth group
│   │   ├── login.tsx        # Login screen
│   │   └── _layout.tsx      # Auth layout
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home / Protein list
│   │   ├── protein.tsx      # Protein 3D view
│   │   └── _layout.tsx      # Tabs layout
│   ├── _layout.tsx          # Root layout
│   └── splash.tsx           # Splash screen
│
├── components/              # Reusable components
│   ├── ui/                  # UI components (Button, Input, etc.)
│   ├── ProteinList.tsx      # Protein list component
│   ├── ProteinCard.tsx      # Protein card component
│   └── ProteinViewer3D.tsx  # 3D viewer component
│
├── lib/                     # Utilities
│   ├── api.ts               # tRPC client setup
│   ├── auth.ts              # Auth utilities
│   └── pdb-parser.ts        # PDB file parser
│
└── hooks/                   # Custom hooks
    ├── useAuth.ts           # Auth hook
    └── useBiometric.ts      # Biometric auth hook
```

## Next.js (Backend API)

```
nextjs/
├── app/                     # App Router
│   ├── api/                 # API routes (if needed)
│   └── layout.tsx           # Root layout
│
├── server/                  # Backend logic
│   ├── trpc/                # tRPC routers
│   │   ├── index.ts         # Main router
│   │   ├── auth.ts          # Auth router
│   │   └── protein.ts       # Protein router
│   ├── db.ts                # Database connection
│   └── auth.ts              # Auth logic
│
├── prisma/                  # Database
│   └── schema.prisma        # Database schema
│       model User {
│         id        String   @id
│         email     String   @unique
│         password  String
│       }
│
└── package.json
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Expo App                             │
│  ┌──────────┐   tRPC    ┌──────────┐    fetch .pdb    ┌───┴──┐ │
│  │  Login   │ ────────► │  API     │ ────────────────► │ PDB  │ │
│  │  Screen  │           │ Calls    │                   │ RCSB │ │
│  └──────────┘           └──────────┘                   └──────┘ │
│                                                               │
│  ┌──────────┐   local   ┌──────────┐                        │
│  │ Protein  │ ────────► │ 3D View  │                        │
│  │  List    │           │ (Three.js)                        │
│  └──────────┘           └──────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ tRPC over HTTP
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Backend                        │
│  ┌──────────┐   Prisma   ┌──────────┐                       │
│  │  tRPC    │ ────────► │PostgreSQL│                       │
│  │ Router   │           │          │                       │
│  └──────────┘           └──────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Defines workspace packages |
| `commitlint.config.js` | Commit message validation rules |
| `.husky/commit-msg` | Git hook for commitlint |
| `nextjs/prisma/schema.prisma` | Database schema |
| `expo/lib/api.ts` | tRPC client configuration |

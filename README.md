# swifty-proteins

> School 42 project - Mobile app to visualize 3D protein models from the PDB database.

## Subject

See [en.subject.md](./en.subject.md) for the full project specifications.

## Documentation

- **[Tech Stack](./docs/tech-stack.md)** - Why Expo, Next.js, and the technology choices
- **[Project Structure](./docs/structure.md)** - Monorepo architecture and folder organization
- **[Commit Conventions](./docs/commits.md)** - Commit message format and allowed types

## Getting Started

```bash
# Install dependencies
pnpm install

# Run both expo and nextjs
pnpm dev

# Run individually
pnpm dev:expo      # Expo on http://localhost:8081
pnpm dev:nextjs    # Next.js on http://localhost:3000
```

## Overview

This cross-platform application allows users to:

- Log in with fingerprint (BiometricAuth) or password
- Browse and search protein ligands
- Visualize 3D molecular structures
- Share models via social sharing APIs

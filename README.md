# swifty-proteins

> School 42 project - Mobile app to visualize 3D protein models from the PDB database.

## Subject

See [en.subject.md](./en.subject.md) for the full project specifications.

## Overview

This cross-platform application allows users to:
- Log in with fingerprint (BiometricAuth) or password
- Browse and search protein ligands
- Visualize 3D molecular structures
- Share models via social sharing APIs

## Tech Stack: Why Expo?

**Expo (React Native)** was chosen for this project for the following reasons:

### Cross-platform & Modern
- Expo is one of the most widely used mobile frameworks (3M+ weekly downloads on npm)
- Used by major companies: Meta, Microsoft, Shopify, etc.
- True cross-platform: single codebase for iOS and Android
- Hot reload and fast development cycle

### Consistency with Subject Requirements
The subject explicitly allows **Flutter** without requiring SceneKit/ViroCore. Since:
- Flutter uses its own Skia rendering engine (not SceneKit or ViroCore)
- The subject accepts Flutter as a valid alternative
- **Exo follows the same logic**: a modern framework with 3D capabilities

### 3D Implementation
- Using `react-three-fiber` and Three.js for WebGL rendering
- CPK coloring with Balls and Sticks model
- Interactive 3D manipulation (zoom, rotate)
- Native performance through bridged components

### Practical Benefits
- No Mac required for development (unlike native iOS)
- Can build native `.ipa` and `.apk` via EAS Build
- Large ecosystem and community support
- Future-proof skill set with high market demand

## Project Structure

```
swifty-proteins/
├── mobile/          # Expo app (React Native)
├── backend/         # Next.js API + tRPC + PostgreSQL
├── .husky/          # Git hooks (commitlint)
└── pnpm-workspace.yaml  # Monorepo configuration
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run both mobile and backend
pnpm dev

# Run individually
pnpm dev:mobile    # Expo on http://localhost:8081
pnpm dev:backend   # Next.js on http://localhost:3000
```

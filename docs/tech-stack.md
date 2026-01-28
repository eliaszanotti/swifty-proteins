# Tech Stack: Why Expo?

## Overview

This project uses **Expo (React Native)** for the mobile application with **Next.js** as the backend API.

## Why Expo?

### Cross-platform & Modern

- Expo is one of the most widely used mobile frameworks (**3M+ weekly downloads** on npm)
- Used by major companies: Meta, Microsoft, Shopify, etc.
- True cross-platform: single codebase for iOS and Android
- Hot reload and fast development cycle

### Consistency with Subject Requirements

The subject explicitly allows **Flutter** without requiring SceneKit/ViroCore. Since:

- Flutter uses its own Skia rendering engine (not SceneKit or ViroCore)
- The subject accepts Flutter as a valid alternative
- **Expo follows the same logic**: a modern framework with 3D capabilities

### No Mac Required

Unlike native iOS development with Swift/Xcode:
- Expo allows development on Windows, Linux, or Mac
- Native `.ipa` and `.apk` can be built via **EAS Build**
- Development workflow is streamlined

## Mobile Stack (Expo)

```
expo/
├── React Native       # UI framework
├── Expo Router        # File-based routing
├── expo-local-authentication  # Biometric auth (fingerprint)
├── react-three-fiber # 3D rendering (Three.js for React Native)
└── TypeScript        # Type safety
```

## Backend Stack (Next.js)

```
nextjs/
├── Next.js 15        # React framework with App Router
├── tRPC              # End-to-end typesafe APIs
├── Prisma            # Database ORM
├── PostgreSQL        # Database
└── TypeScript        # Type safety
```

## 3D Implementation

- **react-three-fiber** and **Three.js** for WebGL rendering
- **CPK coloring** for atoms (standard chemistry color scheme)
- **Balls and Sticks** model for molecular representation
- Interactive 3D manipulation (zoom, rotate, pan)
- Click on atoms to display information

## Architecture

```
┌─────────────────┐      tRPC      ┌─────────────────┐
│   Expo App      │ ◄──────────────► │   Next.js API   │
│  (React Native) │                  │   (tRPC)        │
└─────────────────┘                  └─────────────────┘
                                          │
                                          ▼
                                   ┌─────────────────┐
                                   │  PostgreSQL     │
                                   │   (Prisma)      │
                                   └─────────────────┘
```

## Why not Native iOS (Swift)?

| Criteria | Swift + SceneKit | Expo + React Native |
|----------|------------------|---------------------|
| **Mac required** | ✅ Yes | ❌ No |
| **Cross-platform** | ❌ iOS only | ✅ iOS + Android |
| **Learning curve** | New language (Swift) | JavaScript/TypeScript |
| **Market demand** | iOS jobs | React Native jobs (more) |
| **Development speed** | Medium | Fast (hot reload) |

## Why not Flutter?

Flutter is a great option (explicitly mentioned in the subject), but:

- Expo/React Native uses JavaScript/TypeScript (more familiar)
- Larger ecosystem and community
- Better 3D options with react-three-fiber
- Expo Go app for quick testing

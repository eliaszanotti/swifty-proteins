# Authentification

## Système de login

### Login avec password

1. User entre email + password
2. Credentials envoyés au serveur via tRPC
3. Le serveur valide avec Prisma + PostgreSQL
4. Session stockée côté client

### Login avec fingerprint (Face ID)

**Important** : L'empreinte digitale **n'est PAS liée au compte**.

Le fingerprint sert uniquement de **déverrouillage local** pour accéder aux identifiants stockés sur l'appareil.

#### Comment ça marche ?

**Première connexion** (avec password) :

1. User entre email + password
2. Les credentials sont sauvegardés dans le SecureStore du téléphone
3. Le login se fait normalement sur le serveur

**Connexions suivantes** (avec fingerprint) :

1. L'app vérifie si des credentials sont stockés localement
2. Si oui → demande l'authentification biométrique
3. Si le fingerprint réussit → l'app récupère les email/password stockés
4. Les credentials sont envoyés au serveur comme une connexion normale

#### Schéma simplifié

```
┌─────────────────┐
│ Tap "Face ID"   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Biometric Auth  │
│ (iOS/Android)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ fingerprint ✓   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Déverrouille    │
│ coffre-fort     │
│ local           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Récupère        │
│ email + password│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Envoie au       │
│ serveur tRPC    │
└─────────────────┘
```

#### Points clés

- Le fingerprint **ne communique rien** au serveur
- Il ne fait que **déverrouiller** le stockage local sécurisé
- Le serveur reçoit email + password comme une connexion classique
- Si le fingerprint échoue, les credentials restent inaccessibles

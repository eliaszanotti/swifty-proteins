# Swifty Proteins - Structure de l'application

Structure basée sur Expo Router avec les exigences du sujet.

```
expo/
├── app/
│   ├── _layout.tsx                          # Layout racine avec TamaguiProvider + SplashScreen
│   ├── index.tsx                            # Redirection vers login ou app
│   │
│   ├── (auth)/                              # Groupe authentification
│   │   ├── _layout.tsx                      # Layout sans navigation
│   │   ├── login.tsx                        # Login View (fingerprint + password)
│   │   └── register.tsx                     # Création de compte
│   │
│   ├── (app)/                               # Groupe application principale
│   │   ├── _layout.tsx                      # Layout avec Stack navigation
│   │   ├── proteins.tsx                     # Protein List View (liste + recherche)
│   │   └── protein/
│   │       ├── [id].tsx                     # Protein View (3D visualization)
│   │       └── _layout.tsx                  # Layout pour la vue 3D
│   │
│   └── _components/                         # Composants partagés
│       ├── LoadingSpinner.tsx               # Spinning wheel pour chargement
│       ├── AtomTooltip.tsx                  # Tooltip pour info atomes
│       └── ShareButton.tsx                  # Bouton de partage
│
├── components/
│   ├── ui/                                  # Composants UI réutilisables (Tamagui)
│   ├── auth/                                # Composants d'authentification
│   │   ├── FingerprintAuth.tsx             # Auth par fingerprint
│   │   └── PasswordAuth.tsx                # Auth par password
│   └── protein/
│       ├── ProteinCard.tsx                 # Carte ligand dans la liste
│       ├── ProteinSearch.tsx               # Barre de recherche
│       └── ProteinViewer3D.tsx             # Composant 3D (SceneKit/ViroCore/Three.js)
│
├── hooks/
│   ├── use-biometric-auth.ts               # Hook fingerprint authentication
│   ├── use-protein-data.ts                 # Hook fetch PDB data
│   └── use-theme.ts                        # Hook thème light/dark
│
├── lib/
│   ├── auth.ts                             # Logique authentification
│   ├── storage.ts                          # Stockage local (expo-secure-store)
│   └── pdb-parser.ts                       # Parser fichiers .pdb
│
├── data/
│   ├── get-proteins.ts                     # Fetch liste ligands depuis RCSB
│   └── get-protein-by-id.ts                # Fetch protein par ID
│
├── constants/
│   ├── ligands.txt                         # Liste des ligands (ressource sujet)
│   ├── cpk-colors.ts                       # Couleurs CPK par atome
│   └── theme.ts                            # Thème Tamagui
│
├── assets/
│   ├── images/
│   │   ├── launch-icon.png                 # Icon pour launch screen
│   │   ├── app-icon.png                    # Icon de l'app
│   │   └── protein-placeholder.png
│   └── fonts/
│       └── Inter/                          # Fonts Tamagui
│
├── types/
│   ├── protein.ts                          # Types Protein, Ligand, Atom
│   └── auth.ts                             # Types User, AuthMethod
│
├── app.json                                # Config Expo (icon, splash, name)
├── tamagui.config.ts                       # Configuration Tamagui
└── babel.config.js                         # Config Babel avec Tamagui plugin
```

## Pages détaillées

### 1. Launch Screen
- **Fichier** : `app/_layout.tsx` avec `expo-splash-screen`
- **Durée** : ~2-3 secondes (visible)
- **Contenu** : Icon de l'app + nom "Swifty Proteins"
- **Requis** : Icon conforme au thème (protéines/biochimie)

### 2. Login View (`app/(auth)/login.tsx`)

**Composants :**
- Logo/Icon de l'app
- Formulaire email/password
- Bouton "Login with Fingerprint" (si supporté)
- Bouton "Login with Password" (fallback)
- Lien "Create account" → navigation vers register
- Popup erreur si auth failed

**Fonctionnalités :**
- Détection support fingerprint (`expo-local-authentication`)
- Auth par fingerprint (TouchID/BiometricManager)
- Fallback password si pas de fingerprint
- Toujours affiché au lancement de l'app
- Popup warning si authentification échoue

**État :** Utiliser `expo-secure-store` pour persister la session

### 3. Register View (`app/(auth)/register.tsx`)

**Composants :**
- Logo/Icon de l'app
- Formulaire création compte
- Champs : email, password, confirm password
- Validation passwords match
- Bouton "Sign up"
- Lien "Already have account? Login"

### 4. Protein List View (`app/(app)/proteins.tsx`)

**Composants :**
- Barre de recherche (filtrage temps réel)
- Liste défilante des ligands depuis `ligands.txt`
- ProteinCard pour chaque ligand
- Loading spinner si chargement
- Popup erreur si chargement échoue depuis RCSB

**Fonctionnalités :**
- Fetch depuis RCSB PDB database (https://www.rcsb.org/)
- Recherche par nom/symbole de ligand
- Navigation vers `[id].tsx` au tap sur une carte
- Spinning wheel pendant le chargement

### 5. Protein View (`app/(app)/protein/[id].tsx`)

**Composants :**
- Viewer 3D (SceneKit iOS / ViroCore Android / Three.js Web)
- Bouton "Share" pour partager le modèle
- Tooltip atom (au clic sur un atome)
- Info atome : symbole (C, H, O, etc.)

**Fonctionnalités :**
- CPK coloring (couleurs standard chimie)
- Balls and Sticks model
- Interactions : zoom, rotate, pan
- Partage du modèle (Share button)
- Tooltip disparaît au clic ailleurs
- Affichage du type d'atome dans tooltip

## Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `index.tsx` | Redirection → login ou proteins (selon auth) |
| `/login` | `(auth)/login.tsx` | Page de connexion (fingerprint/password) |
| `/register` | `(auth)/register.tsx` | Création compte |
| `/proteins` | `(app)/proteins.tsx` | Liste des ligands avec recherche |
| `/protein/[id]` | `(app)/protein/[id].tsx` | Vue 3D d'un ligand |

## Navigation Flow

```
Launch Screen (2-3s, toujours affiché)
        ↓
    Check Auth (secure-store)
        ↓
   ┌─────────┴─────────┐
   ↓                   ↓
Not Logged In      Logged In
   ↓                   ↓
Login View       Proteins List
   │                   │
   │              ┌────┴────┐
   │              ↓         ↓
   │         Protein List  Protein Detail (3D)
   │              │              │
   └──────────────┴──────────────┘
                  │
            (Relancer app =
             toujours Login View)
```

## Couleurs CPK (standard chimie)

| Atome | Couleur | Hex |
|-------|---------|-----|
| Hydrogen (H) | White | #FFFFFF |
| Carbon (C) | Black/Dark Gray | #333333 |
| Nitrogen (N) | Blue | #3050F8 |
| Oxygen (O) | Red | #FF0D0D |
| Sulfur (S) | Yellow | #FFFF30 |
| Phosphorus (P) | Orange | #FF8000 |
| Calcium (Ca) | Green | #30FF00 |
| Iron (Fe) | Orange | #FF6600 |
| Other | Default | #909090 |

## Packages nécessaires

```json
{
  "dependencies": {
    "expo-local-authentication": "^15.0.0",
    "expo-secure-store": "^14.0.0",
    "expo-splash-screen": "^0.29.0",
    "expo-sharing": "^13.0.0",
    "expo-haptics": "^13.0.0",
    "tamagui": "^1.144.3",
    "@tamagui/config": "^1.144.3",
    "@tamagui/font-inter": "^1.144.3",
    "@tamagui/babel-plugin": "^1.144.3",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0"
  }
}
```

## Requis du sujet

### Mandatory Part ✅

- [x] **Icon** : Choix d'un icon conforme au thème (protéine/biochimie)
- [x] **Launch screen** : Affiché pendant quelques secondes
- [x] **Login View** :
  - [x] Authentication system avec gestion des comptes
  - [x] Login avec fingerprint (TouchID/BiometricManager)
  - [x] Popup warning si login échoue
  - [x] Fallback password si pas de fingerprint
  - [x] TOUJOURS affiché au lancement de l'app
- [x] **Protein List View** :
  - [x] Liste des ligands depuis `ligands.txt`
  - [x] Recherche dans la liste
  - [x] Popup warning si chargement échoue
  - [x] Spinning wheel pendant chargement
- [x] **Protein View** :
  - [x] Framework 3D (SceneKit/ViroCore/etc.)
  - [x] Affichage modèle 3D
  - [x] CPK coloring
  - [x] Balls and Sticks model
  - [x] Tooltip au clic sur atome (symbole C, H, O, etc.)
  - [x] Tooltip disparaît au clic ailleurs
  - [x] Share button
  - [x] Interactions : zoom, rotate

### Bonus 🎁

- [ ] Modèles alternatifs de visualisation (Space-filling, Ribbon, etc.)
- [ ] Animation de rotation automatique
- [ ] Mesures distances/angles
- [ ] Mode AR pour voir la protéine en réalité augmentée

## Fichiers de configuration

- `expo/app.json` : Config app (icon, name, splash, userInterfaceStyle)
- `expo/tamagui.config.ts` : Config Tamagui avec theme
- `expo/babel.config.js` : Config Babel avec Tamagui plugin
- `expo/constants/ligands.txt` : Liste des ligands du sujet
- `expo/constants/cpk-colors.ts` : Couleurs standard CPK

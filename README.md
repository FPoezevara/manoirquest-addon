# ManoirQuest — Add-on Home Assistant OS

Application de gamification des tâches ménagères pour la famille Poézévara.

## Installation sur HAOS (méthode locale)

### 1. Préparer le dépôt

L'add-on doit être accessible depuis HAOS via un dépôt Git ou en local sur le host.

**Option A — Dépôt GitHub (recommandé)**

1. Crée un dépôt GitHub : `manoirquest-addon`
2. Push le contenu du dossier `manoirquest/` à la racine
3. Dans HA → Paramètres → Add-ons → Boutique d'add-ons → ⋮ → Dépôts
4. Ajoute : `https://github.com/TON_USER/manoirquest-addon`

**Option B — Local (SSH sur le host HA)**

```bash
# Copier le dossier manoirquest/ dans /addons/ sur le host HA
scp -r ./manoirquest root@homeassistant.local:/addons/manoirquest
```

### 2. Installer l'add-on

1. HA → Paramètres → Add-ons → Boutique → rechercher "ManoirQuest"
2. Cliquer "Installer" → attendre le build Docker (~3-5 min)
3. Aller dans l'onglet "Configuration" et renseigner :
   ```yaml
   data_path: /share/manoirquest
   port: 3000
   secret_key: "CHANGE_MOI_AVEC_UNE_CHAINE_LONGUE_ET_ALEATOIRE"
   ```
4. Cliquer "Démarrer"

### 3. Premier accès

- Via le panneau HA (icône 🧹 dans la sidebar)  
- Ou directement : `http://homeassistant.local:3000`

**PINs par défaut :**
| Joueur  | PIN  |
|---------|------|
| Francis | 1234 |
| Ilona   | 1234 |
| Elisa   | 1111 |
| Renaud  | 2222 |

⚠️ **Changerez les PINs dès le premier accès** (Settings → à implémenter en Phase 3).  
Pour l'instant : modifiez directement dans `scripts/migrate.js` avant le premier lancement, ou via SQLite CLI.

### 4. Accès externe (Cloudflare Tunnel)

Le Cloudflare Tunnel déjà configuré pour HA exposera automatiquement l'add-on si tu routes le sous-chemin `/api/hassio_ingress/manoirquest` — c'est géré par l'ingress HAOS nativement.

---

## Développement local (sans HAOS)

```bash
cd app
npm install
cp .env.example .env    # créer le fichier .env
npm run db:migrate      # crée la DB + seed
npm run dev             # http://localhost:5173
```

**.env.example :**
```
DB_PATH=./data/manoirquest.db
SECRET_KEY=dev-secret-change-in-prod
PORT=5173
NODE_ENV=development
```

---

## Structure du projet

```
manoirquest/
├── config.yaml          # HAOS add-on metadata
├── Dockerfile           # Build Docker
├── run.sh               # Startup (HAOS)
├── repository.yaml      # Référentiel HAOS
└── app/
    ├── package.json
    ├── svelte.config.js
    ├── drizzle.config.ts
    ├── scripts/
    │   └── migrate.js   # DDL + seed (appelé au démarrage)
    └── src/
        ├── hooks.server.ts        # Auth middleware
        ├── lib/
        │   ├── db/
        │   │   ├── schema.ts      # Modèle de données Drizzle
        │   │   └── index.ts       # Connexion SQLite
        │   └── server/
        │       ├── auth.ts        # PIN hash, sessions
        │       └── tasks.ts       # Logique métier tâches
        └── routes/
            ├── +layout.svelte     # Nav bas + header
            ├── +page.svelte       # Dashboard
            ├── login/             # Authentification PIN
            ├── tasks/             # Liste + claim + validation
            ├── leaderboard/       # Classement semaine / tout temps
            ├── profile/           # Badges + récompenses
            └── api/auth/          # Logout endpoint
```

---

## Roadmap

- **Phase 1** ✅ MVP : auth, tâches, classement, profil
- **Phase 2** : Badges automatiques (trigger + attribution), feedback animé, push notifications
- **Phase 3** : Interface enfants simplifiée, gestion des PINs dans l'UI, historique
- **Phase 4** : Intégration Home Assistant (webhooks, automatisations à seuil)

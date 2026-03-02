# Backend — Plan d'implémentation

> Application de sauvegarde et partage de liens (Vault)

---

## 1. Stack technique

| Couche           | Technologie                                     |
| ---------------- | ----------------------------------------------- |
| Runtime          | Node.js (v20+)                                  |
| Framework        | Next.js API Routes (App Router)                 |
| ORM              | Prisma                                          |
| Base de données  | PostgreSQL                                      |
| Auth             | NextAuth.js v5 (Auth.js) — credentials + OAuth  |
| Validation       | Zod                                             |
| Emails           | Resend (invitations de partage)                 |
| Métadonnées      | open-graph-scraper (extraction titre/description/favicon depuis URL) |

---

## 2. Schéma de base de données (Prisma)

```prisma
// ─── Auth ──────────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // bcrypt hash (null si OAuth uniquement)

  plan          Plan      @default(FREE)
  linksCount    Int       @default(0)
  linksLimit    Int       @default(500) // 500 liens pour le plan gratuit

  links         Link[]
  folders       Folder[]
  shares        Share[]     @relation("ShareOwner")
  sharedWithMe  Share[]     @relation("ShareTarget")
  activities    Activity[]
  tags          Tag[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Plan {
  FREE
  PRO
}

// ─── Liens ─────────────────────────────────────────────────────────────────────

model Link {
  id          String   @id @default(cuid())
  url         String   // URL du lien sauvegardé
  title       String   // titre donné par l'utilisateur ou extrait via OG
  description String?  // description optionnelle
  favicon     String?  // URL du favicon (auto-extrait)
  domain      String   // domaine extrait (ex: "github.com")
  ogImage     String?  // image Open Graph (auto-extraite)

  folderId    String?
  folder      Folder?  @relation(fields: [folderId], references: [id], onDelete: SetNull)

  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  isTrashed   Boolean  @default(false)
  trashedAt   DateTime?
  isFavorite  Boolean  @default(false)

  tags        TagOnLink[]
  shares      Share[]
  activities  Activity[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([ownerId])
  @@index([folderId])
  @@index([domain])
}

// ─── Tags ──────────────────────────────────────────────────────────────────────

model Tag {
  id      String      @id @default(cuid())
  name    String
  color   String?     // couleur hex optionnelle

  ownerId String
  owner   User        @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  links   TagOnLink[]

  @@unique([name, ownerId])
  @@index([ownerId])
}

model TagOnLink {
  linkId  String
  link    Link   @relation(fields: [linkId], references: [id], onDelete: Cascade)

  tagId   String
  tag     Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([linkId, tagId])
}

// ─── Dossiers ──────────────────────────────────────────────────────────────────

model Folder {
  id          String   @id @default(cuid())
  name        String

  parentId    String?
  parent      Folder?  @relation("FolderTree", fields: [parentId], references: [id], onDelete: Cascade)
  children    Folder[] @relation("FolderTree")

  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  isTrashed   Boolean  @default(false)
  trashedAt   DateTime?
  isFavorite  Boolean  @default(false)

  links       Link[]
  shares      Share[]
  activities  Activity[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([ownerId])
  @@index([parentId])
}

// ─── Partage ───────────────────────────────────────────────────────────────────

model Share {
  id          String     @id @default(cuid())
  permission  Permission @default(READ)

  // Cible : lien OU dossier (l'un ou l'autre)
  linkId      String?
  link        Link?      @relation(fields: [linkId], references: [id], onDelete: Cascade)

  folderId    String?
  folder      Folder?    @relation(fields: [folderId], references: [id], onDelete: Cascade)

  ownerId     String     // celui qui partage
  owner       User       @relation("ShareOwner", fields: [ownerId], references: [id])

  targetId    String     // celui qui reçoit l'accès
  target      User       @relation("ShareTarget", fields: [targetId], references: [id])

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@unique([linkId, targetId])
  @@unique([folderId, targetId])
}

enum Permission {
  READ   // lecture seule — peut voir le lien
  WRITE  // lecture + écriture — peut modifier titre, description, tags, déplacer
}

// ─── Activité / Historique ─────────────────────────────────────────────────────

model Activity {
  id        String       @id @default(cuid())
  action    ActionType

  userId    String
  user      User         @relation(fields: [userId], references: [id])

  linkId    String?
  link      Link?        @relation(fields: [linkId], references: [id], onDelete: SetNull)

  folderId  String?
  folder    Folder?      @relation(fields: [folderId], references: [id], onDelete: SetNull)

  metadata  Json?        // données supplémentaires (ex: ancien titre pour rename)

  createdAt DateTime     @default(now())

  @@index([userId])
}

enum ActionType {
  ADD_LINK
  EDIT_LINK
  DELETE_LINK
  RESTORE_LINK
  MOVE_LINK
  SHARE
  UNSHARE
  CREATE_FOLDER
  DELETE_FOLDER
  RENAME_FOLDER
}
```

---

## 3. Routes API (App Router)

### Auth

| Méthode | Route                     | Description                          |
| ------- | ------------------------- | ------------------------------------ |
| POST    | `/api/auth/register`      | Inscription (email + mot de passe)   |
| POST    | `/api/auth/[...nextauth]` | NextAuth handlers                    |

### Liens

| Méthode | Route                    | Description                                       |
| ------- | ------------------------ | ------------------------------------------------- |
| GET     | `/api/links`             | Liste liens (query: folderId, sort, search, tags) |
| POST    | `/api/links`             | Ajouter un lien (URL, titre, desc, dossier, tags) |
| GET     | `/api/links/[id]`        | Détails d'un lien                                 |
| PATCH   | `/api/links/[id]`        | Modifier titre / description / tags / dossier / favori / corbeille |
| DELETE  | `/api/links/[id]`        | Suppression définitive                            |
| POST    | `/api/links/scrape`      | Extraire les métadonnées OG d'une URL (titre, description, favicon, image) |

### Dossiers

| Méthode | Route                    | Description                          |
| ------- | ------------------------ | ------------------------------------ |
| GET     | `/api/folders`           | Liste dossiers (query: parentId)     |
| POST    | `/api/folders`           | Créer un dossier                     |
| PATCH   | `/api/folders/[id]`      | Renommer / déplacer / favori / corbeille |
| DELETE  | `/api/folders/[id]`      | Suppression définitive (cascade)     |

### Tags

| Méthode | Route                    | Description                          |
| ------- | ------------------------ | ------------------------------------ |
| GET     | `/api/tags`              | Tous les tags de l'utilisateur       |
| POST    | `/api/tags`              | Créer un tag                         |
| PATCH   | `/api/tags/[id]`         | Renommer / changer couleur           |
| DELETE  | `/api/tags/[id]`         | Supprimer un tag                     |

### Partage

| Méthode | Route                    | Description                          |
| ------- | ------------------------ | ------------------------------------ |
| GET     | `/api/shares`            | Liens partagés avec moi              |
| POST    | `/api/shares`            | Partager un lien/dossier             |
| PATCH   | `/api/shares/[id]`       | Modifier permission (READ ↔ WRITE)   |
| DELETE  | `/api/shares/[id]`       | Révoquer un partage                  |

### Corbeille

| Méthode | Route                    | Description                          |
| ------- | ------------------------ | ------------------------------------ |
| GET     | `/api/trash`             | Éléments dans la corbeille           |
| POST    | `/api/trash/restore`     | Restaurer un élément                 |
| DELETE  | `/api/trash/empty`       | Vider la corbeille                   |

### Utilisateur

| Méthode | Route                    | Description                          |
| ------- | ------------------------ | ------------------------------------ |
| GET     | `/api/user/me`           | Profil + quota de liens              |
| PATCH   | `/api/user/me`           | Modifier profil                      |
| GET     | `/api/user/activity`     | Historique d'activité                |

---

## 4. Logique métier clé

### Ajout d'un lien

```
1. Vérifier authentification
2. Vérifier quota (linksCount < linksLimit)
3. Extraire le domaine depuis l'URL
4. Scrape métadonnées OG (titre, description, favicon, image) — en async
5. Créer enregistrement Link en BD avec les métadonnées
6. Associer les tags sélectionnés (TagOnLink)
7. Si un dossier est spécifié → associer folderId
8. Incrémenter User.linksCount
9. Créer Activity(ADD_LINK)
10. Retourner le lien créé
```

### Scrape des métadonnées

```
1. Recevoir l'URL depuis le client
2. Utiliser open-graph-scraper pour extraire :
   - og:title → titre par défaut
   - og:description → description par défaut
   - og:image → ogImage
   - favicon (via <link rel="icon">)
3. Extraire le domaine (new URL(url).hostname)
4. Retourner les métadonnées pour pré-remplir le formulaire
```

### Partage

```
1. Vérifier que l'utilisateur est owner du lien/dossier
2. Rechercher le targetUser par email
3. Si target n'existe pas → envoyer email d'invitation (Resend)
4. Créer enregistrement Share (READ ou WRITE)
5. Créer Activity(SHARE)
6. (Optionnel) Envoyer notification email au target
```

### Accès aux liens partagés

```
1. Pour chaque opération (lecture, écriture) :
   a. Vérifier si l'utilisateur est owner → accès total
   b. Sinon, chercher un Share correspondant
   c. Si Share.permission === READ → peut voir le lien (URL, titre, etc.)
   d. Si Share.permission === WRITE → peut modifier titre, description, tags, déplacer
   e. Sinon → 403 Forbidden
```

### Corbeille

```
- Soft delete : isTrashed = true, trashedAt = now()
- Restauration : isTrashed = false, trashedAt = null
- Suppression automatique après 30 jours (CRON job ou Vercel CRON)
- Suppression définitive : supprimer de la BD, décrémenter linksCount
```

---

## 5. Middleware & sécurité

- **Middleware Next.js** : rediriger vers `/login` si non authentifié (protéger toutes les routes sauf `/api/auth/*`)
- **Rate limiting** : `upstash/ratelimit` sur les routes d'ajout de liens et de partage
- **Validation** : valider chaque body/query avec Zod avant traitement
- **Sanitization** : valider que l'URL fournie est bien une URL valide (new URL())
- **CSP** : Content-Security-Policy headers via `next.config.ts`

---

## 6. Structure des fichiers backend

```
app/
  api/
    auth/
      register/route.ts
      [...nextauth]/route.ts
    links/
      route.ts              # GET (list), POST (create)
      [id]/route.ts         # GET, PATCH, DELETE
      scrape/route.ts       # POST (metadata extraction)
    folders/
      route.ts              # GET, POST
      [id]/route.ts         # PATCH, DELETE
    tags/
      route.ts              # GET, POST
      [id]/route.ts         # PATCH, DELETE
    shares/
      route.ts              # GET, POST
      [id]/route.ts         # PATCH, DELETE
    trash/
      route.ts              # GET
      restore/route.ts      # POST
      empty/route.ts        # DELETE
    user/
      me/route.ts           # GET, PATCH
      activity/route.ts     # GET
lib/
  prisma.ts                 # singleton Prisma client
  auth.ts                   # NextAuth config
  scraper.ts                # extraction métadonnées OG
  permissions.ts            # vérification d'accès (owner / share)
  validators.ts             # schémas Zod réutilisables
prisma/
  schema.prisma
  migrations/
```

---

## 7. Étapes d'implémentation (ordre recommandé)

### Phase 1 — Fondations
1. Initialiser Prisma + PostgreSQL (schema + première migration)
2. Configurer NextAuth (credentials + Google OAuth)
3. Pages login / register
4. Middleware de protection des routes

### Phase 2 — Liens & dossiers
5. API d'ajout de lien + scrape métadonnées OG
6. CRUD dossiers (création, navigation, renommage)
7. Liste de liens avec pagination, tri et filtres
8. Modification / suppression de liens
9. Soft delete + corbeille + restauration

### Phase 3 — Tags & organisation
10. CRUD tags (création, modification, suppression)
11. Association tags ↔ liens
12. Filtrage par tags dans la liste de liens
13. Favoris + liens récents

### Phase 4 — Partage
14. Partage par email (invitations)
15. Gestion des permissions (READ / WRITE)
16. Vue "Shared with Me"
17. Notifications email (Resend)

### Phase 5 — Production
18. Rate limiting + sécurité
19. CRON pour nettoyage corbeille (30 jours)
20. Tests (Vitest + Testing Library)
21. CI/CD (GitHub Actions)
22. Déploiement (Vercel + Supabase / Neon)

---

## 8. Variables d'environnement requises

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/vault"

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email
RESEND_API_KEY="..."
```

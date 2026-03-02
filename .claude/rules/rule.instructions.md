---
description: Rules to always follow when generating or modifying code in this workspace.
paths:
  - "**/*.tsx"
  - "**/*.ts"
---

# Coding Rules

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Component library: **shadcn/ui** (style: radix-nova) — components live in `@/components/ui/`
- Icons: **HugeIcons** free tier only (`@hugeicons/react` + `@hugeicons/core-free-icons`)

---

## Components

### Toujours utiliser shadcn/ui
- Ne JAMAIS utiliser de éléments HTML natifs interactifs bruts (`<button>`, `<input>`, `<select>`, `<textarea>`, etc.) quand un composant shadcn équivalent existe.
- Utiliser systématiquement : `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, `<Checkbox>`, `<Switch>`, `<Slider>`, etc.
- Pour les boutons icône, utiliser `<Button variant="ghost" size="icon-sm">` (ou `icon-xs`, `icon`, `icon-lg`).
- Pour les boutons texte inline, utiliser `<Button variant="ghost" size="xs|sm">` ou `variant="link"`.

### Variants disponibles (Button)
`default` | `outline` | `secondary` | `ghost` | `destructive` | `link`

### Sizes disponibles (Button)
`xs` | `sm` | `default` | `lg` | `icon-xs` | `icon-sm` | `icon` | `icon-lg`

### Imports
```ts
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// etc.
```

---

## Icônes

- Utiliser **uniquement** `@hugeicons/core-free-icons` + `@hugeicons/react`.
- Ne JAMAIS utiliser lucide-react, heroicons ou toute autre librairie d'icônes.
- Toujours vérifier que l'icône exportée existe avant de l'utiliser (les noms ne sont pas toujours intuitifs).
- Pattern standard :
```tsx
<HugeiconsIcon
  icon={IconName}
  size={20}
  color="currentColor"
  strokeWidth={1.5}
  aria-hidden="true"
/>
```
- Utiliser `aria-hidden="true"` pour les icônes décoratives, `aria-label` sur l'élément parent pour les icônes fonctionnelles.

---

## Couleurs & Design tokens

- Ne JAMAIS utiliser de couleurs Tailwind hardcodées (`blue-500`, `emerald-600`, etc.) sauf cas exceptionnel justifié.
- Toujours passer par les tokens CSS du design system : `text-primary`, `text-muted-foreground`, `bg-background`, `border-border`, etc.
- Exceptions tolérées uniquement si aucun token sémantique ne correspond.

---

## Règles TypeScript / Next.js

- Ajouter `"use client"` en haut de tout fichier contenant des hooks (`useState`, `useEffect`, etc.) ou des event handlers (`onClick`, `onChange`, etc.).
- Les Server Components ne peuvent pas recevoir de props de type fonction.
- Préférer les types stricts — éviter `any`.

---

## Structure & conventions

- Composants réutilisables → `components/` (pas dans `app/`)
- Pages → `app/**/page.tsx`
- Hooks personnalisés → `hooks/`
- Utilitaires → `lib/`
- Toujours utiliser `cn()` de `@/lib/utils` pour les classes conditionnelles.

---

## Accessibilité

- Tout bouton icône doit avoir un `aria-label` descriptif.
- Les icônes décoratives ont `aria-hidden="true"`.
- Les éléments interactifs doivent être focusables au clavier.

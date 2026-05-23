# Switch JRPG Dashboard - Guide du Projet

Ce document contient les directives architecturales, les conventions de codage et les flux de travail pour le projet Switch JRPG Dashboard.

## 🏗 Architecture
- **Framework :** [Next.js](https://nextjs.org/) (App Router)
- **Base de données :** [Supabase](https://supabase.com/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styles :** [Tailwind CSS 4](https://tailwindcss.com/)

## 📏 Conventions de Codage

### Composants & Pages
- Utilisez des **Server Components** par défaut dans `src/app`.
- Utilisez les **Client Components** (`'use client'`) uniquement lorsque l'interactivité ou les hooks React sont nécessaires (ex: formulaires, modals).
- Les composants réutilisables doivent être placés dans `src/components`.

### Types TypeScript
- Centralisez les interfaces partagées (ex: `Game`) pour éviter les redéfinitions.
- Utilisez des interfaces explicites pour les props des composants.

```typescript
// Exemple d'interface pour un jeu
export interface Game {
  id: string;
  title: string;
  developer: string;
  rating: number;
  image: string;
  status: 'À faire' | 'En cours' | 'Terminé';
  summary?: string;
  review?: string;
}
```

### Gestion des Données
- Utilisez les **Server Actions** dans `src/app/actions.ts` pour les mutations (Ajout, Modification, Suppression).
- Utilisez `revalidatePath('/')` après chaque mutation.
- Accédez à Supabase via le client exporté dans `src/lib/supabase.ts`.

### Styles
- Utilisez les classes utilitaires de **Tailwind CSS**.
- Favorisez la lisibilité en utilisant des espacements cohérents (`p-8`, `m-4`, etc.).

## 🎨 Composants UI & Interactivité

Lors de la création de composants interactifs (Client Components) :
- Gérez les états de chargement (`isUpdating`, `isDeleting`) pour donner un feedback visuel.
- Utilisez des modals pour les actions destructives ou les formulaires complexes.

## 🖼️ Gestion des Images (Supabase Storage)

- Les jaquettes sont stockées dans le bucket `images-jeux` (dossier `covers/`).
- **Règle d'or :** Toujours supprimer l'ancienne image du Storage lors de la mise à jour d'une jaquette ou de la suppression d'un jeu pour éviter de saturer l'espace disque.

## 🧪 Tests

Actuellement, le projet utilise les outils suivants pour garantir la qualité :
- **Linting :** `npm run lint` pour vérifier la cohérence du code et les erreurs potentielles.
- **Type Checking :** TypeScript assure la sécurité des types à la compilation.
- **Validation Manuelle :** Toujours tester les flux d'ajout, d'édition et de suppression après une modification sur les Server Actions.

*Note : Une intégration de Playwright ou Vitest est recommandée pour les futurs tests automatisés.*

## 🚀 Déploiement

Le projet est configuré pour un déploiement continu via **Vercel**.

1. **Prérequis :** Assurez-vous que les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`) sont configurées sur Vercel.
2. **Processus :**
   - Utilisez le script `./deploy.sh` pour envoyer vos modifications vers GitHub.
   - Vercel détectera automatiquement le push sur `main` et lancera le build.
3. **Vérification :** Une fois le déploiement terminé, vérifiez que la connexion à Supabase est opérationnelle sur l'URL de production.

## 📝 Exemple : Création d'une Server Action

```typescript
// src/app/actions.ts
'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addGameAction(formData: FormData) {
  const title = formData.get('title');
  const rating = formData.get('rating');

  const { error } = await supabase
    .from('games')
    .insert([{ 
      title, 
      rating: Number(rating),
    }]);

  if (error) {
    console.error('Erreur lors de l\'ajout :', error.message);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
```

## 🚀 Flux de Travail Final
1. Développement local avec `npm run dev`.
2. Vérification des types et linting.
3. Exécution de `./deploy.sh` pour mettre en production.

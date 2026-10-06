# AGENTS.md — gamecarlos / Échappée

## Workflow obligatoire

- Ne jamais modifier `main` directement.
- Travailler sur une branche dédiée et ouvrir une PR.
- Avant toute modification : vérifier `git status`, la branche, les derniers commits, les PR/issues ouvertes et ce fichier.
- Partir exclusivement du code réel du dépôt ; ne jamais inventer un fichier, une migration, une branche, un commit ou un état externe.
- Limiter les changements aux composants nécessaires.
- Préserver les identifiants DOM utilisés par le moteur de jeu, la reprise locale et les comportements GPS.
- Toute évolution du nombre d'échos doit rester cohérente entre le contenu, le moteur, le HUD, la fin de quête et les validations.
- Les positions GPS et photos restent locales au navigateur tant qu'un backend explicite n'est pas introduit.
- Ne jamais générer de cible GPS présentée comme un chemin sûr : l'utilisateur doit rester sur les sentiers et pouvoir déplacer une balise inaccessible.

## Vérifications avant PR

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Tester aussi le parcours en mode démo : accueil → navigation → les 6 défis → retour → écran final, en largeur mobile 320–430 px et bureau.

## Architecture actuelle

Le produit est volontairement statique :

- `echappee-gps.html` : UI, moteur GPS, audio/haptique, défis et persistance locale.
- `assets/` : images et icône PWA.
- `sw.js` + `manifest.webmanifest` : expérience installable/offline.
- `scripts/validate.mjs` : garde-fous structurels sans dépendance runtime.
- `.github/workflows/quality.yml` : contrôle CI.

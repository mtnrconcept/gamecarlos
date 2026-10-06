# Échappée — Les Échos perdus

Jeu d'exploration outdoor mobile centré sur six échos géolocalisés, des défis courts et une finale au point de départ. Le prototype est autonome, sans backend obligatoire et sans compte utilisateur.

## Expérience

- 6 échos jouables : énigme, effort, mémoire sonore, bienveillance, observation et rythme.
- GPS réel avec précision affichée, lissage et possibilité de déplacer une balise inaccessible.
- Mode démo complet pour tester sans déplacement.
- Audio Web Audio, narration système, vibrations, radar topographique et effets de récompense.
- Profil local persistant : XP, niveaux, records, distance cumulée et badges.
- Reprise de partie après fermeture du navigateur.
- PWA/offline après première visite.

## Lancer localement

Un serveur HTTP est recommandé afin d'activer service worker et géolocalisation :

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080/echappee-gps.html`.

## Qualité

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Aucune dépendance runtime n'est nécessaire.

## Sécurité outdoor

Les balises sont des objectifs à vol d'oiseau et ne constituent jamais des instructions de franchissement. Le joueur doit rester sur les chemins, respecter les propriétés privées et déplacer toute balise qui paraît inaccessible ou dangereuse.

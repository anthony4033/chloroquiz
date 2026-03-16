# ChloroQuiz — Changelog

Ce fichier répertorie toutes les modifications notables de ChloroQuiz.  
Format : `## [version] — YYYY-MM-DD`

---

## [v7] — 2026-03-16

### Ajouté
- **Comparaison côte à côte** : sélectionner 2 fiches pour les comparer sur tous les critères (champs identiques en vert, différents en orange). Disponible via "⚖️ Comparer 2 plantes" dans la page Fiches.
- **Badge version discret** : numéro de version affiché en bas à gauche de l'écran, cliquable pour ouvrir ce changelog.
- **Lien changelog** depuis l'application.

---

## [v6] — 2026-03-16

### Corrigé
- Apostrophes françaises dans `checkLatinDictee` cassant la syntaxe JS.
- Balise `<script>` manquante dans le template `exportFichePDF` (impression/PDF non fonctionnelle).
- Tri alphabétique ajouté à `renderFiches` (visiteurs et formateurs).

---

## [v5] — 2026-03-16

### Ajouté
- **Formulaire plein écran mobile** : le formulaire d'ajout/modification de plante occupe toute la hauteur de l'écran sur mobile.
- **Catalogue alphabétique** : la liste des plantes dans Admin est triée par nom latin (`localeCompare`).
- **Normalisation nom latin** : `normalizeLatin()` — Genre avec majuscule, épithètes minuscules, `×` conservé pour les hybrides. Appliqué à la saisie et à la sauvegarde.
- **Dictée — règles d'écriture + scoring** : vérification de la casse (Genre majuscule + épithètes minuscules). 1 pt si écriture parfaite, 0,5 pt niv.1 / 0 pt niv.2-3 si bonne réponse avec mauvaise casse. Message explicatif dans la fenêtre de résultat.
- **Décalage Q session multijoueur corrigé** : le compteur de question côté formateur et joueur était décalé de 1.
- **Statistiques réservées au formateur** : `showPage('stats')` redirige vers l'accueil pour les visiteurs.

### Corrigé
- `async` orphelin ligne 654 causant `ReferenceError` au démarrage.
- `nextId` converti en `function` declaration pour éviter les erreurs TDZ.
- Backtick mal échappé `\`` dans `deletePlant` bloquant tout le JS.

---

## [v4] — 2026-03-16

### Corrigé
- **Bug critique sauvegarde fiche** : section "Usage aménagement" orpheline (manquait `<div class="fg full">`), bouton Enregistrer hors de la zone scrollable.
- **Bug désélection chips mobile** : `:hover` collé sur mobile après touch. Limité à `@media(hover:hover)` + `:active{opacity:.75}`.
- **Largeur formulaire mobile** : `justify-content:stretch` + `env(safe-area-inset-bottom)`.

---

## [v3] — 2026-03-16

### Ajouté
- **Bottom navigation bar mobile** (≤ 560 px) : barre fixe en bas avec Accueil, Quiz, Fiches, Classement, Admin (formateur uniquement).
- **Spinner connexion** : `checkPassword()` rendue `async`, spinner pendant `login()`.
- **Spinner "Rejoindre session"** : feedback visuel pendant la requête Supabase.

### Corrigé
- Erreur HTML carte "Rejoindre une session" (`<div>` d'ouverture fusionné).

---

## [v2] — 2026-03-16

### Ajouté
- **Modale confirmation suppression** : remplace `confirm()` natif par une modale CSS avec nom de la plante et avertissement "irréversible".
- **Vibration haptique** `hapticWrong()` : `navigator.vibrate([120,60,80])` sur les 4 points de mauvaise réponse.
- **Message "aucun résultat"** dans les fiches avec bouton "↩ Effacer la recherche".
- **Filtres classement redessinés** : pill buttons avec fond visible, état actif affirmé, `@media(hover:hover)`, retour tactile `:active`.

---

## [v1] — 2026-03-14

### Fondation
- **Modularisation** : fichier monolithique 4 818 lignes → `index.html` (420 l.) + `chloroquiz.css` (705 l.) + `chloroquiz.js` (3 700 l.) + `sw.js`.
- Application ChloroQuiz complète : quiz végétaux, fiches, classement, mode multijoueur, administration, export PDF, mode dictée botanique, mode révision points faibles.

---

*Ce fichier est maintenu manuellement à chaque release. Version courante : voir `<meta name="app-version">` dans `index.html`.*

---

## [v8] — 2026-03-16

### Ajouté
- **Badge version dans le header** : `v8` affiché en petit à droite du logo ChloroQuiz, visible sur mobile et desktop sans prendre de place. Cliquable → ouvre le CHANGELOG.
- **Bouton "⏹ Arrêter" dans le quiz** : visible dans la barre de titre pendant tout le quiz. Affiche une modale de confirmation avec le score en cours.
- **Stats quiz interrompus** : quand un quiz est arrêté manuellement, le score (questions répondues, temps écoulé, "Non terminé") est enregistré dans le localStorage et affiché dans les Statistiques admin — mais **pas dans le classement**.

### Comportement arrêt quiz
- Score partiel → enregistré uniquement dans les stats admin (section "⏹️ Quiz interrompus")
- Affichage : nom, niveau, nb questions répondues, temps passé, mention "Non terminé"
- Retour automatique à l'accueil après confirmation
- Pas d'impact sur le classement

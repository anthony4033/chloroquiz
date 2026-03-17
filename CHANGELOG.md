# ChloroQuiz — Nouveautés & Corrections

---

## Version 16 — 17/03/2026
- Nouveau : bouton **✕ Supprimer** sur chaque carte apprenti (quiz solo) dans les Statistiques — efface tous ses scores et erreurs
- Nouveau : bouton **✕ Supprimer** sur chaque ligne de session dans la section multijoueur des Statistiques — efface la session et tous ses joueurs

---


- Nouveau : **section "Sessions multijoueur"** dans les Statistiques — cartes par apprenti (sessions, meilleur/pire %, moyenne, barre de progression) + liste des sessions avec date, niveau, podium
- Correction : la carte **"Scores enregistrés"** dans l'admin affiche désormais le décompte séparé **solo / multi** (ex. : "12 solo · 5 multi")

---

## Version 13 — 16/03/2026
- Correction : mode dictée bloqué en session multijoueur (impossible de passer à la question suivante)
- Correction : impression du comparatif tronquée sur 2 pages
- Nouveau : jusqu'à **4 photos par plante** dans les fiches
- Amélioration : les photos sont automatiquement compressées à l'upload (moins de données, chargement plus rapide)

---

## Version 12 — 16/03/2026
- Nouveau : bouton **Imprimer / PDF** dans la fenêtre de comparaison de 2 plantes (côte à côte, avec code couleur vert/jaune)

---

## Version 11 — 16/03/2026
- Amélioration : la page Statistiques se **rafraîchit automatiquement** toutes les 10 secondes — les quiz interrompus par les élèves apparaissent sans action de l'admin
- Amélioration : l'heure du dernier rafraîchissement est affichée discrètement

---

## Version 10 — 16/03/2026
- Correction : les quiz arrêtés par les élèves n'apparaissaient pas chez l'administrateur (les données restaient sur l'appareil de l'élève)
- Correction : le mode dictée ne proposait jamais de questions de dictée malgré l'option cochée

---

## Version 9 — 16/03/2026
- Correction : la section "Quiz interrompus" n'apparaissait pas dans les statistiques si aucun quiz n'avait encore été arrêté
- Amélioration : les statistiques affichent maintenant le total des parties terminées et interrompues, ainsi que le détail par élève

---

## Version 8 — 16/03/2026
- Nouveau : **numéro de version** affiché à côté du logo (cliquable pour voir les nouveautés)
- Nouveau : bouton **⏹ Arrêter** pendant le quiz — retour à l'accueil avec confirmation. Le score partiel est visible dans les statistiques admin mais pas dans le classement

---

## Version 7 — 16/03/2026
- Nouveau : **comparaison côte à côte** de 2 plantes — accessible via "⚖️ Comparer 2 plantes" dans les Fiches. Les valeurs identiques s'affichent en vert, les différences en orange
- Nouveau : ce fichier de nouveautés, accessible depuis le badge de version

---

## Version 6 — 16/03/2026
- Correction : impression de la fiche végétal non fonctionnelle
- Correction : les fiches végétaux n'étaient pas triées par ordre alphabétique

---

## Version 5 — 16/03/2026
- Nouveau : **vérification de l'écriture du nom latin** en mode dictée (majuscule au genre, minuscules pour l'espèce). Un message explicatif s'affiche en cas d'erreur de casse
- Amélioration : notation dictée — 0,5 pt au niveau 1 si bonne réponse mais mauvaise casse, 0 pt aux niveaux 2 et 3
- Amélioration : le formulaire d'ajout de plante occupe tout l'écran sur mobile
- Amélioration : catalogue trié par ordre alphabétique
- Amélioration : le nom latin est automatiquement mis en forme à la saisie (Genre Espèce)
- Correction : décalage du numéro de question affiché en session multijoueur
- Correction : la page Statistiques est désormais réservée au formateur

---

## Version 4 — 16/03/2026
- Correction : impossible de sauvegarder une fiche végétal (bouton Enregistrer inaccessible)
- Correction : sur mobile, décocher un critère ne se voyait pas visuellement
- Correction : le formulaire d'ajout de plante dépassait de l'écran sur mobile

---

## Version 3 — 16/03/2026
- Nouveau : **barre de navigation** fixe en bas de l'écran sur mobile (Accueil, Quiz, Fiches, Classement, Admin)
- Amélioration : un indicateur de chargement apparaît lors de la connexion
- Correction : la carte "Rejoindre une session" s'affichait mal sur l'accueil

---

## Versions 1 & 2 — 14/03/2026
- Lancement de ChloroQuiz : quiz végétaux, fiches, classement, mode multijoueur, administration, export PDF, mode dictée, révision des points faibles
- Séparation en fichiers distincts (HTML / CSS / JS) pour une maintenance plus facile
- Nouveau : confirmation avant suppression d'une plante
- Nouveau : vibration lors d'une mauvaise réponse (mobile)
- Nouveau : message "aucun résultat" avec bouton pour effacer la recherche
- Amélioration : filtres du classement plus visibles

---

## Version 14 — 17/03/2026
- Correction : bouton **Fermer** manquant sur la page d'impression du comparatif
- Amélioration : la page comparatif propose maintenant deux boutons — "🖨️ Imprimer / PDF" et "✕ Fermer" — avant de lancer l'impression (l'impression ne se lance plus automatiquement à l'ouverture)

## v17 — Formulaire admin enrichi (2026-03-17)

### Nouveaux champs (formulaire admin uniquement)
- **Port / Silhouette** : chips single-select (8 options avec glyph glossaire)
- **Vitesse de croissance** : Lente / Moyenne / Rapide
- **Comportement saisonnier** : chips (remplace le <select> feuillage) avec glossaire
- **Couleur du limbe** : color swatches végétaux (18 teintes + dégradés panachés)
- **Forme du limbe** : chips single-select (20 formes botaniques, toutes avec glyph)
- **Longueur / Largeur du limbe** : picker cm `<1 cm` … `>40 cm`, 1er ou 2 clics = valeur ou plage
- **Longueur du pétiole** : picker mm `Sessile` … `>60 mm`
- **Couleur du pétiole** : color swatches (11 teintes)
- **Texture du feuillage** : chips (Fine, Moyenne, Grossière, Coriace, Épineuse)
- **Exposition** : chips multi-select Ombre / Mi-ombre / Soleil (combine automatiquement en "X – Y – Z")
- **Parfumé** / **Intérêt esthétique** : chips Oui / Non
- **Reproduction** : Hermaphrodite / Monoïque / Dioïque / Polygame (glyph)
- **Pollinisation** : Entomogame / Anémogame / Zoogame / Hydrogame (glyph)
- **Inflorescence** : toggle → révèle type + dim. inflo + dim. fleur (3 colonnes)
- **Particularités** : chips multi (Drageonnant, Stolonifère, Mellifère, Fructification, Écorce, Automnal)
- **Humidité du sol** : Sec / Frais / Humide / Détrempé (glyph)
- **pH du sol** : 6 niveaux avec glyphes (Acidophile → Calcicole → Indifférent)
- **Structure du sol** : Drainant / Équilibré / Lourd / Indifférent (glyph)
- **Type de taille** : 5 options avec glyphes
- **Fréquence de taille** : Annuelle / Tous les 2–3 ans / Rare
- **Usage paysager** : 17 usages avec glyph (remplace et enrichit l'ancien champ)
- **Biodiversité** : 11 options ressources alimentaires + habitat (glyph)
- **Contraintes & alertes** : 12 options santé + pratiques (glyph)

### Nouvelles fonctions JS
- `_renderGPicker()`, `renderCmPicker()`, `renderPetiolePicker()`, `clickGP()`, `updateGP()` — pickers génériques
- `renderLeafColorPicker()`, `toggleLeafColor()` — color swatches feuillage/pétiole
- `fChip()`, `setSFChip()`, `updateExpoChips()` — gestion chips formulaire
- `showFormGloss(key)` — overlay glossaire (~70 termes botaniques)
- `checkLatinField()`, `checkFamilleField()` — validation + erreurs inline
- `toggleInfloDetail()` — toggle section inflorescence

### Nouvelles données JS
- `TAILLES_CM` (42 valeurs, `<1 cm` à `>40 cm`)
- `TAILLES_PETIOLE` (32 valeurs, `Sessile` à `>60 mm`)
- `COULEURS_LIMBE` (18 teintes végétales + dégradés panachés)
- `COULEURS_PETIOLE` (11 teintes)
- `FORM_GL` — glossaire botanique complet (~70 définitions)
- `cmPickers`, `ptPickers` — état des pickers cm/pétiole

### CSS (index.html — <style> injecté)
- `.fg-section-title` — titres de sections colorées dans le formulaire
- `.glyph` — bouton `?` ouvrant le glossaire
- `.color-grid` / `.color-swatch` / `.color-display` — color picker végétal
- `.size-hint` / `.size-display` — affichage pickers taille
- `.type-display` — affichage résumé chips multi-select

### savePlantForm
Tous les nouveaux champs sont sauvegardés : port, vitesseCroissance, couleurLimbe, formeLimbe, longueurLimbe, largeurLimbe, longueurPetiole, couleurPetiole, texture, parfum, interetEsthetique, reproduction, pollinisation, typeInflorescence, dimInflo, dimFleur, particularites, humidite, structureSol, typeTaille, frequenceTaille, biodiversite, contraintes.

## v17b — Éditeur de glossaire dans l'admin (2026-03-17)

### Nouvelle fonctionnalité
Onglet **📖 Glossaire** dans le panel admin permettant de gérer les définitions botaniques
sans toucher au code source.

### Ce que tu peux faire
- **Modifier** n'importe quelle définition intégrée (badge `MODIF.` orange)
- **Ajouter** un terme entièrement nouveau (badge `PERSO` vert)
- **Réinitialiser** une définition modifiée (🗑️ = retour à la valeur intégrée)
- **Supprimer** un terme personnalisé
- **Rechercher** en temps réel parmi tous les termes
- Les modifications s'affichent immédiatement dans les glyphes `?` du formulaire végétal

### Stockage
- **localStorage** : disponible immédiatement, fonctionne hors-ligne
- **Supabase** (si cloud configuré) : synchronisé sur tous les appareils

### Table Supabase à créer (SQL Editor)
```sql
create table floralab_glossaire (
  key text primary key,
  titre text not null,
  definition text not null,
  exemple text
);
```

### Fonctions ajoutées (chloroquiz.js)
- `loadGlossaire()` — chargement au démarrage (localStorage + Supabase)
- `saveGlossEntry(key, titre, definition, exemple)` — création/modification
- `deleteGlossEntry(key)` — suppression
- `renderGlossList([filter])` — rendu de la liste avec badges
- `filterGlossList(v)` — filtre temps réel
- `openGlossForm(key|null)` — formulaire modal
- `submitGlossForm()` — validation et sauvegarde
- `confirmDeleteGloss(key, isCustom)` — suppression avec confirmation
- `showFormGloss(key)` — mis à jour pour consulter `runtimeGloss` en priorité

### Variables
- `runtimeGloss` — objet en mémoire fusionnant localStorage et Supabase
- `SK_GLOSS = 'cq_glossaire'` — clé localStorage

---

## v18 — Formulaire, fiches, stats, quiz ciblé (2026-03-17)

### Formulaire admin — champs modifiés
- **Rusticité** → multi-select chips (9 intervalles de `< -30°C` à `+5°C`, sélections discontinues possibles)
- **pH du sol** → multi-select (plusieurs valeurs cochables simultanément)
- **Structure du sol** → multi-select
- **Humidité du sol** → multi-select
- **Type de taille** → multi-select
- **Résistance sécheresse** → champ retiré du formulaire (remplacé fonctionnellement par Humidité du sol) ; la valeur reste stockée si déjà renseignée
- **Autres intérêts** → réduit à 5 valeurs : Médicinale, Feuillage aromatique, Comestible / Fruitière, Fixatrice d'azote, Résistante à la pollution
- **Toggle inflorescence** → "Fleurs simples" désormais sélectionné par défaut et affiché en premier ; choix mutuellement exclusif avec Inflorescence
- **Vivace herbacée** → renommé **Vivace**
- **Classe botanique** ajoutée (single-select) : Monocotylédone, Dicotylédone, Gymnosperme, Bryophyte
- **Boutons Annuler / Enregistrer** dupliqués en haut du formulaire (en plus de ceux déjà en bas)

### Fiche végétale complète
- Bouton **📋 Fiche complète** visible dans chaque modale (simple et desktop), à côté du bouton PDF
- Nouvelle fonction `showFicheComplete(id)` : modal étendu 7 sections (Identité, Morphologie, Floraison, Milieu, Entretien, Usage, Biodiversité)
- **Classe** affichée dans l'en-tête de la fiche complète (à côté du feuillage)
- Bouton **← Fiche simple** pour revenir depuis la fiche complète

### Statistiques
- Cartes apprentis solo : heure de début affichée sur la dernière partie
- Ligne de progression détaillée : chaque partie avec date + heure + score
- Cartes apprentis multi : date + heure de la dernière session + historique des 5 dernières sessions
- `startTime` ajouté à l'objet score sauvegardé

### Quiz ciblé (🎯)
- Bouton **🎯 Quiz ciblé** affiché sur l'écran de fin de quiz si des erreurs existent (ex. "🎯 Quiz ciblé (7 erreurs)")
- Lance directement `startQuiz(true)` avec les végétaux sur lesquels l'apprenti a fait des erreurs

### Bug fix
- `sbDelete` : ajout du header `Prefer: return=minimal` — corrige les suppressions de sessions multi qui échouaient silencieusement
- Bouton **⚖️ Comparer 2 plantes** repositionné à droite de la ligne dans la bibliothèque

---

## v19 — Nom latin, recherche multicritère, stats temps (2026-03-17)

### Nom botanique — saisie corrigée
- Suppression du `oninput` sur le champ latin qui bloquait la frappe des espaces
- Normalisation (majuscule genre, minuscules épithète) déplacée sur `onblur` uniquement
- **Trinôme** supporté : `Prunus avium 'Burlat'`, `Rosa canina subsp. corymbifera` ✅
- **Hybrides `×`** : `Rosa × canina`, `Rosa x canina`, `Rosaxcanina` tous acceptés
- Placeholder mis à jour pour illustrer ces cas

### Quiz dictée — tolérance `×`
- Nouvelle fonction `normalizeLatinForCompare(s)` : normalise `x`/`×` avec ou sans espaces avant comparaison
- `Elaeagnus × ebbingei`, `Elaeagnus x ebbingei`, `Elaeagnus xebbingei` → toutes reconnues comme bonne réponse

### Recherche multicritère dans la bibliothèque
- Recherche sur **tous les champs** de la plante (latin, nom, famille, type, classe, feuillage, couleur fleurs, couleur limbe, forme, texture, port, exposition, pH, humidité, taille, usage, biodiversité, contraintes, etc.)
- **Recherche multi-mots** : chaque mot doit être présent quelque part → `arbrisseau glauque` ✅, `fleur bleu` ✅
- Nouvelle fonction interne `plantText(p)` qui concatène tous les champs pour la recherche

### Statistiques — heure de début
- **Solo** : `startTime` enregistré dans l'objet score au démarrage du quiz
- Historique par joueur : chaque partie affiche date + heure + score
- **Multi** : date + heure extraites de `created_at` de la session Supabase
- Historique multi : 5 dernières sessions avec heure de début et score

### Quiz multi — vue joueur pendant la partie
- Suppression du mini-classement entre les questions (les autres joueurs n'étaient plus visibles)
- Remplacé par un indicateur de **progression personnelle** uniquement : `Prénom · ✅ 3/5 · 60%`
- Le classement complet reste affiché à la **fin de partie** (inchangé)
- **Vue admin** (`renderSessionMonitor`) : aucun changement, progression temps réel de tous les joueurs toujours visible

---

## v20 — Comparaison Simple/Complète, bug famille (2026-03-17)

### Bug famille botanique corrigé
- Suppression du `oninput` sur le champ Famille botanique (même cause que le bug latin)
- La normalisation (`Rosaceae` ← `rosacees`, `Lamiaceae` ← `lamiacées`) se fait uniquement `onblur`
- Fin du bug où le suffixe était dupliqué pendant la saisie (ex. `Rosaceaaceae`)

### Comparaison — mode Simple / Complet
- La barre de comparaison affiche deux boutons : **📋 Simple** (défaut) et **📄 Complet**
- **📋 Simple** : comparaison existante avec les champs essentiels + code couleur vert (identique) / orange (différent)
- **📄 Complet** : nouvelle fonction `launchComparisonFull(id1, id2)` — modal avec **7 sections** et tous les champs v17 (Identité, Morphologie, Feuillage, Floraison, Milieu & sol, Entretien, Usage & biodiversité)
- Compteur de différences affiché en en-tête de la vue complète
- Bouton **📄 Vue complète** dans la modale simple → bascule vers vue complète
- Bouton **← Vue simple** dans la modale complète → retour vue simple
- `compareType` variable globale (`"simple"` | `"complet"`) réinitialisée à chaque ouverture du mode comparaison

---

## v21 — Quiz : intervalles pour dimensions et rusticité (2026-03-17)

### Nouveau comportement pour les questions numériques
Les champs `hauteurAdulte`, `largeurAdulte` et `rusticite` génèrent désormais des **intervalles** dans les propositions au lieu de valeurs exactes.

**Dimensions (hauteur/largeur adulte)**
- La valeur exacte de la plante est convertie en intervalle centré (ex: `1 – 2 m` → correct : `1 – 2 m`, faux : `0.2 – 0.8 m`, `0.7 – 1.5 m`, `2 – 2.5 m`)
- La largeur de l'intervalle est proportionnelle à la valeur : ±0.1 m pour < 0.5 m, ±0.3 m pour 1–3 m, ±1.5 m pour 8–20 m, etc.
- Les distracteurs sont des intervalles réalistes à 35 %, 65 %, 160 % et 250 % de la valeur

**Rusticité**
- Intervalles de ±5°C arrondis aux multiples de 5°C (ex: `-10 / -5°C` → correct : `entre -15°C et -5°C`, faux : `entre -20°C et -10°C`, `< -30°C`, `entre -5°C et 0°C`)
- Cas extrêmes gérés : `< -30°C` reste `< -30°C`, valeurs proches de 0°C renvoient `entre -5°C et 0°C`
- Pour les valeurs très froides (≤ -28°C), les distracteurs sont décalés vers le chaud pour rester distincts

### Nouvelles fonctions
- `parseDimensionValue(str)` — extrait le milieu numérique d'une plage ou valeur unique en mètres
- `parseRusticiteValue(str)` — extrait le milieu numérique d'une plage ou valeur de température
- `formatDimensionInterval(midVal, halfStep)` — formate un intervalle en mètres
- `formatRusticiteInterval(midVal, halfStep)` — formate un intervalle en °C (multiples de 5)
- `buildNumericIntervalOptions(value, key)` — génère 4 intervalles (1 correct + 3 distracteurs)

### Impact
- S'applique aux quiz solo **et** aux sessions multijoueur (même fonction `buildKnowledgeQuestion`)
- Si la valeur n'est pas parseable, comportement antérieur conservé (valeur exacte)

---

## v22 — 4 niveaux, recherche intelligente, humidité (2026-03-17)

### Quiz : restructuration des niveaux

| Niveau | Nom | Critères |
|--------|-----|----------|
| 1 | 🌱 **Débutant** | Photo · Type végétal · Feuillage · Rusticité · Exposition · Hauteur · Largeur · Floraison · Couleur fleurs |
| 2 | 🎓 **Intermédiaire** | N1 + pH · Humidité sol · Structure sol · Port · Vitesse croissance · Type taille · Intérêt ornemental · Autres intérêts · Usage |
| 3 | 🔬 **Expert** | N2 + Famille · Classe · Couleur/Forme/Texture feuillage · Reproduction · Pollinisation · Biodiversité · Particularités · Fréquence taille |
| 4 | 🏗️ **Technique** | Mise en situation chantier (choix d'un végétal selon critères) |

- `KFIELDS_N1`, `KFIELDS_N2`, `KFIELDS_N3` — 3 tableaux de critères cumulatifs
- `buildKQ` et `buildKnowledgeQuestion` mis à jour pour router vers le bon tableau selon le niveau
- **Résistance sécheresse** supprimée de tous les critères de quiz → remplacée par **Humidité du sol**
- Sélecteur 4 boutons dans le quiz solo et dans le multi (admin)
- CSS `lv4` (bleu cyan) ajouté dans `chloroquiz.css`
- Filtre classement mis à jour : `lv1` / `lv2` / `lv3` / `lv4`

### Recherche multicritère intelligente (bibliothèque)

- **Contexte fleur** : `arbuste fleur bleu` → recherche le bleu uniquement dans les champs fleurs (couleurFleurs, inflorescence…), pas dans le feuillage
- **Contexte feuillage** : `arbuste feuillage bleu` → recherche le bleu uniquement dans les champs feuillage
- **Synonymes bleu/glauque** : `bleu` sur feuillage → couvre aussi glauque, bleu-vert, vert bleuté, gris-bleu, argenté, cendré, pruineux
- **feuille = feuilles = feuillage** : expandToken() normalise ces synonymes
- **Sans résultat** : affichage d'un message discret `« Aucune fiche ne correspond à "..." »` sans widget vide
- Liste `COLOR_WORDS` de toutes les couleurs reconnues pour le routage contextuel

---

## v22b — Dictionnaire couleurs complet (2026-03-17)

### Recherche multicritère — nuances de couleurs

Le moteur de recherche reconnaît désormais les **nuances pour toutes les couleurs**.

| Couleur recherchée | Nuances reconnues |
|---|---|
| `rouge` | bordeaux, carmin, cramoisi, vermillon, écarlate, grenat, framboise, lie-de-vin, brique, terracotta, rouille, cuivre, brun-rouge, corail, cerise, rubis |
| `orange` | abricot, ambre, rouille, terracotta, cuivre, brique, mandarine, saumon foncé, ocre, fauve |
| `jaune` | or, doré, paille, citron, champagne, crème, ivoire, vert-jaune, jaune orangé, soufre |
| `blanc` | crème, ivoire, nacré, argenté, blanc rosé, blanchâtre |
| `rose` | rosé, saumon, fuchsia, magenta, rose pâle/vif/foncé, incarnat, framboise clair |
| `violet` | mauve, lilas, lavande, améthyste, pourpre, prune, aubergine, bleu-violet, violine |
| `bleu` | azur, indigo, saphir, glauque, bleu-vert, vert bleuté, gris-bleu, turquoise, pruineux, cendré |
| `vert` | émeraude, jade, bronze, chartreuse, olive, kaki, vert-gris, vert-jaune |
| `brun` | marron, chocolat, noisette, acajou, roux, cuivré, bronze, cannelle |
| `gris` | argenté, gris-vert, gris-bleu, cendré, ardoise, plombé |
| `noir` | brun-noir, noir-pourpre, très foncé |

- `COLOR_SYNONYMS` — dictionnaire JS complet (~60 familles de couleurs)
- `normalizeColorTok()` — normalise pluriels et accords (bleus→bleu, vertes→vert…)
- `COLOR_KEYS` — Set de tous les tokens reconnus comme couleurs
- Le contexte fleur/feuillage continue de fonctionner pour toutes les couleurs

---

## v23 — Templates N4 enrichis, questions contraire, recherche sémantique (2026-03-17)

### Templates N4 — 16 scénarios de chantier (niveau Technique)

- Ajout de 8 nouveaux templates utilisant les champs v17 : **port**, **humidité du sol**, **structure du sol**, **couleur des fleurs**, **usage aménagement**, **hauteur adulte + période**
- `resistanceSech` remplacé par `humidite` dans tous les templates
- Format migré vers `{t: fn, f: [champs]}` : chaque template connaît ses champs requis
- Les templates dont les champs ne sont pas renseignés sur la plante sont exclus automatiquement
- Fonctionne pour le quiz solo (niveau 4) et les sessions multijoueur

### Questions "contraire" — nouveau type 🚫

7 templates de questions inverses (Quelle plante NE convient PAS à… ?) :
- Exposition, Rusticité, Humidité du sol, Feuillage, Période de floraison, Port, pH
- Probabilité d'apparition : **15%** aux niveaux 2, 3 et multi
- La "bonne réponse" est le végétal qui **ne correspond pas** aux critères affichés
- Les 3 distracteurs sont des végétaux qui **conviendraient** (pièges plausibles)
- Affiché avec le label `🚫 Question contraire` dans la phase 2

### Recherche sémantique — `SEMANTIC_CATEGORIES`

~30 mots-clés reconnus qui ciblent les bons champs :

| Mot-clé | Champs ciblés |
|---|---|
| `haie` | usageAmenagement (haie libre, taillée, champêtre…) |
| `persistant` | feuillage + interetOrnemental |
| `caduc`, `marcescent` | feuillage |
| `arbre`, `arbuste`, `conifere`… | type |
| `calcaire`, `acide` | ph |
| `humide`, `sec`, `drainant` | humidite, structureSol |
| `ombre`, `soleil`, `mi-ombre` | exposition |
| `mellifere`, `aromatique`, `comestible`… | autresInterets, biodiversite |
| `parfume` | parfum, couleurFleurs, autresInterets |
| `retombant`, `colonnaire` | port |
| `aquatique`, `berge` | usageAmenagement, humidite |

Exemple : `haie persistante` → filtre usageAmenagement contenant "haie" ET feuillage="Persistant"

---

## v23b — Corrections affichage fiches et photos (2026-03-18)

### Bug labels collés — corrigé partout
- `FamilleAstéraceae`, `TypeVivace herbacée`, `ComportementPersistant` → labels et valeurs désormais séparés dans toutes les vues
- Correction appliquée en **styles inline** (bulletproof — ne dépend plus du chargement du CSS) sur :
  - `launchComparisonFull` (comparaison complète)
  - `showFicheComplete` (fiche complète)
  - `openModal` (modale simple et desktop)
- Label `"Comportement"` → `"Feuillage"` dans la section Feuillage de la comparaison complète

### Tag résistance sécheresse retiré des cards
- `sechBar()` supprimé des cards de la bibliothèque des fiches
- Remplacé par le tag `💧 Humidité` cohérent avec le reste de l'application

### Photos — `object-fit:contain` sur toutes les vues
- Avant : `object-fit:cover` recadrait l'image et coupait le végétal (port, fleurs basses, racines)
- Après : `object-fit:contain` + fond sombre `#071610` — le végétal est visible en entier
- Appliqué sur : grille bibliothèque, modale simple, modale mobile (slide), comparaison côte à côte
- **Fiche complète** : photo principale grande (max 340 px) + miniatures cliquables si plusieurs photos

### CSS
- `.minfo` : `display:flex;flex-direction:column` ajouté
- `.cmp-row/.cmp-lbl/.cmp-val` : classes créées pour la comparaison complète
- `.fiche-img` : `object-fit:contain;background:#071610;border-radius:10px 10px 0 0`
- `.modal-img` : `height:220px;object-fit:contain;background:#071610`
- `.modal-img-full` : `object-fit:contain;background:#071610`
- `.cmp-img` : `object-fit:contain;background:#071610`

---

## v23c — Révision ciblée redessinée (2026-03-18)

### Révision ciblée — système accordéon par catégorie

**Avant** : tous les chips de toutes les catégories affichés en permanence (encombrant).

**Après** : 3 boutons de catégorie → clic → les chips de cette catégorie apparaissent dessous.

- Boutons catégories : 🍃 Feuillage · ☀️ Exposition · 🌿 Type
- Par défaut tout est fermé = pas de filtre actif (= "Tous")
- Quand un filtre est sélectionné → badge vert affiché sur le bouton catégorie
- Bouton **✕ Réinitialiser** apparaît dès qu'un filtre est actif, disparaît quand tout est "Tous"
- Cliquer à nouveau sur une catégorie ouverte la referme

### Autres corrections
- `selectLevel()` corrigé pour prendre en compte les 4 niveaux (lv4 n'était pas mis à jour visuellement)

---

## v23d — Révision ciblée : 7 catégories (2026-03-18)

### Nouvelles catégories de filtre

| Catégorie | Chips |
|---|---|
| 🍃 Feuillage | Caduc · Persistant · Marcescent · Semi-persistant |
| ☀️ Exposition | Toutes les expositions des plantes du catalogue |
| 🌿 Type | Tous les types (multi-valeur supporté) |
| 🏡 Usage | Haie libre · Haie taillée · Massif · Bordure · Couvre-sol · Talus… |
| 🎨 Couleur fleurs | Blanc · Jaune · Rose · Rouge · Violet · Bleu · Mauve… |
| 📏 Dimensions | 0–0.5 m · 0.5–1 m · 1–2 m · 2–5 m · 5–15 m · > 15 m |
| 🌡️ Rusticité | Très rustique (< -25°C) · Rustique · Assez rustique · Peu rustique · Sensible |

- `qFilter` étendu à 7 clés
- `openFilterCat()` construit dynamiquement les chips selon la catégorie
- Dimensions et Rusticité utilisent des **intervalles** — les plantes dont la valeur tombe dans la tranche sont sélectionnées via `parseDimensionValue()` et `parseRusticiteValue()`
- Usage et Couleur fleurs : filtrage sur valeurs multi (la plante doit contenir la valeur cherchée)
- `clearAllFilters()` et `toggleFilterChip()` mis à jour pour les 7 clés

---

## v23e — Filtres Famille/Classe + Type Spontanée/Indigène/Horticole (2026-03-18)

### Révision ciblée — 2 catégories supplémentaires

| Catégorie | Chips |
|---|---|
| 🔬 Famille | Toutes les familles des plantes du catalogue (dynamique) |
| 🧬 Classe | Monocotylédone · Dicotylédone · Gymnosperme · Bryophyte |

Total : 9 catégories de filtre (Feuillage, Exposition, Type, Famille, Classe, Usage, Couleur fleurs, Dimensions, Rusticité)

### Formulaire fiche végétale — Type de végétal

3 nouvelles valeurs ajoutées en bas de la liste :
- **Spontanée** — plante qui pousse naturellement sans intervention humaine
- **Indigène** — plante native de la région ou du pays
- **Horticole** — variété sélectionnée ou cultivée par l'homme

Mises à jour : `TYPE_OPTIONS`, chips du formulaire, `startQuiz` (filtres), `openFilterCat`, `clearAllFilters`, `qFilter`

/* ══════════════════════════════════════════════════════
   ChloroQuiz — Script principal
   Version: 2026-03-14-v5
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   ChloroQuiz — Script principal
   Version: 2026-03-14-v5
══════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════
//  MODE DEBUG
// ══════════════════════════════════════════════════════
const CQ_DEBUG = false; // passer à true pour activer les logs de diagnostic
function cqLog(...a){ if(CQ_DEBUG) console.log('[CQ]', ...a); }
function cqWarn(...a){ if(CQ_DEBUG) console.warn('[CQ]', ...a); }
function cqErr(...a){ console.error('[CQ]', ...a); } // erreurs toujours visibles
// Log de boot — toujours visible pour confirmer la version chargée
console.log('[ChloroQuiz] Script chargé — openForm disponible:', typeof openForm);

// ══════════════════════════════════════════════════════
//  CONSTANTES
// ══════════════════════════════════════════════════════
// Mots de passe — remplacés par les valeurs sauvegardées si elles existent
let PW_USER  = 'flora2024';
let PW_ADMIN = 'admin2024';
// Initialisations pickers (avant openForm pour éviter TDZ)
var tempPickerVal = {};
var sizePickers   = {};
var TEMPERATURES = (()=>{
  const t = ['< -30°C', '-30 / -25°C', '-25 / -20°C', '-20 / -15°C'];
  for(let i=-14; i<=10; i++) t.push((i>0?'+':'')+i+'°C');
  return t;
})();
var TAILLES = (()=>{
  const t = ['<0.1 m'];
  for(let i=1;i<=20;i++) t.push((i/10).toFixed(1)+' m');
  for(let i=3;i<=40;i++) t.push(i+' m');
  t.push('>40 m');
  return t;
})();
var COULEURS_FLEURS = [
  // Blancs & Crèmes
  {nom:'Blanc',             css:'#ffffff'},
  {nom:'Crème',             css:'#f5e6c8'},
  {nom:'Ivoire',            css:'#fffff0'},
  // Jaunes & Verts
  {nom:'Jaune pâle',        css:'#f5f0a0'},
  {nom:'Jaune',             css:'#f5e020'},
  {nom:'Jaune-vert',        css:'linear-gradient(135deg,#c8e020,#6abf30)'},
  {nom:'Vert',              css:'#4caf50'},
  // Oranges
  {nom:'Abricot',           css:'#ffb347'},
  {nom:'Saumon',            css:'#fa8072'},
  {nom:'Orange',            css:'#ff8c00'},
  // Roses
  {nom:'Rose pâle',         css:'#ffb6c1'},
  {nom:'Rose',              css:'#ff69b4'},
  {nom:'Rose vif',          css:'#ff1493'},
  {nom:'Magenta',           css:'#cc0077'},
  // Rouges
  {nom:'Rouge',             css:'#e02020'},
  {nom:'Rouge vif',         css:'#ff0000'},
  {nom:'Carmin',            css:'#960018'},
  {nom:'Bordeaux',          css:'#722f37'},
  // Violets & Bleus
  {nom:'Mauve',             css:'#c8a0e0'},
  {nom:'Lilas',             css:'#b0a0d0'},
  {nom:'Lavande',           css:'#9070c0'},
  {nom:'Violet',            css:'#6a0dad'},
  {nom:'Violet foncé',      css:'#4b0082'},
  {nom:'Pourpre',           css:'#800020'},
  {nom:'Bleu ciel',         css:'#87ceeb'},
  {nom:'Bleu',              css:'#2060c8'},
  {nom:'Bleu foncé',        css:'#00008b'},
  {nom:'Indigo',            css:'#3f0090'},
  // Bruns & Spéciaux
  {nom:'Brun',              css:'#8b4513'},
  {nom:'Bronze',            css:'#cd7f32'},
  {nom:'Noir',              css:'#1a1a2e'},
  // Bicolores
  {nom:'Blanc & Rose',      css:'linear-gradient(135deg,#fff 50%,#ff69b4 50%)'},
  {nom:'Blanc & Rouge',     css:'linear-gradient(135deg,#fff 50%,#e02020 50%)'},
  {nom:'Blanc & Violet',    css:'linear-gradient(135deg,#fff 50%,#6a0dad 50%)'},
  {nom:'Blanc & Jaune',     css:'linear-gradient(135deg,#fff 50%,#f5e020 50%)'},
  {nom:'Blanc & Bleu',      css:'linear-gradient(135deg,#fff 50%,#2060c8 50%)'},
  {nom:'Rose & Rouge',      css:'linear-gradient(135deg,#ff69b4 50%,#e02020 50%)'},
  {nom:'Rose & Blanc',      css:'linear-gradient(135deg,#ff69b4 50%,#fff 50%)'},
  {nom:'Rose & Jaune',      css:'linear-gradient(135deg,#ff69b4 50%,#f5e020 50%)'},
  {nom:'Rouge & Jaune',     css:'linear-gradient(135deg,#e02020 50%,#f5e020 50%)'},
  {nom:'Jaune & Orange',    css:'linear-gradient(135deg,#f5e020 50%,#ff8c00 50%)'},
  {nom:'Orange & Rouge',    css:'linear-gradient(135deg,#ff8c00 50%,#e02020 50%)'},
  {nom:'Violet & Blanc',    css:'linear-gradient(135deg,#6a0dad 50%,#fff 50%)'},
  {nom:'Violet & Jaune',    css:'linear-gradient(135deg,#6a0dad 50%,#f5e020 50%)'},
  {nom:'Violet & Rose',     css:'linear-gradient(135deg,#6a0dad 50%,#ff69b4 50%)'},
  {nom:'Bleu & Blanc',      css:'linear-gradient(135deg,#2060c8 50%,#fff 50%)'},
  {nom:'Bleu & Jaune',      css:'linear-gradient(135deg,#2060c8 50%,#f5e020 50%)'},
];
const PW_DEFAULTS = {user:'flora2024', admin:'admin2024'};
const SK_PLANTS  = 'chloroquiz_v3';
const SK_SCORES  = 'chloroquiz_scores_v1';
const SK_SB_CONF = 'chloroquiz_sb';
const SK_PASSWORDS = 'chloroquiz_passwords';
const TIMER_SEC  = 30;

// Connexion cloud intégrée — tous les appareils se connectent automatiquement
const SB_DEFAULT_URL = 'https://vxqjkvtkhkptvfjksgif.supabase.co';
const SB_DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cWprdnRraGtwdHZmamtzZ2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDQ4MDcsImV4cCI6MjA4ODcyMDgwN30.JgxWUmVpLl_yAfrcdtfLJC0qJgoPhH_cjYQp_upux_A';

const SQL_SETUP = `-- Copiez-collez ce code dans Supabase → SQL Editor → Run
create table if not exists floralab_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
create table if not exists floralab_scores (
  id bigserial primary key,
  name text, level integer, ok integer,
  total integer, pct integer, timeouts integer, date bigint
);
alter table floralab_data enable row level security;
alter table floralab_scores enable row level security;
create policy "public_all_data" on floralab_data
  for all using (true) with check (true);
create policy "public_all_scores" on floralab_scores
  for all using (true) with check (true);

-- Ajouter la colonne last_activity (a executer une seule fois dans Supabase) :
-- alter table floralab_session_players add column if not exists last_activity text default null;`;

const KFIELDS_N1 = [
  {key:'feuillage',        label:'Feuillage',             q:n=>`Quel est le type de feuillage de <em>${n}</em> ?`},
  {key:'rusticite',        label:'Rusticité',             q:n=>`Résistance au gel de <em>${n}</em> ?`},
  {key:'exposition',       label:'Exposition',            q:n=>`Exposition idéale pour <em>${n}</em> ?`},
  {key:'ph',               label:'pH du sol',             q:n=>`Quel est le pH idéal pour <em>${n}</em> ?`},
  {key:'resistanceSech',   label:'Résistance sécheresse', q:n=>`Résistance à la sécheresse de <em>${n}</em> ?`},
  {key:'hauteurAdulte',    label:'Hauteur adulte',        q:n=>`Hauteur adulte de <em>${n}</em> ?`},
  {key:'largeurAdulte',    label:'Largeur adulte',        q:n=>`Largeur adulte de <em>${n}</em> ?`},
  {key:'periodeFloraison', label:'Période de floraison',  q:n=>`Période de floraison de <em>${n}</em> ?`},
  {key:'couleurFleurs',    label:'Couleur des fleurs',    q:n=>`Couleur des fleurs de <em>${n}</em> ?`},
];
const KFIELDS_N2 = [...KFIELDS_N1,
  {key:'famille',           label:'Famille botanique',      q:n=>`À quelle famille appartient <em>${n}</em> ?`},
  {key:'interetOrnemental', label:'Intérêt ornemental',     q:n=>`Quel est l'intérêt ornemental de <em>${n}</em> ?`},
  {key:'autresInterets',    label:'Autres intérêts',        q:n=>`Quel autre intérêt présente <em>${n}</em> ?`},
];

// Niveau 3 — questions de mise en situation aménagement
// Préposition correcte selon l'exposition
function expoLabel(e){
  if(!e)return e;
  const map={
    'Soleil':'au Soleil',
    'Ombre':"à l\'Ombre",
    'Mi-ombre':'en Mi-ombre',
    'Ombre – Mi-ombre':"en Ombre à Mi-ombre",
    'Mi-ombre – Soleil':'en Mi-ombre à Soleil',
    'Ombre – Mi-ombre – Soleil':"de l\'Ombre au Soleil"
  };
  if(map[e])return map[e];
  return 'en exposition <em style="font-style:normal">'+e+'</em>';
}

const N3_TEMPLATES = [
  p=>`Vous aménagez une zone ${expoLabel(p.exposition)} avec un sol à pH <strong>${p.ph}</strong>. Quel végétal est le plus adapté ?`,
  p=>`Votre client souhaite une plante <strong>${p.feuillage}</strong> supportant <strong>${p.rusticite}</strong>. Quel végétal choisissez-vous ?`,
  p=>`Pour une haie résistant à <strong>${p.rusticite}</strong>, ${expoLabel(p.exposition)}, en sol <strong>${p.ph}</strong>, quel végétal proposez-vous ?`,
  p=>`Un massif ${expoLabel(p.exposition)} nécessite une plante à résistance sécheresse <strong>${p.resistanceSech}</strong> et feuillage <strong>${p.feuillage}</strong>. Laquelle ?`,
  p=>`Pour couvrir une surface ${expoLabel(p.exposition)}, avec une hauteur adulte de <strong>${p.hauteurAdulte}</strong> et un sol <strong>${p.ph}</strong>, quel végétal convient ?`,
  p=>`Votre client veut une floraison en <strong>${p.periodeFloraison}</strong>, ${expoLabel(p.exposition)}, sol <strong>${p.ph}</strong>. Quel végétal proposez-vous ?`,
  p=>`Pour une plantation supportant <strong>${p.rusticite}</strong> avec une résistance à la sécheresse <strong>${p.resistanceSech}</strong>, quel végétal choisissez-vous ?`,
  p=>`Un espace ${expoLabel(p.exposition)} réclame un végétal de <strong>${p.hauteurAdulte}</strong> de hauteur adulte, à feuillage <strong>${p.feuillage}</strong>. Lequel ?`,
];

const TYPE_OPTIONS = [
  'Annuelle','Bisannuelle','Vivace herbacée','Bulbeuse',
  'Graminée ornementale','Fougère','Bambou',
  'Sous-arbrisseau','Arbrisseau','Arbuste','Rosier',
  'Arbre','Arbre fruitier','Conifère',
  'Liane / Grimpante','Couvre-sol',
  'Aquatique / Berge','Plante aromatique',
];
const FILLERS_FAMILLE = ['Rosaceae','Lamiaceae','Asteraceae','Poaceae','Cupressaceae','Betulaceae',
  'Buxaceae','Araliaceae','Asparagaceae','Oleaceae','Pinaceae','Fabaceae','Solanaceae','Ranunculaceae'];
const FILLERS = {
  feuillage:['Caduc','Persistant','Marcescent','Semi-persistant'],
  rusticite:['< -30°C','-30 / -25°C','-25 / -20°C','-20 / -15°C','-10°C','0°C'],
  exposition:['Ombre','Mi-ombre','Soleil','Ombre – Mi-ombre','Mi-ombre – Soleil','Ombre – Mi-ombre – Soleil'],
  ph:['Acide','Neutre','Basique','Acide à neutre','Neutre à basique','Acide à basique'],
  resistanceSech:['Faible','Modérée','Élevée','Très élevée'],
  hauteurAdulte:['0.3 – 0.6 m','5 – 10 m','15 – 25 m','2 – 4 m'],
  largeurAdulte:['0.2 – 0.5 m','3 – 6 m','8 – 15 m','1 – 2 m'],
  periodeFloraison:['Janvier – Février','Octobre – Novembre','Juin – Juillet – Août','Septembre – Octobre – Novembre'],
  couleurFleurs:['Rouge','Bleu','Orange','Blanc','Rose','Violet','Jaune'],
  famille: FILLERS_FAMILLE,
  interetOrnemental:['Floraison décorative','Feuillage décoratif','Fruits & baies décoratifs','Port architectural','Feuillage automnal','Silhouette hivernale','Bois / Tige / Rameau décoratif','Tapis fleuri'],
  autresInterets:['Mellifère','Médicinale','Feuillage aromatique','Comestible / Fruitière','Plante hôte','Toxique','Épineuse / Défensive','Fixatrice d\'azote'],
};

// Tous les champs disponibles pour le filtre questions multi
var MULTI_ALL_FIELDS = [
  {key:'photo',            label:'Reconnaissance',     icon:'📸', levels:[1,2,3]},
  {key:'dictee',           label:'Dictée botanique',   icon:'✏️', levels:[1,2,3]},
  {key:'feuillage',        label:'Feuillage',          icon:'🍃', levels:[1,2,3]},
  {key:'rusticite',        label:'Rusticité',          icon:'🌡️', levels:[1,2,3]},
  {key:'exposition',       label:'Exposition',         icon:'☀️', levels:[1,2,3]},
  {key:'ph',               label:'pH du sol',          icon:'🧪', levels:[1,2,3]},
  {key:'resistanceSech',   label:'Sécheresse',         icon:'💧☀️', levels:[1,2,3]},
  {key:'hauteurAdulte',    label:'Hauteur',            icon:'📏', levels:[1,2,3]},
  {key:'largeurAdulte',    label:'Largeur',            icon:'↔️', levels:[1,2,3]},
  {key:'periodeFloraison', label:'Floraison',          icon:'🌸', levels:[1,2,3]},
  {key:'couleurFleurs',    label:'Couleur fleurs',     icon:'🎨', levels:[1,2,3]},
  {key:'famille',          label:'Famille botanique',  icon:'🔬', levels:[2,3]},
  {key:'interetOrnemental',label:'Intérêt ornemental', icon:'🌿', levels:[2,3]},
  {key:'autresInterets',   label:'Autres intérêts',    icon:'⭐', levels:[2,3]},
  {key:'n3',               label:'Mise en situation',  icon:'🏗️', levels:[3]},
];


const DEFAULT_PLANTS = [
  {id:1,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lavandula_angustifolia_in_Murato.jpg/480px-Lavandula_angustifolia_in_Murato.jpg',latin:'Lavandula angustifolia',nom:'Lavande officinale',famille:'Lamiaceae',type:'Sous-arbrisseau',feuillage:'Persistant',rusticite:'-25 / -20°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Élevée',hauteurAdulte:'0.3 – 0.6 m',largeurAdulte:'0.4 – 0.8 m',periodeFloraison:'Juin – Août',couleurFleurs:'Violet, Mauve',interetOrnemental:'Floraison décorative,Feuillage décoratif,Floraison parfumée',autresInterets:'Mellifère,Médicinale,Feuillage aromatique',usageAmenagement:'Massif,Bordure,Couvre-sol,Rocaille,Talus',description:"Plante aromatique méditerranéenne très appréciée pour ses fleurs parfumées et sa résistance à la sécheresse."},
  {id:2,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Buxus_sempervirens0.jpg/480px-Buxus_sempervirens0.jpg',latin:'Buxus sempervirens',nom:'Buis commun',famille:'Buxaceae',type:'Arbuste persistant',feuillage:'Persistant',rusticite:'-25 / -20°C',exposition:'Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'1 – 5 m',largeurAdulte:'1 – 3 m',periodeFloraison:'Mars – Avril',couleurFleurs:'Jaune-vert',interetOrnemental:'Feuillage persistant,Port architectural,Topiaire',autresInterets:'Toxique',usageAmenagement:'Haie taillée,Bordure,Topiaire,Massif',description:"Arbuste persistant classique de la topiaire et des jardins à la française."},
  {id:3,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rosa_canina_-_bloom_and_bud.jpg/480px-Rosa_canina_-_bloom_and_bud.jpg',latin:'Rosa canina',nom:'Rosier des haies',famille:'Rosaceae',type:'Arbuste caduc',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Soleil',ph:'Neutre',resistanceSech:'Modérée',hauteurAdulte:'1 – 3 m',largeurAdulte:'1 – 2 m',periodeFloraison:'Mai – Juillet',couleurFleurs:'Rose pâle, Blanc',interetOrnemental:'Floraison décorative,Fruits & baies décoratifs',autresInterets:'Mellifère,Plante hôte,Comestible / Fruitière',usageAmenagement:'Haie libre,Haie champêtre,Massif,Talus',description:"Rosier sauvage très rustique pour haies champêtres. Cynorrhodons décoratifs en automne."},
  {id:4,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carpinus_betulus_foliage.jpg/480px-Carpinus_betulus_foliage.jpg',latin:'Carpinus betulus',nom:'Charme commun',famille:'Betulaceae',type:'Arbre caduc',feuillage:'Marcescent',rusticite:'-30 / -25°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Faible',hauteurAdulte:'10 – 25 m',largeurAdulte:'8 – 15 m',periodeFloraison:'Mars – Avril',couleurFleurs:'Jaune-vert (chatons)',interetOrnemental:'Feuillage caduc coloré,Port architectural,Silhouette hivernale',autresInterets:'Plante hôte',usageAmenagement:'Haie taillée,Haie champêtre,Arbre isolé,Alignement',description:"Arbre de référence en haies taillées grâce à sa marcescence hivernale."},
  {id:5,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hosta_sieboldiana.jpg/480px-Hosta_sieboldiana.jpg',latin:'Hosta sieboldiana',nom:'Hosta de Siebold',famille:'Asparagaceae',type:'Vivace herbacée',feuillage:'Caduc',rusticite:'-30 / -25°C',exposition:'Ombre – Mi-ombre',ph:'Neutre',resistanceSech:'Faible',hauteurAdulte:'0.6 – 0.9 m',largeurAdulte:'0.8 – 1.2 m',periodeFloraison:'Juillet – Août',couleurFleurs:'Blanc, Lavande',interetOrnemental:'Feuillage décoratif,Floraison décorative',autresInterets:'Plante hôte',usageAmenagement:'Massif,Bordure,Couvre-sol,Sous-bois',description:"Vivace indispensable pour les zones ombragées, grandes feuilles bleutées."},
  {id:6,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Phyllostachys_aurea_03.jpg/480px-Phyllostachys_aurea_03.jpg',latin:'Phyllostachys aurea',nom:'Bambou doré',famille:'Poaceae',type:'Graminée ligneuse persistante',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'3 – 8 m',largeurAdulte:'1 – 3 m',periodeFloraison:'Très rare',couleurFleurs:'Non significatives',interetOrnemental:'Feuillage persistant,Port architectural,Feuillage décoratif',autresInterets:'',usageAmenagement:'Massif,Brise-vent,Écran de verdure,Haie libre',description:"Bambou traçant à chaumes jaune-doré. Poser une barrière anti-rhizomes à la plantation."},
  {id:7,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Hedera_helix_-_1.jpg/480px-Hedera_helix_-_1.jpg',latin:'Hedera helix',nom:'Lierre grimpant',famille:'Araliaceae',type:'Liane persistante',feuillage:'Persistant',rusticite:'-25 / -20°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'20 – 30 m',largeurAdulte:'1 – 5 m',periodeFloraison:'Septembre – Octobre – Novembre',couleurFleurs:'Jaune-vert',interetOrnemental:'Feuillage persistant,Feuillage décoratif',autresInterets:'Mellifère,Plante hôte,Toxique',usageAmenagement:'Couvre-sol,Grimpante,Massif,Sous-bois',description:"Liane polyvalente pour murs, talus ombragés ou couvre-sol."},
  {id:8,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Thuja_occidentalis_foliage_and_cones.jpg/480px-Thuja_occidentalis_foliage_and_cones.jpg',latin:'Thuja occidentalis',nom:'Thuya occidental',famille:'Cupressaceae',type:'Conifère persistant',feuillage:'Persistant',rusticite:'< -30°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Faible',hauteurAdulte:'3 – 15 m',largeurAdulte:'1 – 4 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Jaune (discrètes)',interetOrnemental:'Feuillage persistant,Port architectural',autresInterets:'',usageAmenagement:'Haie taillée,Haie libre,Brise-vent,Massif',description:"Conifère de haie très répandu pour écrans végétaux persistants."},
  {id:9,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Achillea_millefolium_20070601.jpg/480px-Achillea_millefolium_20070601.jpg',latin:'Achillea millefolium',nom:'Achillée millefeuille',famille:'Asteraceae',type:'Vivace herbacée',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Soleil',ph:'Acide à neutre',resistanceSech:'Élevée',hauteurAdulte:'0.4 – 0.8 m',largeurAdulte:'0.3 – 0.6 m',periodeFloraison:'Juin – Juillet – Août – Septembre',couleurFleurs:'Blanc, Jaune, Rose, Rouge',interetOrnemental:'Floraison décorative,Feuillage décoratif',autresInterets:'Mellifère,Médicinale,Plante hôte',usageAmenagement:'Massif,Bordure,Prairie fleurie,Talus,Couvre-sol',description:"Vivace rustique, résistante à la sécheresse, idéale en prairie fleurie."},
  {id:10,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Forsythia_x_intermedia2.jpg/480px-Forsythia_x_intermedia2.jpg',latin:'Forsythia × intermedia',nom:'Forsythia',famille:'Oleaceae',type:'Arbuste caduc',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Mi-ombre – Soleil',ph:'Neutre',resistanceSech:'Modérée',hauteurAdulte:'2 – 3 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Mars – Avril',couleurFleurs:'Jaune vif',interetOrnemental:'Floraison décorative,Floraison précoce',autresInterets:'Mellifère',usageAmenagement:'Massif,Haie libre,Bordure,Talus',description:"Arbuste emblématique du printemps, fleurs jaune vif avant les feuilles."},
  {id:11,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Prunus_laurocerasus2.jpg/480px-Prunus_laurocerasus2.jpg',latin:'Prunus laurocerasus',nom:'Laurier-cerise',famille:'Rosaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'4 – 8 m',largeurAdulte:'3 – 5 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Blanc',interetOrnemental:'Feuillage persistant,Floraison décorative,Fruits & baies décoratifs',autresInterets:'Toxique',usageAmenagement:'Haie taillée,Haie libre,Sous-bois,Brise-vent',description:"Grand arbuste à feuilles coriaces et luisantes. Fleurs blanches en grappes dressées légèrement parfumées (amande amère). ATTENTION : toutes les parties sont toxiques (acide cyanhydrique). Éviter les sols calcaires (chlorose)."},
  {id:12,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Prunus_lusitanica_flowers.jpg/480px-Prunus_lusitanica_flowers.jpg',latin:'Prunus lusitanica',nom:'Laurier du Portugal',famille:'Rosaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à basique',resistanceSech:'Modérée',hauteurAdulte:'3 – 8 m',largeurAdulte:'3 – 5 m',periodeFloraison:'Juin – Juillet',couleurFleurs:'Blanc',interetOrnemental:'Feuillage persistant,Floraison décorative,Fruits & baies décoratifs',autresInterets:'Mellifère,Toxique',usageAmenagement:'Haie taillée,Haie libre,Plante isolée (sujet)',description:"Proche du laurier-cerise avec feuilles plus sombres et pétioles rouges caractéristiques. Grappes de fleurs blanches parfumées en juin-juillet. Plus tolérant au calcaire. Fruits noir-pourpre toxiques."},
  {id:13,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Berberis_julianae_flowers.jpg/480px-Berberis_julianae_flowers.jpg',latin:'Berberis julianae',nom:'Épine-vinette de Juliane',famille:'Berberidaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'1 – 2 m',largeurAdulte:'1 – 2 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Jaune',interetOrnemental:'Floraison décorative,Fruits & baies décoratifs,Feuillage persistant',autresInterets:'Épineuse / Défensive,Plante hôte',usageAmenagement:'Haie taillée,Haie libre,Massif',description:"Arbuste épineux persistant aux feuilles dentées et luisantes. Fleurs jaunes parfumées groupées au printemps, baies bleues-noires pruinées en automne. Haies défensives infranchissables."},
  {id:14,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Buddleja_davidii0.jpg/480px-Buddleja_davidii0.jpg',latin:'Buddleja davidii',nom:'Arbre aux papillons',famille:'Scrophulariaceae',type:'Arbuste',feuillage:'Caduc',rusticite:'-20 / -15°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Élevée',hauteurAdulte:'2 – 4 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Juillet – Septembre',couleurFleurs:'Violet, Mauve',interetOrnemental:'Floraison décorative,Floraison parfumée',autresInterets:'Mellifère,Plante hôte',usageAmenagement:'Massif,Plante isolée (sujet),Haie libre',description:"Arbuste à croissance rapide produisant de longs épis parfumés très attractifs pour les papillons. Taille sévère en mars recommandée pour maintenir un port compact et une floraison abondante."},
  {id:15,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Buddleja_globosa_flowers.jpg/480px-Buddleja_globosa_flowers.jpg',latin:'Buddleja globosa',nom:'Buddleia globuleux',famille:'Scrophulariaceae',type:'Arbuste',feuillage:'Semi-persistant',rusticite:'-15 / -10°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'2 – 4 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Mai – Juin',couleurFleurs:'Jaune orangé',interetOrnemental:'Floraison décorative,Port architectural',autresInterets:'Mellifère,Plante hôte',usageAmenagement:'Massif,Plante isolée (sujet),Haie libre',description:"Se distingue de B. davidii par ses fleurs en boules sphériques orange-jaune très parfumées. Feuillage semi-persistant, moins rustique. Taille légère après floraison uniquement."},
  {id:16,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Salix_rosmarinifolia_1.jpg/480px-Salix_rosmarinifolia_1.jpg',latin:'Salix rosmarinifolia',nom:'Saule à feuilles de romarin',famille:'Salicaceae',type:'Arbuste',feuillage:'Caduc',rusticite:'< -30°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Faible',hauteurAdulte:'0,5 – 1,5 m',largeurAdulte:'0,8 – 1,5 m',periodeFloraison:'Mars – Mai',couleurFleurs:'Jaune (chatons argentés)',interetOrnemental:'Feuillage décoratif,Bois / Tige / Rameau décoratif,Port architectural',autresInterets:'Mellifère,Plante hôte',usageAmenagement:'Massif,Bord de l’eau,Talus,Rocaille',description:"Petit saule à feuilles étroites gris-vert rappelant le romarin. Chatons argentés décoratifs au printemps avant les feuilles. Apprécie les sols frais à humides. Très rustique."},
  {id:17,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Thymus_vulgaris_2.jpg/480px-Thymus_vulgaris_2.jpg',latin:'Thymus vulgaris',nom:'Thym commun',famille:'Lamiaceae',type:'Sous-arbrisseau,Plante aromatique',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Très élevée',hauteurAdulte:'0,1 – 0,3 m',largeurAdulte:'0,2 – 0,4 m',periodeFloraison:'Mai – Juillet',couleurFleurs:'Rose pâle, Lilas',interetOrnemental:'Floraison décorative,Tapis fleuri',autresInterets:'Mellifère,Médicinale,Feuillage aromatique,Comestible / Fruitière',usageAmenagement:'Rocaille,Couvre-sol,Massif,Bac / Jardinière',description:"Aromatique méditerranéen très résistant à la sécheresse, excellent attracteur de pollinisateurs. Indispensable en cuisine et phytothérapie. Idéal en rocaille et jardins secs."},
  {id:18,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Magnolia_grandiflora.jpg/480px-Magnolia_grandiflora.jpg',latin:'Magnolia grandiflora',nom:'Magnolia à grandes fleurs',famille:'Magnoliaceae',type:'Arbre',feuillage:'Persistant',rusticite:'-15°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'8 – 20 m',largeurAdulte:'5 – 10 m',periodeFloraison:'Juin – Septembre',couleurFleurs:'Blanc',interetOrnemental:'Floraison décorative,Floraison parfumée,Feuillage persistant,Fruits & baies décoratifs',autresInterets:'',usageAmenagement:'Plante isolée (sujet)',description:"Grand arbre à feuilles coriaces brillantes, vert foncé dessus et brun-roux dessous. Fleurs blanches géantes (20-30 cm) très parfumées de juin à septembre. Sol acide, frais et profond. Sensible au calcaire."},
  {id:19,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Magnolia_x_soulangeana.jpg/480px-Magnolia_x_soulangeana.jpg',latin:'Magnolia × soulangeana',nom:'Magnolia de Soulange',famille:'Magnoliaceae',type:'Arbre',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'4 – 8 m',largeurAdulte:'4 – 6 m',periodeFloraison:'Mars – Avril',couleurFleurs:'Blanc & Rose, Rose',interetOrnemental:'Floraison décorative,Port architectural,Silhouette hivernale',autresInterets:'',usageAmenagement:'Plante isolée (sujet),Massif',description:"Hybride (M. denudata × M. liliiflora) à floraison spectaculaire avant les feuilles. Grandes fleurs tulipées blanc rosé à rose-pourpre. Éviter les expositions aux gelées tardives. Sol acide à neutre."},
  {id:20,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Magnolia_stellata1.jpg/480px-Magnolia_stellata1.jpg',latin:'Magnolia stellata',nom:'Magnolia étoilé',famille:'Magnoliaceae',type:'Arbuste',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Faible',hauteurAdulte:'1 – 3 m',largeurAdulte:'1,5 – 3 m',periodeFloraison:'Février – Avril',couleurFleurs:'Blanc',interetOrnemental:'Floraison décorative,Floraison parfumée,Port architectural,Silhouette hivernale',autresInterets:'',usageAmenagement:'Plante isolée (sujet),Massif,Bac / Jardinière',description:"Magnolia compact à floraison très précoce, fleurs étoilées à nombreux pétales blancs légèrement parfumées. Idéal pour les petits jardins. Croissance lente. Protéger des gelées tardives."},
  {id:21,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Cornus_alba_-_Flickr_-_peganum.jpg/480px-Cornus_alba_-_Flickr_-_peganum.jpg',latin:'Cornus alba',nom:'Cornouiller blanc',famille:'Cornaceae',type:'Arbuste',feuillage:'Caduc',rusticite:'< -30°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Faible',hauteurAdulte:'2 – 3 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Mai – Juin',couleurFleurs:'Blanc crème',interetOrnemental:'Bois / Tige / Rameau décoratif,Feuillage caduc coloré,Fruits & baies décoratifs',autresInterets:'Mellifère,Plante hôte',usageAmenagement:'Massif,Bord de l’eau,Haie libre,Talus',description:"Très rustique, remarquable pour ses tiges rouge vif ornementales en hiver. Apprécie les sols frais à humides. Tailler en fin d'hiver pour stimuler la couleur des jeunes rameaux."},
  {id:22,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Cornus_sanguinea_fruits.JPG/480px-Cornus_sanguinea_fruits.JPG',latin:'Cornus sanguinea',nom:'Cornouiller sanguin',famille:'Cornaceae',type:'Arbuste',feuillage:'Caduc',rusticite:'< -30°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à basique',resistanceSech:'Modérée',hauteurAdulte:'2 – 4 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Mai – Juin',couleurFleurs:'Blanc',interetOrnemental:'Bois / Tige / Rameau décoratif,Feuillage automnal,Fruits & baies décoratifs',autresInterets:'Mellifère,Plante hôte',usageAmenagement:'Haie champêtre,Haie libre,Massif,Talus',description:"Espèce indigène à feuillage automnal rouge vif et rameaux colorés en hiver. Très adaptable à tous types de sols. Idéal pour les haies champêtres biodiversité."},
  {id:23,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Viburnum_tinus_flowers.jpg/480px-Viburnum_tinus_flowers.jpg',latin:'Viburnum tinus',nom:'Laurier-tin',famille:'Adoxaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-15 / -10°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à basique',resistanceSech:'Modérée',hauteurAdulte:'2 – 4 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Novembre – Avril',couleurFleurs:'Blanc, Rose pâle',interetOrnemental:'Floraison décorative,Feuillage persistant,Fruits & baies décoratifs,Silhouette hivernale',autresInterets:'Mellifère,Plante hôte',usageAmenagement:'Haie taillée,Haie libre,Massif,Sous-bois',description:"Précieux pour sa floraison hivernale : fleurs blanches à boutons roses de novembre à avril, suivies de baies bleu métallique. Très adaptable, supporte l'ombre. Floraison la plus longue de nos arbustes persistants."},
  {id:24,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Syringa_vulgaris_Praha_2012_1.jpg/480px-Syringa_vulgaris_Praha_2012_1.jpg',latin:'Syringa vulgaris',nom:'Lilas commun',famille:'Oleaceae',type:'Arbuste',feuillage:'Caduc',rusticite:'< -30°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'3 – 6 m',largeurAdulte:'3 – 5 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Violet, Mauve',interetOrnemental:'Floraison décorative,Floraison parfumée,Silhouette hivernale',autresInterets:'Mellifère',usageAmenagement:'Haie libre,Massif,Plante isolée (sujet)',description:"Arbuste emblématique à floraison printanière très parfumée. Grands panicules de fleurs mauves à violettes. Besoin d'une période froide pour fleurir (vernalisation). Drageonant — supprimer les gourmands."},
  {id:25,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nandina_domestica.jpg/480px-Nandina_domestica.jpg',latin:'Nandina domestica',nom:'Bambou sacré — Nandine',famille:'Berberidaceae',type:'Arbuste',feuillage:'Semi-persistant',rusticite:'-15°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'1 – 2 m',largeurAdulte:'0,8 – 1,5 m',periodeFloraison:'Juin – Juillet',couleurFleurs:'Blanc',interetOrnemental:'Feuillage automnal,Fruits & baies décoratifs,Feuillage décoratif,Port architectural',autresInterets:'Toxique',usageAmenagement:'Massif,Bac / Jardinière,Plante isolée (sujet)',description:"Arbuste élégant au port dressé, feuillage finement découpé passant au rouge en automne-hiver. Panicules de baies rouges persistantes très décoratives mais toxiques. N'est pas un bambou (Berbéridacée)."},
  {id:26,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pittosporum_tobira_MS_4276.jpg/480px-Pittosporum_tobira_MS_4276.jpg',latin:'Pittosporum tobira',nom:'Pittospore du Japon',famille:'Pittosporaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-8 / -10°C',exposition:'Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Élevée',hauteurAdulte:'2 – 4 m',largeurAdulte:'2 – 4 m',periodeFloraison:'Avril – Juin',couleurFleurs:'Blanc crème',interetOrnemental:'Feuillage persistant,Floraison parfumée,Floraison décorative',autresInterets:'Mellifère',usageAmenagement:'Haie taillée,Massif,Bac / Jardinière',description:"Arbuste méditerranéen à feuilles coriaces brillantes disposées en rosettes. Fleurs crème très parfumées (odeur de fleur d'oranger). Résistant aux embruns. Supporte bien la taille."},
  {id:27,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Pittosporum_tobira_MS_4276.jpg/480px-Pittosporum_tobira_MS_4276.jpg',latin:"Pittosporum tobira 'Nana'",nom:'Pittospore nain',famille:'Pittosporaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-8 / -10°C',exposition:'Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Élevée',hauteurAdulte:'0,6 – 1 m',largeurAdulte:'0,8 – 1,2 m',periodeFloraison:'Avril – Juin',couleurFleurs:'Blanc crème',interetOrnemental:'Feuillage persistant,Floraison parfumée',autresInterets:'Mellifère',usageAmenagement:'Massif,Bac / Jardinière,Couvre-sol',description:"Cultivar compact du Pittospore du Japon. Même floraison parfumée (odeur d'oranger) que l'espèce type. Port naturellement dense et régulier. Alternative au buis pour bordures basses."},
  {id:28,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Pittosporum_tenuifolium_01.jpg/480px-Pittosporum_tenuifolium_01.jpg',latin:'Pittosporum tenuifolium',nom:"Pittospore à petites feuilles",famille:'Pittosporaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-7 / -8°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'3 – 6 m',largeurAdulte:'2 – 4 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Brun-rouge',interetOrnemental:'Feuillage persistant,Feuillage décoratif,Port architectural',autresInterets:'Mellifère',usageAmenagement:'Haie taillée,Haie libre,Plante isolée (sujet)',description:"Arbuste élancé à feuilles ovales ondulées vert brillant. Petites fleurs brun-rouge au parfum chocolaté le soir. Port naturellement conique. Moins rustique que P. tobira."},
  {id:29,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Pittosporum_tenuifolium_Variegatum_02.jpg/480px-Pittosporum_tenuifolium_Variegatum_02.jpg',latin:"Pittosporum tenuifolium 'Variegatum'",nom:'Pittospore panaché',famille:'Pittosporaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-7 / -8°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'2 – 4 m',largeurAdulte:'1,5 – 3 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Brun-rouge',interetOrnemental:'Feuillage panaché,Feuillage persistant,Port architectural',autresInterets:'',usageAmenagement:'Haie libre,Massif,Plante isolée (sujet)',description:"Cultivar panaché de P. tenuifolium, feuilles marginées de blanc crème très lumineuses. Moins vigoureux que l'espèce type. Apporte un contraste lumineux dans les massifs."},
  {id:30,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Agapanthus_africanus_flower.jpg/480px-Agapanthus_africanus_flower.jpg',latin:'Agapanthus africanus',nom:"Agapanthe d'Afrique",famille:'Agapanthaceae',type:'Vivace herbacée',feuillage:'Persistant',rusticite:'-8 / -5°C',exposition:'Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'0,5 – 1 m (hampes)',largeurAdulte:'0,4 – 0,6 m',periodeFloraison:'Juillet – Septembre',couleurFleurs:'Bleu, Violet',interetOrnemental:'Floraison décorative,Feuillage persistant,Port architectural',autresInterets:'Mellifère',usageAmenagement:'Massif,Bac / Jardinière,Couvre-sol',description:"Vivace à grandes ombelles de fleurs bleu-violet sur hautes hampes florales. Touffe de feuilles arquées persistantes. L'espèce type est peu rustique : cultiver en bac dans les régions froides."},
  {id:31,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Arbutus_unedo_flowers_leaves.jpg/480px-Arbutus_unedo_flowers_leaves.jpg',latin:'Arbutus unedo',nom:'Arbousier commun — Arbre aux fraises',famille:'Ericaceae',type:'Arbuste / Petit arbre',feuillage:'Persistant',rusticite:'-15°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Élevée',hauteurAdulte:'3 – 8 m',largeurAdulte:'3 – 6 m',periodeFloraison:'Octobre – Décembre',couleurFleurs:'Blanc, Rose pâle',interetOrnemental:'Floraison décorative,Fruits & baies décoratifs,Bois / Tige / Rameau décoratif,Feuillage persistant',autresInterets:'Comestible / Fruitière,Mellifère,Plante hôte',usageAmenagement:'Plante isolée (sujet),Haie libre,Massif',description:"Très ornemental : fleurs blanches et arbouses rouges coexistent en automne. Arbouses comestibles (saveur acidulée). Écorce brun-rouge exfoliante décorative. Espèce pyrophile méditerranéenne."},
  {id:32,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Photinia_x_fraseri_Red_Robin.jpg/480px-Photinia_x_fraseri_Red_Robin.jpg',latin:'Photinia × fraseri',nom:'Photinia de Fraser',famille:'Rosaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-15 / -10°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'3 – 6 m',largeurAdulte:'2 – 4 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Blanc',interetOrnemental:'Feuillage décoratif,Feuillage persistant,Floraison décorative',autresInterets:'Mellifère',usageAmenagement:'Haie taillée,Haie libre,Plante isolée (sujet),Massif',description:"Très populaire pour ses jeunes pousses rouge-corail vives contrastant avec les feuilles matures vert brillant. Fleurs blanches en corymbes. Supporte les tailles répétées. Sensible à la photiniose (Entomosporium)."},
  {id:33,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Cupressocyparis_leylandii.jpg/480px-Cupressocyparis_leylandii.jpg',latin:'× Cupressocyparis leylandii',nom:'Cyprès de Leyland',famille:'Cupressaceae',type:'Conifère',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Soleil',ph:'Acide à basique',resistanceSech:'Modérée',hauteurAdulte:'15 – 35 m',largeurAdulte:'3 – 6 m',periodeFloraison:'Mars – Avril',couleurFleurs:'',interetOrnemental:'Feuillage persistant,Port architectural,Silhouette hivernale',autresInterets:'Résistante à la pollution',usageAmenagement:'Haie taillée,Brise-vent',description:"Conifère à croissance très rapide (hybride Chamaecyparis nootkatensis × Cupressus macrocarpa). Taille obligatoire 2×/an. Ne se régénère pas sur vieux bois. Syn. moderne : Cuprocyparis leylandii."},
  {id:34,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Elaeagnus_x_ebbingei.jpg/480px-Elaeagnus_x_ebbingei.jpg',latin:'Elaeagnus × ebbingei',nom:'Chalef de Ebbinge',famille:'Elaeagnaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à basique',resistanceSech:'Élevée',hauteurAdulte:'3 – 5 m',largeurAdulte:'3 – 4 m',periodeFloraison:'Octobre – Novembre',couleurFleurs:'Blanc crème',interetOrnemental:'Feuillage persistant,Floraison parfumée,Feuillage décoratif',autresInterets:"Fixatrice d'azote,Mellifère,Résistante à la pollution",usageAmenagement:'Haie taillée,Haie libre,Brise-vent,Haie champêtre',description:"Feuilles coriaces vert foncé dessus, argentées dessous. Petites fleurs blanches très parfumées en automne. Excellent pour le littoral. Fixe l'azote atmosphérique (nodosités racinaires)."},
  {id:35,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Feijoa_sellowiana_flowers.jpg/480px-Feijoa_sellowiana_flowers.jpg',latin:'Feijoa sellowiana',nom:'Goyavier du Brésil — Feijoa',famille:'Myrtaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-12°C',exposition:'Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'2 – 4 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Mai – Juin',couleurFleurs:'Blanc & Rose',interetOrnemental:'Floraison décorative,Feuillage persistant,Fruits & baies décoratifs',autresInterets:'Comestible / Fruitière,Mellifère',usageAmenagement:'Plante isolée (sujet),Haie libre,Bac / Jardinière',description:"Feuilles ovales gris-vert dessus, argentées dessous. Fleurs spectaculaires à pétales charnus blancs et étamines rouges. Fruits verts au parfum anisé comestibles. Syn. : Acca sellowiana."},
  {id:36,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Cortaderia_selloana_in_Jardin_des_Plantes_de_Paris.jpg/480px-Cortaderia_selloana_in_Jardin_des_Plantes_de_Paris.jpg',latin:'Cortaderia selloana',nom:"Herbe de la Pampa",famille:'Poaceae',type:'Graminée ornementale',feuillage:'Persistant',rusticite:'-15 / -10°C',exposition:'Soleil',ph:'Acide à basique',resistanceSech:'Élevée',hauteurAdulte:'2 – 3,5 m (panaches)',largeurAdulte:'1,5 – 2,5 m',periodeFloraison:'Août – Octobre',couleurFleurs:'Blanc crème',interetOrnemental:'Floraison décorative,Port architectural,Silhouette hivernale,Feuillage décoratif',autresInterets:'',usageAmenagement:"Plante isolée (sujet),Massif,Bord de l’eau",description:"Grande graminée formant d'imposantes touffes aux longues feuilles coupantes. Spectaculaires panaches soyeux blanc-argenté en automne. ATTENTION : feuilles tranchantes — manipuler avec des gants."},
  {id:37,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Osmanthus_burkwoodii_2.jpg/480px-Osmanthus_burkwoodii_2.jpg',latin:'Osmanthus × burkwoodii',nom:'Osmanthus de Burkwood',famille:'Oleaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-15°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'2 – 3 m',largeurAdulte:'2 – 3 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Blanc',interetOrnemental:'Feuillage persistant,Floraison parfumée,Floraison décorative',autresInterets:'Mellifère',usageAmenagement:'Haie taillée,Massif,Plante isolée (sujet)',description:"Hybride (O. delavayi × O. decorus) à petites feuilles ovales dentées brillantes. Floraison blanche très parfumée au printemps. Port dense et arrondi. Taille après floraison uniquement."},
  {id:38,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Osmanthus_fragrans.jpg/480px-Osmanthus_fragrans.jpg',latin:'Osmanthus fragrans',nom:'Osmanthe odorant',famille:'Oleaceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-10 / -5°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'3 – 6 m',largeurAdulte:'2 – 4 m',periodeFloraison:'Septembre – Novembre',couleurFleurs:'Blanc crème',interetOrnemental:'Floraison parfumée,Feuillage persistant',autresInterets:'Mellifère',usageAmenagement:'Plante isolée (sujet),Haie libre,Bac / Jardinière',description:"Minuscules fleurs blanches dégageant un parfum exceptionnel en automne, perceptible à plusieurs mètres. Moins rustique : à protéger en régions à hivers froids."},
  {id:39,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Euonymus_europaeus_fruits.jpg/480px-Euonymus_europaeus_fruits.jpg',latin:'Euonymus europaeus',nom:"Fusain d'Europe",famille:'Celastraceae',type:'Arbuste',feuillage:'Caduc',rusticite:'< -30°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'2 – 6 m',largeurAdulte:'2 – 4 m',periodeFloraison:'Mai – Juin',couleurFleurs:'Vert-jaune',interetOrnemental:'Fruits & baies décoratifs,Feuillage automnal,Bois / Tige / Rameau décoratif',autresInterets:'Plante hôte,Toxique',usageAmenagement:'Haie champêtre,Haie libre,Sous-bois,Massif',description:"Remarquable pour ses capsules roses à arilles oranges en automne et son feuillage rouge vif. Tous les organes sont toxiques. Espèce indigène très favorable à la biodiversité."},
  {id:40,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Euonymus_japonicus_2.jpg/480px-Euonymus_japonicus_2.jpg',latin:'Euonymus japonicus',nom:'Fusain du Japon',famille:'Celastraceae',type:'Arbuste',feuillage:'Persistant',rusticite:'-15 / -10°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Acide à basique',resistanceSech:'Modérée',hauteurAdulte:'2 – 4 m',largeurAdulte:'1,5 – 3 m',periodeFloraison:'Juin – Juillet',couleurFleurs:'Vert-blanc',interetOrnemental:'Feuillage persistant,Feuillage décoratif',autresInterets:'Résistante à la pollution',usageAmenagement:'Haie taillée,Massif,Bac / Jardinière',description:"Arbuste persistant à feuilles ovales coriaces très brillantes. Très tolérant à la taille, au sel marin et à la pollution urbaine. Sensible à l'oïdium. Nombreux cultivars panachés disponibles."},
];

// SVG fallbacks
const LEAF_SVG=`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4ab870" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c0 0-8-4-8-12C4 5 8 2 12 2s8 3 8 8c0 8-8 12-8 12z"/><path d="M12 22V11"/><path d="M12 11C9 8 6 8 6 8"/><path d="M12 14c3-3 6-3 6-3"/></svg>`;
const LEAF_SVG_SM=`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ab870" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c0 0-8-4-8-12C4 5 8 2 12 2s8 3 8 8c0 8-8 12-8 12z"/><path d="M12 22V11"/><path d="M12 11C9 8 6 8 6 8"/><path d="M12 14c3-3 6-3 6-3"/></svg>`;

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
let role = null, plants = [], scores = [];
let lbFilter = 'all';
let sbConf = null; // {url, key} or null
let cloudOk = false;

// Quiz
let qName='', qLevel=1, qPlants=[], qUsed=[], qRound=null;
let qDicteeMode=false; // Mode dictée botanique
let qPhotoSel=null, qKQ=null, qKSel=null, qSQ=null, qSSel=null, qPhotoType='identify';
let qScore={ok:0,total:0,timeouts:0};
let qNum=0, qPhase='name';
let qTimerInterval=null, qTimerLeft=TIMER_SEC, qTimerRunning=false;
let qHistory=[]; // [{latin,nom,step1Type,step1Ok,step2Label,step2Ok,step2Correct}]
let qFilter={feuillage:'',exposition:'',type:''}; // révision ciblée
let qStreak=0; // série de bonnes réponses consécutives
let qDicteeFormatMsg=null; // message format dictée
function hapticWrong(){ try{ if(navigator.vibrate) navigator.vibrate([120,60,80]); }catch(e){} }
// ── Normalisation nom latin : Genre Espèce (1re lettre Majuscule, reste minuscule) ──
function normalizeLatin(str){
  if(!str) return str;
  str = str.trim();
  // Réduire les espaces multiples
  str = str.replace(/\s+/g,' ');
  // Séparer les tokens (mots et ×)
  const tokens = str.split(' ');
  let firstWordDone = false;
  return tokens.map(t=>{
    if(t==='×' || t==='x' || t==='X') return '×'; // conserver le signe hybride
    if(!firstWordDone){
      firstWordDone = true;
      // Genre : première lettre majuscule, reste minuscule
      return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    }
    // Épithète et sous-taxons : tout en minuscule
    return t.toLowerCase();
  }).join(' ');
}

// ── Vérification écriture nom latin (dictée) ──
// Retourne {correct:bool, normalized:string, badFormat:bool, formatMsg:string}
function checkLatinDictee(input, expected){
  const inp = input.trim();
  const norm = normalizeLatin(inp);
  const correct = norm.toLowerCase() === expected.toLowerCase();
  // Vérifier la casse : Genre avec majuscule, reste minuscule
  const tokens = inp.replace(/\s+/g,' ').split(' ');
  let badFormat = false, formatMsg = '';
  if(tokens.length >= 1 && tokens[0] !== '×'){
    const genre = tokens[0];
    if(genre !== genre.charAt(0).toUpperCase()+genre.slice(1).toLowerCase()){
      badFormat = true;
      formatMsg = '⚠️ Le genre doit avoir une majuscule à la 1ʳᵉ lettre et le reste en minuscule : <em>'+norm+'</em>';
    }
  }
  if(!badFormat && tokens.length >= 2){
    for(let i=1;i<tokens.length;i++){
      if(tokens[i]==='×') continue;
      if(tokens[i] !== tokens[i].toLowerCase()){
        badFormat = true;
        formatMsg = "⚠️ L'épithète spécifique s'écrit entièrement en minuscules : <em>"+norm+"</em>";
        break;
      }
    }
  }
  return {correct, normalized:norm, badFormat, formatMsg};
}
// Calcule les points dictée selon niveau et formatage
function dicteePoints(isCorrect, badFormat, level){
  if(!isCorrect) return 0;
  if(!badFormat) return 1; // écriture parfaite
  if(level===1) return 0.5; // niveau 1 : demi-point si bonne réponse mais mauvaise casse
  return 0; // niveau 2-3 : 0 point si mauvaise casse
}



let qPriorityMode=false; // mode erreurs prioritaires
const SK_ERRORS='chloroquiz_errors_v1';
const SK_OFFLINE_QUEUE='chloroquiz_offline_queue_v1';
const SK_SESSION    = 'chloroquiz_session';
const SK_QUIZ_STATE = 'chloroquiz_quiz_state';

// Form
let editingId=null, formPhotoB64=null, formPhoto2B64=null;

// ══════════════════════════════════════════════════════
//  SUPABASE API
// ══════════════════════════════════════════════════════
function sbHeaders(extra={}){
  return {
    'apikey': sbConf.key,
    'Authorization': 'Bearer '+sbConf.key,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function sbPatch(table, filters, body){
  const url = sbConf.url+'/rest/v1/'+table+'?'+filters;
  const h = sbHeaders({'Prefer':'return=minimal'});
  const r = await fetch(url, {method:'PATCH', headers:h, body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  return null;
}

async function sbGet(table, params=''){
  const r = await fetch(`${sbConf.url}/rest/v1/${table}?${params}`, {headers: sbHeaders()});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

async function sbPost(table, body, preferOrQuery=''){
  // Sépare on_conflict (queryString) du Prefer header
  var qs = '', prefer = '';
  if(preferOrQuery.includes('on_conflict=')){
    var parts = preferOrQuery.split('&');
    parts.forEach(function(p){
      if(p.startsWith('on_conflict=')) qs = p;
      else if(p) prefer = p;
    });
  } else {
    prefer = preferOrQuery;
  }
  const url = sbConf.url+'/rest/v1/'+table+(qs?'?'+qs:'');
  const h = sbHeaders(prefer ? {'Prefer': prefer} : {});
  const r = await fetch(url, {method:'POST', headers:h, body:JSON.stringify(body)});
  if(!r.ok) throw new Error(await r.text());
  return r.status === 204 ? null : r.json().catch(()=>null);
}

async function sbDelete(table, params){
  const r = await fetch(`${sbConf.url}/rest/v1/${table}?${params}`, {method:'DELETE', headers: sbHeaders()});
  if(!r.ok) throw new Error(await r.text());
}

// ══════════════════════════════════════════════════════
//  DATA LAYER — plants
// ══════════════════════════════════════════════════════
async function loadPlants(){
  if(cloudOk){
    try{
      const rows = await sbGet('floralab_data','key=eq.plants&select=value');
      if(rows.length) plants = rows[0].value.map(p=>({...p,famille:normalizeFamille(p.famille||'')||p.famille}));
      else plants = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
    } catch(e){ console.warn('Supabase read plants fail',e); plantsFromLocal(); }
  } else plantsFromLocal();
}

function plantsFromLocal(){
  try{ const r=localStorage.getItem(SK_PLANTS); plants=(r?JSON.parse(r):JSON.parse(JSON.stringify(DEFAULT_PLANTS))).map(p=>({...p,famille:normalizeFamille(p.famille||'')||p.famille})); }
  catch{ plants=JSON.parse(JSON.stringify(DEFAULT_PLANTS)); }
}

async function savePlants(){
  if(cloudOk){
    try{
      await sbPost('floralab_data',{key:'plants',value:plants,updated_at:new Date().toISOString()},'resolution=merge-duplicates');
      flashSaved();
    } catch(e){ console.warn('Supabase save plants fail',e); localSavePlants(); }
  } else localSavePlants();
}

function localSavePlants(){
  try{ localStorage.setItem(SK_PLANTS,JSON.stringify(plants)); flashSaved(); } catch(e){}
}

// ══════════════════════════════════════════════════════
//  DATA LAYER — scores
// ══════════════════════════════════════════════════════
async function loadScores(){
  if(cloudOk){
    try{
      scores = await sbGet('floralab_scores','select=*&order=pct.desc,ok.desc');
    } catch(e){ console.warn('Supabase read scores fail',e); scoresFromLocal(); }
  } else scoresFromLocal();
}

function scoresFromLocal(){
  try{ const r=localStorage.getItem(SK_SCORES); scores=r?JSON.parse(r):[]; }
  catch{ scores=[]; }
}

async function addScore(s){
  if(cloudOk){
    try{
      await sbPost('floralab_scores',s,'return=minimal');
      await loadScores();
      // Try to sync queued offline scores
      syncOfflineQueue();
    } catch(e){
      console.warn('Supabase add score fail',e);
      scoresLocalAdd(s);
      addToOfflineQueue(s);
      showOfflineBanner(1);
    }
  } else {
    scoresLocalAdd(s);
    addToOfflineQueue(s);
    showOfflineBanner();
  }
}

function addToOfflineQueue(s){
  let q=[];
  try{ q=JSON.parse(localStorage.getItem(SK_OFFLINE_QUEUE)||'[]'); }catch(e){}
  q.push(s);
  try{ localStorage.setItem(SK_OFFLINE_QUEUE,JSON.stringify(q)); }catch(e){}
}

function showOfflineBanner(extra=0){
  let q=[];
  try{ q=JSON.parse(localStorage.getItem(SK_OFFLINE_QUEUE)||'[]'); }catch(e){}
  const n=q.length+extra;
  const banner=document.getElementById('offline-banner');
  const msg=document.getElementById('offline-sync-msg');
  if(banner){
    banner.style.display='flex';
    if(msg) msg.textContent=`${n} score(s) en attente — seront synchronisés au retour en ligne.`;
  }
}

async function syncOfflineQueue(){
  let q=[];
  try{ q=JSON.parse(localStorage.getItem(SK_OFFLINE_QUEUE)||'[]'); }catch(e){}
  if(!q.length||!cloudOk) return;
  let synced=0;
  for(const s of q){
    try{ await sbPost('floralab_scores',s,'return=minimal'); synced++; }catch(e){ break; }
  }
  if(synced>0){
    const remaining=q.slice(synced);
    try{ localStorage.setItem(SK_OFFLINE_QUEUE,JSON.stringify(remaining)); }catch(e){}
    if(remaining.length===0){
      const banner=document.getElementById('offline-banner');
      if(banner) banner.style.display='none';
    }
  }
}

function scoresLocalAdd(s){
  scores.push(s);
  try{ localStorage.setItem(SK_SCORES,JSON.stringify(scores)); } catch(e){}
}

// ══════════════════════════════════════════════════════
//  DATA LAYER — passwords
// ══════════════════════════════════════════════════════
async function loadPasswords(){
  // Try cloud first
  if(cloudOk){
    try{
      const rows = await sbGet('floralab_data','key=eq.passwords&select=value');
      if(rows.length){ PW_USER=rows[0].value.user; PW_ADMIN=rows[0].value.admin; return; }
    } catch(e){}
  }
  // Fallback local
  try{
    const saved = JSON.parse(localStorage.getItem(SK_PASSWORDS));
    if(saved){ PW_USER=saved.user||PW_USER; PW_ADMIN=saved.admin||PW_ADMIN; }
  } catch(e){}
}

async function savePasswords(newUser, newAdmin){
  PW_USER=newUser; PW_ADMIN=newAdmin;
  const obj={user:newUser,admin:newAdmin};
  try{ localStorage.setItem(SK_PASSWORDS,JSON.stringify(obj)); } catch(e){}
  if(cloudOk){
    try{ await sbPost('floralab_data',{key:'passwords',value:obj,updated_at:new Date().toISOString()},'resolution=merge-duplicates'); }
    catch(e){ console.warn('Cloud save passwords fail',e); }
  }
}

async function resetScores(){
  if(!confirm('Remettre le classement à zéro ? Action irréversible.')) return;
  if(cloudOk){
    try{ await sbDelete('floralab_scores','id=gt.0'); scores=[]; }
    catch(e){ alert('Erreur : '+e.message); return; }
  } else {
    scores=[];
    localStorage.removeItem(SK_SCORES);
  }
  renderScores();
}

// ══════════════════════════════════════════════════════
//  SUPABASE SETUP
// ══════════════════════════════════════════════════════
function loadSbConf(){
  try{ sbConf = JSON.parse(localStorage.getItem(SK_SB_CONF)); } catch{ sbConf=null; }
  // Si pas de conf sauvegardée, utiliser les identifiants intégrés
  if(!sbConf || !sbConf.url || !sbConf.key){
    sbConf = {url: SB_DEFAULT_URL, key: SB_DEFAULT_KEY};
  }
}

function saveSbConf(url,key){
  sbConf={url:url.replace(/\/$/,''),key};
  localStorage.setItem(SK_SB_CONF,JSON.stringify(sbConf));
}

function disconnectCloud(){
  if(!confirm('Déconnecter le cloud ? Les données resteront en ligne.')) return;
  sbConf=null; cloudOk=false;
  localStorage.removeItem(SK_SB_CONF);
  updateCloudDot();
  renderAdmin();
}

async function testConnection(url, key){
  const tmpConf = {url: url.replace(/\/$/,''), key};
  const r = await fetch(`${tmpConf.url}/rest/v1/floralab_data?select=key&limit=1`, {
    headers:{'apikey':key,'Authorization':'Bearer '+key}
  });
  if(!r.ok){
    const txt = await r.text();
    throw new Error(txt.includes('relation') ? 'Tables non trouvées — avez-vous exécuté le SQL ?' : `Erreur ${r.status}`);
  }
  return true;
}

function updateCloudDot(){
  const dot = document.getElementById('cloud-dot');
  const lbl = document.getElementById('cloud-dot-label');
  if(!dot) return;
  dot.className = 'cloud-dot ' + (cloudOk ? 'online' : (sbConf ? 'offline' : 'offline'));
  lbl.textContent = cloudOk ? '● En ligne' : (sbConf ? '⚠ Non connecté' : '○ Local');
}

function onCloudDotClick(){
  if(role==='admin') showPage('admin');
}

function openCloudSetup(){
  const root = document.getElementById('overlay-root');
  root.innerHTML = `
    <div class="overlay" onclick="if(event.target===this)closeModal()">
      <div class="setup-modal">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div style="font-family:var(--disp);font-size:24px;font-weight:900;color:var(--cr);margin-bottom:6px">☁️ Connexion Cloud</div>
        <div style="font-size:13px;color:rgba(200,223,204,.45);margin-bottom:22px">Connectez Supabase pour partager les plantes et le classement avec tous les apprentis.</div>

        <div class="setup-step">
          <div class="setup-step-num">1</div>
          <div class="setup-step-body">
            <div class="setup-step-title">Créez un compte Supabase gratuit</div>
            <div class="setup-step-desc">Allez sur <a href="https://supabase.com" target="_blank">supabase.com</a> → "Start for free" → créez un projet (choisissez la région <strong>Europe West</strong>).</div>
          </div>
        </div>

        <div class="setup-step">
          <div class="setup-step-num">2</div>
          <div class="setup-step-body">
            <div class="setup-step-title">Créez les tables</div>
            <div class="setup-step-desc">Dans votre projet Supabase → onglet <strong>SQL Editor</strong> → copiez-collez ce code → cliquez <strong>Run</strong> :</div>
            <div class="sql-block">${SQL_SETUP}</div>
            <button class="copy-sql-btn" onclick="copySQL()">📋 Copier le SQL</button>
          </div>
        </div>

        <div class="setup-step">
          <div class="setup-step-num">3</div>
          <div class="setup-step-body">
            <div class="setup-step-title">Entrez vos identifiants</div>
            <div class="setup-step-desc">Dans Supabase → <strong>Settings → API</strong> → copiez l'URL du projet et la clé <em>anon public</em> :</div>
            <input class="setup-url-input" id="sb-url-input" placeholder="https://xxxxxxxxxxxxxx.supabase.co" type="url"/>
            <input class="setup-url-input" id="sb-key-input" placeholder="Clé anon public (eyJ…)" style="margin-top:6px;letter-spacing:.5px" type="text"/>
            <button class="setup-test-btn" id="sb-test-btn" onclick="doTestConnection()">🔌 Tester et connecter</button>
            <div class="setup-result" id="setup-result"></div>
          </div>
        </div>
      </div>
    </div>`;
  if(sbConf){
    document.getElementById('sb-url-input').value = sbConf.url;
    document.getElementById('sb-key-input').value = sbConf.key;
  }
}

function copySQL(){
  navigator.clipboard.writeText(SQL_SETUP).then(()=>{
    const btn = document.querySelector('.copy-sql-btn');
    if(btn){ btn.textContent='✅ Copié !'; setTimeout(()=>btn.textContent='📋 Copier le SQL',2000); }
  });
}

async function doTestConnection(){
  const url = document.getElementById('sb-url-input').value.trim();
  const key = document.getElementById('sb-key-input').value.trim();
  const res = document.getElementById('setup-result');
  const btn = document.getElementById('sb-test-btn');
  if(!url || !key){ res.style.display='block'; res.className='setup-result ko'; res.textContent='❌ Remplissez les deux champs.'; return; }
  btn.disabled=true; btn.textContent='⏳ Test en cours…';
  res.style.display='none';
  try{
    await testConnection(url, key);
    saveSbConf(url, key);
    cloudOk = true;
    res.style.display='block'; res.className='setup-result ok';
    res.textContent='✅ Connexion réussie ! ChloroQuiz est maintenant en ligne.';
    btn.textContent='✅ Connecté !';
    updateCloudDot();
    // Migrate local plants if cloud is empty
    const rows = await sbGet('floralab_data','key=eq.plants&select=value');
    if(!rows.length){
      await savePlants();
    } else {
      plants = rows[0].value;
    }
    await loadScores();
    setTimeout(()=>{ closeModal(); renderAdmin(); },1400);
  } catch(e){
    res.style.display='block'; res.className='setup-result ko';
    res.innerHTML='❌ '+e.message+'<br><small style="opacity:.7">Vérifiez l\'URL et la clé, et que le SQL a bien été exécuté.</small>';
    btn.disabled=false; btn.textContent='🔌 Tester et connecter';
  }
}

function flashSaved(){
  const dot = document.getElementById('cloud-dot-label');
  if(!dot) return;
  const prev = dot.textContent;
  dot.textContent = '💾 Sauvegardé';
  setTimeout(()=>dot.textContent=prev, 1600);
}

// ══════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════
document.getElementById('pw-input').addEventListener('keydown',e=>{if(e.key==='Enter')checkPassword();});
async function checkPassword(){
  const v=document.getElementById('pw-input').value.trim();
  const btn=document.querySelector('.pw-btn');
  if(v===PW_ADMIN||v===PW_USER){
    btn.disabled=true;
    btn.innerHTML='<span class="spinner" style="width:16px;height:16px;border-width:2px;vertical-align:middle"></span> Connexion…';
    await login(v===PW_ADMIN?'admin':'user');
    btn.disabled=false;
    btn.innerHTML='Accéder à ChloroQuiz →';
    return;
  }
  document.getElementById('pw-err').textContent='❌ Mot de passe incorrect';
  document.getElementById('pw-input').value='';
}

// ══════════════════════════════════════════════════════
//  PERSISTANCE SESSION (rechargement mobile)
// ══════════════════════════════════════════════════════
function saveSession(){
  try{ localStorage.setItem(SK_SESSION, JSON.stringify({role, ts:Date.now()})); }catch(e){}
}
function clearSession(){
  try{ localStorage.removeItem(SK_SESSION); localStorage.removeItem(SK_QUIZ_STATE); }catch(e){}
}
function saveQuizState(){
  if(!qName || qPhase==='name' || qPhase==='end') return;
  try{
    const state={qName,qLevel,qNum,qScore,qHistory,qUsed,qRound,qPhase,
      qKQ,qKSel,qPhotoSel,qSSel,qPhotoType,qStreak,qPriorityMode,
      qPlantsIds:qPlants.map(p=>p.id)};
    localStorage.setItem(SK_QUIZ_STATE, JSON.stringify(state));
  }catch(e){}
}
function clearQuizState(){
  try{ localStorage.removeItem(SK_QUIZ_STATE); }catch(e){}
}
async function tryRestoreSession(){
  cqLog('tryRestoreSession — vérification...');
  try{
    const raw = localStorage.getItem(SK_SESSION);
    if(!raw) return false;
    const sess = JSON.parse(raw);
    if(!sess.role || (Date.now()-sess.ts)>8*3600*1000){ clearSession(); return false; }
    await login(sess.role, true);
    const qRaw = localStorage.getItem(SK_QUIZ_STATE);
    if(qRaw){
      const s = JSON.parse(qRaw);
      const idSet = new Set(s.qPlantsIds||[]);
      qPlants = plants.filter(p=>idSet.has(p.id));
      if(!qPlants.length) qPlants=[...plants];
      qName=s.qName; qLevel=s.qLevel; qNum=s.qNum;
      qScore=s.qScore; qHistory=s.qHistory||[]; qUsed=s.qUsed||[];
      qRound=s.qRound; qPhase=s.qPhase;
      qKQ=s.qKQ||null; qKSel=s.qKSel||null;
      qPhotoSel=s.qPhotoSel||null; qSSel=s.qSSel||null;
      qPhotoType=s.qPhotoType||'identify';
      qStreak=s.qStreak||0; qPriorityMode=s.qPriorityMode||false;
      ['home','quiz','fiches','scores','admin','stats'].forEach(id=>{
        const pg=document.getElementById('page-'+id); if(pg) pg.style.display='none';
        const nb=document.getElementById('nb-'+id); if(nb) nb.classList.remove('active');
      });
      const pgEl=document.getElementById('page-quiz'); if(pgEl) pgEl.style.display='';
      const nb=document.getElementById('nb-quiz'); if(nb) nb.classList.add('active');
      renderQuiz();
      const toast=document.createElement('div');
      toast.style.cssText='position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#1a4a2a;border:1px solid #4ab870;color:#c8dfc4;padding:10px 18px;border-radius:12px;font-size:13px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.4)';
      toast.textContent='🔄 Partie restaurée — Question '+s.qNum+'/20';
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(),3500);
    }
    return true;
  }catch(e){ clearSession(); return false; }
}

async function login(r, silent=false){
  role=r;
  loadSbConf();
  saveSession();
  document.getElementById('pw-screen').style.display='none';
  document.getElementById('app-screen').style.display='flex';
  if(r==='admin'){
    document.getElementById('nb-admin').style.display='';
    document.getElementById('nb-stats').style.display='';
    document.getElementById('home-admin-card').style.display='';
    document.getElementById('role-badge').textContent='👑 Formateur';
    document.getElementById('role-badge').classList.add('admin');
    document.getElementById('lb-reset-btn').style.display='';
    const bnAdm=document.getElementById('bn-admin-mob'); if(bnAdm) bnAdm.style.display='';
  }
  // Try cloud connection
  updateCloudDot();
  if(sbConf){
    try{
      await testConnection(sbConf.url, sbConf.key);
      cloudOk=true;
    } catch(e){ cloudOk=false; }
    updateCloudDot();
  }
  await loadPlants();
  await loadScores();
  await loadPasswords();
  if(!silent) showPage('home');
}

function logout(){
  stopTimer(); role=null; cloudOk=false;
  clearSession();
  document.getElementById('app-screen').style.display='none';
  document.getElementById('pw-screen').style.display='flex';
  document.getElementById('pw-input').value='';
  document.getElementById('pw-err').textContent='';
  ['nb-admin','nb-stats','home-admin-card'].forEach(id=>{
    const el=document.getElementById(id); if(el)el.style.display='none';
  });
  document.getElementById('lb-reset-btn').style.display='none';
  document.getElementById('role-badge').textContent='👤 Visiteur';
  document.getElementById('role-badge').classList.remove('admin');
  const bnAdm=document.getElementById('bn-admin-mob'); if(bnAdm) bnAdm.style.display='none';
}

// ══════════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════════
function showPage(p){
  stopTimer();
  ['home','quiz','fiches','scores','admin','stats'].forEach(id=>{
    const pg=document.getElementById('page-'+id); if(pg) pg.style.display='none';
    const nb=document.getElementById('nb-'+id); if(nb) nb.classList.remove('active');
  });
  const pgEl=document.getElementById('page-'+p); if(pgEl) pgEl.style.display='';
  const nb=document.getElementById('nb-'+p); if(nb) nb.classList.add('active');
  // Sync bottom nav
  ['home','quiz','fiches','scores'].forEach(id=>{
    const bn=document.getElementById('bn-'+id); if(bn) bn.classList.toggle('active', id===p);
  });
  const bnAdm=document.getElementById('bn-admin-mob');
  if(bnAdm) bnAdm.classList.toggle('active', p==='admin');
  if(p!=='quiz') clearQuizState();
  if(p==='home')   renderHome();
  if(p==='quiz')   initQuizPage();
  if(p==='fiches') renderFiches();
  if(p==='scores') renderScores();
  if(p==='admin')  renderAdmin();
  if(p==='stats'){
    // Statistiques réservées au formateur
    if(role!=='admin'){ showPage('home'); return; }
    renderStats();
  }
}

// ══════════════════════════════════════════════════════
//  HOME
// ══════════════════════════════════════════════════════
function renderHome(){
  document.getElementById('home-count-desc').textContent=`Consultez les ${plants.length} fiches détaillées avec toutes les informations botaniques.`;
  const n=scores.length;
  document.getElementById('home-score-desc').textContent=n>0?`${n} partie(s) enregistrée(s) — classement partagé en temps réel.`:`Aucune partie encore. Soyez le premier !`;
}

// ══════════════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════════════
function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
function rand(a){return a[Math.floor(Math.random()*a.length)];}
function nextId(){ return Math.max(0,...plants.map(p=>p.id))+1; }
function fmtDate(ts){
  return new Date(ts).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'});
}

// ══════════════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════════════
function startTimer(onExpire, duration){
  stopTimer(); qTimerLeft=duration||TIMER_SEC; qTimerRunning=true; updateTimerUI();
  qTimerInterval=setInterval(()=>{
    if(!qTimerRunning)return;
    qTimerLeft--; updateTimerUI();
    if(qTimerLeft<=0){stopTimer(); onExpire();}
  },1000);
}
function stopTimer(){ qTimerRunning=false; clearInterval(qTimerInterval); qTimerInterval=null; }
function updateTimerUI(){
  const fill=document.getElementById('timer-fill');
  const count=document.getElementById('timer-count');
  if(!fill||!count)return;
  fill.style.width=(qTimerLeft/TIMER_SEC*100)+'%';
  count.textContent=qTimerLeft+'s';
  const d=qTimerLeft<=10;
  fill.classList.toggle('danger',d); count.classList.toggle('danger',d);
}

// ══════════════════════════════════════════════════════
//  QUIZ
// ══════════════════════════════════════════════════════
function initQuizPage(){
  qPhase='name'; qName=''; qLevel=1; qUsed=[];
  qScore={ok:0,total:0,timeouts:0}; qNum=0;
  qSQ=null; qSSel=null; qPhotoType='identify';
  qPlants=[...plants];
  renderQuizContainer();
}

function renderQuizContainer(){
  const c=document.getElementById('quiz-container');
  if(plants.length<2){
    c.innerHTML=`<div class="empty"><span class="empty-icon">🌱</span><p>Il faut au moins 2 plantes pour jouer.</p></div>`;
    return;
  }
  if(qPhase==='name') renderNamePrompt(c);
  else renderQuiz(c);
  setTimeout(initCarousel, 50);
}

function renderNamePrompt(c){
  // Valeurs uniques pour filtres
  const allFeuillages=[...new Set(plants.map(p=>p.feuillage).filter(Boolean))];
  const allExpos=[...new Set(plants.map(p=>p.exposition).filter(Boolean))];
  const allTypes=[...new Set(plants.map(p=>p.type).filter(Boolean))];

  const makeChips=(arr,field)=>
    `<span class="fchip all-chip active" onclick="toggleFilterChip(this,'${field}','')">Tous</span>`+
    arr.map(v=>`<span class="fchip" onclick="toggleFilterChip(this,'${field}','${v.replace(/'/g,"\\'")}') ">${v}</span>`).join('');

  c.innerHTML=`
    <div class="name-prompt" style="max-width:560px;margin:0 auto;text-align:center;padding:16px 0">
      <span style="font-size:56px;display:block;margin-bottom:10px">🌿</span>
      <div style="font-family:var(--disp);font-size:28px;font-weight:900;color:var(--cr);margin-bottom:6px">Prêt pour le Quiz ?</div>
      <div style="font-size:13px;color:rgba(200,223,204,.85);margin-bottom:20px">Entrez votre prénom puis choisissez votre niveau</div>
      <div style="display:flex;gap:10px;margin-bottom:8px">
        <input style="flex:3;padding:14px 20px;background:rgba(19,48,29,.7);border:1px solid rgba(74,184,112,.3);border-radius:16px;color:var(--cr);font-family:'DM Sans',sans-serif;font-size:18px;text-align:center;outline:none;transition:border-color .3s" id="player-name-input" placeholder="Prénom…" autocomplete="off" maxlength="30"/>
        <input style="flex:1;padding:14px 10px;background:rgba(19,48,29,.7);border:1px solid rgba(74,184,112,.3);border-radius:16px;color:var(--cr);font-family:'DM Sans',sans-serif;font-size:18px;text-align:center;outline:none;transition:border-color .3s;text-transform:uppercase;min-width:0" id="player-initial-input" placeholder="AB" autocomplete="off" maxlength="2"/>
      </div>
      <div style="font-size:12px;color:rgba(200,223,204,.85);text-align:right;margin-bottom:18px">
        📝 2 premières lettres de ton nom de famille (ex : <strong style="color:rgba(200,223,204,.95)">Dupont → DU</strong>)
      </div>
      <div style="text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,223,204,.8);margin-bottom:10px">Choisissez votre niveau</div>
      <div class="level-cards">
        <button class="level-card lv1 selected" id="lc-1" onclick="selectLevel(1)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Niveau 1</span>
          <span class="level-icon">🌱</span>
          <div class="level-title">CAPA JP &amp; BAC PRO</div>
          <div class="level-desc">Identification + caractéristiques. <strong style="color:rgba(200,223,204,.6)">Sans famille botanique.</strong></div>
        </button>
        <button class="level-card lv2" id="lc-2" onclick="selectLevel(2)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Niveau 2</span>
          <span class="level-icon">🎓</span>
          <div class="level-title">Niveau avancé</div>
          <div class="level-desc">N1 <strong style="color:rgba(200,223,204,.6)">+ famille botanique.</strong></div>
        </button>
        <button class="level-card lv3" id="lc-3" onclick="selectLevel(3)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Niveau 3</span>
          <span class="level-icon">🏗️</span>
          <div class="level-title">Aménagement</div>
          <div class="level-desc">Choisir le bon végétal selon <strong style="color:rgba(200,223,204,.6)">critères de chantier.</strong></div>
        </button>
      </div>

      <div class="filter-section">
        <div class="filter-title">🔍 Révision ciblée — filtrer par :</div>
        ${allFeuillages.length?`<div style="font-size:11px;color:rgba(200,223,204,.85);font-weight:600;margin-bottom:4px">Feuillage</div><div class="filter-chips" id="fchips-feuillage">${makeChips(allFeuillages,'feuillage')}</div>`:''}
        ${allExpos.length?`<div style="font-size:11px;color:rgba(200,223,204,.85);font-weight:600;margin-top:8px;margin-bottom:4px">Exposition</div><div class="filter-chips" id="fchips-exposition">${makeChips(allExpos,'exposition')}</div>`:''}
        ${allTypes.length?`<div style="font-size:11px;color:rgba(200,223,204,.85);font-weight:600;margin-top:8px;margin-bottom:4px">Type</div><div class="filter-chips" id="fchips-type">${makeChips(allTypes,'type')}</div>`:''}
      </div>

      <div class="dictee-toggle-wrap">
        <input type="checkbox" id="dictee-toggle" style="width:16px;height:16px;accent-color:var(--g4);cursor:pointer"/>
        <label class="dictee-toggle-label" for="dictee-toggle">✏️ Mode dictée — 1 question sur 4 en dictée</label>
      </div>
      <button style="width:100%;padding:15px;background:linear-gradient(135deg,#1e5030,#2d7a4a);border:none;border-radius:16px;color:white;font-family:'DM Sans',sans-serif;font-size:17px;font-weight:700;cursor:pointer;transition:all .2s;margin-top:10px" onclick="startQuiz(false)">🚀 Démarrer — 30s par question</button>
      <div id="priority-btn-wrap" style="margin-top:10px;display:none">
        <button style="width:100%;padding:13px;background:rgba(255,100,0,.12);border:1px solid rgba(255,140,0,.3);border-radius:16px;color:#ff8c00;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s" onclick="startQuiz(true)">🎯 Réviser mes points faibles</button>
        <div id="priority-hint" style="font-size:11px;color:rgba(255,140,0,.5);text-align:center;margin-top:5px"></div>
      </div>
    </div>`;
  document.getElementById('player-name-input').addEventListener('keydown',e=>{if(e.key==='Enter') document.getElementById('player-initial-input').focus();});
  document.getElementById('player-name-input').addEventListener('input',e=>{
    const v=e.target.value;
    if(v) e.target.value=v.charAt(0).toUpperCase()+v.slice(1).toLowerCase();
  });
  document.getElementById('player-initial-input').addEventListener('keydown',e=>{if(e.key==='Enter')startQuiz(false);});
  document.getElementById('player-initial-input').addEventListener('input',e=>{
    e.target.value=e.target.value.toUpperCase().replace(/[^A-Z]/g,'');
    if(e.target.value.length===2) e.target.style.borderColor='rgba(74,184,112,.6)';
    else e.target.style.borderColor='rgba(74,184,112,.3)';
  });
  document.getElementById('player-name-input').addEventListener('input',e=>{
    const raw=e.target.value.trim();
    if(!raw) return;
    const initRaw=(document.getElementById('player-initial-input').value.trim().toUpperCase().replace(/[^A-Z]/g,'')||'');
    const n=(raw.charAt(0).toUpperCase()+raw.slice(1).toLowerCase())+(initRaw?' '+initRaw+'.':'');
    let allErrors={};
    try{ allErrors=JSON.parse(localStorage.getItem(SK_ERRORS)||'{}'); }catch(ex){}
    const myErrors=allErrors[n]||[];
    const wrap=document.getElementById('priority-btn-wrap');
    const hint=document.getElementById('priority-hint');
    if(myErrors.length>=2){
      wrap.style.display='';
      const top=myErrors.sort((a,b)=>b.count-a.count).slice(0,3).map(e=>e.latin.split(' ')[0]).join(', ');
      hint.textContent=`${myErrors.length} végétal(aux) à retravailler — dont : ${top}…`;
    } else { wrap.style.display='none'; }
  });
  setTimeout(()=>{ const el=document.getElementById('player-name-input'); if(el)el.focus(); },100);
}

function toggleFilterChip(el, field, val){
  // Désactiver tous les chips du même groupe, activer celui cliqué
  const group=el.parentElement.querySelectorAll('.fchip');
  group.forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  qFilter[field]=val;
}

function selectLevel(n){
  qLevel=n;
  [1,2,3].forEach(i=>{
    const b=document.getElementById('lc-'+i);
    if(b) b.classList.toggle('selected',i===n);
  });
}

function startQuiz(priorityMode=false){
  const input=document.getElementById('player-name-input');
  const inputInit=document.getElementById('player-initial-input');
  const name=(input?input.value.trim():'');
  const init=(inputInit?inputInit.value.trim().toUpperCase().replace(/[^A-Z]/g,''):'');
  if(!name){ if(input){input.style.borderColor='#ff7070';input.focus();} return; }
  if(init.length<2){ if(inputInit){inputInit.style.borderColor='#ff7070';inputInit.focus();} return; }
  const qNameNorm=(name.charAt(0).toUpperCase()+name.slice(1).toLowerCase())+' '+init+'.';
  qName=qNameNorm; qUsed=[]; qNum=0; qScore={ok:0,total:0,timeouts:0}; qHistory=[]; qStreak=0; qPriorityMode=priorityMode;

  // Appliquer filtres révision ciblée
  let pool=[...plants];
  if(qFilter.feuillage) pool=pool.filter(p=>p.feuillage===qFilter.feuillage);
  if(qFilter.exposition) pool=pool.filter(p=>p.exposition===qFilter.exposition);
  if(qFilter.type) pool=pool.filter(p=>p.type===qFilter.type);

  // Mode erreurs prioritaires
  if(priorityMode){
    let allErrors={};
    try{ allErrors=JSON.parse(localStorage.getItem(SK_ERRORS)||'{}'); }catch(e){}
    const myErrors=allErrors[qNameNorm]||[];
    if(myErrors.length>=2){
      const errorLatins=new Set(myErrors.sort((a,b)=>b.count-a.count).slice(0,10).map(e=>e.latin));
      const priority=pool.filter(p=>errorLatins.has(p.latin));
      if(priority.length>=2) pool=priority;
    }
  }

  if(pool.length<2) pool=[...plants];
  qPlants=pool;

  qDicteeMode = document.getElementById('dictee-toggle')?.checked || false;
  buildPhotoRound(); qPhase='photo';
  renderQuiz(document.getElementById('quiz-container'));
  saveQuizState();
  setTimeout(initCarousel,50);
}

function buildPhotoRound(){
  // Pool sans répétition ; si épuisé on recharge (pour avoir 20 questions même avec peu de plantes)
  let pool = qPlants.filter(p=>!qUsed.includes(p.id));
  if(!pool.length){ qUsed=[]; pool=[...qPlants]; }
  const correct = rand(pool);
  const wrongs = shuffle(qPlants.filter(p=>p.id!==correct.id)).slice(0,3);
  qRound = {correct, options:shuffle([correct,...wrongs])};
  // Mode dictée : 1 question sur 4 en dictée, reste en identification QCM
  if(qDicteeMode && Math.random() < 0.25) qPhotoType='dictee';
  else if(qDicteeMode) qPhotoType='identify';
  qPhotoSel=null; qSSel=null; qSQ=null; qNum++;

  // Étape 1 : 50% identification classique, 50% orthographe botanique
  qPhotoType = Math.random() < 0.5 ? 'spelling' : 'identify';
  if(qPhotoType==='spelling'){
    qSQ = buildSpellingQ();
    if(!qSQ || qSQ.options.length < 4) qPhotoType = 'identify';
  }
}

function buildKQ(){
  const p=qRound.correct;
  if(qLevel===3){
    // Niveau 3 : choisir la bonne plante selon critères de chantier
    // Chaque template utilise des champs spécifiques — on évite les distracteurs valides
    const N3_FIELDS=[
      ['exposition','ph'],
      ['feuillage','rusticite'],
      ['rusticite','exposition','ph'],
      ['exposition','resistanceSech','feuillage'],
      ['exposition','ph'],
      ['exposition','ph'],
      ['rusticite','resistanceSech'],
      ['exposition','feuillage'],
    ];
    const tplIdx=Math.floor(Math.random()*N3_TEMPLATES.length);
    const tpl=N3_TEMPLATES[tplIdx];
    const tplFields=N3_FIELDS[tplIdx]||[];
    const question=tpl(p);

    // Vérifier la compatibilité d'un champ entre deux plantes
    function expoOverlap(a,b){
      if(!a||!b)return false;
      const split=s=>s.split(/\s*[\u2013-]\s*|\s*,\s*/).map(x=>x.trim()).filter(Boolean);
      return split(a).some(v=>split(b).includes(v));
    }
    function fieldCompat(field,vA,vB){
      if(!vA||!vB)return false;
      if(field==='exposition')return expoOverlap(vA,vB);
      // Pour rusticite, feuillage, ph, resistanceSech, feuillage : correspondance exacte
      return vA===vB;
    }
    // Exclure les plantes qui seraient aussi une bonne réponse
    function isAlsoValid(x){
      return tplFields.length>0 && tplFields.every(f=>fieldCompat(f,p[f],x[f]));
    }

    const others=shuffle(qPlants.filter(x=>x.id!==p.id&&!isAlsoValid(x))).slice(0,3);
    // Fallback si pas assez de distracteurs non-ambigus
    if(others.length<3){
      const fallback=shuffle(qPlants.filter(x=>x.id!==p.id)).slice(0,3);
      const options=shuffle([p,...fallback]);
      return {field:{key:'_n3',label:'Mise en situation'},question,correct:p.latin,options:options.map(x=>x.latin),_isN3:true};
    }
    const options=shuffle([p,...others]);
    return {field:{key:'_n3',label:'Mise en situation'},question,correct:p.latin,options:options.map(x=>x.latin),_isN3:true};
  }
  const fields=qLevel===2?KFIELDS_N2:KFIELDS_N1;
  const MULTIVALUE_KEYS=['interetOrnemental','autresInterets','type','couleurFleurs'];
  const avail=fields.filter(f=>p[f.key]&&p[f.key].trim());
  if(!avail.length)return null;
  const field=rand(avail);
  // Pour les champs multi-valeurs, on prend une valeur au hasard parmi celles de la plante
  let correct=p[field.key];
  if(MULTIVALUE_KEYS.includes(field.key)){
    const vals=correct.split(',').map(s=>s.trim()).filter(Boolean);
    correct=rand(vals)||correct;
  }
  const others=[...new Set(qPlants.filter(x=>x.id!==p.id&&x[field.key]&&x[field.key]!==correct).map(x=>{
    if(MULTIVALUE_KEYS.includes(field.key)){
      const vals=(x[field.key]||'').split(',').map(s=>s.trim()).filter(v=>v&&v!==correct);
      return vals.length?rand(vals):null;
    }
    return x[field.key];
  }).filter(Boolean))];
  let wrongs=shuffle(others).slice(0,3);
  const fil=field.key==='famille'?shuffle(FILLERS_FAMILLE.filter(f=>f!==correct)):shuffle((FILLERS[field.key]||[]).filter(f=>f!==correct));
  for(const f of fil){ if(wrongs.length>=3)break; if(f!==correct&&!wrongs.includes(f))wrongs.push(f); }
  return{field,question:field.q(p.latin),correct,options:shuffle([correct,...wrongs.slice(0,3)])};
}

// ──────────────────────────────────────────────────────
//  QUESTION ORTHOGRAPHE du nom botanique
// ──────────────────────────────────────────────────────
function generateMisspellings(latin){
  const parts = latin.trim().split(/\s+/);
  const genus = parts[0];
  const species = parts.slice(1).join(' ');
  const variants = new Set();

  // 1. Majuscule sur le nom d'espèce (toujours incorrect en nomenclature)
  const speciesCap = species.charAt(0).toUpperCase() + species.slice(1);
  variants.add(genus + ' ' + speciesCap);

  // 2. Simplifier une consonne doublée dans le genre (ll→l, tt→t, pp→p…)
  const genusSimple = genus.replace(/([bcdfghjklmnpqrstvwxz])\1/i, '$1');
  if(genusSimple !== genus) variants.add(genusSimple + ' ' + species);

  // 3. Simplifier consonne doublée dans le genre + majuscule espèce
  if(genusSimple !== genus) variants.add(genusSimple + ' ' + speciesCap);

  // 4. Simplifier consonne doublée dans l'espèce
  const speciesSimple = species.replace(/([bcdfghjklmnpqrstvwxz])\1/i, '$1');
  if(speciesSimple !== species){
    variants.add(genus + ' ' + speciesSimple);
    if(genusSimple !== genus) variants.add(genusSimple + ' ' + speciesSimple);
  }

  // 5. Changer la terminaison latine de l'espèce
  const endingSwaps = [
    [/a$/,'um'],[/um$/,'a'],[/us$/,'a'],[/is$/,'us'],[/e$/,'is'],
    [/oides$/,'oide'],[/ensis$/,'ense'],[/ens$/,'ense'],[/oides$/,'oidis'],
    [/ans$/,'ens'],[/icus$/,'ica'],[/ica$/,'icum'],[/icum$/,'ica'],
  ];
  for(const [from,to] of endingSwaps){
    if(from.test(species)){
      const sw = species.replace(from, to);
      if(sw !== species){
        variants.add(genus + ' ' + sw);
        if(genusSimple !== genus) variants.add(genusSimple + ' ' + sw);
        variants.add(genus + ' ' + sw.charAt(0).toUpperCase()+sw.slice(1));
      }
      break;
    }
  }

  // 6. Doubler une consonne non-doublée dans le genre (ex: Camelia→Camellia) — pas la 1ère lettre
  const genusDouble = genus.replace(/(?<=.)([bcdfghjklmnpqrstvwxz])(?!\1)/i, (m,c)=>c+c);
  if(genusDouble !== genus && genusDouble.length === genus.length+1){
    variants.add(genusDouble + ' ' + species);
  }

  // 7. Tout en minuscules (genre toujours en majuscule = règle)
  variants.add(genus.toLowerCase() + ' ' + species);

  // Filtre : enlever la réponse correcte et doublons
  const result = [...variants].filter(v => v.trim() !== latin.trim() && v.trim() !== '');
  return shuffle(result).slice(0, 3);
}

function buildSpellingQ(){
  const p = qRound.correct;
  const wrongs = generateMisspellings(p.latin);
  if(!wrongs || wrongs.length < 1) return null;
  // Compléter avec des faux noms d'autres plantes si besoin
  while(wrongs.length < 3){
    const other = rand(qPlants.filter(x=>x.id!==p.id));
    const mis = generateMisspellings(other.latin);
    if(mis && mis.length) wrongs.push(mis[0]);
    else wrongs.push(other.latin.replace(/a$/,'um'));
  }
  return {
    question: `Quelle est l'écriture exacte du nom botanique de cette plante ?`,
    correct: p.latin,
    options: shuffle([p.latin, ...wrongs.slice(0,3)]),
  };
}

function timerHTML(current, total){
  const progressBar = (current!=null && total!=null)
    ? `<div class="q-counter-row">`
      +`<span class="q-counter-num">Q ${current} / ${total}</span>`
      +`<span style="font-size:11px;color:rgba(200,223,204,.45)">${Math.round(current/total*100)}%</span>`
      +`</div>`
      +`<div class="q-progress-bar"><div class="q-progress-fill" style="width:${Math.round(current/total*100)}%"></div></div>`
    : '';
  return progressBar+`<div class="timer-wrap"><div class="timer-row"><span class="timer-label">⏱ TEMPS RESTANT</span><span class="timer-count" id="timer-count">${qTimerLeft}s</span></div><div class="timer-bar-bg"><div class="timer-bar-fill" id="timer-fill" style="width:100%"></div></div></div>`;
}

function topbarHTML(){
  const lvCls2=qLevel===3?'lv3':qLevel===2?'lv2':'lv1';
  const streakHTML=qStreak>=3?`<span class="streak-badge">🔥 ×${qStreak}</span>`:'';
  return `<div class="quiz-topbar"><div><div style="font-family:var(--disp);font-size:26px;font-weight:900;color:var(--cr)">Quiz <em style="color:var(--am2)">Végétaux</em></div><div class="quiz-player"><strong>${qName}</strong><span class="level-pill ${lvCls2}">Niv.${qLevel}</span>${streakHTML}</div></div><div><div class="score-badge">✅ ${qScore.ok} / ${qScore.total}</div></div></div>`;
}


// ── Service Worker : statut hors-ligne ──
function updateOfflineStatus(data){
  // Utiliser updateCloudDot() qui gère les vrais IDs cloud-dot / cloud-dot-label
  if(!navigator.onLine){
    var dot = document.getElementById('cloud-dot');
    var lbl = document.getElementById('cloud-dot-label');
    if(dot) dot.className='cloud-dot offline';
    if(lbl) lbl.textContent='○ Hors ligne';
  } else {
    updateCloudDot();
  }
}
window.addEventListener('online',  function(){ updateOfflineStatus(null); syncOfflineQueue(); });
window.addEventListener('offline', function(){ updateOfflineStatus(null); });


// ── Carrousel photos quiz ──
var _carouselIdx = 0;
function goSlide(idx){
  _carouselIdx = idx;
  var track = document.querySelector('.qphoto-track');
  if(track) track.style.transform = 'translateX(-'+idx*100+'%)';
  document.querySelectorAll('.qphoto-dot').forEach(function(d,i){
    d.classList.toggle('active', i===idx);
  });
}
function initCarousel(){
  _carouselIdx = 0;
  var carousel = document.querySelector('.qphoto-carousel');
  if(!carousel) return;
  var startX = 0, moved = false, dragging = false;

  function handleSwipe(dx){
    var dots = document.querySelectorAll('.qphoto-dot');
    if(Math.abs(dx) < 40 || dots.length < 2) return;
    if(dx < 0 && _carouselIdx === 0) goSlide(1);
    else if(dx > 0 && _carouselIdx === 1) goSlide(0);
  }

  // ── Touch (mobile) ──
  carousel.addEventListener('touchstart', function(e){
    startX = e.touches[0].clientX; moved = false;
  }, {passive:true});
  carousel.addEventListener('touchmove', function(e){
    moved = true;
  }, {passive:true});
  carousel.addEventListener('touchend', function(e){
    if(!moved) return;
    handleSwipe(e.changedTouches[0].clientX - startX);
  }, {passive:true});

  // ── Souris (desktop) ──
  carousel.addEventListener('mousedown', function(e){
    startX = e.clientX; dragging = true; moved = false;
    carousel.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', function(e){
    if(!dragging) return;
    if(Math.abs(e.clientX - startX) > 5) moved = true;
  });
  document.addEventListener('mouseup', function(e){
    if(!dragging) return;
    dragging = false;
    carousel.style.cursor = 'grab';
    if(moved) handleSwipe(e.clientX - startX);
  });
  carousel.style.cursor = 'grab';
}

function photoBlockHTML(p){
  const has2 = p.photo && p.photo2;
  const slide1 = p.photo
    ? `<div class="qphoto-slide"><img src="${p.photo}" class="qphoto" onerror="this.style.display='none'" loading="lazy"/></div>`
    : `<div class="qphoto-slide"><div class="qphoto-fallback">${LEAF_SVG}</div></div>`;
  const slide2 = has2
    ? `<div class="qphoto-slide"><img src="${p.photo2}" class="qphoto" onerror="this.style.display='none'" loading="lazy"/></div>`
    : '';
  const dots = has2
    ? `<div class="qphoto-dots"><span class="qphoto-dot active" onclick="goSlide(0)"></span><span class="qphoto-dot" onclick="goSlide(1)"></span></div>`
    : '';
  const id = 'qpc-'+Date.now();
  return `<div class="qphotos"><div class="qphoto-carousel" id="${id}">`
    +`<div class="qphoto-track">${slide1}${slide2}</div>`
    +`</div>${dots}</div>`;
}

function renderQuiz(c){
  if(!c)c=document.getElementById('quiz-container');
  if(qPhase==='end'){renderEnd(c);return;}
  const p=qRound.correct;
  const photoBlock=photoBlockHTML(p);

  if(qPhase==='photo'){
    if(qPhotoType==='spelling'){
      // ── Étape 1 : Orthographe botanique ──
      const opts=qSQ.options.map(opt=>{
        let cls='qopt spell-opt';
        if(qSSel){if(opt===qSQ.correct)cls+=' correct';else if(opt===qSSel)cls+=' wrong';}
        const dis=qSSel?'disabled':'';
        return `<button class="${cls}" ${dis} onclick="pickPhotoSpelling(this)" style="font-style:italic;font-family:'Playfair Display',serif;font-size:15px">${opt}</button>`;
      }).join('');
      let feedback='',nextBtn='';
      if(qSSel){
        const ok=qSSel===qSQ.correct;
        feedback=`<div class="k-feedback ${ok?'ok':'ko'}">${ok
          ?`✅ Bonne graphie ! <em>${qSQ.correct}</em> est l'écriture exacte.`
          :`❌ La graphie exacte est : <em style="color:var(--g4);font-style:italic">${qSQ.correct}</em>`
        }</div>`;
        nextBtn=`<button class="next-btn" onclick="afterPhotoSpelling()">Étape 2 — Caractéristiques →</button>`;
      }
      c.innerHTML=topbarHTML()+`<div class="qcard">${photoBlock}<div class="qbody">${!qSSel?timerHTML(qNum, 20):''}<div class="phase-label">✍️ Étape 1 — Orthographe botanique</div><div class="q-text">Quelle est l'écriture exacte du nom botanique ?</div><div class="q-opts">${opts}</div>${feedback}${nextBtn}</div></div>`;
      if(!qSSel) startTimer(()=>onPhotoSpellingTimeout());
    } else if(qPhotoType==='dictee'){
      // ── Étape 1 : Dictée botanique ──
      let dictFb='', dictNext='';
      if(qPhotoSel){
        const ok = qPhotoSel.trim().toLowerCase() === p.latin.toLowerCase();
        dictFb=`<div class="k-feedback ${ok?'ok':'ko'}">${ok
          ?`✅ Exact ! <em>${p.latin}</em>`
          :`❌ La réponse était : <em style="color:var(--g4)">${p.latin}</em>`
        }</div>`;
        dictNext=`<button class="next-btn" onclick="afterPhotoDictee(${ok})">Étape 2 →</button>`;
      }
      c.innerHTML=topbarHTML()+`<div class="qcard">${photoBlock}<div class="qbody">`
        +`${!qPhotoSel?timerHTML(qNum,20):''}`
        +`<div class="phase-label">✏️ Étape 1 — Dictée botanique</div>`
        +`<div class="q-text">Quel est le nom latin de ce végétal ?</div>`
        +`${!qPhotoSel
          ? `<div class="dictee-wrap">`
            +`<input id="dictee-input" class="dictee-input" type="text" placeholder="Genre espèce…"
             autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
             style="font-style:italic;font-family:'Playfair Display',serif"
             onkeydown="if(event.key==='Enter')submitDictee()"/>`
            +`<button class="dictee-btn" onclick="submitDictee()">→</button>`
            +`</div>`
          : ''}`
        +`${dictFb}${dictNext}`
        +`</div></div>`;
      if(!qPhotoSel){
        startTimer(()=>onDicteeTimeout(), 60);
        setTimeout(()=>{ var el=document.getElementById('dictee-input'); if(el)el.focus(); },100);
      }
    } else {
      // ── Étape 1 : Identification classique ──
      const opts=qRound.options.map(opt=>{
        let cls='qopt';
        if(qPhotoSel){if(opt.id===p.id)cls+=' correct';else if(opt.latin===qPhotoSel)cls+=' wrong';}
        const dis=qPhotoSel?'disabled':'';
        return `<button class="${cls}" ${dis} onclick="pickPhoto(this,'${opt.latin.replace(/'/g,"\\'")}','${opt.id}')">
          <span class="opt-latin">${opt.latin}</span></button>`;
      }).join('');
      c.innerHTML=topbarHTML()+`<div class="qcard">${photoBlock}<div class="qbody">${timerHTML(qNum, 20)}<div class="phase-label">📸 Étape 1 — Identification</div><div class="q-text">Quel est ce végétal ?</div><div class="q-opts">${opts}</div></div></div>`;
      startTimer(()=>onPhotoTimeout());
    }
  }

  if(qPhase==='knowledge'||qPhase==='k-done'){
    if(!qKQ){nextRound();return;}
    const opts=qKQ.options.map(opt=>{
      let cls='qopt';
      if(qKSel){if(opt===qKQ.correct)cls+=' correct';else if(opt===qKSel)cls+=' wrong';}
      const dis=qKSel?'disabled':'';
      return `<button class="${cls}" ${dis} onclick="pickK(this)">${opt}</button>`;
    }).join('');
    let feedback='',nextBtn='';
    if(qPhase==='k-done'){
      const ok=qKSel!==null&&qKSel===qKQ.correct;
      feedback=`<div class="k-feedback ${ok?'ok':'ko'}">${ok?`✅ Bonne réponse ! <strong>${p.latin}</strong> — ${qKQ.field.label} : ${qKQ.correct}`:`❌ La bonne réponse était : <strong>${qKQ.correct}</strong><br><span style="font-size:12px;opacity:.7">📖 Entraîne-toi sur les fiches pour progresser !</span>`}</div>`;
      nextBtn=`<button class="next-btn" onclick="nextRound()">${qNum>=20?'Voir mes résultats →':'Végétal suivant →'}</button>`;
    }
    c.innerHTML=topbarHTML()+`<div class="qcard">
      <div class="k-question-block">
        <div class="phase-label" style="margin-bottom:12px">🧠 Étape 2 — ${qKQ.field.label}</div>
        <div class="k-question-text">${qKQ.question}</div>
      </div>
      <div class="qbody" style="padding:24px">
        ${qPhase==='knowledge'?timerHTML(qNum, 20):''}
        <div class="q-opts k-opts">${opts}</div>
        ${feedback}${nextBtn}
      </div>
    </div>`;
    if(qPhase==='knowledge') startTimer(()=>onKTimeout());
  }
}

function onPhotoTimeout(){
  stopTimer(); qPhotoSel='__timeout__'; qScore.total++; qScore.timeouts++;
  qHistory.push({latin:qRound.correct.latin, nom:qRound.correct.nom,
    step1Type:'identification', step1Ok:false, step1Correct:qRound.correct.latin,
    step2Label:'—', step2Ok:null, step2Correct:'—'});
  renderQuiz(); stopTimer(); setTimeout(initCarousel,50);
  document.querySelectorAll('.qopt').forEach(btn=>{
    btn.disabled=true;
    const latin=btn.querySelector('.opt-latin');
    if(latin&&latin.textContent.trim()===qRound.correct.latin) btn.classList.add('timeout-reveal');
  });
  const qOpts=document.querySelector('.q-opts');
  if(qOpts){const n=document.createElement('div');n.className='timeout-notice';n.innerHTML='⏰ Temps écoulé ! La bonne réponse est affichée.';qOpts.parentNode.insertBefore(n,qOpts);}
  setTimeout(()=>showCelebration(false,true),600);
}
function onKTimeout(){
  stopTimer(); qKSel='__timeout__'; qScore.total++; qScore.timeouts++;
  if(qHistory.length){ const h=qHistory[qHistory.length-1]; h.step2Label=qKQ?qKQ.field.label:'—'; h.step2Ok=false; h.step2Correct=qKQ?qKQ.correct:'—'; }
  qPhase='k-done'; renderQuiz(); setTimeout(initCarousel,50); stopTimer(); setTimeout(initCarousel,50);
}

function pickPhoto(btn,latin,id){
  if(qPhotoSel)return; stopTimer();
  qPhotoSel=latin;
  const isOk=parseInt(id)===qRound.correct.id;
  if(isOk){ qScore.ok++; qStreak++; } else { qStreak=0; hapticWrong(); } qScore.total++;
  qHistory.push({latin:qRound.correct.latin, nom:qRound.correct.nom,
    step1Type:'identification', step1Ok:isOk, step1Correct:qRound.correct.latin,
    step2Label:'—', step2Ok:null, step2Correct:'—'});
  renderQuiz(); stopTimer(); setTimeout(initCarousel,50);
  setTimeout(()=>showCelebration(isOk,false),500);
}

function showCelebration(isOk,isTimeout){
  const p=qRound.correct;
  const root=document.getElementById('overlay-root');
  if(isOk){
    const fmtMsgOk = qDicteeFormatMsg ? `<div style="background:rgba(255,180,60,.1);border:1px solid rgba(255,180,60,.3);border-radius:10px;padding:10px 14px;font-size:12px;color:rgba(255,200,80,.9);margin:10px 0;line-height:1.6">${qDicteeFormatMsg}</div>` : '';
    root.innerHTML=confettiHTML()+`<div class="overlay"><div class="cel-card good"><div class="cel-glow"></div><span class="cel-emoji">🎉</span><div class="cel-title">Félicitations ${qName} !<br>Bonne réponse !</div>${fmtMsgOk}<div class="cel-latin">${p.latin}</div><div class="cel-common">${p.nom}</div><button class="cel-btn" onclick="closeCelebration()">Continuer →</button></div></div>`;
    qDicteeFormatMsg = null;
  } else if(isTimeout){
    root.innerHTML=`<div class="overlay"><div class="cel-card timeout"><span class="cel-emoji">⏰</span><div class="cel-title">Temps écoulé !</div><p style="color:rgba(200,223,204,.45);font-size:13px;margin-bottom:16px">Pas de réponse en 30 secondes</p><div class="wrong-box"><div class="wrong-box-label">La bonne réponse était</div><div class="wrong-box-latin">${p.latin}</div><div class="wrong-box-common">${p.nom}</div></div><button class="cel-btn" onclick="closeCelebration()">Continuer →</button></div></div>`;
  } else {
    const fmtMsg = qDicteeFormatMsg ? `<div style="background:rgba(255,180,60,.08);border:1px solid rgba(255,180,60,.25);border-radius:10px;padding:10px 14px;font-size:12px;color:rgba(200,223,204,.7);margin-bottom:12px;line-height:1.6">${qDicteeFormatMsg}</div>` : '';
    root.innerHTML=`<div class="overlay"><div class="cel-card bad"><span class="cel-emoji">😕</span><div class="cel-title">Pas cette fois…</div><p style="color:rgba(200,223,204,.45);font-size:13px;margin-bottom:12px">Tu avais répondu : <strong style="color:#ff9999">${qPhotoSel}</strong></p>${fmtMsg}<div class="wrong-box"><div class="wrong-box-label">La bonne réponse était</div><div class="wrong-box-latin">${p.latin}</div><div class="wrong-box-common">${p.nom}</div></div><button class="cel-btn" onclick="closeCelebration()">Continuer →</button></div></div>`;
    qDicteeFormatMsg = null;
  }
}

function closeCelebration(){
  document.getElementById('overlay-root').innerHTML='';
  // Étape 2 : toujours une question de caractéristique
  qKQ=buildKQ(); qKSel=null; qPhase='knowledge';
  renderQuiz(document.getElementById('quiz-container'));
  setTimeout(initCarousel,50);
}

// ── Orthographe en étape 1 ──
function pickPhotoSpelling(btn){
  if(qSSel)return; stopTimer();
  qSSel=btn.textContent.trim();
  const isOk=qSSel===qSQ.correct;
  if(isOk){ qScore.ok++; qStreak++; } else { qStreak=0; hapticWrong(); } qScore.total++;
  qHistory.push({latin:qRound.correct.latin, nom:qRound.correct.nom,
    step1Type:'orthographe', step1Ok:isOk, step1Correct:qSQ.correct,
    step2Label:'—', step2Ok:null, step2Correct:'—'});
  renderQuiz(document.getElementById('quiz-container'));
  setTimeout(initCarousel,50);
}

function onPhotoSpellingTimeout(){
  stopTimer(); qSSel='__timeout__'; qScore.total++; qScore.timeouts++;
  qHistory.push({latin:qRound.correct.latin, nom:qRound.correct.nom,
    step1Type:'orthographe', step1Ok:false, step1Correct:qSQ?qSQ.correct:'—',
    step2Label:'—', step2Ok:null, step2Correct:'—'});
  renderQuiz(document.getElementById('quiz-container'));
  const qOpts=document.querySelector('.q-opts');
  if(qOpts){const n=document.createElement('div');n.className='timeout-notice';n.innerHTML=`⏰ Temps écoulé ! La bonne graphie : <em>${qSQ.correct}</em>`;qOpts.parentNode.insertBefore(n,qOpts);}
}

// ── Mode dictée botanique ──
function submitDictee(){
  var inp = document.getElementById('dictee-input');
  if(!inp || qPhotoSel) return;
  var val = inp.value.trim();
  if(!val) return;
  stopTimer();
  const chk = checkLatinDictee(val, qRound.correct.latin);
  const pts = dicteePoints(chk.correct, chk.badFormat, qLevel);
  const ok = chk.correct; // pour la célébration / historique
  if(pts > 0){ qScore.ok += pts; qStreak++; } else { qStreak=0; hapticWrong(); }
  qScore.total++;
  qPhotoSel = val;
  // Message écriture si mauvaise casse mais bonne réponse
  if(chk.correct && chk.badFormat){
    qDicteeFormatMsg = chk.formatMsg + (pts===0.5?' <span style="color:var(--am2)">(+0,5 pt)</span>':' <span style="color:#ff9999">(0 pt — niv.2/3)</span>');
  } else {
    qDicteeFormatMsg = chk.badFormat && !chk.correct ? chk.formatMsg : null;
  }
  qHistory.push({latin:qRound.correct.latin, nom:qRound.correct.nom,
    step1Type:'dictée', step1Ok:ok, step1Correct:qRound.correct.latin,
    step2Label:'—', step2Ok:null, step2Correct:'—'});
  renderQuiz(document.getElementById('quiz-container'));
  setTimeout(()=>showCelebration(ok,false), 500);
}

function afterPhotoDictee(step1Ok){
  if(step1Ok){
    showCelebration(true, false);
  } else {
    qKQ=buildKQ(); qKSel=null; qPhase='knowledge';
    renderQuiz(document.getElementById('quiz-container'));
  }
}

function onDicteeTimeout(){
  stopTimer();
  qPhotoSel='__timeout__'; qScore.total++; qScore.timeouts++;
  qHistory.push({latin:qRound.correct.latin, nom:qRound.correct.nom,
    step1Type:'dictée', step1Ok:false, step1Correct:qRound.correct.latin,
    step2Label:'—', step2Ok:null, step2Correct:'—'});
  renderQuiz(document.getElementById('quiz-container'));
  const notice = document.createElement('div');
  notice.className='timeout-notice';
  notice.innerHTML='⏰ Temps écoulé ! La réponse était : <em>'+qRound.correct.latin+'</em>';
  const body = document.querySelector('.qbody');
  if(body) body.insertBefore(notice, body.firstChild);
  setTimeout(()=>showCelebration(false,true),600);
}


function afterPhotoSpelling(){
  // Après orthographe étape 1 : on montre la célébration si correct, sinon direct étape 2
  const isOk = qSSel === qSQ.correct;
  if(isOk){
    showCelebration(true, false);
  } else {
    qKQ=buildKQ(); qKSel=null; qPhase='knowledge';
    renderQuiz(document.getElementById('quiz-container'));
  }
}

function pickK(btn){
  if(qKSel)return; stopTimer();
  qKSel=btn.textContent.trim();
  const isOk=qKSel===qKQ.correct;
  if(isOk){ qScore.ok++; qStreak++; } else { qStreak=0; hapticWrong(); } qScore.total++;
  // Mettre à jour la dernière entrée historique
  if(qHistory.length){ const h=qHistory[qHistory.length-1]; h.step2Label=qKQ.field.label; h.step2Ok=isOk; h.step2Correct=qKQ.correct; }
  qPhase='k-done'; renderQuiz(document.getElementById('quiz-container'));
  setTimeout(initCarousel,50);
}

function onSTimeout(){
  stopTimer(); qSSel='__timeout__'; qScore.total++; qScore.timeouts++;
  qPhase='s-done'; renderQuiz(document.getElementById('quiz-container'));
  setTimeout(initCarousel,50);
}

function nextRound(){
  stopTimer(); qUsed.push(qRound.correct.id);
  if(qNum>=20){qPhase='end';clearQuizState();renderEnd(document.getElementById('quiz-container'));return;}
  buildPhotoRound(); qKQ=null; qKSel=null; qPhase='photo';
  renderQuiz(document.getElementById('quiz-container'));
  saveQuizState();
  setTimeout(initCarousel,50);
}

async function renderEnd(c){
  stopTimer();
  const pct=qScore.total?Math.round(qScore.ok/qScore.total*100):0;
  const msg=pct>=80?'Excellent botaniste ! 🌟':pct>=50?'Bon travail, continue ! 💪':'Continue à réviser ! 📚';
  const s={name:qName,level:qLevel,ok:qScore.ok,total:qScore.total,pct,timeouts:qScore.timeouts,date:Date.now()};
  c.innerHTML=`<div class="quiz-end"><span class="end-trophy">🏆</span><div class="end-player-name">Enregistrement du score…</div></div>`;
  await addScore(s);

  // Sauvegarder les erreurs dans localStorage par prénom
  const errKey=SK_ERRORS;
  let allErrors={};
  try{ allErrors=JSON.parse(localStorage.getItem(errKey)||'{}'); }catch(e){}
  if(!allErrors[qName]) allErrors[qName]=[];
  const sessionErrors=qHistory.filter(h=>h.step1Ok===false||h.step2Ok===false);
  sessionErrors.forEach(e=>{
    const existing=allErrors[qName].find(x=>x.latin===e.latin);
    if(existing){ existing.count++; existing.last=Date.now(); }
    else allErrors[qName].push({latin:e.latin,nom:e.nom,count:1,last:Date.now()});
  });
  try{ localStorage.setItem(errKey,JSON.stringify(allErrors)); }catch(e){}

  const rankAll=[...scores].sort((a,b)=>b.pct-a.pct||b.ok-a.ok);
  const myRank=rankAll.findIndex(x=>x.name===s.name&&x.date===s.date&&x.pct===s.pct)+1;
  const lvCls=qLevel===3?'lv3':qLevel===2?'lv2':'lv1';

  // Tableau récapitulatif
  const recapRows=qHistory.map((h,i)=>{
    const s1=h.step1Ok?`<span class="recap-ok">✅</span>`:(h.step1Ok===false?`<span class="recap-ko">❌</span>`:`<span class="recap-timeout">⏰</span>`);
    const s2=h.step2Ok===true?`<span class="recap-ok">✅</span>`:h.step2Ok===false?`<span class="recap-ko">❌ <em style="font-size:11px;opacity:.7">${h.step2Correct}</em></span>`:`<span style="color:rgba(200,223,204,.3)">—</span>`;
    return `<tr>
      <td style="color:rgba(200,223,204,.75);text-align:center">${i+1}</td>
      <td><em style="font-size:12px">${h.latin}</em><br><span style="font-size:10px;color:rgba(200,223,204,.4)">${h.nom}</span></td>
      <td style="text-align:center">${s1}</td>
      <td style="text-align:center;font-size:11px;color:rgba(200,223,204,.5)">${h.step1Type}</td>
      <td style="text-align:center">${s2}</td>
      <td style="font-size:11px;color:rgba(200,223,204,.5)">${h.step2Label}</td>
    </tr>`;
  }).join('');

  // Végétaux à retravailler (erreurs de la session)
  const errPlants=qHistory.filter(h=>h.step1Ok===false||h.step2Ok===false);
  const errSection=errPlants.length?`
    <div class="recap-section">
      <div class="recap-title">📖 À retravailler sur les fiches</div>
      ${errPlants.map(h=>`<div style="padding:6px 0;border-bottom:1px solid rgba(74,184,112,.07);font-size:13px">
        <em>${h.latin}</em> — <span style="color:rgba(200,223,204,.5)">${h.nom}</span>
        ${h.step1Ok===false?`<span style="color:#ff9999;font-size:11px;margin-left:6px">Identification ❌</span>`:''}
        ${h.step2Ok===false?`<span style="color:#ff9999;font-size:11px;margin-left:6px">${h.step2Label} ❌</span>`:''}
      </div>`).join('')}
    </div>`:'';

  c.innerHTML=`
    <div class="quiz-end">
      <span class="end-trophy">🏆</span>
      <div class="end-player-name">${qName} · <span class="level-pill ${lvCls}">Niv.${qLevel}</span></div>
      <div class="end-score">${qScore.ok} / ${qScore.total}</div>
      <div class="end-pct">${pct}%</div>
      <div class="end-msg">${msg}</div>
      <div class="end-stats">
        <div class="end-stat"><div class="end-stat-num" style="color:var(--g4)">${qScore.ok}</div><div class="end-stat-label">Bonnes réponses</div></div>
        <div class="end-stat"><div class="end-stat-num" style="color:#ff9999">${qScore.total-qScore.ok}</div><div class="end-stat-label">Mauvaises</div></div>
        <div class="end-stat"><div class="end-stat-num" style="color:#ffb347">${qScore.timeouts}</div><div class="end-stat-label">Hors temps</div></div>
      </div>
      <div style="font-size:14px;color:rgba(200,223,204,.4);margin-bottom:22px">🎯 Classement : <strong style="color:var(--am2)">#${myRank||'?'}</strong> sur ${scores.length} partie(s)</div>

      ${recapRows?`<div class="recap-section">
        <div class="recap-title">📋 Récapitulatif de la partie</div>
        <div style="overflow-x:auto">
        <table class="recap-table">
          <thead><tr>
            <th>#</th><th>Végétal</th><th>Étape 1</th><th>Type</th><th>Étape 2</th><th>Critère</th>
          </tr></thead>
          <tbody>${recapRows}</tbody>
        </table></div>
      </div>`:''}

      ${errSection}

      <div class="end-btns" style="margin-top:28px">
        <button style="flex:1;min-width:130px;padding:14px;background:linear-gradient(135deg,#1e5030,#2d7a4a);border:none;border-radius:13px;color:white;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer" onclick="initQuizPage()">🔄 Rejouer</button>
        <button class="add-btn" style="flex:1;min-width:130px" onclick="showPage('scores')">🏆 Classement</button>
        <button onclick="printRecap()" style="flex:1;min-width:130px;padding:14px;background:rgba(232,160,32,.1);border:1px solid rgba(232,160,32,.3);border-radius:13px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer">🖨️ Imprimer</button>
      </div>
    </div>`;
}

function confettiHTML(){
  const cols=['#4ab870','#e8a020','#f5c540','#2d7a4a','#ffd700','#ffb347','#a8e6cf'];
  let h='<div class="conf-wrap">';
  for(let i=0;i<60;i++){
    const leaf=Math.random()>.5,sz=7+Math.random()*10;
    h+=`<div class="conf-p" style="left:${Math.random()*100}%;width:${sz}px;height:${leaf?sz*1.6:sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${leaf?'0 50% 0 50%':'50%'};transform:rotate(${Math.random()*360}deg);animation-duration:${2+Math.random()*2}s;animation-delay:${Math.random()*2}s"></div>`;
  }
  return h+'</div>';
}

// ══════════════════════════════════════════════════════
//  LEADERBOARD
// ══════════════════════════════════════════════════════
function setLbFilter(f){
  lbFilter=f;
  ['all','best','lv1','lv2','lv3'].forEach(k=>{
    const b=document.getElementById('lb-btn-'+k); if(b) b.classList.toggle('active',k===f);
  });
  renderScores();
}

async function renderScores(){
  const table=document.getElementById('lb-table');
  if(cloudOk){ try{ scores=await sbGet('floralab_scores','select=*&order=pct.desc,ok.desc'); }catch(e){} }
  let data=[...scores];
  if(lbFilter==='lv1') data=data.filter(s=>(s.level||1)===1);
  else if(lbFilter==='lv2') data=data.filter(s=>s.level===2);
  else if(lbFilter==='lv3') data=data.filter(s=>s.level===3);
  else if(lbFilter==='best'){
    const map={};
    data.forEach(s=>{ const k=s.name+'_'+(s.level||1);
      if(!map[k]||s.pct>map[k].pct||(s.pct===map[k].pct&&s.ok>map[k].ok)) map[k]=s; });
    data=Object.values(map);
  }
  data.sort((a,b)=>b.ok-a.ok||b.pct-a.pct);
  document.getElementById('lb-sub').textContent=`${data.length} résultat(s) · ${cloudOk?'☁️ Classement partagé en ligne':'💻 Mode local'}`;
  if(!data.length){
    table.innerHTML=`<div class="lb-empty"><span class="lb-empty-icon">🌱</span><p>Aucun score enregistré.<br>Lancez le quiz pour commencer le challenge !</p></div>`;
    return;
  }
  const medals=['gold','silver','bronze'],emojis=['🥇','🥈','🥉'];
  table.innerHTML=data.map((s,i)=>{
    const rc=medals[i]||'other', rd=i<3?emojis[i]:`#${i+1}`;
    const lv=s.level||1;
    return `<div class="lb-row ${rc}">
      <div class="lb-rank ${rc}">${rd}</div>
      <div class="lb-info">
        <div class="lb-name">${s.name} <span class="level-pill lv${lv}" style="font-size:10px">Niv.${lv}</span></div>
        <div class="lb-detail">${s.ok} bonnes / ${s.total} · ${s.timeouts||0} hors-temps · ${fmtDate(s.date)}</div>
        <div class="lb-bar-wrap"><div class="lb-bar" style="width:${s.pct}%"></div></div>
      </div>
      <div class="lb-score-wrap"><div class="lb-pct">${s.pct}%</div><div class="lb-pts">${s.ok} / ${s.total||20} pts</div></div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════
//  STATS (formateur)
// ══════════════════════════════════════════════════════
function renderStats(){
  const c=document.getElementById('stats-container');
  if(!c) return;

  let allErrors={};
  try{ allErrors=JSON.parse(localStorage.getItem(SK_ERRORS)||'{}'); }catch(e){}

  // Données globales — végétaux les plus ratés tous apprentis confondus
  const collective={};
  Object.values(allErrors).forEach(errs=>errs.forEach(e=>{
    if(!collective[e.latin]) collective[e.latin]={latin:e.latin,nom:e.nom,total:0};
    collective[e.latin].total+=e.count;
  }));
  const collectiveList=Object.values(collective).sort((a,b)=>b.total-a.total).slice(0,10);

  // Scores par apprenti — enrichis
  const byName={};
  scores.forEach(s=>{
    const n=s.name||'?';
    const lv=s.level||1;
    if(!byName[n]) byName[n]={name:n,games:0,totalOk:0,totalQ:0,pctBest:0,pctWorst:100,levels:{},history:[],lastDate:0};
    byName[n].games++;
    byName[n].totalOk+=s.ok||0;
    byName[n].totalQ+=s.total||20;
    if(s.pct>byName[n].pctBest) byName[n].pctBest=s.pct;
    if(s.pct<byName[n].pctWorst) byName[n].pctWorst=s.pct;
    byName[n].levels[lv]=(byName[n].levels[lv]||0)+1;
    if(s.date>byName[n].lastDate) byName[n].lastDate=s.date;
    byName[n].history.push({pct:s.pct,date:s.date,lv});
  });
  Object.values(byName).forEach(a=>a.history.sort((x,y)=>x.date-y.date));

  // Moyenne de la classe
  const allPcts=scores.map(s=>s.pct||0);
  const classMoyenne=allPcts.length?Math.round(allPcts.reduce((a,b)=>a+b,0)/allPcts.length):0;

  const apprentis=Object.values(byName).sort((a,b)=>b.totalOk-a.totalOk||b.pctBest-a.pctBest);
  const names=Object.keys(allErrors);

  const collectiveHTML=collectiveList.length?`
    <div class="stats-collective">
      <div class="stats-collective-title">📋 Végétaux les plus difficiles — tous apprentis</div>
      ${collectiveList.map((e,i)=>`
        <div class="collective-row">
          <span class="collective-rank">${i+1}</span>
          <span><em>${e.latin}</em> <span style="color:rgba(200,223,204,.4);font-size:11px">${e.nom||''}</span></span>
          <span style="color:#ff9999;font-weight:600;font-size:13px">${e.total} erreur(s)</span>
        </div>`).join('')}
    </div>`:'';

  const cardsHTML=apprentis.map(a=>{
    const pctGlobal=a.totalQ?Math.round(a.totalOk/a.totalQ*100):0;
    const myErrors=(allErrors[a.name]||[]).sort((x,y)=>y.count-x.count).slice(0,5);
    const errCount=a.totalQ-a.totalOk;
    const lvLabels={'1':'N1','2':'N2','3':'N3'};
    const lvHTML=Object.entries(a.levels).map(([lv,n])=>`<span style="padding:2px 7px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(74,184,112,.15);color:var(--g4);border:1px solid rgba(74,184,112,.3)">${lvLabels[lv]||'N'+lv} ×${n}</span>`).join(' ');
    const hist=a.history;
    var sparkHTML='';
    if(hist.length>=2){
      const W=80,H=24,pad=2;
      const vals=hist.map(h=>h.pct);
      const mn=Math.min(...vals),mx=Math.max(...vals)||1;
      const pts=vals.map((v,i)=>{
        const x=pad+(i/(vals.length-1))*(W-pad*2);
        const y=H-pad-((v-mn)/(mx-mn||1))*(H-pad*2);
        return x.toFixed(1)+','+y.toFixed(1);
      }).join(' ');
      const trend=vals[vals.length-1]-vals[0];
      const trendCol=trend>0?'#4ab870':trend<0?'#ff9999':'#f5c540';
      const trendArrow=trend>0?'↑':trend<0?'↓':'→';
      sparkHTML=`<span style="display:inline-flex;align-items:center;gap:4px;vertical-align:middle"><svg width="${W}" height="${H}" style="vertical-align:middle"><polyline points="${pts}" fill="none" stroke="${trendCol}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><strong style="color:${trendCol};font-size:12px">${trendArrow}${Math.abs(trend)}%</strong></span>`;
    }
    const lastD=a.lastDate?new Date(a.lastDate).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}):'—';
    const barCol=pctGlobal>=70?'var(--g4)':pctGlobal>=50?'var(--am2)':'#ff9999';
    return `
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="stat-card-name">${a.name}</div>
          <div style="font-size:10px;color:rgba(200,223,204,.5);text-align:right">Dernière partie<br><strong style="color:rgba(200,223,204,.8)">${lastD}</strong></div>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0 8px">${lvHTML}</div>
        <div style="font-size:11px;color:rgba(200,223,204,.7);margin-bottom:4px">
          🎮 <strong>${a.games}</strong> partie(s) &nbsp;·&nbsp;
          🏆 Meilleur : <strong style="color:var(--am2)">${a.pctBest}%</strong> &nbsp;·&nbsp;
          📉 Pire : <strong style="color:#ff9999">${a.pctWorst}%</strong>
        </div>
        <div style="font-size:11px;color:rgba(200,223,204,.7);margin-bottom:6px">
          ✅ <strong style="color:var(--g4)">${a.totalOk}</strong> pts &nbsp;·&nbsp;
          ❌ <strong style="color:#ff9999">${errCount}</strong> erreurs &nbsp;·&nbsp;
          <strong style="color:${barCol}">${pctGlobal}%</strong> global
        </div>
        <div class="stat-bar-wrap"><div class="stat-bar" style="width:${pctGlobal}%;background:${barCol}"></div></div>
        ${hist.length>=2?`<div style="margin-top:8px;font-size:11px;color:rgba(200,223,204,.6)">Progression : ${sparkHTML}</div>`:''}
        ${myErrors.length?`<div class="stat-weak"><div class="stat-weak-title">Points faibles</div>${myErrors.map(e=>`<div class="stat-weak-item"><em style="font-size:12px">${e.latin}</em><span class="stat-weak-count">${e.count}×</span></div>`).join('')}</div>`:''}
      </div>`;
  }).join('');

  const emptyHTML=`<div class="empty"><span class="empty-icon">📊</span><p>Aucune donnée statistique.<br>Les stats apparaissent après les premières parties.</p></div>`;

  c.innerHTML=`
    <div class="pg-title">📊 Statistiques <em>Apprentis</em></div>
    <div class="pg-sub">Suivi de progression — ${apprentis.length} apprenti(s) · Moyenne classe : <strong style="color:var(--am2)">${classMoyenne}%</strong></div>
    ${collectiveHTML}
    ${apprentis.length?`<div class="stats-grid">${cardsHTML}</div>`:emptyHTML}
    ${names.length?`<button onclick="if(confirm('Effacer tout l\\'historique des erreurs ?')){ localStorage.removeItem('${SK_ERRORS}'); renderStats(); }"
      style="padding:10px 20px;background:rgba(255,100,100,.08);border:1px solid rgba(255,100,100,.2);border-radius:10px;color:#ff9999;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;margin-top:8px">
      🗑 Effacer l'historique des erreurs
    </button>`:''}`;
}

// ── PDF / Impression du récapitulatif ──
function printRecap(){
  const recap=document.querySelector('.recap-section');
  const errSection=document.querySelectorAll('.recap-section')[1];
  if(!recap){ alert('Aucun récapitulatif à imprimer.'); return; }
  const win=window.open('','_blank','width=800,height=600');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>ChloroQuiz — Récapitulatif ${qName} Niv.${qLevel}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:30px;color:#222;font-size:13px}
      h2{font-size:20px;margin-bottom:4px}
      p{color:#666;font-size:12px;margin-bottom:20px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#e8f5e9;padding:8px;text-align:left;border:1px solid #ccc;font-size:11px;text-transform:uppercase}
      td{padding:7px 8px;border:1px solid #ddd;vertical-align:top}
      .ok{color:#2d7a4a;font-weight:bold} .ko{color:#c0392b;font-weight:bold} .to{color:#e67e22;font-weight:bold}
      em{font-style:italic}
      .weak{margin-top:24px} .weak h3{font-size:14px;margin-bottom:8px;color:#c0392b}
      .weak li{margin-bottom:4px}
    </style></head><body>
    <h2>📋 ChloroQuiz — Récapitulatif de partie</h2>
    <p>${qName} · Niveau ${qLevel} · ${new Date().toLocaleDateString('fr-FR')} · ${qScore.ok}/${qScore.total} (${Math.round(qScore.ok/qScore.total*100)}%)</p>
    ${recap.innerHTML}
    ${errSection?errSection.innerHTML:''}
  
  `);
  win.document.close();
  win.print();
}

// Tag résistance sécheresse : couleur + texte explicite
function sechBar(val){
  var cfg = {
    'Faible':      {bg:'rgba(224,82,82,.15)',  border:'rgba(224,82,82,.4)',  color:'#f09090', dot:'●○○○'},
    'Modérée':     {bg:'rgba(224,140,48,.15)', border:'rgba(224,140,48,.4)', color:'#e8b060', dot:'●●○○'},
    'Élevée':      {bg:'rgba(140,190,60,.15)', border:'rgba(140,190,60,.4)', color:'#a8d060', dot:'●●●○'},
    'Très élevée': {bg:'rgba(74,184,112,.15)', border:'rgba(74,184,112,.4)', color:'#4ab870', dot:'●●●●'},
  };
  var c = cfg[val] || {bg:'rgba(200,223,204,.08)',border:'rgba(200,223,204,.2)',color:'rgba(200,223,204,.5)',dot:'○○○○'};
  return '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.3px;'
    +'background:'+c.bg+';border:1px solid '+c.border+';color:'+c.color+';">'
    +'<span style="font-size:8px;letter-spacing:1px">'+c.dot+'</span>'
    +'Séch. '+val
    +'</span>';
}

function renderFiches(){
  const q=(document.getElementById('fi-search').value||'').toLowerCase();
  const list=plants.filter(p=>[p.latin,p.nom,p.famille,p.type].some(v=>(v||'').toLowerCase().includes(q))).sort((a,b)=>(a.latin||'').localeCompare(b.latin||'','fr',{sensitivity:'base'}));
  const grid=document.getElementById('fiches-grid');
  if(!list.length){
    const hasQuery = q.length > 0;
    grid.innerHTML=`<div class="empty" style="grid-column:1/-1">
      <span class="empty-icon">🔎</span>
      <p style="margin-bottom:${hasQuery?'14px':'0'}">Aucune plante trouvée${hasQuery?' pour <em style="color:var(--am2)">"'+q+'"</em>':''}</p>
      ${hasQuery?`<button onclick="document.getElementById('fi-search').value='';renderFiches()" style="padding:9px 22px;background:rgba(74,184,112,.12);border:1px solid rgba(74,184,112,.3);border-radius:10px;color:var(--g4);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:background .2s" onmouseover="this.style.background='rgba(74,184,112,.22)'" onmouseout="this.style.background='rgba(74,184,112,.12)'">↩ Effacer la recherche</button>`:''}
    </div>`;
    return;
  }
  grid.innerHTML=list.map(p=>`
    <div class="fiche" onclick="openModal(${p.id})">
      ${p.photo?`<img src="${p.photo}" class="fiche-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy"/><div class="fiche-img-fb" style="display:none">${LEAF_SVG}</div>`:`<div class="fiche-img-fb">${LEAF_SVG}</div>`}
      <div class="fiche-body">
        <div class="fiche-latin">${p.latin}</div>
        ${p.famille?`<div class="fiche-famille">${p.famille}</div>`:''}
        <div class="fiche-common">${p.nom||''}</div>
        <div class="fiche-tags">
          ${p.feuillage?`<span class="ftag" style="background:rgba(100,160,255,.12);color:#a0c4ff;border-color:rgba(100,160,255,.2)">${p.feuillage==='Caduc'?'🍂':p.feuillage==='Persistant'?'🌿':'🍁'} ${p.feuillage}</span>`:''}
          ${p.type?`<span class="ftag">${p.type}</span>`:''}
          ${p.exposition?`<span class="ftag am">☀️ ${p.exposition}</span>`:''}
          ${p.resistanceSech?sechBar(p.resistanceSech):''}
        </div>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════
//  Export PDF — Fiche végétal
// ══════════════════════════════════════════════
function exportFichePDF(id){
  const p = plants.find(x=>x.id===id);
  if(!p) return;

  // Tous les champs à afficher
  const KALL_PDF = [
    {key:'feuillage',        label:'Feuillage'},
    {key:'rusticite',        label:'Rusticité'},
    {key:'exposition',       label:'Exposition'},
    {key:'ph',               label:'pH du sol'},
    {key:'resistanceSech',   label:'Résistance sécheresse'},
    {key:'hauteurAdulte',    label:'Hauteur adulte'},
    {key:'largeurAdulte',    label:'Largeur adulte'},
    {key:'periodeFloraison', label:'Période de floraison'},
    {key:'couleurFleurs',    label:'Couleur des fleurs'},
    {key:'famille',          label:'Famille botanique'},
    {key:'type',             label:'Type végétal'},
    {key:'interetOrnemental',label:'Intérêt ornemental'},
    {key:'autresInterets',   label:'Autres intérêts'},
    {key:'usageAmenagement', label:'Usage aménagement'},
  ];

  const fields = KALL_PDF.filter(f=>p[f.key]);
  const fieldsHTML = fields.map(f=>
    `<div class="field">
      <div class="field-lbl">${f.label}</div>
      <div class="field-val">${p[f.key]}</div>
    </div>`
  ).join('');

  const photo1 = p.photo  ? `<img src="${p.photo}"  class="photo" onerror="this.style.display='none'"/>` : '';
  const photo2 = p.photo2 ? `<img src="${p.photo2}" class="photo" onerror="this.style.display='none'"/>` : '';
  const hasTwoPhotos = p.photo && p.photo2;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Fiche — ${p.latin}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    color: #1a2e20;
    padding: 28px 32px;
    max-width: 900px;
    margin: 0 auto;
  }
  /* En-tête */
  .header { border-bottom: 3px solid #2d7a4a; padding-bottom: 14px; margin-bottom: 18px; }
  .famille { font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: #4ab870; font-weight: 600; margin-bottom: 4px; }
  .latin { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; font-style: italic; color: #1a2e20; line-height: 1.1; }
  .nom { font-size: 15px; color: #4a6e52; margin-top: 4px; font-weight: 600; }
  .logo { font-size: 11px; color: #999; margin-top: 6px; }
  /* Photos */
  .photos { display: flex; gap: 12px; margin-bottom: 18px; }
  .photo { width: ${hasTwoPhotos ? '50%' : '100%'}; max-height: 240px; object-fit: cover; border-radius: 10px; border: 1px solid #d0e8d8; }
  /* Grille champs */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
  .field { background: #f4faf6; border: 1px solid #cde8d4; border-radius: 8px; padding: 8px 12px; }
  .field-lbl { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #6ea87a; margin-bottom: 3px; font-weight: 600; }
  .field-val { font-size: 13px; color: #1a2e20; font-weight: 600; line-height: 1.35; }
  /* Description */
  .desc-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #4ab870; font-weight: 600; margin-bottom: 6px; margin-top: 4px; }
  .desc-text { font-size: 13px; color: #2a4a30; line-height: 1.7; }
  /* Footer */
  .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #d0e8d8; font-size: 10px; color: #999; display: flex; justify-content: space-between; }
  @media print {
    body { padding: 16px 20px; }
    @page { margin: 12mm 14mm; }
  }
</style>
</head>
<body>
  <div class="header">
    ${p.famille ? `<div class="famille">${p.famille}</div>` : ''}
    <div class="latin">${p.latin}</div>
    ${p.nom ? `<div class="nom">${p.nom}</div>` : ''}
    <div class="logo">ChloroQuiz — Fiche végétal</div>
  </div>
  ${(p.photo||p.photo2) ? `<div class="photos">${photo1}${photo2}</div>` : ''}
  <div class="grid">${fieldsHTML}</div>
  ${p.description ? `<div class="desc-title">Description</div><div class="desc-text">${p.description}</div>` : ''}
  <div class="footer">
    <span>ChloroQuiz — © Tous droits réservés</span>
    <span>${new Date().toLocaleDateString('fr-FR')}</span>
  </div>
  <script>window.onload=function(){ window.print(); }<\/script>
</body>
</html>`;

  // Ouvrir dans nouvelle fenêtre via Blob URL
  try {
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if(!win) alert('Autorisez les popups pour exporter la fiche en PDF.');
    setTimeout(()=>URL.revokeObjectURL(url), 30000);
  } catch(e) {
    // Fallback direct
    const win = window.open('', '_blank');
    if(win){ win.document.write(html); win.document.close(); }
  }
}


function openModal(id){
  const p=plants.find(x=>x.id===id); if(!p)return;
  // Tous les champs remplis — KFIELDS_N2 + type + usageAmenagement
  const KALL_MODAL=[
    ...KFIELDS_N2,
    {key:'type',             label:'Type végétal'},
    {key:'usageAmenagement', label:'Usage aménagement'},
  ];
  const fields=KALL_MODAL.filter(f=>p[f.key]).map(f=>`<div class="minfo"><div class="minfo-lbl">${f.label}</div><div class="minfo-val">${p[f.key]}</div></div>`).join('');
  const photoHTML = p.photo
    ? `<img src="${p.photo}" class="modal-img-full" onerror="this.style.display='none'" loading="lazy"/>`
    + (p.photo2?`<img src="${p.photo2}" class="modal-img-full" style="margin-top:8px" onerror="this.style.display='none'" loading="lazy"/>`:'')
    : `<div class="modal-img-fb">${LEAF_SVG}</div>`;

  const isMobile = window.innerWidth <= 640;

  if(isMobile){
    // ── Mobile : 2 pages swipeables ──
    const page1=`
      <div class="mswipe-page">
        <div style="padding:14px 52px 10px 16px;position:relative">
          <button class="modal-close" onclick="closeModal()">✕</button>
          ${p.famille?`<div class="modal-famille">${p.famille}</div>`:''}
          <div class="modal-latin">${p.latin}</div>
          <div class="modal-common">${p.nom||''}${p.feuillage?` <span style="display:inline-block;padding:2px 10px;border-radius:100px;font-size:11px;background:rgba(100,160,255,.12);color:#a0c4ff;border:1px solid rgba(100,160,255,.2);margin-left:6px;font-family:'DM Sans',sans-serif">${p.feuillage==='Caduc'?'🍂':p.feuillage==='Persistant'?'🌿':'🍁'} ${p.feuillage}</span>`:''}</div>
        </div>
        <div>${photoHTML}</div>
        <div style="text-align:center;padding:10px 0 6px;font-size:11px;color:rgba(200,223,204,.45)">Swiper pour les infos →</div>
      </div>`;
    const page2=`
      <div class="mswipe-page" style="overflow-y:auto">
        <div style="padding:14px 52px 16px 16px">
          <button class="modal-close" onclick="closeModal()">✕</button>
          ${p.famille?`<div class="modal-famille">${p.famille}</div>`:''}
          <div class="modal-latin" style="font-size:18px;margin-bottom:12px">${p.latin}</div>
          ${fields?`<div class="modal-grid">${fields}</div>`:'<div style="color:rgba(200,223,204,.4);font-size:13px">Aucune information disponible.</div>'}
          ${p.description?`<div class="modal-sec-title" style="margin-top:12px">Description</div><div class="modal-sec-text">${p.description}</div>`:''}
          <div style="margin-top:14px;text-align:center"><button onclick="exportFichePDF(${p.id})" style="padding:9px 20px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:10px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📄 Exporter PDF</button></div>
          <div style="text-align:center;padding:10px 0 4px;font-size:11px;color:rgba(200,223,204,.45)">← Swiper pour les photos</div>
        </div>
      </div>`;
    document.getElementById('overlay-root').innerHTML=`
      <div class="modal-bg" onclick="if(event.target===this)closeModal()">
        <div class="modal mswipe-modal">
          <div class="mswipe-track" id="mswipe-track">${page1}${page2}</div>
          <div class="mswipe-dots">
            <span class="mswipe-dot active" onclick="goModalSlide(0)"></span>
            <span class="mswipe-dot" onclick="goModalSlide(1)"></span>
          </div>
        </div>
      </div>`;
    initModalSwipe();
  } else {
    // ── Desktop : 1 seule page (layout original) ──
    document.getElementById('overlay-root').innerHTML=`
      <div class="modal-bg" onclick="if(event.target===this)closeModal()">
        <div class="modal">
          <div style="padding:28px 54px 0 28px;position:relative">
          <button class="modal-close" onclick="closeModal()">✕</button>
          ${p.famille?`<div class="modal-famille">${p.famille}</div>`:''}
          <div class="modal-latin">${p.latin}</div>
          <div class="modal-common">${p.nom||''}${p.feuillage?` <span style="display:inline-block;padding:2px 10px;border-radius:100px;font-size:11px;background:rgba(100,160,255,.12);color:#a0c4ff;border:1px solid rgba(100,160,255,.2);margin-left:6px;font-family:'DM Sans',sans-serif">${p.feuillage==='Caduc'?'🍂':p.feuillage==='Persistant'?'🌿':'🍁'} ${p.feuillage}</span>`:''}</div>
          </div>
          ${p.photo&&p.photo2
            ? `<div class="photo-grid" style="margin:12px 0 16px">
                 <img src="${p.photo}"  class="modal-img" style="margin:0;height:310px" onerror="this.style.display='none'" loading="lazy"/>
                 <img src="${p.photo2}" class="modal-img" style="margin:0;height:310px" onerror="this.style.display='none'" loading="lazy"/>
               </div>`
            : p.photo
              ? `<img src="${p.photo}" class="modal-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy"/><div class="modal-img-fb" style="display:none">${LEAF_SVG}</div>`
              : `<div class="modal-img-fb">${LEAF_SVG}</div>`
          }
          <div style="padding:0 28px 28px 28px">
          ${fields?`<div class="modal-grid">${fields}</div>`:''}
          ${p.description?`<div class="modal-sec-title">Description</div><div class="modal-sec-text">${p.description}</div>`:''}
          <div style="margin-top:18px;text-align:right"><button onclick="exportFichePDF(${p.id})" style="padding:9px 20px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:10px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📄 Exporter PDF</button></div>
          </div>
        </div>
      </div>`;
  }
}

var _modalIdx=0;
function goModalSlide(idx){
  _modalIdx=idx;
  var track=document.getElementById('mswipe-track');
  if(track) track.style.transform='translateX(-'+idx*100+'%)';
  document.querySelectorAll('.mswipe-dot').forEach(function(d,i){ d.classList.toggle('active',i===idx); });
}
function initModalSwipe(){
  _modalIdx=0;
  var track=document.getElementById('mswipe-track');
  if(!track) return;
  var startX=0, moved=false, dragging=false;
  function handleSwipe(dx){
    if(Math.abs(dx)<40) return;
    if(dx<0 && _modalIdx===0) goModalSlide(1);
    else if(dx>0 && _modalIdx===1) goModalSlide(0);
  }
  // Touch
  track.addEventListener('touchstart',function(e){ startX=e.touches[0].clientX; moved=false; },{passive:true});
  track.addEventListener('touchmove',function(e){ moved=true; },{passive:true});
  track.addEventListener('touchend',function(e){ if(moved) handleSwipe(e.changedTouches[0].clientX-startX); },{passive:true});
  // Souris
  track.addEventListener('mousedown',function(e){ startX=e.clientX; dragging=true; moved=false; e.preventDefault(); });
  document.addEventListener('mousemove',function(e){ if(dragging&&Math.abs(e.clientX-startX)>5) moved=true; });
  document.addEventListener('mouseup',function(e){ if(!dragging)return; dragging=false; if(moved) handleSwipe(e.clientX-startX); });
}
function closeModal(){ document.getElementById('overlay-root').innerHTML=''; }

// ══════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════
function switchAdminTab(tab){
  ['plantes','cloud','mdp','multi'].forEach(t=>{
    document.getElementById('admin-tab-'+t).style.display = t===tab?'':'none';
    document.getElementById('atab-'+t).classList.toggle('active', t===tab);
  });
  if(tab==='cloud') renderCloudBannerTab();
  if(tab==='mdp')   renderMdpTab();
  if(tab==='multi') renderMultiTab();
}
// ══ Normalisation nom de famille botanique ══════════
function normalizeFamille(val){
  if(!val) return '';
  val = val.trim();
  // Première lettre en majuscule, reste en minuscule
  val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  // Corriger les terminaisons françaises → latines
  // Correspondances directes français → latin (cas non couverts par règles)
  const direct = {
    'graminées':'Poaceae','graminees':'Poaceae','poacées':'Poaceae',
    'composées':'Asteraceae','composees':'Asteraceae','astéracées':'Asteraceae',
    'légumineuses':'Fabaceae','legumineuses':'Fabaceae','fabacées':'Fabaceae',
    'ombellifères':'Apiaceae','ombelliferes':'Apiaceae','apiacées':'Apiaceae',
    'crucifères':'Brassicaceae','cruciferes':'Brassicaceae',
    'liliacées':'Liliaceae','liliacees':'Liliaceae',
    'solanacées':'Solanaceae','solanacees':'Solanaceae',
  };
  if(direct[val.toLowerCase()]) return direct[val.toLowerCase()];
  const replacements = [
    [/acées$/i,    'aceae'],
    [/acees$/i,    'aceae'],
    [/acee$/i,     'aceae'],
    [/ées$/i,      'eae'],
    [/ees$/i,      'eae'],
    [/ée$/i,       'eae'],
    [/ee$/i,       'eae'],
  ];
  for(const [from, to] of replacements){
    if(from.test(val)){ val = val.replace(from, to); break; }
  }
  return val;
}
function onFamilleBlur(el){
  el.value = normalizeFamille(el.value);
}

function toggleFieldFilter(key){
  if(!multiFieldFilter) multiFieldFilter = [];
  if(multiFieldFilter.includes(key)){
    multiFieldFilter = multiFieldFilter.filter(k=>k!==key);
  } else {
    multiFieldFilter.push(key);
  }
  // Update chip UI
  document.querySelectorAll('.fchip').forEach(chip=>{
    chip.classList.toggle('active', multiFieldFilter.includes(chip.dataset.key));
  });
  const hint = document.getElementById('field-filter-hint');
  if(hint) hint.textContent = multiFieldFilter.length===0
    ? 'Tous les types de questions (aucun filtre)'
    : `${multiFieldFilter.length} type(s) sélectionné(s)`;
}
function selectAllFields(){ multiFieldFilter=[]; document.querySelectorAll('.fchip').forEach(c=>c.classList.remove('active')); const h=document.getElementById('field-filter-hint'); if(h) h.textContent='Tous les types de questions (aucun filtre)'; }


function renderCloudBannerTab(){
  const bz = document.getElementById('cloud-banner-zone-tab');
  if(!bz) return;
  if(!cloudOk && !sbConf){
    bz.innerHTML=`<div class="cloud-banner">
      <span class="cloud-banner-icon">☁️</span>
      <div class="cloud-banner-text">
        <div class="cloud-banner-title">Mode local — données sur cet appareil uniquement</div>
        <div class="cloud-banner-sub">Connectez Supabase (gratuit) pour partager plantes et classement sur tous les appareils.</div>
      </div>
      <button class="cloud-setup-btn" onclick="openCloudSetup()">⚡ Connecter le cloud</button>
    </div>`;
  } else if(!cloudOk && sbConf){
    bz.innerHTML=`<div class="cloud-banner">
      <span class="cloud-banner-icon">⚠️</span>
      <div class="cloud-banner-text">
        <div class="cloud-banner-title">Cloud configuré mais non joignable</div>
        <div class="cloud-banner-sub">Vérifiez votre connexion internet ou reconfigurez Supabase.</div>
      </div>
      <button class="cloud-setup-btn" onclick="openCloudSetup()">🔧 Reconfigurer</button>
    </div>`;
  } else {
    bz.innerHTML=`<div class="cloud-ok-banner">
      <span style="font-size:22px">✅</span>
      <div class="cloud-ok-text">Cloud <strong>connecté</strong> — plantes et classement partagés en temps réel.</div>
      <button class="cloud-disconnect-btn" onclick="disconnectCloud()">Déconnecter</button>
    </div>`;
  }
}

function renderMdpTab(){
  // Pre-fill inputs with current passwords
  const u = document.getElementById('pw-new-user');
  const a = document.getElementById('pw-new-admin');
  if(u) u.value = PW_USER;
  if(a) a.value = PW_ADMIN;
  const msg = document.getElementById('pw-change-msg');
  if(msg) msg.textContent='';
  // Update cloud note
  const sub = document.querySelector('#admin-tab-mdp > div > div:first-child');
  if(sub) sub.textContent = `Modifiez les mots de passe d'accès à ChloroQuiz. Les changements sont appliqués immédiatement et sauvegardés ${cloudOk?'dans le cloud (tous les appareils).':'localement sur cet appareil.'}`;
}

async function changePasswords(){
  const newUser  = (document.getElementById('pw-new-user').value||'').trim();
  const newAdmin = (document.getElementById('pw-new-admin').value||'').trim();
  const msg = document.getElementById('pw-change-msg');
  if(newUser.length < 6 || newAdmin.length < 6){
    msg.style.color='#ff9999'; msg.textContent='❌ Chaque mot de passe doit faire au moins 6 caractères.'; return;
  }
  if(newUser === newAdmin){
    msg.style.color='#ffb347'; msg.textContent='⚠️ Les deux mots de passe sont identiques — c\'est déconseillé.';
  }
  msg.style.color='rgba(200,223,204,.5)'; msg.textContent='⏳ Enregistrement…';
  await savePasswords(newUser, newAdmin);
  msg.style.color='#4ab870';
  msg.textContent=`✅ Mots de passe mis à jour ${cloudOk?'et sauvegardés dans le cloud !':'localement.'}`;
}

async function resetPasswordsToDefault(){
  if(!confirm('Remettre les mots de passe par défaut ?\n\nVisieur : flora2024\nFormateur : admin2024')) return;
  document.getElementById('pw-new-user').value  = PW_DEFAULTS.user;
  document.getElementById('pw-new-admin').value = PW_DEFAULTS.admin;
  await savePasswords(PW_DEFAULTS.user, PW_DEFAULTS.admin);
  const msg = document.getElementById('pw-change-msg');
  msg.style.color='#4ab870'; msg.textContent='✅ Mots de passe réinitialisés aux valeurs par défaut.';
}

function renderAdmin(){
  const nb = plants.length;
  const cloudTxt = cloudOk ? '☁️ sauvegarde cloud' : '💻 sauvegarde locale';
  document.getElementById('admin-count').textContent = `${nb} plante(s) · ${cloudTxt}`;
  // Stat cards
  const statNb = document.getElementById('stat-nb-plantes');
  if(statNb) statNb.textContent = nb;
  const statCv = document.getElementById('stat-cloud-val');
  if(statCv) statCv.textContent = cloudOk ? 'Cloud' : 'Local';
  const statCi = document.getElementById('stat-cloud-icon');
  if(statCi) statCi.textContent = cloudOk ? '☁️' : '💻';
  // Scores count (async, best-effort)
  (async()=>{
    const statSc = document.getElementById('stat-nb-scores');
    if(!statSc) return;
    try{
      if(cloudOk && window.SUPA_URL && window.SUPA_KEY){
        const r = await fetch(window.SUPA_URL+'/rest/v1/scores?select=id',{headers:{'apikey':window.SUPA_KEY,'Authorization':'Bearer '+window.SUPA_KEY,'Prefer':'count=exact','Range':'0-0'}});
        const total = r.headers.get('content-range');
        statSc.textContent = total ? total.split('/')[1] : '—';
      } else {
        const loc = JSON.parse(localStorage.getItem('cq_scores')||'[]');
        statSc.textContent = loc.length || '—';
      }
    }catch(e){ statSc.textContent='—'; }
  })();
  // Badge sidebar
  const badge = document.getElementById('sidebar-badge-plantes');
  if(badge) badge.textContent = nb;
  // Liste
  const list = document.getElementById('admin-list');
  if(!plants.length){ list.innerHTML=`<div class="empty"><span class="empty-icon">🌱</span><p>Aucune plante. Commencez par en ajouter une !</p></div>`; return; }
  const plantsSorted = [...plants].sort((a,b)=>(a.latin||'').localeCompare(b.latin||'','fr',{sensitivity:'base'}));
  list.innerHTML = plantsSorted.map(p=>`
    <div class="admin-row" data-search="${(p.latin+' '+(p.nom||'')+' '+(p.famille||'')).toLowerCase()}">
      ${p.photo?`<img src="${p.photo}" class="admin-row-thumb" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy"/><div class="admin-row-thumb-fb" style="display:none">${LEAF_SVG_SM}</div>`:`<div class="admin-row-thumb-fb">${LEAF_SVG_SM}</div>`}
      <div class="admin-row-info">
        <div class="admin-row-latin">${p.latin}</div>
        <div class="admin-row-common">${p.nom||''}${p.famille?' — '+p.famille:''}</div>
      </div>
      <div class="admin-btns">
        <button class="edit-btn" onclick="openForm(${p.id})">✏️ Modifier</button>
        <button class="del-btn" onclick="deletePlant(${p.id})">🗑️</button>
      </div>
    </div>`).join('');
  // Remettre le filtre si actif
  const si = document.getElementById('admin-search-input');
  if(si && si.value) filterAdminList(si.value);
}

function filterAdminList(q){
  const rows = document.querySelectorAll('#admin-list .admin-row');
  const s = q.trim().toLowerCase();
  rows.forEach(r=>{
    r.style.display = (!s || (r.dataset.search||'').includes(s)) ? '' : 'none';
  });
}

function deletePlant(id){
  const p=plants.find(x=>x.id===id); if(!p)return;
  const root=document.getElementById('overlay-root');
  root.innerHTML=`
    <div class="form-bg" onclick="if(event.target===this)document.getElementById('overlay-root').innerHTML=''">
      <div class="form-card" style="max-width:420px;padding:32px 28px">
        <div style="text-align:center;margin-bottom:22px">
          <span style="font-size:52px;display:block;margin-bottom:12px">🗑️</span>
          <div class="form-title" style="font-size:19px;margin-bottom:8px">Supprimer cette plante ?</div>
          <div style="font-size:14px;font-style:italic;color:var(--g4);margin-bottom:4px">${p.latin}</div>
          ${p.nom?`<div style="font-size:13px;color:rgba(200,223,204,.45)">${p.nom}</div>`:''}
          <div style="margin-top:14px;font-size:13px;color:rgba(255,120,120,.7);background:rgba(255,80,80,.06);border:1px solid rgba(255,80,80,.15);border-radius:10px;padding:10px 14px">
            ⚠️ Cette action est <strong>irréversible</strong>.
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="cancel-btn" style="flex:1" onclick="document.getElementById('overlay-root').innerHTML=''">Annuler</button>
          <button onclick="confirmDeletePlant(${id})" style="flex:1;padding:11px 16px;background:linear-gradient(135deg,#8b1a1a,#c0392b);border:none;border-radius:11px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer">🗑️ Supprimer</button>
        </div>
      </div>
    </div>`;
}
async function confirmDeletePlant(id){
  document.getElementById('overlay-root').innerHTML='';
  plants=plants.filter(x=>x.id!=id);
  await savePlants(); renderAdmin();
}

// ══════════════════════════════════════════════════════
//  FORM
// ══════════════════════════════════════════════════════
function openForm(id){
  cqLog('openForm appelé, id=', id, '| overlay-root:', !!document.getElementById('overlay-root'));
  editingId=id; formPhotoB64=null; formPhoto2B64=null;
  const p=id?plants.find(x=>x.id==id):{}; // == pour tolérer number/string
  const v=k=>p[k]||'';
  document.getElementById('overlay-root').innerHTML=`
    <div class="form-bg" onclick="if(event.target===this)closeForm()">
      <div class="form-card">
        <div class="form-title">${id?'✏️ Modifier':'🌱 Ajouter une plante'}</div>
        <div class="form-grid">
          <div class="fg full"><label class="fl">Nom latin (botanique) *</label><input class="fi" id="f-latin" placeholder="Lavandula angustifolia" value="${v('latin')}" onblur="this.value=normalizeLatin(this.value)"/></div>
          <div class="fg"><label class="fl">Nom commun</label><input class="fi" id="f-nom" placeholder="Lavande officinale" value="${v('nom')}"/></div>
          <div class="fg"><label class="fl">Famille botanique</label><input class="fi" id="f-famille" placeholder="Lamiaceae" value="${v('famille')}" onblur="onFamilleBlur(this)"/></div>
          <div class="fg full"><label class="fl">Type de végétal</label>
            <input type="hidden" id="f-type" value="${v('type')}"/>
            <div class="type-chips" id="type-chips-grid">
              ${TYPE_OPTIONS.map(t=>`<span class="type-chip${v('type')&&v('type').split(',').map(s=>s.trim()).includes(t)?' selected':''}" onclick="toggleTypeChip(this,'${t}')">${t}</span>`).join('')}
            </div>
            <div class="type-display" id="type-display">${v('type')||'Aucun type sélectionné'}</div>
          </div>
          <div class="fg"><label class="fl">Feuillage</label>
            <select class="fi" id="f-feuillage"><option value="">— Choisir —</option>
            ${['Caduc','Persistant','Marcescent','Semi-persistant'].map(o=>`<option ${v('feuillage')===o?'selected':''}>${o}</option>`).join('')}
            </select></div>
          <div class="fg full">
            <label class="fl">📷 Photos (1 ou 2)</label>
            <div class="photo-grid">
              <div>
                <div style="font-size:11px;color:rgba(200,223,204,.35);margin-bottom:6px;letter-spacing:1px">PHOTO 1 *</div>
                <div class="photo-zone ${p.photo?'has-photo':''}" id="photo-zone" onclick="document.getElementById('f-photo-file').click()">
                  ${p.photo?`<img src="${p.photo}" class="photo-preview" id="photo-preview"/>`:`<span class="photo-zone-icon" id="photo-zone-icon">📷</span>`}
                  <div class="photo-zone-text" id="photo-zone-text">${p.photo?'Cliquer pour changer':'Uploader'}<br><small style="opacity:.5">ou URL ci-dessous</small></div>
                  <input type="file" id="f-photo-file" accept="image/*" style="display:none" onchange="handlePhotoUpload(event,1)"/>
                </div>
                <input class="fi" id="f-photo-url" placeholder="https://..." value="${p.photo&&!p.photo.startsWith('data:')?p.photo:''}" style="margin-top:6px;font-size:12px" oninput="previewUrl(this.value,1)"/>
              </div>
              <div>
                <div style="font-size:11px;color:rgba(200,223,204,.35);margin-bottom:6px;letter-spacing:1px">PHOTO 2 (optionnelle)</div>
                <div class="photo-zone ${p.photo2?'has-photo':''}" id="photo-zone2" onclick="document.getElementById('f-photo-file2').click()">
                  ${p.photo2?`<img src="${p.photo2}" class="photo-preview" id="photo-preview2"/>`:`<span class="photo-zone-icon" id="photo-zone-icon2">📷</span>`}
                  <div class="photo-zone-text" id="photo-zone-text2">${p.photo2?'Cliquer pour changer':'Uploader'}<br><small style="opacity:.5">ou URL ci-dessous</small></div>
                  <input type="file" id="f-photo-file2" accept="image/*" style="display:none" onchange="handlePhotoUpload(event,2)"/>
                </div>
                <input class="fi" id="f-photo-url2" placeholder="https://..." value="${p.photo2&&!p.photo2.startsWith('data:')?p.photo2:''}" style="margin-top:6px;font-size:12px" oninput="previewUrl(this.value,2)"/>
              </div>
            </div>
          </div>
          <div class="fg full"><label class="fl">🌡️ Rusticité (température minimale supportée)</label>
            ${renderTempPicker('rusticite', v('rusticite'))}
          </div>
          <div class="fg"><label class="fl">Exposition</label>
            <select class="fi" id="f-exposition">
              <option value="">— Choisir —</option>
              ${['Ombre','Mi-ombre','Soleil','Ombre – Mi-ombre','Mi-ombre – Soleil','Ombre – Mi-ombre – Soleil'].map(o=>`<option ${v('exposition')===o?'selected':''}>${o}</option>`).join('')}
            </select></div>
          <div class="fg"><label class="fl">pH du sol</label>
            <select class="fi" id="f-ph"><option value="">— Choisir —</option>
            ${['Acide','Neutre','Basique','Acide à neutre','Neutre à basique','Acide à basique'].map(o=>`<option ${v('ph')===o?'selected':''}>${o}</option>`).join('')}
            </select></div>
          <div class="fg"><label class="fl">Résistance sécheresse</label>
            <select class="fi" id="f-resistanceSech"><option value="">— Choisir —</option>
            ${['Faible','Modérée','Élevée','Très élevée'].map(o=>`<option ${v('resistanceSech')===o?'selected':''}>${o}</option>`).join('')}
            </select></div>
          <div class="fg full">
            <label class="fl">📏 Hauteur adulte</label>
            ${renderSizePicker('hauteurAdulte', v('hauteurAdulte'))}
          </div>
          <div class="fg full">
            <label class="fl">↔️ Largeur adulte</label>
            ${renderSizePicker('largeurAdulte', v('largeurAdulte'))}
          </div>
          <div class="fg full"><label class="fl">Période de floraison</label>
            ${(()=>{
              const MOIS=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
              const sel=new Set((v('periodeFloraison')||'').split(/\s*–\s*|\s*,\s*/).map(m=>m.trim()).filter(m=>MOIS.includes(m)));
              const btns=MOIS.map(m=>`<button type="button" class="month-btn${sel.has(m)?' selected':''}" data-mois="${m}" onclick="toggleMonth(this,'${m}')">${m.slice(0,4)}</button>`).join('');
              const display=sel.size?[...sel].sort((a,b)=>MOIS.indexOf(a)-MOIS.indexOf(b)).join(' – '):'Aucun mois sélectionné';
              return `<input type="hidden" id="f-periodeFloraison" value="${v('periodeFloraison')}"/>
                <div class="month-grid" id="month-grid">${btns}</div>
                <div class="month-display" id="month-display">🌸 ${display}</div>`;
            })()}
          </div>
          <div class="fg full"><label class="fl">🌸 Couleur des fleurs</label>
            ${renderColorPicker('couleurFleurs', v('couleurFleurs'))}
          </div>
          <div class="fg full"><label class="fl">🌺 Intérêt ornemental</label>
            <input type="hidden" id="f-interetOrnemental" value="${v('interetOrnemental')}"/>
            <div class="type-chips" id="interet-chips">
              ${['Floraison décorative','Floraison parfumée','Feuillage persistant','Feuillage décoratif','Feuillage caduc coloré','Feuillage panaché','Feuillage automnal','Feuillage marcescent','Bois / Tige / Rameau décoratif','Silhouette hivernale','Fruits & baies décoratifs','Port architectural','Tapis fleuri','Haie fleurie'].map(t=>`<span class="type-chip${v('interetOrnemental')&&v('interetOrnemental').split(',').map(s=>s.trim()).includes(t)?' selected':''}" onclick="toggleGenericChip('interet-chips','f-interetOrnemental','${t}',this)">${t}</span>`).join('')}
            </div>
            <div class="type-display" id="interet-display">${v('interetOrnemental')||'Aucun intérêt sélectionné'}</div>
          </div>
          <div class="fg full"><label class="fl">⭐ Autres intérêts</label>
            <input type="hidden" id="f-autresInterets" value="${v('autresInterets')}"/>
            <div class="type-chips" id="autres-interets-chips">
              ${['Mellifère','Médicinale','Feuillage aromatique','Comestible / Fruitière','Plante hôte','Fixatrice d\'azote','Résistante à la pollution','Toxique','Épineuse / Défensive'].map(t=>`<span class="type-chip${v('autresInterets')&&v('autresInterets').split(',').map(s=>s.trim()).includes(t)?' selected':''}" onclick="toggleGenericChip('autres-interets-chips','f-autresInterets','${t}',this)">${t}</span>`).join('')}
            </div>
            <div class="type-display" id="autres-interets-display">${v('autresInterets')||'Aucun intérêt sélectionné'}</div>
          </div>
          <div class="fg full"><label class="fl">🏡 Usage en aménagement</label>
            <input type="hidden" id="f-usageAmenagement" value="${v('usageAmenagement')}"/>
            <div class="type-chips" id="usage-chips">
              ${['Haie taillée','Haie libre','Haie champêtre','Brise-vent','Couvre-sol','Plante isolée (sujet)','Massif','Bac / Jardinière','Talus','Bord de l\'eau','Mur végétal','Grimpant sur support','Sous-bois','Prairie fleurie','Rocaille'].map(t=>`<span class="type-chip${v('usageAmenagement')&&v('usageAmenagement').split(',').map(s=>s.trim()).includes(t)?' selected':''}" onclick="toggleGenericChip('usage-chips','f-usageAmenagement','${t}',this)">${t}</span>`).join('')}
            </div>
            <div class="type-display" id="usage-display">${v('usageAmenagement')||'Aucun usage sélectionné'}</div>
          </div>
          <div class="fg full"><label class="fl">Description</label><textarea class="fi" id="f-description">${v('description')}</textarea></div>
        </div>
        <div class="form-actions">
          <button class="cancel-btn" onclick="closeForm()">Annuler</button>
          <button class="save-btn" onclick="savePlantForm()">✅ Enregistrer</button>
        </div>
      </div>
    </div>`;
}

function handlePhotoUpload(e, n=1){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const MAX=800; let w=img.width,h=img.height;
      if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;}}
      canvas.width=w;canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      const b64=canvas.toDataURL('image/jpeg',.82);
      const sfx = n===2 ? '2' : '';
      if(n===1) formPhotoB64=b64; else formPhoto2B64=b64;
      document.getElementById('f-photo-url'+sfx).value='';
      const zone=document.getElementById('photo-zone'+sfx);
      const icon=document.getElementById('photo-zone-icon'+sfx); if(icon)icon.remove();
      let prev=document.getElementById('photo-preview'+sfx);
      if(!prev){prev=document.createElement('img');prev.id='photo-preview'+sfx;prev.className='photo-preview';zone.insertBefore(prev,zone.firstChild);}
      prev.src=b64;
      document.getElementById('photo-zone-text'+sfx).textContent='✅ Photo chargée';
      zone.classList.add('has-photo');
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

function previewUrl(url, n=1){
  if(!url)return;
  const sfx = n===2 ? '2' : '';
  if(n===1) formPhotoB64=null; else formPhoto2B64=null;
  const zone=document.getElementById('photo-zone'+sfx);
  let prev=document.getElementById('photo-preview'+sfx);
  if(!prev){prev=document.createElement('img');prev.id='photo-preview'+sfx;prev.className='photo-preview';zone.insertBefore(prev,zone.firstChild);}
  prev.src=url; zone.classList.add('has-photo');
}

async function savePlantForm(){
  const latin = normalizeLatin(document.getElementById('f-latin').value.trim());
  if(latin) document.getElementById('f-latin').value = latin; // sync visuel
  const nom   = document.getElementById('f-nom').value.trim();

  // ══════════════════════════════════════════════════════
  //  BOUCLIER DE SÉCURITÉ — champs obligatoires
  // ══════════════════════════════════════════════════════
  const champsManquants = [];
  if (!nom)   champsManquants.push('Nom commun');
  if (!latin) champsManquants.push('Nom latin');

  const urlField  = document.getElementById('f-photo-url').value.trim();
  const urlField2 = document.getElementById('f-photo-url2').value.trim();
  const existing  = (editingId ? (plants.find(x=>x.id==editingId)||{}) : {});
  const photo     = formPhotoB64  || urlField  || existing.photo  || '';
  const photo2    = formPhoto2B64 || urlField2 || existing.photo2 || '';

  if (!photo) champsManquants.push('Photo principale (URL ou import)');

  if (champsManquants.length > 0) {
    alert('⚠️ Impossible d’enregistrer.\n\nChamp(s) obligatoire(s) manquant(s) :\n• ' + champsManquants.join('\n• '));
    return;
  }
  // ══════════════════════════════════════════════════════
  const plant={
    id:editingId||nextId(), latin,
    nom:document.getElementById('f-nom').value.trim(),
    famille:normalizeFamille(document.getElementById('f-famille').value),
    type:document.getElementById('f-type').value,
    feuillage:document.getElementById('f-feuillage').value,
    rusticite:document.getElementById('f-rusticite').value,
    exposition:document.getElementById('f-exposition').value,
    ph:document.getElementById('f-ph').value,
    resistanceSech:document.getElementById('f-resistanceSech').value,
    hauteurAdulte:document.getElementById('f-hauteurAdulte').value,
    largeurAdulte:document.getElementById('f-largeurAdulte').value,
    periodeFloraison:document.getElementById('f-periodeFloraison').value.trim(),
    couleurFleurs:document.getElementById('f-couleurFleurs').value,
    interetOrnemental:document.getElementById('f-interetOrnemental').value,
    autresInterets:document.getElementById('f-autresInterets').value,
    usageAmenagement:document.getElementById('f-usageAmenagement').value,
    description:document.getElementById('f-description').value.trim(),
    photo, photo2,
  };
  if(editingId) plants=plants.map(p=>p.id===editingId?plant:p);
  else plants.push(plant);
  closeForm();
  await savePlants();
  renderAdmin();
}
// ══════════════════════════════════════════════════════
//  TEMP PICKER (Rusticité)
// ══════════════════════════════════════════════════════

// Color gradient: deep blue (very cold) → cyan → green → yellow → orange (warm)
function tempColor(idx){
  // idx 0 = coldest (< -20°C), idx 26 = warmest (+10°C)
  const total = TEMPERATURES.length - 1;
  const r = idx / total; // 0=cold, 1=warm
  if(r < 0.25){
    // deep blue → blue
    const t = r / 0.25;
    return `rgb(${Math.round(30+t*30)},${Math.round(60+t*80)},${Math.round(180+t*60)})`;
  } else if(r < 0.5){
    // blue → cyan/teal
    const t = (r-0.25)/0.25;
    return `rgb(${Math.round(60+t*20)},${Math.round(140+t*80)},${Math.round(240-t*60)})`;
  } else if(r < 0.75){
    // teal → green
    const t = (r-0.5)/0.25;
    return `rgb(${Math.round(80-t*20)},${Math.round(220-t*30)},${Math.round(180-t*120)})`;
  } else {
    // green → orange
    const t = (r-0.75)/0.25;
    return `rgb(${Math.round(60+t*190)},${Math.round(190-t*100)},${Math.round(60-t*40)})`;
  }
}



function renderTempPicker(fieldId, currentVal){
  tempPickerVal[fieldId] = currentVal || '';
  const selIdx = TEMPERATURES.indexOf(currentVal);
  const btns = TEMPERATURES.map((t,i)=>{
    const col = tempColor(i);
    const isSel = i === selIdx;
    const style = isSel
      ? `style="background:${col};border-color:${col};box-shadow:0 0 8px ${col}55"`
      : `style="border-color:${col}44;color:${col}"`;
    return `<button type="button" class="temp-btn${isSel?' selected':''}" ${style} onclick="clickTempBtn('${fieldId}',${i})">${t}</button>`;
  }).join('');

  const display = currentVal || 'Non défini';
  return `<input type="hidden" id="f-${fieldId}" value="${currentVal||''}"/>
    <div class="temp-picker"><div class="temp-grid" id="temp-grid-${fieldId}">${btns}</div></div>
    <div class="temp-display" id="temp-display-${fieldId}">🌡️ ${display}</div>`;
}

function clickTempBtn(fieldId, idx){
  const grid = document.getElementById('temp-grid-'+fieldId);
  const current = document.getElementById('f-'+fieldId).value;
  const clickedVal = TEMPERATURES[idx];
  const newVal = current === clickedVal ? '' : clickedVal; // toggle off if same

  document.getElementById('f-'+fieldId).value = newVal;
  document.getElementById('temp-display-'+fieldId).textContent = '🌡️ '+(newVal||'Non défini');

  grid.querySelectorAll('.temp-btn').forEach((btn,i)=>{
    const col = tempColor(i);
    const isSel = i === idx && newVal !== '';
    btn.className = 'temp-btn'+(isSel?' selected':'');
    if(isSel){
      btn.style.cssText = `background:${col};border-color:${col};box-shadow:0 0 8px ${col}55;font-weight:700;color:#fff`;
    } else {
      btn.style.cssText = `border-color:${col}44;color:${col}`;
    }
  });
}

// ══════════════════════════════════════════════════════
//  SIZE PICKER (Hauteur / Largeur)
// ══════════════════════════════════════════════════════
// sizePickers[fieldId] = {min: idx|null, max: idx|null}


function parseSizeToIdx(str){
  if(!str) return null;
  // Try to find exact match first
  let idx = TAILLES.indexOf(str);
  if(idx>=0) return idx;
  // Parse number — handle cm→m conversion
  let v = str.trim();
  const isCm = /cm/i.test(v);
  const num = parseFloat(v.replace(/[^0-9.,]/g,'').replace(',','.'));
  if(isNaN(num)) return null;
  const meters = isCm ? num/100 : num;
  // Find closest index
  let best=0, bestDist=Infinity;
  TAILLES.forEach((t,i)=>{
    const n = t==='<0.1 m'?0.05 : t==='>40 m'?45 : parseFloat(t);
    const d=Math.abs(n-meters);
    if(d<bestDist){bestDist=d;best=i;}
  });
  return best;
}

function renderSizePicker(fieldId, currentVal){
  // Parse current value into min/max
  let minIdx=null, maxIdx=null;
  if(currentVal){
    const parts = currentVal.split(/\s*–\s*/);
    minIdx = parseSizeToIdx(parts[0]);
    maxIdx = parts[1] ? parseSizeToIdx(parts[1]) : minIdx;
    if(maxIdx!==null && minIdx!==null && maxIdx < minIdx){ const tmp=minIdx; minIdx=maxIdx; maxIdx=tmp; }
  }
  sizePickers[fieldId] = {min:minIdx, max:maxIdx};

  const btns = TAILLES.map((t,i)=>{
    let cls='size-btn';
    if(minIdx!==null && maxIdx!==null){
      if(i===minIdx) cls+=' range-start';
      else if(i===maxIdx) cls+=' range-end';
      else if(i>minIdx && i<maxIdx) cls+=' range-mid';
    } else if(i===minIdx) cls+=' range-start';
    return `<button type="button" class="${cls}" onclick="clickSizeBtn('${fieldId}',${i})">${t}</button>`;
  }).join('');

  const displayVal = currentVal || 'Non défini';
  return `<input type="hidden" id="f-${fieldId}" value="${currentVal||''}"/>
    <div class="size-picker"><div class="size-grid" id="size-grid-${fieldId}">${btns}</div></div>
    <div class="size-hint">1er clic = borne basse · 2e clic = borne haute</div>
    <div class="size-display" id="size-display-${fieldId}">📏 ${displayVal}</div>`;
}

function clickSizeBtn(fieldId, idx){
  const state = sizePickers[fieldId];
  if(state.min===null){
    // Nothing selected → set min
    state.min=idx; state.max=null;
  } else if(state.max===null){
    if(idx===state.min){
      // Click same → clear
      state.min=null;
    } else if(idx > state.min){
      // Set max
      state.max=idx;
    } else {
      // Lower → new min
      state.min=idx; state.max=null;
    }
  } else {
    // Range already set → restart from this click
    state.min=idx; state.max=null;
  }
  updateSizePicker(fieldId);
}

function updateSizePicker(fieldId){
  const state = sizePickers[fieldId];
  const {min,max} = state;
  // Update buttons
  const grid = document.getElementById('size-grid-'+fieldId);
  if(!grid) return;
  grid.querySelectorAll('.size-btn').forEach((btn,i)=>{
    btn.className='size-btn';
    if(min!==null && max!==null){
      if(i===min) btn.classList.add('range-start');
      else if(i===max) btn.classList.add('range-end');
      else if(i>min && i<max) btn.classList.add('range-mid');
    } else if(i===min) btn.classList.add('range-start');
  });
  // Compute value string
  let val='', display='Non défini';
  if(min!==null && max!==null && min!==max){
    val=TAILLES[min]+' – '+TAILLES[max];
    display=val;
  } else if(min!==null){
    val=TAILLES[min];
    display=val;
  }
  document.getElementById('f-'+fieldId).value=val;
  document.getElementById('size-display-'+fieldId).textContent='📏 '+(display);
}


// ══════════════════════════════════════════════════════
//  COLOR PICKER (Couleur des fleurs)
// ══════════════════════════════════════════════════════

function renderColorPicker(fieldId, currentVal){
  const sel = new Set((currentVal||'').split(/\s*,\s*/).map(s=>s.trim()).filter(Boolean));
  const btns = COULEURS_FLEURS.map(c=>{
    const isSel = sel.has(c.nom);
    const lightColors = ['Blanc','Crème','Ivoire','Jaune pâle','Jaune'];
    const borderStyle = lightColors.includes(c.nom) ? 'border-color:rgba(180,180,180,.5)' : '';
    return `<div class="color-swatch${isSel?' selected':''}" onclick="toggleColor('${fieldId}','${c.nom.replace(/'/g,"\\'")}',this)" title="${c.nom}">
      <div class="dot" style="background:${c.css};${borderStyle}"></div>
      <span class="clabel">${c.nom}</span>
    </div>`;
  }).join('');
  const display = currentVal || 'Aucune couleur sélectionnée';
  return `<input type="hidden" id="f-${fieldId}" value="${(currentVal||'').replace(/"/g,'&quot;')}"/>
    <div class="color-grid" id="color-grid-${fieldId}">${btns}</div>
    <div class="color-display" id="color-display-${fieldId}">🌸 ${display}</div>`;
}

function toggleColor(fieldId, nom, el){
  el.classList.toggle('selected');
  const val = Array.from(document.querySelectorAll(`#color-grid-${fieldId} .color-swatch.selected`))
    .map(s=>s.title).join(', ');
  document.getElementById('f-'+fieldId).value = val;
  document.getElementById('color-display-'+fieldId).textContent = '🌸 '+(val||'Aucune couleur sélectionnée');
}

function toggleGenericChip(gridId, fieldId, val, el){
  el.classList.toggle('selected');
  const selected=Array.from(document.querySelectorAll('#'+gridId+' .type-chip.selected')).map(c=>c.textContent);
  const v=selected.join(', ');
  document.getElementById(fieldId).value=v;
  // Mapping fieldId → display div ID
  const dispMap={
    'f-interetOrnemental':'interet-display',
    'f-usageAmenagement':'usage-display',
    'f-autresInterets':'autres-interets-display'
  };
  const dispId=dispMap[fieldId]||null;
  if(dispId){ const disp=document.getElementById(dispId); if(disp) disp.textContent=v||'Aucune sélection'; }
}

function toggleTypeChip(el, val){
  el.classList.toggle('selected');
  const selected=Array.from(document.querySelectorAll('#type-chips-grid .type-chip.selected')).map(c=>c.textContent);
  const v=selected.join(', ');
  document.getElementById('f-type').value=v;
  document.getElementById('type-display').textContent=v||'Aucun type sélectionné';
}

function toggleMonth(btn, mois){
  const MOIS=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  btn.classList.toggle('selected');
  const selected=Array.from(document.querySelectorAll('#month-grid .month-btn.selected')).map(b=>b.dataset.mois);
  // Sort by calendar order
  const sorted=MOIS.filter(m=>selected.includes(m));
  const val=sorted.join(' – ');
  document.getElementById('f-periodeFloraison').value=val;
  document.getElementById('month-display').textContent=sorted.length?'🌸 '+val:'Aucun mois sélectionné';
}

function closeForm(){ document.getElementById('overlay-root').innerHTML=''; editingId=null; formPhotoB64=null; formPhoto2B64=null; }

async function mergePlants(){
  const defaults = DEFAULT_PLANTS;
  const existing_latins = plants.map(p=>(p.latin||'').toLowerCase().trim());
  const toAdd = defaults.filter(p=> !existing_latins.includes((p.latin||'').toLowerCase().trim()));
  if(toAdd.length===0){ alert('✅ Toutes les plantes par défaut sont déjà présentes.'); return; }
  const maxId = plants.reduce((m,p)=>Math.max(m,p.id||0),0);
  const added = toAdd.map((p,i)=>({...p, id: maxId+i+1}));
  plants = [...plants, ...added];
  await savePlants();
  renderAdmin();
  const msg = added.map(p=>p.latin).join(', ');
  alert(`✅ ${added.length} plante(s) ajoutée(s) :\n${msg}`);
}

// ══════════════════════════════════════════════════════
//  MULTIJOUEUR — constantes & état
// ══════════════════════════════════════════════════════
var SK_PACKS = 'chloroquiz_packs';
var multiStep = 'select';
var multiSelectedIds = new Set();
var multiLevel = 1;
var multiFieldFilter = []; // [] = tous les champs
var multiQuestions = [];
var multiReviewIdx = 0;
var multiSessionCode = null;
var multiPollInterval = null;
var sessionPlayers = [];
var sessionPlayerName = null;
var sessionQIdx = 0;
var sessionQuestions = [];
var sessionScore = {ok:0,total:0};
var sessionPollI = null;
var sessionFinalRows = []; // résultats finaux côté joueur
var sessionCurrentCode  = ''; // code session courant (pour print/export)

// ══════════════════════════════════════════════════════
//  ADMIN — onglet Multi : rendu principal
// ══════════════════════════════════════════════════════
function renderMultiTab(){
  const c = document.getElementById('multi-container');
  if(!cloudOk){
    c.innerHTML=`<div style="padding:24px;text-align:center;color:rgba(200,223,204,.4)">
      <div style="font-size:40px;margin-bottom:12px">☁️</div>
      <div>La session multijoueur nécessite une connexion Supabase active.</div>
      <div style="font-size:12px;margin-top:8px">Configurez le cloud dans l'onglet ☁️ Cloud.</div></div>`;
    return;
  }
  // Choix : nouvelle session ou charger un pack
  const packs = loadPacksLocal();
  const packsHtml = packs.length ? `
    <div style="margin-bottom:24px">
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,223,204,.35);margin-bottom:10px">📦 Packs sauvegardés</div>
      <div class="pack-list">${packs.map((pk,i)=>`
        <div class="pack-item">
          <div class="pack-item-info">
            <div class="pack-item-name">${pk.name}</div>
            <div class="pack-item-meta">Niv.${pk.level} · ${pk.questions.length} questions · ${pk.plantCount} plantes · ${new Date(pk.savedAt).toLocaleDateString('fr-FR')}</div>
          </div>
          <div class="pack-item-btns">
            <button class="pack-use-btn" onclick="loadPackForLaunch(${i})">▶ Lancer</button>
            <button class="pack-del-btn" onclick="deletePack(${i})">🗑️</button>
          </div>
        </div>`).join('')}
      </div>
    </div>` : '';

  c.innerHTML=`
    ${packsHtml}
    <div class="multi-step-title">🆕 Nouvelle session multijoueur</div>
    <p style="font-size:13px;color:rgba(200,223,204,.45);margin-bottom:20px">
      Étape 1 : sélectionnez les plantes → Étape 2 : validez les questions → Étape 3 : lancez et partagez le code
    </p>
    <button id="btn-create-session" style="width:100%;padding:14px;background:linear-gradient(135deg,#1e5030,#2d7a4a);border:none;border-radius:14px;color:white;font-size:15px;font-weight:700;cursor:pointer">
      🌿 Créer une nouvelle session
    </button>`;
  // addEventListener — plus fiable que onclick dans innerHTML
  const btnCreate = document.getElementById('btn-create-session');
  if(btnCreate) btnCreate.addEventListener('click', ()=>{ try{ startMultiStep1(); } catch(e){ cqErr('startMultiStep1:', e); alert('Erreur : '+e.message); } });
}

// ══════════════════════════════════════════════════════
//  ÉTAPE 1 — Sélection des plantes
// ══════════════════════════════════════════════════════
function startMultiStep1(){
  multiSelectedIds = new Set(plants.map(p=>p.id)); // tout sélectionné par défaut
  multiFieldFilter = []; // aucun filtre par défaut = tous les types
  renderStep1();
}
function renderStep1(){
  cqLog('renderStep1 — MULTI_ALL_FIELDS:', Array.isArray(MULTI_ALL_FIELDS)?MULTI_ALL_FIELDS.length+' items':String(MULTI_ALL_FIELDS), '| niveau:', multiLevel, '| filtre:', JSON.stringify(multiFieldFilter||[]));
  const c = document.getElementById('multi-container');
  const items = plants.map(p=>`
    <div class="psel-item ${multiSelectedIds.has(p.id)?'selected':''}" onclick="togglePlantSel(${p.id},this)">
      <input type="checkbox" ${multiSelectedIds.has(p.id)?'checked':''} onclick="event.stopPropagation();togglePlantSel(${p.id},this.closest('.psel-item'))"/>
      ${p.photo?`<img class="psel-item-thumb" src="${p.photo}" onerror="this.style.display='none'" loading="lazy"/>`:'<div style="width:40px;height:40px;border-radius:8px;background:rgba(74,184,112,.08);flex-shrink:0"></div>'}
      <div>
        <div class="psel-item-latin">${p.latin}</div>
        <div class="psel-item-nom">${p.nom||''}</div>
      </div>
    </div>`).join('');

  c.innerHTML=`
    <button style="background:none;border:none;color:rgba(200,223,204,.45);cursor:pointer;font-size:13px;margin-bottom:12px" onclick="renderMultiTab()">← Retour</button>
    <div class="multi-step-title">Étape 1 — Sélectionner les plantes</div>
    <div style="margin-bottom:14px">
      <label style="font-size:12px;color:rgba(200,223,204,.45);display:block;margin-bottom:6px">Niveau des questions</label>
      <div style="display:flex;gap:8px">
        ${[1,2,3].map(n=>`<button class="level-card lv${n} ${n===multiLevel?'selected':''}" id="mlc-${n}" onclick="selectMultiLevel(${n})" style="flex:1;min-height:0;padding:10px;border-radius:12px">
          <span class="level-badge-tag">Niv.${n}</span>
          <div class="level-title" style="font-size:12px">${n===1?'CAPA/BAC':n===2?'Avancé':'Aménagement'}</div>
        </button>`).join('')}
      </div>
    </div>
    <div class="field-filter-wrap">
      <div class="field-filter-title">🎯 Types de questions</div>
      <div class="field-chips" id="field-chips-wrap">
        ${(MULTI_ALL_FIELDS||[]).filter(f=>f.levels.includes(multiLevel)).map(f=>`
          <div class="fchip ${(multiFieldFilter||[]).includes(f.key)?'active':''}" data-key="${f.key}" onclick="toggleFieldFilter('${f.key}')">
            <span class="fchip-icon">${f.icon}</span>${f.label}
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
        <button class="psel-btn" style="font-size:11px;padding:5px 10px" onclick="selectAllFields()">Tout (sans filtre)</button>
        <div class="field-filter-hint" id="field-filter-hint">${(multiFieldFilter||[]).length===0?'Tous les types de questions (aucun filtre)':(multiFieldFilter||[]).length+' type(s) sélectionné(s)'}</div>
      </div>
    </div>
    <div class="psel-controls">
      <button class="psel-btn" onclick="selectAllPlants(true)">✅ Tout sélectionner</button>
      <button class="psel-btn" onclick="selectAllPlants(false)">☐ Tout désélectionner</button>
    </div>
    <div class="psel-count" id="psel-count">${multiSelectedIds.size} plante(s) sélectionnée(s)</div>
    <div class="plant-select-grid">${items}</div>
    <button id="btn-gen-questions" style="width:100%;padding:14px;background:linear-gradient(135deg,#1e5030,#2d7a4a);border:none;border-radius:14px;color:white;font-size:15px;font-weight:700;cursor:pointer">
      Générer les questions →
    </button>`;
  multiStep='select';
  selectMultiLevel(multiLevel); // force le rendu des chips après injection HTML
  const btnGen = document.getElementById('btn-gen-questions');
  if(btnGen) btnGen.addEventListener('click', ()=>{ try{ goToStep2(); } catch(e){ cqErr('goToStep2:', e); alert('Erreur : '+e.message); } });
}
function togglePlantSel(id, el){
  const item = el.classList.contains('psel-item') ? el : el.closest('.psel-item');
  if(multiSelectedIds.has(id)){ multiSelectedIds.delete(id); item.classList.remove('selected'); item.querySelector('input').checked=false; }
  else { multiSelectedIds.add(id); item.classList.add('selected'); item.querySelector('input').checked=true; }
  document.getElementById('psel-count').textContent = multiSelectedIds.size+' plante(s) sélectionnée(s)';
}
function selectAllPlants(sel){
  multiSelectedIds = sel ? new Set(plants.map(p=>p.id)) : new Set();
  renderStep1();
}
function selectMultiLevel(n){
  cqLog('selectMultiLevel('+n+') — MULTI_ALL_FIELDS:', Array.isArray(MULTI_ALL_FIELDS)?MULTI_ALL_FIELDS.length+' items':String(MULTI_ALL_FIELDS));
  multiLevel=n;
  [1,2,3].forEach(i=>{
    const b=document.getElementById('mlc-'+i);
    if(b) b.classList.toggle('selected', i===n);
  });
  // Retirer du filtre les champs non disponibles à ce niveau
  multiFieldFilter = (multiFieldFilter||[]).filter(k=>{
    const f = (MULTI_ALL_FIELDS||[]).find(x=>x.key===k);
    return f && f.levels.includes(n);
  });
  // Rafraîchir les chips
  const wrap = document.getElementById('field-chips-wrap');
  if(wrap){
    wrap.innerHTML = (MULTI_ALL_FIELDS||[]).filter(f=>f.levels.includes(n)).map(f=>`
      <div class="fchip ${(multiFieldFilter||[]).includes(f.key)?'active':''}" data-key="${f.key}" onclick="toggleFieldFilter('${f.key}')">
        <span class="fchip-icon">${f.icon}</span>${f.label}
      </div>`).join('');
  }
}

// ══════════════════════════════════════════════════════
//  ÉTAPE 2 — Génération + review des questions
// ══════════════════════════════════════════════════════
function goToStep2(){
  const pool = plants.filter(p=>multiSelectedIds.has(p.id));
  if(pool.length < 4){ alert('⚠️ Sélectionnez au moins 4 plantes pour générer des questions.'); return; }
  multiQuestions = generateSessionQuestions(pool, multiLevel, 20);
  multiReviewIdx = 0;
  renderStep2();
}
function renderStep2(){
  const c = document.getElementById('multi-container');
  const kept = multiQuestions.filter(q=>q.status==='kept').length;
  const pending = multiQuestions.filter(q=>q.status==='pending').length;
  const badges = `<div class="qrev-status">
    <span class="qrev-badge kept">✅ ${kept} gardée(s)</span>
    <span class="qrev-badge pending">⏳ ${pending} en attente</span>
    <span class="qrev-badge" style="background:rgba(200,223,204,.05);color:rgba(200,223,204,.4)">${multiQuestions.length} total</span>
  </div>`;

  const cards = multiQuestions.map((q,i)=>{
    const opts = q.options.map(o=>`<div class="qrev-opt ${o===q.correct?'correct':''}">${o}</div>`).join('');
    const isKept = q.status==='kept';
    return `<div class="qrev-card" id="qrev-${i}">
      <div class="qrev-num">Q${i+1} · ${q.fieldLabel}</div>
      <div class="qrev-text">${q.question}</div>
      <div class="qrev-opts">${opts}</div>
      <div class="qrev-actions">
        <button class="qrev-keep ${isKept?'':'qrev-regen'}" style="${isKept?'background:rgba(74,184,112,.25);border-color:var(--g4);font-weight:700':''}" onclick="keepQuestion(${i})">${isKept?'✅ Gardée':'✅ Garder'}</button>
        <button class="qrev-regen" onclick="regenQuestion(${i})">🔄 Régénérer</button>
        <button class="qrev-del" onclick="removeQuestion(${i})">🗑️ Retirer</button>
      </div>
    </div>`;
  }).join('');

  c.innerHTML=`
    <button style="background:none;border:none;color:rgba(200,223,204,.45);cursor:pointer;font-size:13px;margin-bottom:12px" onclick="renderStep1()">← Retour sélection</button>
    <div class="multi-step-title">Étape 2 — Valider les questions</div>
    <p style="font-size:13px;color:rgba(200,223,204,.45);margin-bottom:12px">Gardez, régénérez ou retirez chaque question. Il en faut au moins 10 pour lancer.</p>
    ${badges}
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      <button class="psel-btn" onclick="keepAllQuestions()">✅ Garder toutes</button>
      <button class="psel-btn" style="border-color:rgba(255,140,0,.3);color:#ff8c00" onclick="regenAllPending()">🔄 Régénérer en attente</button>
    </div>
    ${cards}
    <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap">
      <button style="flex:1;padding:13px;background:rgba(74,184,112,.07);border:1px solid rgba(74,184,112,.25);border-radius:14px;color:var(--g4);font-size:13px;font-weight:700;cursor:pointer" onclick="savePackPrompt()">💾 Sauvegarder le pack</button>
      <button id="btn-launch-session" style="flex:2;padding:13px;background:linear-gradient(135deg,#1e5030,#2d7a4a);border:none;border-radius:14px;color:white;font-size:15px;font-weight:700;cursor:pointer">🚀 Lancer la session →</button>
    </div>`;
  multiStep='review';
  const btnLaunch = document.getElementById('btn-launch-session');
  if(btnLaunch) btnLaunch.addEventListener('click', ()=>{ try{ goToStep3(); } catch(e){ alert('Erreur : '+e.message); } });
}
function keepQuestion(i){ multiQuestions[i].status='kept'; renderStep2(); }
function removeQuestion(i){ if(multiQuestions.length<=4){alert('Minimum 4 questions.');return;} multiQuestions.splice(i,1); renderStep2(); }
function keepAllQuestions(){ multiQuestions.forEach(q=>q.status='kept'); renderStep2(); }
function regenQuestion(i){
  const pool = plants.filter(p=>multiSelectedIds.has(p.id));
  const newQ = generateOneQuestion(pool, multiLevel, multiQuestions.map(q=>q.plantId));
  if(newQ){ multiQuestions[i] = newQ; renderStep2(); }
  else alert('Impossible de générer une nouvelle question avec les plantes disponibles.');
}
function regenAllPending(){
  const pool = plants.filter(p=>multiSelectedIds.has(p.id));
  multiQuestions = multiQuestions.map(q=>{
    if(q.status==='pending'){
      const nq = generateOneQuestion(pool, multiLevel, multiQuestions.filter(x=>x!==q).map(x=>x.plantId));
      return nq || q;
    }
    return q;
  });
  renderStep2();
}

// ══════════════════════════════════════════════════════
//  GÉNÉRATION DE QUESTIONS (version sérialisable)
// ══════════════════════════════════════════════════════
function generateSessionQuestions(pool, level, count){
  const qs = [];
  const usedPlantIds = [];
  for(let i=0; i<count; i++){
    const q = generateOneQuestion(pool, level, usedPlantIds);
    if(q){ qs.push(q); usedPlantIds.push(q.plantId); }
    else if(pool.length>=4){ usedPlantIds.length=0; const q2=generateOneQuestion(pool,level,[]); if(q2) qs.push(q2); }
  }
  return qs;
}
function generateOneQuestion(pool, level, usedPlantIds){
  // Choisir une plante non encore utilisée
  const available = pool.filter(p=>!usedPlantIds.includes(p.id));
  const src = available.length ? available : pool;
  const p = rand(src);
  if(!p) return null;

  // Déterminer les types autorisés selon le filtre
  const filter = (typeof multiFieldFilter !== 'undefined' && multiFieldFilter) ? multiFieldFilter : [];
  const allowPhoto       = filter.length===0 || filter.includes('photo');
  const allowDictee      = filter.includes('dictee');
  const allowKnowledge   = filter.length===0 || filter.some(k=>k!=='photo' && k!=='n3' && k!=='dictee');
  const allowN3          = (filter.length===0 || filter.includes('n3')) && level===3;

  // Construire la liste des types possibles — chaque type activé a le même poids
  // Les types knowledge sont listés individuellement pour un vrai mélange
  const possible = [];
  if(allowPhoto)     possible.push('photo');
  if(allowDictee)    possible.push('dictee');
  if(allowN3)        possible.push('n3');
  // Pour knowledge : ajouter autant de fois qu'il y a de champs sélectionnés
  if(allowKnowledge){
    const kFields = filter.filter(k=>k!=='photo'&&k!=='n3'&&k!=='dictee');
    const kCount = kFields.length || 1;
    for(var _ki=0;_ki<kCount;_ki++) possible.push('knowledge');
  }
  if(!possible.length) possible.push('photo'); // fallback

  const type = possible[Math.floor(Math.random()*possible.length)];

  if(type==='dictee'){
    return buildDicteeQuestion(p);
  } else if(type==='photo'){
    return buildPhotoQuestion(p, pool);
  } else if(type==='n3'){
    return buildN3Question(p, pool);
  } else {
    return buildKnowledgeQuestion(p, pool, level, filter.filter(k=>k!=='photo'&&k!=='n3'&&k!=='dictee'));
  }
}
function buildDicteeQuestion(p){
  return {
    type:'dictee', plantId:p.id, plantLatin:p.latin, plantNom:p.nom,
    plantPhoto:p.photo||'', plantPhoto2:p.photo2||'',
    question:'Quel est le nom latin de ce végétal ?',
    correct:p.latin,
    options:[], // pas d'options QCM pour la dictée
    fieldLabel:'Dictée botanique',
    status:'pending'
  };
}

function buildPhotoQuestion(p, pool){
  const wrongs = shuffle(pool.filter(x=>x.id!==p.id)).slice(0,3);
  if(wrongs.length<3) return null;
  const options = shuffle([p,...wrongs]);
  return {
    type:'photo', plantId:p.id, plantLatin:p.latin, plantNom:p.nom,
    plantPhoto:p.photo||'', plantPhoto2:p.photo2||'',
    question:'Quel est ce végétal ?',
    correct:p.latin,
    options:options.map(x=>x.latin),
    fieldLabel:'Identification',
    status:'pending'
  };
}
function buildKnowledgeQuestion(p, pool, level, fieldKeys){
  if(level===3 && (!fieldKeys||!fieldKeys.length)) return buildN3Question(p, pool);
  const fields = level===2 ? KFIELDS_N2 : KFIELDS_N1;
  const MULTIVALUE_KEYS=['interetOrnemental','autresInterets','type','couleurFleurs'];
  // Si un filtre de champs est actif, on ne garde que les champs sélectionnés
  const allowedKeys = fieldKeys && fieldKeys.length ? fieldKeys : null;
  const avail = fields.filter(f=>p[f.key]&&p[f.key].trim()&&(!allowedKeys||allowedKeys.includes(f.key)));
  if(!avail.length) return buildPhotoQuestion(p, pool);
  const field = rand(avail);
  let correct = p[field.key];
  if(MULTIVALUE_KEYS.includes(field.key)){
    const vals = correct.split(',').map(s=>s.trim()).filter(Boolean);
    correct = rand(vals) || correct;
  }
  const others = [...new Set(pool.filter(x=>x.id!==p.id&&x[field.key]&&x[field.key]!==correct).map(x=>{
    if(MULTIVALUE_KEYS.includes(field.key)){
      const vals=(x[field.key]||'').split(',').map(s=>s.trim()).filter(v=>v&&v!==correct);
      return vals.length?rand(vals):null;
    }
    return x[field.key];
  }).filter(Boolean))];
  let wrongs = shuffle(others).slice(0,3);
  const fil = field.key==='famille'?shuffle(FILLERS_FAMILLE.filter(f=>f!==correct)):shuffle((FILLERS[field.key]||[]).filter(f=>f!==correct));
  for(const f of fil){ if(wrongs.length>=3)break; if(f!==correct&&!wrongs.includes(f))wrongs.push(f); }
  if(wrongs.length<3) return null;
  return {
    type:'knowledge', plantId:p.id, plantLatin:p.latin, plantNom:p.nom,
    plantPhoto:p.photo||'', plantPhoto2:p.photo2||'',
    question: field.q(p.latin),
    correct, options:shuffle([correct,...wrongs.slice(0,3)]),
    fieldLabel:field.label, status:'pending'
  };
}
function buildN3Question(p, pool){
  const N3_FIELDS=[['exposition','ph'],['feuillage','rusticite'],['rusticite','exposition','ph'],['exposition','resistanceSech','feuillage'],['exposition','ph'],['exposition','ph'],['rusticite','resistanceSech'],['exposition','feuillage']];
  const tplIdx = Math.floor(Math.random()*N3_TEMPLATES.length);
  const tpl = N3_TEMPLATES[tplIdx];
  const tplFields = N3_FIELDS[tplIdx]||[];
  const question = tpl(p);
  function exOv(a,b){ if(!a||!b)return false; const sp=s=>s.split(/\s*[\u2013-]\s*|\s*,\s*/).map(x=>x.trim()).filter(Boolean); return sp(a).some(v=>sp(b).includes(v)); }
  function fComp(f,a,b){ if(!a||!b)return false; return f==='exposition'?exOv(a,b):a===b; }
  function isValid(x){ return tplFields.length>0&&tplFields.every(f=>fComp(f,p[f],x[f])); }
  const others = shuffle(pool.filter(x=>x.id!==p.id&&!isValid(x))).slice(0,3);
  if(others.length<3) return null;
  const options = shuffle([p,...others]);
  return {
    type:'n3', plantId:p.id, plantLatin:p.latin, plantNom:p.nom,
    plantPhoto:p.photo||'', plantPhoto2:p.photo2||'',
    question, correct:p.latin,
    options:options.map(x=>x.latin),
    fieldLabel:'Mise en situation', status:'pending'
  };
}

// ══════════════════════════════════════════════════════
//  PACKS — sauvegarde locale
// ══════════════════════════════════════════════════════
function loadPacksLocal(){
  try{ return JSON.parse(localStorage.getItem(SK_PACKS)||'[]'); }catch(e){ return []; }
}
function savePacksLocal(packs){
  try{ localStorage.setItem(SK_PACKS, JSON.stringify(packs)); }catch(e){}
}
function savePackPrompt(){
  const name = prompt('Nom du pack (ex: "Semaine 3 — Persistants") :');
  if(!name||!name.trim()) return;
  const packs = loadPacksLocal();
  packs.unshift({
    name:name.trim(), level:multiLevel,
    questions:multiQuestions, plantCount:multiSelectedIds.size,
    fieldFilter:[...multiFieldFilter],
    savedAt:Date.now()
  });
  savePacksLocal(packs);
  alert(`✅ Pack "${name.trim()}" sauvegardé !`);
}
function deletePack(i){
  if(!confirm('Supprimer ce pack ?')) return;
  const packs = loadPacksLocal(); packs.splice(i,1); savePacksLocal(packs); renderMultiTab();
}
function loadPackForLaunch(i){
  const packs = loadPacksLocal();
  const pk = packs[i];
  if(!pk) return;
  multiQuestions = pk.questions.map(q=>({...q, status:'kept'}));
  multiLevel = pk.level;
  multiFieldFilter = pk.fieldFilter||[];
  multiSelectedIds = new Set(pk.questions.map(q=>q.plantId));
  goToStep3();
}

// ══════════════════════════════════════════════════════
//  ÉTAPE 3 — Lancement + lobby
// ══════════════════════════════════════════════════════
async function goToStep3(){
  cqLog('goToStep3 — questions kept:', (multiQuestions||[]).filter(q=>q.status==='kept').length, '| niveau:', multiLevel, '| filtre:', JSON.stringify(multiFieldFilter||[]));
  const kept = multiQuestions.filter(q=>q.status==='kept');
  const valid = kept.length>=10 ? kept : multiQuestions; // fallback si < 10 gardées
  if(valid.length<4){ alert('⚠️ Il faut au moins 4 questions pour lancer.'); return; }
  if(!cloudOk){ alert('⚠️ Connexion Supabase requise.'); return; }
  // Générer code 4 chiffres unique
  let code, tries=0;
  do {
    code = String(Math.floor(1000+Math.random()*9000));
    tries++;
  } while(tries<10);
  multiSessionCode = code;
  // Sauvegarder la session dans Supabase
  const sessionData = {
    code, level:multiLevel,
    questions: valid.slice(0,20),
    host: 'Formateur', status:'waiting',
    created_at: new Date().toISOString()
  };
  try{
    await sbPost('floralab_sessions', sessionData, 'resolution=merge-duplicates');
  } catch(e){ alert('❌ Erreur lors de la création de la session.\n'+e.message); return; }
  startSessionLobby(code);
}
async function startSessionLobby(code){
  const c = document.getElementById('multi-container');
  c.innerHTML=`
    <div class="multi-step-title">🚀 Session en attente</div>
    <div class="session-code-display">
      <div class="session-code-big">${code}</div>
      <div class="session-code-label">Code à communiquer aux apprentis</div>
    </div>
    <div style="font-size:13px;color:rgba(200,223,204,.45);margin-bottom:12px" id="session-player-count">👥 0 joueur(s) connecté(s)</div>
    <div class="session-players-list" id="session-players-list"><div style="color:rgba(200,223,204,.3);text-align:center;padding:20px;font-size:13px">En attente de joueurs…</div></div>
    <button class="session-start-btn" id="session-start-btn" onclick="startSessionNow()" disabled>
      Démarrer pour tout le monde ▶
    </button>
    <button style="width:100%;padding:10px;background:none;border:1px solid rgba(255,80,80,.2);border-radius:12px;color:#ff8080;font-size:13px;cursor:pointer;margin-top:8px" onclick="cancelSession()">Annuler la session</button>`;
  // Poll toutes les 3s
  if(multiPollInterval) clearInterval(multiPollInterval);
  multiPollInterval = setInterval(()=>pollSessionPlayers(code), 3000);
  pollSessionPlayers(code);
}
async function pollSessionPlayers(code){
  try{
    const rows = await sbGet('floralab_session_players', `session_code=eq.${code}&select=*&order=score.desc`);
    sessionPlayers = rows;
    const list = document.getElementById('session-players-list');
    const countEl = document.getElementById('session-player-count');
    const startBtn = document.getElementById('session-start-btn');
    if(!list) return;
    countEl.textContent = `👥 ${rows.length} joueur(s) connecté(s)`;
    if(startBtn) startBtn.disabled = rows.length < 1;
    if(!rows.length){
      list.innerHTML=`<div style="color:rgba(200,223,204,.3);text-align:center;padding:20px;font-size:13px">En attente de joueurs…</div>`;
      return;
    }
    list.innerHTML = rows.map(r=>`
      <div class="session-player-row">
        <span class="session-player-name">👤 ${r.player_name}</span>
        <span class="session-player-score">${r.score||0} pts</span>
        <span class="session-player-prog">${r.done?'✅ Terminé':'⏳ En attente'}</span>
      </div>`).join('');
  } catch(e){}
}
async function startSessionNow(){
  if(!multiSessionCode) return;
  try{
    await sbPost('floralab_sessions', {code:multiSessionCode, status:'playing'}, 'resolution=merge-duplicates');
    renderSessionMonitor(multiSessionCode);
  } catch(e){ alert('Erreur : '+e.message); }
}
async function cancelSession(){
  if(multiPollInterval){ clearInterval(multiPollInterval); multiPollInterval=null; }
  if(multiSessionCode){
    try{ await sbDelete('floralab_sessions','code=eq.'+multiSessionCode); }catch(e){}
    multiSessionCode=null;
  }
  renderMultiTab();
}
async function renderSessionMonitor(code){
  if(multiPollInterval) clearInterval(multiPollInterval);
  const c = document.getElementById('multi-container');
  c.innerHTML=`
    <div class="multi-step-title">📡 Session en cours — Code <span style="color:var(--g4)">${code}</span></div>
    <div style="font-size:13px;color:rgba(200,223,204,.45);margin-bottom:12px" id="monitor-count">Chargement…</div>
    <div class="session-players-list" id="monitor-list"></div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button style="flex:1;padding:12px;background:rgba(74,184,112,.1);border:1px solid rgba(74,184,112,.3);border-radius:12px;color:var(--g4);font-size:13px;font-weight:700;cursor:pointer" onclick="printMonitorResults()">🖨️ Imprimer</button>
      <button style="flex:1;padding:12px;background:rgba(32,96,200,.1);border:1px solid rgba(32,96,200,.3);border-radius:12px;color:#7ab8f5;font-size:13px;font-weight:700;cursor:pointer" onclick="exportMonitorCSV()">📥 CSV</button>
      <button style="flex:1;padding:12px;background:rgba(255,80,80,.1);border:1px solid rgba(255,80,80,.25);border-radius:12px;color:#ff8080;font-size:13px;font-weight:700;cursor:pointer" onclick="endSessionAdmin()">⏹ Terminer</button>
    </div>`;
  multiPollInterval = setInterval(()=>pollMonitor(code), 2500);
  pollMonitor(code);
}
async function pollMonitor(code){
  try{
    const rows = await sbGet('floralab_session_players',`session_code=eq.${code}&select=*&order=score.desc`);
    const list = document.getElementById('monitor-list');
    const cnt = document.getElementById('monitor-count');
    const progGlobal = document.getElementById('monitor-progress-global');
    if(!list) return;
    const done = rows.filter(r=>r.done).length;
    const avgPct = rows.length ? Math.round(rows.reduce((a,r)=>a+(r.score||0),0)/rows.reduce((a,r)=>a+(r.total||1),0)*100) : 0;
    cnt.textContent = `${rows.length} joueur(s) · ${done} terminé(s)`;
    if(progGlobal) progGlobal.textContent = rows.length>0 ? `Moyenne : ${avgPct}%` : '';
    const medals = ['🥇','🥈','🥉'];
    list.innerHTML = rows.map((r,i)=>{
      var act = null;
      try{ if(r.last_activity) act = JSON.parse(r.last_activity); }catch(e){}
      const pct = r.total ? Math.round((r.score||0)/r.total*100) : 0;
      const barCol = pct>=70?'var(--g4)':pct>=40?'var(--am2)':'#ff9999';
      const rankIcon = i<3 ? medals[i] : `<span style="color:rgba(200,223,204,.4);font-weight:700">#${i+1}</span>`;
      var statusHtml = '';
      if(r.done){
        statusHtml = `<span class="mon-status done">✅ Terminé · ${r.score||0}/${r.total||0} · ${pct}%</span>`;
      } else if(act){
        const okIcon = act.ok ? '✅' : '❌';
        const plantShort = act.plant ? act.plant.split(' ').slice(0,2).join(' ') : '';
        statusHtml = `<span class="mon-status ${act.ok?'ok':'ko'}">${okIcon} Q${act.q} · ${act.label||''} · <em>${plantShort}</em></span>`;
      } else if((r.current_q||0)>0){
        // last_activity non dispo (colonne pas encore ajoutée) → fallback sur current_q
        statusHtml = `<span class="mon-status wait">▶ En cours — Q${(r.current_q||0)+1} · ${r.score||0} pt(s)</span>`;
      } else {
        statusHtml = `<span class="mon-status wait">⏳ Connexion…</span>`;
      }
      return `<div class="mon-row ${r.done?'mon-done':''}">
        <div class="mon-rank">${rankIcon}</div>
        <div class="mon-info">
          <div class="mon-name">${r.player_name}</div>
          <div class="mon-bar-wrap"><div class="mon-bar" style="width:${pct}%;background:${barCol}"></div></div>
        </div>
        <div class="mon-right">
          <div class="mon-score">${r.score||0}<span style="font-size:11px;opacity:.5">/${r.total||0}</span></div>
          <div class="mon-q">Q ${r.done ? (r.current_q||0) : (r.current_q||0)+1} / ${sessionQuestions.length||20}</div>
        </div>
        <div class="mon-activity">${statusHtml}</div>
      </div>`;
    }).join('');
    if(done===rows.length && rows.length>0){
      clearInterval(multiPollInterval);
      if(cnt) cnt.textContent += ' — 🎉 Tous terminés !';
    }
  } catch(e){ cqErr('pollMonitor error:',e); }
}
async function endSessionAdmin(){
  if(multiPollInterval){ clearInterval(multiPollInterval); multiPollInterval=null; }
  const code = multiSessionCode || '—';
  if(multiSessionCode){
    try{ await sbPost('floralab_sessions',{code:multiSessionCode,status:'ended'},'resolution=merge-duplicates'); }catch(e){}
    try{ sessionPlayers = await sbGet('floralab_session_players',`session_code=eq.${multiSessionCode}&select=*&order=score.desc`); }catch(e){}
    multiSessionCode=null;
  }
  const c = document.getElementById('multi-container');
  c.innerHTML=`
    <div class="multi-step-title">🏆 Résultats finaux — Session ${code}</div>
    <div class="session-players-list" style="max-height:none;margin-bottom:16px">
      ${sessionPlayers.map((r,i)=>`
        <div class="session-player-row">
          <span style="width:28px;font-size:18px">${i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'.'}</span>
          <span class="session-player-name">${r.player_name}</span>
          <span class="session-player-score">✅ ${r.score||0}/${r.total||0}</span>
          <span style="font-size:12px;color:rgba(200,223,204,.5)">${r.total?Math.round((r.score||0)/r.total*100):0}%</span>
          <span class="session-player-prog">${r.done?'✅ Fini':'⏳'}</span>
        </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button style="flex:1;min-width:140px;padding:12px;background:rgba(74,184,112,.1);border:1px solid rgba(74,184,112,.3);border-radius:12px;color:var(--g4);font-size:13px;font-weight:700;cursor:pointer" onclick="printMonitorResults()">🖨️ Imprimer</button>
      <button style="flex:1;min-width:140px;padding:12px;background:rgba(32,96,200,.1);border:1px solid rgba(32,96,200,.3);border-radius:12px;color:#7ab8f5;font-size:13px;font-weight:700;cursor:pointer" onclick="exportMonitorCSV()">📥 Exporter CSV</button>
      <button style="flex:1;min-width:140px;padding:12px;background:rgba(74,184,112,.15);border:1px solid rgba(74,184,112,.2);border-radius:12px;color:var(--g4);font-size:13px;font-weight:700;cursor:pointer" onclick="renderMultiTab()">← Nouvelle session</button>
    </div>`;
}
async function joinSession(){
  const codeInput = document.getElementById('join-code-input');
  const joinBtn = document.getElementById('join-btn');
  const code = (codeInput?.value||'').trim();
  if(code.length!==4){ codeInput.style.borderColor='#ff7070'; return; }
  if(!cloudOk){ alert('⚠️ Connexion internet requise pour rejoindre une session.'); return; }
  codeInput.style.borderColor='';
  if(joinBtn){ joinBtn.disabled=true; joinBtn.innerHTML='<span class="spinner" style="width:14px;height:14px;border-width:2px;vertical-align:middle"></span>'; }
  try{
    const rows = await sbGet('floralab_sessions',`code=eq.${code}&select=*`);
    if(!rows.length){ alert('❌ Code invalide ou session inexistante.'); codeInput.style.borderColor='#ff7070'; if(joinBtn){joinBtn.disabled=false;joinBtn.innerHTML='→';} return; }
    const session = rows[0];
    if(session.status==='ended'){ alert('⏹ Cette session est terminée.'); if(joinBtn){joinBtn.disabled=false;joinBtn.innerHTML='→';} return; }
    // Demander le prénom
    if(joinBtn){joinBtn.disabled=false;joinBtn.innerHTML='→';}
    showJoinNamePrompt(code, session);
  } catch(e){ alert('Erreur de connexion : '+e.message); if(joinBtn){joinBtn.disabled=false;joinBtn.innerHTML='→';} }
}
async function showJoinNamePrompt(code, session){
  const root = document.getElementById('overlay-root');
  root.innerHTML=`
    <div class="form-bg" onclick="if(event.target===this)this.innerHTML=''">
      <div class="form-card" style="max-width:400px">
        <div class="form-title">🎮 Rejoindre la session ${code}</div>
        <div style="font-size:13px;color:rgba(200,223,204,.4);margin-bottom:20px">
          Niv.${session.level} · ${session.questions?.length||20} questions
        </div>
        <div style="margin-bottom:12px">
          <label class="fl">Votre prénom</label>
          <input class="fi" id="join-name-input" placeholder="Prénom…" maxlength="20" autocomplete="off"/>
        </div>
        <div style="margin-bottom:16px">
          <label class="fl">2 premières lettres du nom de famille</label>
          <input class="fi" id="join-init-input" placeholder="AB" maxlength="2" style="text-transform:uppercase"/>
        </div>
        <div style="display:flex;gap:10px">
          <button class="cancel-btn" onclick="document.getElementById('overlay-root').innerHTML=''">Annuler</button>
          <button class="save-btn" onclick="confirmJoinSession('${code}')">Rejoindre ▶</button>
        </div>
      </div>
    </div>`;
  setTimeout(()=>{ const el=document.getElementById('join-name-input'); if(el)el.focus(); },100);
}
async function confirmJoinSession(code){
  const nameEl = document.getElementById('join-name-input');
  const initEl = document.getElementById('join-init-input');
  const name = (nameEl?.value||'').trim();
  const init = (initEl?.value||'').toUpperCase().replace(/[^A-Z]/g,'');
  if(!name){ nameEl.style.borderColor='#ff7070'; return; }
  if(init.length<2){ initEl.style.borderColor='#ff7070'; return; }
  const fullName = name.charAt(0).toUpperCase()+name.slice(1).toLowerCase()+' '+init+'.';
  document.getElementById('overlay-root').innerHTML='';
  // Récupérer les questions de la session
  try{
    const rows = await sbGet('floralab_sessions',`code=eq.${code}&select=*`);
    if(!rows.length){ alert('Session introuvable.'); return; }
    const session = rows[0];
    if(session.status==='ended'){ alert('Cette session est déjà terminée.'); return; }
    // Enregistrer le joueur
    await sbPost('floralab_session_players',{
      session_code:code, player_name:fullName,
      score:0, total:0, current_q:0, done:false
    },'return=minimal');
    // Si session en attente, attendre le démarrage
    if(session.status==='waiting'){
      showSessionWaitRoom(code, fullName, session.questions);
    } else {
      startSessionQuiz(code, fullName, session.questions, session.level);
    }
  } catch(e){ alert('Erreur : '+e.message); }
}
async function showSessionWaitRoom(code, playerName, questions){
  const c = document.getElementById('quiz-container');
  showPage('quiz'); // aller sur la page quiz
  c.innerHTML=`
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:56px;margin-bottom:16px">⏳</div>
      <div style="font-family:var(--disp);font-size:24px;font-weight:900;color:var(--cr);margin-bottom:8px">Salle d'attente</div>
      <div style="font-size:14px;color:rgba(200,223,204,.5);margin-bottom:24px">Session <strong style="color:var(--g4)">${code}</strong> · En attente du formateur…</div>
      <div style="background:rgba(74,184,112,.06);border:1px solid rgba(74,184,112,.15);border-radius:16px;padding:20px;margin-bottom:24px">
        <div style="font-size:13px;color:rgba(200,223,204,.4);margin-bottom:4px">Vous participez en tant que</div>
        <div style="font-size:20px;font-weight:700;color:var(--cr)">${playerName}</div>
      </div>
      <div id="waitroom-status" style="font-size:13px;color:rgba(200,223,204,.35)">Le quiz démarrera dès que le formateur appuiera sur Démarrer</div>
    </div>`;
  // Poll pour détecter le démarrage
  if(sessionPollI) clearInterval(sessionPollI);
  sessionPollI = setInterval(async ()=>{
    try{
      const rows = await sbGet('floralab_sessions',`code=eq.${code}&select=status`);
      if(!rows.length||rows[0].status==='ended'){ clearInterval(sessionPollI); c.innerHTML=`<div style="text-align:center;padding:40px">Session terminée.</div>`; return; }
      if(rows[0].status==='playing'){
        clearInterval(sessionPollI);
        startSessionQuiz(code, playerName, questions, null);
      }
    } catch(e){}
  }, 2000);
}
function startSessionQuiz(code, playerName, questions, level){
  cqLog('startSessionQuiz — code:', code, '| joueur:', playerName, '| questions:', questions.length);
  sessionPlayerName = playerName;
  sessionQIdx = 0;
  sessionQuestions = questions;
  sessionScore = {ok:0, total:0};
  const c = document.getElementById('quiz-container');
  showPage('quiz');
  renderSessionQuestion(code);
}
async function renderSessionQuestion(code){
  const c = document.getElementById('quiz-container');
  if(sessionQIdx >= sessionQuestions.length){
    renderSessionEnd(code); return;
  }
  const q = sessionQuestions[sessionQIdx];
  const isPhoto = q.type==='photo' || q.type==='dictee';
  const isDictee = q.type==='dictee';
  // Carrousel photos session (1 ou 2 photos) identique au quiz solo
  var photoHtml = '';
  if(q.plantPhoto && (isPhoto||isDictee)){
    const has2sess = q.plantPhoto && q.plantPhoto2;
    const slide1sess = `<div class="qphoto-slide"><img src="${q.plantPhoto}" class="qphoto" onerror="this.style.display='none'" loading="lazy"/></div>`;
    const slide2sess = has2sess ? `<div class="qphoto-slide"><img src="${q.plantPhoto2}" class="qphoto" onerror="this.style.display='none'" loading="lazy"/></div>` : '';
    const dotssess = has2sess ? `<div class="qphoto-dots"><span class="qphoto-dot active" onclick="goSlide(0)"></span><span class="qphoto-dot" onclick="goSlide(1)"></span></div>` : '';
    photoHtml = `<div class="qphotos"><div class="qphoto-carousel" id="qpc-sess">`
      +`<div class="qphoto-track">${slide1sess}${slide2sess}</div>`
      +`</div>${dotssess}</div>`;
  }
  // Dictée multi : champ texte
  const opts = isDictee
    ? (`<div class="dictee-wrap">`
      +`<input id="dictee-input" class="dictee-input" type="text" placeholder="Genre espèce…"
       autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
       style="font-style:italic;font-family:'Playfair Display',serif"
       onkeydown="if(event.key==='Enter')submitSessionDictee('${code}')"/>`
      +`<button class="dictee-btn" onclick="submitSessionDictee('${code}')">→</button>`
      +`</div>`)
    : q.options.map(o=>`
    <button class="qopt" onclick="pickSessionAnswer(this,'${o.replace(/'/g,"\\'")}','${code}')">
      ${isPhoto?`<span class="opt-latin">${o}</span>`:o}
    </button>`).join('');

  c.innerHTML=`
    <div class="session-quiz-wrap">
      <div class="session-live-bar">
        <div class="session-live-bar-row">
          <span><span class="session-live-dot"></span> Session <strong style="color:var(--g4)">${code}</strong></span>
          <span class="session-q-counter">Q${sessionQIdx+1} / ${sessionQuestions.length}</span>
          <span style="color:rgba(200,223,204,.45);font-size:11px">${sessionPlayerName}</span>
        </div>
        <div class="session-q-progress">
          <div class="session-q-progress-fill" style="width:${Math.round((sessionQIdx+1)/sessionQuestions.length*100)}%"></div>
        </div>
      </div>
      <div class="qcard">
        ${isPhoto ? photoHtml : ''}
        <div class="qbody">
          ${timerHTML(sessionQIdx+1, sessionQuestions.length)}
          <div class="phase-label">${isDictee?'✏️ Dictée botanique':isPhoto?'📸 Identification':'🧠 Connaissance'}</div>
          <div class="q-text">${q.question}</div>
          <div class="q-opts">${opts}</div>
        </div>
      </div>
      <div class="session-mini-lb" id="session-lb"></div>
    </div>`;
  startTimer(()=>onSessionTimeout(code), isDictee?60:TIMER_SEC);
  pollSessionLb(code);
  if(isDictee) setTimeout(()=>{ var el=document.getElementById('dictee-input'); if(el)el.focus(); },150);
  setTimeout(initCarousel, 50);
}
async function pickSessionAnswer(btn, answer, code){
  cqLog('pickSessionAnswer — Q:', sessionQIdx+1, '| réponse:', answer);
  if(btn.disabled) return;
  stopTimer();
  const q = sessionQuestions[sessionQIdx];
  const ok = answer === q.correct;
  if(ok) sessionScore.ok++; sessionScore.total++;
  // Marquer visuellement
  document.querySelectorAll('.qopt').forEach(b=>{ b.disabled=true; if(b.textContent.trim()===q.correct) b.classList.add('correct'); else if(b===btn&&!ok) b.classList.add('wrong'); });
  // Mettre à jour score dans Supabase
  sessionQIdx++;
  try{ await sbPatch('floralab_session_players','session_code=eq.'+code+'&player_name=eq.'+encodeURIComponent(sessionPlayerName),{score:sessionScore.ok,total:sessionScore.total,current_q:sessionQIdx,done:sessionQIdx>=sessionQuestions.length,updated_at:new Date().toISOString()}); }catch(e){ cqErr('PATCH score failed:',e); }
  // Bouton suivant
  const nextBtn = document.createElement('button');
  nextBtn.className='next-btn'; nextBtn.textContent = sessionQIdx>=sessionQuestions.length ? 'Voir les résultats →' : 'Question suivante →';
  nextBtn.onclick = ()=>renderSessionQuestion(code);
  document.querySelector('.qbody').appendChild(nextBtn);
}
async function submitSessionDictee(code){
  var inp = document.getElementById('dictee-input');
  if(!inp) return;
  var val = inp.value.trim();
  if(!val) return;
  inp.disabled = true;
  document.querySelector('.dictee-btn') && (document.querySelector('.dictee-btn').disabled=true);
  stopTimer();
  const q = sessionQuestions[sessionQIdx];
  const chk = checkLatinDictee(val, q.correct);
  const pts = dicteePoints(chk.correct, chk.badFormat, sessionLevel||1);
  const ok = chk.correct;
  sessionScore.ok += pts;
  sessionScore.total++;
  sessionQIdx++;
  // Feedback visuel
  const wrap = document.querySelector('.dictee-wrap');
  if(wrap){
    const fb = document.createElement('div');
    fb.className = 'k-feedback '+(ok?'ok':'ko');
    let fbHtml = ok && !chk.badFormat
      ? '✅ Exact ! <em>'+q.correct+'</em>'
      : ok && chk.badFormat
        ? '⚠️ Bonne réponse, mais écriture incorrecte !<br><small style="opacity:.7">'+chk.formatMsg+'</small><br><em>'+q.correct+'</em> (' +(pts===0.5?'+0,5 pt':'0 pt')+')'
        : '❌ La réponse était : <em style="color:var(--g4)">'+q.correct+'</em>'+(chk.badFormat?'<br><small style="opacity:.6">'+chk.formatMsg+'</small>':'');
    fb.innerHTML = fbHtml;
    wrap.parentNode.insertBefore(fb, wrap.nextSibling);
  }
  // Bouton suivant
  const nextBtn = document.createElement('button');
  nextBtn.className='next-btn';
  nextBtn.textContent = sessionQIdx>=sessionQuestions.length ? 'Voir les résultats →' : 'Question suivante →';
  nextBtn.onclick = ()=>renderSessionQuestion(code);
  const body = document.querySelector('.qbody');
  if(body) body.appendChild(nextBtn);
  try{ await sbPatch('floralab_session_players','session_code=eq.'+code+'&player_name=eq.'+encodeURIComponent(sessionPlayerName),
    {score:sessionScore.ok,total:sessionScore.total,current_q:sessionQIdx,done:sessionQIdx>=sessionQuestions.length});
  }catch(e){ cqErr('PATCH dictee score failed:',e); }
}


async function onSessionTimeout(code){
  stopTimer(); sessionScore.total++; sessionQIdx++;
  try{ await sbPatch('floralab_session_players','session_code=eq.'+code+'&player_name=eq.'+encodeURIComponent(sessionPlayerName),{score:sessionScore.ok,total:sessionScore.total,current_q:sessionQIdx,done:sessionQIdx>=sessionQuestions.length,updated_at:new Date().toISOString()}); }catch(e){}
  renderSessionQuestion(code);
}
async function pollSessionLb(code){
  try{
    const rows = await sbGet('floralab_session_players',`session_code=eq.${code}&select=*&order=score.desc&limit=5`);
    const lb = document.getElementById('session-lb');
    if(!lb) return;
    lb.innerHTML = rows.map((r,i)=>`
      <div class="session-mini-row ${r.player_name===sessionPlayerName?'me':''}">
        <span class="session-mini-rank">${i+1}</span>
        <span class="session-mini-name">${r.player_name}</span>
        <span class="session-mini-score">✅${r.score||0}</span>
        <span class="session-mini-prog">Q${r.done?(r.current_q||0):(r.current_q||0)+1}/${sessionQuestions.length||20}</span>
      </div>`).join('');
  } catch(e){}
}
async function renderSessionEnd(code){
  stopTimer();
  if(sessionPollI){clearInterval(sessionPollI);sessionPollI=null;}
  const c = document.getElementById('quiz-container');
  // Afficher d'abord le score perso immédiatement
  const pct = sessionScore.total ? Math.round(sessionScore.ok/sessionScore.total*100) : 0;
  c.innerHTML='<div style="text-align:center;padding:40px"><div style="font-size:40px">⏳</div><div style="color:rgba(200,223,204,.5);margin-top:12px">Chargement des résultats…</div></div>';
  // Récupérer le classement
  sessionCurrentCode = code;
  try{ sessionFinalRows = await sbGet('floralab_session_players','session_code=eq.'+code+'&select=*&order=score.desc'); }
  catch(e){ sessionFinalRows=[]; console.error('[CQ] renderSessionEnd sbGet error:',e); }
  const rows = sessionFinalRows;
  const myRank = rows.findIndex(function(r){return r.player_name===sessionPlayerName;})+1;
  // Construire la liste sans template literals imbriqués
  var listHtml = '';
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'.';
    var rpct = r.total ? Math.round((r.score||0)/r.total*100) : 0;
    var isMe = r.player_name===sessionPlayerName;
    listHtml += '<div class="session-player-row" style="'+(isMe?'background:rgba(74,184,112,.12);border-color:rgba(74,184,112,.3)':'')+'">'
      +'<span style="width:28px;font-size:18px">'+medal+'</span>'
      +'<span class="session-player-name">'+r.player_name+(isMe?' 👈':'')+'</span>'
      +'<span class="session-player-score">✅ '+(r.score||0)+'/'+(r.total||0)+'</span>'
      +'<span style="font-size:12px;color:rgba(200,223,204,.4)">'+rpct+'%</span>'
      +'</div>';
  }
  var rankMedal = myRank===1?'🥇':myRank===2?'🥈':myRank===3?'🥉':'🏅';
  c.innerHTML = '<div style="text-align:center;padding:20px 0">'
    +'<div style="font-size:56px;margin-bottom:12px">'+rankMedal+'</div>'
    +'<div style="font-family:var(--disp);font-size:26px;font-weight:900;color:var(--cr);margin-bottom:4px">'+sessionPlayerName+'</div>'
    +'<div style="font-size:15px;color:rgba(200,223,204,.5);margin-bottom:20px">✅ '+sessionScore.ok+'/'+sessionScore.total+' · '+pct+'%</div>'
    +'<div style="font-size:13px;color:rgba(200,223,204,.35);margin-bottom:16px">🏆 Classement final — Session '+code+'</div>'
    +'<div class="session-players-list" style="max-height:none">'+listHtml+'</div>'
    +'<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;justify-content:center">'
    +'<button style="flex:1;min-width:140px;padding:12px 18px;background:rgba(74,184,112,.1);border:1px solid rgba(74,184,112,.3);border-radius:12px;color:var(--g4);font-size:13px;font-weight:700;cursor:pointer" onclick="printPlayerResults()">🖨️ Imprimer</button>'
    +'<button style="flex:1;min-width:140px;padding:12px 18px;background:rgba(32,96,200,.1);border:1px solid rgba(32,96,200,.35);border-radius:12px;color:#7ab8f5;font-size:13px;font-weight:700;cursor:pointer" onclick="exportPlayerCSV()">📥 Exporter CSV</button>'
    +'<button style="flex:1;min-width:140px;padding:12px 18px;background:rgba(74,184,112,.1);border:1px solid rgba(74,184,112,.3);border-radius:12px;color:var(--g4);font-size:14px;font-weight:700;cursor:pointer" onclick="goHome()">← Accueil</button>'
    +'</div>'
    +'</div>';
}

function printSessionResults(code, rows, isAdmin){
  const date = new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
  const title = 'ChloroQuiz — Session '+code+' · '+date;
  var tableRows = '';
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
    var pct = r.total ? Math.round((r.score||0)/r.total*100) : 0;
    var col = pct>=80?'#2d7a4a':pct>=50?'#e67e22':'#c0392b';
    tableRows += '<tr'+(i%2===0?'':' style="background:#f9f9f9"')+'>'
      +'<td style="text-align:center;font-size:16px">'+(medal||i+1)+'</td>'
      +'<td><strong>'+r.player_name+'</strong></td>'
      +'<td style="text-align:center">'+(r.score||0)+' / '+(r.total||0)+'</td>'
      +'<td style="text-align:center"><strong style="color:'+col+'">'+pct+'%</strong></td>'
      +'<td style="text-align:center">'+(r.done?'✅ Terminé':'⏳ En cours')+'</td>'
      +'</tr>';
  }
  const html = '<!DOCTYPE html><html lang="fr"><head>'
    +'<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>'
    +'<title>'+title+'</title>'
    +'<style>body{font-family:Arial,sans-serif;padding:20px;color:#1a1a1a;font-size:13px;max-width:800px;margin:0 auto}'
    +'h1{font-size:20px;margin-bottom:4px;color:#1a3d20}'
    +'.meta{color:#666;font-size:12px;margin-bottom:20px;border-bottom:2px solid #e8f5e9;padding-bottom:10px}'
    +'table{width:100%;border-collapse:collapse;font-size:13px}'
    +'th{background:#e8f5e9;padding:8px;text-align:left;border:1px solid #ccc;font-size:11px;text-transform:uppercase}'
    +'td{padding:7px 8px;border:1px solid #ddd;vertical-align:middle}'
    +'.footer{margin-top:20px;font-size:11px;color:#999;text-align:center;border-top:1px solid #eee;padding-top:10px}'
    +'.print-btn{margin-top:16px;padding:10px 20px;background:#2d7a4a;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;display:block;width:100%}'
    +'@media print{.print-btn{display:none}}#player-name-input::placeholder,#player-initial-input::placeholder{color:rgba(200,223,204,.55)}.dictee-wrap{display:flex;gap:8px;margin-bottom:8px}.dictee-input{flex:1;padding:14px 16px;background:rgba(19,48,29,.7);border:1px solid rgba(74,184,112,.3);border-radius:13px;color:var(--cr);font-size:20px;outline:none;transition:border-color .3s;min-height:52px}.dictee-input:focus{border-color:var(--g4)}.dictee-btn{padding:14px 20px;background:var(--g3);border:none;border-radius:13px;color:white;font-size:20px;cursor:pointer;transition:background .2s;min-height:52px}.dictee-btn:hover{background:var(--g4)}.monitor-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.mon-row{display:grid;grid-template-columns:36px 1fr auto auto;grid-template-rows:auto auto;align-items:center;gap:0 10px;background:rgba(19,48,29,.5);border:1px solid rgba(74,184,112,.12);border-radius:12px;padding:10px 14px;margin-bottom:7px;transition:border-color .3s}.mon-row.mon-done{border-color:rgba(74,184,112,.3);background:rgba(19,48,29,.8)}.mon-rank{grid-column:1;grid-row:1/3;text-align:center;font-size:18px;align-self:center}.mon-info{grid-column:2;grid-row:1}.mon-name{font-weight:700;font-size:14px;color:var(--cr);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}.mon-bar-wrap{height:4px;background:rgba(74,184,112,.12);border-radius:4px;overflow:hidden;margin-top:3px}.mon-bar{height:100%;border-radius:4px;transition:width .5s}.mon-right{grid-column:3;grid-row:1;text-align:right;white-space:nowrap}.mon-score{font-family:var(--disp);font-size:18px;font-weight:700;color:var(--am2);line-height:1}.mon-q{font-size:10px;color:rgba(200,223,204,.45);margin-top:1px}.mon-activity{grid-column:2/5;grid-row:2;padding-top:5px;margin-top:4px;border-top:1px solid rgba(74,184,112,.07)}.mon-status{font-size:11px;padding:3px 9px;border-radius:20px;display:inline-block}.mon-status.done{background:rgba(74,184,112,.15);color:var(--g4)}.mon-status.ok{background:rgba(74,184,112,.1);color:var(--g4)}.mon-status.ko{background:rgba(255,80,80,.1);color:#ff9999}.mon-status.wait{background:rgba(200,223,204,.06);color:rgba(200,223,204,.35)}.mon-btn{flex:1;min-width:100px;padding:11px;border-radius:11px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid;font-family:var(--body)}.mon-btn.grn{background:rgba(74,184,112,.1);border-color:rgba(74,184,112,.3);color:var(--g4)}.mon-btn.blu{background:rgba(32,96,200,.1);border-color:rgba(32,96,200,.3);color:#7ab8f5}.mon-btn.red{background:rgba(255,80,80,.1);border-color:rgba(255,80,80,.25);color:#ff8080}.dictee-toggle-wrap{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:10px;padding:8px 14px;background:rgba(19,48,29,.4);border-radius:12px;border:1px solid rgba(74,184,112,.15)}.dictee-toggle-label{font-size:13px;color:rgba(200,223,204,.85);cursor:pointer}@media(max-width:640px){.modal{max-height:94vh}.modal-bg{padding:6px}}@media(min-width:641px){.minfo-lbl{font-size:11px}.minfo-val{font-size:14px}.modal-latin{font-size:28px}.modal-common{font-size:14px}.modal-famille{font-size:12px}}</style></head><body>'
    +'<h1>🌿 ChloroQuiz — Résultats de session</h1>'
    +'<div class="meta">Code : <strong>'+code+'</strong> &nbsp;·&nbsp; Date : <strong>'+date+'</strong> &nbsp;·&nbsp; '+rows.length+' participant(s)</div>'
    +'<table><thead><tr>'
    +'<th style="width:40px">Rang</th><th>Participant</th>'
    +'<th style="width:100px;text-align:center">Score</th>'
    +'<th style="width:80px;text-align:center">Réussite</th>'
    +'<th style="width:90px;text-align:center">Statut</th>'
    +'</tr></thead><tbody>'+tableRows+'</tbody></table>'
    +'<div class="footer">ChloroQuiz · Formation aménagement paysager · '+date+'</div>'
    +'<button class="print-btn" onclick="window.print()">🖨️ Imprimer cette page</button>'
    +'</body></html>';
  // Blob URL — fonctionne sur mobile (pas de popup bloqué)
  try{
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  } catch(e){
    // Fallback : window.open
    const win = window.open('','_blank');
    if(win){ win.document.write(html); win.document.close(); }
    else { alert('Activez les popups pour imprimer, ou utilisez le bouton Exporter CSV.'); }
  }
}

// Export CSV classement
function exportSessionCSV(code, rows){
  const date = new Date().toLocaleDateString('fr-FR');
  let csv = '\uFEFF'; // BOM UTF-8 pour Excel
  csv += 'Rang;Participant;Score;Total;Reussite %;Statut\r\n';
  rows.forEach((r,i)=>{
    const pct = r.total ? Math.round((r.score||0)/r.total*100) : 0;
    csv += `${i+1};"${r.player_name}";${r.score||0};${r.total||0};${pct}%;${r.done?'Termin\u00e9':'En cours'}\r\n`;
  });
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ChloroQuiz_Session_${code}_${date.replace(/\//g,'-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Version admin depuis le moniteur (utilise sessionPlayers en mémoire)
function printMonitorResults(){
  printSessionResults(multiSessionCode||'—', sessionPlayers, true);
}
function exportMonitorCSV(){
  exportSessionCSV(multiSessionCode||'—', sessionPlayers);
}
// Impression/Export côté joueur (utilisent sessionFinalRows et sessionCurrentCode)
function goHome(){ showPage('home'); }
function printPlayerResults(){ printSessionResults(sessionCurrentCode, sessionFinalRows, false); }
function exportPlayerCSV(){ exportSessionCSV(sessionCurrentCode, sessionFinalRows); }
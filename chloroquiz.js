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
var TAILLES_CM = (()=>{
  const t=['<1 cm'];
  for(let i=1;i<=40;i++) t.push(i+' cm');
  t.push('>40 cm');
  return t;
})();
var TAILLES_PETIOLE = (()=>{
  const t=['Sessile'];
  for(let lo=2;lo<=58;lo+=2) t.push(lo+'\u2013'+(lo+2)+' mm');
  t.push('>60 mm');
  return t;
})();
var cmPickers={}, ptPickers={};
var COULEURS_LIMBE=[
  {nom:'Vert clair',css:'#a8d878'},{nom:'Vert moyen',css:'#5a9e3a'},{nom:'Vert foncé',css:'#2d6020'},
  {nom:'Vert glauque',css:'#7aad8c'},{nom:'Vert bleuté',css:'#5a8c78'},{nom:'Vert olive',css:'#7a8830'},
  {nom:'Vert bronzé',css:'#6a7040'},{nom:'Vert luisant',css:'#3a8a20'},{nom:'Jaune-vert',css:'#c8d840'},
  {nom:'Jaune',css:'#e8d060'},{nom:'Gris-vert',css:'#8aaa88'},{nom:'Argenté',css:'#b0baba'},
  {nom:'Rouge / Bordeaux',css:'#8a2030'},{nom:'Pourpre',css:'#5a2068'},{nom:'Bronze / Cuivré',css:'#9a5830'},
  {nom:'Brun',css:'#7a4820'},
  {nom:'Panaché crème',css:'linear-gradient(135deg,#5a9e3a 50%,#f5f0d8 50%)'},
  {nom:'Panaché jaune',css:'linear-gradient(135deg,#5a9e3a 50%,#d8e060 50%)'},
];
var COULEURS_PETIOLE=[
  {nom:'Vert',css:'#5a9e3a'},{nom:'Vert clair',css:'#9acc70'},
  {nom:'Rouge',css:'#cc2828'},{nom:'Rouge foncé',css:'#8a1818'},{nom:'Rosé',css:'#e88888'},
  {nom:'Bordeaux',css:'#722f37'},{nom:'Pourpre',css:'#6a2060'},{nom:'Jaune',css:'#d8c840'},
  {nom:'Brun',css:'#8a5828'},{nom:'Gris',css:'#888890'},{nom:'Noir',css:'#303038'},
];
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
const SK_GLOSS    = 'cq_glossaire';
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
create table if not exists floralab_abandoned (
  id bigserial primary key,
  name text, level integer, ok integer,
  total integer, pct integer, elapsed integer, date bigint, abandoned boolean default true
);
alter table floralab_data enable row level security;
alter table floralab_scores enable row level security;
alter table floralab_abandoned enable row level security;
create policy "public_all_data" on floralab_data
  for all using (true) with check (true);
create policy "public_all_scores" on floralab_scores
  for all using (true) with check (true);
create policy "public_all_abandoned" on floralab_abandoned
  for all using (true) with check (true);

-- Ajouter la colonne last_activity (a executer une seule fois dans Supabase) :
-- alter table floralab_session_players add column if not exists last_activity text default null;`;

// ── NIVEAU DÉBUTANT (1) : critères de base ──
const KFIELDS_N1 = [
  {key:'type',             label:'Type de végétal',        q:n=>`Quel est le type de végétal de <em>${n}</em> ?`},
  {key:'feuillage',        label:'Type de feuillage',      q:n=>`Quel est le type de feuillage de <em>${n}</em> ?`},
  {key:'rusticite',        label:'Rusticité',              q:n=>`Résistance au gel de <em>${n}</em> ?`},
  {key:'exposition',       label:'Exposition',             q:n=>`Exposition idéale pour <em>${n}</em> ?`},
  {key:'hauteurAdulte',    label:'Hauteur adulte',         q:n=>`Hauteur adulte de <em>${n}</em> ?`},
  {key:'largeurAdulte',    label:'Largeur adulte',         q:n=>`Largeur adulte de <em>${n}</em> ?`},
  {key:'periodeFloraison', label:'Période de floraison',   q:n=>`Période de floraison de <em>${n}</em> ?`},
  {key:'couleurFleurs',    label:'Couleur des fleurs',     q:n=>`Couleur des fleurs de <em>${n}</em> ?`},
];
// ── NIVEAU INTERMÉDIAIRE (2) : N1 + critères milieu, entretien, usage ──
const KFIELDS_N2 = [...KFIELDS_N1,
  {key:'ph',               label:'pH du sol',              q:n=>`Quel est le pH idéal pour <em>${n}</em> ?`},
  {key:'humidite',         label:'Humidité du sol',        q:n=>`Humidité de sol idéale pour <em>${n}</em> ?`},
  {key:'structureSol',     label:'Structure du sol',       q:n=>`Quel type de sol convient à <em>${n}</em> ?`},
  {key:'port',             label:'Port / Silhouette',      q:n=>`Quel est le port de <em>${n}</em> ?`},
  {key:'vitesseCroissance',label:'Vitesse de croissance',  q:n=>`Vitesse de croissance de <em>${n}</em> ?`},
  {key:'typeTaille',       label:'Type de taille',         q:n=>`Quel type de taille pour <em>${n}</em> ?`},
  {key:'interetOrnemental',label:'Intérêt ornemental',     q:n=>`Quel est l'intérêt ornemental de <em>${n}</em> ?`},
  {key:'autresInterets',   label:'Autres intérêts',        q:n=>`Quel autre intérêt présente <em>${n}</em> ?`},
  {key:'usageAmenagement', label:'Usage aménagement',      q:n=>`Quel usage en aménagement pour <em>${n}</em> ?`},
];
// ── NIVEAU EXPERT (3) : N2 + famille + tous les critères avancés ──
const KFIELDS_N3 = [...KFIELDS_N2,
  {key:'famille',          label:'Famille botanique',      q:n=>`À quelle famille appartient <em>${n}</em> ?`},
  {key:'classe',           label:'Classe botanique',       q:n=>`À quelle classe appartient <em>${n}</em> ?`},
  {key:'couleurLimbe',     label:'Couleur du feuillage',   q:n=>`Quelle est la couleur du feuillage de <em>${n}</em> ?`},
  {key:'formeLimbe',       label:'Forme des feuilles',     q:n=>`Quelle est la forme des feuilles de <em>${n}</em> ?`},
  {key:'texture',          label:'Texture du feuillage',   q:n=>`Quelle est la texture du feuillage de <em>${n}</em> ?`},
  {key:'reproduction',     label:'Reproduction',           q:n=>`Quel est le mode de reproduction de <em>${n}</em> ?`},
  {key:'pollinisation',    label:'Pollinisation',          q:n=>`Comment est pollinisé <em>${n}</em> ?`},
  {key:'biodiversite',     label:'Biodiversité',           q:n=>`Quel intérêt biodiversité présente <em>${n}</em> ?`},
  {key:'particularites',   label:'Particularités',        q:n=>`Quelle est une particularité de <em>${n}</em> ?`},
  {key:'frequenceTaille',  label:'Fréquence de taille',   q:n=>`Quelle est la fréquence de taille de <em>${n}</em> ?`},
];
// KFIELDS_N2 as previously was — keep alias for any legacy reference
const KFIELDS_N2_legacy = KFIELDS_N2;

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
  // Templates existants adaptés (résistanceSech → humidite)
  {t:p=>`Vous aménagez une zone ${expoLabel(p.exposition)} avec un sol à pH <strong>${p.ph}</strong>. Quel végétal est le plus adapté ?`,                                                              f:['exposition','ph']},
  {t:p=>`Votre client souhaite une plante <strong>${p.feuillage}</strong> supportant <strong>${p.rusticite}</strong>. Quel végétal choisissez-vous ?`,                                                 f:['feuillage','rusticite']},
  {t:p=>`Pour une haie résistant à <strong>${p.rusticite}</strong>, ${expoLabel(p.exposition)}, en sol <strong>${p.ph}</strong>, quel végétal proposez-vous ?`,                                       f:['rusticite','exposition','ph']},
  {t:p=>`Un massif ${expoLabel(p.exposition)} nécessite une plante supportant une humidité <strong>${p.humidite}</strong> et un feuillage <strong>${p.feuillage}</strong>. Laquelle ?`,              f:['exposition','humidite','feuillage']},
  {t:p=>`Pour couvrir une surface ${expoLabel(p.exposition)}, avec une hauteur adulte de <strong>${p.hauteurAdulte}</strong> et un sol <strong>${p.ph}</strong>, quel végétal convient ?`,            f:['exposition','ph','hauteurAdulte']},
  {t:p=>`Votre client veut une floraison en <strong>${p.periodeFloraison}</strong>, ${expoLabel(p.exposition)}, sol <strong>${p.ph}</strong>. Quel végétal proposez-vous ?`,                         f:['periodeFloraison','exposition','ph']},
  {t:p=>`Pour une plantation supportant <strong>${p.rusticite}</strong> avec un sol <strong>${p.humidite}</strong>, quel végétal choisissez-vous ?`,                                                  f:['rusticite','humidite']},
  {t:p=>`Un espace ${expoLabel(p.exposition)} réclame un végétal de <strong>${p.hauteurAdulte}</strong> de hauteur adulte, à feuillage <strong>${p.feuillage}</strong>. Lequel ?`,                   f:['exposition','hauteurAdulte','feuillage']},
  // Nouveaux templates v17 — port, classe, sol, usage
  {t:p=>`Votre client cherche un végétal à port <strong>${p.port}</strong>, ${expoLabel(p.exposition)}, sol <strong>${p.structureSol}</strong>. Lequel proposez-vous ?`,                             f:['port','exposition','structureSol']},
  {t:p=>`Pour une haie, vous avez besoin d'un végétal à feuillage <strong>${p.feuillage}</strong> de hauteur <strong>${p.hauteurAdulte}</strong>, rustique à <strong>${p.rusticite}</strong>. Lequel ?`, f:['feuillage','hauteurAdulte','rusticite']},
  {t:p=>`Votre chantier est en sol <strong>${p.humidite}</strong>, exposition ${expoLabel(p.exposition)}, pH <strong>${p.ph}</strong>. Quel végétal conseillez-vous ?`,                               f:['humidite','exposition','ph']},
  {t:p=>`Un client veut un végétal avec un usage <em>${p.usageAmenagement&&p.usageAmenagement.split(',')[0].trim()}</em>, rustique à <strong>${p.rusticite}</strong>. Lequel ?`,                     f:['rusticite','usageAmenagement']},
  {t:p=>`Pour un massif ${expoLabel(p.exposition)} en sol <strong>${p.humidite}</strong>, avec une floraison <strong>${p.couleurFleurs||'décorative'}</strong>. Quel végétal ?`,                     f:['exposition','humidite','couleurFleurs']},
  {t:p=>`Votre client souhaite un végétal de port <strong>${p.port}</strong> à feuillage <strong>${p.feuillage}</strong>, rustique à <strong>${p.rusticite}</strong>. Lequel ?`,                      f:['port','feuillage','rusticite']},
  {t:p=>`Pour une zone ${expoLabel(p.exposition)} avec sol <strong>${p.structureSol}</strong> et <strong>${p.humidite}</strong>, quel végétal est adapté ?`,                                          f:['exposition','structureSol','humidite']},
  {t:p=>`Ce végétal a un port <strong>${p.port}</strong>, une hauteur de <strong>${p.hauteurAdulte}</strong> et fleurit en <strong>${p.periodeFloraison}</strong>. Lequel est-ce ?`,                  f:['port','hauteurAdulte','periodeFloraison']},
];

const TYPE_OPTIONS = [
  'Annuelle','Bisannuelle','Vivace','Bulbeuse',
  'Graminée ornementale','Fougère','Bambou',
  'Sous-arbrisseau','Arbrisseau','Arbuste','Rosier',
  'Arbre','Arbre fruitier','Conifère',
  'Liane / Grimpante','Couvre-sol',
  'Aquatique / Berge','Plante aromatique',
  'Spontanée','Indigène','Horticole',
];
const FILLERS_FAMILLE = ['Rosaceae','Lamiaceae','Asteraceae','Poaceae','Cupressaceae','Betulaceae',
  'Buxaceae','Araliaceae','Asparagaceae','Oleaceae','Pinaceae','Fabaceae','Solanaceae','Ranunculaceae'];
const FILLERS = {
  feuillage:['Caduc','Persistant','Marcescent','Semi-persistant'],
  rusticite:['< -30°C','-30 / -25°C','-25 / -20°C','-20 / -15°C','-10°C','0°C'],
  exposition:['Ombre','Mi-ombre','Soleil','Ombre – Mi-ombre','Mi-ombre – Soleil','Ombre – Mi-ombre – Soleil'],
  ph:['Acide','Neutre','Basique','Acide à neutre','Neutre à basique','Acide à basique'],
  humidite:['Sec','Frais','Humide','Détrempé / Aquatique'],
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
  {key:'photo',            label:'Reconnaissance',     icon:'📸', levels:[1,2,3,4]},
  {key:'dictee',           label:'Dictée botanique',   icon:'✏️', levels:[1,2,3,4]},
  {key:'feuillage',        label:'Feuillage',          icon:'🍃', levels:[1,2,3,4]},
  {key:'rusticite',        label:'Rusticité',          icon:'🌡️', levels:[1,2,3,4]},
  {key:'exposition',       label:'Exposition',         icon:'☀️', levels:[1,2,3,4]},
  {key:'ph',               label:'pH du sol',          icon:'🧪', levels:[1,2,3,4]},
  {key:'humidite',          label:'Humidité sol',        icon:'💧', levels:[1,2,3,4]},
  {key:'hauteurAdulte',    label:'Hauteur',            icon:'📏', levels:[1,2,3,4]},
  {key:'largeurAdulte',    label:'Largeur',            icon:'↔️', levels:[1,2,3,4]},
  {key:'periodeFloraison', label:'Floraison',          icon:'🌸', levels:[1,2,3,4]},
  {key:'couleurFleurs',    label:'Couleur fleurs',     icon:'🎨', levels:[1,2,3,4]},
  {key:'famille',          label:'Famille botanique',  icon:'🔬', levels:[2,3,4]},
  {key:'interetOrnemental',label:'Intérêt ornemental', icon:'🌿', levels:[2,3,4]},
  {key:'autresInterets',   label:'Autres intérêts',    icon:'⭐', levels:[2,3,4]},
  {key:'n3',               label:'Mise en situation',  icon:'🏗️', levels:[4]},
];


const DEFAULT_PLANTS = [
  {id:1,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lavandula_angustifolia_in_Murato.jpg/480px-Lavandula_angustifolia_in_Murato.jpg',latin:'Lavandula angustifolia',nom:'Lavande officinale',famille:'Lamiaceae',type:'Sous-arbrisseau',feuillage:'Persistant',rusticite:'-25 / -20°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Élevée',hauteurAdulte:'0.3 – 0.6 m',largeurAdulte:'0.4 – 0.8 m',periodeFloraison:'Juin – Août',couleurFleurs:'Violet, Mauve',interetOrnemental:'Floraison décorative,Feuillage décoratif,Floraison parfumée',autresInterets:'Mellifère,Médicinale,Feuillage aromatique',usageAmenagement:'Massif,Bordure,Couvre-sol,Rocaille,Talus',description:"Plante aromatique méditerranéenne très appréciée pour ses fleurs parfumées et sa résistance à la sécheresse."},
  {id:2,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Buxus_sempervirens0.jpg/480px-Buxus_sempervirens0.jpg',latin:'Buxus sempervirens',nom:'Buis commun',famille:'Buxaceae',type:'Arbuste persistant',feuillage:'Persistant',rusticite:'-25 / -20°C',exposition:'Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'1 – 5 m',largeurAdulte:'1 – 3 m',periodeFloraison:'Mars – Avril',couleurFleurs:'Jaune-vert',interetOrnemental:'Feuillage persistant,Port architectural,Topiaire',autresInterets:'Toxique',usageAmenagement:'Haie taillée,Bordure,Topiaire,Massif',description:"Arbuste persistant classique de la topiaire et des jardins à la française."},
  {id:3,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rosa_canina_-_bloom_and_bud.jpg/480px-Rosa_canina_-_bloom_and_bud.jpg',latin:'Rosa canina',nom:'Rosier des haies',famille:'Rosaceae',type:'Arbuste caduc',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Soleil',ph:'Neutre',resistanceSech:'Modérée',hauteurAdulte:'1 – 3 m',largeurAdulte:'1 – 2 m',periodeFloraison:'Mai – Juillet',couleurFleurs:'Rose pâle, Blanc',interetOrnemental:'Floraison décorative,Fruits & baies décoratifs',autresInterets:'Mellifère,Plante hôte,Comestible / Fruitière',usageAmenagement:'Haie libre,Haie champêtre,Massif,Talus',description:"Rosier sauvage très rustique pour haies champêtres. Cynorrhodons décoratifs en automne."},
  {id:4,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carpinus_betulus_foliage.jpg/480px-Carpinus_betulus_foliage.jpg',latin:'Carpinus betulus',nom:'Charme commun',famille:'Betulaceae',type:'Arbre caduc',feuillage:'Marcescent',rusticite:'-30 / -25°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Faible',hauteurAdulte:'10 – 25 m',largeurAdulte:'8 – 15 m',periodeFloraison:'Mars – Avril',couleurFleurs:'Jaune-vert (chatons)',interetOrnemental:'Feuillage caduc coloré,Port architectural,Silhouette hivernale',autresInterets:'Plante hôte',usageAmenagement:'Haie taillée,Haie champêtre,Arbre isolé,Alignement',description:"Arbre de référence en haies taillées grâce à sa marcescence hivernale."},
  {id:5,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Hosta_sieboldiana.jpg/480px-Hosta_sieboldiana.jpg',latin:'Hosta sieboldiana',nom:'Hosta de Siebold',famille:'Asparagaceae',type:'Vivace',feuillage:'Caduc',rusticite:'-30 / -25°C',exposition:'Ombre – Mi-ombre',ph:'Neutre',resistanceSech:'Faible',hauteurAdulte:'0.6 – 0.9 m',largeurAdulte:'0.8 – 1.2 m',periodeFloraison:'Juillet – Août',couleurFleurs:'Blanc, Lavande',interetOrnemental:'Feuillage décoratif,Floraison décorative',autresInterets:'Plante hôte',usageAmenagement:'Massif,Bordure,Couvre-sol,Sous-bois',description:"Vivace indispensable pour les zones ombragées, grandes feuilles bleutées."},
  {id:6,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Phyllostachys_aurea_03.jpg/480px-Phyllostachys_aurea_03.jpg',latin:'Phyllostachys aurea',nom:'Bambou doré',famille:'Poaceae',type:'Graminée ligneuse persistante',feuillage:'Persistant',rusticite:'-20 / -15°C',exposition:'Mi-ombre – Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'3 – 8 m',largeurAdulte:'1 – 3 m',periodeFloraison:'Très rare',couleurFleurs:'Non significatives',interetOrnemental:'Feuillage persistant,Port architectural,Feuillage décoratif',autresInterets:'',usageAmenagement:'Massif,Brise-vent,Écran de verdure,Haie libre',description:"Bambou traçant à chaumes jaune-doré. Poser une barrière anti-rhizomes à la plantation."},
  {id:7,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Hedera_helix_-_1.jpg/480px-Hedera_helix_-_1.jpg',latin:'Hedera helix',nom:'Lierre grimpant',famille:'Araliaceae',type:'Liane persistante',feuillage:'Persistant',rusticite:'-25 / -20°C',exposition:'Ombre – Mi-ombre – Soleil',ph:'Neutre à basique',resistanceSech:'Modérée',hauteurAdulte:'20 – 30 m',largeurAdulte:'1 – 5 m',periodeFloraison:'Septembre – Octobre – Novembre',couleurFleurs:'Jaune-vert',interetOrnemental:'Feuillage persistant,Feuillage décoratif',autresInterets:'Mellifère,Plante hôte,Toxique',usageAmenagement:'Couvre-sol,Grimpante,Massif,Sous-bois',description:"Liane polyvalente pour murs, talus ombragés ou couvre-sol."},
  {id:8,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Thuja_occidentalis_foliage_and_cones.jpg/480px-Thuja_occidentalis_foliage_and_cones.jpg',latin:'Thuja occidentalis',nom:'Thuya occidental',famille:'Cupressaceae',type:'Conifère persistant',feuillage:'Persistant',rusticite:'< -30°C',exposition:'Soleil',ph:'Neutre à basique',resistanceSech:'Faible',hauteurAdulte:'3 – 15 m',largeurAdulte:'1 – 4 m',periodeFloraison:'Avril – Mai',couleurFleurs:'Jaune (discrètes)',interetOrnemental:'Feuillage persistant,Port architectural',autresInterets:'',usageAmenagement:'Haie taillée,Haie libre,Brise-vent,Massif',description:"Conifère de haie très répandu pour écrans végétaux persistants."},
  {id:9,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Achillea_millefolium_20070601.jpg/480px-Achillea_millefolium_20070601.jpg',latin:'Achillea millefolium',nom:'Achillée millefeuille',famille:'Asteraceae',type:'Vivace',feuillage:'Caduc',rusticite:'-25 / -20°C',exposition:'Soleil',ph:'Acide à neutre',resistanceSech:'Élevée',hauteurAdulte:'0.4 – 0.8 m',largeurAdulte:'0.3 – 0.6 m',periodeFloraison:'Juin – Juillet – Août – Septembre',couleurFleurs:'Blanc, Jaune, Rose, Rouge',interetOrnemental:'Floraison décorative,Feuillage décoratif',autresInterets:'Mellifère,Médicinale,Plante hôte',usageAmenagement:'Massif,Bordure,Prairie fleurie,Talus,Couvre-sol',description:"Vivace rustique, résistante à la sécheresse, idéale en prairie fleurie."},
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
  {id:30,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Agapanthus_africanus_flower.jpg/480px-Agapanthus_africanus_flower.jpg',latin:'Agapanthus africanus',nom:"Agapanthe d'Afrique",famille:'Agapanthaceae',type:'Vivace',feuillage:'Persistant',rusticite:'-8 / -5°C',exposition:'Soleil',ph:'Acide à neutre',resistanceSech:'Modérée',hauteurAdulte:'0,5 – 1 m (hampes)',largeurAdulte:'0,4 – 0,6 m',periodeFloraison:'Juillet – Septembre',couleurFleurs:'Bleu, Violet',interetOrnemental:'Floraison décorative,Feuillage persistant,Port architectural',autresInterets:'Mellifère',usageAmenagement:'Massif,Bac / Jardinière,Couvre-sol',description:"Vivace à grandes ombelles de fleurs bleu-violet sur hautes hampes florales. Touffe de feuilles arquées persistantes. L'espèce type est peu rustique : cultiver en bac dans les régions froides."},
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
let qFilter={feuillage:'',exposition:'',type:'',famille:'',classe:'',usage:'',couleur:'',taille:'',rusticite:''}; // révision ciblée
let qStreak=0; // série de bonnes réponses consécutives
let qStartTime=0; // horodatage démarrage du quiz
let qDicteeFormatMsg=null; // message format dictée
function hapticWrong(){ try{ if(navigator.vibrate) navigator.vibrate([120,60,80]); }catch(e){} }
// ── Normalisation nom latin : Genre Espèce (1re lettre Majuscule, reste minuscule) ──
function normalizeLatin(str){
  if(!str) return str;
  str = str.trim();
  // Réduire les espaces multiples sauf en fin de saisie (espace conservé pour continuer à taper)
  const trailingSpace = str.endsWith(' ');
  str = str.replace(/\s+/g,' ');
  const tokens = str.split(' ');
  let firstWordDone = false;
  const result = tokens.map(t=>{
    if(!t) return t;
    // Signe hybride
    if(t==='×' || t==='x' || t==='X') return '×';
    // Cultivar entre guillemets simples — conserver la casse originale
    if((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))){
      return t;
    }
    if(t.startsWith("'") || t.startsWith('"')) return t; // cultivar en cours de saisie
    if(!firstWordDone){
      firstWordDone = true;
      // Genre : 1re lettre maj, reste minuscule
      return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    }
    // Épithète, sous-espèce, variété, cultivar bare : minuscule
    return t.toLowerCase();
  }).join(' ');
  return result + (trailingSpace ? ' ' : '');
}

// ── Vérification écriture nom latin (dictée) ──
// Retourne {correct:bool, normalized:string, badFormat:bool, formatMsg:string}
function normalizeLatinForCompare(s){
  // Normalise × avec ou sans espaces : "Rosa xcanina" = "Rosa × canina" = "Rosa x canina"
  return s.toLowerCase()
    .replace(/\s*[x×]\s*/g,'×') // tout x/× avec ou sans espaces → × collé
    .replace(/\s+/g,' ').trim();
}
function checkLatinDictee(input, expected){
  const inp = input.trim();
  const norm = normalizeLatin(inp);
  // Comparaison tolérante × (espaces autour de x/× ignorés)
  const correct = normalizeLatinForCompare(norm) === normalizeLatinForCompare(expected);
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
const SK_INCOMPLETE='chloroquiz_incomplete_v1'; // quiz non terminés
const SK_OFFLINE_QUEUE='chloroquiz_offline_queue_v1';
const SK_SESSION    = 'chloroquiz_session';
const SK_QUIZ_STATE = 'chloroquiz_quiz_state';

// Form
let editingId=null, formPhotoB64=null, formPhoto2B64=null, formPhoto3B64=null, formPhoto4B64=null;

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
  const hdrs = {...sbHeaders(), 'Prefer':'return=minimal'};
  const r = await fetch(`${sbConf.url}/rest/v1/${table}?${params}`, {method:'DELETE', headers: hdrs});
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
  await loadGlossaire();
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
    if(role!=='admin'){ showPage('home'); return; }
    renderStats();
    // Polling auto toutes les 10s pour voir les nouveaux abandons en temps réel
    if(statsPollInterval) clearInterval(statsPollInterval);
    statsPollInterval = setInterval(()=>{
      if(cloudOk) renderStats();
    }, 10000);
  } else {
    // Quitter les stats : arrêter le polling
    if(statsPollInterval){ clearInterval(statsPollInterval); statsPollInterval=null; }
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
  // Valeurs uniques pour filtres révision ciblée
  const allFeuillages=[...new Set(plants.map(p=>p.feuillage).filter(Boolean))].sort();
  const allExpos=[...new Set(plants.map(p=>p.exposition).filter(Boolean))].sort();
  const allTypes=[...new Set(plants.map(p=>p.type).filter(Boolean))].sort();

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
      <div class="level-cards" style="grid-template-columns:1fr 1fr">
        <button class="level-card lv1 selected" id="lc-1" onclick="selectLevel(1)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Débutant</span>
          <span class="level-icon">🌱</span>
          <div class="level-title">Niveau 1</div>
          <div class="level-desc">Photo · type · feuillage · rusticité · expo · dimensions · floraison · couleur fleurs</div>
        </button>
        <button class="level-card lv2" id="lc-2" onclick="selectLevel(2)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Intermédiaire</span>
          <span class="level-icon">🎓</span>
          <div class="level-title">Niveau 2</div>
          <div class="level-desc">N1 + <strong style="color:rgba(200,223,204,.6)">sol · humidité · port · taille · usages · intérêts</strong></div>
        </button>
        <button class="level-card lv3" id="lc-3" onclick="selectLevel(3)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Expert</span>
          <span class="level-icon">🔬</span>
          <div class="level-title">Niveau 3</div>
          <div class="level-desc">N2 + <strong style="color:rgba(200,223,204,.6)">famille · classe · feuillage détaillé · biodiversité</strong></div>
        </button>
        <button class="level-card lv4" id="lc-4" onclick="selectLevel(4)">
          <span class="level-check">✓</span>
          <span class="level-badge-tag">Technique</span>
          <span class="level-icon">🏗️</span>
          <div class="level-title">Niveau 4</div>
          <div class="level-desc">Choisir le bon végétal selon <strong style="color:rgba(200,223,204,.6)">critères de chantier</strong></div>
        </button>
      </div>

      <div class="filter-section" style="margin-top:18px">
        <div class="filter-title">🔍 Révision ciblée</div>
        <div style="font-size:11px;color:rgba(200,223,204,.5);margin-bottom:10px">Sélectionne une catégorie pour filtrer les végétaux</div>
        <div id="filter-cats" style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:0">
          ${[
            {key:'feuillage',  label:'🍃 Feuillage'},
            {key:'exposition', label:'☀️ Exposition'},
            {key:'type',       label:'🌿 Type'},
            {key:'famille',    label:'🔬 Famille'},
            {key:'classe',     label:'🧬 Classe'},
            {key:'usage',      label:'🏡 Usage'},
            {key:'couleur',    label:'🎨 Couleur fleurs'},
            {key:'taille',     label:'📏 Dimensions'},
            {key:'rusticite',  label:'🌡️ Rusticité'},
          ].map(cat=>`
            <button id="fcat-${cat.key}" onclick="openFilterCat('${cat.key}')"
              style="padding:6px 13px;background:rgba(74,184,112,.08);border:1px solid rgba(74,184,112,.2);
                     border-radius:20px;color:rgba(200,223,204,.75);font-family:'DM Sans',sans-serif;
                     font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap"
              onmouseover="this.style.background='rgba(74,184,112,.18)'"
              onmouseout="if(!this.classList.contains('fcat-open'))this.style.background='rgba(74,184,112,.08)'">
              ${cat.label}${qFilter[cat.key]?` <span class="fcat-badge" style="background:var(--g4);color:#0b1e12;border-radius:10px;padding:1px 7px;font-size:10px;margin-left:4px">${qFilter[cat.key].split(',')[0].trim()}</span>`:''}
            </button>`).join('')}
          ${Object.values(qFilter).some(v=>v)?`<button onclick="clearAllFilters()"
            style="padding:6px 13px;background:rgba(255,100,100,.08);border:1px solid rgba(255,100,100,.2);
                   border-radius:20px;color:#ff9999;font-family:'DM Sans',sans-serif;font-size:11px;
                   font-weight:600;cursor:pointer;transition:all .2s"
            onmouseover="this.style.background='rgba(255,100,100,.18)'"
            onmouseout="this.style.background='rgba(255,100,100,.08)'">✕ Tout réinitialiser</button>`:''}
        </div>
        <div id="filter-chips-panel" style="margin-top:10px;display:none"></div>
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
  const group=el.parentElement.querySelectorAll('.fchip');
  group.forEach(ch=>ch.classList.remove('active'));
  el.classList.add('active');
  qFilter[field]=val;
  // Mettre à jour le badge sur le bouton catégorie
  const catBtn=document.getElementById('fcat-'+field);
  if(catBtn){
    const badge=catBtn.querySelector('.fcat-badge');
    if(val){
      if(badge) badge.textContent=val.split(',')[0].trim();
      else catBtn.insertAdjacentHTML('beforeend',`<span class="fcat-badge" style="background:var(--g4);color:#0b1e12;border-radius:10px;padding:1px 7px;font-size:10px;margin-left:4px">${val.split(',')[0].trim()}</span>`);
      catBtn.style.borderColor='var(--g4)';
      catBtn.style.color='var(--g4)';
    } else {
      if(badge) badge.remove();
      catBtn.style.borderColor='rgba(74,184,112,.2)';
      catBtn.style.color='rgba(200,223,204,.75)';
    }
  }
}

function openFilterCat(field){
  const panel=document.getElementById('filter-chips-panel');
  const catBtn=document.getElementById('fcat-'+field);
  if(!panel||!catBtn) return;
  // Toggle : si déjà ouvert pour ce field, fermer
  if(panel.dataset.openField===field && panel.style.display!=='none'){
    panel.style.display='none';
    panel.dataset.openField='';
    catBtn.classList.remove('fcat-open');
    catBtn.style.background='rgba(74,184,112,.08)';
    return;
  }
  // Fermer les autres boutons
  ['feuillage','exposition','type','famille','classe','usage','couleur','taille','rusticite'].forEach(k=>{
    const b=document.getElementById('fcat-'+k);
    if(b){ b.classList.remove('fcat-open'); b.style.background='rgba(74,184,112,.08)'; }
  });
  catBtn.classList.add('fcat-open');
  catBtn.style.background='rgba(74,184,112,.18)';
  panel.dataset.openField=field;
  // Construire les chips selon le field
  // Construire les valeurs selon la catégorie
  let vals=[], catLabel='', chipLabel=v=>v;
  if(field==='feuillage'){
    vals=[...new Set(plants.map(p=>p.feuillage).filter(Boolean))].sort();
    catLabel='Type de feuillage';
  } else if(field==='exposition'){
    vals=[...new Set(plants.map(p=>p.exposition).filter(Boolean))].sort();
    catLabel='Exposition';
  } else if(field==='type'){
    // flatten multi-value type
    vals=[...new Set(plants.flatMap(p=>(p.type||'').split(',').map(s=>s.trim())).filter(Boolean))].sort();
    catLabel='Type de végétal';
  } else if(field==='famille'){
    vals=[...new Set(plants.map(p=>p.famille).filter(Boolean))].sort();
    catLabel='Famille botanique';
  } else if(field==='classe'){
    vals=[...new Set(plants.map(p=>p.classe).filter(Boolean))].sort();
    catLabel='Classe botanique';
  } else if(field==='usage'){
    vals=[...new Set(plants.flatMap(p=>(p.usageAmenagement||'').split(',').map(s=>s.trim())).filter(Boolean))].sort();
    catLabel='Usage en aménagement';
  } else if(field==='couleur'){
    // Couleurs primaires extraites des fleurs
    const rawCols=plants.flatMap(p=>(p.couleurFleurs||'').split(/,\s*/).map(s=>s.replace(/\s*\(.*\)|\s*&.*/,'').trim()));
    vals=[...new Set(rawCols.filter(s=>s&&s!=='Non significatives'&&s.length>1))].sort();
    catLabel='Couleur des fleurs';
  } else if(field==='taille'){
    // Tranches de hauteur
    vals=['0–0.5 m→0→0.5','0.5–1 m→0.5→1','1–2 m→1→2','2–5 m→2→5','5–15 m→5→15','> 15 m→15→100'];
    catLabel='Hauteur adulte';
    chipLabel=v=>v.split('→')[0];
  } else if(field==='rusticite'){
    // Intervalles de rusticité (valeur interne: lo→hi)
    vals=['Très rustique (< -25°C)→-100→-25','Rustique (-25 à -15°C)→-25→-15','Assez rustique (-15 à -10°C)→-15→-10','Peu rustique (-10 à -5°C)→-10→-5','Sensible au gel (> -5°C)→-5→0'];
    catLabel='Rusticité';
    chipLabel=v=>v.split('→')[0];
  }
  const current=qFilter[field]||'';
  const chips=`<span class="fchip all-chip${!current?' active':''}" onclick="toggleFilterChip(this,'${field}','')">Tous</span>`
    +vals.map(v=>{
      const display=chipLabel(v);
      const stored=field==='taille'||field==='rusticite'?v.split('→').slice(1).join('→'):v;
      return `<span class="fchip${current===stored?' active':''}" onclick="toggleFilterChip(this,'${field}','${stored.replace(/'/g,"\\'")}')"> ${display}</span>`;
    }).join('');
  panel.innerHTML=`<div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(200,223,204,.4);margin-bottom:7px">${catLabel}</div><div class="filter-chips">${chips}</div>`;
  panel.style.display='block';
}

function clearAllFilters(){
  qFilter={feuillage:'',exposition:'',type:'',famille:'',classe:'',usage:'',couleur:'',taille:'',rusticite:''};
  ['feuillage','exposition','type','famille','classe','usage','couleur','taille','rusticite'].forEach(k=>{
    const b=document.getElementById('fcat-'+k);
    if(b){
      b.style.borderColor='rgba(74,184,112,.2)';
      b.style.color='rgba(200,223,204,.75)';
      b.style.background='rgba(74,184,112,.08)';
      b.classList.remove('fcat-open');
      const badge=b.querySelector('.fcat-badge');
      if(badge) badge.remove();
    }
  });
  const panel=document.getElementById('filter-chips-panel');
  if(panel){ panel.style.display='none'; panel.dataset.openField=''; }
  // Refresh pour retirer bouton réinitialiser
  const cats=document.getElementById('filter-cats');
  if(cats){
    const resetBtn=cats.querySelector('button:last-child');
    if(resetBtn&&resetBtn.textContent.includes('Réinitialiser')) resetBtn.remove();
  }
}

function selectLevel(n){
  qLevel=n;
  [1,2,3,4].forEach(i=>{
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
  qName=qNameNorm; qUsed=[]; qNum=0; qScore={ok:0,total:0,timeouts:0}; qHistory=[]; qStreak=0; qPriorityMode=priorityMode; qStartTime=Date.now();

  // Appliquer filtres révision ciblée
  let pool=[...plants];
  if(qFilter.feuillage)  pool=pool.filter(p=>p.feuillage===qFilter.feuillage);
  if(qFilter.exposition) pool=pool.filter(p=>(p.exposition||'').split(/[–,]/).map(s=>s.trim()).includes(qFilter.exposition)||(p.exposition||'').includes(qFilter.exposition));
  if(qFilter.type)       pool=pool.filter(p=>(p.type||'').split(',').map(s=>s.trim()).includes(qFilter.type));
  if(qFilter.usage)      pool=pool.filter(p=>(p.usageAmenagement||'').split(',').map(s=>s.trim()).includes(qFilter.usage));
  if(qFilter.couleur)    pool=pool.filter(p=>(p.couleurFleurs||'').toLowerCase().includes(qFilter.couleur.toLowerCase()));
  if(qFilter.taille)     pool=pool.filter(p=>{
    const h=parseDimensionValue(p.hauteurAdulte)||0;
    const [lo,hi]=qFilter.taille.split('–').map(s=>parseFloat(s));
    return h>=lo&&h<=hi;
  });
  if(qFilter.famille)    pool=pool.filter(p=>(p.famille||'')===qFilter.famille);
  if(qFilter.classe)     pool=pool.filter(p=>(p.classe||'')===qFilter.classe);
  if(qFilter.rusticite)  pool=pool.filter(p=>{
    const r=parseRusticiteValue(p.rusticite);
    if(r===null) return false;
    const [lo,hi]=qFilter.rusticite.split('→').map(Number);
    return r>=lo&&r<=hi;
  });

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
  qPhotoSel=null; qSSel=null; qSQ=null; qNum++;

  // Déterminer le type de question étape 1
  // Priorité : dictée (si mode dictée actif et tirage 1/4) → spelling → identify
  if(qDicteeMode && Math.random() < 0.25){
    qPhotoType = 'dictee';
  } else {
    // 50% identification classique, 50% orthographe botanique
    qPhotoType = Math.random() < 0.5 ? 'spelling' : 'identify';
    if(qPhotoType==='spelling'){
      qSQ = buildSpellingQ();
      if(!qSQ || qSQ.options.length < 4) qPhotoType = 'identify';
    }
  }
}

function buildKQ(){
  const p=qRound.correct;
  if(qLevel===4){
    // Niveau technique : choisir la bonne plante selon critères de chantier
    // Chaque template utilise des champs spécifiques — on évite les distracteurs valides
    // Templates au format {t:fn, f:fields[]}
    // Filtrer les templates dont les champs requis sont renseignés sur la plante
    const validTpls = N3_TEMPLATES.filter(tpl=>tpl.f.every(k=>p[k]&&String(p[k]).trim()));
    const tplPool = validTpls.length ? validTpls : N3_TEMPLATES;
    const chosen = rand(tplPool);
    const tplFields = chosen.f;
    const question = chosen.t(p);

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
  // Questions contraire : 15% de chance aux niveaux 2+ (champs nécessaires renseignés)
  if(qLevel>=2 && Math.random()<0.15){
    const cq=buildContraireQuestion(p, qPlants);
    if(cq) return cq;
  }
  const fields=qLevel===3?KFIELDS_N3:qLevel===2?KFIELDS_N2:KFIELDS_N1;
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


// ══════════════════════════════════════════════════════
//  ARRÊT QUIZ (bouton Arrêter)
// ══════════════════════════════════════════════════════
function confirmStopQuiz(){
  const root = document.getElementById('overlay-root');
  root.innerHTML = `
    <div class="form-bg" onclick="if(event.target===this)document.getElementById('overlay-root').innerHTML=''">
      <div class="form-card" style="max-width:400px;padding:28px 24px">
        <div style="text-align:center;margin-bottom:20px">
          <span style="font-size:44px;display:block;margin-bottom:10px">⏹️</span>
          <div class="form-title" style="font-size:18px;margin-bottom:8px">Arrêter le quiz ?</div>
          <div style="font-size:13px;color:rgba(200,223,204,.5);line-height:1.6">
            Ta progression actuelle (<strong style="color:var(--cr)">${qScore.ok} / ${qScore.total}</strong> questions)<br>
            sera enregistrée dans les statistiques<br>
            <span style="color:#ff9999">mais pas dans le classement.</span>
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="cancel-btn" style="flex:1" onclick="document.getElementById('overlay-root').innerHTML=''">Continuer →</button>
          <button onclick="executeStopQuiz()" style="flex:1;padding:11px 16px;background:linear-gradient(135deg,#7a2a00,#c04000);border:none;border-radius:11px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer">⏹️ Arrêter</button>
        </div>
      </div>
    </div>`;
}

async function executeStopQuiz(){
  document.getElementById('overlay-root').innerHTML = '';
  stopTimer();
  clearQuizState();

  if(qScore.total > 0){
    const elapsed = Math.round((Date.now() - qStartTime) / 1000);
    const inc = {
      name: qName,
      level: qLevel,
      ok: qScore.ok,
      total: qScore.total,
      pct: Math.round(qScore.ok / qScore.total * 100),
      elapsed,
      date: Date.now(),
      abandoned: true
    };

    // ── Sauvegarde Supabase (partagée avec l'admin) ──
    if(cloudOk){
      try{
        await sbPost('floralab_abandoned', inc, 'return=minimal');
      }catch(e){
        cqErr('Abandoned save cloud fail:', e);
        // Fallback localStorage
        _saveIncompleteLocal(inc);
      }
    } else {
      // Hors ligne : localStorage avec flag pour sync ultérieure
      _saveIncompleteLocal(inc);
    }
  }

  showPage('home');
}

function _saveIncompleteLocal(inc){
  try{
    let arr = JSON.parse(localStorage.getItem(SK_INCOMPLETE)||'[]');
    arr.push(inc);
    if(arr.length > 200) arr = arr.slice(-200);
    localStorage.setItem(SK_INCOMPLETE, JSON.stringify(arr));
  }catch(e){}
}

function topbarHTML(){
  const lvCls2=qLevel===4?'lv4':qLevel===3?'lv3':qLevel===2?'lv2':'lv1';
  const streakHTML=qStreak>=3?`<span class="streak-badge">🔥 ×${qStreak}</span>`:'';
  return `<div class="quiz-topbar"><div><div style="font-family:var(--disp);font-size:26px;font-weight:900;color:var(--cr)">Quiz <em style="color:var(--am2)">Végétaux</em></div><div class="quiz-player"><strong>${qName}</strong><span class="level-pill ${lvCls2}">Niv.${qLevel}</span>${streakHTML}</div></div><div style="display:flex;align-items:center;gap:10px"><div class="score-badge">✅ ${qScore.ok} / ${qScore.total}</div><button onclick="confirmStopQuiz()" style="padding:5px 11px;background:rgba(255,80,40,.1);border:1px solid rgba(255,80,40,.25);border-radius:8px;color:rgba(255,120,80,.9);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap" onmouseover="this.style.background='rgba(255,80,40,.22)'" onmouseout="this.style.background='rgba(255,80,40,.1)'">⏹ Arrêter</button></div></div>`;
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
  const allPhotos = [p.photo, p.photo2, p.photo3, p.photo4].filter(Boolean);
  if(!allPhotos.length) return `<div class="qphoto-slide"><div class="qphoto-fallback">${LEAF_SVG}</div></div>`;
  const slides = allPhotos.map(ph=>
    `<div class="qphoto-slide"><img src="${ph}" class="qphoto" onerror="this.style.display='none'" loading="lazy"/></div>`
  ).join('');
  const dots = allPhotos.length > 1
    ? `<div class="qphoto-dots">${allPhotos.map((_,i)=>`<span class="qphoto-dot${i===0?' active':''}" onclick="goSlide(${i})"></span>`).join('')}</div>`
    : '';
  const id = 'qpc-'+Date.now();
  return `<div class="qphotos"><div class="qphoto-carousel" id="${id}">`
    +`<div class="qphoto-track">${slides}</div>`
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
        <div class="phase-label" style="margin-bottom:12px">${qKQ.type==='contraire'?'🚫 Question contraire':'🧠 Étape 2'} — ${qKQ.field.label}</div>
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
  const s={name:qName,level:qLevel,ok:qScore.ok,total:qScore.total,pct,timeouts:qScore.timeouts,date:Date.now(),startTime:qStartTime||Date.now()};
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
  const lvCls=qLevel===4?'lv4':qLevel===3?'lv3':qLevel===2?'lv2':'lv1';

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
        <button style="flex:1;min-width:130px;padding:14px;background:linear-gradient(135deg,#1e5030,#2d7a4a);border:none;border-radius:13px;color:white;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer" onclick="initQuizPage()">🔄 Rejouer</button>${(()=>{let ae={};try{ae=JSON.parse(localStorage.getItem(SK_ERRORS)||'{}')}catch(e){}; const me=(ae[qName]||[]); return me.length>=2?`<button style="flex:1;min-width:130px;padding:14px;background:rgba(255,100,0,.15);border:1px solid rgba(255,140,0,.35);border-radius:13px;color:#ff8c00;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer" onclick="initQuizPage(true)">🎯 Quiz ciblé (${me.length} erreurs)</button>`:''})()}
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
  ['all','best','lv1','lv2','lv3','lv4'].forEach(k=>{
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
  else if(lbFilter==='lv4') data=data.filter(s=>s.level===4);
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
function fmtElapsed(s){ if(!s) return '—'; const m=Math.floor(s/60), sec=s%60; return m>0 ? m+'min '+sec+'s' : sec+'s'; }

async function renderStats(){
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
    byName[n].history.push({pct:s.pct,date:s.date,startTime:s.startTime||s.date,lv});
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
    const lastDate=a.lastDate?new Date(a.lastDate):null;
    const lastD=lastDate?lastDate.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}):'—';
    const lastT=lastDate?lastDate.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'';
    const barCol=pctGlobal>=70?'var(--g4)':pctGlobal>=50?'var(--am2)':'#ff9999';
    return `
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="stat-card-name">${a.name}</div>
          <div style="font-size:10px;color:rgba(200,223,204,.5);text-align:right">Dernière partie<br><strong style="color:rgba(200,223,204,.8)">${lastD}</strong>${lastT?` <span style="color:rgba(200,223,204,.45)">${lastT}</span>`:''}</div>
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
        <div style="margin-top:4px;font-size:10px;color:rgba(200,223,204,.35)">Parties : ${hist.map(h=>{
          const d=new Date(h.startTime||h.date);
          return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'&nbsp;<span style="color:'+( h.pct>=70?'var(--g4)':h.pct>=50?'var(--am2)':'#ff9999' )+'">'+h.pct+'%</span>';
        }).join(' &nbsp;·&nbsp; ')}</div>
        ${myErrors.length?`<div class="stat-weak"><div class="stat-weak-title">Points faibles</div>${myErrors.map(e=>`<div class="stat-weak-item"><em style="font-size:12px">${e.latin}</em><span class="stat-weak-count">${e.count}×</span></div>`).join('')}</div>`:''}
      </div>`;
  }).join('');


  // ── Quiz non terminés — lire Supabase + localStorage fallback ──
  let incompletes=[];
  if(cloudOk){
    try{ incompletes=await sbGet('floralab_abandoned','select=*&order=date.desc&limit=200'); }catch(e){}
  }
  if(!incompletes.length){
    // Fallback localStorage (hors ligne ou table pas encore créée)
    try{ incompletes=JSON.parse(localStorage.getItem(SK_INCOMPLETE)||'[]'); }catch(e){}
  }
  incompletes.sort((a,b)=>b.date-a.date);
  const totalTermines = scores.length;
  const totalInterrompus = incompletes.length;

  // ── Sessions multijoueur ──
  let multiPlayers = [], multiSessionsMeta = [];
  if(cloudOk){
    try{ multiPlayers = await sbGet('floralab_session_players','select=*&order=updated_at.desc'); }catch(e){}
    try{ multiSessionsMeta = await sbGet('floralab_sessions','select=code,level,created_at,status&order=created_at.desc&limit=100'); }catch(e){}
  }
  // Stats par apprenti (multijoueur)
  const multiByName={};
  multiPlayers.filter(r=>r.done).forEach(r=>{
    const n=r.player_name||'?';
    const pct=r.total?Math.round((r.score||0)/r.total*100):0;
    if(!multiByName[n]) multiByName[n]={name:n,sessions:0,totalOk:0,totalQ:0,pctBest:0,pctWorst:100,history:[]};
    multiByName[n].sessions++;
    multiByName[n].totalOk+=r.score||0;
    multiByName[n].totalQ+=r.total||0;
    if(pct>multiByName[n].pctBest) multiByName[n].pctBest=pct;
    if(pct<multiByName[n].pctWorst) multiByName[n].pctWorst=pct;
    multiByName[n].history.push({pct,session_code:r.session_code,date:r.updated_at,
      startTime:multiBySession[r.session_code]?.created_at||r.updated_at});
    if(!multiByName[n].lastDate||new Date(r.updated_at)>new Date(multiByName[n].lastDate))
      multiByName[n].lastDate=r.updated_at;
  });
  // Stats par session
  const multiBySession={};
  multiPlayers.forEach(r=>{
    const c=r.session_code;
    if(!multiBySession[c]) multiBySession[c]={code:c,players:[],done_count:0};
    multiBySession[c].players.push(r);
    if(r.done) multiBySession[c].done_count++;
  });
  multiSessionsMeta.forEach(s=>{
    if(multiBySession[s.code]){ multiBySession[s.code].level=s.level; multiBySession[s.code].created_at=s.created_at; multiBySession[s.code].status=s.status; }
  });
  // Cartes par apprenti multijoueur
  const multiApprentis=Object.values(multiByName).sort((a,b)=>b.totalOk-a.totalOk);
  const multiCardsHTML=multiApprentis.map(a=>{
    const pctGlobal=a.totalQ?Math.round(a.totalOk/a.totalQ*100):0;
    const avgPct=a.sessions?Math.round(a.history.reduce((s,h)=>s+h.pct,0)/a.sessions):0;
    const barCol=pctGlobal>=70?'var(--g4)':pctGlobal>=50?'var(--am2)':'#ff9999';
    const lastDateM=a.lastDate?new Date(a.lastDate):null;
    const lastDM=lastDateM?lastDateM.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}):'—';
    const lastTM=lastDateM?lastDateM.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'';
    const histLineM=a.history.length?a.history.slice(-5).map(h=>{
      const d=new Date(h.startTime||h.date);
      return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'\u00a0<span style="color:'+(h.pct>=70?'var(--g4)':h.pct>=50?'var(--am2)':'#ff9999')+'">'+h.pct+'%</span>';
    }).join(' &nbsp;·&nbsp; '):'';
    return `<div class="stat-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="stat-card-name">${a.name}</div>
        <div style="text-align:right">
          <span style="padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(122,184,245,.12);color:#7ab8f5;border:1px solid rgba(122,184,245,.25)">Multi</span>
          <div style="font-size:10px;color:rgba(200,223,204,.45);margin-top:2px">${lastDM}${lastTM?' '+lastTM:''}</div>
        </div>
      </div>
      <div style="font-size:11px;color:rgba(200,223,204,.7);margin:6px 0 4px">
        🎮 <strong>${a.sessions}</strong> session(s) &nbsp;·&nbsp;
        🏆 Meilleur : <strong style="color:var(--am2)">${a.pctBest}%</strong> &nbsp;·&nbsp;
        📊 Pire : <strong style="color:#ff9999">${a.pctWorst}%</strong>
      </div>
      <div style="font-size:11px;color:rgba(200,223,204,.7);margin-bottom:6px">
        ✅ <strong style="color:var(--g4)">${a.totalOk}</strong> / ${a.totalQ} qst &nbsp;·&nbsp;
        Moy. <strong style="color:${barCol}">${avgPct}%</strong> &nbsp;·&nbsp;
        Global <strong style="color:${barCol}">${pctGlobal}%</strong>
      </div>
      <div class="stat-bar-wrap"><div class="stat-bar" style="width:${pctGlobal}%;background:${barCol}"></div></div>
      ${histLineM?`<div style="margin-top:4px;font-size:10px;color:rgba(200,223,204,.35)">Sessions : ${histLineM}</div>`:''}
    </div>`;
  }).join('');
  // Liste des sessions
  const sessionsSorted=Object.values(multiBySession).sort((a,b)=>(b.created_at||'').localeCompare(a.created_at||'')).slice(0,30);
  const sessionsListHTML=sessionsSorted.map(s=>{
    const dateStr=s.created_at?new Date(s.created_at).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'}):'—';
    const timeStr=s.created_at?new Date(s.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'';
    const lvLabel=s.level?`Niv.${s.level}`:'';
    const ranked=s.players.filter(r=>r.done).sort((a,b)=>(b.score||0)-(a.score||0));
    const podium=ranked.slice(0,3).map((r,i)=>{
      const medal=i===0?'🥇':i===1?'🥈':'🥉';
      const rpct=r.total?Math.round((r.score||0)/r.total*100):0;
      return `<span style="font-size:11px">${medal} <strong>${r.player_name}</strong> <span style="color:var(--am2)">${rpct}%</span></span>`;
    }).join(' &nbsp;');
    const statusBadge=s.status==='ended'
      ?`<span style="background:rgba(74,184,112,.12);border:1px solid rgba(74,184,112,.25);border-radius:6px;padding:2px 7px;font-size:10px;color:var(--g4)">Terminée</span>`
      :`<span style="background:rgba(245,197,64,.1);border:1px solid rgba(245,197,64,.2);border-radius:6px;padding:2px 7px;font-size:10px;color:#f5c540">En cours</span>`;
    return `<div class="collective-row" style="flex-direction:column;align-items:flex-start;gap:5px;padding:10px 12px">
      <div style="display:flex;width:100%;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        <span style="font-size:12px;font-weight:700">Session <strong style="color:var(--cr)">${s.code}</strong>${lvLabel?' &nbsp;·&nbsp; '+lvLabel:''}</span>
        <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">${statusBadge}<span style="font-size:11px;color:rgba(200,223,204,.4)">${dateStr} ${timeStr}</span><button onclick="deleteMultiSession('${s.code}')" title="Supprimer cette session" style="background:rgba(255,80,80,.08);border:1px solid rgba(255,80,80,.2);border-radius:7px;color:#ff9999;font-size:12px;cursor:pointer;padding:2px 7px;line-height:1" onmouseover="this.style.background='rgba(255,80,80,.18)'" onmouseout="this.style.background='rgba(255,80,80,.08)'">✕</button></div>
      </div>
      <div style="font-size:11px;color:rgba(200,223,204,.5)">👥 ${s.players.length} joueur(s) · ${s.done_count} terminé(s)</div>
      ${podium?`<div style="display:flex;gap:10px;flex-wrap:wrap">${podium}</div>`:''}
    </div>`;
  }).join('');
  const totalMultiSessions=sessionsSorted.length;
  const totalMultiDone=multiPlayers.filter(r=>r.done).length;
  const multiSection=`
    <div class="stats-collective" style="margin-top:20px;border-color:rgba(122,184,245,.2);background:rgba(50,100,200,.04)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:16px">
        <div class="stats-collective-title" style="color:rgba(122,184,245,.85);margin-bottom:0">🎮 Sessions multijoueur</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span style="background:rgba(122,184,245,.1);border:1px solid rgba(122,184,245,.25);border-radius:8px;padding:4px 10px;font-size:11px;color:#7ab8f5">${totalMultiSessions} session(s)</span>
          <span style="background:rgba(74,184,112,.12);border:1px solid rgba(74,184,112,.3);border-radius:8px;padding:4px 10px;font-size:11px;color:var(--g4)">${totalMultiDone} participation(s) terminée(s)</span>
        </div>
      </div>
      ${multiApprentis.length?`<div class="stats-grid" style="margin-bottom:16px">${multiCardsHTML}</div>`:''}
      ${sessionsListHTML?`<div style="display:flex;flex-direction:column;gap:6px">${sessionsListHTML}</div>`:`<div style="font-size:13px;color:rgba(200,223,204,.35);text-align:center;padding:12px 0">Aucune session multijoueur enregistrée.</div>`}
    </div>`;

  // Comptage interrompus par apprenti pour enrichir les cartes
  const incompByName={};
  incompletes.forEach(inc=>{
    const n=inc.name||'?';
    if(!incompByName[n]) incompByName[n]={count:0,totalQ:0,totalOk:0};
    incompByName[n].count++;
    incompByName[n].totalQ+=inc.total||0;
    incompByName[n].totalOk+=inc.ok||0;
  });

  // Enrichir les cartes apprentis avec le nb de quiz interrompus
  const cardsHTMLFinal = apprentis.map(a=>{
    const inc = incompByName[a.name];
    const incLine = inc
      ? `<div style="font-size:11px;color:rgba(255,160,60,.8);margin-bottom:4px">⏹ <strong>${inc.count}</strong> quiz interrompu(s) · ${inc.totalOk}/${inc.totalQ} qst avant arrêt</div>`
      : '';
    const pctGlobal=a.totalQ?Math.round(a.totalOk/a.totalQ*100):0;
    const myErrors=(allErrors[a.name]||[]).sort((x,y)=>y.count-x.count).slice(0,5);
    const errCount=a.totalQ-a.totalOk;
    const lvLabels={'1':'N1','2':'N2','3':'N3'};
    const lvHTML=Object.entries(a.levels).map(([lv,n])=>`<span style="padding:2px 7px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(74,184,112,.15);color:var(--g4);border:1px solid rgba(74,184,112,.3)">${lvLabels[lv]||'N'+lv} ×${n}</span>`).join(' ');
    const barCol=pctGlobal>=70?'var(--g4)':pctGlobal>=50?'var(--am2)':'#ff9999';
    const hist=a.history;
    let sparkHTML='';
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
    return `
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="stat-card-name">${a.name}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="font-size:10px;color:rgba(200,223,204,.5);text-align:right">Dernière partie<br><strong style="color:rgba(200,223,204,.8)">${lastD}</strong></div>
            <button onclick="deletePlayerStats('${a.name.replace(/'/g,"\\'")}')" title="Supprimer ce joueur" style="background:rgba(255,80,80,.08);border:1px solid rgba(255,80,80,.2);border-radius:7px;color:#ff9999;font-size:13px;cursor:pointer;padding:3px 7px;line-height:1" onmouseover="this.style.background='rgba(255,80,80,.18)'" onmouseout="this.style.background='rgba(255,80,80,.08)'">✕</button>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0 8px">${lvHTML}</div>
        <div style="font-size:11px;color:rgba(200,223,204,.7);margin-bottom:4px">
          🎮 <strong>${a.games}</strong> terminé(s) &nbsp;·&nbsp;
          🏆 Meilleur : <strong style="color:var(--am2)">${a.pctBest}%</strong> &nbsp;·&nbsp;
          📉 Pire : <strong style="color:#ff9999">${a.pctWorst}%</strong>
        </div>
        ${incLine}
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

  // Tableau quiz interrompus — TOUJOURS affiché
  const incTableRows = incompletes.slice(0,30).map(inc=>`
    <div class="collective-row">
      <span style="font-size:11px;color:rgba(200,223,204,.5);white-space:nowrap">${new Date(inc.date).toLocaleDateString('fr-FR')} ${new Date(inc.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
      <span style="font-size:12px"><strong>${inc.name}</strong> · Niv.${inc.level||1} · <span style="color:var(--am2)">${inc.ok}/${inc.total} qst</span></span>
      <span style="display:flex;gap:5px;flex-wrap:wrap">
        <span style="background:rgba(255,140,0,.12);border:1px solid rgba(255,140,0,.3);border-radius:6px;padding:2px 7px;font-size:11px;color:#ffb347">⏱ ${fmtElapsed(inc.elapsed)}</span>
        <span style="background:rgba(255,80,80,.1);border:1px solid rgba(255,80,80,.25);border-radius:6px;padding:2px 7px;font-size:11px;color:#ff9999">Non terminé</span>
      </span>
    </div>`).join('');

  const incompleteSection=`
    <div class="stats-collective" style="margin-top:20px;border-color:rgba(255,140,0,.2);background:rgba(255,120,0,.04)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        <div class="stats-collective-title" style="color:rgba(255,160,60,.85);margin-bottom:0">⏹️ Quiz interrompus</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="background:rgba(74,184,112,.12);border:1px solid rgba(74,184,112,.3);border-radius:8px;padding:4px 10px;font-size:11px;color:var(--g4)">✅ ${totalTermines} terminé(s)</span>
          <span style="background:rgba(255,140,0,.12);border:1px solid rgba(255,140,0,.3);border-radius:8px;padding:4px 10px;font-size:11px;color:#ffb347">⏹ ${totalInterrompus} interrompu(s)</span>
        </div>
      </div>
      ${totalInterrompus===0
        ? `<div style="font-size:13px;color:rgba(200,223,204,.35);text-align:center;padding:12px 0">Aucun quiz interrompu pour le moment.</div>`
        : incTableRows + (incompletes.length>30?`<div style="font-size:11px;color:rgba(200,223,204,.3);margin-top:6px">… et ${incompletes.length-30} autres</div>`:'')}
      ${totalInterrompus>0?`<button onclick="if(confirm('Effacer les quiz interrompus ?')){ localStorage.removeItem('${SK_INCOMPLETE}'); renderStats(); }"
        style="margin-top:10px;padding:7px 16px;background:rgba(255,100,100,.08);border:1px solid rgba(255,100,100,.2);border-radius:8px;color:#ff9999;font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer">
        🗑 Effacer l'historique des interrompus
      </button>`:''}
    </div>`;

  const emptyHTML=`<div class="empty"><span class="empty-icon">📊</span><p>Aucune donnée statistique.<br>Les stats apparaissent après les premières parties.</p></div>`;

  const nowStr = new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  c.innerHTML=`
    <div class="pg-title">📊 Statistiques <em>Apprentis</em></div>
    <div class="pg-sub">Suivi de progression — ${apprentis.length} apprenti(s) · Moyenne : <strong style="color:var(--am2)">${classMoyenne}%</strong> · ${totalTermines} terminée(s) · ${totalInterrompus} interrompue(s) <span style="color:rgba(200,223,204,.3);font-size:11px">· ↻ ${nowStr}</span></div>
    ${collectiveHTML}
    ${apprentis.length?`<div class="stats-grid">${cardsHTMLFinal}</div>`:emptyHTML}
    ${multiSection}
    ${incompleteSection}
    ${names.length?`<button onclick="if(confirm('Effacer tout l\'historique des erreurs ?')){ localStorage.removeItem('${SK_ERRORS}'); renderStats(); }"
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
  const q=(document.getElementById('fi-search').value||'').toLowerCase().trim();
  const tokens=q.split(/\s+/).filter(t=>t.length>0);

  // ═══════════════════════════════════════════════════════
  //  RECHERCHE MULTICRITÈRE — Moteur sémantique couleurs
  // ═══════════════════════════════════════════════════════

  // Champs "feuillage" au sens large
  const FOLIAGE_FIELDS=['couleurLimbe','feuillage','formeLimbe','texture','couleurPetiole'];
  // Champs "fleur/inflorescence"
  const FLOWER_FIELDS=['couleurFleurs','typeInflorescence','periodeFloraison','dimInflo','dimFleur','parfum','pollinisation'];

  // Dictionnaire complet des nuances par famille de couleur
  // Chaque clé = token de recherche → liste de sous-chaînes qui doivent matcher dans les valeurs
  const COLOR_SYNONYMS = {
    // ── BLEU ──
    'bleu' : ['bleu','azur','indigo','saphir','glauque','bleu-vert','vert bleuté','vert-bleu','gris-bleu','bleu-gris','bleu pâle','bleu foncé','bleu violet','bleu-mauve','turquoise','pruineux','glaucescent','cendré','argenté bleuté'],
    'bleue': ['bleu','azur','indigo','saphir','glauque','bleu-vert','vert bleuté','vert-bleu','gris-bleu','bleu-gris','turquoise'],
    'azur' : ['azur','bleu','ciel'],
    'indigo':['indigo','bleu','violet'],
    'turquoise':['turquoise','bleu-vert','vert-bleu'],
    'glauque':['glauque','bleu-vert','vert bleuté','gris-bleu','bleu-gris','cendré'],

    // ── VERT ──
    'vert' : ['vert','émeraude','jade','bronze','chartreuse','olive','kaki','vert-gris','vert-bleu','vert-jaune','vert-bronze','vert foncé','vert clair','vert pâle','vert brillant','vert luisant','vert-blanc','vert-jaune'],
    'verte': ['vert','émeraude','jade','olive','kaki'],
    'olive': ['olive','vert-brun','kaki'],
    'kaki' : ['kaki','olive','vert','brun-vert'],

    // ── ROUGE ──
    'rouge'  : ['rouge','bordeaux','carmin','cramoisi','vermillon','écarlate','grenat','framboise','lie-de-vin','brique','terracotta','rouille','cuivre','brun-rouge','rouge-orange','rouge-rosé','corail','tomate','feu','sang','cerise','rubis','améthyste rougeâtre'],
    'bordeaux':['bordeaux','rouge','grenat','lie-de-vin','brun-rouge','prune foncé'],
    'carmin': ['carmin','rouge','cramoisi','écarlate'],
    'cramoisi':['cramoisi','carmin','rouge foncé','pourpre'],
    'écarlate':['écarlate','rouge vif','carmin'],
    'grenat': ['grenat','bordeaux','rouge foncé','brun-rouge'],
    'vermillon':['vermillon','rouge-orange','orange-rouge'],
    'cerise': ['cerise','rouge','rose foncé'],
    'rubis':  ['rubis','rouge','carmin'],
    'corail': ['corail','orange-rouge','rouge-orange','saumon foncé'],

    // ── ORANGE ──
    'orange':  ['orange','abricot','ambre','rouille','terracotta','cuivre','brique','mandarine','saumon foncé','ocre orangé','jaune orangé','orange-rouge','orange vif','orange pâle','fauve'],
    'abricot': ['abricot','orange pâle','pêche','saumon'],
    'ambre':   ['ambre','orange','doré','brun-orange'],
    'rouille': ['rouille','orange-brun','brun-rouge','terracotta'],
    'terracotta':['terracotta','brique','terre','rouille','rouge-brun'],
    'brique':  ['brique','terracotta','rouge-brun','rouille'],
    'ocre':    ['ocre','jaune-brun','brun-jaune','orange pâle'],
    'fauve':   ['fauve','brun-orange','ocre','rouille'],

    // ── JAUNE ──
    'jaune':   ['jaune','or','doré','paille','citron','champagne','crème','ivoire','vert-jaune','jaune-vert','jaune vif','jaune pâle','jaune d\'or','jaune-orangé','jaune orangé','soufre','primrose','jaune-crème'],
    'doré':    ['doré','or','jaune d\'or','jaune','champagne','ambre clair'],
    'or':      ['or','doré','jaune d\'or','dorée'],
    'citron':  ['citron','jaune vif','jaune-vert','vert-jaune'],
    'paille':  ['paille','jaune pâle','crème','champagne'],
    'ivoire':  ['ivoire','blanc crème','crème','blanc cassé','blanc chaud'],
    'champagne':['champagne','crème','paille','blanc cassé'],

    // ── BLANC ──
    'blanc':   ['blanc','crème','ivoire','nacré','argenté','blanc rosé','blanc pur','blanc neige','blanc laiteux','blanc verdâtre','blanc-vert','blanc-jaune','blanchâtre'],
    'blanche': ['blanc','crème','ivoire','nacré'],
    'crème':   ['crème','blanc','ivoire','blanc cassé','paille clair'],
    'nacré':   ['nacré','blanc','argenté','blanc irisé'],

    // ── ROSE ──
    'rose':    ['rose','rosé','saumon','fuchsia','magenta','rose pâle','rose vif','rose foncé','rose-lilas','rose-mauve','rose-blanc','rose-rouge','incarnat','framboise clair','rose bonbon','rose tendre','rose carné'],
    'rosé':    ['rosé','rose','saumon pâle'],
    'fuchsia': ['fuchsia','rose vif','magenta','rose-rouge'],
    'magenta': ['magenta','rose foncé','fuchsia','rose-rouge'],
    'saumon':  ['saumon','rose-orange','rose pêche','abricot clair'],
    'incarnat':['incarnat','rose foncé','rouge clair'],

    // ── VIOLET / POURPRE ──
    'violet':  ['violet','mauve','lilas','lavande','améthyste','indigo','pourpre','prune','aubergine','bleu-violet','bleu-mauve','violet foncé','violet pâle','violine','violacé'],
    'violette':['violet','mauve','lilas','pourpre'],
    'mauve':   ['mauve','violet pâle','lilas','lavande','rose-violet'],
    'lilas':   ['lilas','mauve','violet pâle','lavande','rose-lilas'],
    'lavande': ['lavande','mauve','violet','lilas','bleu-violet'],
    'pourpre': ['pourpre','violet foncé','rouge-violet','bordeaux violacé','prune','cramoisi'],
    'prune':   ['prune','pourpre','violet foncé','bordeaux','aubergine'],
    'aubergine':['aubergine','violet foncé','pourpre foncé','prune'],
    'améthyste':['améthyste','violet','mauve','rose-violet'],

    // ── BRUN / MARRON ──
    'brun':    ['brun','marron','brun-rouge','brun-vert','chocolat','noisette','acajou','fauve','brun foncé','brun clair','roux','cannelle','brun-cuivré','cuivré','bronze','brun-orangé','sépia'],
    'marron':  ['marron','brun','chocolat','noisette'],
    'chocolat':['chocolat','brun foncé','marron'],
    'roux':    ['roux','brun-rouge','cuivré','cannelle','brun-orangé'],
    'cuivré':  ['cuivré','bronze','brun-orangé','roux','cuivre'],
    'bronze':  ['bronze','cuivré','brun-verdâtre','brun-vert','vert bronze'],
    'noisette':['noisette','brun clair','marron clair'],

    // ── GRIS / ARGENTÉ ──
    'gris':    ['gris','argenté','gris-vert','gris-bleu','bleu-gris','gris-blanc','gris cendré','gris-brun','gris fer','gris ardoise','plombé','pruineux'],
    'argenté': ['argenté','gris argent','gris','blanc-gris','gris-bleu','nacré'],
    'cendré':  ['cendré','gris','gris pâle','gris-blanc','argenté','pruineux'],

    // ── NOIR ──
    'noir':    ['noir','brun-noir','noir-vert','vert foncé presque noir','noir-pourpre','très foncé'],
    'noire':   ['noir','brun-noir','noir-pourpre'],
  };

  // Normalisation des tokens : accords, pluriels, variantes orthographiques
  function normalizeColorTok(tok){
    const map={
      'bleue':'bleu','bleus':'bleu','bleues':'bleu',
      'rouges':'rouge','roses':'rose',
      'jaunes':'jaune','blancs':'blanc','blanches':'blanc',
      'verts':'vert','vertes':'vert',
      'violets':'violet','violettes':'violet',
      'oranges':'orange','noirs':'noir','noires':'noir',
      'gris':'gris','grises':'gris',
      'dorés':'doré','dorée':'doré','dorées':'doré',
      'argentés':'argenté','argentée':'argenté','argentées':'argenté',
      'bronzé':'bronze','bronzés':'bronze',
      'cuivrée':'cuivré','cuivrés':'cuivré',
      'feuille':'feuillage','feuilles':'feuillage',
      'fleur':'fleurs',
    };
    return map[tok]||tok;
  }

  // Expansion sémantique : certains mots ciblent des champs spécifiques
  // Retourne {fields:[...], synonyms:[...]} ou null si pas d'expansion
  const SEMANTIC_CATEGORIES = {
    // Usage / destination
    'haie'      : {fields:['usageAmenagement'],synonyms:['haie libre','haie taillée','haie champêtre','haie fleurie','haie']},
    'couvre-sol': {fields:['usageAmenagement','type'],synonyms:['couvre-sol','couvre sol','tapis']},
    'grimpante' : {fields:['usageAmenagement','type'],synonyms:['grimpante','liane','escalade','mur']},
    'bac'       : {fields:['usageAmenagement'],synonyms:['bac','jardinière','pot','contenant']},
    'rocaille'  : {fields:['usageAmenagement'],synonyms:['rocaille','minéral','pente','talus sec']},
    'aquatique' : {fields:['usageAmenagement','humidite','type'],synonyms:['aquatique','berge','eau','bord','détrempé']},
    'massif'    : {fields:['usageAmenagement'],synonyms:['massif']},
    'bordure'   : {fields:['usageAmenagement'],synonyms:['bordure']},
    'talus'     : {fields:['usageAmenagement'],synonyms:['talus']},
    'aromatique': {fields:['autresInterets','type'],synonyms:['aromatique','feuillage aromatique','arôme','odeur','parfum']},
    'mellifere' : {fields:['autresInterets','biodiversite'],synonyms:['mellifère','mellifere','abeille','pollinisateur','butinage']},
    'medicinale': {fields:['autresInterets'],synonyms:['médicinale','medicinale','plante médicinale']},
    'comestible': {fields:['autresInterets'],synonyms:['comestible','fruitière','fruit','baie']},
    // Comportement saisonnier
    'persistant' : {fields:['feuillage','interetOrnemental'],synonyms:['persistant','persistante','feuillage persistant','toujours vert']},
    'caduc'      : {fields:['feuillage'],synonyms:['caduc','caduque','feuilles caduques','perd ses feuilles','décidu']},
    'marcescent' : {fields:['feuillage'],synonyms:['marcescent','marcescente','feuilles sèches hivernales']},
    'semi-persistant':{fields:['feuillage'],synonyms:['semi-persistant','semi persistant']},
    // Type de végétal
    'arbre'      : {fields:['type'],synonyms:['arbre','arbre caduc','arbre persistant','arbre fruitier']},
    'arbuste'    : {fields:['type'],synonyms:['arbuste','arbrisseau','sous-arbrisseau']},
    'conifere'   : {fields:['type','famille'],synonyms:['conifère','conifere','résineux','persistant à aiguilles']},
    'bambou'     : {fields:['type'],synonyms:['bambou','graminée ligneuse']},
    'fougere'    : {fields:['type'],synonyms:['fougère','fougere','ptéridophyte']},
    'graminee'   : {fields:['type'],synonyms:['graminée','graminee','poaceae','gramineae','herbe ornementale']},
    'vivace'     : {fields:['type'],synonyms:['vivace','herbacée vivace','vivaces']},
    'annuelle'   : {fields:['type'],synonyms:['annuelle','plante annuelle']},
    // Sol et conditions
    'calcaire'   : {fields:['ph'],synonyms:['calcaire','basique','calcicole','ph basique','alcalin']},
    'acide'      : {fields:['ph'],synonyms:['acide','acidophile','ph acide','terre de bruyère']},
    'drainant'   : {fields:['structureSol'],synonyms:['drainant','sableux','sec','bien drainé']},
    'lourd'      : {fields:['structureSol'],synonyms:['lourd','argileux','argile','compact']},
    'humide'     : {fields:['humidite'],synonyms:['humide','humidité','frais','détrempé']},
    'sec'        : {fields:['humidite','autresInterets'],synonyms:['sec','sécheresse','aride','xérophile']},
    // Exposition
    'ombre'      : {fields:['exposition'],synonyms:['ombre','à l\'ombre','ombragé']},
    'soleil'     : {fields:['exposition'],synonyms:['soleil','plein soleil','ensoleillé']},
    'mi-ombre'   : {fields:['exposition'],synonyms:['mi-ombre','mi-soleil','semi-ombragé']},
    // Intérêts
    'epineux'    : {fields:['contraintes','particularites'],synonyms:['épineux','épine','défensif','infranchissable']},
    'parfume'    : {fields:['parfum','couleurFleurs','autresInterets'],synonyms:['parfumé','parfumée','odorant','odoriférant']},
    'decoratif'  : {fields:['interetOrnemental'],synonyms:['décoratif','décorative','ornemental']},
    'automnal'   : {fields:['feuillage','interetOrnemental'],synonyms:['automnal','automnale','automne','coloré en automne']},
    // Port
    'retombant'  : {fields:['port'],synonyms:['pleureur','retombant','rampant','étalé']},
    'colonnaire' : {fields:['port'],synonyms:['fastigié','colonnaire','pyramidal','conique']},
  };

  function getSemanticExpansion(tok){
    // Correspondance directe
    if(SEMANTIC_CATEGORIES[tok]) return SEMANTIC_CATEGORIES[tok];
    // Correspondance partielle
    for(const key of Object.keys(SEMANTIC_CATEGORIES)){
      if(tok.includes(key)||key.includes(tok)) return SEMANTIC_CATEGORIES[key];
    }
    return null;
  }

  // Toutes les clés du dictionnaire = tokens reconnus comme couleurs
  const COLOR_KEYS=new Set(Object.keys(COLOR_SYNONYMS));

  function tokenMatchesField(tok, fieldVal){
    if(!fieldVal) return false;
    const fv=fieldVal.toLowerCase();
    // Correspondance directe
    if(fv.includes(tok)) return true;
    // Expansion via dictionnaire des nuances
    const syns=COLOR_SYNONYMS[tok];
    if(syns) return syns.some(s=>fv.includes(s));
    return false;
  }

  function expandToken(tok){
    return normalizeColorTok(tok);
  }

  // Détecter contexte "fleur" dans la requête
  function hasFlowerContext(toks){
    return toks.some(t=>normalizeColorTok(t)==='fleurs'||/^(inflo|inflorescence|floraison|fleurs?)$/i.test(t));
  }
  // Détecter contexte "feuillage" dans la requête
  function hasFoliageContext(toks){
    return toks.some(t=>normalizeColorTok(t)==='feuillage'||/^(feuilles?|feuillage|limbe|limbes)$/i.test(t));
  }

  // Tous les champs texte de la plante
  function allPlantFields(p){
    return [
      p.latin,p.nom,p.famille,p.type,p.classe,p.feuillage,p.exposition,
      p.couleurFleurs,p.couleurLimbe,p.formeLimbe,p.texture,p.port,
      p.vitesseCroissance,p.hauteurAdulte,p.largeurAdulte,
      p.rusticite,p.ph,p.humidite,p.structureSol,
      p.typeTaille,p.frequenceTaille,p.usageAmenagement,
      p.autresInterets,p.biodiversite,p.particularites,p.contraintes,
      p.interetOrnemental,p.interetEsthetique,
      p.reproduction,p.pollinisation,p.typeInflorescence,
      p.description,p.couleurPetiole,p.longueurLimbe,p.largeurLimbe,
      p.parfum,p.periodeFloraison
    ];
  }

  function plantMatchesToken(p, tok){
    // Vérification sémantique d'abord
    const sem = getSemanticExpansion(tok);
    if(sem){
      // Chercher dans les champs ciblés avec les synonymes
      const targetFields = sem.fields;
      const syns = sem.synonyms;
      return targetFields.some(f=>{
        const val=(p[f]||'').toLowerCase();
        return syns.some(s=>val.includes(s.toLowerCase()));
      });
    }
    // Recherche normale dans tous les champs
    return allPlantFields(p).some(v=>tokenMatchesField(tok, v));
  }

  function plantMatchesColorWithContext(p, colorTok, toks){
    const isFlowerCtx  = hasFlowerContext(toks);
    const isFoliageCtx = hasFoliageContext(toks);
    if(isFlowerCtx && !isFoliageCtx){
      return FLOWER_FIELDS.some(f=>tokenMatchesField(colorTok, p[f]));
    }
    if(isFoliageCtx && !isFlowerCtx){
      return FOLIAGE_FIELDS.some(f=>tokenMatchesField(colorTok, p[f]));
    }
    return plantMatchesToken(p, colorTok);
  }

  // COLOR_WORDS = alias pour compatibilité (désormais COLOR_KEYS fait foi)
  const COLOR_WORDS=[...COLOR_KEYS];

  const list=plants.filter(p=>{
    if(!tokens.length) return true;
    return tokens.every(tok=>{
      const exp = expandToken(tok);
      if(COLOR_WORDS.includes(exp)){
        return plantMatchesColorWithContext(p, exp, tokens);
      }
      return plantMatchesToken(p, exp);
    });
  }).sort((a,b)=>(a.latin||'').localeCompare(b.latin||'','fr',{sensitivity:'base'}));
  const grid=document.getElementById('fiches-grid');
  if(!list.length){
    if(!tokens.length){
      grid.innerHTML='<div class="empty" style="grid-column:1/-1"><span class="empty-icon">🌱</span><p>Aucune plante dans le catalogue.</p></div>';
    } else {
      // Recherche sans résultat → grille vide + message discret
      grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:rgba(200,223,204,.3);font-size:13px">Aucune fiche ne correspond à « '+q+' »</div>';
    }
    return;
  }
  grid.innerHTML=list.map(p=>{
    const isSel = compareMode && compareIds.includes(p.id);
    const selNum = compareMode && compareIds.includes(p.id) ? (compareIds.indexOf(p.id)+1) : 0;
    const clickAction = compareMode ? `toggleCompareSelect(${p.id})` : `openModal(${p.id})`;
    return `<div class="fiche${isSel?' compare-selected':''}" onclick="${clickAction}">
      ${isSel?`<div class="fiche-compare-badge">${selNum}</div>`:''}
      ${p.photo?`<img src="${p.photo}" class="fiche-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy"/><div class="fiche-img-fb" style="display:none">${LEAF_SVG}</div>`:`<div class="fiche-img-fb">${LEAF_SVG}</div>`}
      <div class="fiche-body">
        <div class="fiche-latin">${p.latin}</div>
        ${p.famille?`<div class="fiche-famille">${p.famille}</div>`:''}
        <div class="fiche-common">${p.nom||''}</div>
        <div class="fiche-tags">
          ${p.feuillage?`<span class="ftag" style="background:rgba(100,160,255,.12);color:#a0c4ff;border-color:rgba(100,160,255,.2)">${p.feuillage==='Caduc'?'🍂':p.feuillage==='Persistant'?'🌿':'🍁'} ${p.feuillage}</span>`:''}
          ${p.type?`<span class="ftag">${p.type}</span>`:''}
          ${p.exposition?`<span class="ftag am">☀️ ${p.exposition}</span>`:''}
          ${p.humidite?`<span class="ftag" style="background:rgba(80,160,220,.1);color:#7ab8f5;border-color:rgba(80,160,220,.2)">💧 ${p.humidite.split(',')[0].trim()}</span>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
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
    {key:'humidite',          label:'Humidité du sol'},
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

  const _pdfPhotos = [p.photo, p.photo2, p.photo3, p.photo4].filter(Boolean);
  const photo1 = _pdfPhotos.map(ph=>`<img src="${ph}" class="photo" onerror="this.style.display='none'"/>`).join('');
  const photo2 = ''; // contenu dans photo1
  const hasTwoPhotos = _pdfPhotos.length >= 2;

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
  .photos { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .photo { width: ${_pdfPhotos.length >= 3 ? 'calc(50% - 4px)' : _pdfPhotos.length === 2 ? 'calc(50% - 4px)' : '100%'}; max-height: 200px; object-fit: cover; border-radius: 10px; border: 1px solid #d0e8d8; }
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



// ══════════════════════════════════════════════════════
//  COMPARAISON CÔTE À CÔTE
// ══════════════════════════════════════════════════════
var compareMode = false;
var compareIds  = [null, null];
var compareType = "simple"; // "simple" | "complet"

function toggleCompareMode(){
  compareMode = !compareMode;
  compareIds  = [null, null];
  compareType = "simple";
  const bar = document.getElementById('compare-bar');
  if(bar) bar.style.display = compareMode ? '' : 'none';
  renderFiches();
  if(compareMode){
    document.getElementById('pg-fiches-sub') && (document.getElementById('pg-fiches-sub').style.color='var(--am2)');
  }
}

function toggleCompareSelect(id){
  if(!compareMode) return;
  const idx0 = compareIds.indexOf(id);
  if(idx0 !== -1){
    // Déjà sélectionné → désélectionner
    compareIds[idx0] = null;
  } else {
    // Trouver un slot libre
    const free = compareIds.indexOf(null);
    if(free !== -1) compareIds[free] = id;
    // sinon les 2 slots sont pris, on remplace le slot 1
    else compareIds[1] = id;
  }
  _updateCompareBar();
  renderFiches();
}

function _updateCompareBar(){
  [0,1].forEach(i=>{
    const slot = document.getElementById('cmp-slot-'+i);
    if(!slot) return;
    const id = compareIds[i];
    if(id){
      const p = plants.find(x=>x.id===id);
      slot.classList.add('filled');
      slot.innerHTML = '<span style="font-style:italic">'+( p?p.latin:'?')+'</span>'
        +'<button class="compare-slot-remove" onclick="event.stopPropagation();compareIds['+i+']=null;_updateCompareBar();renderFiches()">✕</button>';
    } else {
      slot.classList.remove('filled');
      slot.textContent = 'Sélectionner plante '+(i+1);
    }
  });
  const btn = document.getElementById('compare-launch-btn');
  if(btn) btn.disabled = !(compareIds[0] && compareIds[1]);
}


// ══════════════════════════════════════════════════════
//  Comparaison COMPLÈTE (tous les champs v17)
// ══════════════════════════════════════════════════════
function launchComparisonFull(id1, id2){
  const p1=plants.find(x=>x.id===id1);
  const p2=plants.find(x=>x.id===id2);
  if(!p1||!p2) return;

  const SECTIONS=[
    {titre:'🪪 Identité', keys:[
      {key:'famille',label:'Famille'},{key:'type',label:'Type'},{key:'classe',label:'Classe'},
      {key:'port',label:'Port'},{key:'vitesseCroissance',label:'Vitesse de croissance'},
    ]},
    {titre:'🍃 Feuillage', keys:[
      {key:'feuillage',label:'Feuillage'},{key:'couleurLimbe',label:'Couleur limbe'},
      {key:'formeLimbe',label:'Forme limbe'},{key:'longueurLimbe',label:'Longueur limbe'},
      {key:'largeurLimbe',label:'Largeur limbe'},{key:'longueurPetiole',label:'Pétiole'},
      {key:'couleurPetiole',label:'Couleur pétiole'},{key:'texture',label:'Texture'},
    ]},
    {titre:'📐 Dimensions', keys:[
      {key:'hauteurAdulte',label:'Hauteur adulte'},{key:'largeurAdulte',label:'Largeur adulte'},
    ]},
    {titre:'🌸 Floraison', keys:[
      {key:'periodeFloraison',label:'Période'},{key:'couleurFleurs',label:'Couleur fleurs'},
      {key:'parfum',label:'Parfum'},{key:'interetEsthetique',label:'Intérêt esthétique'},
      {key:'typeInflorescence',label:'Type inflo'},{key:'dimInflo',label:'Dim. inflo'},
      {key:'dimFleur',label:'Dim. fleur'},{key:'reproduction',label:'Reproduction'},
      {key:'pollinisation',label:'Pollinisation'},
    ]},
    {titre:'🌍 Milieu & sol', keys:[
      {key:'exposition',label:'Exposition'},{key:'rusticite',label:'Rusticité'},
      {key:'ph',label:'pH du sol'},{key:'humidite',label:'Humidité'},
      {key:'structureSol',label:'Structure sol'},
    ]},
    {titre:'✂️ Entretien', keys:[
      {key:'typeTaille',label:'Type de taille'},{key:'frequenceTaille',label:'Fréquence'},
    ]},
    {titre:'🏡 Usage & biodiversité', keys:[
      {key:'usageAmenagement',label:'Usage'},{key:'interetOrnemental',label:'Intérêt ornemental'},
      {key:'autresInterets',label:'Autres intérêts'},{key:'biodiversite',label:'Biodiversité'},
      {key:'contraintes',label:'Contraintes'},
    ]},
  ];

  function colFull(p, other){
    const imgHTML=p.photo
      ?'<img src="'+p.photo+'" class="cmp-img" onerror="this.style.display=\'none\'" loading="lazy"/>'
      :'<div class="cmp-img-fb">'+LEAF_SVG+'</div>';
    let html=imgHTML
      +'<div class="cmp-latin">'+p.latin+'</div>'
      +'<div style="font-size:12px;color:rgba(200,223,204,.5);margin-bottom:12px">'+( p.nom||'')+'</div>';
    SECTIONS.forEach(sec=>{
      const rows=sec.keys.filter(f=>p[f.key]||other[f.key]);
      if(!rows.length) return;
      html+='<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(74,184,112,.55);margin:10px 0 4px;padding-bottom:3px;border-bottom:1px solid rgba(74,184,112,.1)">'+sec.titre+'</div>';
      rows.forEach(f=>{
        const v=p[f.key]||'';
        const vo=other[f.key]||'';
        const same=v&&vo&&v===vo;
        const absent=!v&&vo;
        const color=absent?'rgba(200,223,204,.2)':same?'rgba(200,223,204,.55)':'var(--cr)';
        const bg=absent?'':'same'===''?'':v&&vo&&v!==vo?'rgba(232,160,32,.07)':'';
        html+='<div style="display:flex;align-items:baseline;gap:8px;padding:5px 0;border-bottom:1px solid rgba(74,184,112,.06);'+(bg?'background:'+bg:'')+'">'+'<span style="font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:rgba(200,223,204,.42);min-width:110px;flex-shrink:0">'+f.label+'</span>'+'<span style="font-size:12px;font-weight:500;color:'+color+'">'+( v||'—')+'</span></div>';
      });
    });
    return html;
  }

  const diffCount=SECTIONS.reduce((n,s)=>
    n+s.keys.filter(f=>p1[f.key]&&p2[f.key]&&p1[f.key]!==p2[f.key]).length,0);

  document.getElementById('overlay-root').innerHTML=`
    <div class="modal-bg" onclick="if(event.target===this)closeModal()">
      <div class="modal" style="max-width:800px">
        <div style="padding:20px 50px 12px 20px;position:relative">
          <button class="modal-close" onclick="closeModal()">✕</button>
          <div style="font-family:var(--disp);font-size:18px;font-weight:900;color:var(--cr)">
            ⚖️ Comparaison complète
          </div>
          ${diffCount?`<div style="font-size:12px;color:rgba(200,223,204,.4);margin-top:4px">${diffCount} différence(s) surlignée(s) en orange</div>`:''}
        </div>
        <div class="compare-grid" style="padding:0 20px 20px">
          <div>${colFull(p1,p2)}</div>
          <div>${colFull(p2,p1)}</div>
        </div>
        <div style="padding:0 20px 20px;display:flex;gap:8px;justify-content:flex-end">
          <button onclick="closeModal();launchComparison()" style="padding:9px 16px;background:rgba(74,184,112,.08);border:1px solid rgba(74,184,112,.2);border-radius:10px;color:var(--g4);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">← Vue simple</button>
          <button onclick="exportComparaisonPDF(${id1},${id2})" style="padding:9px 16px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:10px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📄 PDF</button>
        </div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════════════
//  Export PDF — Comparaison 2 végétaux
// ══════════════════════════════════════════════════════
function exportComparaisonPDF(id1, id2){
  const p1 = plants.find(x=>x.id===id1);
  const p2 = plants.find(x=>x.id===id2);
  if(!p1||!p2) return;

  const KALL_PDF = [
    {key:'feuillage',        label:'Feuillage'},
    {key:'rusticite',        label:'Rusticité'},
    {key:'exposition',       label:'Exposition'},
    {key:'ph',               label:'pH du sol'},
    {key:'humidite',          label:'Humidité du sol'},
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

  // Garder uniquement les champs où au moins une des deux plantes a une valeur
  const fields = KALL_PDF.filter(f=>p1[f.key]||p2[f.key]);

  function plantColHTML(p, other){
    const photo = p.photo ? '<img src="'+p.photo+'" class="cmp-photo" onerror="this.style.display=\'none\'" />' : '<div class="cmp-photo-fb">—</div>';
    const rows = fields.map(f=>{
      const v = p[f.key]||'';
      const vOther = other[f.key]||'';
      const cls = v && vOther ? (v===vOther?'same':'diff') : '';
      return '<div class="field '+cls+'">'
        +'<div class="field-lbl">'+f.label+'</div>'
        +'<div class="field-val">'+(v||'<span style="opacity:.4">—</span>')+'</div>'
        +'</div>';
    }).join('');
    return '<div class="plant-col">'
      +(p.famille?'<div class="famille">'+p.famille+'</div>':'')
      +'<div class="latin">'+p.latin+'</div>'
      +'<div class="nom">'+(p.nom||'')+'</div>'
      +photo
      +'<div class="grid">'+rows+'</div>'
      +(p.description?'<div class="desc-title">Description</div><div class="desc-text">'+p.description+'</div>':'')
      +'</div>';
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Comparaison — ${p1.latin} vs ${p2.latin}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #fff; color: #1a2e20; padding: 20px 24px; }
  .toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
  .btn-print { padding: 9px 20px; background: #2d7a4a; color: #fff; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-print:hover { background: #4ab870; }
  .btn-close { padding: 9px 20px; background: #f5f5f5; color: #555; border: 1px solid #ccc; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-close:hover { background: #e8e8e8; }
  @media print { .toolbar { display: none !important; } }
  h1 { font-family: 'Playfair Display', serif; font-size: 20px; color: #1a2e20; margin-bottom: 4px; }
  .meta { font-size: 11px; color: #999; margin-bottom: 16px; }
  .legend { display: flex; gap: 16px; margin-bottom: 14px; font-size: 11px; }
  .leg-same { background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 4px; padding: 2px 8px; color: #2d7a4a; }
  .leg-diff { background: #fff8e1; border: 1px solid #ffe082; border-radius: 4px; padding: 2px 8px; color: #b07a00; }
  /* Colonnes côte à côte */
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  .plant-col { border: 1px solid #d0e8d8; border-radius: 10px; padding: 14px; break-inside: avoid-page; }
  .famille { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #4ab870; font-weight: 600; margin-bottom: 3px; }
  .latin { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; font-style: italic; color: #1a2e20; line-height: 1.1; }
  .nom { font-size: 13px; color: #4a6e52; margin-top: 2px; margin-bottom: 10px; font-weight: 600; }
  .cmp-photo { width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; border: 1px solid #d0e8d8; display: block; }
  .cmp-photo-fb { width: 100%; height: 60px; background: #f4faf6; border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 12px; }
  .grid { display: grid; grid-template-columns: 1fr; gap: 5px; margin-bottom: 10px; }
  .field { background: #f4faf6; border: 1px solid #d0e8d8; border-radius: 6px; padding: 6px 10px; }
  .field.same { background: #e8f5e9; border-color: #a5d6a7; }
  .field.diff  { background: #fff8e1; border-color: #ffe082; }
  .field-lbl { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #6ea87a; margin-bottom: 2px; font-weight: 600; }
  .field-val { font-size: 12px; color: #1a2e20; font-weight: 600; line-height: 1.3; }
  .desc-title { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #4ab870; font-weight: 600; margin: 8px 0 4px; }
  .desc-text { font-size: 11px; color: #2a4a30; line-height: 1.6; }
  .footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #d0e8d8; font-size: 10px; color: #999; display: flex; justify-content: space-between; }
  @media print {
    body { padding: 8px 10px; }
    @page { margin: 8mm 10mm; size: A4 landscape; }
    .compare-grid { grid-template-columns: 1fr 1fr; gap: 10px; break-inside: auto; }
    .plant-col { break-inside: avoid; page-break-inside: avoid; border-radius: 6px; }
    .cmp-photo { max-height: 140px; }
    h1, .legend, .meta { break-after: avoid; page-break-after: avoid; }
    .field { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button>
    <button class="btn-close" onclick="window.close()">✕ Fermer</button>
  </div>
  <h1>⚖️ Comparaison botanique</h1>
  <div class="meta">ChloroQuiz — Fiche comparative · ${new Date().toLocaleDateString('fr-FR')}</div>
  <div class="legend">
    <span class="leg-same">🟢 Valeur identique</span>
    <span class="leg-diff">🟡 Valeur différente</span>
  </div>
  <div class="compare-grid">
    ${plantColHTML(p1, p2)}
    ${plantColHTML(p2, p1)}
  </div>
  <div class="footer">
    <span>ChloroQuiz — © Tous droits réservés</span>
    <span>${new Date().toLocaleDateString('fr-FR')}</span>
  </div>
  <!-- impression manuelle via bouton toolbar -->
</body>
</html>`;

  try{
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if(!win) alert('Autorisez les popups pour exporter le comparatif en PDF.');
    setTimeout(()=>URL.revokeObjectURL(url), 30000);
  } catch(e){
    const win = window.open('','_blank');
    if(win){ win.document.write(html); win.document.close(); }
  }
}

function launchComparison(){
  const [id1, id2] = compareIds;
  if(!id1 || !id2) return;
  if(compareType === "complet"){ launchComparisonFull(id1, id2); return; }
  const p1 = plants.find(x=>x.id===id1);
  const p2 = plants.find(x=>x.id===id2);
  if(!p1 || !p2) return;

  // Champs à comparer
  const KALL_MODAL = [
    ...KFIELDS_N2,
    {key:'type',             label:'Type végétal'},
    {key:'usageAmenagement', label:'Usage aménagement'},
  ];

  function colHTML(p, side){
    const _onerr = "this.style.display='none'";
    const imgHTML = p.photo
      ? '<img src="'+p.photo+'" class="cmp-img" onerror="'+_onerr+'" loading="lazy"/>'
      : '<div class="cmp-img-fb">'+LEAF_SVG+'</div>';
        const fieldsHTML = KALL_MODAL.map(f=>{
      const v1 = p1[f.key]||''; const v2 = p2[f.key]||'';
      const v  = p[f.key]||'';
      if(!v1 && !v2) return '';
      const cls = (!v1||!v2) ? '' : (v1===v2?'same':'diff');
      return '<div class="cmp-row">'
        +'<div class="cmp-field-lbl">'+f.label+'</div>'
        +(v ? '<div class="cmp-field-val '+cls+'">'+v+'</div>'
             : '<div class="cmp-field-empty">—</div>')
        +'</div>';
    }).join('');
    const descHTML = p.description
      ? '<div class="cmp-field-lbl" style="margin-top:10px">Description</div>'
        +'<div style="font-size:12px;color:rgba(200,223,204,.75);line-height:1.6;margin-top:4px">'+p.description+'</div>'
      : '';
    return '<div class="cmp-col '+(side==='left'?'left':'right')+'">'
      +(p.famille?'<div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--g4);margin-bottom:4px">'+p.famille+'</div>':'')
      +'<div class="cmp-plant-name">'+p.latin+'</div>'
      +'<div class="cmp-plant-common">'+(p.nom||'')+'</div>'
      +imgHTML
      +fieldsHTML
      +descHTML
      +'</div>';
  }

  const legendHTML = '<div style="display:flex;gap:12px;flex-wrap:wrap;padding:0 22px 12px;font-size:11px">'
    +'<span style="background:rgba(74,184,112,.08);border:1px solid rgba(74,184,112,.2);border-radius:6px;padding:2px 8px;color:var(--g4)">🟢 Identique</span>'
    +'<span style="background:rgba(232,160,32,.1);border:1px solid rgba(232,160,32,.3);border-radius:6px;padding:2px 8px;color:var(--am2)">🟡 Différent</span>'
    +'</div>';

  const isMobile = window.innerWidth <= 640;

  document.getElementById('overlay-root').innerHTML =
    '<div class="modal-bg" onclick="if(event.target===this)closeModal()">'
    +'<div class="cmp-modal'+(isMobile?' mswipe-modal':'')+'">'
    +'<div class="cmp-header">'
    +'<div class="cmp-title">⚖️ Comparaison</div>'
    +'<div style="display:flex;gap:8px;align-items:center">'
    +'<button onclick="compareType=\'complet\';launchComparison()" style="padding:7px 14px;background:rgba(74,184,112,.08);border:1px solid rgba(74,184,112,.25);border-radius:9px;color:var(--g4);font-family:\'DM Sans\',sans-serif;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap">📄 Vue complète</button>'
    +'<button onclick="exportComparaisonPDF('+id1+','+id2+')" style="padding:7px 14px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:9px;color:var(--am2);font-family:\'DM Sans\',sans-serif;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap">🖨️ PDF</button>'
    +'<button class="modal-close" onclick="closeModal()">✕</button>'
    +'</div>'
    +'</div>'
    +legendHTML
    +(isMobile
      ? '<div class="mswipe-track" id="mswipe-track">'
        +'<div class="mswipe-page" style="overflow-y:auto">'+colHTML(p1,'left')+'</div>'
        +'<div class="mswipe-page" style="overflow-y:auto">'+colHTML(p2,'right')+'</div>'
        +'</div>'
        +'<div class="mswipe-dots">'
        +'<span class="mswipe-dot active" onclick="goModalSlide(0)"><span style="font-size:9px;font-style:italic;display:block;margin-top:2px">'+p1.latin.split(' ')[0]+'</span></span>'
        +'<span class="mswipe-dot" onclick="goModalSlide(1)"><span style="font-size:9px;font-style:italic;display:block;margin-top:2px">'+p2.latin.split(' ')[0]+'</span></span>'
        +'</div>'
      : '<div class="cmp-body">'
        +colHTML(p1,'left')
        +'<div class="cmp-divider"><div class="cmp-vs">VS</div></div>'
        +colHTML(p2,'right')
        +'</div>'
    )
    +'</div></div>';

  if(isMobile) initModalSwipe();
}

function openModal(id){
  const p=plants.find(x=>x.id===id); if(!p)return;
  // Tous les champs remplis — KFIELDS_N2 + type + usageAmenagement
  const KALL_MODAL=[
    ...KFIELDS_N2,
    {key:'type',             label:'Type végétal'},
    {key:'usageAmenagement', label:'Usage aménagement'},
  ];
  const fields=KALL_MODAL.filter(f=>p[f.key]).map(f=>`<div style="background:rgba(19,48,29,.6);border:1px solid rgba(74,184,112,.12);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column"><div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(200,223,204,.55);margin-bottom:3px">${f.label}</div><div style="font-size:12px;color:var(--cr);font-weight:600">${p[f.key]}</div></div>`).join('');
  const _allPhotosModal = [p.photo, p.photo2, p.photo3, p.photo4].filter(Boolean);
  const photoHTML = _allPhotosModal.length
    ? _allPhotosModal.map(ph=>`<img src="${ph}" class="modal-img-full" style="margin-top:8px" onerror="this.style.display='none'" loading="lazy"/>`).join('')
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
          <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button onclick="showFicheComplete(${p.id})" style="padding:9px 16px;background:rgba(74,184,112,.12);border:1px solid rgba(74,184,112,.3);border-radius:10px;color:var(--g4);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📋 Fiche complète</button><button onclick="exportFichePDF(${p.id})" style="padding:9px 16px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:10px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📄 PDF</button></div>
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
          ${(()=>{
            const _ph=[p.photo,p.photo2,p.photo3,p.photo4].filter(Boolean);
            if(!_ph.length) return `<div class="modal-img-fb">${LEAF_SVG}</div>`;
            if(_ph.length===1) return `<img src="${_ph[0]}" class="modal-img" style="object-fit:contain;background:#071610" onerror="this.style.display='none'" loading="lazy"/>`;
            const cols=_ph.length>=3?'1fr 1fr 1fr':'1fr 1fr';
            return `<div style="display:grid;grid-template-columns:${cols};gap:8px;margin:12px 0 16px">`
              +_ph.map(ph=>`<img src="${ph}" class="modal-img" style="margin:0;height:220px;object-fit:contain;background:#071610" onerror="this.style.display='none'" loading="lazy"/>`).join('')
              +'</div>';
          })()}
          <div style="padding:0 28px 28px 28px">
          ${fields?`<div class="modal-grid">${fields}</div>`:''}
          ${p.description?`<div class="modal-sec-title">Description</div><div class="modal-sec-text">${p.description}</div>`:''}
          <div style="margin-top:18px;display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button onclick="showFicheComplete(${p.id})" style="padding:9px 16px;background:rgba(74,184,112,.12);border:1px solid rgba(74,184,112,.3);border-radius:10px;color:var(--g4);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📋 Fiche complète</button><button onclick="exportFichePDF(${p.id})" style="padding:9px 16px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:10px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📄 PDF</button></div>
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
//  FICHE COMPLÈTE — Modal étendu avec tous les champs v17
// ══════════════════════════════════════════════════════
function showFicheComplete(id){
  const p=plants.find(x=>x.id===id); if(!p)return;

  // Bloc identité
  const classeTag = p.classe ? `<span style="display:inline-block;padding:2px 10px;border-radius:100px;font-size:11px;background:rgba(74,184,112,.1);color:var(--g4);border:1px solid rgba(74,184,112,.2);margin-left:6px">${p.classe}</span>` : '';
  const feuillageTag = p.feuillage ? `<span style="display:inline-block;padding:2px 10px;border-radius:100px;font-size:11px;background:rgba(100,160,255,.12);color:#a0c4ff;border:1px solid rgba(100,160,255,.2);margin-left:6px">${p.feuillage==='Caduc'?'🍂':p.feuillage==='Persistant'?'🌿':'🍁'} ${p.feuillage}</span>` : '';

  function row(label, val){ return val ? `<div style="background:rgba(19,48,29,.6);border:1px solid rgba(74,184,112,.12);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column"><div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(200,223,204,.55);margin-bottom:3px">${label}</div><div style="font-size:12px;color:var(--cr);font-weight:600">${val}</div></div>` : ''; }

  // Sections
  const secIdent = [
    row('Famille', p.famille),
    row('Type végétal', p.type),
    row('Classe', p.classe),
  ].filter(Boolean).join('');

  const secMorpho = [
    row('Port / Silhouette', p.port),
    row('Hauteur adulte', p.hauteurAdulte),
    row('Largeur adulte', p.largeurAdulte),
    row('Vitesse de croissance', p.vitesseCroissance),
    row('Feuillage', p.feuillage),
    row('Couleur du limbe', p.couleurLimbe),
    row('Forme du limbe', p.formeLimbe),
    row('Longueur du limbe', p.longueurLimbe),
    row('Largeur du limbe', p.largeurLimbe),
    row('Pétiole', p.longueurPetiole),
    row('Couleur du pétiole', p.couleurPetiole),
    row('Texture', p.texture),
  ].filter(Boolean).join('');

  const secFlo = [
    row('Période de floraison', p.periodeFloraison),
    row('Couleur des fleurs', p.couleurFleurs),
    row('Parfumé', p.parfum),
    row('Intérêt esthétique', p.interetEsthetique),
    row('Reproduction', p.reproduction),
    row('Pollinisation', p.pollinisation),
    p.typeInflorescence ? row('Inflorescence', p.typeInflorescence + (p.dimInflo?' — '+p.dimInflo:'') + (p.dimFleur?', fleur '+p.dimFleur:'')) : '',
  ].filter(Boolean).join('');

  const secMilieu = [
    row('Exposition', p.exposition),
    row('Rusticité', p.rusticite),
    row('pH du sol', p.ph),
    row('Humidité du sol', p.humidite),
    row('Structure du sol', p.structureSol),
  ].filter(Boolean).join('');

  const secEntretien = [
    row('Type de taille', p.typeTaille),
    row('Fréquence de taille', p.frequenceTaille),
  ].filter(Boolean).join('');

  const secUsage = [
    row('Intérêt ornemental', p.interetOrnemental),
    row('Autres intérêts', p.autresInterets),
    row('Usage aménagement', p.usageAmenagement),
    row('Particularités', p.particularites),
  ].filter(Boolean).join('');

  const secBio = [
    row('Biodiversité', p.biodiversite),
    row('Contraintes', p.contraintes),
  ].filter(Boolean).join('');

  function section(titre, content){
    return content ? `<div style="margin-top:14px"><div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(74,184,112,.6);margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(74,184,112,.1)">${titre}</div><div class="modal-grid">${content}</div></div>` : '';
  }

  const allPhotos = [p.photo,p.photo2,p.photo3,p.photo4].filter(Boolean);
  // Photo principale contain (plante entière visible) + miniatures cliquables si plusieurs
  let photoHTML;
  if(!allPhotos.length){
    photoHTML = `<div class="modal-img-fb">${LEAF_SVG}</div>`;
  } else {
    const mainStyle='width:100%;max-height:340px;object-fit:contain;background:#071610;border-radius:12px;display:block;margin-bottom:6px';
    const thumbs=allPhotos.length>1?allPhotos.map((ph,i)=>`<img src="${ph}" onclick="var m=document.getElementById('fiche-main-photo');if(m){m.src=this.src;document.querySelectorAll('.fiche-thumb').forEach(t=>t.style.borderColor='transparent');this.style.borderColor='var(--g4)'}" class="fiche-thumb" style="width:56px;height:46px;object-fit:cover;border-radius:7px;cursor:pointer;border:2px solid ${i===0?'var(--g4)':'transparent'};opacity:${i===0?'1':'.6'};transition:all .2s" onmouseover="this.style.opacity='1'" onmouseout="if(this.style.borderColor!=='var(--g4)')this.style.opacity='.6'" onerror="this.parentNode.removeChild(this)" loading="lazy"/>`).join(''):'';
    photoHTML = `<div style="margin:10px 0 14px">
      <img src="${allPhotos[0]}" id="fiche-main-photo" style="${mainStyle}" onerror="this.style.display='none'" loading="lazy"/>
      ${thumbs?`<div style="display:flex;gap:5px;flex-wrap:wrap">${thumbs}</div>`:''}
    </div>`;
  }

  document.getElementById('overlay-root').innerHTML=`
    <div class="modal-bg" onclick="if(event.target===this)closeModal()">
      <div class="modal" style="max-width:700px">
        <div style="padding:24px 54px 0 24px;position:relative">
          <button class="modal-close" onclick="closeModal()">✕</button>
          ${p.famille?`<div class="modal-famille">${p.famille}</div>`:''}
          <div class="modal-latin">${p.latin}</div>
          <div class="modal-common">${p.nom||''}${feuillageTag}${classeTag}</div>
        </div>
        ${photoHTML}
        <div style="padding:0 24px 24px">
          ${section('🪪 Identité', secIdent)}
          ${section('📐 Morphologie & feuillage', secMorpho)}
          ${section('🌸 Floraison & reproduction', secFlo)}
          ${section('🌍 Milieu & sol', secMilieu)}
          ${section('✂️ Entretien', secEntretien)}
          ${section('🏡 Usage & intérêts', secUsage)}
          ${section('🦋 Biodiversité & contraintes', secBio)}
          ${p.description?`<div class="modal-sec-title" style="margin-top:14px">Notes</div><div class="modal-sec-text">${p.description}</div>`:''}
          <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
            <button onclick="closeModal();openModal(${p.id})" style="padding:9px 16px;background:rgba(74,184,112,.08);border:1px solid rgba(74,184,112,.2);border-radius:10px;color:var(--g4);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">← Fiche simple</button>
            <button onclick="exportFichePDF(${p.id})" style="padding:9px 16px;background:rgba(232,160,32,.12);border:1px solid rgba(232,160,32,.35);border-radius:10px;color:var(--am2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">📄 PDF</button>
          </div>
        </div>
      </div>
    </div>`;
}


// ══════════════════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════════════════
function switchAdminTab(tab){
  ['plantes','cloud','mdp','multi','glossaire'].forEach(t=>{
    document.getElementById('admin-tab-'+t).style.display = t===tab?'':'none';
    document.getElementById('atab-'+t).classList.toggle('active', t===tab);
  });
  if(tab==='cloud') renderCloudBannerTab();
  if(tab==='mdp')   renderMdpTab();
  if(tab==='multi') renderMultiTab();
  if(tab==='glossaire') renderGlossList();
}
// ══ Normalisation nom de famille botanique ══════════
// ══════════════════════════════════════════════════════
//  GLOSSAIRE ADMIN — Chargement & CRUD
// ══════════════════════════════════════════════════════

// Glossaire runtime : surcharge les entrées FORM_GL
var runtimeGloss = {};

// showFormGloss utilise runtimeGloss en priorité sur FORM_GL
function showFormGloss(key){
  const g = runtimeGloss[key] || FORM_GL[key];
  if(!g) return;
  const ov = document.getElementById('fg-ov');
  const ct = document.getElementById('fg-ct');
  if(!ov||!ct) return;
  ct.innerHTML = '<div style="font-size:14px;font-weight:700;color:#4ab870;margin-bottom:7px">' + g.t + '</div>'
    + '<div style="font-size:12px;color:rgba(200,223,204,.7);line-height:1.6">' + g.d + '</div>'
    + (g.e ? '<div style="font-size:11px;color:rgba(200,223,204,.35);margin-top:5px;font-style:italic">Ex. : ' + g.e + '</div>' : '');
  ov.style.display = 'flex';
}

// Charger le glossaire personnalisé (localStorage + Supabase si cloud)
async function loadGlossaire(){
  runtimeGloss = {};
  // Toujours charger depuis localStorage d'abord
  try {
    const loc = JSON.parse(localStorage.getItem(SK_GLOSS)||'{}');
    Object.assign(runtimeGloss, loc);
  } catch(e){}
  // Si cloud disponible, charger depuis Supabase et fusionner
  if(cloudOk && window.SUPA_URL && window.SUPA_KEY){
    try {
      const hdr = {'apikey':window.SUPA_KEY,'Authorization':'Bearer '+window.SUPA_KEY};
      const r = await fetch(window.SUPA_URL+'/rest/v1/floralab_glossaire?select=*',{headers:hdr});
      if(r.ok){
        const rows = await r.json();
        rows.forEach(row=>{
          runtimeGloss[row.key] = {t:row.titre, d:row.definition, e:row.exemple||''};
        });
        // Sync localStorage avec la version cloud
        try { localStorage.setItem(SK_GLOSS, JSON.stringify(runtimeGloss)); }catch(e){}
      }
    } catch(e){ /* cloud indisponible, on garde le localStorage */ }
  }
}

// Sauvegarder une entrée (localStorage + Supabase si cloud)
async function saveGlossEntry(key, titre, definition, exemple){
  const entry = {t:titre, d:definition, e:exemple};
  runtimeGloss[key] = entry;
  // localStorage
  try { localStorage.setItem(SK_GLOSS, JSON.stringify(runtimeGloss)); }catch(e){}
  // Supabase
  if(cloudOk && window.SUPA_URL && window.SUPA_KEY){
    try {
      const hdr = {
        'apikey':window.SUPA_KEY,'Authorization':'Bearer '+window.SUPA_KEY,
        'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'
      };
      await fetch(window.SUPA_URL+'/rest/v1/floralab_glossaire',{
        method:'POST',
        headers:hdr,
        body:JSON.stringify({key, titre, definition, exemple:exemple||null})
      });
    } catch(e){ cqLog('Erreur Supabase glossaire:', e); }
  }
}

// Supprimer une entrée personnalisée
async function deleteGlossEntry(key){
  delete runtimeGloss[key];
  try { localStorage.setItem(SK_GLOSS, JSON.stringify(runtimeGloss)); }catch(e){}
  if(cloudOk && window.SUPA_URL && window.SUPA_KEY){
    try {
      const hdr = {'apikey':window.SUPA_KEY,'Authorization':'Bearer '+window.SUPA_KEY};
      await fetch(window.SUPA_URL+'/rest/v1/floralab_glossaire?key=eq.'+encodeURIComponent(key),{
        method:'DELETE', headers:hdr
      });
    } catch(e){ cqLog('Erreur Supabase suppression glossaire:', e); }
  }
}

// Rendu de la liste glossaire dans l'admin
function renderGlossList(filterStr){
  const container = document.getElementById('gloss-list');
  if(!container) return;

  // Fusionner FORM_GL (intégré) + runtimeGloss (personnalisé)
  const all = {};
  Object.entries(FORM_GL).forEach(([k,v])=>{ all[k]={...v, _builtin:true, _overridden:!!runtimeGloss[k]}; });
  Object.entries(runtimeGloss).forEach(([k,v])=>{
    if(all[k]) all[k] = {...v, _builtin:true, _overridden:true};
    else all[k] = {...v, _builtin:false, _overridden:false};
  });

  // Trier alphabétiquement par titre
  let entries = Object.entries(all).map(([k,v])=>({key:k,...v}));
  entries.sort((a,b)=>(a.t||'').localeCompare(b.t||'','fr',{sensitivity:'base'}));

  // Filtrer
  const fs = (filterStr||'').toLowerCase().trim();
  if(fs) entries = entries.filter(e=>
    (e.key||'').includes(fs) ||
    (e.t||'').toLowerCase().includes(fs) ||
    (e.d||'').toLowerCase().includes(fs)
  );

  // Badge
  const badge = document.getElementById('sidebar-badge-gloss');
  const nbCustom = Object.keys(runtimeGloss).length;
  if(badge){
    badge.style.display = nbCustom>0?'':'none';
    badge.textContent = nbCustom;
  }

  if(!entries.length){
    container.innerHTML = '<div class="empty"><span class="empty-icon">📖</span><p>Aucun terme trouvé.</p></div>';
    return;
  }

  container.innerHTML = entries.map(e=>{
    const isModif = e._overridden;
    const isCustom = !e._builtin;
    let tag = '';
    if(isCustom) tag = '<span style="font-size:9px;padding:1px 7px;border-radius:20px;background:rgba(74,184,112,.18);color:#4ab870;margin-left:6px;font-weight:700;vertical-align:middle">PERSO</span>';
    else if(isModif) tag = '<span style="font-size:9px;padding:1px 7px;border-radius:20px;background:rgba(232,160,32,.15);color:#e8a020;margin-left:6px;font-weight:700;vertical-align:middle">MODIF.</span>';
    else tag = '<span style="font-size:9px;padding:1px 7px;border-radius:20px;background:rgba(200,223,204,.08);color:rgba(200,223,204,.3);margin-left:6px;vertical-align:middle">intégré</span>';

    // Valeur affichée : perso si disponible, sinon intégré
    const disp = runtimeGloss[e.key] || FORM_GL[e.key] || e;

    return '<div class="admin-row" style="align-items:flex-start;gap:10px">'
      + '<div style="flex:1;min-width:0">'
      +   '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px">'
      +     '<span style="font-family:monospace;font-size:11px;color:rgba(200,223,204,.4);flex-shrink:0">' + e.key + '</span>'
      +     tag
      +   '</div>'
      +   '<div style="font-size:13px;font-weight:600;color:var(--cr);margin-bottom:3px">' + (disp.t||'') + '</div>'
      +   '<div style="font-size:12px;color:rgba(200,223,204,.6);line-height:1.5">' + (disp.d||'') + '</div>'
      +   (disp.e?'<div style="font-size:11px;color:rgba(200,223,204,.35);margin-top:3px;font-style:italic">Ex. : '+disp.e+'</div>':'')
      + '</div>'
      + '<div class="admin-btns" style="flex-shrink:0">'
      +   '<button class="edit-btn" onclick="openGlossForm(\'' + e.key + '\')">✏️</button>'
      +   (isCustom||isModif
          ? '<button class="del-btn" onclick="confirmDeleteGloss(\'' + e.key + '\','+isCustom+')" title="'+(isCustom?'Supprimer':'Réinitialiser')+'">🗑️</button>'
          : '')
      + '</div>'
      + '</div>';
  }).join('');
}

function filterGlossList(v){ renderGlossList(v); }

async function confirmDeleteGloss(key, isCustom){
  const msg = isCustom
    ? 'Supprimer le terme "'+key+'" ?\nIl n\'existe pas dans la liste intégrée.'
    : 'Réinitialiser "'+key+'" ?\nLa définition personnalisée sera supprimée,\nla version intégrée sera restaurée.';
  if(!confirm(msg)) return;
  await deleteGlossEntry(key);
  renderGlossList(document.getElementById('gloss-search')?.value||'');
}

// Formulaire ajout / modification
function openGlossForm(key){
  const existing = key ? (runtimeGloss[key] || FORM_GL[key] || {}) : {};
  const isNew = !key;
  const title = isNew ? '+ Nouveau terme' : 'Modifier — ' + (existing.t||key);

  document.getElementById('overlay-root').innerHTML =
    '<div class="form-bg" onclick="if(event.target===this)closeForm()">'
    + '<div class="form-card" style="max-width:560px">'
    + '<div class="form-title">' + title + '</div>'
    + '<div class="form-grid">'
    // Clé
    + '<div class="fg full">'
    +   '<label class="fl">Clé (identifiant interne)</label>'
    +   '<input class="fi" id="gf-key" placeholder="ex: stolonifere" value="' + (key||'') + '"'
    +   (key?' readonly style="opacity:.5;cursor:not-allowed"':'') + '/>'
    +   '<div style="font-size:10px;color:rgba(200,223,204,.3);margin-top:2px">Minuscules, sans espaces ni accents. Sert à lier le <span style="font-family:monospace">?</span> dans le formulaire végétal.</div>'
    + '</div>'
    // Titre
    + '<div class="fg full">'
    +   '<label class="fl">Titre affiché *</label>'
    +   '<input class="fi" id="gf-titre" placeholder="ex: Stolonifère" value="' + (existing.t||'').replace(/"/g,'&quot;') + '"/>'
    + '</div>'
    // Définition
    + '<div class="fg full">'
    +   '<label class="fl">Définition *</label>'
    +   '<textarea class="fi" id="gf-def" rows="4" style="resize:vertical">' + (existing.d||'') + '</textarea>'
    + '</div>'
    // Exemple
    + '<div class="fg full">'
    +   '<label class="fl">Exemple (facultatif)</label>'
    +   '<input class="fi" id="gf-ex" placeholder="ex: Fragaria (Fraisier), Ajuga reptans." value="' + (existing.e||'').replace(/"/g,'&quot;') + '"/>'
    + '</div>'
    + '</div>'
    + '<div class="form-actions">'
    +   '<button class="cancel-btn" onclick="closeForm()">Annuler</button>'
    +   '<button class="save-btn" onclick="submitGlossForm()">✅ Enregistrer</button>'
    + '</div>'
    + '</div></div>';
}

async function submitGlossForm(){
  const key   = (document.getElementById('gf-key')?.value||'').trim().toLowerCase().replace(/\s+/g,'_');
  const titre = (document.getElementById('gf-titre')?.value||'').trim();
  const def   = (document.getElementById('gf-def')?.value||'').trim();
  const ex    = (document.getElementById('gf-ex')?.value||'').trim();

  if(!key)   { alert('⚠️ La clé est obligatoire.'); return; }
  if(!titre) { alert('⚠️ Le titre est obligatoire.'); return; }
  if(!def)   { alert('⚠️ La définition est obligatoire.'); return; }

  await saveGlossEntry(key, titre, def, ex||null);
  closeForm();
  renderGlossList(document.getElementById('gloss-search')?.value||'');
}


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
        const hdr={'apikey':window.SUPA_KEY,'Authorization':'Bearer '+window.SUPA_KEY,'Prefer':'count=exact','Range':'0-0'};
        const rSolo = await fetch(window.SUPA_URL+'/rest/v1/floralab_scores?select=id',{headers:hdr});
        const rMulti = await fetch(window.SUPA_URL+'/rest/v1/floralab_session_players?select=id&done=eq.true',{headers:hdr});
        const cSolo = rSolo.headers.get('content-range');
        const cMulti = rMulti.headers.get('content-range');
        const nSolo = cSolo ? (parseInt(cSolo.split('/')[1])||0) : 0;
        const nMulti = cMulti ? (parseInt(cMulti.split('/')[1])||0) : 0;
        if(nSolo===0 && nMulti===0){ statSc.textContent='—'; return; }
        statSc.innerHTML = `<span style="color:var(--g4)">${nSolo}</span> solo &nbsp;·&nbsp; <span style="color:#7ab8f5">${nMulti}</span> multi`;
        // Agrandir la carte pour que le texte tienne
        const card = statSc.closest('.admin-stat-card');
        if(card) card.style.minWidth='160px';
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

// ── Suppression joueur solo dans les stats ──
async function deletePlayerStats(name){
  if(!confirm(`Supprimer toutes les données de "${name}" ?\n(scores solo, erreurs)\nAction irréversible.`)) return;
  try{
    if(cloudOk){
      await sbDelete('floralab_scores','name=eq.'+encodeURIComponent(name));
      await loadScores();
    } else {
      scores = scores.filter(s=>s.name!==name);
      try{ localStorage.setItem(SK_SCORES,JSON.stringify(scores)); }catch(e){}
    }
  }catch(e){ alert('Erreur lors de la suppression des scores : '+e.message); return; }
  // Erreurs localStorage
  try{
    let allErrors=JSON.parse(localStorage.getItem(SK_ERRORS)||'{}');
    delete allErrors[name];
    localStorage.setItem(SK_ERRORS,JSON.stringify(allErrors));
  }catch(e){}
  renderStats();
}

// ── Suppression session multijoueur ──
async function deleteMultiSession(code){
  if(!confirm(`Supprimer la session "${code}" et tous ses joueurs ?\nAction irréversible.`)) return;
  try{
    await sbDelete('floralab_session_players','session_code=eq.'+encodeURIComponent(code));
    await sbDelete('floralab_sessions','code=eq.'+encodeURIComponent(code));
  }catch(e){ alert('Erreur lors de la suppression : '+e.message); return; }
  renderStats();
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
// ══ GENERIC PICKER (cm / pétiole) ══
function _renderGPicker(fieldId,currentVal,arr,store,pfx){
  let minIdx=null,maxIdx=null;
  if(currentVal){
    const idx=arr.indexOf(currentVal);
    if(idx>=0){minIdx=idx;}
    else{
      // Try "X – Y" range
      const m=currentVal.match(/^(.+?)\s*–\s*(.+)$/);
      if(m){
        const a=arr.findIndex(x=>x===m[1].trim()||x.startsWith(m[1].trim()));
        const b=arr.findIndex(x=>x===m[2].trim()||x.endsWith(m[2].trim()));
        if(a>=0&&b>=0){minIdx=Math.min(a,b);maxIdx=Math.max(a,b);}
      }
    }
  }
  store[fieldId]={min:minIdx,max:maxIdx,arr};
  const btns=arr.map((t,i)=>{
    let cls='size-btn';
    if(minIdx!==null&&maxIdx!==null){
      if(i===minIdx)cls+=' range-start';
      else if(i===maxIdx)cls+=' range-end';
      else if(i>minIdx&&i<maxIdx)cls+=' range-mid';
    }else if(i===minIdx)cls+=' range-start';
    return `<button type="button" class="${cls}" onclick="clickGP('${pfx}','${fieldId}',${i})">${t}</button>`;
  }).join('');
  const disp=currentVal||'—';
  return `<input type="hidden" id="f-${fieldId}" value="${currentVal||''}"/>
    <div class="size-picker"><div class="size-grid" id="sgp-${pfx}-${fieldId}">${btns}</div></div>
    <div class="size-hint">1er clic = valeur · 2e clic = borne haute</div>
    <div class="size-display" id="sdp-${pfx}-${fieldId}">📏 ${disp}</div>`;
}
function renderCmPicker(fid,val){return _renderGPicker(fid,val,TAILLES_CM,cmPickers,'cm');}
function renderPetiolePicker(fid,val){return _renderGPicker(fid,val,TAILLES_PETIOLE,ptPickers,'pt');}
function clickGP(pfx,fid,idx){
  const store=pfx==='cm'?cmPickers:ptPickers;
  if(!store[fid])return;
  const s=store[fid];
  if(s.min===null){s.min=idx;s.max=null;}
  else if(s.max===null){if(idx===s.min)s.min=null;else if(idx>s.min)s.max=idx;else{s.min=idx;s.max=null;}}
  else{s.min=idx;s.max=null;}
  updateGP(pfx,fid);
}
function updateGP(pfx,fid){
  const store=pfx==='cm'?cmPickers:ptPickers;
  if(!store[fid])return;
  const {min,max,arr}=store[fid];
  const grid=document.getElementById('sgp-'+pfx+'-'+fid);
  if(grid)grid.querySelectorAll('.size-btn').forEach((b,i)=>{
    b.className='size-btn';
    if(min!==null&&max!==null){
      if(i===min)b.classList.add('range-start');
      else if(i===max)b.classList.add('range-end');
      else if(i>min&&i<max)b.classList.add('range-mid');
    }else if(i===min)b.classList.add('range-start');
  });
  let val='',disp='—';
  if(min!==null&&max!==null&&min!==max){val=arr[min]+' – '+arr[max];disp=val;}
  else if(min!==null){val=arr[min];disp=val;}
  const inp=document.getElementById('f-'+fid);if(inp)inp.value=val;
  const dispEl=document.getElementById('sdp-'+pfx+'-'+fid);if(dispEl)dispEl.textContent='📏 '+disp;
}

// ══ LEAF COLOR PICKER ══
function renderLeafColorPicker(fieldId,currentVal,colors,icon){
  const sel=new Set((currentVal||'').split(/\s*,\s*/).map(s=>s.trim()).filter(Boolean));
  const btns=colors.map(c=>{
    const isSel=sel.has(c.nom);
    return `<div class="color-swatch${isSel?' selected':''}" onclick="toggleLeafColor('${fieldId}','${c.nom.replace(/'/g,"\\'") }',this)" title="${c.nom}">
      <div class="dot" style="background:${c.css}"></div>
      <span class="clabel">${c.nom}</span>
    </div>`;
  }).join('');
  const disp=currentVal||'—';
  return `<input type="hidden" id="f-${fieldId}" value="${(currentVal||'').replace(/"/g,'&quot;')}"/>
    <div class="color-grid" id="color-grid-${fieldId}">${btns}</div>
    <div class="color-display" id="color-display-${fieldId}">${icon||'🍃'} ${disp}</div>`;
}
function toggleLeafColor(fid,nom,el){
  el.classList.toggle('selected');
  const val=Array.from(document.querySelectorAll('#color-grid-'+fid+' .color-swatch.selected')).map(s=>s.title).join(', ');
  document.getElementById('f-'+fid).value=val;
  document.getElementById('color-display-'+fid).textContent='🍃 '+(val||'—');
}

// ══ FORM CHIPS (generic) ══
// Single-select: setSFChip(el,fieldId,gridId,displayId)
// Multi-select:  fChip(el,fieldId,gridId,displayId)
function fChip(el,fieldId,gridId,displayId){
  event.stopPropagation();
  el.classList.toggle('selected');
  const v=Array.from(document.querySelectorAll('#'+gridId+' .type-chip.selected')).map(c=>c.dataset.val||c.textContent.trim().replace(/\s*\?.*$/,'')).join(', ');
  const inp=document.getElementById(fieldId);if(inp)inp.value=v;
  const disp=document.getElementById(displayId);if(disp)disp.textContent=v||'—';
}
function setSFChip(el,fieldId,gridId,displayId){
  event.stopPropagation();
  document.querySelectorAll('#'+gridId+' .type-chip').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  const v=el.dataset.val||el.textContent.trim().replace(/\s*\?.*$/,'');
  const inp=document.getElementById(fieldId);if(inp)inp.value=v;
  const disp=document.getElementById(displayId);if(disp)disp.textContent=v||'—';
}
function updateExpoChips(){
  const ORDER=['Ombre','Mi-ombre','Soleil'];
  const sel=ORDER.filter(v=>{
    const el=document.querySelector('#expo-chips [data-val="'+v+'"]');
    return el&&el.classList.contains('selected');
  });
  const val=sel.join(' – ');
  document.getElementById('f-exposition').value=val;
  document.getElementById('expo-display').textContent=val||'—';
}

// ══ FORM GLOSSAIRE ══
var FORM_GL={
  famille:{t:'Famille botanique',d:'Regroupement de genres partageant des caractères communs. La terminaison standard est -aceae.',e:'Lamiaceae (Lavande, Menthe), Rosaceae (Rosa, Prunus).'},
  arbuste:{t:'Arbuste',d:'Végétal ligneux ramifié dès la base, sans tronc dominant, de 0,5 à 7 m à l\'âge adulte.',e:'Viburnum, Buddleja, Cornus.'},
  arbre:{t:'Arbre',d:'Végétal ligneux à tronc unique et bien défini, dépassant généralement 7 m à maturité.',e:'Quercus robur, Betula, Platanus.'},
  conifere:{t:'Conifère',d:'Arbre ou arbuste à feuillage le plus souvent persistant (aiguilles ou écailles), à cônes, gymnosperme.',e:'Pinus, Cupressus, Taxus.'},
  vivace:{t:'Vivace',d:'Plante dont la partie aérienne disparaît en hiver mais dont la souche survit et repart au printemps.',e:'Lavandula, Salvia, Pennisetum.'},
  annuelle:{t:'Annuelle / bisannuelle',d:'Annuelle : cycle complet en une saison. Bisannuelle : végétation 1re année, floraison et graine 2e année.',e:'Tagetes (annuelle). Digitalis purpurea (bisannuelle).'},
  grimpant:{t:'Grimpant',d:'Plante s\'élevant en s\'accrochant à un support par vrilles, crampons, volubilité ou appui.',e:'Hedera, Wisteria, Clematis.'},
  graminee:{t:'Graminée / Graminoïde',d:'Famille Poaceae ou plantes à port similaire. Feuilles linéaires, tiges souvent creuses.',e:'Festuca, Miscanthus, Cortaderia.'},
  bambou:{t:'Bambou',d:'Graminée ligneuse à croissance rapide. Attention au caractère traçant possible.',e:'Phyllostachys (traçant), Fargesia (non traçant).'},
  fougere:{t:'Fougère',d:'Plante vasculaire sans fleurs ni graines, se reproduisant par spores. Feuilles généralement découpées (frondes).',e:'Dryopteris, Polypodium, Osmunda.'},
  port:{t:'Silhouette générale',d:'La forme naturelle du végétal à l\'âge adulte, sans taille. Critère fondamental en composition paysagère.'},
  erige:{t:'Érigé',d:'Branches dressées verticalement autour d\'un axe, port élancé.',e:'Prunus \'Amanogawa\', Ilex crenata \'Sky Pencil\'.'},
  fastigie:{t:'Fastigié',d:'Forme extrême du port érigé : branches très serrées contre l\'axe, silhouette en colonne très étroite.',e:'Populus nigra \'Italica\', Carpinus betulus \'Fastigiata\'.'},
  boule:{t:'Boule',d:'Port sphérique naturel, presque aussi large que haut.',e:'Robinia pseudoacacia \'Umbraculifera\'.'},
  buissonnant:{t:'Arrondi / Buissonnant',d:'Port dense et arrondi, ramifié depuis la base, légèrement plus large que haut.',e:'Viburnum tinus, Pittosporum tobira.'},
  etale:{t:'Étalé / Rampant',d:'Branches horizontales ou retombantes, largeur supérieure à la hauteur.',e:'Cotoneaster horizontalis, Juniperus squamata \'Blue Carpet\'.'},
  pyramidal:{t:'Pyramidal / Conique',d:'Port triangulaire, plus large à la base. Typique des conifères.',e:'Picea abies, Abies concolor.'},
  pleureur:{t:'Pleureur',d:'Branches retombant naturellement sous leur propre poids.',e:'Betula pendula, Salix babylonica.'},
  grimpant_port:{t:'Grimpant (port)',d:'Port non autoportant nécessitant un support.',e:'Hedera helix, Parthenocissus.'},
  feuillage:{t:'Comportement saisonnier',d:'Caduc : feuilles tombant en automne. Persistant : renouvellement progressif. Marcescent : feuilles mortes restant en hiver. Semi-persistant : perd une partie selon le climat.'},
  caduc:{t:'Caduc',d:'Toutes les feuilles tombent en automne, le végétal est nu l\'hiver.',e:'Fagus sylvatica, Acer palmatum.'},
  persistant:{t:'Persistant',d:'Feuillage présent toute l\'année, renouvelé progressivement sans nudité hivernale.',e:'Prunus laurocerasus, Ilex aquifolium.'},
  marcescent:{t:'Marcescent',d:'Feuilles mortes restant accrochées tout l\'hiver, tombant au printemps à la nouvelle pousse.',e:'Carpinus betulus, Fagus sylvatica (adulte).'},
  semi_persistant:{t:'Semi-persistant',d:'Caduc en zone froide, persistant en zone douce.',e:'Viburnum tinus dans le Nord de la France.'},
  limbe:{t:'Limbe foliaire',d:'Partie élargie et aplatie de la feuille, siège de la photosynthèse.'},
  petiole:{t:'Pétiole',d:'Tige reliant le limbe à la tige. Absent = feuille sessile.',e:'Sessile : Lavandula. Long pétiole : Cercis.'},
  texture:{t:'Texture du feuillage',d:'Impression tactile et visuelle produite par la taille et la surface des feuilles. Critère fort en composition.'},
  texture_fine:{t:'Texture fine',d:'Petites feuilles créant un effet léger et aérien.',e:'Festuca, Lavandula, Salix.'},
  texture_grosse:{t:'Texture grossière / Large',d:'Grandes feuilles créant un effet massif et structurant.',e:'Magnolia grandiflora, Fatsia japonica.'},
  coriace:{t:'Coriace',d:'Feuille épaisse, dure, résistante, caractéristique des persistants.',e:'Prunus laurocerasus, Ilex aquifolium.'},
  epineux:{t:'Épineuse',d:'Surface ou bord portant des piquants. Risque de blessure lors des travaux.',e:'Ilex aquifolium, Mahonia.'},
  aciculaire:{t:'Aciculaire',d:'En forme d\'aiguille : très fine, longue et pointue.',e:'Pinus sylvestris, Picea abies.'},
  lineaire:{t:'Linéaire',d:'Longue et étroite, bords parallèles. Rapport L/l > 5.',e:'Lavandula angustifolia, Festuca.'},
  lanceole:{t:'Lancéolé',d:'Plus large vers la base, se rétrécissant vers le sommet comme un fer de lance.',e:'Salix alba, Ligustrum.'},
  oblanceole:{t:'Oblancéolé',d:'Lancéolé inversé : plus large vers le sommet.',e:'Magnolia stellata.'},
  ensiforme:{t:'Ensiforme',d:'En forme d\'épée : aplati, allongé, deux bords tranchants.',e:'Iris germanica.'},
  ovale:{t:'Ovale',d:'Plus large vers la base, se rétrécissant vers le sommet.',e:'Prunus laurocerasus.'},
  obovale:{t:'Obovale',d:'Ovale inversé : plus large vers le sommet.',e:'Magnolia grandiflora.'},
  elliptique:{t:'Elliptique',d:'Plus large au milieu, rétrécissant vers les deux extrémités.',e:'Viburnum tinus.'},
  orbiculaire:{t:'Orbiculaire',d:'Presque parfaitement circulaire.',e:'Farfugium japonicum.'},
  reniforme:{t:'Réniforme',d:'En forme de rein, échancrure à la base.',e:'Asarum europaeum.'},
  deltoide:{t:'Deltoïde',d:'Triangulaire, base large, sommet pointu.',e:'Populus nigra.'},
  cordiforme:{t:'Cordiforme',d:'En forme de cœur, échancrure à la base.',e:'Cercis siliquastrum, Tilia.'},
  sagitte:{t:'Sagitté',d:'En pointe de flèche, deux lobes vers le bas.',e:'Sagittaria sagittifolia.'},
  spatule:{t:'Spatulé',d:'Élargi au sommet, se rétrécissant en pétiole à la base.',e:'Bellis perennis.'},
  haste:{t:'Hasté',d:'En hallebarde : deux lobes à la base divergent vers l\'extérieur.',e:'Humulus lupulus.'},
  palme:{t:'Palmé',d:'Nervures ou lobes rayonnant d\'un point central comme une main.',e:'Acer palmatum, Fatsia japonica.'},
  lobe:{t:'Lobé',d:'Lobes arrondis sans atteindre la nervure principale.',e:'Quercus robur.'},
  pinnatifide:{t:'Pinnatifide',d:'Lobes de part et d\'autre de la nervure principale comme une plume.',e:'Polypodium vulgare.'},
  trifolie:{t:'Trifolié',d:'Exactement 3 folioles distinctes.',e:'Trifolium.'},
  pelte:{t:'Pelté',d:'Pétiole fixé au centre du limbe.',e:'Tropaeolum majus.'},
  repro:{t:'Type de reproduction',d:'Hermaphrodite : organes ♂ et ♀ sur la même fleur. Monoïque : fleurs unisexuées sur le même pied. Dioïque : pieds mâles et femelles distincts.'},
  hermaphrodite:{t:'Hermaphrodite',d:'Chaque fleur porte étamines (♂) et pistil (♀). Cas le plus fréquent. Un seul pied suffit.',e:'Magnolia, Thymus, Rosa.'},
  monoique:{t:'Monoïque',d:'Fleurs mâles et femelles séparées mais sur le même individu.',e:'Betula, Quercus, Cornus.'},
  dioique:{t:'Dioïque',d:'Pieds mâles et femelles distincts. Nécessite les deux pour fructifier.',e:'Ilex aquifolium (Houx), Taxus baccata.'},
  polygame:{t:'Polygame',d:'Même individu portant fleurs mâles, femelles et hermaphrodites.',e:'Fraxinus (Frêne).'},
  pollinisation:{t:'Pollinisation',d:'Transport du pollen vers le pistil pour assurer la fécondation.'},
  entomogame:{t:'Entomogame',d:'Pollinisation par les insectes. Fleurs colorées, parfumées ou nectarifères.',e:'Thymus, Lavandula, Abelia.'},
  anemogame:{t:'Anémogame',d:'Pollinisation par le vent. Pollen abondant et léger, fleurs discrètes.',e:'Betula (allergène majeur), Graminées.'},
  zoogame:{t:'Zoogame',d:'Pollinisation par les animaux (oiseaux, chauves-souris…)',e:'Feijoa sellowiana.'},
  hydrogame:{t:'Hydrogame',d:'Pollinisation par l\'eau. Uniquement certaines plantes aquatiques.',e:'Vallisneria spiralis.'},
  inflorescence:{t:'Inflorescence',d:'Ensemble de fleurs groupées sur un même axe floral. Chaque type a une architecture propre.'},
  drageonnant:{t:'Drageonnant',d:'Se propage par des rejets issus des racines (drageons). Peut coloniser rapidement.',e:'Prunus spinosa, Robinia pseudoacacia.'},
  stolonifere:{t:'Stolonifère',d:'Se propage par des tiges rampantes (stolons) qui s\'enracinent à distance.',e:'Fragaria (Fraisier), Ajuga reptans.'},
  fructification:{t:'Fructification décorative',d:'Les fruits ou baies présentent un intérêt ornemental par leur couleur, forme ou persistance.',e:'Ilex (baies rouges), Pyracantha, Callicarpa.'},
  ecorce:{t:'Écorce décorative',d:'L\'écorce apporte un intérêt visuel, surtout hivernal : couleur, exfoliation, motifs.',e:'Betula papyrifera (blanc), Prunus serrula (brun brillant).'},
  automnal:{t:'Feuillage automnal coloré',d:'Prend des teintes vives (rouge, orange, jaune) avant la chute des feuilles.',e:'Acer palmatum, Liquidambar, Cornus.'},
  soleil:{t:'Plein soleil',d:'Plus de 6 heures d\'ensoleillement direct par jour. Exposition sud ou sud-ouest.'},
  miombre:{t:'Mi-ombre',d:'Entre 3 et 6 h de soleil direct, ou lumière indirecte toute la journée.',e:'Exposition est, ou sous couverture légère.'},
  ombre:{t:'Ombre',d:'Moins de 3 heures de soleil direct. Exposition nord ou sous couverture dense.'},
  rusticite:{t:'Rusticité',d:'Température minimale supportée en pleine terre sans protection.',e:'-15°C : continental. -5°C : littoral seulement.'},
  sol_frais:{t:'Sol frais',d:'Retient suffisamment l\'humidité sans être engorgé. Ni sec ni humide.'},
  sol_detrempe:{t:'Détrempé / Aquatique',d:'Sol saturé en eau en permanence ou temporairement.',e:'Berge de mare. Iris pseudacorus, Salix.'},
  ph:{t:'pH du sol',d:'Mesure l\'acidité ou l\'alcalinité. Conditionne la disponibilité des nutriments.',e:'Rhododendron : pH 4,5–5. Lavandula : >7.'},
  ph_acide:{t:'Acidophile (pH 4 – 5,5)',d:'Plante qui adore les sols acides (terre de bruyère). Dans un sol calcaire, elle jaunit et meurt.',e:'Rhododendron, Erica, Camellia.'},
  ph_lacide:{t:'Légèrement acide (5,5 – 6,5)',d:'Préfère un sol légèrement acide mais tolère un sol neutre.'},
  ph_neutre:{t:'Neutre (6,5 – 7,2)',d:'Sol équilibré, ni trop acide ni trop calcaire. Convient à la majorité des végétaux.'},
  ph_lbasique:{t:'Légèrement basique (7,2 – 7,8)',d:'Supporte ou apprécie un sol avec un peu de calcaire.'},
  ph_calcicole:{t:'Calcicole (> 7,8)',d:'Adore les sols calcaires / alcalins.',e:'Lavandula, Helichrysum, Clematis.'},
  structure_sol:{t:'Structure du sol',d:'Organisation physique du sol déterminant drainage, rétention et enracinement.'},
  drainant:{t:'Sol drainant',d:'Eau s\'écoulant rapidement, sol léger (sable, gravier). Idéal pour plantes xérophytes.',e:'Lavandula, Thymus, Cistus.'},
  equilibre:{t:'Sol équilibré',d:'Bon compromis drainage/rétention (sol limoneux). Convient à la majorité des végétaux.'},
  lourd:{t:'Sol lourd / Argileux',d:'Compact, retient beaucoup d\'eau. Risque d\'asphyxie racinaire en hiver.',e:'Cornus, Salix, Alnus l\'acceptent.'},
  taille:{t:'Types de taille',d:'Chaque type répond à un objectif précis et se pratique à une période spécifique.'},
  taille_formation:{t:'Taille de formation',d:'Réalisée les premières années pour donner une charpente équilibrée.',e:'Arbres de haute tige, rosiers tiges.'},
  taille_maintien:{t:'Taille de maintien',d:'Taille régulière pour équilibrer et contrôler le volume sans changer la forme.',e:'Arbustes à floraison, haies libres.'},
  recepage:{t:'Recépage',d:'Taille sévère à quelques cm du sol pour stimuler une repousse vigoureuse.',e:'Cornus alba (tiges colorées), Salix viminalis.'},
  topiaire:{t:'Haie / Topiaire',d:'Taille architecturée répétée pour formes géométriques strictes.',e:'Buxus sempervirens, Taxus baccata.'},
  haie_libre:{t:'Haie libre',d:'Espèces laissées à leur port naturel, valorisant floraisons et biodiversité. Entretien minimal.'},
  haie_taillee:{t:'Haie taillée',d:'Végétal supportant une taille géométrique répétée pour une limite végétale nette.',e:'Prunus laurocerasus, Taxus baccata.'},
  haie_champetre:{t:'Haie champêtre',d:'Mélange exclusif d\'espèces indigènes locales à port libre, favorisant biodiversité et corridors écologiques.'},
  haie_defensive:{t:'Haie défensive',d:'Végétal épineux formant une barrière infranchissable.',e:'Berberis julianae, Pyracantha, Rosa canina.'},
  bordure:{t:'Bordure',d:'Végétal < 50 cm soulignant le tracé d\'une allée ou d\'un massif.',e:'Thymus vulgaris, Lavandula nana.'},
  ecran:{t:'Écran / Brise-vue',d:'Végétal dense masquant un vis-à-vis ou coupant un couloir de vent.'},
  isole:{t:'Isolé (sujet)',d:'Végétal planté seul pour sa valeur esthétique : port remarquable, floraison spectaculaire.',e:'Magnolia grandiflora, Liquidambar.'},
  alignement:{t:'Alignement',d:'Plantation en ligne régulière pour marquer une perspective ou border une voirie.'},
  massif:{t:'Massif / Groupe',d:'Plantation groupée pour créer un volume, une tache de couleur ou une composition texturée.'},
  fond_massif:{t:'Fond de massif',d:'Végétal de grande taille en arrière-plan servant de toile de fond.'},
  point_focal:{t:'Point focal',d:'Végétal attirant le regard par une caractéristique marquante : port graphique, couleur vive.',e:'Agave, Fatsia japonica, Miscanthus.'},
  couvre_sol:{t:'Couvre-sol',d:'Végétal rampant couvrant le sol pour limiter les adventices et réduire l\'entretien.',e:'Cotoneaster dammeri, Vinca minor.'},
  talus:{t:'Fixation de talus',d:'Système racinaire traçant ou dense capable de retenir la terre sur une pente.',e:'Cotoneaster, Juniperus horizontalis.'},
  berge:{t:'Berge / Zone humide',d:'Supporte les sols inondés temporairement ou humides en permanence.',e:'Salix rosmarinifolia, Iris pseudacorus.'},
  rocaille:{t:'Rocaille',d:'Adapté aux milieux minéraux, secs, pauvres et bien drainés.',e:'Sedum, Thymus, Euphorbia myrsinites.'},
  bac:{t:'Bac / Jardinière',d:'Tolère la culture hors-sol : volume limité, arrosage localisé, gel amplifié.'},
  jardin_ombre:{t:'Jardin d\'ombre',d:'Spécifique aux zones peu lumineuses.',e:'Hosta, Astilbe, Dryopteris.'},
  mellifere:{t:'Mellifère (vrai nectar)',d:'Produit un nectar abondant et accessible pour les pollinisateurs. Valeur écologique avérée.'},
  pollinifere:{t:'Pollinifère',d:'Riche en pollen (protéines), essentiel pour les larves d\'abeilles.',e:'Rosa, Helianthus, Cistus.'},
  baccifere:{t:'Baccifère (baies)',d:'Produit des fruits consommés par l\'avifaune et les mammifères.',e:'Ilex, Berberis, Prunus, Sorbus.'},
  plante_hote:{t:'Plante-hôte larvaire',d:'Végétal dont les larves d\'insectes se nourrissent exclusivement. Son absence peut faire disparaître l\'espèce localement.',e:'Buxus (Pyrale), Salix (grands papillons).'},
  seminifere:{t:'Séminifère (graines)',d:'Produit des graines appréciées des granivores.',e:'Graminées, Helianthus, Centaurea.'},
  faux_mellifere:{t:'Faux mellifère (piège)',d:'Attire les pollinisateurs mais offre un nectar insuffisant ou de mauvaise qualité. Peut épuiser les populations.',e:'Buddleja davidii : très fréquenté mais apport nutritif insuffisant.'},
  nidification:{t:'Nidification',d:'Structure ramifiée ou feuillage dense/épineux offrant un site sûr pour les nids.',e:'Berberis (épineux = protection), Carpinus (densité).'},
  gite:{t:'Gîte hivernal',d:'Feuillage persistant ou écorce crevassée abritant les insectes auxiliaires en hiver.',e:'Hedera helix, Lonicera.'},
  refuge:{t:'Zone de refuge',d:'Végétal dense protégeant la petite faune des prédateurs.',e:'Berberis, Prunus spinosa.'},
  auxiliaires:{t:'Attractif auxiliaires',d:'Attire les prédateurs de ravageurs (coccinelles, syrphes, chrysopes). Clé de la lutte biologique.',e:'Phacelia tanacetifolia, Achillea millefolium.'},
  repulsif:{t:'Répulsif naturel',d:'Composés chimiques (huiles essentielles) limitant la présence de parasites.',e:'Thymus, Lavandula, Tagetes.'},
  toxique:{t:'Toxique (ingestion)',d:'Troubles si ingéré. Attention aux enfants et animaux.',e:'Taxus (baies), Solanum, Wisteria (graines).'},
  veneneux:{t:'Vénéneux',d:'Toxicité grave ou mortelle même à faible dose. Alerte maximale.',e:'Nerium oleander, Aconitum, Taxus.'},
  allergene:{t:'Allergène (pollen)',d:'Peut provoquer rhinite, asthme ou conjonctivite. Référence : index RNSA.',e:'Betula, Graminées, Olea europaea.'},
  urticant:{t:'Urticant / Irritant',d:'Contact avec la sève ou les poils provoque irritations cutanées.',e:'Euphorbia (sève), Urtica.'},
  photosensibilisant:{t:'Photosensibilisant',d:'Contact + soleil = brûlures graves (phytophotodermatose). EPI obligatoires.',e:'Heracleum mantegazzianum, Ruta graveolens.'},
  salissante:{t:'Plante salissante',d:'Chute de fruits tachant les revêtements, pollen collant ou miellat.',e:'Prunus à fruits sur dallage, Tilia (miellat).'},
  racines_invasives:{t:'Racines envahissantes',d:'Peut soulever dallages ou endommager canalisations et fondations.',e:'Populus, Platanus — éloigner de 5–10 m des réseaux.'},
  eee:{t:'EEE — Espèce Exotique Envahissante',d:'Plante hors de son aire naturelle se propageant au détriment de la biodiversité locale. Plantation réglementée.',e:'Buddleja davidii, Reynoutria japonica, Prunus laurocerasus.'},
  fragilite:{t:'Fragilité mécanique',d:'Bois cassant face au vent ou à la neige.',e:'Robinia pseudoacacia (charpente fragile).'},
  phytosanitaire:{t:'Sensibilité phytosanitaire',d:'Espèce sujette aux maladies ou ravageurs, nécessitant surveillance régulière.',e:'Buxus (Pyrale, Cylindrocladium), Rosa (mildiou).'},
};
// showFormGloss définie dans la section GLOSSAIRE ADMIN
function checkLatinField(el){
  const norm=normalizeLatin(el.value.trim());
  if(norm)el.value=norm;
  const errDiv=document.getElementById('f-latin-err');if(!errDiv)return;
  const raw=(el.value||'').trim();
  if(!raw){errDiv.style.display='none';return;}
  // Accepter: binôme, trinôme (cultivar/variété), hybride avec ×/x
  // Ex: Lavandula angustifolia | Rosa × canina | Prunus avium 'Burlat'
  // Minimum : Genre + épithète (ou Genre + × + épithète)
  const tokens=raw.split(/\s+/).filter(t=>t.length>0);
  const meaningful=tokens.filter(t=>!/^[×x×'"]$/.test(t)&&!t.startsWith("'")&&!t.startsWith('"'));
  if(meaningful.length<2){
    errDiv.style.display='block';
    errDiv.textContent='⚠️ Doit contenir au moins genre + épithète. Ex : Lavandula angustifolia';
  }else{errDiv.style.display='none';}
}
function checkFamilleField(el){
  const norm=normalizeFamille(el.value.trim());
  if(norm)el.value=norm;
  const errDiv=document.getElementById('f-famille-err');if(!errDiv)return;
  const v=el.value.trim();
  if(v&&!v.endsWith('aceae')&&!v.endsWith('ae')&&!v.endsWith('eae')){
    errDiv.style.display='block';
    errDiv.textContent='⚠️ La famille doit se terminer en -aceae ou -ae. Ex : Lamiaceae';
  }else{errDiv.style.display='none';}
}
function toggleInfloDetail(){
  event.stopPropagation();
  const d=document.getElementById('f-inflo-det');
  const tog=document.getElementById('inflo-toggle-chip');
  if(!d||!tog)return;
  const on=tog.classList.toggle('selected');
  d.style.display=on?'grid':'none';
}

function openForm(id){
  cqLog('openForm appelé, id=', id, '| overlay-root:', !!document.getElementById('overlay-root'));
  editingId=id; formPhotoB64=null; formPhoto2B64=null; formPhoto3B64=null; formPhoto4B64=null;
  const p=id?plants.find(x=>x.id==id):null;
  const v=k=>(p&&p[k])||'';
  const cs=(fk,val)=>v(fk)&&v(fk).split(',').map(s=>s.trim()).includes(val.trim())?'selected':'';
  const cs1=(fk,val)=>v(fk).trim()===val.trim()?'selected':'';

  const G=(key)=>`<span class="glyph" onclick="event.stopPropagation();showFormGloss('${key}')">?</span>`;

  // Photos
  const photoHTML=[1,2,3,4].map(n=>{
    const sfx=n===1?'':String(n);
    const key='photo'+(n===1?'':String(n));
    const val=p?p[key]||'':'';
    const req=n===1?' *':'';
    return '<div>'
      +'<div style="font-size:11px;color:rgba(200,223,204,.35);margin-bottom:6px;letter-spacing:1px">PHOTO '+n+req+'</div>'
      +'<div class="photo-zone '+(val?'has-photo':'')+'" id="photo-zone'+sfx+'" onclick="document.getElementById(\'f-photo-file'+sfx+'\').click()">'
      +(val?'<img src="'+val+'" class="photo-preview" id="photo-preview'+sfx+'"/>'
           :'<span class="photo-zone-icon" id="photo-zone-icon'+sfx+'">📷</span>')
      +'<div class="photo-zone-text" id="photo-zone-text'+sfx+'">'+(val?'Cliquer pour changer':'Uploader')+'<br><small style="opacity:.5">ou URL ci-dessous</small></div>'
      +'<input type="file" id="f-photo-file'+sfx+'" accept="image/*" style="display:none" onchange="handlePhotoUpload(event,'+n+')"/>'
      +'</div>'
      +'<input class="fi" id="f-photo-url'+sfx+'" placeholder="https://..." value="'+(val&&!val.startsWith('data:')?val:'')+'" style="margin-top:6px;font-size:12px" oninput="previewUrl(this.value,'+n+')"/>'
      +'</div>';
  }).join('');

  // Mois
  const MOIS=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const selMois=new Set((v('periodeFloraison')||'').split(/\s*–\s*|\s*,\s*/).map(m=>m.trim()).filter(m=>MOIS.includes(m)));
  const moisBtns=MOIS.map(m=>'<button type="button" class="month-btn'+(selMois.has(m)?' selected':'')+'" data-mois="'+m+'" onclick="toggleMonth(this,\''+m+'\')">'+m.slice(0,4)+'</button>').join('');
  const moisDisplay=selMois.size?[...selMois].sort((a,b)=>MOIS.indexOf(a)-MOIS.indexOf(b)).join(' – '):'—';

  // Exposition chips
  const EXPOS=['Ombre','Mi-ombre','Soleil'];
  const expoGK={'Ombre':'ombre','Mi-ombre':'miombre','Soleil':'soleil'};
  const expoChips=EXPOS.map(e=>{
    const sel=v('exposition')&&v('exposition').split(/\s*–\s*/).map(s=>s.trim()).includes(e)?'selected':'';
    return '<span class="type-chip '+sel+'" data-val="'+e+'" onclick="event.stopPropagation();this.classList.toggle(\'selected\');updateExpoChips()">'+e+' '+G(expoGK[e])+'</span>';
  }).join('');

  // Glossaire overlay
  const glossOv='<div id="fg-ov" onclick="if(event.target===this)this.style.display=\'none\'"'
    +' style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2000;align-items:center;justify-content:center;padding:16px">'
    +'<div style="background:#13301e;border:1px solid rgba(74,184,112,.3);border-radius:14px;padding:18px 20px;max-width:460px;width:100%;max-height:80vh;overflow-y:auto;position:relative">'
    +'<button onclick="document.getElementById(\'fg-ov\').style.display=\'none\'" style="position:absolute;top:10px;right:14px;background:none;border:none;color:rgba(200,223,204,.4);font-size:15px;cursor:pointer">✕</button>'
    +'<div id="fg-ct"></div></div></div>';

  // chip line builders
  function chipRow(fid, gridId, items, multi){
    return items.map(function(item){
      var t=item[0], gk=item[1]||'';
      var selClass=multi?cs(fid,t):cs1(fid,t);
      var fn=multi?'fChip(this,\'f-'+fid+'\',\''+gridId+'\',\''+fid+'-display\')'
                   :'setSFChip(this,\'f-'+fid+'\',\''+gridId+'\',\''+fid+'\')';
      return '<span class="type-chip '+selClass+'" data-val="'+t.replace(/"/g,'&quot;')+'" onclick="'+fn+'">'+t+(gk?' '+G(gk):'')+'</span>';
    }).join('');
  }

  document.getElementById('overlay-root').innerHTML=glossOv+
    '<div class="form-bg" onclick="if(event.target===this)closeForm()">'
    +'<div class="form-card">'
    +'<div class="form-title">'+(id?'✏️ Modifier':'🌱 Ajouter une plante')+'</div>'
    +'<div class="form-actions" style="margin-bottom:14px">'
    +'<button class="cancel-btn" onclick="closeForm()">Annuler</button>'
    +'<button class="save-btn" onclick="savePlantForm()">✅ Enregistrer</button>'
    +'</div>'
    +'<div class="form-grid">'

    // IDENTITÉ
    +'<div class="fg-section-title">🪪 Identité</div>'
    +'<div class="fg full"><label class="fl">Nom botanique * '+G('port')+'</label>'
    +'<input class="fi" id="f-latin" placeholder="Lavandula angustifolia" value="'+v('latin').replace(/"/g,'&quot;')+'"'
    +' onblur="checkLatinField(this)" placeholder="Ex: Lavandula angustifolia · Rosa × canina · Prunus avium \'Burlat\'"/>'
    +'<div id="f-latin-err" style="display:none;font-size:11px;color:#ffb347;margin-top:3px"></div>'
    +'<div style="font-size:10px;color:rgba(200,223,204,.3);margin-top:2px">Genre : 1ʳᵉ lettre majuscule, reste en minuscule. Épithète : tout minuscule. Ex : <em>Lavandula angustifolia</em></div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Nom commun</label>'
    +'<input class="fi" id="f-nom" placeholder="Lavande officinale" value="'+v('nom').replace(/"/g,'&quot;')+'"/></div>'
    +'<div class="fg"><label class="fl">Famille botanique '+G('famille')+'</label>'
    +'<input class="fi" id="f-famille" placeholder="Lamiaceae" value="'+v('famille').replace(/"/g,'&quot;')+'"'
    +' onblur="checkFamilleField(this)"/>'
    +'<div id="f-famille-err" style="display:none;font-size:11px;color:#ffb347;margin-top:3px"></div></div>'
    +'<div class="fg full"><label class="fl">Type de végétal</label>'
    +'<input type="hidden" id="f-type" value="'+v('type')+'"/>'
    +'<div class="type-chips" id="type-chips-grid">'
    +[['Annuelle','annuelle'],['Bisannuelle','annuelle'],['Vivace','vivace'],['Bulbeuse',''],['Graminée ornementale','graminee'],
      ['Fougère','fougere'],['Bambou','bambou'],['Sous-arbrisseau',''],['Arbrisseau',''],['Arbuste','arbuste'],
      ['Rosier',''],['Arbre','arbre'],['Arbre fruitier',''],['Conifère','conifere'],
      ['Liane / Grimpante','grimpant'],['Couvre-sol',''],['Aquatique / Berge',''],['Plante aromatique',''],
      ['Spontanée',''],['Indigène',''],['Horticole','']
    ].map(function(item){
      var t=item[0],gk=item[1];
      return '<span class="type-chip '+cs('type',t)+'" data-val="'+t+'" onclick="fChip(this,\'f-type\',\'type-chips-grid\',\'type-display\')">'+t+(gk?' '+G(gk):'')+'</span>';
    }).join('')
    +'</div><div class="type-display" id="type-display">'+(v('type')||'—')+'</div></div>'

    +'<div class="fg"><label class="fl">Classe botanique</label>'
    +'<input type="hidden" id="f-classe" value="'+v('classe')+'"/>'
    +'<div class="type-chips" id="classe-chips">'
    +['Monocotylédone','Dicotylédone','Gymnosperme','Bryophyte'].map(function(t){
      return '<span class="type-chip '+cs1('classe',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-classe\',\'classe-chips\',\'classe\')">'+t+'</span>';
    }).join('')
    +'</div>'
    +'<div class="type-display" id="classe">'+(v('classe')||'—')+'</div>'
    +'</div>'

    // PORT & DIMENSIONS
    +'<div class="fg-section-title">📐 Port et dimensions</div>'
    +'<div class="fg full"><label class="fl">Silhouette '+G('port')+'</label>'
    +'<input type="hidden" id="f-port" value="'+v('port')+'"/>'
    +'<div class="type-chips" id="port-chips">'
    +[['Érigé','erige'],['Fastigié','fastigie'],['Boule','boule'],['Arrondi / Buissonnant','buissonnant'],
      ['Étalé / Rampant','etale'],['Pyramidal / Conique','pyramidal'],['Pleureur','pleureur'],['Grimpant','grimpant_port']
    ].map(function(item){
      return '<span class="type-chip '+cs1('port',item[0])+'" data-val="'+item[0]+'" onclick="setSFChip(this,\'f-port\',\'port-chips\',\'port\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')
    +'</div>'
    +'<div class="type-display" id="port">'+(v('port')||'—')+'</div>'
    +'</div>'
    +'<div class="fg full"><label class="fl">📏 Hauteur adulte</label>'+renderSizePicker('hauteurAdulte', v('hauteurAdulte'))+'</div>'
    +'<div class="fg full"><label class="fl">↔️ Largeur adulte</label>'+renderSizePicker('largeurAdulte', v('largeurAdulte'))+'</div>'
    +'<div class="fg"><label class="fl">Vitesse de croissance</label>'
    +'<input type="hidden" id="f-vitesseCroissance" value="'+v('vitesseCroissance')+'"/>'
    +'<div class="type-chips" id="vitesse-chips">'
    +['Lente','Moyenne','Rapide'].map(function(t){return '<span class="type-chip '+cs1('vitesseCroissance',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-vitesseCroissance\',\'vitesse-chips\',\'vitesseCroissance\')">'+t+'</span>';}).join('')
    +'</div>'
    +'<div class="type-display" id="vitesseCroissance">'+(v('vitesseCroissance')||'—')+'</div>'
    +'</div>'

    // FEUILLAGE
    +'<div class="fg-section-title">🍃 Feuillage</div>'
    +'<div class="fg full"><label class="fl">Comportement saisonnier '+G('feuillage')+'</label>'
    +'<input type="hidden" id="f-feuillage" value="'+v('feuillage')+'"/>'
    +'<div class="type-chips" id="feuillage-chips">'
    +[['Caduc','caduc'],['Persistant','persistant'],['Marcescent','marcescent'],['Semi-persistant','semi_persistant']].map(function(item){
      return '<span class="type-chip '+cs1('feuillage',item[0])+'" data-val="'+item[0]+'" onclick="setSFChip(this,\'f-feuillage\',\'feuillage-chips\',\'feuillage\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="feuillage">'+(v('feuillage')||'—')+'</div>'
    +'</div>'
    +'<div class="fg full"><label class="fl">Couleur du limbe '+G('limbe')+'</label>'
    +renderLeafColorPicker('couleurLimbe', v('couleurLimbe'), COULEURS_LIMBE, '🍃')+'</div>'
    +'<div class="fg full"><label class="fl">Forme du limbe '+G('limbe')+'</label>'
    +'<input type="hidden" id="f-formeLimbe" value="'+v('formeLimbe')+'"/>'
    +'<div class="type-chips" id="formelimbe-chips">'
    +[['Aciculaire','aciculaire'],['Linéaire','lineaire'],['Lancéolé','lanceole'],['Oblancéolé','oblanceole'],['Ensiforme','ensiforme'],
      ['Ovale','ovale'],['Obovale','obovale'],['Elliptique','elliptique'],['Orbiculaire','orbiculaire'],['Réniforme','reniforme'],['Deltoïde','deltoide'],
      ['Cordiforme','cordiforme'],['Sagitté','sagitte'],['Spatulé','spatule'],['Hasté','haste'],
      ['Palmé','palme'],['Lobé','lobe'],['Pinnatifide','pinnatifide'],['Trifolié','trifolie'],['Pelté','pelte']
    ].map(function(item){
      return '<span class="type-chip '+cs1('formeLimbe',item[0])+'" data-val="'+item[0]+'" onclick="setSFChip(this,\'f-formeLimbe\',\'formelimbe-chips\',\'formeLimbe\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="formeLimbe">'+(v('formeLimbe')||'—')+'</div>'
    +'</div>'
    +'<div class="fg full" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 14px">'
    +'<div><label class="fl">Longueur du limbe</label>'+renderCmPicker('longueurLimbe',v('longueurLimbe'))+'</div>'
    +'<div><label class="fl">Largeur du limbe</label>'+renderCmPicker('largeurLimbe',v('largeurLimbe'))+'</div>'
    +'<div><label class="fl">Longueur du pétiole '+G('petiole')+'</label>'+renderPetiolePicker('longueurPetiole',v('longueurPetiole'))+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Couleur du pétiole '+G('petiole')+'</label>'
    +renderLeafColorPicker('couleurPetiole', v('couleurPetiole'), COULEURS_PETIOLE, '🌿')+'</div>'
    +'<div class="fg"><label class="fl">Texture du feuillage '+G('texture')+'</label>'
    +'<input type="hidden" id="f-texture" value="'+v('texture')+'"/>'
    +'<div class="type-chips" id="texture-chips">'
    +[['Fine','texture_fine'],['Moyenne','texture'],['Grossière / Large','texture_grosse'],['Coriace','coriace'],['Épineuse','epineux']].map(function(item){
      return '<span class="type-chip '+cs1('texture',item[0])+'" data-val="'+item[0]+'" onclick="setSFChip(this,\'f-texture\',\'texture-chips\',\'texture\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="texture">'+(v('texture')||'—')+'</div>'
    +'</div>'

    // FLORAISON
    +'<div class="fg-section-title">🌸 Floraison</div>'
    +'<div class="fg full"><label class="fl">Période de floraison</label>'
    +'<input type="hidden" id="f-periodeFloraison" value="'+v('periodeFloraison')+'"/>'
    +'<div class="month-grid" id="month-grid">'+moisBtns+'</div>'
    +'<div class="month-display" id="month-display">🌸 '+moisDisplay+'</div></div>'
    +'<div class="fg full"><label class="fl">🎨 Couleur des fleurs</label>'
    +renderColorPicker('couleurFleurs', v('couleurFleurs'))+'</div>'
    +'<div class="fg"><label class="fl">Parfumé</label>'
    +'<input type="hidden" id="f-parfum" value="'+v('parfum')+'"/>'
    +'<div class="type-chips" id="parfum-chips">'
    +['Oui','Non'].map(function(t){return '<span class="type-chip '+cs1('parfum',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-parfum\',\'parfum-chips\',\'parfum\')">'+t+'</span>';}).join('')
    +'</div>'
    +'<div class="type-display" id="parfum">'+(v('parfum')||'—')+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Intérêt esthétique</label>'
    +'<input type="hidden" id="f-interetEsthetique" value="'+v('interetEsthetique')+'"/>'
    +'<div class="type-chips" id="iest-chips">'
    +['Oui','Non'].map(function(t){return '<span class="type-chip '+cs1('interetEsthetique',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-interetEsthetique\',\'iest-chips\',\'interetEsthetique\')">'+t+'</span>';}).join('')
    +'</div>'
    +'<div class="type-display" id="interetEsthetique">'+(v('interetEsthetique')||'—')+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Reproduction '+G('repro')+'</label>'
    +'<input type="hidden" id="f-reproduction" value="'+v('reproduction')+'"/>'
    +'<div class="type-chips" id="repro-chips">'
    +[['Hermaphrodite','hermaphrodite'],['Monoïque','monoique'],['Dioïque','dioique'],['Polygame','polygame']].map(function(item){
      return '<span class="type-chip '+cs1('reproduction',item[0])+'" data-val="'+item[0]+'" onclick="setSFChip(this,\'f-reproduction\',\'repro-chips\',\'reproduction\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="reproduction">'+(v('reproduction')||'—')+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Pollinisation '+G('pollinisation')+'</label>'
    +'<input type="hidden" id="f-pollinisation" value="'+v('pollinisation')+'"/>'
    +'<div class="type-chips" id="pollin-chips">'
    +[['Entomogame','entomogame'],['Anémogame','anemogame'],['Zoogame','zoogame'],['Hydrogame','hydrogame']].map(function(item){
      return '<span class="type-chip '+cs1('pollinisation',item[0])+'" data-val="'+item[0]+'" onclick="setSFChip(this,\'f-pollinisation\',\'pollin-chips\',\'pollinisation\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="pollinisation">'+(v('pollinisation')||'—')+'</div>'
    +'</div>'
    +'<div class="fg full"><label class="fl">Inflorescence '+G('inflorescence')+'</label>'
    +'<input type="hidden" id="f-typeInflorescence" value="'+v('typeInflorescence')+'"/>'
    +'<div class="type-chips" id="inflo-chips">'
    +'<span class="type-chip '+(!v('typeInflorescence')?'selected':'')+'" id="inflo-simple-chip" data-val="" onclick="event.stopPropagation();document.getElementById(\'f-inflo-det\').style.display=\'none\';document.getElementById(\'f-typeInflorescence\').value=\'\';this.classList.add(\'selected\');document.getElementById(\'inflo-toggle-chip\').classList.remove(\'selected\')">Fleurs simples</span>'
    +'<span class="type-chip '+(v('typeInflorescence')?'selected':'')+'" id="inflo-toggle-chip" data-val="inflorescence" onclick="toggleInfloDetail()">Inflorescence '+G('inflorescence')+'</span>'
    +'</div>'
    +'<div id="f-inflo-det" style="display:'+(v('typeInflorescence')?'grid':'none')+';grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px">'
    +'<div><div style="font-size:10px;color:rgba(200,223,204,.35);margin-bottom:4px">Type</div>'
    +'<div class="type-chips" id="inflo-type-chips">'
    +['Grappe / Racème','Cyme','Ombelle','Capitule','Panicule','Chaton','Corymbe'].map(function(t){
      return '<span class="type-chip '+cs1('typeInflorescence',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-typeInflorescence\',\'inflo-type-chips\',\'typeInflorescence\')" style="font-size:10px;padding:2px 7px">'+t+'</span>';
    }).join('')+'</div>'
    +'<div id="typeInflorescence" style="font-size:10px;color:rgba(200,223,204,.35);margin-top:3px;min-height:12px">'+(v('typeInflorescence')||'')+'</div>'
    +'</div>'
    +'<div><div style="font-size:10px;color:rgba(200,223,204,.35);margin-bottom:4px">Dim. inflo.</div>'
    +'<input type="hidden" id="f-dimInflo" value="'+v('dimInflo')+'"/>'
    +'<div class="type-chips" id="dinflo-chips">'
    +['2–4 cm','4–6 cm','6–10 cm','10–20 cm','>20 cm'].map(function(t){
      return '<span class="type-chip '+cs1('dimInflo',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-dimInflo\',\'dinflo-chips\',\'dimInflo\')" style="font-size:10px;padding:2px 6px">'+t+'</span>';
    }).join('')+'</div>'
    +'<div id="dimInflo" style="font-size:10px;color:rgba(200,223,204,.35);margin-top:3px;min-height:12px">'+(v('dimInflo')||'')+'</div>'
    +'</div>'
    +'<div><div style="font-size:10px;color:rgba(200,223,204,.35);margin-bottom:4px">Dim. fleur</div>'
    +'<input type="hidden" id="f-dimFleur" value="'+v('dimFleur')+'"/>'
    +'<div class="type-chips" id="dfleur-chips">'
    +['<2 mm','2–5 mm','5–10 mm','10–20 mm','>20 mm'].map(function(t){
      return '<span class="type-chip '+cs1('dimFleur',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-dimFleur\',\'dfleur-chips\',\'dimFleur\')" style="font-size:10px;padding:2px 6px">'+t+'</span>';
    }).join('')+'</div>'
    +'<div id="dimFleur" style="font-size:10px;color:rgba(200,223,204,.35);margin-top:3px;min-height:12px">'+(v('dimFleur')||'')+'</div>'
    +'</div></div></div>'
    +'<div class="fg full"><label class="fl">🌺 Intérêt ornemental</label>'
    +'<input type="hidden" id="f-interetOrnemental" value="'+v('interetOrnemental')+'"/>'
    +'<div class="type-chips" id="interet-chips">'
    +['Floraison décorative','Floraison parfumée','Feuillage persistant','Feuillage décoratif','Feuillage caduc coloré','Feuillage panaché','Feuillage automnal','Feuillage marcescent','Bois / Tige / Rameau décoratif','Silhouette hivernale','Fruits & baies décoratifs','Port architectural','Tapis fleuri','Haie fleurie'].map(function(t){
      return '<span class="type-chip '+cs('interetOrnemental',t)+'" data-val="'+t+'" onclick="fChip(this,\'f-interetOrnemental\',\'interet-chips\',\'interetOrnemental-display\')">'+t+'</span>';
    }).join('')
    +'</div><div class="type-display" id="interetOrnemental-display">'+(v('interetOrnemental')||'—')+'</div></div>'

    // COMPORTEMENT
    +'<div class="fg-section-title">🔄 Comportement & particularités</div>'
    +'<div class="fg full"><input type="hidden" id="f-particularites" value="'+v('particularites')+'"/>'
    +'<div class="type-chips" id="particul-chips">'
    +[['Drageonnant','drageonnant'],['Stolonifère','stolonifere'],['Mellifère','mellifere'],['Fructification décorative','fructification'],['Écorce décorative','ecorce'],['Feuillage automnal coloré','automnal']].map(function(item){
      return '<span class="type-chip '+cs('particularites',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-particularites\',\'particul-chips\',\'particularites-display\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')
    +'</div><div class="type-display" id="particularites-display">'+(v('particularites')||'—')+'</div></div>'

    // MILIEU & SOL
    +'<div class="fg-section-title">🌍 Milieu & sol</div>'
    +'<div class="fg"><label class="fl">Exposition</label>'
    +'<input type="hidden" id="f-exposition" value="'+v('exposition')+'"/>'
    +'<div class="type-chips" id="expo-chips">'+expoChips+'</div>'
    +'<div class="type-display" id="expo-display">'+(v('exposition')||'—')+'</div></div>'
    +'<div class="fg"><label class="fl">Rusticité 🌡️ '+G('rusticite')+'</label>'
    +'<input type="hidden" id="f-rusticite" value="'+v('rusticite')+'"/>'
    +'<div class="type-chips" id="rusti-chips" style="max-height:120px;overflow-y:auto">'
    +['< -30°C','-30 / -25°C','-25 / -20°C','-20 / -15°C','-15 / -10°C','-10 / -5°C','-5 / 0°C','0°C','+5°C'].map(function(t){
      const sel=v('rusticite')&&v('rusticite').split(',').map(function(s){return s.trim();}).includes(t)?'selected':'';
      return '<span class="type-chip '+sel+'" data-val="'+t+'" onclick="fChip(this,\'f-rusticite\',\'rusti-chips\',\'rusti-display\')">'+t+'</span>';
    }).join('')
    +'</div>'
    +'<div class="type-display" id="rusti-display">'+(v('rusticite')||'—')+'</div>'
    +'</div>'

    +'<div class="fg"><label class="fl">Humidité du sol</label>'
    +'<input type="hidden" id="f-humidite" value="'+v('humidite')+'"/>'
    +'<div class="type-chips" id="humid-chips">'
    +[['Sec',''],['Frais','sol_frais'],['Humide',''],['Détrempé / Aquatique','sol_detrempe']].map(function(item){
      return '<span class="type-chip '+cs('humidite',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-humidite\',\'humid-chips\',\'humidite-display\')">'+item[0]+(item[1]?' '+G(item[1]):'')+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="humidite-display">'+(v('humidite')||'—')+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">pH du sol '+G('ph')+'</label>'
    +'<input type="hidden" id="f-ph" value="'+v('ph')+'"/>'
    +'<div class="type-chips" id="ph-chips">'
    +[['Acidophile (4 – 5,5)','ph_acide'],['Légèrement acide (5,5 – 6,5)','ph_lacide'],['Neutre (6,5 – 7,2)','ph_neutre'],
      ['Légèrement basique (7,2 – 7,8)','ph_lbasique'],['Calcicole (> 7,8)','ph_calcicole'],['Indifférent','']].map(function(item){
      return '<span class="type-chip '+cs('ph',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-ph\',\'ph-chips\',\'ph-display\')">'+item[0]+(item[1]?' '+G(item[1]):'')+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="ph-display">'+(v('ph')||'—')+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Structure du sol '+G('structure_sol')+'</label>'
    +'<input type="hidden" id="f-structureSol" value="'+v('structureSol')+'"/>'
    +'<div class="type-chips" id="sol-chips">'
    +[['Drainant','drainant'],['Équilibré','equilibre'],['Lourd / Argileux','lourd'],['Indifférent','']].map(function(item){
      return '<span class="type-chip '+cs('structureSol',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-structureSol\',\'sol-chips\',\'structureSol-display\')">'+item[0]+(item[1]?' '+G(item[1]):'')+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="structureSol-display">'+(v('structureSol')||'—')+'</div>'
    +'</div>'

    // ENTRETIEN
    +'<div class="fg-section-title">✂️ Entretien</div>'
    +'<div class="fg full"><label class="fl">Type de taille '+G('taille')+'</label>'
    +'<input type="hidden" id="f-typeTaille" value="'+v('typeTaille')+'"/>'
    +'<div class="type-chips" id="taille-chips">'
    +[['Aucune (port naturel)',''],['Taille de formation','taille_formation'],['Taille de maintien','taille_maintien'],['Recépage','recepage'],['Haie / Topiaire','topiaire']].map(function(item){
      return '<span class="type-chip '+cs('typeTaille',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-typeTaille\',\'taille-chips\',\'typeTaille-display\')">'+item[0]+(item[1]?' '+G(item[1]):'')+'</span>';
    }).join('')+'</div>'
    +'<div class="type-display" id="typeTaille-display">'+(v('typeTaille')||'—')+'</div>'
    +'</div>'
    +'<div class="fg"><label class="fl">Fréquence de taille</label>'
    +'<input type="hidden" id="f-frequenceTaille" value="'+v('frequenceTaille')+'"/>'
    +'<div class="type-chips" id="freq-chips">'
    +['Annuelle','Tous les 2 – 3 ans','Rare / Aucune'].map(function(t){return '<span class="type-chip '+cs1('frequenceTaille',t)+'" data-val="'+t+'" onclick="setSFChip(this,\'f-frequenceTaille\',\'freq-chips\',\'frequenceTaille\')">'+t+'</span>';}).join('')
    +'</div>'
    +'<div class="type-display" id="frequenceTaille">'+(v('frequenceTaille')||'—')+'</div>'
    +'</div>'

    // USAGE
    +'<div class="fg-section-title">🏡 Usage paysager</div>'
    +'<div class="fg full"><label class="fl">Usages</label>'
    +'<input type="hidden" id="f-usageAmenagement" value="'+v('usageAmenagement')+'"/>'
    +'<div class="type-chips" id="usage-chips">'
    +[['Haie libre','haie_libre'],['Haie taillée','haie_taillee'],['Haie champêtre','haie_champetre'],['Haie défensive','haie_defensive'],
      ['Bordure','bordure'],['Écran / Brise-vue','ecran'],['Isolé (sujet)','isole'],['Alignement','alignement'],
      ['Massif / Groupe','massif'],['Fond de massif','fond_massif'],['Point focal','point_focal'],['Couvre-sol','couvre_sol'],
      ['Fixation de talus','talus'],['Berge / Zone humide','berge'],['Rocaille','rocaille'],['Bac / Jardinière','bac'],
      ["Jardin d'ombre",'jardin_ombre']].map(function(item){
      return '<span class="type-chip '+cs('usageAmenagement',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-usageAmenagement\',\'usage-chips\',\'usageAmenagement-display\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')
    +'</div><div class="type-display" id="usageAmenagement-display">'+(v('usageAmenagement')||'—')+'</div></div>'
    +'<div class="fg full"><label class="fl">⭐ Autres intérêts</label>'
    +'<input type="hidden" id="f-autresInterets" value="'+v('autresInterets')+'"/>'
    +'<div class="type-chips" id="autres-interets-chips">'
    +["Médicinale","Feuillage aromatique","Comestible / Fruitière","Fixatrice d'azote","Résistante à la pollution"].map(function(t){
      return '<span class="type-chip '+cs('autresInterets',t)+'" data-val="'+t+'" onclick="fChip(this,\'f-autresInterets\',\'autres-interets-chips\',\'autresInterets-display\')">'+t+'</span>';
    }).join('')
    +'</div><div class="type-display" id="autresInterets-display">'+(v('autresInterets')||'—')+'</div></div>'

    // BIODIVERSITÉ
    +'<div class="fg-section-title">🦋 Biodiversité</div>'
    +'<div class="fg full"><input type="hidden" id="f-biodiversite" value="'+v('biodiversite')+'"/>'
    +'<div class="type-chips" id="biodiv-chips">'
    +[['Mellifère (vrai nectar)','mellifere'],['Pollinifère','pollinifere'],['Baccifère (baies)','baccifere'],
      ['Plante-hôte larvaire','plante_hote'],['Séminifère (graines)','seminifere'],['⚠ Faux mellifère','faux_mellifere'],
      ['Nidification','nidification'],['Gîte hivernal','gite'],['Zone de refuge','refuge'],
      ['Attractif auxiliaires','auxiliaires'],['Répulsif naturel','repulsif']].map(function(item){
      return '<span class="type-chip '+cs('biodiversite',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-biodiversite\',\'biodiv-chips\',\'biodiversite-display\')">'+item[0]+' '+G(item[1])+'</span>';
    }).join('')
    +'</div><div class="type-display" id="biodiversite-display">'+(v('biodiversite')||'—')+'</div></div>'

    // CONTRAINTES
    +'<div class="fg-section-title">⚠️ Contraintes & alertes</div>'
    +'<div class="fg full"><input type="hidden" id="f-contraintes" value="'+v('contraintes')+'"/>'
    +'<div class="type-chips" id="contr-chips">'
    +[['Toxique (ingestion)','toxique'],['Vénéneux','veneneux'],['Allergène (pollen)','allergene'],
      ['Urticant / Irritant','urticant'],['Photosensibilisant','photosensibilisant'],
      ['Épineux / Piquant',''],['Plante salissante','salissante'],['Odeur désagréable',''],
      ['Racines envahissantes','racines_invasives'],['Espèce invasive (EEE)','eee'],
      ['Fragilité mécanique','fragilite'],['Sensibilité phytosanitaire','phytosanitaire']].map(function(item){
      return '<span class="type-chip '+cs('contraintes',item[0])+'" data-val="'+item[0]+'" onclick="fChip(this,\'f-contraintes\',\'contr-chips\',\'contraintes-display\')">'+item[0]+(item[1]?' '+G(item[1]):'')+'</span>';
    }).join('')
    +'</div><div class="type-display" id="contraintes-display">'+(v('contraintes')||'—')+'</div></div>'

    // PHOTOS & NOTES
    +'<div class="fg-section-title">📷 Photos & notes</div>'
    +'<div class="fg full"><label class="fl">📷 Photos (1 à 4) — compressées automatiquement en WebP</label>'
    +'<div class="photo-grid" style="grid-template-columns:1fr 1fr">'+photoHTML+'</div></div>'
    +'<div class="fg full"><label class="fl">Notes libres</label>'
    +'<textarea class="fi" id="f-description">'+v('description')+'</textarea></div>'

    +'</div>'// /form-grid
    +'<div class="form-actions">'
    +'<button class="cancel-btn" onclick="closeForm()">Annuler</button>'
    +'<button class="save-btn" onclick="savePlantForm()">✅ Enregistrer</button>'
    +'</div></div></div>';
}


function handlePhotoUpload(e, n=1){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      // Compression Canvas → WebP 75%, max 1200px
      // ~5Mo smartphone → ~80-120Ko, perte de qualité imperceptible sur écran
      const canvas=document.createElement('canvas');
      const MAX=1200; let w=img.width,h=img.height;
      if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;}}
      canvas.width=w; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      // WebP avec fallback JPEG si non supporté
      let b64=canvas.toDataURL('image/webp',0.75);
      if(!b64.startsWith('data:image/webp')) b64=canvas.toDataURL('image/jpeg',0.82);
      const sfx = n===1?'':String(n);
      // Stocker dans la bonne variable globale
      if(n===1) formPhotoB64=b64;
      else if(n===2) formPhoto2B64=b64;
      else if(n===3) formPhoto3B64=b64;
      else if(n===4) formPhoto4B64=b64;
      document.getElementById('f-photo-url'+sfx).value='';
      const zone=document.getElementById('photo-zone'+sfx);
      const icon=document.getElementById('photo-zone-icon'+sfx); if(icon)icon.remove();
      let prev=document.getElementById('photo-preview'+sfx);
      if(!prev){prev=document.createElement('img');prev.id='photo-preview'+sfx;prev.className='photo-preview';zone.insertBefore(prev,zone.firstChild);}
      prev.src=b64;
      const txt=document.getElementById('photo-zone-text'+sfx);
      if(txt){
        const kb=Math.round(b64.length*0.75/1024);
        txt.textContent='✅ '+kb+' Ko (compressé)';
      }
      zone.classList.add('has-photo');
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

function previewUrl(url, n=1){
  if(!url)return;
  const sfx = n===1?'':String(n);
  if(n===1) formPhotoB64=null;
  else if(n===2) formPhoto2B64=null;
  else if(n===3) formPhoto3B64=null;
  else if(n===4) formPhoto4B64=null;
  const zone=document.getElementById('photo-zone'+sfx);
  if(!zone) return;
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
  const urlField3 = (document.getElementById('f-photo-url3')||{}).value?.trim()||'';
  const urlField4 = (document.getElementById('f-photo-url4')||{}).value?.trim()||'';
  const existing  = (editingId ? (plants.find(x=>x.id==editingId)||{}) : {});
  const photo     = formPhotoB64  || urlField  || existing.photo  || '';
  const photo2    = formPhoto2B64 || urlField2 || existing.photo2 || '';
  const photo3    = formPhoto3B64 || urlField3 || existing.photo3 || '';
  const photo4    = formPhoto4B64 || urlField4 || existing.photo4 || '';

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
    resistanceSech:(document.getElementById('f-resistanceSech')||{}).value||'',
    hauteurAdulte:document.getElementById('f-hauteurAdulte').value,
    largeurAdulte:document.getElementById('f-largeurAdulte').value,
    periodeFloraison:document.getElementById('f-periodeFloraison').value.trim(),
    couleurFleurs:document.getElementById('f-couleurFleurs').value,
    interetOrnemental:document.getElementById('f-interetOrnemental').value,
    autresInterets:document.getElementById('f-autresInterets').value,
    usageAmenagement:document.getElementById('f-usageAmenagement').value,
    description:document.getElementById('f-description').value.trim(),
    photo, photo2, photo3, photo4,
    // Nouveaux champs v17
    classe:(document.getElementById('f-classe')||{}).value||'',
    port:(document.getElementById('f-port')||{}).value||'',
    vitesseCroissance:(document.getElementById('f-vitesseCroissance')||{}).value||'',
    couleurLimbe:(document.getElementById('f-couleurLimbe')||{}).value||'',
    formeLimbe:(document.getElementById('f-formeLimbe')||{}).value||'',
    longueurLimbe:(document.getElementById('f-longueurLimbe')||{}).value||'',
    largeurLimbe:(document.getElementById('f-largeurLimbe')||{}).value||'',
    longueurPetiole:(document.getElementById('f-longueurPetiole')||{}).value||'',
    couleurPetiole:(document.getElementById('f-couleurPetiole')||{}).value||'',
    texture:(document.getElementById('f-texture')||{}).value||'',
    parfum:(document.getElementById('f-parfum')||{}).value||'',
    interetEsthetique:(document.getElementById('f-interetEsthetique')||{}).value||'',
    reproduction:(document.getElementById('f-reproduction')||{}).value||'',
    pollinisation:(document.getElementById('f-pollinisation')||{}).value||'',
    typeInflorescence:(document.getElementById('f-typeInflorescence')||{}).value||'',
    dimInflo:(document.getElementById('f-dimInflo')||{}).value||'',
    dimFleur:(document.getElementById('f-dimFleur')||{}).value||'',
    particularites:(document.getElementById('f-particularites')||{}).value||'',
    humidite:(document.getElementById('f-humidite')||{}).value||'',
    structureSol:(document.getElementById('f-structureSol')||{}).value||'',
    typeTaille:(document.getElementById('f-typeTaille')||{}).value||'',
    frequenceTaille:(document.getElementById('f-frequenceTaille')||{}).value||'',
    biodiversite:(document.getElementById('f-biodiversite')||{}).value||'',
    contraintes:(document.getElementById('f-contraintes')||{}).value||'',
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
var sessionLevel = 1; // niveau de la session multijoueur
var sessionPollI = null;
var sessionFinalRows = []; // résultats finaux côté joueur
var statsPollInterval = null; // polling auto stats admin
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
        ${[1,2,3,4].map(n=>`<button class="level-card lv${n} ${n===multiLevel?'selected':''}" id="mlc-${n}" onclick="selectMultiLevel(${n})" style="flex:1;min-height:0;padding:10px;border-radius:12px">
          <span class="level-badge-tag">${n===1?'Débutant':n===2?'Interméd.':n===3?'Expert':'Technique'}</span>
          <div class="level-title" style="font-size:11px">${n===1?'Photo+base':n===2?'Sol+usage':n===3?'Tous critères':'Chantier'}</div>
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
// ══════════════════════════════════════════════════════
//  QUIZ — Génération d'intervalles pour champs numériques
//  (hauteurAdulte, largeurAdulte, rusticite)
// ══════════════════════════════════════════════════════

// Parse une valeur de hauteur/largeur en mètre(s) en un nombre flottant
// Ex: "1 – 2 m" → 1.5 (milieu), "0.3 – 0.6 m" → 0.45, "20 – 30 m" → 25
function parseDimensionValue(str){
  if(!str) return null;
  const s = str.replace(/,/g, '.').replace(/[^0-9.\-––\s]/g, ' ').trim();
  // Plage : "1 – 2" ou "1 - 2"
  const range = s.match(/([\d.]+)\s*[–\-]\s*([\d.]+)/);
  if(range) return (parseFloat(range[1]) + parseFloat(range[2])) / 2;
  // Valeur unique
  const single = s.match(/([\d.]+)/);
  if(single) return parseFloat(single[1]);
  return null;
}

// Parse une valeur de rusticité en °C
// Ex: "-10 / -5°C" → -7.5, "-15°C" → -15, "< -30°C" → -32
function parseRusticiteValue(str){
  if(!str) return null;
  const s = str.replace(/[°C]/g,'').trim();
  if(s.includes('<')) return -32;
  const range = s.match(/([-\d.]+)\s*[\/\-–]\s*([-\d.]+)/);
  if(range) return (parseFloat(range[1]) + parseFloat(range[2])) / 2;
  const single = s.match(/([-\d.]+)/);
  if(single) return parseFloat(single[1]);
  return null;
}

// Génère un libellé d'intervalle pour une dimension (m)
// step = largeur de la plage, ex: 0.4 → "0.4 m de large"
function formatDimensionInterval(midVal, halfStep){
  const lo = midVal - halfStep;
  const hi = midVal + halfStep;
  function fmt(n){
    if(n <= 0) n = 0.05;
    // Arrondi propre selon la grandeur
    if(n < 1)  return (Math.round(n*10)/10).toFixed(1);
    if(n < 5)  return (Math.round(n*2)/2).toFixed(1);
    if(n < 20) return Math.round(n).toString();
    return Math.round(n/5)*5 + '';
  }
  const loS = fmt(lo), hiS = fmt(hi);
  const unit = midVal >= 1 ? 'm' : 'm';
  const clean=s=>s.replace(/\.0$/,'');
  const loC=clean(loS),hiC=clean(hiS);
  if(loC === hiC) return loC + ' m';
  return loC + ' – ' + hiC + ' m';
}

// Génère un libellé d'intervalle pour la rusticité (°C)
function formatRusticiteInterval(midVal, halfStep){
  // Arrondir au multiple de 5 le plus proche pour des libellés propres
  function r5(n){ return Math.round(n/5)*5; }
  const lo = r5(midVal - halfStep);
  const hi = r5(midVal + halfStep);
  if(lo <= -30) return '< -30°C';
  if(hi >= 0)   return 'entre -5°C et 0°C';
  if(lo === hi) return 'environ ' + lo + '°C';
  return 'entre ' + lo + '°C et ' + hi + '°C';
}

// Génère 4 intervalles (1 correct + 3 distracteurs) pour un champ numérique
// Retourne null si la valeur ne peut pas être parsée
function buildNumericIntervalOptions(value, key){
  const isDim  = (key === 'hauteurAdulte' || key === 'largeurAdulte');
  const isRust = (key === 'rusticite');
  if(!isDim && !isRust) return null;

  let midVal, halfStep, offsets, fmt;

  if(isDim){
    midVal = parseDimensionValue(value);
    if(midVal === null) return null;
    // Demi-largeur de l'intervalle affiché (proportionnel à la valeur)
    if(midVal < 0.5)     halfStep = 0.1;
    else if(midVal < 1)  halfStep = 0.15;
    else if(midVal < 3)  halfStep = 0.3;
    else if(midVal < 8)  halfStep = 0.5;
    else if(midVal < 20) halfStep = 1.5;
    else                 halfStep = 3;
    fmt = (mid) => formatDimensionInterval(mid, halfStep);
    // Décalages des distracteurs : ×0.4, ×0.7, ×1.4, ×2 (toujours dans la même unité)
    const ratio = [0.35, 0.65, 1.6, 2.5];
    offsets = ratio.map(r => midVal * r);
  } else {
    // rusticite
    midVal = parseRusticiteValue(value);
    if(midVal === null) return null;
    halfStep = 3; // ±3°C dans le libellé
    fmt = (mid) => formatRusticiteInterval(mid, halfStep);
    // Décalages : ±7, ±14, ±21°C — suffisamment espacés pour être distincts
    // Pour valeurs très froides (< -25), on décale vers le chaud
    if(midVal <= -28){
      offsets = [midVal + 10, midVal + 18, midVal + 26, midVal + 7];
    } else if(midVal >= -3){
      offsets = [midVal - 7, midVal - 14, midVal - 21, midVal - 4];
    } else {
      offsets = [midVal - 7, midVal - 14, midVal + 7, midVal + 14];
    }
  }

  // Construire les 4 options : 1 bonne + 3 distracteurs
  const correct = fmt(midVal);
  const wrongs = [];
  const seen = new Set([correct]);
  for(const off of offsets){
    const s = fmt(off);
    if(!seen.has(s)){ seen.add(s); wrongs.push(s); }
    if(wrongs.length >= 3) break;
  }
  // Si pas assez de distracteurs distincts, on en génère par décalage croissant
  let extra = halfStep * 2;
  let attempts = 0;
  while(wrongs.length < 3 && attempts < 20){
    const s1 = fmt(midVal + extra);
    const s2 = fmt(midVal - extra);
    if(!seen.has(s1)){ seen.add(s1); wrongs.push(s1); }
    if(wrongs.length < 3 && !seen.has(s2)){ seen.add(s2); wrongs.push(s2); }
    extra += halfStep;
    attempts++;
  }
  if(wrongs.length < 3) return null;

  return {
    correct,
    options: shuffle([correct, ...wrongs.slice(0,3)])
  };
}


// ══════════════════════════════════════════════════════
//  QUESTIONS CONTRAIRE — "Laquelle NE convient PAS ?"
// ══════════════════════════════════════════════════════
const CONTRAIRE_TEMPLATES = [
  {
    q: p=>`Laquelle de ces plantes <strong>NE convient PAS</strong> ${expoLabel(p.exposition)} ?`,
    wrongKey:'exposition',
    matchFn:(odd,ref)=>{ // odd = la "mauvaise" plante (celle qui ne convient pas)
      if(!odd.exposition||!ref.exposition) return false;
      const sp=s=>s.split(/\s*[–\-]\s*|,\s*/).map(x=>x.trim());
      return !sp(odd.exposition).some(v=>sp(ref.exposition).includes(v));
    }
  },
  {
    q: p=>`Laquelle de ces plantes <strong>NE supporte PAS</strong> la rusticité <strong>${p.rusticite}</strong> ?`,
    wrongKey:'rusticite',
    matchFn:(odd,ref)=>odd.rusticite&&ref.rusticite&&odd.rusticite!==ref.rusticite
  },
  {
    q: p=>`Laquelle de ces plantes <strong>N'est PAS adaptée</strong> à un sol <strong>${p.humidite}</strong> ?`,
    wrongKey:'humidite',
    matchFn:(odd,ref)=>{
      if(!odd.humidite||!ref.humidite) return false;
      const sp=s=>s.split(/,\s*/).map(x=>x.trim());
      return !sp(odd.humidite).some(v=>sp(ref.humidite).includes(v));
    }
  },
  {
    q: p=>`Laquelle de ces plantes <strong>N'a PAS</strong> un feuillage <strong>${p.feuillage}</strong> ?`,
    wrongKey:'feuillage',
    matchFn:(odd,ref)=>odd.feuillage&&ref.feuillage&&odd.feuillage!==ref.feuillage
  },
  {
    q: p=>`Laquelle de ces plantes <strong>Ne fleurit PAS</strong> en <strong>${p.periodeFloraison&&p.periodeFloraison.split('–')[0].trim()}</strong> ?`,
    wrongKey:'periodeFloraison',
    matchFn:(odd,ref)=>{
      if(!odd.periodeFloraison||!ref.periodeFloraison) return false;
      const m1=ref.periodeFloraison.split(/[–,]/).map(s=>s.trim());
      const m2=odd.periodeFloraison.split(/[–,]/).map(s=>s.trim());
      return !m1.some(m=>m2.includes(m));
    }
  },
  {
    q: p=>`Laquelle de ces plantes <strong>N'est PAS</strong> de port <strong>${p.port}</strong> ?`,
    wrongKey:'port',
    matchFn:(odd,ref)=>odd.port&&ref.port&&odd.port!==ref.port
  },
  {
    q: p=>`Laquelle de ces plantes <strong>Ne convient PAS</strong> à un sol à pH <strong>${p.ph}</strong> ?`,
    wrongKey:'ph',
    matchFn:(odd,ref)=>odd.ph&&ref.ph&&odd.ph!==ref.ph
  },
];

function buildContraireQuestion(p, pool){
  // Choisir un template dont le champ requis est renseigné sur la plante
  const validTpls = CONTRAIRE_TEMPLATES.filter(t=>p[t.wrongKey]&&String(p[t.wrongKey]).trim());
  if(!validTpls.length) return null;
  const tpl = rand(validTpls);

  // La "bonne réponse" (le végétal qui ne convient pas) doit vraiment différer de p
  const oddPlants = shuffle(pool.filter(x=>x.id!==p.id&&tpl.matchFn(x,p)));
  if(!oddPlants.length) return null;
  const oddPlant = oddPlants[0]; // la "mauvaise" plante = bonne réponse à la question

  // 3 distracteurs = plantes qui CONVIENDRAIENT (même valeur que p) — donc mauvaises réponses
  const goodFits = shuffle(pool.filter(x=>x.id!==p.id&&x.id!==oddPlant.id&&!tpl.matchFn(x,p))).slice(0,3);
  if(goodFits.length<3) return null;

  const options = shuffle([oddPlant,...goodFits]);
  return {
    type:'contraire',
    plantId:p.id, plantLatin:p.latin, plantNom:p.nom,
    plantPhoto:p.photo||'', plantPhoto2:p.photo2||'',
    question: tpl.q(p),
    correct: oddPlant.latin,
    options: options.map(x=>x.latin),
    fieldLabel:'Question contraire',
    status:'pending'
  };
}


function buildKnowledgeQuestion(p, pool, level, fieldKeys){
  if(level===4 && (!fieldKeys||!fieldKeys.length)) return buildN3Question(p, pool);
  // Questions contraire : 15% de chance aux niveaux 2+
  if(level>=2 && Math.random()<0.15){
    const cq=buildContraireQuestion(p, pool);
    if(cq) return cq;
  }
  const fields = level===3 ? KFIELDS_N3 : level===2 ? KFIELDS_N2 : KFIELDS_N1;
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
  // Pour champs numériques : remplacer par des intervalles
  const NUMERIC_KEYS=['hauteurAdulte','largeurAdulte','rusticite'];
  let finalCorrect = correct;
  let finalOptions = shuffle([correct,...wrongs.slice(0,3)]);
  if(NUMERIC_KEYS.includes(field.key)){
    const iv = buildNumericIntervalOptions(correct, field.key);
    if(iv){ finalCorrect = iv.correct; finalOptions = iv.options; }
  }
  return {
    type:'knowledge', plantId:p.id, plantLatin:p.latin, plantNom:p.nom,
    plantPhoto:p.photo||'', plantPhoto2:p.photo2||'',
    question: field.q(p.latin),
    correct:finalCorrect, options:finalOptions,
    fieldLabel:field.label, status:'pending'
  };
}
function buildN3Question(p, pool){
  // Filtrer les templates dont les champs requis sont renseignés
  const validTpls = N3_TEMPLATES.filter(tpl=>tpl.f.every(k=>p[k]&&String(p[k]).trim()));
  const tplPool = validTpls.length ? validTpls : N3_TEMPLATES;
  const chosen = rand(tplPool);
  const tplFields = chosen.f;
  const question = chosen.t(p);
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
  sessionLevel = level || 1;
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
      <div id="session-my-progress" style="margin-top:10px;padding:8px 12px;background:rgba(19,48,29,.5);border:1px solid rgba(74,184,112,.12);border-radius:10px;font-size:12px;color:rgba(200,223,204,.55);text-align:center">${sessionPlayerName} &nbsp;·&nbsp; ✅ <strong style="color:var(--g4)">${sessionScore.ok}</strong> / <span style="color:rgba(200,223,204,.35)">${sessionScore.total}</span>${sessionScore.total>0?" &nbsp;·&nbsp; <strong style=\"color:"+(Math.round(sessionScore.ok/sessionScore.total*100)>=70?"var(--g4)":Math.round(sessionScore.ok/sessionScore.total*100)>=50?"var(--am2)":"#ff9999")+"\">"+(Math.round(sessionScore.ok/sessionScore.total*100))+"%</strong>":""}</div>
    </div>`;
  startTimer(()=>onSessionTimeout(code), isDictee?60:TIMER_SEC);
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

// ══════════════════════════════════════════════════════
//  BADGE VERSION (discret)
// ══════════════════════════════════════════════════════
(function(){
  try{
    const meta = document.querySelector('meta[name="app-version"]');
    const ver  = meta ? meta.getAttribute('content') : null;
    if(!ver) return;
    // Format court : "2026-03-14-v5" → "v5"
    const short = ver.split('-').pop(); // dernier segment
    const badge = document.getElementById('app-version-badge');
    if(badge){
      badge.textContent = short;
      badge.title = 'ChloroQuiz ' + ver + ' — Voir le changelog';
      badge.style.pointerEvents = 'auto';
      badge.style.cursor = 'pointer';
      badge.onclick = function(){ openChangelog(); };
    }
  }catch(e){}
})();

function openChangelog(){
  // Ouvre le changelog dans une nouvelle fenêtre
  window.open('CHANGELOG.md', '_blank');
}


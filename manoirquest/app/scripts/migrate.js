/**
 * migrate.js — Crée les tables et seede les données initiales.
 * Utilise node:sqlite (intégré Node 22+, flag --experimental-sqlite sur Node 22).
 * Sur Node 24, aucun flag requis.
 */
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { createHash } from 'crypto';

const dbPath = process.env.DB_PATH ?? './data/manoirquest.db';
mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// ── DDL ──────────────────────────────────────────────────────────────────────
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  avatar        TEXT    NOT NULL DEFAULT '🧑',
  role          TEXT    NOT NULL DEFAULT 'child' CHECK(role IN ('parent','child')),
  pin_hash      TEXT    NOT NULL,
  total_points  INTEGER NOT NULL DEFAULT 0,
  weekly_points INTEGER NOT NULL DEFAULT 0,
  week_start    TEXT    NOT NULL DEFAULT (date('now','weekday 1','-7 days')),
  level         INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  emoji        TEXT    NOT NULL DEFAULT '✅',
  description  TEXT    NOT NULL DEFAULT '',
  points       INTEGER NOT NULL DEFAULT 10,
  difficulty   INTEGER NOT NULL DEFAULT 1,
  duration_min INTEGER NOT NULL DEFAULT 10,
  recurrence   TEXT    NOT NULL DEFAULT 'manual'
                 CHECK(recurrence IN ('none','daily','weekly','biweekly','monthly','manual')),
  is_active    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS task_instances (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id        INTEGER NOT NULL REFERENCES tasks(id),
  assigned_to    INTEGER REFERENCES users(id),
  due_date       TEXT    NOT NULL,
  week_start     TEXT    NOT NULL,
  status         TEXT    NOT NULL DEFAULT 'pending'
                   CHECK(status IN ('pending','claimed','awaiting_validation','done','refused')),
  claimed_by     INTEGER REFERENCES users(id),
  claimed_at     TEXT,
  photo_url      TEXT,
  refusal_reason TEXT,
  validated_by   INTEGER REFERENCES users(id),
  validated_at   TEXT,
  points_awarded INTEGER,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS badges (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  emoji           TEXT NOT NULL DEFAULT '🏅',
  description     TEXT NOT NULL,
  trigger_type    TEXT NOT NULL CHECK(trigger_type IN ('total_points','weekly_points','streak_days','task_count','specific_task','secret')),
  trigger_value   INTEGER NOT NULL DEFAULT 0,
  trigger_task_id INTEGER REFERENCES tasks(id),
  is_secret       INTEGER NOT NULL DEFAULT 0,
  is_seasonal     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_badges (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL REFERENCES users(id),
  badge_id  INTEGER NOT NULL REFERENCES badges(id),
  earned_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rewards (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  emoji       TEXT    NOT NULL DEFAULT '🎁',
  description TEXT    NOT NULL DEFAULT '',
  cost        INTEGER NOT NULL,
  is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reward_claims (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  reward_id   INTEGER NOT NULL REFERENCES rewards(id),
  claimed_by  INTEGER NOT NULL REFERENCES users(id),
  claimed_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  approved_by INTEGER REFERENCES users(id),
  status      TEXT    NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending','approved','refused'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  expires_at TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
`);

// ── Seed (seulement si la table users est vide) ───────────────────────────────
const count = db.prepare('SELECT COUNT(*) AS n FROM users').get();
if (count.n === 0) {
  console.log('Premier démarrage — initialisation des données…');

  const SECRET = process.env.SECRET_KEY ?? 'change-me-please';
  function hashPin(pin) {
    return createHash('sha256').update(pin + SECRET).digest('hex');
  }

  const insertUser = db.prepare(
    'INSERT INTO users (name, avatar, role, pin_hash) VALUES (?, ?, ?, ?)'
  );
  insertUser.run('Francis', '👨', 'parent', hashPin('1234'));
  insertUser.run('Ilona',   '👩', 'parent', hashPin('1234'));
  insertUser.run('Elisa',   '👧', 'child',  hashPin('1111'));
  insertUser.run('Renaud',  '👦', 'child',  hashPin('2222'));
  console.log('  ✓ 4 utilisateurs créés');
  console.log('  ⚠️  PINs par défaut : parents = 1234 / Elisa = 1111 / Renaud = 2222');
  console.log('  ⚠️  Changez les PINs après la première connexion !');

  const insertTask = db.prepare(
    'INSERT INTO tasks (name, emoji, description, points, difficulty, duration_min, recurrence) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  // [name, emoji, description, points, difficulty, duration_min, recurrence]
  const catalogue = [
    ["Ranger le bureau de Francis","💻","",45,2,20,"manual"],
    ["Passer la serpillière au rez-de-chaussée","🪣","",40,2,25,"weekly"],
    ["Ranger la chambre des enfants","🧸","",40,2,20,"weekly"],
    ["Changer les draps Elisa","🛌","",40,2,20,"biweekly"],
    ["Faire la caisse d'Ari","🐱","",40,2,10,"biweekly"],
    ["Faire la caisse d'Osti","🐈","",40,2,10,"biweekly"],
    ["Changer les draps Renaud","🛌","",40,2,20,"biweekly"],
    ["Laver les toilettes rez-de-chaussée","🚽","",40,2,15,"weekly"],
    ["Laver les toilettes à l'étage","🚽","",40,2,15,"weekly"],
    ["Balayer la chambre des enfants","🧹","",40,2,15,"weekly"],
    ["Ranger la cuisine","🍳","",35,2,20,"daily"],
    ["Changer les draps du lit Ilona et Francis","🛌","",35,2,25,"biweekly"],
    ["Laver l'évier de la salle-de-bain bleue","🚿","",35,2,10,"weekly"],
    ["Laver le plan de travail","🧴","",30,2,10,"daily"],
    ["Passer la serpillière à l'étage","🪣","",30,2,20,"weekly"],
    ["Ranger l'espace salon","🛋️","",30,2,15,"daily"],
    ["Laver le miroir du séjour","🪞","",25,2,10,"weekly"],
    ["Laver les vitres du rez-de-chaussée","🪟","",25,2,30,"monthly"],
    ["Désherber (30 minutes)","🌿","",25,2,35,"manual"],
    ["Ranger la chambre Ilona et Francis","🛏️","",25,2,20,"weekly"],
    ["Ranger la salle de bain bleue","🛁","",30,2,15,"weekly"],
    ["Étendre la machine à laver","👕","",30,2,20,"manual"],
    ["Ranger la table de la salle à manger","🍽️","",25,2,10,"daily"],
    ["Balayer les escaliers et le couloir","🧹","",20,2,15,"weekly"],
    ["Ranger le linge étendu","📦","",20,2,25,"manual"],
    ["Balayer la chambre Ilona et Francis","🧹","",20,2,15,"weekly"],
    ["Mettre la table","🍴","",25,2,5,"daily"],
    ["Faire à manger","👨‍🍳","",30,2,45,"daily"],
    ["Remplir le lave-vaisselle","🫙","",25,2,10,"daily"],
    ["Vider le lave-vaisselle","🍽️","",25,2,10,"daily"],
    ["Balayer le rez-de-chaussée","🧹","",25,2,20,"weekly"],
    ["Débarrasser la table (en plus de ses affaires)","🗑️","",25,2,10,"daily"],
    ["Remplir la machine à laver","🧺","",20,2,15,"manual"],
    ["Débarrasser ses affaires","🎒","",15,2,5,"daily"]
  ];

  for (const t of catalogue) insertTask.run(...t);
  console.log(`  ✓ ${catalogue.length} tâches dans le catalogue`);

  const insertBadge = db.prepare(
    'INSERT INTO badges (name, emoji, description, trigger_type, trigger_value, is_secret) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const badges = [
    ['Débutant',       '🌱', 'Premiers points dans ManoirQuest',        'total_points',  100, 0],
    ['Courageux',      '💪', '250 points cumulés',                       'total_points',  250, 0],
    ['Flamme',         '🔥', '500 points cumulés',                       'total_points',  500, 0],
    ['Pro du ménage',  '⭐', '1000 points — la maison te remercie !',    'total_points', 1000, 0],
    ['Diamant',        '💎', 'Légende vivante — 2000 points',            'total_points', 2000, 0],
    ['Série de 3',     '📅', '3 semaines consécutives avec des tâches',  'streak_days',    21, 0],
    ['Sans relâche',   '🗓️','7 semaines consécutives',                  'streak_days',    49, 0],
    ['Expert vaisselle','🍽️','Lave-vaisselle géré 20 fois',             'task_count',     20, 0],
    ['Maître litière', '🐱', 'Litières changées 15 fois',               'task_count',     15, 0],
    ['Surprise !',     '🎉', 'Badge secret débloqué…',                  'secret',          0, 1],
  ];
  for (const b of badges) insertBadge.run(...b);
  console.log(`  ✓ ${badges.length} badges créés`);

  const insertReward = db.prepare(
    'INSERT INTO rewards (name, emoji, description, cost) VALUES (?, ?, ?, ?)'
  );
  const rewards = [
    ['Glace au choix',      '🍦', 'Un dessert de ton choix',                 150],
    ['Choisir le film',     '🍿', 'Tu choisis le film du soir',              300],
    ['Choisir le jeu',      '🎮', 'Tu choisis l\'activité de la soirée',    200],
    ['Soirée sans corvée',  '🛋️','Une soirée sans tâche assignée',          400],
    ['Resto à la demande',  '🍕', 'On commande le resto de ton choix',       500],
    ['Activité sortie',     '🎯', 'Karting, bowling ou activité au choix',  1000],
    ['Grasse matinée',      '😴', 'Permission de dormir jusqu\'à midi',      250],
  ];
  for (const r of rewards) insertReward.run(...r);
  console.log(`  ✓ ${rewards.length} récompenses créées`);

  console.log('Initialisation terminée ✅');
} else {
  console.log(`Base existante (${count.n} utilisateurs) — migration OK.`);
}

// ── Migration : planning par jour (sched_kind / sched_days) ───────────────────
// Additif et idempotent, exécuté après le seed pour couvrir base existante ET neuve.
// Backfill UNE seule fois depuis l'ancienne colonne recurrence (au moment de l'ajout
// des colonnes), donc les réglages faits ensuite via l'app ne sont jamais écrasés.
const taskCols = db.prepare('PRAGMA table_info(tasks)').all().map((c) => c.name);
if (!taskCols.includes('sched_kind')) {
  db.exec("ALTER TABLE tasks ADD COLUMN sched_kind TEXT NOT NULL DEFAULT 'weekly'");
  db.exec("ALTER TABLE tasks ADD COLUMN sched_days TEXT NOT NULL DEFAULT ''");
  db.exec("UPDATE tasks SET sched_kind='weekdays', sched_days='1,2,3,4,5,6,7' WHERE recurrence='daily'");
  db.exec("UPDATE tasks SET sched_kind='weekly'   WHERE recurrence='weekly'");
  db.exec("UPDATE tasks SET sched_kind='biweekly' WHERE recurrence='biweekly'");
  db.exec("UPDATE tasks SET sched_kind='monthly'  WHERE recurrence='monthly'");
  db.exec("UPDATE tasks SET sched_kind='manual'   WHERE recurrence IN ('manual','none')");
  console.log('  ✓ Migration sched_kind/sched_days appliquée');
}

console.log('Schéma à jour ✅');

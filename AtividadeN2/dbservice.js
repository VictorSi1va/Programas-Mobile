import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync('quiz.db');
  return cx;
}

export async function createTables() {
  const cx = await getDbConnection();
  await cx.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS temas (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS perguntas (
      id TEXT PRIMARY KEY NOT NULL,
      tema_id TEXT NOT NULL,
      enunciado TEXT NOT NULL,
      alt1 TEXT NOT NULL,
      alt2 TEXT NOT NULL,
      alt3 TEXT NOT NULL,
      alt4 TEXT NOT NULL,
      correta INTEGER NOT NULL CHECK (correta BETWEEN 1 AND 4),
      FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE
    );
  `);
  await cx.closeAsync();
}

/* ---------- TEMAS ---------- */
export async function adicionarTema({ id, nome }) {
  const db = await getDbConnection();
  await db.runAsync('INSERT INTO temas (id, nome) VALUES (?, ?);', [id, nome.trim()]);
  await db.closeAsync();
}

export async function listarTemasComTotal() {
  const db = await getDbConnection();
  const rows = await db.getAllAsync(`
    SELECT t.id, t.nome, COUNT(p.id) AS total
    FROM temas t
    LEFT JOIN perguntas p ON p.tema_id = t.id
    GROUP BY t.id;
  `);
  await db.closeAsync();
  return rows;
}

export async function excluirTema(id) {
  const db = await getDbConnection();
  await db.runAsync('DELETE FROM temas WHERE id = ?;', [id]);
  await db.closeAsync();
}

/* ---------- PERGUNTAS ---------- */
export async function adicionarPergunta({ id, tema_id, enunciado, alt1, alt2, alt3, alt4, correta }) {
  const db = await getDbConnection();
  await db.runAsync(
    `INSERT INTO perguntas (id, tema_id, enunciado, alt1, alt2, alt3, alt4, correta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [id, tema_id, enunciado, alt1, alt2, alt3, alt4, correta]
  );
  await db.closeAsync();
}

export async function listarPerguntasPorTema(tema_id) {
  const db = await getDbConnection();
  const rows = await db.getAllAsync('SELECT * FROM perguntas WHERE tema_id = ?;', [tema_id]);
  await db.closeAsync();
  return rows;
}

export async function excluirPergunta(id) {
  const db = await getDbConnection();
  await db.runAsync('DELETE FROM perguntas WHERE id = ?;', [id]);
  await db.closeAsync();
}

export async function obterPerguntasAleatorias(tema_id, limite) {
  const db = await getDbConnection();
  const rows = await db.getAllAsync(
    'SELECT * FROM perguntas WHERE tema_id = ? ORDER BY RANDOM() LIMIT ?;',
    [tema_id, limite]
  );
  await db.closeAsync();
  return rows;
}

/* ---------- DADOS DEFAULT ---------- */
export async function popularDadosIniciais() {
  const db = await getDbConnection();
  const row = await db.getFirstAsync('SELECT COUNT(*) as total FROM temas;');
  const totalTemas = row?.total ?? 0;

  if (totalTemas === 0) {
    const temas = ['Ciência', 'História', 'Esportes', 'Tecnologia'];
    const temasMap = {};

    for (let nome of temas) {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      await db.runAsync('INSERT INTO temas (id, nome) VALUES (?, ?);', [id, nome]);
      temasMap[nome] = id;
    }

    const perguntas = [
      { tema: 'Ciência', enunciado: 'Qual é o planeta mais próximo do Sol?', alts: ['Mercúrio', 'Vênus', 'Terra', 'Marte'], correta: 1 },
      { tema: 'Ciência', enunciado: 'Qual molécula transporta oxigênio no sangue?', alts: ['Hemoglobina', 'Insulina', 'DNA', 'Colágeno'], correta: 1 },
      { tema: 'História', enunciado: 'Quem foi o primeiro presidente do Brasil?', alts: ['Getúlio Vargas', 'Marechal Deodoro', 'Dom Pedro II', 'JK'], correta: 2 },
      { tema: 'História', enunciado: 'Ano da Independência do Brasil?', alts: ['1500', '1822', '1889', '1945'], correta: 2 },
      { tema: 'Esportes', enunciado: 'Quantos jogadores no futebol?', alts: ['9', '10', '11', '12'], correta: 3 },
      { tema: 'Esportes', enunciado: 'Quem é o "Rei do Futebol"?', alts: ['Pelé', 'Maradona', 'CR7', 'Messi'], correta: 1 },
      { tema: 'Tecnologia', enunciado: 'Quem é o pai da computação?', alts: ['Bill Gates', 'Charles Babbage', 'Alan Turing', 'Steve Jobs'], correta: 2 },
      { tema: 'Tecnologia', enunciado: 'Quem criou o Android?', alts: ['Google', 'Apple', 'Microsoft', 'IBM'], correta: 1 },
    ];

    for (let p of perguntas) {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      await db.runAsync(
        `INSERT INTO perguntas (id, tema_id, enunciado, alt1, alt2, alt3, alt4, correta)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [id, temasMap[p.tema], p.enunciado, p.alts[0], p.alts[1], p.alts[2], p.alts[3], p.correta]
      );
    }
  }

  await db.closeAsync();
}

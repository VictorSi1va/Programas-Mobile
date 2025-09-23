import * as SQLite from 'expo-sqlite';

export async function getDbConnection() {
  const cx = await SQLite.openDatabaseAsync('dbUsuarios.db');
  return cx;
}

export async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT NOT NULL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha TEXT NOT NULL
    );
  `;
  const cx = await getDbConnection();
  await cx.execAsync(query);
  await cx.closeAsync();
  console.log('Tabela de usuários criada ou já existente.');
}

export async function obtemTodosUsuarios() {
  var retorno = [];
  var dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync('SELECT * FROM usuarios');
  await dbCx.closeAsync();

  for (const registro of registros) {
    let obj = {
      id: registro.id,
      nome: registro.nome,
      email: registro.email,
      senha: registro.senha
    };
    retorno.push(obj);
  }
  return retorno;
}

export async function adicionarUsuario(usuario) {
  let dbCx = await getDbConnection();
  let query = 'INSERT INTO usuarios (id, nome, email, senha) VALUES (?,?,?,?)';
  const result = await dbCx.runAsync(query, [usuario.id, usuario.nome, usuario.email, usuario.senha]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function atualizarUsuario(usuario) {
  let dbCx = await getDbConnection();
  let query = 'UPDATE usuarios SET nome=?, email=?, senha=? WHERE id=?';
  const result = await dbCx.runAsync(query, [usuario.nome, usuario.email, usuario.senha, usuario.id]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function excluirUsuario(id) {
  let dbCx = await getDbConnection();
  let query = 'DELETE FROM usuarios WHERE id=?';
  const result = await dbCx.runAsync(query, id);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function excluirTodosUsuarios() {
  let dbCx = await getDbConnection();
  let query = 'DELETE FROM usuarios';
  await dbCx.execAsync(query);
  await dbCx.closeAsync();
}
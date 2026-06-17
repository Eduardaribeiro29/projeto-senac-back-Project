// tarefasController.js — CRUD de tarefas
//
// Ponto importante de segurança (UC3 Bloco C / Aula 1 — pilar Confidencialidade):
// toda operação aqui é restrita ao usuário logado. O usuarioId NÃO vem do
// body — vem do token (req.usuarioId). Assim, ninguém consegue listar,
// alterar ou apagar tarefa de outra pessoa.

import { getDatabase } from '../data/db.js';

const STATUS_VALIDOS = new Set(['Novo', 'Em Andamento', 'Concluido']);

function normalizarTextoBase(valor) {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function normalizarStatus(status, fallback = 'Novo') {
  if (!status || typeof status !== 'string') return fallback;
  const valor = normalizarTextoBase(status);

  if (valor === 'novo') return 'Novo';
  if (valor === 'em andamento' || valor === 'andamento') return 'Em Andamento';
  if (valor === 'concluida' || valor === 'concluido') return 'Concluido';

  return fallback;
}

function normalizarTarefaSaida(tarefa) {
  return {
    ...tarefa,
    status: normalizarStatus(tarefa.status, 'Novo')
  };
}

// GET /tarefas — só as do usuário logado
export async function listar(req, res) {
  try {
    const db = await getDatabase();
    const tarefas = await db.all(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE usuarioId = ? ORDER BY id DESC',
      [req.usuarioId]
    );
    res.json(tarefas.map(normalizarTarefaSaida));
  } catch (erro) {
    console.error('[tarefas.listar]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas.' });
  }
}

// GET /tarefas/:id — só se a tarefa for do usuário logado
export async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const tarefa = await db.get(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (!tarefa) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }
    res.json(normalizarTarefaSaida(tarefa));
  } catch (erro) {
    console.error('[tarefas.buscarPorId]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefa.' });
  }
}

// GET /tarefas/usuario/:usuarioId
// Uso didático — mostra como filtrar por chave estrangeira.
// Por segurança, só o próprio usuário pode listar as próprias tarefas
// por esse endpoint.
export async function listarPorUsuario(req, res) {
  const usuarioIdSolicitado = Number(req.params.usuarioId);

  if (usuarioIdSolicitado !== req.usuarioId) {
    return res.status(403).json({
      mensagem: 'Você só pode listar as próprias tarefas.'
    });
  }

  try {
    const db = await getDatabase();
    const tarefas = await db.all(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE usuarioId = ? ORDER BY id DESC',
      [usuarioIdSolicitado]
    );
    res.json(tarefas.map(normalizarTarefaSaida));
  } catch (erro) {
    console.error('[tarefas.listarPorUsuario]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas do usuário.' });
  }
}

// POST /tarefas — body { titulo }. usuarioId vem do token.
export async function criar(req, res) {
  const { titulo, descricao, status } = req.body;

  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    return res.status(400).json({ mensagem: 'Informe um título válido.' });
  }

  const statusFinal = normalizarStatus(status, 'Novo');

  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'INSERT INTO tarefas (titulo, descricao, status, usuarioId) VALUES (?, ?, ?, ?)',
      [titulo.trim(), descricao?.trim() || null, statusFinal, req.usuarioId]
    );

    res.status(201).json({
      id: resultado.lastID,
      titulo: titulo.trim(),
      descricao: descricao?.trim() || null,
      status: statusFinal,
      usuarioId: req.usuarioId
    });
  } catch (erro) {
    console.error('[tarefas.criar]', erro);
    res.status(500).json({ mensagem: 'Erro ao criar tarefa.' });
  }
}

// PUT /tarefas/:id — atualização parcial. Só permite mexer na própria tarefa.
export async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, descricao, status, concluida } = req.body;

  try {
    const db = await getDatabase();
    const atual = await db.get(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (!atual) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }

    // operador ?? mantém o valor atual quando o campo não vem no body
    const novoTitulo = titulo ?? atual.titulo;
    const novaDescricao = descricao ?? atual.descricao;
    let novoStatus = atual.status;
    if (typeof concluida === 'boolean') {
      novoStatus = concluida ? 'Concluido' : 'Novo';
    }
    if (typeof status === 'string') {
      novoStatus = normalizarStatus(status, atual.status);
    }

    await db.run(
      'UPDATE tarefas SET titulo = ?, descricao = ?, status = ? WHERE id = ?',
      [novoTitulo, novaDescricao, novoStatus, id]
    );

    res.json({
      id: Number(id),
      titulo: novoTitulo,
      descricao: novaDescricao,
      status: novoStatus,
      usuarioId: req.usuarioId
    });
  } catch (erro) {
    console.error('[tarefas.atualizar]', erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar tarefa.' });
  }
}

// DELETE /tarefas/:id
export async function remover(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'DELETE FROM tarefas WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (resultado.changes === 0) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }
    res.json({ mensagem: 'Tarefa removida com sucesso.' });
  } catch (erro) {
    console.error('[tarefas.remover]', erro);
    res.status(500).json({ mensagem: 'Erro ao remover tarefa.' });
  }
}

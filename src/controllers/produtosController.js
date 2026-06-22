// tarefasController.js — CRUD de tarefas
//
// Ponto importante de segurança (UC3 Bloco C / Aula 1 — pilar Confidencialidade):
// toda operação aqui é restrita ao usuário logado. O usuarioId NÃO vem do
// body — vem do token (req.usuarioId). Assim, ninguém consegue listar,
// alterar ou apagar tarefa de outra pessoa.

import { getDatabase } from '../data/db.js';

function normalizarTextoBase(valor) {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function normalizarProdutoSaida(produto) {
  return {
    ...produto
  };
}

// GET /tarefas — só as do usuário logado
export async function listar(req, res) {
  try {
    const db = await getDatabase();
    const produtos = await db.all(
      'SELECT id, titulo, descricao, data_validade, data_fabricacao, quantidade, usuarioId FROM produtos WHERE usuarioId = ? ORDER BY id DESC',
      [req.usuarioId]
    );
    res.json(produtos.map(normalizarProdutoSaida));
  } catch (erro) {
    console.error('[produtos.listar]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos.' });
  }
}

// GET /tarefas/:id — só se a tarefa for do usuário logado
export async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const produto = await db.get(
      'SELECT id, titulo, descricao, data_validade, data_fabricacao, quantidade, usuarioId FROM produtos WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
    res.json(normalizarProdutoSaida(produto));
  } catch (erro) {
    console.error('[produtos.buscarPorId]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produto.' });
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
      mensagem: 'Você só pode listar os próprios produtos.'
    });
  }

  try {
    const db = await getDatabase();
    const produtos = await db.all(
      'SELECT id, titulo, descricao, data_validade, data_fabricacao, quantidade, usuarioId FROM produtos WHERE usuarioId = ? ORDER BY id DESC',
      [usuarioIdSolicitado]
    );
    res.json(produtos.map(normalizarProdutoSaida));
  } catch (erro) {
    console.error('[produtos.listarPorUsuario]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos do usuário.' });
  }
}

// POST /tarefas — body { titulo }. usuarioId vem do token.
export async function criar(req, res) {
  const { titulo, descricao, data_validade, data_fabricacao, quantidade } = req.body;

  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    return res.status(400).json({ mensagem: 'Informe um título válido.' });
  }

  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'INSERT INTO  (titulo, descricao, data_validade, data_fabricacao, quantidade, usuarioId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo.trim(), descricao?.trim(), data_validade.trim(), data_fabricacao.trim(), quantidade.trim() || null, req.usuarioId]
    );

    res.status(201).json({
      id: resultado.lastID,
      titulo: titulo.trim(),
      descricao: descricao?.trim() || null,
      data_validade: data_validade.trim(),
      data_fabricacao: data_fabricacao.trim(),
      quantidade: quantidade.trim(),
      usuarioId: req.usuarioId
    });
  } catch (erro) {
    console.error('[produtos.criar]', erro);
    res.status(500).json({ mensagem: 'Erro ao criar produto.' });
  }
}

// PUT /tarefas/:id — atualização parcial. Só permite mexer na própria tarefa.
export async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, descricao, data_validade, data_fabricacao, quantidade, vencido } = req.body;

  try {
    const db = await getDatabase();
    const atual = await db.get(
      'SELECT id, titulo, descricao, data_validade, data_fabricacao, quantidade, usuarioId FROM produtos WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (!atual) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // operador ?? mantém o valor atual quando o campo não vem no body
    const novoTitulo = titulo ?? atual.titulo;
    const novaDescricao = descricao ?? atual.descricao;
    const novaData_validade = data_validade ?? atual.data_validade;
    const novaData_fabricacao = data_fabricacao ?? atual.data_fabricacao;
    const novaQuantidade = quantidade ?? atual.quantidade;
    let novoStatus = atual.status;
    if (typeof vencido === 'boolean') {
      novoStatus = vencido ? 'Vencido' : 'Novo';
    }
    if (typeof status === 'string') {
      novoStatus = normalizarStatus(status, atual.status);
    }

    await db.run(
      'UPDATE produtos SET titulo = ?, descricao = ?, data_validade = ?, data_fabricacao = ?, quantidade = ? WHERE id = ?',
      [novoTitulo, novaDescricao, novaData_validade, novaData_fabricacao, novaQuantidade, id]
    );

    res.json({
      id: Number(id),
      titulo: novoTitulo,
      descricao: novaDescricao,
      data_validade: novaData_validade,
      data_fabricacao: novaData_fabricacao,
      quantidade: novaQuantidade,
      usuarioId: req.usuarioId
    });
  } catch (erro) {
    console.error('[produtos.atualizar]', erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar produto.' });
  }
}

// DELETE /tarefas/:id
export async function remover(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'DELETE FROM produtos WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (resultado.changes === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
    res.json({ mensagem: 'Produto removido com sucesso.' });
  } catch (erro) {
    console.error('[produtos.remover]', erro);
    res.status(500).json({ mensagem: 'Erro ao remover produto.' });
  }
}

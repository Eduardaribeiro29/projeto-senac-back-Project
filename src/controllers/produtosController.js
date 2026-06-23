// tarefasController.js — CRUD de tarefas
//
// Ponto importante de segurança (UC3 Bloco C / Aula 1 — pilar Confidencialidade):
// toda operação aqui é restrita ao usuário logado. O usuarioId NÃO vem do
// body — vem do token (req.usuarioId). Assim, ninguém consegue listar,
// alterar ou apagar tarefa de outra pessoa.

import { getDatabase } from '../data/db.js';
import { processarUploadImagem } from '../middlewares/uploadImagem.js';

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
      'SELECT id, titulo, data_validade, data_fabricacao, quantidade,foto FROM produtos ORDER BY id DESC',
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
      'SELECT id, titulo, data_validade, data_fabricacao, quantidade,foto FROM produtos WHERE id = ? ',
      [id]
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



// POST /tarefas — body { titulo }. usuarioId vem do token.
export async function criar(req, res) {
  const { titulo, data_validade, data_fabricacao, quantidade } = req.body;

  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    return res.status(400).json({ mensagem: 'Informe um título válido.' });
  }
  if (contentType.includes('multipart/form-data')) {
      const upload = await processarUploadImagem(req, res, { pasta: 'produtos', campo: 'foto' });
      fotoUpload = upload.publicUrl;
  }

  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'INSERT INTO  (titulo, data_validade, data_fabricacao, quantidade,foto) VALUES (?, ?, ?, ?, ?,?)',
      [titulo.trim(), data_validade.trim(), data_fabricacao.trim(), quantidade.trim() || 1,fotoUpload]
    );

    res.status(201).json({
      id: resultado.lastID,
      titulo: titulo.trim(),
      data_validade: data_validade.trim(),
      data_fabricacao: data_fabricacao.trim(),
      quantidade: quantidade.trim(),
      foto: fotoUpload
    });
  } catch (erro) {
    console.error('[produtos.criar]', erro);
    res.status(500).json({ mensagem: 'Erro ao criar produto.' });
  }
}

// PUT /tarefas/:id — atualização parcial. Só permite mexer na própria tarefa.
export async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, data_validade, data_fabricacao, quantidade, vencido } = req.body;

  try {
    const db = await getDatabase();
    const atual = await db.get(
      'SELECT id, titulo, data_validade, data_fabricacao, quantidade FROM produtos WHERE id = ?',
      [id]
    );

    if (!atual) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // operador ?? mantém o valor atual quando o campo não vem no body
    const novoTitulo = titulo ?? atual.titulo;
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
      'UPDATE produtos SET titulo = ?, data_validade = ?, data_fabricacao = ?, quantidade = ? WHERE id = ?',
      [novoTitulo, novaData_validade, novaData_fabricacao, novaQuantidade, id]
    );

    res.json({
      id: Number(id),
      titulo: novoTitulo,
      data_validade: novaData_validade,
      data_fabricacao: novaData_fabricacao,
      quantidade: novaQuantidade,
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

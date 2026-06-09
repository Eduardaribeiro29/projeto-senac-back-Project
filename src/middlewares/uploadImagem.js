import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import multer from 'multer';

let uploadRootDir = null;

function resolverPastaUploads() {
  if (uploadRootDir) {
    return uploadRootDir;
  }

  const candidatos = [
    process.env.UPLOAD_DIR,
    path.resolve('uploads'),
    path.join(os.tmpdir(), 'uploads')
  ].filter(Boolean);

  for (const candidato of candidatos) {
    try {
      fs.mkdirSync(candidato, { recursive: true });
      uploadRootDir = candidato;
      return uploadRootDir;
    } catch {
      // Tenta o proximo caminho disponivel.
    }
  }

  throw new Error('Nao foi possivel inicializar a pasta de uploads. Defina UPLOAD_DIR no ambiente.');
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function gerarTimestampArquivo(date = new Date()) {
  const dia = pad2(date.getDate());
  const mes = pad2(date.getMonth() + 1);
  const ano = date.getFullYear();
  const hora = pad2(date.getHours());
  const minuto = pad2(date.getMinutes());
  const segundo = pad2(date.getSeconds());
  return `${dia}${mes}${ano}${hora}${minuto}${segundo}`;
}

function extensionFromMime(mimeType) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
    'image/svg+xml': '.svg'
  };
  return map[mimeType] || '.jpg';
}

function sanitizarPasta(valor, padrao = 'perfil') {
  const limpa = String(valor || padrao).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return limpa || padrao;
}

function criarUploaderImagem(pasta = 'perfil') {
  const pastaDestino = sanitizarPasta(pasta);
  const rootDir = resolverPastaUploads();

  const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
      const userId = String(req.usuarioId || req.params.id || '').trim();
      if (!userId) {
        return cb(new Error('Não foi possível identificar o usuário para o upload.'));
      }

      const userDir = path.join(rootDir, pastaDestino, userId);
      fs.mkdirSync(userDir, { recursive: true });
      cb(null, userDir);
    },
    filename: (_req, file, cb) => {
      const originalExt = path.extname(file.originalname || '').toLowerCase();
      const safeExt = originalExt || extensionFromMime(file.mimetype);
      const timestamp = gerarTimestampArquivo();
      cb(null, `${timestamp}${safeExt}`);
    }
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  });
}

function fileFilter(_req, file, cb) {
  if (file.mimetype?.startsWith('image/')) {
    return cb(null, true);
  }
  cb(new Error('Apenas arquivos de imagem são permitidos.'));
}

export function processarUploadImagem(req, res, { pasta = 'perfil', campo = 'foto' } = {}) {
  const pastaDestino = sanitizarPasta(pasta);
  const uploader = criarUploaderImagem(pastaDestino);

  return new Promise((resolve, reject) => {
    uploader.single(campo)(req, res, (erro) => {
      if (!erro) {
        return resolve({
          arquivo: req.file ?? null,
          pasta: pastaDestino
        });
      }

      if (erro.code === 'LIMIT_FILE_SIZE') {
        return reject(new Error('A imagem deve ter no máximo 5MB.'));
      }

      return reject(erro);
    });
  });
}

export default processarUploadImagem;

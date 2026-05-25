const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// garante que a pasta existe
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// rota de upload
app.post('/upload', upload.single('imagem'), (req, res) => {

  console.log('REQ FILE:', req.file); // debug

  if (!req.file) {
    return res.status(400).json({ erro: 'Arquivo não enviado' });
  }

  res.json({
    caminho: 'http://localhost:3001/uploads/' + req.file.filename
  });
});

// servir imagens
app.use('/uploads', express.static(uploadDir));

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});

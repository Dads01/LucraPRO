const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345', // sua senha
  database: 'lucrapro' // seu banco
});

// Teste de conexão
db.connect(err => {
  if (err) {
    console.error('Erro de conexão:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

// ====================== CRIAÇÃO DE TABELAS ======================

const criarTabelas = () => {
  const tabelas = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      senha VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS produtos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100),
      preco DECIMAL(10,2),
      custo DECIMAL(10,2),
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`,
    `CREATE TABLE IF NOT EXISTS vendas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      produto_id INT,
      quantidade INT,
      data DATE,
      usuario_id INT,
      FOREIGN KEY (produto_id) REFERENCES produtos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`,
    `CREATE TABLE IF NOT EXISTS estoque (
      id INT AUTO_INCREMENT PRIMARY KEY,
      produto_id INT,
      quantidade INT,
      usuario_id INT,
      FOREIGN KEY (produto_id) REFERENCES produtos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`,
    `CREATE TABLE IF NOT EXISTS simulacoes_precificacao (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome_produto VARCHAR(100),
      quantidade_produzida INT,
      preco_unit_custo DECIMAL(10,2),
      preco_unit_venda DECIMAL(10,2),
      ponto_equilibrio DECIMAL(10,2),
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`,
    `CREATE TABLE IF NOT EXISTS relatorios_vendas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      produto_id INT,
      quantidade_vendida INT,
      gasto_producao DECIMAL(10,2),
      retorno_obtido DECIMAL(10,2),
      lucro_obtido DECIMAL(10,2),
      usuario_id INT,
      data_geracao DATE,
      FOREIGN KEY (produto_id) REFERENCES produtos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`
  ];

  tabelas.forEach(sql => {
    db.query(sql, err => {
      if (err) console.error('Erro criando tabela:', err);
    });
  });
};

criarTabelas();

// ====================== ROTAS ======================

// ------- Usuários -------
app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;
  db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, mensagem: 'Usuário cadastrado!' });
    });
});

// ------- Produtos -------
app.post('/produtos', (req, res) => {
  const { nome, preco, custo, usuario_id } = req.body;
  db.query('INSERT INTO produtos (nome, preco, custo, usuario_id) VALUES (?, ?, ?, ?)',
    [nome, preco, custo, usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, mensagem: 'Produto cadastrado!' });
    });
});

// ------- Vendas -------
app.post('/vendas', (req, res) => {
  const { produto_id, quantidade, data, usuario_id } = req.body;
  db.query('INSERT INTO vendas (produto_id, quantidade, data, usuario_id) VALUES (?, ?, ?, ?)',
    [produto_id, quantidade, data, usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, mensagem: 'Venda registrada!' });
    });
});

// ------- Estoque -------
app.post('/estoque', (req, res) => {
  const { produto_id, quantidade, usuario_id } = req.body;
  db.query('INSERT INTO estoque (produto_id, quantidade, usuario_id) VALUES (?, ?, ?)',
    [produto_id, quantidade, usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, mensagem: 'Estoque atualizado!' });
    });
});

// ------- Simulações de Precificação -------
app.post('/simulacoes', (req, res) => {
  const { nome_produto, quantidade_produzida, preco_unit_custo, preco_unit_venda, ponto_equilibrio, usuario_id } = req.body;
  db.query('INSERT INTO simulacoes_precificacao (nome_produto, quantidade_produzida, preco_unit_custo, preco_unit_venda, ponto_equilibrio, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
    [nome_produto, quantidade_produzida, preco_unit_custo, preco_unit_venda, ponto_equilibrio, usuario_id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, mensagem: 'Simulação salva!' });
    });
});

// ------- Relatórios de Vendas -------
app.post('/relatorios', (req, res) => {
  const { produto_id, quantidade_vendida, gasto_producao, retorno_obtido, lucro_obtido, usuario_id, data_geracao } = req.body;
  db.query('INSERT INTO relatorios_vendas (produto_id, quantidade_vendida, gasto_producao, retorno_obtido, lucro_obtido, usuario_id, data_geracao) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [produto_id, quantidade_vendida, gasto_producao, retorno_obtido, lucro_obtido, usuario_id, data_geracao],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, mensagem: 'Relatório criado!' });
    });
});

// ------- Listar Relatórios de um Usuário -------
app.get('/relatorios/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  db.query('SELECT * FROM relatorios_vendas WHERE usuario_id = ?', [usuario_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(results);
    });
});

// ====================== SERVIDOR ======================
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
// src/index.js
const express = require('express');
const app = express();
const port = 3000;

// Pega as variáveis de ambiente do K8s/Docker
const dbHost = process.env.DB_HOST || 'não definido';
const dbUser = process.env.DB_USER || 'não definido';

app.get('/', (req, res) => {
    res.send(`
    <h1>API UniFIAP Pay (v1)</h1>
    <p>Conectando ao banco...</p>
    <ul>
      <li>DB_HOST: ${dbHost}</li>
      <li>DB_USER: ${dbUser}</li>
    </ul>
  `);
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`API da UniFIAP Pay rodando na porta ${port}`);
});
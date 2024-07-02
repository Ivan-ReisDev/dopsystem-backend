const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require("./src/routes/service");

const port = process.env.PORT_APP || 3000;

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'https://policiadop.com.br', // Permite apenas esta origem
  credentials: true  // Permite incluir cookies nas requisições
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

const connectdb = require('./src/DB/connect.js');
connectdb();

// Middleware para adicionar cabeçalhos CORS a todas as respostas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://policiadop.com.br');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Se a requisição for um OPTIONS, envie a resposta imediatamente
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

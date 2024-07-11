const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require("./src/routes/router.js");

const port = process.env.PORT_APP || 3000;

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'https://policiadop.com.br', // Substitua com a URL da sua aplicação frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

const connectdb = require('./src/DB/connect.js');
connectdb();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

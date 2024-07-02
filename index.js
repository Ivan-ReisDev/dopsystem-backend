const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https");
const cron = require('node-cron');
const cookieParser = require('cookie-parser'); 
const router = require("./src/routes/service");

const port = process.env.PORT_APP || 3000;
const httpsPort = 443;

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'https://policiadop.com.br', // Altere para o domínio da sua aplicação cliente
  credentials: true  // Permite incluir cookies na requisição
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Type");
  next();
});

const connectdb = require('./src/DB/connect.js');
connectdb();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

if (fs.existsSync("src/SSL/code.crt") && fs.existsSync("src/SSL/code.key")) {
  https.createServer({
    cert: fs.readFileSync("src/SSL/code.crt"),
    key: fs.readFileSync("src/SSL/code.key")
  }, app).listen(httpsPort, () => {
    console.log(`Servidor HTTPS rodando na porta ${httpsPort}`);
  });
} else {
  console.log("Certificados SSL não encontrados. Servidor HTTPS não será iniciado.");
}

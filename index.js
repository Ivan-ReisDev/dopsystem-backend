const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https");
const http = require("http");

const router = require("./src/routes/service");

const app = express();
const port = process.env.PORT_APP || 3000;
const httpsPort = 443;

// Middleware para parsear JSON e URL-encoded
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware para permitir requisições CORS
app.use(cors());

// Middleware para parsear o body como JSON
app.use(express.json());

// Conexão com o banco de dados MongoDB
const connectdb = require('./src/DB/connect');
connectdb();

// Rotas
app.use('/api', router);

// Servidor HTTP
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

// Servidor HTTPS
if (fs.existsSync("src/SSL/code.crt") && fs.existsSync("src/SSL/code.key")) {
  const httpsOptions = {
    cert: fs.readFileSync("src/SSL/code.crt"),
    key: fs.readFileSync("src/SSL/code.key")
  };
  const httpsServer = https.createServer(httpsOptions, app);
  httpsServer.listen(httpsPort, () => {
    console.log(`Servidor HTTPS rodando na porta ${httpsPort}`);
  });
} else {
  console.log("Certificados SSL não encontrados. Servidor HTTPS não será iniciado.");
}

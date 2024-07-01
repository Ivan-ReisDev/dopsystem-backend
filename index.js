const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
const fs = require("fs");
const https = require("https");
const router = require("./src/routes/service");
const cron = require('node-cron');
const { clearTokens } = require('./src/utils/UserUtils.js')

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
app.use(cookieParser()); // Usar cookie-parser

const connectdb = require('./src/DB/connect.js');
connectdb();

app.use('/api', router);

// cron.schedule('*/15 * * * * *', () => {
//   console.log('Executando tarefa de limpeza de tokens a cada 15 segundos');
//   clearTokens(); // Supondo que `clearTokens` é a função que limpa os tokens
// });

cron.schedule('0 0 */3 * *', () => {
  console.log('Executando tarefa de limpeza de tokens');
  clearTokens();
});

// Rota de exemplo para configurar um cookie HttpOnly
app.get('/setcookie', (req, res) => {
  res.cookie('token', 'your_jwt_token', {
    httpOnly: true, // Configura o cookie como HttpOnly
    secure: true, // Garante que o cookie só seja enviado em conexões HTTPS
    sameSite: 'Strict' // Garante que o cookie só seja enviado no mesmo site
  });
  res.send('Cookie configurado');
});

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

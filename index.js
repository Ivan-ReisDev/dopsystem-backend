const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require("fs");
const https = require("https");
const router = require("./src/routes/service");
const cron = require('node-cron');
const { clearTokens } = require('./src/utils/UserUtils.js');
const authGuard = require('./src/middlewares/authGuard'); // Importe o middleware de autorização

const port = process.env.PORT_APP || 3000;
const httpsPort = 443;

const app = express();

// Configuração do CORS para permitir requisições do domínio 'https://policiadop.com.br'
const corsOptions = {
  origin: 'https://policiadop.com.br',
  credentials: true, // Permite incluir cookies na requisição
  optionsSuccessStatus: 200 // Algumas versões de navegadores antigos (como o IE) requerem isso para funcionar corretamente
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

const connectdb = require('./src/DB/connect.js');
connectdb();

app.use('/api', router);

// Cron para limpeza de tokens
cron.schedule('0 0 */3 * *', () => {
  console.log('Executando tarefa de limpeza de tokens');
  clearTokens();
});

// Exemplo de uso do middleware de autorização
app.get('/api/recurso-protegido', authGuard(['admin', 'user']), (req, res) => {
  // Rota protegida que requer autenticação e autorização
  res.json({ message: 'Acesso permitido!' });
});

// Servidor HTTP
app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

// Servidor HTTPS (se os certificados estiverem presentes)
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

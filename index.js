const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const router = require("./src/routes/service");

const app = express();
const port = process.env.PORT_APP || 3000;

// Middleware para CORS manual
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'https://policiadop.com.br');
  res.header("Access-Control-Allow-Methods", 'GET, POST, DELETE, PUT');
  res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization');
  res.header("Access-Control-Allow-Credentials", 'true');
  
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

const connectdb = require('./src/DB/connect.js');
connectdb();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor HTTP online na porta ${port}, acesse: http://localhost:${port}/`);
});

const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

const connectdb = require('./src/DB/connect.js')
connectdb();
const routes = require('./src/routes/router.js')
app.use('/api', routes)

app.listen(3000, function(){
    console.log(`Server online na porta ${port}, acesse: http://localhost:${port}/` );
})
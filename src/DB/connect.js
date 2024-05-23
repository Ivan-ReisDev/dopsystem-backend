const mongoose = require("mongoose");
require('dotenv').config()

async function main(){
//TESTE
    try {
        // const dbUser = process.env.DB_USER
        // const dbPassword = process.env.DB_PASS

         mongoose.set("strictQuery", true)
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Banco Conectado", mongoose.connection.host);
    } catch (error) {
        console.log(`error: ${error}`);
    }
}


module.exports = main
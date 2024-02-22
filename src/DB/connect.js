const mongoose = require("mongoose");
require('dotenv').config()

async function main(){

    try {
        const dbUser = process.env.DB_USER
        const dbPassword = process.env.DB_PASS

         mongoose.set("strictQuery", true)
        await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.dvmxyl9.mongodb.net/?retryWrites=true&w=majority`);
        console.log("Banco Conectado", mongoose.connection.host);
    } catch (error) {
        console.log(`error: ${error}`);
    }
}


module.exports = main
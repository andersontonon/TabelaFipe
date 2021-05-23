const MongoClient = require("mongodb").MongoClient;
const addressMongo = process.env.MONGO_URL;

module.exports = class User{

    static async logar (email, senha){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();

        return await 
            db.collection('users')
            .findOne({email: email, senha: senha});
    }

    static async cadastrar (email, senha, usuario){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();

        return await 
            db.collection('users')
            .insertOne({email: email, senha: senha, usuario: usuario});
    }

    static async verificaUser(usuario){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();

        return await 
            db.collection('users')
            .findOne({usuario: usuario});
    }

    static async verificaEmail(email){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();
        console.log(email);
        return await 
            db.collection('users')
            .findOne({email: email});
    }
}
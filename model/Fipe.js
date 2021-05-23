const MongoClient = require("mongodb").MongoClient;
const addressMongo = process.env.MONGO_URL;

module.exports = class Fipe{
    static async buscar(busca, tipo, marca, modelo, ano){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();

        switch(busca){
            case 'TIPO':
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .distinct('Marca', {TipoVeiculo: numVeiculo});
            break;

            case 'MARCA':
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .distinct('Modelo', {TipoVeiculo: numVeiculo, Marca: marca}); 
            break;

            case 'MODELO':
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .distinct('AnoModelo', {TipoVeiculo: numVeiculo, Marca: marca, Modelo:modelo});  
            break;

            case 'ANO':
                var anoVeiculo = parseInt(ano);
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .find({TipoVeiculo: numVeiculo, Marca: marca, Modelo:modelo, AnoModelo:anoVeiculo})
                    .toArray();
            break;

            case 'BUSCAR':
                return await db.collection('tabelafipe')
                .find({TipoVeiculo: new RegExp('^' + tipo)})
                .toArray();
            break;

            default:
                return await db.collection('tabelafipe').find().toArray();
        }
    }

    static async listarMarcas(){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();

        return await 
            db.collection('marcas')
            .distinct('nome');
    }  

    static async cadastrarVeiculo(veiculo){

        const conn = await MongoClient.connect(addressMongo);
        const db = conn.db();

        return await 
            db.collection('tabelafipe')
            .insertOne(veiculo);
    }  
}
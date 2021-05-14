const MongoClient = require("mongodb").MongoClient;

module.exports = class Fipe{
    static async find (busca, tipo, marca, modelo, ano){

        const conn = await MongoClient.connect(process.env.MONGO_URL);
        const db = conn.db();

        switch(busca){

            case 'TIPO':
                console.log('TIPO:');
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .distinct('Marca', {TipoVeiculo: numVeiculo});

            break;

            case 'MARCA':
                console.log('MARCA:');
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .distinct('Modelo', {TipoVeiculo: numVeiculo, Marca: marca});
                    
            break;

            case 'MODELO':
                console.log('MODELO:');
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .distinct('AnoModelo', {TipoVeiculo: numVeiculo, Marca: marca, Modelo:modelo});
                    
            break;

            case 'ANO':
                console.log('ANO:');
                var anoVeiculo = parseInt(ano);
                var numVeiculo = parseInt(tipo);
                return await 
                    db.collection('tabelafipe')
                    .find({TipoVeiculo: numVeiculo, Marca: marca, Modelo:modelo, AnoModelo:anoVeiculo})
                    .toArray();
            break;

            // default:
            //     console.log('fipe:');
            //     return await db.collection('tabelafipe')
            //     .find({TipoVeiculo: new RegExp('^' + tipo)})
            //     .toArray();
        }
        return await db.collection('tabelafipe').find().toArray();
    }
}
const express = require('express')
const server = express()

server.get('/',(req, res) =>{
    res.send('<h1>Home</h1>')
})

server.post('/buscar', (req, res) =>{
    res.send('Funcionou')
})

server.get('/buscar',(req, res) =>{
    res.send(`
        <h1>Buscar</h1>
        
        <form action ="/buscar" method="POST">
            <label for="tipo">Tipo</label>
            <input type="text" name="tipo" id="tipo"></input>
            <br>
            <br>
            <label for="marca">Marca</label>
            <input type="text" name="marca" id="marca"></input>
            <br>
            <br>
            <label for="modelo">Nome</label>
            <input type="text" name="nome" id="nome"></input>
            <br>
            <br>
            <label for="modelo">Ano</label>
            <input type="text" name="ano" id="ano"></input>
            <br>
            <br>
            <input type="submit" value="Enviar">
        </form>
    `)
})

server.listen(3080, () =>{
    console.log('Servidor iniciado em http://localhost:3080')
    console.log('Para desligar o servidor: ctrl + c')
})
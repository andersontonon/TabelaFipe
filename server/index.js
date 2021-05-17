const http = require('http');
const path = require('path');
const express = require('express')
const server = express();
const url = require('url');
const qs = require('querystring');
const bodyParser = require('body-parser');
const Fipe = require('../model/Fipe.js');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.set('view engine', 'hbs');
server.set('views',path.join(__dirname, '../view'));
server.use(express.static(path.join(__dirname, '../public')));

const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

const session = {};

server.get('/' || '', (req, res) =>{
    const cookies = parseCookies(req.headers.cookie);

	if(cookies && cookies.session_user){
        res.render('busca',{resLabelAdmin: cookies.session_user});

	}else{
		res.render('paginaLogin');
	}
});

server.post('/entrar', async (req, res) => {
    const {email, senha} = req.body;
    const user = await Fipe.login(email, senha);

    if(!user){
        return res.status(400).send({error: "Usuario não encontrado"});
    }
    if(user.senha != senha){
        return res.status(400).send({error: "Senha incorreta!!!"})
    }
    if(user.email == "awst@live.com"){
        res.cookie('session_user', user.usuario, { maxAge: 900000, httpOnly: true });
        return res.render('cadastroVeiculo', {resLabelAdmin: user.usuario});
    }else{

        res.cookie('session_user', user.usuario, { maxAge: 900000, httpOnly: true });
        return res.render('busca', {resLabelAdmin: user.usuario})
    }
});

server.get('/entrar', async (req, res) => {
    return res.redirect('/');
});

server.post('/logout', async (req, res) =>{
    res.clearCookie("session_user");
    return res.redirect('/');

});

server.get('/login', (req, res) => {
    res.render('paginaLogin', (err,data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});

server.get('/cadastrar-veiculo', async (req, res) => {
    
    const dados = JSON.parse(req.query.dados);
    const resGravar = await Fipe.find('CADASTRAR_VEICULO', dados);

    res.send(resGravar);
});

server.get('/busca', (req, res) => {
    res.render('busca', (err,data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});

server.get('/fipe/tipo', async (req, res) => {
    
    const tipo = req.query.tipo;
    const resBusca = await Fipe.find('TIPO', tipo);
    var dados = [];

    for(let value of resBusca){
        dados.push({value});
    }
    res.send({dados});
});

server.get('/fipe/tipo/marca', async (req, res) => {

    const tipo = req.query.tipo;
    const marca = req.query.marca;
    const resBusca = await Fipe.find('MARCA' ,tipo, marca);
    var dados = [];

    for(let value of resBusca){
        dados.push({value});
    }

    res.send({dados});
});

server.get('/fipe/tipo/marca/modelo', async (req, res) => {

    const tipo = req.query.tipo;
    const marca = req.query.marca;
    const modelo = req.query.modelo;
    const resBusca = await Fipe.find('MODELO' ,tipo, marca, modelo);
    var dados = [];

    for(let value of resBusca){
        dados.push({value});
    }
    res.send({dados});
});

server.get('/fipe/tipo/marca/modelo/ano', async (req, res) => {

    const tipo = req.query.tipo;
    const marca = req.query.marca;
    const modelo = req.query.modelo;
    const ano = req.query.ano;
    const resBusca = await Fipe.find('ANO' ,tipo, marca, modelo, ano);
    
    res.send(resBusca[0]);
});

server.get('/listar-marcas', async (req, res) => {
    
    const tipo = req.query.tipo;
    const resBusca = await Fipe.find('LISTAR_MARCAS', tipo);
    var dados = []; 

    for(let value of resBusca){
        dados.push({value});
    }
    res.send({dados});
});

server.get('/admin/cadastro-veiculo', (req, res) => {
    res.render('cadastroVeiculo', (err,data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});

server.listen(process.env.PORT || 3000, () =>{
    console.log('Servidor iniciado em http://localhost:3000');
    console.log('Para desligar o servidor: ctrl + c');
});
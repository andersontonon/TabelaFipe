const http = require('http');
const path = require('path');
//const fs = require('fs');
const express = require('express')
const server = express();
const url = require('url');
const qs = require('querystring');
const Fipe = require('../model/Fipe.js');

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

server.get('/' || '',(req, res) =>{
    res.render('busca');

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

server.get('/login', (req, res) => {
    res.render('paginaLogin', (err,data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});

server.get('/busca', (req, res) => {
    res.render('busca', (err,data) => {
        if (err) {
            throw err;
        }
        res.end(data);
    });
});


server.get('/entrar', (req, res) => {

    const cookies = parseCookies(req.headers.cookie);
    
    console.log(cookies.session);

    if (session[cookies.session] && session[cookies.session].email =='awst@live.com' && session[cookies.session].expires > new Date()) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(`Bem vindo ${session[cookies.session].email}`);

    }else if(req.url.startsWith('/entrar')){ 
        const email = req.query.email;
        console.log(email);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 1);
        const randomInt = +new Date();
        session[randomInt] = {
            email,
            expires
        };
        //res.setHeader
        res.writeHead(302, {
            Location: '/entrar', 'Set-Cookie': `session=${randomInt};Expires=${expires.toUTCString()};HttpOnly;Path=/`,
        });
        res.end();
     }else{
        res.render('paginaLogin', (err,data) => {
            if (err) {
                throw err;
            }
            res.end(data);
        });        
    }  
});

server.listen(8090, "192.168.0.120", () =>{
    console.log('Servidor iniciado em http://localhost:8090');
    console.log('Para desligar o servidor: ctrl + c');
});
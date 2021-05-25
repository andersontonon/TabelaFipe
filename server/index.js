const path = require('path');
const express = require('express')
const server = express();
const bodyParser = require('body-parser');
const Fipe = require('../model/Fipe.js');
const User = require('../model/User.js');
const session = require('express-session');
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

server.use(session({
    name: 'session',
    secret: 'a1b2c3d4e5f6g7h8i9j0',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

server.get('/', async (req, res) =>{

    const cookies = parseCookies(req.headers.cookie);
    const session = req.session;

    if(cookies.email && cookies.email == "tabela@fipe.com" && session.email && session.email == "tabela@fipe.com"){
        res.render('cadastro-veiculo',{resLabelAdmin: cookies.email});

	}else if(cookies.email && session.email){
        res.render('busca-veiculo',{resLabelAdmin: cookies.email});

	}else{
		res.render('login-usuario', {resLogin: "Faça login para buscar veículos."});
	}
});

server.post('/verificar-login', async (req, res) => {
    const {email, senha} = req.body;
    const user = await User.logar(email, senha);

    if(!user || user == null){
        return res.send('rejection');
    }else if(user.email.length > 4){
        return res.send('success');
    }else{
        return res.send('rejection');
    }
});

server.post('/fazer-login', async (req, res) => {
    const {email, senha} = req.body;
    const user = await User.logar(email, senha);

    if(!user || user == null){
        return res.render('login-usuario', {resLogin: "E-mail e/ou senha inválidos.", email:email});
        
    }else if(user.email == 'tabela@fipe.com'){
        res.cookie('email', user.email, { maxAge: 900000, httpOnly: true });
        req.session.email = user.email;
        return res.render('cadastro-veiculo', {resLabelAdmin: user.email});

    }else{
        res.cookie('email', user.email, { maxAge: 900000, httpOnly: true });
        req.session.email = user.email;
        return res.render('busca-veiculo', {resLabelAdmin: user.email});
    }
});


server.get('/admin/cadastro-veiculo', async (req, res) => {

    const cookies = parseCookies(req.headers.cookie);
    const session = req.session;

    if(cookies.email && cookies.email == "tabela@fipe.com" && session.email && session.email == "tabela@fipe.com"){
        res.render('cadastro-veiculo',{resLabelAdmin: cookies.email});

	}else{
		res.render('login-usuario', {resLogin: "Faça login como admin para cadastrar veículos."});
	}
});

server.get('/login-usuario', async (req, res) => {
    return res.render('login-usuario');

});

server.post('/login-cadastrado', async (req, res) => {

    const {email} = req.body;
    return res.render('login-usuario', {email:email});
    
});

server.post('/cadastrar-login', async (req, res) => {
    const {email, senha, usuario} = req.body;
    const user = await User.cadastrar(email, senha, usuario);

    if(!user.ops[0]){
        res.send('rejection');
        res.end();

    }else if(user.ops[0].usuario == usuario && user.ops[0].email){
        res.send('rejection');
        res.end();

    }else if(user.ops[0].usuario){
        res.send('success');
        res.end();
    }
});

server.get('/cadastrar-usuario', async (req, res) => {
    return res.redirect('/cadastro-usuario');
});

server.get('/cadastrar-login', async (req, res) => {
    return res.redirect('/cadastro-usuario');
});

server.post('/logout', async (req, res) =>{
    res.clearCookie("email");
    return res.redirect('/');

});

server.get('/fazer-login', async (req, res) => {
    res.render('login-usuario');
});

server.post('/verificar-usuario', async (req, res) => {
    
    const {usuario} = req.body;
    const resBusca = await User.verificaUser(usuario);

    if(resBusca && resBusca.usuario == usuario){
        res.send("indisponivel");
        res.end();
    }else{
        res.send("disponivel");
        res.end();
    }
});

server.post('/verificar-email', async (req, res) => {
    
    const {email} = req.body;
    const resBusca = await User.verificaEmail(email);

    if(resBusca && resBusca.email == email){
        res.send("indisponivel");
        res.end();
    }else{
        res.send("disponivel");
        res.end();
    }
});


server.get('/busca', async (req, res) => {

    const cookies = parseCookies(req.headers.cookie);
    const session = req.session;
    
    if(cookies.email && session.email){
        res.render('busca-veiculo',{resLabelAdmin: cookies.email});

	}else{
		res.render('login-usuario', {resLogin: "Faça login para buscar veículos."});
	}
});

server.get('/cadastrar-veiculo', async (req, res) => {
    
    const dados = JSON.parse(req.query.dados);
    const resGravar = await Fipe.cadastrarVeiculo(dados);

    res.send(resGravar);
    res.end();
});

server.get('/fipe/tipo', async (req, res) => {
    
    const tipo = req.query.tipo;
    const resBusca = await Fipe.buscar('TIPO', tipo);
    var dados = [];

    for(let value of resBusca){
        dados.push({value});
    }
    res.send({dados});
    res.end();
});

server.get('/fipe/tipo/marca', async (req, res) => {

    const tipo = req.query.tipo;
    const marca = req.query.marca;
    const resBusca = await Fipe.buscar('MARCA' ,tipo, marca);
    var dados = [];

    for(let value of resBusca){
        dados.push({value});
    }

    res.send({dados});
    res.end();
});

server.get('/fipe/tipo/marca/modelo', async (req, res) => {

    const tipo = req.query.tipo;
    const marca = req.query.marca;
    const modelo = req.query.modelo;
    const resBusca = await Fipe.buscar('MODELO' ,tipo, marca, modelo);
    var dados = [];

    for(let value of resBusca){
        dados.push({value});
    }
    res.send({dados});
    res.end();
});

server.get('/fipe/tipo/marca/modelo/ano', async (req, res) => {

    const tipo = req.query.tipo;
    const marca = req.query.marca;
    const modelo = req.query.modelo;
    const ano = req.query.ano;
    const resBusca = await Fipe.buscar('ANO' ,tipo, marca, modelo, ano);
    
    res.send(resBusca[0]);
    res.end();
});

server.get('/listar-marcas', async (req, res) => {
    
    const resBusca = await Fipe.listarMarcas();
    var dados = []; 

    for(let value of resBusca){
        dados.push({value});
    }
    res.send({dados});
    res.end();
});


server.get('/ajuda-sobre' , async (req, res) => {
	
    res.render('ajuda-sobre');
	
});

server.get('/ajuda' , async (req, res) => {

    res.render('ajuda-sobre');
	
});

server.get('/cadastro-usuario', async (req, res) => {
    
    res.render('cadastro-usuario');
});

server.listen(process.env.PORT || 3000, () =>{
    console.log('Servidor iniciado em http://localhost:3000');
    console.log('Para desligar o servidor: ctrl + c');
});
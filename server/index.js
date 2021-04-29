  
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

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

http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    
    if(req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { email } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 1);
        const randomInt = +new Date();
        session[randomInt] = {
            email,
            expires
        };
        res.writeHead(302, {
            Location: '/',
            'Set-Cookie': `session=${randomInt};Expires=${expires.toUTCString()};HttpOnly;Path=/`,
        });
        res.end();
    } else if (cookies.session && session[cookies.session].email =='awst@live.com' && session[cookies.session].expires > new Date()) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(`Bem vindo ${session[cookies.session].email}`)
    } else {
        fs.readFile('client/login.html', (err,data) => {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    }
})
    .listen(8090, () => {

        console.log('listening on port 8090');
    })
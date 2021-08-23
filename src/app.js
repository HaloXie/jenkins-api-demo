const express = require('express');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * 自动导入路由
 */
fs.readdirSync(`${__dirname}/routes`).forEach(_name => {
	const name = _name.replace(/.js/, '');
	const obj = require(`./routes/${name}`);
	app.use(`/${name.replace('Route', '')}`, obj);
});

// process.on('uncaughtException', e => {
// 	console.error(`uncaughtException: ${e.stack}`);
// });
// process.on('unhandledRejection', e => {
// 	console.error(`unhandledRejection: ${e.stack}`);
// });

const server = http.createServer(app);
server.listen(8081, () => {
	console.log('🚀🚀🚀 server has started');
});

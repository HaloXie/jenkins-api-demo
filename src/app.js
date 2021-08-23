import express from 'express';
import fs from 'fs';

const app = express();

/**
 * 自动导入路由
 */

fs.readdirSync(`${__dirname}/routes`).forEach(_name => {
	const name = _name.replace(/.js/, '');
	const obj = require(`./routes/${name}`);
	app.use(`/${name}`, obj);
});

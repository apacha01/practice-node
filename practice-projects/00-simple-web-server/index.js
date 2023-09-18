const express = require('express');
const bodyParse = require('body-parser');
const { engine } = require('express-handlebars');
const { resolve } = require('path');
const users = require('./src/users.json');
const data = require('./src/data.json');

// UTILS
const checkUserExist = (name) => {
	for (const u of users) {
		if (u.name === name)
			return true;
	}
	return false;
};

const checkUserPass = (name, pass) => {
	for (const u of users) {
		if (u.name === name && u.password === pass)
			return true;
	}
	return false;
};

const getUserId = (name) => {
	return users.find(u => u.name === name)?.id;
};

const getUserMessages = (id) => {
	return data.find(u => u.id === id).messages;
};

// APP
const app = express();

app.use(bodyParse.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', resolve(__dirname + '/views'));

let logIn = {id: null, logged: false};

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.render('home', {title: 'Home'});
});

app.post('/', (req, res) => {
	logIn.logged = false;
	logIn.id = null;
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.render('home', {title: 'Home'});
});

app.get('/login', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.render('login', {title: 'Login', logged: logIn.logged});
});

app.post('/login', (req, res) => {
	if (checkUserPass(req.body.name, req.body.pass)) {
		logIn.logged = true;
		logIn.id = getUserId(req.body.name, req.body.pass);
		res.redirect(`/messages/${logIn.id}`);
	}
	else {
		res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
		res.send('<h1>Credenciales Incorrectas</h1>');
	}
});

app.get('/messages/:id', (req, res) => {
	if (logIn.logged) {
		if(logIn.id != parseInt(req.params.id)){
			res.redirect('/error', {title: 'Error', error: 'No puedes ver los mensajes de otro usuario'});
		}
		const messages = getUserMessages(parseInt(req.params.id));
		res.render('messages', {title:'Mensajes', messages, logged: logIn.logged});
	}
	else {
		res.send('<p>Necesitas logearte para leer tus mensajes</p>');
	}
});

app.get('/contact', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.render('contact', {title: 'Contact'});
});

app.post('/contact', (req, res) => {
	const date = new Date().getTime();
	const { from, to, message } = req.body;

	if(!checkUserExist(to)) {
		res.render('error', {title: 'Error', error: 'Ese usuario no existe'});
	}
	else {
		data.find(u => u.id === getUserId(to)).messages.push({date, from: from, message});

		res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
		res.render('messageSend', {title: 'Exito'});
	}
});

app.use((req, res) => {
	res.status(404);
	res.send('<h1>404 Error: Not found</h1>');
});
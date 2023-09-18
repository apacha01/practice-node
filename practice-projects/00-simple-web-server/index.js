const express = require('express');
const bodyParse = require('body-parser');
const users = require('./src/users.json');
const data = require('./src/data.json');

// UTILS
const checkUserExist = (name, pass) => {
	for (const u of users) {
		if (u.name === name && u.password === pass)
			return true;
	}
	return false;
};

const getUserId = (name, pass) => {
	return users.find(u => u.name === name && u.password === pass).id;
};

const getUserMessages = (id) => {
	return data.find(u => u.id === id).messages;
};

// APP
const app = express();

app.use(bodyParse.urlencoded({ extended: true }));

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.sendFile('index.html', {root: 'public'});
});

app.get('/login', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.sendFile('login.html', {root: 'public'});
});

app.post('/login', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');

	if (checkUserExist(req.body.name, req.body.pass)) {
		res.sendFile('messages.html', {root: 'public'});
	}
	else {
		res.send('<h1>Credenciales Incorrectas</h1>');
	}
});

app.get('/contact', (req, res) => {
	res.setHeader('Content-Type', 'text/html', 'charset=utf-8');
	res.sendFile('contact.html', {root: 'public'});
});

app.use((req, res) => {
	res.status(404);
	res.send('<h1>404 Error: Not found</h1>');
});
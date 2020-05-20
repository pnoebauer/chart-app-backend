const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  	client: 'pg',
  	connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'pricedata'
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
	res.json('This is working')
});

app.post('/register', (req,res) => {
	const { email, name } = req.body;
	db('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})//.then(function(user){console.log(user)});
		.then(user => res.json(user[0]))	
		// .catch(err => res.status(400).json(err));
		.catch(err => res.status(400).json('unable to register'));
}); 


app.listen(3000, ()=> {
	console.log('app is running on port 3000')
})
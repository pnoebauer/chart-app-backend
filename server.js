const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');

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

app.post('/register', (req,res) => register.handleRegister(req,res,db)); 


app.listen(3000, ()=> {
	console.log('app is running on port 3000')
})
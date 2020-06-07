const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const data = require('./controllers/data');

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
	// res.json('Connected to backend.')
	// db.select('*').from('users').then(users=>res.json(users[0]));
  // db.select('*').from('sp500').then(data=>res.json(data[0]));
  //or
  // db('sp500').where('id','<',10).then(data=>res.json(data));
  db('sp500')
    .where('id','<',5)
    .select('id','datetime')
    .then(data=>res.send(data));
  // db('sp500').where('id','<',10).then(data=>console.log(JSON.stringify(data)));
});

app.post('/register', (req,res) => register.handleRegister(req,res,db)); 
app.post('/signin', (req,res) => signin.handleSignin(req,res,db));

app.get('/files/csv',(req,res) => data.handleData(req,res,db));

// SELECT  
//     date_trunc('day', datetime) datetime,
//     (array_agg(openprice ORDER BY datetime ASC))[1] o,
//     MAX(highprice) h,
//     MIN(lowprice) l,
//     (array_agg(closeprice ORDER BY datetime DESC))[1] c,
//     SUM(volume) volume,
// --    SUM(openint) openint,
//     COUNT(*) ticks
// FROM "sp500"  
// --WHERE datetime BETWEEN '2000-11-08' AND '2000-11-09'  
// GROUP BY date_trunc('day', datetime)  
// ORDER BY datetime  
// LIMIT 1000;  

// db('sp500')
//   .select(db.raw("date_trunc('day', datetime) datetime, \
//     (array_agg(openprice ORDER BY datetime ASC))[1] o, \
//     MAX(highprice) h, \
//     MIN(lowprice) l, \
//     (array_agg(closeprice ORDER BY datetime DESC))[1] c, \
//      SUM(volume) volume, \
//     COUNT(*) ticks"))
//   .groupBy(db.raw("date_trunc('day', datetime)"))
//   .orderBy('datetime')
//   .limit(50)
//   .then(data=>console.log(data))

const period = 'day';

db('sp500')
  .select(db.raw(`date_trunc('${period}', datetime) datetime, \
    (array_agg(openprice ORDER BY datetime ASC))[1] o, \
    MAX(highprice) h, \
    MIN(lowprice) l, \
    (array_agg(closeprice ORDER BY datetime DESC))[1] c, \
    SUM(volume) volume, \
    COUNT(*) ticks`))
  .whereBetween('datetime', ['2000-11-08', '2000-12-08'])
  .groupBy(db.raw(`date_trunc('${period}', datetime)`))
  .orderBy('datetime')
  .limit(50)
  .then(data=>console.log(data))


app.listen(4000, () => {
	console.log('app is running on port 4000');
})
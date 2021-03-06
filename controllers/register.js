const bcrypt = require('bcrypt-nodejs');

const handleRegister = (req,res,db) => {
	const { email, name, password } = req.body;

	db.transaction(trx => {
		return trx.insert({
			hash: bcrypt.hashSync(password),
			email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail =>
				trx('users')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.returning('*')
				.then(user => res.json(user[0]))	
				.catch(err => res.status(400).json('error registering name'))
			)
			.then(trx.commit)
			.catch(trx.rollback)
			})
	.catch(err => res.status(400).json('unable to register'));

}

module.exports = {
	handleRegister: handleRegister
};
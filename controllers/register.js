const handleRegister = (req,res,db) => {
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
}

module.exports = {
	handleRegister: handleRegister
};
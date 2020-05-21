const handleSignin = (req,res,db) => {
	const {email, password} = req.body;

	db('users').where({
	  email: email,
	})
	.then(user=>res.json(user[0]));
	
}

module.exports  = {
	handleSignin: handleSignin
};
const handleSignin = (req,res,db) => {
	const {email, password} = req.body;

	db('users').where({
	  email: email,
	})
	.then(
		user => {
			if(user.length > 0){
				return res.json(user[0]);
			}
			else {
				return res.json('user does not exist');
			}
		} 
	)
	.catch(err => res.json('incorrect input variables'));
}

module.exports  = {
	handleSignin: handleSignin
};
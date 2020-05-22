const handleSignin = (req,res,db) => {
	const {email, password} = req.body;

	db('login').where({email: email})
	.then(userInfo => 
		{
			if(userInfo[0].hash === password) 
			{
				return db('users').select('*')
					.where('email','=',userInfo[0].email)
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
			}
			else {
				return res.json('the password/email combination is incorrect');
			}
		}
	)
	.catch(err => res.json('incorrect input variables'));
}

module.exports  = {
	handleSignin: handleSignin
};
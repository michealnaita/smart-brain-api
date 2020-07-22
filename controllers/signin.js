const handleSignIn = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json("incorrect form submission");
	}
	db.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then((user) => {
						res.json({ message: "success", Id: user[0].id });
					})
					.catch((err) => res.status(404).json("User not found"));
			} else {
				res.status(404).json(
					"Failed to signin, check your username or passwordUser not found"
				);
			}
		})
		.catch((err) =>
			res
				.status(404)
				.json("Failed to signin, check your username or password")
		);
};

module.exports = {
	handleSignIn: handleSignIn,
};

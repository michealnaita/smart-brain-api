const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

//connecting to database
const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "liz pc",
		password: "naita",
		database: "smart-brain",
	},
});
// db.select("*")
// 	.from("users")
// 	.then((data) => {
// 		console.log(data);
// 	});

const app = express();

//MIDDLEWARE
//to undersatnd convert req.body from json
app.use(bodyParser.json());

//to all access from browseer
app.use(cors());

//BCRYPT

// bcrypt.hash("bacon", null, null, function (err, hash) {
// 	// Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
// 	// res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
// 	// res = false
// });

//DATA BASE

app.get("/", (req, res) => {
	res.json(dataBase.users);
});

//SIGN IN ROUTE

app.post("/signin", (req, res) => {
	db.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
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
	// if (
	// 	req.body.email === dataBase.users[0].email &&
	// 	req.body.password === dataBase.users[0].password
	// ) {
	// 	res.json({ message: "success", Id: dataBase.users[0].id });
	// } else {
	// 	res.status(400).json(
	// 		"Failed to signin, check your username or password"
	// 	);
	// }
});

//REGISTER  ROUTE

app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction((trx) => {
		trx.insert({
			hash: hash,
			email: email,
		})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				return trx
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date(),
					})
					.into("users")
					.returning("*")
					.then((user) => {
						res.json(user[0]);
					});
				// trx.insert({
				// 	name: name,
				// 	email: loginEmail,
				// 	joined: new Date(),
				// })
				// 	.into("users")
				// 	.returning("*")
				// 	.then((user) => {
				// 		res.json(user[0]);
				// 	});

				// return trx("users")
				// .returning("*")
				// .insert({
				// 	email: loginEmail,
				// 	name: name,
				// 	joined: new Date(),
				// })
				// .then((user) => {
				// 	res.json(user[0]);
				// });
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch((err) => res.status(400).json("Unable to register"));
});

//PROFILE ROUTE

// function help() {
// 	dataBase.users.forEach((user) => {
// 		if (user.id === 1) {
// 			console.log(user);
// 		}
// 	});
// }
// help();

//profile route
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	db.select("*")
		.from("users")
		.where({ id: id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(404).json("User not found");
			}
		});

	// if (found === false) {
	// 	res.status(404).json("user not found");
	// }
});

//IMAGE ROUTE
app.put("/image", (req, res) => {
	const { id } = req.body;
	db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch((err) => res.status(400).json("Sorry, failed to get entries"));
});

app.listen(3001, () => {
	console.log("app is up on PORT 3001");
});

/*
/--> res = this is working
/signin --> POST = success/ fail
/register --> POST = new user object
/profile/:userId --> GET = user
/image --> PUT  = updated user object/ updated count

*/

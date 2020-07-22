const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

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

app.get("/", (req, res) => {
	res.send("it is working");
});

//SIGN IN ROUTE

app.post("/signin", signin.handleSignIn(db, bcrypt));

//REGISTER  ROUTE
app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

//PROFILE ROUTE
app.get("/profile/:id", (req, res) => {
	profile.handleProfile(req, res, db);
});

//IMAGE ROUTE
app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});
//API CALL
app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is up on PORT 3001${process.env.PORT}`);
});

/*
/--> res = this is working
/signin --> POST = success/ fail
/register --> POST = new user object
/profile/:userId --> GET = user
/image --> PUT  = updated user object/ updated count

*/

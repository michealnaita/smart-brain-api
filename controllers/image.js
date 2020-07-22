const Clarifai = require("clarifai");

//clarifai API
const app = new Clarifai.App({
	apiKey: "7c9e62e8f935466bae4bc095365edf10",
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then((data) => {
			res.json(data);
		})
		.catch(
			(err) => console.log(err)
			// res.status(400).json("unable to fetch api")
		);
};

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch(
			(err) => console.log(err)
			// res.status(400).json("Sorry, failed to get entries")
		);
};
module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall,
};

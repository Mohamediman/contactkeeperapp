const mongoose = require("mongoose");

//==== Create the Schema =====
const ContactSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	phone: {
		type: String,
	},
	type: {
		type: String,
		default: "personal",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

//====== Create and export the model
module.exports = mongoose.model("Contact", ContactSchema);

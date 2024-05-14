const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide username"],
		maxLength: [50, "Username too long, should be less than 50 characters"],
		minLength: [3, "Username too short"],
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		validate: {
			validator: validator.isEmail,
			message: "Please provide valid email address",
		},
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		// minLength: [8, "Password should be minimum 8 characters long"],
	},
	role: {
		type: String,
		enum: ["admin", "user", "owner"],
		default: "user",
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false,
	},
	verifiedOn: {
		type: Date,
	},
	passwordToken: {
		type: String,
	},
	passwordTokenExpirationDate: {
		type: Date,
	},
});

UserSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
	const isPasswordCorrect = await bcrypt.compare(userPassword, this.password);
	return isPasswordCorrect;
};

module.exports = mongoose.model("User", UserSchema);

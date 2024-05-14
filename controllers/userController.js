const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/UserModel");
const { UnauthorizedError, BadRequestError } = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils/jwt");
const { checkPermissions } = require("../utils/checkPermissions");

const getSingleUser = async (req, res) => {
	const { id } = req.params;
	const user = await UserModel.findById(id).select("-password");
	checkPermissions({ reqUser: req.user, resourceUser: user });
	return res.status(StatusCodes.OK).json({ msg: "success", user });
};

const getAllUsers = async (req, res) => {
	const users = await UserModel.find({}).select("-password");
	return res.status(StatusCodes.OK).json({ msg: "success", users });
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new BadRequestError("Provide valid inputs");
	}
	const { userId } = req.user;
	if (!req.user) {
		throw new UnauthorizedError("Invalid Authentication");
	}
	const user = await UserModel.findById(userId);
	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new UnauthorizedError("Invalid credentials");
	}
	user.password = newPassword;
	await user.save();
	return res.status(StatusCodes.OK).json({ msg: "password updated!" });
};

const updateUser = async (req, res) => {
	const { email, username } = req.body;
	if (!email || !username) {
		throw new BadRequestError("please provide valid inputs");
	}
	const user = await UserModel.findOne({ email });
	if (!user) {
		throw new UnauthorizedError("Invalid Authentication");
	}
	user.email = email;
	user.username = username;
	await user.save();
	attachCookiesToResponse({ res, tokenUser: createTokenUser(user) });
	return res.status(StatusCodes.OK).json({ msg: "user updated successfully" });
};

const showCurrentUser = (req, res) => {
	return res
		.status(StatusCodes.OK)
		.json({ msg: "current user", user: req.user });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	updateUser,
	updateUserPassword,
	showCurrentUser,
};

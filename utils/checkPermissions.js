const { ForbiddenAccessError } = require("../errors");

const checkPermissions = ({ reqUser, resourceUser }) => {
	if (reqUser.role === "admin") return;
	if (reqUser.userId === resourceUser._id.toString()) return;
	throw new ForbiddenAccessError("not authorized to access this route");
};

module.exports = {
	checkPermissions,
};

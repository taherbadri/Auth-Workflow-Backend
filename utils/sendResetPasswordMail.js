const {
	resetPasswordEmailHTML,
} = require("../html-templates/resetPasswordEmailTemplate");
const sendMail = require("./sendEmail");

const sendResetPasswordMail = ({ email, passwordToken, origin }) => {
	const html = resetPasswordEmailHTML({ passwordToken, email, origin });
	return sendMail({ to: email, subject: "Password Reset Link", html });
};

module.exports = {
	sendResetPasswordMail,
};

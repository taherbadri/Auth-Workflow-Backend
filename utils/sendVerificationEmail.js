const {
	verificationEmailHTML,
} = require("../html-templates/verificationEmailTemplate");
const sendMail = require("./sendEmail");

const sendVerificationEmail = async ({ verificationToken, email, origin }) => {
	const html = verificationEmailHTML({ email, origin, verificationToken });
	return sendMail({ to: email, subject: "Email Confirmation", html });
};

module.exports = {
	sendVerificationEmail,
};

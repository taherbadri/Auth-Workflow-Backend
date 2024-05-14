// --- import dotenv and express-async-errors
require("dotenv").config();
require("express-async-errors");
// --- import dotenv and express-async-errors

// --- import express and assign it to a variable and invoke it
const express = require("express");
const app = express();
// --- import express and assign it to a variable and invoke it

// --- import database connection function
const connectDB = require("./db/connect");
// --- import database connection function

// --- import middlewares
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
// --- import middlewares

// --- import security packages
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// --- import security packages

// --- use the security packages
app.use(helmet());
app.use(xss());
app.use(cors());
/* {
		origin: process.env.ORIGIN, // Change to the origin of your app
		credentials: true,
	}*/
app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 150,
	})
);
// --- use the security packages

// --- use the middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static("./public"));
app.use(cookieParser(process.env.JWT_SECRET));
// --- use the middlewares

// --- import routes from router
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const { homepage } = require("./html-templates/homepage");
// --- import routes from router

// --- api routes "/api/v1"
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
// --- api routes "/api/v1"

app.get("/", (req, res) => {
	res.send(homepage());
});
// app.get("/")

// --- invoke our custom middlewares
app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);
// --- invoke our custom middlewares

// --- assign port and connect server to database
const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};
// --- assign port and connect server to database
start();

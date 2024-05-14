const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res) => {
	return res.status(StatusCodes.NOT_FOUND).send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
        </style>
    </head>
    <body
        style="height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div
            style="display: flex; width: 25%; align-items: center; justify-content: space-evenly;">
            <h1
                style="border-right: 1px solid gray; padding-right: 1rem;">${StatusCodes.NOT_FOUND}</h1>
            <h4>This page could not be found.</h4>
        </div>
    </body>
</html>`);
};

module.exports = notFoundMiddleware;

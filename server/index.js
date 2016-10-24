// Main starting point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');

const app = express();

// APP SETUP

/* Morgan and BodyParser are express middleware.  Any request to the
server will pass through these middlewares.  Morgan is a logging tool.
It will show the info for each request that comes to the server.  bodyParser
parses incoming requests to JSON no matter what the request is.  This can
cause issues down the road but for now it will work well. */
app.use(morgan('combined'));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// END APP SETUP



// SERVER SETUP

// Either use a preset environment port or 3090
const port = process.env.PORT || 3090;

// Create a server that can handle responses and pass to express server
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);

// END SERVER SETUP

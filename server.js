const express = require('express');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();
server.use(logger);
server.use(express.json());

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  const environment = process.env;
  const port = process.env.PORT || 5000;
  res.status(200).json({ api: 'up', port, environment });
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const endpoint = req.originalUrl;
  const timestamp = new Date();

  console.log(`${timestamp}: ${method} to ${endpoint}`)

  next();
}

module.exports = server;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION ❤️‍🔥 Shutting down...');
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log('Connected Successfully'))
  .catch(err => {
    console.error(err);
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Your server run on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ❤️‍🔥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

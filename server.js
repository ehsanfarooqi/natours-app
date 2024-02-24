const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log('Connected Successfully'))
  .catch(err => {
    console.error(err);
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Your server run on port ${port}...`);
});

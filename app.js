const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const route = require('./routes/index');
const app = express();
const port = process.env.port || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', route);

mongoose
  .connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Mongo db connected');
  })
  .catch((err) => console.log('can not connect to Mongo db' + err));

app.listen(port, () => console.log(`Server listening on port ${port}`));

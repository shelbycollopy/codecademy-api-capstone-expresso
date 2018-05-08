const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Define App & Port
const app = express();
const PORT = process.env.PORT || 4000;

const apiRouter = require('./routes/api');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRouter);

// Logging
app.use(morgan('dev'));

// Error handling
app.use(errorhandler());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`)
});

module.exports = app;

const express = require('express');
const app = express();

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

// Define Port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`)
});

module.export = app;

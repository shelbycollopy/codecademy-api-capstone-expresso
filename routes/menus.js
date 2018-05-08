const express = require('express');
const menusRouter = express.Router();

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// GET Routes
menusRouter.get('/', (req, res, next) => {

  db.all('SELECT * FROM Menu', (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ menus: menus });
    }
  });
});

module.exports = menusRouter;

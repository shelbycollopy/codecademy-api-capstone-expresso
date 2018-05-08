const express = require('express');
const menusRouter = express.Router();
const menuItemsRouter = require('./menuItems.js');

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// /menu-items Route
menusRouter.use('/:menuId/menu-items', menuItemsRouter);

// Params
menusRouter.param('menuId', (req, res, next, menuId) => {

  const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
  const values = { $menuId: menuId };

  db.get(sql, values, (error, menu) => {
    if (error) {
      next(error);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// GET Route(s)
menusRouter.get('/', (req, res, next) => {

  db.all('SELECT * FROM Menu', (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ menus });
    }
  });
});

menusRouter.get('/:menuId', (req, res, next) => {
  const { menu } = req;
  res.status(200).json({ menu });
});


// POST Route(s)
menusRouter.post('/', (req, res, next) => {

  const {
    title
  } = req.body.menu;

  if (!title) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Menu (title) VALUES ($title)';

  const values = {
    $title: title
  };

  db.run(sql, values, function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
          (error, menu) => {
            if (error) {
              throw error;
            }
            res.status(201).json({ menu });
          });
        }
    });
});

// PUT Route(s)
menusRouter.put('/:menuId', (req, res, next) => {

    const {
      title
    } = req.body.menu;

    const { menuId } = req.params

    if (!title) {
      return res.sendStatus(400);
    }

    const sql = 'UPDATE Menu SET ' +
      'title = $title ' +
      'WHERE Menu.id = $menuId ';

    const values = {
      $title: title,
      $menuId: menuId
    };

    db.run(sql, values, (error) => {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Menu WHERE ` +
          `Menu.id = ${menuId}`,
          (error, menu) => {
            res.status(200).json({ menu });
          });
      }
    });
});

// DELETE Route(s)
menusRouter.delete('/:menuId', (req, res, next) => {

  const { menuId } = req.params;

  const menuItemSql = 'SELECT * FROM MenuItem ' +
      'WHERE MenuItem.menu_id = $menuId';
  const menuItemValues = { $menuId: menuId };

  db.get(menuItemSql, menuItemValues, (error, issue) => {
    if (error) {
      next(error);
    } else if (issue) {
      res.sendStatus(400);
    } else {
      const deleteSql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
      const deleteValues = { $menuId: menuId };

      db.run(deleteSql, deleteValues, (error) => {
        if (error) {
          next(error);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

module.exports = menusRouter;

const express = require('express');
const menuItemsRouter = express.Router({ mergeParams: true });

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Params
menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {

  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = { $menuItemId: menuItemId };

  db.get(sql, values, (error, menuItem) => {
    if (error) {
      next(error);
    } else if (menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// GET Route(s)
menuItemsRouter.get('/', (req, res, next) => {

  const { menuId } = req.params;

  const sql = 'SELECT * FROM MenuItem WHERE ' +
    'MenuItem.menu_id = $menuId';
  const values = { $menuId: menuId };

  db.all(sql, values, (error, menuItems) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ menuItems });
    }
  });
});


menuItemsRouter.post('/', (req, res, next) => {

  const {
    name,
    description,
    price,
    inventory
  } = req.body.menuItem

  const { menuId } = req.params;

  const menuItemSql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuId';
  const menuItemValues = { $menuId: menuId };

  db.get(menuItemSql, menuItemValues, (error, menuItem) => {
    if (error) {
      next(error);
    } else {

      if (!name || !price || !inventory) {
        return res.sendStatus(400);
      }

      const sql = 'INSERT INTO MenuItem ' +
        '(name, description, price, inventory, menu_id) ' +
        'VALUES ($name, $description, $price, $inventory, $menuId)';
      const values = {
        $name: name,
        $description: description,
        $price: price,
        $inventory: inventory,
        $menuId: menuId
      };

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
            (error, menuItem) => {
              res.status(201).json({ menuItem });
            });
        }
      });
    }
  });
});

// PUT Route(s)
menuItemsRouter.put('/:menuItemId', (req, res, next) => {

  const {
    name,
    description,
    price,
    inventory
  } = req.body.menuItem

  const { menuId, menuItemId } = req.params;

  const menuItemSql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const menuItemValues = { $menuItemId: menuItemId };

  db.get(menuItemSql, menuItemValues, (error, menuItem) => {
    if (error) {
      next(error);
    } else {

      if (!name || !price || !inventory) {
        return res.sendStatus(400);
      }

      const sql = 'UPDATE MenuItem SET ' +
        'name = $name, ' +
        'description = $description, ' +
        'price = $price, ' +
        'inventory = $inventory, ' +
        'menu_id = $menuId ' +
        'WHERE MenuItem.id = $menuItemId';

      const values = {
        $name: name,
        $description: description,
        $price: price,
        $inventory: inventory,
        $menuId: menuId,
        $menuItemId: menuItemId
      };

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${menuItemId}`,
            (error, menuItem) => {
              res.status(200).json({ menuItem });
            });
        }
      });
    }
  });
});

// DELETE Route(s)
menuItemsRouter.delete('/:menuItemId', (req, res, next) => {

  const { menuItemId } = req.params;

  const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = { $menuItemId: menuItemId };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM MenuItem ` +
        `WHERE MenuItem.id = $menuItemId}`,
        error => {
          res.sendStatus(204);
        });
    }
  });
});

module.exports = menuItemsRouter;

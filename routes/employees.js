const express = require('express');
const employeesRouter = express.Router({ mergeParams: true });
const timesheetsRouter = require('./timesheets.js');

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// /timesheets Route
employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

// Params
employeesRouter.param('employeeId', (req, res, next, employeeId) => {

  const sql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
  const values = { $employeeId: employeeId };

  db.get(sql, values, (error, employee) => {
    if (error) {
      next(error);
    } else if (employee) {
      req.employee = employee;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// GET Route(s)
employeesRouter.get('/', (req, res, next) => {

  db.all('SELECT * FROM Employee WHERE Employee.is_current_employee = 1', (error, employees) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ employees });
    }
  });
});

employeesRouter.get('/:employeeId', (req, res) => {
  const { employee } = req;
  res.status(200).json({ employee })
});

// POST Route(s)
employeesRouter.post('/', (req, res, next) => {

  const {
    name,
    position,
    wage,
  } = req.body.employee;

  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  if (!name || !position || !wage || !isCurrentEmployee) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Employee ' +
    '(name, position, wage, is_current_employee) ' +
    'VALUES ($name, $position, $wage, $isCurrentEmployee)';

  const values = {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee: isCurrentEmployee
  };

  db.run(sql, values, function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
          (error, employee) => {
            if (error) {
              throw error;
            }
            res.status(201).json({ employee });
          });
        }
    });
});

// PUT Route(s)
employeesRouter.put('/:employeeId', (req, res, next) => {

    const {
      name,
      position,
      wage
    } = req.body.employee;

    const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

    const { employeeId } = req.params

    if (!name || !position || !wage || !isCurrentEmployee) {
      return res.sendStatus(400);
    }

    const sql = 'UPDATE Employee SET ' +
      'name = $name, ' +
      'position = $position, ' +
      'wage = $wage, ' +
      'is_current_employee = $isCurrentEmployee ' +
      'WHERE Employee.id = $employeeId ';

    const values = {
      $name: name,
      $position: position,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee,
      $employeeId: employeeId
    };

    db.run(sql, values, (error) => {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Employee WHERE ` +
          `Employee.id = ${employeeId}`,
          (error, employee) => {
            res.status(200).json({ employee });
          });
      }
    });
});

// DELETE Route(s)
employeesRouter.delete('/:employeeId', (req, res, next) => {

  const { employeeId } = req.params;

  const sql = 'UPDATE Employee SET ' +
    'is_current_employee = 0 ' +
    'WHERE Employee.id = $employeeId ';
  const values = { $employeeId: employeeId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE ` +
        `Employee.id = ${employeeId}`,
        (error, employee) => {
          res.status(200).json({ employee });
        });
    }
  });
});

module.exports = employeesRouter;

const express = require('express');
const timesheetsRouter = express.Router({ mergeParams: true });

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Params
timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {

  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = { $timesheetId: timesheetId };

  db.get(sql, values, (error, timesheet) => {
    if (error) {
      next(error);
    } else if (timesheet) {
      req.employee = timesheet;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

// GET Route(s)
timesheetsRouter.get('/', (req, res, next) => {

  const { employeeId } = req.params;

  const sql = 'SELECT * FROM Timesheet WHERE ' +
    'Timesheet.employee_id = $employeeId';
  const values = { $employeeId: employeeId};

  db.all(sql, values, (error, timesheets) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ timesheets });
    }
  });
});

// POST Route(s)
timesheetsRouter.post('/', (req, res, next) => {

  const {
    hours,
    rate,
    date,
  } = req.body.timesheet;

  const { employeeId } = req.params;

  if (!hours || !rate || !date) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Timesheet ' +
    '(hours, rate, date, employee_id) ' +
    'VALUES ($hours, $rate, $date, $employeeId)';

  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId
  };

  db.run(sql, values, function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
          (error, timesheet) => {
            if (error) {
              throw error;
            }
            res.status(201).json({ timesheet });
          });
        }
    });
});

// PUT Route(s)
timesheetsRouter.put('/:timesheetId', (req, res, next) => {

  const {
    hours,
    rate,
    date,
  } = req.body.timesheet;

  const { employeeId, timesheetId } = req.params;

  if (!hours || !rate || !date) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE Timesheet SET ' +
    'hours = $hours, ' +
    'rate = $rate, ' +
    'date = $date, ' +
    'employee_id = $employeeId ' +
    'WHERE Timesheet.id = $timesheetId';

  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId,
    $timesheetId: timesheetId
  };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Timesheet ` +
        `WHERE Timesheet.id = ${timesheetId}`,
        (error, timesheet) => {
          res.status(200).json({ timesheet });
        });
    }
  });
});

// DELETE Route(s)
timesheetsRouter.delete('/:timesheetId', (req, res, next) => {

  const { timesheetId } = req.params;

  const sql = 'DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = { $timesheetId: timesheetId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Timesheet ` +
        `WHERE Timesheet.id = ${timesheetId}`,
        error => {
          res.sendStatus(204);
        });
    }
  });

});

module.exports = timesheetsRouter;

const express = require('express');
const timesheetsRouter = express.Router();

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

timesheetsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = { $timesheetId: req.params.timesheetId};
  db.all(sql, values, (error, timesheets) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({timesheets: timesheets});
    }
  });
});

module.exports = timesheetsRouter;

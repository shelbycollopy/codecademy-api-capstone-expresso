// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

// Serialize our SQL queries to prevent read/write errors
db.serialize(() => {

  // Run SQL query for 'Employee'
  // Remove table if it exists
  db.run('DROP TABLE IF EXISTS Employee', error => {
    if (error) {
      throw error;
    }
  });

  // Create new 'Employee' table
  db.run('CREATE TABLE Employee (id INTEGER PRIMARY KEY, name TEXT NOT NULL, position TEXT NOT NULL, wage INTEGER NOT NULL, is_current_employee INTEGER DEFAULT 1)',
    function(error) {
      if (error) {
        throw new error;
      }
  });

  // Run SQL query for 'Timesheet'
  // Remove table if it exists
  db.run('DROP TABLE IF EXISTS Timesheet', error => {
    if (error) {
      throw error;
    }
  });

  // Create new 'Timesheet' table
  db.run('CREATE TABLE Timesheet (id INTEGER PRIMARY KEY, hours TEXT NOT NULL, rate INTEGER NOT NULL, date INTEGER NOT NULL, employee_id INTEGER NOT NULL)',
    function(error) {
      if (error) {
        throw new error;
      }
  });

  // Run SQL Query for 'Menu'
  // Remove table if it exists
  db.run('DROP TABLE IF EXISTS Menu', error => {
    if (error) {
      throw error;
    }
  });

  // Create new 'Menu' table
  db.run('CREATE TABLE Menu (id INTEGER PRIMARY KEY, title TEXT NOT NULL)',
    function(error) {
      if (error) {
        throw new error;
      }
  });

  // Run SQL Query for 'MenuItem'
  // Remove table if it exists
  db.run('DROP TABLE IF EXISTS MenuItem', error => {
    if (error) {
      throw error;
    }
  });

  // Create new 'MenuItem' table
  db.run('CREATE TABLE MenuItem (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT, inventory INTEGER NOT NULL, price INTEGER NOT NULL, menu_id INTEGER NOT NULL)',
    function(error) {
      if (error) {
        throw new error;
      }
  });
});

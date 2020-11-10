/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
To test your connection, open terminal, go to the folder where this file is located and run the command:
node example.js
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// Using a fixed Oracle time zone helps avoid machine and deployment differences
process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');


// On Windows and macOS, you can specify the directory containing your Oracle
// Client Libraries.  If this is not done, then a standard search heuristic is
// used, see the node-oracledb documentation.
oracledb.initOracleClient({ libDir: 'C:\\Oracle\\instantclient_19_8' });                    // Windows
// oracledb.initOracleClient({ libDir: '/Users/your_username/instantclient_19_3' });  // macOS

// const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// const mypw = ...  // set mypw to the hr schema password

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT *
       FROM jeopardy_show`
    );
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();



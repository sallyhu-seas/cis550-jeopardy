var config = require("./db-config.js");
var oracledb = require("oracledb");

oracledb.initOracleClient({
  libDir: '/Users/datnguyen/Project550/instantclient_19_8',
});

oracledb.autoCommit = true;

async function login(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
    SELECT * FROM USERS WHERE EMAIL = '${req.body.username}' AND PWHASH = '${req.body.password}'`;

  try {
    const result = await connection.execute(query);
    var obj = {};

    if (result.rows.length > 0) {
      obj.status = 1;
      obj.username = req.body.username;
    } else {
      obj.status = 0;
      obj.message = "Username or password is invalid";
    }

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function register(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
    SELECT * FROM USERS WHERE EMAIL = '${req.body.username}'`;

  try {
    const result = await connection.execute(query);
    var obj = {};

    if (result.rows.length > 0) {
      obj.status = 0;
      obj.message = "Username is existed";
    } else {
      var queryInsert = `
        INSERT INTO Users (email, pwhash)
        VALUES ('${req.body.username}', '${req.body.password}')`;
      await connection.execute(queryInsert);

      obj.status = 1;
      obj.message = "Register successfully";
    }

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getDatabase(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var state = req.query.state;
  var season = req.query.season;
  var airDate = req.query.airDate;
  var isWinner = req.query.isWinner;
  var skip = parseInt(req.query.skip);
  var take = parseInt(req.query.take);

  var query = `
    SELECT NUM, CID, NAME, OCCUPATION, ISWINNER, STATE, SHOWNUM, SEASON, AIRDATE
    FROM (SELECT ROWNUM AS NUM, c.CID, c.NAME, c.OCCUPATION, cp.ISWINNER, c.STATE, cp.SHOWNUM, js.SEASON, js.AIRDATE
        FROM CONTESTANTS c
        LEFT JOIN CONTESTANTS_PLAY cp
          ON c.CID = cp.CID
        LEFT JOIN JEOPARDY_SHOW js
          ON js.SHOWNUM = cp.SHOWNUM
        WHERE 1 = 1`;
  if (state != null && state != undefined) query += ` AND c.STATE = '${state}'`;

  if (season != null && season != undefined)
    query += ` AND js.SEASON = '${season}'`;

  if (airDate != null && airDate != undefined)
    query += ` AND TO_CHAR(js.AIRDATE, 'dd/MM/yyyy') = '${airDate}'`;

  if (isWinner != null && isWinner != undefined)
    query += ` AND cp.ISWINNER = '${isWinner}'`;

  query += " ORDER BY cp.SHOWNUM DESC)";
  query += " WHERE NUM > " + skip + " AND NUM <= " + (skip + take);

  var queryCount = `
    SELECT COUNT(*) AS TOTAL_RECORDS
        FROM CONTESTANTS c
        LEFT JOIN CONTESTANTS_PLAY cp
          ON c.CID = cp.CID
        LEFT JOIN JEOPARDY_SHOW js
          ON js.SHOWNUM = cp.SHOWNUM
        WHERE 1 = 1`;
  if (state != null && state != undefined)
    queryCount += ` AND c.STATE = '${state}'`;

  if (season != null && season != undefined)
    queryCount += ` AND js.SEASON = '${season}'`;

  if (airDate != null && airDate != undefined)
    queryCount += ` AND TO_CHAR(js.AIRDATE, 'dd/MM/yyyy') = '${airDate}'`;

  if (isWinner != null && isWinner != undefined)
    queryCount += ` AND cp.ISWINNER = '${isWinner}'`;

  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    const resultCount = await connection.execute(queryCount, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        cid: result.rows[i].CID,
        name: result.rows[i].NAME,
        occupation: result.rows[i].OCCUPATION,
        isWinner: result.rows[i].ISWINNER,
        state: result.rows[i].STATE,
        showNum: result.rows[i].SHOWNUM,
        season: result.rows[i].SEASON,
        airDate: result.rows[i].AIRDATE,
      });
    }

    var obj = {};
    obj.list = data;
    obj.totalRecords = resultCount.rows[0].TOTAL_RECORDS;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getSeasons(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
    SELECT DISTINCT SEASON
    FROM JEOPARDY_SHOW
    ORDER BY SEASON DESC`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        season: result.rows[i].SEASON,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getAirDates(req, res) {
  var season = req.query.season;
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
    SELECT AIRDATE, SHOWNUM
    FROM JEOPARDY_SHOW
    WHERE SEASON = '${season}'
    ORDER BY AIRDATE DESC`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        airDate: result.rows[i].AIRDATE,
        showNum: result.rows[i].SHOWNUM,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getTopWinnersByOccupation(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
    SELECT * FROM
      (SELECT OCCUPATION, COUNT(*) AS TOTAL_WINNERS
        FROM CONTESTANTS c
        LEFT JOIN CONTESTANTS_PLAY cp
          ON c.CID = cp.CID
        LEFT JOIN JEOPARDY_SHOW js
          ON js.SHOWNUM = cp.SHOWNUM
        WHERE cp.ISWINNER = 1 AND STATE IS NOT NULL
        GROUP BY OCCUPATION
        ORDER BY TOTAL_WINNERS DESC)
    WHERE ROWNUM <= ${take}`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        occupation: result.rows[i].OCCUPATION,
        totalWinners: result.rows[i].TOTAL_WINNERS,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getTopWinnersByState(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
    SELECT * FROM
      (SELECT STATE, COUNT(*) AS TOTAL_WINNERS
        FROM CONTESTANTS c
        LEFT JOIN CONTESTANTS_PLAY cp
          ON c.CID = cp.CID
        LEFT JOIN JEOPARDY_SHOW js
          ON js.SHOWNUM = cp.SHOWNUM
        WHERE cp.ISWINNER = 1 AND STATE IS NOT NULL
        GROUP BY STATE
        ORDER BY TOTAL_WINNERS DESC)
    WHERE ROWNUM <= ${take}`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        state: result.rows[i].STATE,
        totalWinners: result.rows[i].TOTAL_WINNERS,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getTopQuestionsByCategory(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
    SELECT * FROM(
      SELECT CATEGORY, COUNT(*) TOTAL_QUESTIONS
      FROM JEOPARDY_QA
      GROUP BY CATEGORY
      ORDER BY TOTAL_QUESTIONS DESC)
    WHERE ROWNUM <= ${take}`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        category: result.rows[i].CATEGORY,
        totalQuestions: result.rows[i].TOTAL_QUESTIONS,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getTopQuestionsByAnswer(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
    SELECT * FROM(
      SELECT ANSWER, COUNT(*) TOTAL_QUESTIONS
      FROM JEOPARDY_QA
      GROUP BY ANSWER
      ORDER BY TOTAL_QUESTIONS DESC)
    WHERE ROWNUM <= ${take}`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        answer: result.rows[i].ANSWER,
        totalQuestions: result.rows[i].TOTAL_QUESTIONS,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getConfigurations(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
    SELECT * FROM CONFIGURATIONS`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        code: result.rows[i].CODE,
        value: result.rows[i].VALUE,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getQuestions(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var showNum = req.query.showNum;
  var round = req.query.round;

  var query = `
    SELECT QID, SHOWNUM, ROUND, QUESTION, ANSWER, VALUE, CATEGORY
    FROM JEOPARDY_QA
    WHERE SHOWNUM = '${showNum}' AND ROUND = '${round}'
    ORDER BY CATEGORY, VALUE`;

  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];

    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        id: result.rows[i].QID,
        question: result.rows[i].QUESTION,
        value: result.rows[i].VALUE,
        category: result.rows[i].CATEGORY,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function checkAnswer(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var id = req.body.id;
  var answer = req.body.answer;

  var query = `
    SELECT ANSWER
    FROM JEOPARDY_QA
    WHERE QID = ${id}`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    var obj = {};

    if (result.rows.length > 0) {
      if (result.rows[0].ANSWER.toLowerCase() == answer.toLowerCase()) {
        obj.status = 1;
        obj.message = "Correct";
        obj.answer = result.rows[0].ANSWER;
      } else {
        obj.status = 0;
        obj.message = "Incorrect";
        obj.answer = result.rows[0].ANSWER;
      }
    }

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  login: login,
  register: register,
  getAirDates: getAirDates,
  getDatabase: getDatabase,
  getTopWinnersByOccupation: getTopWinnersByOccupation,
  getTopWinnersByState: getTopWinnersByState,
  getTopQuestionsByCategory: getTopQuestionsByCategory,
  getTopQuestionsByAnswer: getTopQuestionsByAnswer,
  getQuestions: getQuestions,
  checkAnswer: checkAnswer,
  getConfigurations: getConfigurations,
};

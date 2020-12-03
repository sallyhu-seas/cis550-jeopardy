var config = require("./db-config.js");
var oracledb = require("oracledb");

oracledb.initOracleClient({
  // libDir: '/Users/datnguyen/Project550/instantclient_19_8' // Dat's path
  libDir: 'C:\\Oracle\\instantclient_19_8' // Sally's path
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
          FROM  CONTESTANTS c
                LEFT JOIN CONTESTANTS_PLAY cp
                  ON c.CID = cp.CID
                LEFT JOIN JEOPARDY_SHOW js
                  ON js.SHOWNUM = cp.SHOWNUM
          WHERE 1 = 1`;
  if (state != null && state != undefined)
    query += ` AND c.STATE = '${state}'`;

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
    FROM  CONTESTANTS c
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
    SELECT  *
    FROM    ( SELECT OCCUPATION
                    , COUNT(*) AS TOTAL_WINNERS
              FROM CONTESTANTS c
                    LEFT JOIN CONTESTANTS_PLAY cp
                      ON c.CID = cp.CID
                    LEFT JOIN JEOPARDY_SHOW js
                      ON js.SHOWNUM = cp.SHOWNUM
              WHERE cp.ISWINNER = 1 
                    AND STATE IS NOT NULL
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

async function getTopWinnersWithMostConsecutiveWins(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
    SELECT  *
    FROM    ( SELECT  name
                      ,count(*) AS num_consecutive_wins
              FROM    (SELECT j.*
                              ,(ROW_NUMBER() OVER (ORDER BY shownum) - ROW_NUMBER() OVER (PARTITION BY cid ORDER BY shownum)) as grp
                       FROM   ( SELECT  c.cid
                                        ,c.name
                                        ,cp.shownum
                                        ,js.season
                                FROM    CONTESTANTS c
                                        INNER JOIN CONTESTANTS_PLAY cp ON c.cid = cp.cid
                                        INNER JOIN jeopardy_show js ON js.shownum = cp.shownum
                                WHERE   cp.isWinner = 1
                              ) j
                        ORDER BY CID, shownum
                      ) t
              GROUP BY name
              ORDER BY num_consecutive_wins DESC
            )
    WHERE ROWNUM <= ${take}`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        name: result.rows[i].NAME,
        numConsecutiveWins: result.rows[i].NUM_CONSECUTIVE_WINS,
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getTopWinnersFromTopOccupations(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
WITH top_occupations AS (
            SELECT  *
            FROM    (   SELECT  occupation
                                ,COUNT(DISTINCT c.cid) as numOcc
                        FROM    contestants c
                                INNER JOIN contestants_play cp ON c.cid = cp.cid
                        WHERE   isWinner = 1
                        GROUP BY occupation
                        ORDER BY numOcc DESC
                    )
            WHERE   ROWNUM <= 20
        )
        , top_players AS (
            SELECT  c.occupation
                    ,name
                    ,COUNT(DISTINCT shownum) AS numWon
            FROM    contestants c
                    INNER JOIN top_occupations o ON c.occupation = o.occupation
                    INNER JOIN contestants_play cp ON c.cid = cp.cid
            WHERE   isWinner = 1
            HAVING  COUNT(DISTINCT shownum) > 1
            GROUP BY c.occupation,name
            ORDER BY c.occupation,numWon DESC
        )
        , final_top AS (
            select  occupation
                    ,name
                    ,numWon
                    ,(ROW_NUMBER() OVER (PARTITION BY OCCUPATION ORDER BY NUMWON DESC)) as grp
            from    top_players
        )
        SELECT  occupation
                ,name
                ,numwon
        FROM    final_top
        WHERE   grp <= 3
      `;

  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        occupation: result.rows[i].OCCUPATION,
        name: result.rows[i].NAME,
        numWon: result.rows[i].NUMWON
      });
    }

    var obj = {};
    obj.list = data;

    res.json(obj);
  } catch (err) {
    console.error(err);
  }
}

async function getDaysBetweenFirstLossAndFirstWin(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
      WITH combine AS(
          SELECT  DISTINCT c.cid
                  ,c.name
                  ,iswinner
                  ,js.airdate 
          FROM    contestants c
                  INNER JOIN contestants_play cp ON c.cid = cp.cid
                  INNER JOIN jeopardy_show js ON js.shownum = cp.shownum
      )
      ,first_loss AS (
          SELECT  cid
                  ,name
                  ,MIN(airdate) AS first_loss
          FROM    combine
          WHERE   iswinner = 0
          GROUP BY cid
                  ,name
      )
      ,first_win AS (
          SELECT  cid
                  ,name
                  ,MIN(airdate) AS first_win
          FROM    combine
          WHERE   iswinner = 1
          GROUP BY cid
                  ,name
      )
      SELECT  c2.name
              ,first_win - first_loss AS datediff
      FROM    first_loss c2
              INNER JOIN first_win c3 ON c2.cid = c3.cid
      WHERE ROWNUM <= 100
      ORDER BY datediff DESC
      `;

  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        name: result.rows[i].NAME,
        dateDiff: result.rows[i].DATEDIFF
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
    SELECT  *
    FROM    ( SELECT  CATEGORY
                    , COUNT(*) TOTAL_QUESTIONS
              FROM    JEOPARDY_QA
              GROUP BY CATEGORY
              ORDER BY TOTAL_QUESTIONS DESC
            )
    WHERE   ROWNUM <= ${take}`;
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
    SELECT  *
    FROM    ( SELECT  ANSWER
                    , COUNT(*) TOTAL_QUESTIONS
              FROM    JEOPARDY_QA
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

async function getQuestionsFromTopCategoriesOfTopAnswers(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var take = parseInt(req.query.take);

  var query = `
      WITH top_answers AS (
          SELECT  *
          FROM    ( SELECT  ANSWER
                          , COUNT(*) TOTAL_QUESTIONS
                    FROM    JEOPARDY_QA
                    GROUP BY ANSWER
                    ORDER BY TOTAL_QUESTIONS DESC)
          WHERE ROWNUM <= 20
      )
      , top_categories as (
          SELECT  *
          FROM    (
              SELECT  DISTINCT qa1.category
                      ,COUNT(qa1.answer) AS numAnswers
              FROM    jeopardy_qa qa1
                      INNER JOIN top_answers qa2 on qa1.answer = qa2.answer
              GROUP BY qa1.category
              ORDER BY numAnswers DESC
                  )
          WHERE   ROWNUM <= 10
      )
      SELECT  tc.category
              ,qa.question
              ,ta.answer
      FROM    top_categories tc
              INNER JOIN jeopardy_qa qa ON tc.category = qa.category
              INNER JOIN top_answers ta ON qa.answer = ta.answer
      ORDER BY tc.category, ta.answer`;
  try {
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
      data.push({
        // SH: needs to be incorporated
        category: result.rows[i].CATEGORY,
        question: result.rows[i].QUESTION,
        answer: result.rows[i].ANSWER
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
  getTopWinnersWithMostConsecutiveWins: getTopWinnersWithMostConsecutiveWins,
  getDaysBetweenFirstLossAndFirstWin: getDaysBetweenFirstLossAndFirstWin,
  getTopWinnersFromTopOccupations: getTopWinnersFromTopOccupations,
  getTopQuestionsByCategory: getTopQuestionsByCategory,
  getTopQuestionsByAnswer: getTopQuestionsByAnswer,
  getQuestionsFromTopCategoriesOfTopAnswers: getQuestionsFromTopCategoriesOfTopAnswers,
  getQuestions: getQuestions,
  checkAnswer: checkAnswer,
  getConfigurations: getConfigurations,
};

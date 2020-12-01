var config = require('./db-config.js');
var oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: 'C:\\Oracle\\instantclient_19_8'});
oracledb.autoCommit = true;


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */
/* GET test - no param */
async function getSeasons(req,res) {
  let connection;
  connection = await oracledb.getConnection(config);

  try {
    const result = await connection.execute(
      `SELECT DISTINCT js.season
      FROM jeopardy_show js INNER JOIN jeopardy_qa jqa ON js.shownum = jqa.shownum
      ORDER BY js.season ASC`
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
}

async function getEpisodeDates(req, res) {
  let connection;
  connection = await oracledb.getConnection(config)

  var season = req.params.season;

  var query = `
  WITH shows AS (
    SELECT DISTINCT shownum FROM jeopardy_qa
  )
  SELECT js.shownum, js.airdate 
  FROM jeopardy_show js INNER JOIN shows ON js.shownum = shows.shownum
  WHERE season = ${season}
  ORDER BY js.airdate asc`

  try {
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
}


async function getCategories(req, res) {
  let connection;
  connection = await oracledb.getConnection(config)

  var shownum = req.params.episode;
  var round = req.params.round;
  console.log(shownum, round);
  if (round != 'Jeopardy!' && round != 'Double Jeopardy!'){
    res.json('Round must be either Jeopardy! or Double Jeopardy!');
  }

  var query = `
  SELECT DISTINCT category
  FROM jeopardy_qa 
  WHERE shownum = ${shownum} AND round = '${round}'`

  try {
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
}

async function getQA(req, res) {
  let connection;
  connection = await oracledb.getConnection(config)

  var shownum = req.params.shownum;
  var round = req.params.round;
  var value = req.params.value;
  var category = req.params.category;
  category = category.replace("'", "''");
  if (round != 'Jeopardy!' && round != 'Double Jeopardy!'){
    res.json('Round must be either Jeopardy! or Double Jeopardy!');
  }

  var query = `
  SELECT question, answer
  FROM jeopardy_qa 
  WHERE shownum = ${shownum} AND round = '${round}' AND value = ${value} AND category = '${category}'`

  try {
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
}


/* GET test - one param */
async function showQuestions(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var inputSeason = req.params.season;
    var query = `
    SELECT  qa.category
          , qa.question
          , qa.answer
    FROM    jeopardy_qa qa
            INNER JOIN jeopardy_show js ON qa.showNum = js.showNum
    WHERE   js.season = ${inputSeason}
            AND rownum <= 10
  `;
  try {
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
};


/* POST test */
async function addUser(req, res) {
  let connection;
  connection = await oracledb.getConnection(config);

  var query = `
  INSERT INTO Users (email, pwhash)
  VALUES ('${req.body.email}', '${req.body.pwHash}')
  `;

  try {
    const result = await connection.execute(query);
    res.send(`Successfully added '${req.body.email}'`)
  } catch (err) {
    console.error(err);
  }
};



// The exported functions, which can be accessed in index.js.
module.exports = {
	getSeasons: getSeasons
  ,showQuestions: showQuestions
  ,getCategories: getCategories
  ,getQA: getQA
  ,getEpisodes: getEpisodeDates
}
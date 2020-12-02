const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/auth/login', routes.login);

app.post('/auth/register', routes.register);

app.get('/database', routes.getDatabase);

app.get('/airdates', routes.getAirDates);

app.get('/winners-occupation', routes.getTopWinnersByOccupation);

app.get('/winners-state', routes.getTopWinnersByState);

app.get('/questions-category', routes.getTopQuestionsByCategory);

app.get('/questions-answer', routes.getTopQuestionsByAnswer);

app.get('/questions', routes.getQuestions);

app.post('/check-answers', routes.checkAnswer);

app.get('/configurations', routes.getConfigurations);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
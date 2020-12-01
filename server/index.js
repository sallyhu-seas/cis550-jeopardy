const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */




/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
/* Testing just select */
app.get('/seasons', routes.getSeasons);


/* Testing taking a parameter in */

/* Testing posting */

app.get('/categories/:episode/:round', routes.getCategories);

app.get('/getqa/:value/:category/:shownum/:round', routes.getQA);

app.get('/episodes/:season', routes.getEpisodes);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
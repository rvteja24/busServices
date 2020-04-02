const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send({"name": "busTicketingService", "version": "1.0.0"}));
require('./app/routes/routes')(app);
const server = app.listen(port, () => console.log(`Bus services listening on port ${port}!`))

module.exports = server;
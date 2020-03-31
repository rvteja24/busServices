const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Bus ticketing service APIs'));
require('./app/routes/routes')(app);
app.listen(port, () => console.log(`Bus services listening on port ${port}!`))


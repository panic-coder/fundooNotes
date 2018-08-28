var express = require('express');
var app = express();
var mongoose = require('mongoose');
var PORT = 3000;
var config = require('./config/database');
var bodyParser = require('body-parser');
var cors = require('cors')

mongoose.connect(config.database, {useNewUrlParser: true})

var routes = require('./routes/routes');
app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);


app.listen(PORT, () => {
    console.log("Connected")
});


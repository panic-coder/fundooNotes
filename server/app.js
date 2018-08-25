var express = require('express');
var app = express();
var mongoose = require('mongoose');
var PORT = 3000;
var config = require('./config/database');
var bodyParser = require('body-parser');
var flash = require('express-flash');

mongoose.connect(config.database, {useNewUrlParser: true})

var routes = require('./routes/routes');
app.use(bodyParser.json());
app.use('/', routes);
app.use(flash());

app.listen(PORT, () => {
    console.log("Connected")
});


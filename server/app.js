var express = require('express');
var app = express();
var mongoose = require('mongoose');
var PORT = 3000;
var config = require('./config/database');
var bodyParser = require('body-parser');
var cors = require('cors')
require("dotenv").config()

mongoose.connect(config.database, {useNewUrlParser: true})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '10mb', extended: true}));
var routes = require('./routes/routes');
app.use('/', routes);

var env = process.env.NODE_ENV


app.listen(PORT, () => {
    console.log("Connected")
});


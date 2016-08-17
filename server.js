var express = require('express');
var app = express();
var morgan = require('morgan'); //console logs of requests
var publicPath = __dirname + "/public";

app.use(express.static(publicPath));
app.use(morgan('dev'));



app.get('*', function (req, res) {
    res.sendFile("/index.html");
});

app.listen ("8081");
console.log("App is running");

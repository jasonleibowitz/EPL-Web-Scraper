'use strict';

var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var fs          = require('fs');
var request     = require('request');
var cheerio     = require('cheerio');

var config      = require('./config/database');
var Team        = require('./models/team');
var port        = process.env.PORT || 8080;

app.use(morgan('dev'));
mongoose.connect(config.database)
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('database connected');
})

app.get('/', function(req, res) {
    res.send('Nothing to see at this path.');
});

app.post('/update-league-table', function(req, res) {

    if (req.headers.api_token === '1234567890') {
        var url = 'http://www.bbc.com/sport/football/premier-league/table';

        request(url, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var table;
                var json = { dateCreated: '', table: [] };

                json.dateCreated = new Date().toString();

                // Grab current league table
                $('table > tbody').children().filter(function() {
                    var data = $(this);

                    data.each(function(index, element) {
                        json['table'].push({
                            teamName: $(element).children('.team-name').text(),
                            points: $(element).children('.points').text()
                        });
                    });
                });
            };

            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
                console.log('File successfully written! Check your project directory for the output.json file.');
            });
        });

        res.send('Check your console!');
    } else {
        res.send('Invalid API Token');
    }
});

// app.get('/update-results', function(req, res) {
//     var url = 'http://www.bbc.com/sport/football/premier-league/results';
//
//     request(url, function(error, response, html) {
//         if (!error) {
//             var $ = cheerio.load(html);
//
//             var
//         }
//     })
// });

app.get('/table', function(req, res) {
    fs.readFile(__dirname + "/" + "output.json", "utf8", function(err, data) {
        console.log(data);
        res.end(data);
    });
});

var server = app.listen(port);
console.log('Magic happens on port 8081');
exports = module.exports = server;

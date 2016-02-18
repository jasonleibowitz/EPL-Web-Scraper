var express = require('express')
    fs = require('fs')
    request = require('request')
    cheerio = require('cheerio')
    app = express();

app.get('/update-league-table', function(req, res) {
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

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;

'use strict';

var express         = require('express');
var app             = express();
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var fs              = require('fs');
var request         = require('request');
var cheerio         = require('cheerio');

var config          = require('./config/database');
var renamer         = require('./config/renamer');
var DataNormalizer  = require('./data_normalizer_helper');
var DataNormalizer  = new DataNormalizer();
var teamKey         = require('./teamKey.js');
var Team            = require('./models/team');
var Result          = require('./models/result');
var port            = process.env.PORT || 8080;

app.use(morgan('dev'));
mongoose.connect(config.database)
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('database connected');
})

app.get('/', function(req, res) {
    console.log(DataNormalizer.cleanDate('1st March 2016'));
    res.send(renamer['fullName']['Tottenham']);
});

app.get('/update-league-table', function(req, res) {

    var url = 'http://www.bbc.com/sport/football/premier-league/table';

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            // Grab current league table
            $('table > tbody').first().children().filter(function() {
                var data = $(this);

                data.each(function(index, element) {
                    var teamName = $(element).children('.team-name').text();
                    var points = $(element).children('.points').text();
                    var result = $(element).children('.last-10-games').find('li').last().find('span').text();
                    var score = $(element).children('.last-10-games').find('li').last().attr('data-result');

                    Team.findOneAndUpdate({
                        name: teamName
                    }, {
                        name: teamName,
                        fullName: renamer['fullName'][teamName],
                        shortname: renamer['shortname'][teamName],
                        points: points,
                        won: $(element).children('.won').text(),
                        drawn: $(element).children('.drawn').text(),
                        lost: $(element).children('.lost').text(),
                        goalsFor: $(element).children('.for').text(),
                        goalstAgainst: $(element).children('.against').text(),
                        goalDifference: $(element).children('.goal-difference').text(),
                        lastMatch: {
                            date: DataNormalizer.cleanDate($(element).children('.last-10-games').find('li').last().attr('data-date')),
                            result: result,
                            opponent: $(element).children('.last-10-games').find('li').last().attr('data-against'),
                            goalsFor: DataNormalizer.getGoals(result, score, true),
                            goalsAgainst: DataNormalizer.getGoals(result, score, false)
                        },
                        updated: Date.now()
                    }, {
                        upsert: true
                    }, function (err, team) {
                        if (err) {
                            console.log('error at ', teamName);
                            throw err
                        };
                        console.log('successfully created ' + teamName + ' (' + points + ')');
                    });
                });
            });
        };
    });

    res.send('League Table Updated!');
});

// app.get('/setup', function(req, res) {
    // Team.create({
    //     name: 'Manchester United',
    //     shortname: 'mufc',
    //     points: 47
    // }, function(err, team) {
    //     if (err) throw err;
    //     res.send(team.name + ' created successfully!');
    // });
// });

app.get('/teams', function(req, res) {
    Team.find({}, function(err, teams) {
        if (err) throw err;
        res.send(teams);
    });
});

app.get('/update-results', function(req, res) {
    console.log('in update results');
    var premierLeaugeUrl = 'http://www.bbc.com/sport/football/premier-league/results';
    var championsLeagueUrl = 'http://www.bbc.com/sport/football/champions-league/results';
    var europaLeagueUrl = 'http://www.bbc.com/sport/football/europa-league/results';

    request(premierLeaugeUrl, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var start_time = new Date();

            $(".fixtures-table").children('table').filter(function() {
                var data = $(this);

                data.each(function(index, element) {

                    $(element).find('tbody').children().each(function(index, element) {

                        var matchDate = DataNormalizer.cleanDate($(element).parents('.table-stats').prevAll('h2').first().text().trim());
                        var homeTeam = $(element).find('.match-details').find('.team-home').text().trim();
                        var awayTeam = $(element).find('.match-details').find('.team-away').text().trim();
                        var homeTeamGoals = $(element).find('.match-details').find('.score').text().trim().split('-')[0];
                        var awayTeamGoals = $(element).find('.match-details').find('.score').text().trim().split('-')[1];

                        if (homeTeamGoals === "P") {
                            // match postponed. do nothing
                            console.log('Before save. Home: ' + homeTeam + ' away: ' + awayTeam + '. Score: ' + homeTeamGoals + ' to ' + awayTeamGoals);
                        } else {
                            Result.findOneAndUpdate({
                                date: matchDate,
                                competition: 'Premier League',
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                            }, {
                                date: matchDate,
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                                result: {
                                    homeTeamGoals: homeTeamGoals,
                                    awayTeamGoals: awayTeamGoals
                                },
                                updated: Date.now()
                            }, {
                                upsert: true
                            }, function(err, result) {
                                if (err) {
                                    console.log('error at ', matchDate);
                                    throw err;
                                }
                                console.log('successfully created ' + matchDate + ' match between ' + homeTeam + ' vs ' + awayTeam);
                            });
                        }
                    });
                });
            });
            var end_time = new Date();
        };
    });

    request(championsLeagueUrl, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var start_time = new Date();

            $('.fixtures-table').children('table').filter(function() {
                var data = $(this);

                data.each(function(index, element) {
                    $(element).find('tbody').children().each(function(index, element) {
                        var matchDate = DataNormalizer.cleanDate($(element).parents('.table-stats').prevAll('h2').first().text().trim());
                        var homeTeam = $(element).find('.match-details').find('.team-home').text().trim();
                        var awayTeam = $(element).find('.match-details').find('.team-away').text().trim();
                        var homeTeamGoals = $(element).find('.match-details').find('.score').text().trim().split('-')[0];
                        var awayTeamGoals = $(element).find('.match-details').find('.score').text().trim().split('-')[1];

                        if (homeTeamGoals === "P") {
                            // match postponed. do nothing
                            console.log('Match between ' + homeTeam + ' and ' + awayTeam + ' is postponed.');
                        } else if ((teamKey.indexOf(homeTeam.toLowerCase()) < 0) && (teamKey.indexOf(awayTeam.toLowerCase()) < 0)) {
                            console.log('match between ' + homeTeam + ' and ' + awayTeam + ' doesn\'t include any Premier League clubs.');
                        } else {
                            console.log('before save. matchDate: ', matchDate);

                            Result.findOneAndUpdate({
                                date: matchDate,
                                competition: 'Champions League',
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                            }, {
                                date: matchDate,
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                                result: {
                                    homeTeamGoals: homeTeamGoals,
                                    awayTeamGoals: awayTeamGoals
                                },
                                updated: Date.now()
                            }, {
                                upsert: true
                            }, function(err, result) {
                                if (err) {
                                    console.log('error at ', matchDate);
                                    throw err;
                                }
                                console.log('successfully created ' + matchDate + ' match between ' + homeTeam + ' vs ' + awayTeam);
                            });
                        }
                    });
                });
            });
        }
    });

    request(europaLeagueUrl, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var start_time = new Date();

            $('.fixtures-table').children('table').filter(function() {
                var data = $(this);

                data.each(function(index, element) {
                    $(element).find('tbody').children().each(function(index, element) {
                        var matchDate = DataNormalizer.cleanDate($(element).parents('.table-stats').prevAll('h2').first().text().trim());
                        var homeTeam = $(element).find('.match-details').find('.team-home').text().trim();
                        var awayTeam = $(element).find('.match-details').find('.team-away').text().trim();
                        var homeTeamGoals = $(element).find('.match-details').find('.score').text().trim().split('-')[0];
                        var awayTeamGoals = $(element).find('.match-details').find('.score').text().trim().split('-')[1];

                        if (homeTeamGoals === "P") {
                            // match postponed. do nothing
                            console.log('Match between ' + homeTeam + ' and ' + awayTeam + ' is postponed.');
                        } else if ((teamKey.indexOf(homeTeam.toLowerCase()) < 0) && (teamKey.indexOf(awayTeam.toLowerCase()) < 0)) {
                            console.log('match between ' + homeTeam + ' and ' + awayTeam + ' doesn\'t include any Premier League clubs.');
                        } else {
                            console.log('before save. matchDate: ', matchDate);

                            Result.findOneAndUpdate({
                                date: matchDate,
                                competition: 'Europa League',
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                            }, {
                                date: matchDate,
                                homeTeam: homeTeam,
                                awayTeam: awayTeam,
                                result: {
                                    homeTeamGoals: homeTeamGoals,
                                    awayTeamGoals: awayTeamGoals
                                },
                                updated: Date.now()
                            }, {
                                upsert: true
                            }, function(err, result) {
                                if (err) {
                                    console.log('error at ', matchDate);
                                    throw err;
                                }
                                console.log('successfully created ' + matchDate + ' match between ' + homeTeam + ' vs ' + awayTeam);
                            });
                        }
                    });
                });
            });
        }
    });

    res.send('Check console');
});

app.get('/table', function(req, res) {
    fs.readFile(__dirname + "/" + "output.json", "utf8", function(err, data) {
        console.log(data);
        res.end(data);
    });
});

var server = app.listen(port);
console.log('Magic happens on port 8081');
exports = module.exports = server;

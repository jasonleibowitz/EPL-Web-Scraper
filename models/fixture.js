'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FixtureSchema = new Schema({
    date: Date,
    status: String, // Finished, Scheduled, In Progress, Postponed
    homeTeam: String,
    awayTeam: String,
    updated: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Fixture', FixtureSchema);

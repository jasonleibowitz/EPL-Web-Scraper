'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FixtureSchema = new Schema({
    date: Date,
    status: String, // Finished, Scheduled, In Progress, Postponed
    homeTeam:, // reference
    awayTeam:, // reference
    result: {
        homeTeamGoals: Number,
        awayTeamGoals: Number
    },
    events: {
        goals: {
            player: String,
            time: Number
        },
        cards: {
            player: String,
            time: Number
            type: String
        }
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Fixture', FixtureSchema);

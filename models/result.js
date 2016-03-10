'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoalSchema = new Schema({
    player: String,
    time: Number
});

var CardSchema = new Schema({
    player: String,
    time: Number,
    type: String
})

var ResultSchema = new Schema({
    date: Date,
    competition: String,
    homeTeam: String,
    awayTeam: String,
    result: {
        homeTeamGoals: Number,
        awayTeamGoals: Number
    },
    events: {
        goals: [GoalSchema],
        cards: [CardSchema],
        updated: {
            type: Date,
            default: Date.now()
        }
    },
    updated: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Result', ResultSchema);

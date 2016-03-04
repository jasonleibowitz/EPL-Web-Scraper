'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var TeamSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    fullName: {
        type: String,
        unique: true
    },
    shortname: {
        type: String,
        unique: true
    },
    points: Number,
    won: Number,
    drawn: Number,
    lost: Number,
    goalsFor: Number,
    goalsAgainst: Number,
    goalDifference: Number,
    lastMatch: {
        date: String,
        result: String,
        opponent: String,
        goalsFor: Number,
        goalsAgainst: Number
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

// var TeamSchema = new Schema({
//     name: {
//         type: String,
//         unique: true
//     },
//     points: Number,
//     fixtures: {
//         [
//             date: Date,
//             homeOrAway: String,
//             opponent: String,
//             result: {
//                 teamGoals: Number,
//                 opponentGoals: Number
//             },
//             events: {
//                 goals: {
//                     player: String,
//                     time: Number
//                 },
//                 cards: {
//                     player: String,
//                     time: Number,
//                     type: String
//                 }
//             }
//         ]
//     }
// })

module.exports = mongoose.model('Team', TeamSchema);

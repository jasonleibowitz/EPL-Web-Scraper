'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    points: Number
});

module.exports = mongoose.model('Team', TeamSchema);

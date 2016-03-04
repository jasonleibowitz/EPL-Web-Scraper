'use strict';
var moment = require('moment');

function DataNormalizer() {};

DataNormalizer.prototype.cleanDate = function(dateString) {
    var splitDate = dateString.split(' ');
    var date = moment(splitDate[2] + '-' + splitDate[1] + '-' + parseInt(splitDate[0]), 'YYYY MMMM D');
    return date.format('MM-DD-YYYY');
};

DataNormalizer.prototype.getGoals = function(result, score, primaryTeam) {
    var splitScore = score.split(' - ');
    var winningScore = splitScore[0] > splitScore[1] ? splitScore[0].trim() : splitScore[1].trim();
    var losingScore = splitScore[0] < splitScore[1] ? splitScore[0].trim() : splitScore[1].trim();

    if (result.toLowerCase() === 'loss') {
        return !!primaryTeam ? losingScore : winningScore;
    } else {
        return !!primaryTeam ? winningScore : losingScore;
    }

};

module.exports = DataNormalizer;

'use strict';

var chai                    = require('chai');
var expect                  = chai.expect;
var dataNormalizer          = require('../data_normalizer_helper');
chai.config.includeStack    = true;

describe('DataNormalizer', function() {
    var DataNormalizer = new dataNormalizer();

    describe('#cleanDate', function() {
        context('with a British formatted date string', function() {
            it('returns a cleaned up date string in MM-DD-YYYY format and using only numbers', function() {
                var date = '1st March 2016';
                var newDate = DataNormalizer.cleanDate(date);
                return expect(newDate).to.eq('03-01-2016');
            });

            it('returns a cleaned up date string with a February date', function() {
                var date = '27th February 2016';
                var newDate = DataNormalizer.cleanDate(date);
                return expect(newDate).to.eq('02-27-2016');
            });

            it('returns a cleaned up date string for a date in 2015', function() {
                var date = '29th December 2015';
                var newDate = DataNormalizer.cleanDate(date);
                return expect(newDate).to.eq('12-29-2015');
            });
        });
    });

    describe('#getGoals', function() {
        context('with a nil-nil draw', function() {
            var score = '0 - 0 ';
            var result = 'Draw';

            it('returns 0 as the winning team\'s goals', function() {
                var winningTeamGoals = DataNormalizer.getGoals(result, score, true);
                return expect(winningTeamGoals).to.eq('0');
            });

            it('returns 0 as the opponent team\'s goals', function() {
                var losingTeamGoals = DataNormalizer.getGoals(result, score, false);
                return expect(losingTeamGoals).to.eq('0');
            });
        });

        context('with a primary team win', function() {
            var score = '2 - 1';
            var result = 'Win';
            it('returns the larger goal tally for the winning team', function() {
                var winningTeamGoals = DataNormalizer.getGoals(result, score, true);
                return expect(winningTeamGoals).to.eq('2');
            });

            it('returns the smaller goal tally for the losing team', function() {
                var losingTeamGoals = DataNormalizer.getGoals(result, score, false);
                return expect(losingTeamGoals).to.eq('1');
            });
        });

        context('with a primary team loss', function() {
            var score = '2 - 1';
            var result = 'Loss';

            it('returns the smaller goal tally for the losing team', function() {
                var losingTeamGoals = DataNormalizer.getGoals(result, score, true);
                return expect(losingTeamGoals).to.eq('1');
            });

            it('returns the larger goal tally for the winning team', function() {
                var winningTeamGoals = DataNormalizer.getGoals(result, score, false);
                return expect(winningTeamGoals).to.eq('2');
            });
        });
    });
});

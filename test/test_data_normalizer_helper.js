'use strict';

var chai                    = require('chai');
var expect                  = chai.expect;
var dataNormalizer          = require('../data_normalizer_helper');
chai.config.includeStack    = true;

describe('DataNormalizer', function() {
    var DataNormalizer = new dataNormalizer();

    describe('#cleanDate', function() {
        context('with a British formatted date string of 1st March 2016', function() {
            var date = '1st March 2016';
            var newDate = DataNormalizer.cleanDate(date);

            it('returns a JS Date Object', function() {
                return expect(newDate).to.be.a('date');
            });

            it('the fullYear of the Date Object is 2016', function() {
                return expect(newDate.getFullYear()).to.eq(2016);
            });

            it('the month of the Date Object is 02', function() {
                return expect(newDate.getMonth()).to.eq(2);
            });

            it('the day of the Date Object is 01', function() {
                return expect(newDate.getDate()).to.eq(1);
            })
        });

        context('with a British formatted date that includes day of week, i.e. Sunday 6th March 2016', function() {
            var date = 'Sunday 6th March 2016';
            var newDate = DataNormalizer.cleanDate(date);

            it('returns a JS Date Object', function() {
                return expect(newDate).to.be.a('date');
            });

            it('the fullYear of the Date Object is 2016', function() {
                return expect(newDate.getFullYear()).to.eq(2016);
            });

            it('the month of the Date object is 02', function() {
                return expect(newDate.getMonth()).to.eq(2);
            });

            it('the day of the Date object is 6', function() {
                return expect(newDate.getDate()).to.eq(6);
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

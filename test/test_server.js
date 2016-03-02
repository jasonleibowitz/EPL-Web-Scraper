'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var request = require('request');
chai.use(chaiAsPromised);
var expect = chai.expect;
chai.config.includeStack = true;
var server = require('../server.js');

describe('server response', function() {
    before(function() {
        server.listen(8081);
    });
    after(function() {
        server.close();
    });
    it('should return 200', function(done) {
        request.get('http://localhost:8081', function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.equal('Nothing to see at this path.');
            done();
        });
    });
});

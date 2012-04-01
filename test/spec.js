var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var restler = require('restler');
var Trello = require('trello');

describe('Trello', function () {
    var trello;

    beforeEach(function () {
        sinon.stub(restler, 'post', function (uri, options) {
            return {on: function (event, callback) {
                callback(null, null);
            }};
        });
        trello = new Trello('key', 'token');
    });

    describe('addBoard', function () {
        it('should post to https://api.trello.com/1/boards', function (done) {
            trello.addBoard(null, null, null, function () {
                restler.post.should.have.been.calledWith('https://api.trello.com/1/boards');
                done();
            });
        });

        describe('given a description', function () {
            it('should include the description', function (done) {
                trello.addBoard(null, 'description', null, function () {
                    restler.post.args[0][1].query.desc.should.equal('description');
                    done();
                });
            });
        });

        describe('given a name', function () {
            it('should include the name', function (done) {
                trello.addBoard('name', null, null, function () {
                    restler.post.args[0][1].query.name.should.equal('name');
                    done();
                });
            });
        });

        describe('given an organization id', function () {
            it('should include the organization id', function (done) {
                trello.addBoard(null, null, 'organizationId', function () {
                    restler.post.args[0][1].query.idOrganization.should.equal('organizationId');
                    done();
                });
            });
        });

        afterEach(function () {
            restler.post.restore();
        });
    });
});

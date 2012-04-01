var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var restler = require('restler');
var Trello = require('../main');

describe('Trello', function () {
    var trello;

    beforeEach(function () {
        trello = new Trello('key', 'token');
    });

    describe('addBoard', function () {
        var query;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {on: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addBoard('name', 'description', 'organizationId', function () {
                query = restler.post.args[0][1].query;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/boards', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/boards');
        });

        it('should include the description', function () {
            query.desc.should.equal('description');
        });

        it('should include the name', function () {
            query.name.should.equal('name');
        });

        it('should include the organization id', function () {
            query.idOrganization.should.equal('organizationId');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });
});

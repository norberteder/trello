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

    describe('addWebhook', function () {
        var query;
        var post;
        var data;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {
                    on: function (event, callback) {
                        callback(null, null);
                    }
                };
            });

            trello.addWebhook('webhook', 'http://callback', 'xxx', function (result) {
                query = restler.post.args[0][1].query;
                data = restler.post.args[0][1].data;
                post = restler.post;
                done();
            });

        });

        it('should post to https://api.trello.com/1/tokens/.../webhooks/', function () {
            
            post.args[0][0].should.equal('https://api.trello.com/1/tokens/' + trello.token + '/webhooks/');
        });

        it('should include the application key', function () {
            query.key.should.equal('key');
        });

        it('should include the decription', function () {
            data.description.should.equal('webhook');
        });

        it('should include the callbackUrl', function () {
            data.callbackURL.should.equal('http://callback');
        });

        it('should include the idModel', function () {
            data.idModel.should.equal('xxx');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('deleteWebhook', function () {
        var query;
        var del;

        beforeEach(function (done) {
            sinon.stub(restler, 'del', function (uri, options) {
                return {
                    on: function (event, callback) {
                        callback(null, null);
                    }
                };
            });

            trello.deleteWebhook('x1', function (result) {
                query = restler.del.args[0][1].query;
                del = restler.del;
                done();
            });

        });

        it('should delete to https://api.trello.com/1/webhooks/x1', function () {
            del.args[0][0].should.equal('https://api.trello.com/1/webhooks/x1');
        });

        it('should include the application key', function () {
            query.key.should.equal('key');
        });

        afterEach(function () {
            restler.del.restore();
        });
    });


    describe('Update card list', function () {
        var query;
        var put;
        var data;

        beforeEach(function (done) {
            sinon.stub(restler, 'put', function (uri, options) {
                return {
                    on: function (event, callback) {
                        callback(null, null);
                    }
                };
            });

            trello.updateCardList('myCardId', 'newListId', function (result) {
                query = restler.put.args[0][1].query;
                put = restler.put;
                done();
            });

        });

        it('should put to https://api.trello.com/1/cards/myCardId/idList', function () {
            put.args[0][0].should.equal('https://api.trello.com/1/cards/myCardId/idList');
        });

        it('should include the idList', function () {
            query.value.should.equal('newListId');
        });

        afterEach(function () {
            restler.put.restore();
        });
    });
});

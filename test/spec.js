var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var q = require('q');
var fs = require('fs');

chai.should();
chai.use(sinonChai);

var restler = require('restler');
var Trello = require('../main');

describe('Trello', function () {
    var trello;

    beforeEach(function () {
        trello = new Trello('key', 'token');
    });

    describe('makeRequest', function () {
        var expect = chai.expect;

        it('should throw error if type of options passed is not object', function () {
            expect(trello.makeRequest.bind(trello, 'GET', 'somePath', 'wrongOptions')).to.throw(TypeError)
        });

        it('should throw error if type of a method passed is not string', function () {
            expect(trello.makeRequest.bind(trello, restler.post, 'somePath', {})).to.throw(TypeError)
        });

        it('should throw error if a method passed is not one of these: POST, GET, PUT, DELETE', function () {
            expect(trello.makeRequest.bind(trello, 'patch', 'somePath', {})).to.throw(Error)
        });

        it('should not throw error if no options are passed', function () {
            expect(trello.makeRequest.bind(trello, 'GET', '/1/members/me/tokens')).to.not.throw(Error);
        });

        it('should not throw error if a method passed is POST', function (done) {
            sinon.stub(restler, 'post', function (path, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            expect(trello.makeRequest.bind(trello, 'POST', 'somePath', {}, function () {})).to.not.throw(Error);
            restler.post.restore();
            done();
        });

        it('should not throw error if a method passed is GET', function (done) {
            sinon.stub(restler, 'get', function (path, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            expect(trello.makeRequest.bind(trello, 'GET', 'somePath', {}, function () {})).to.not.throw(Error);
            restler.get.restore();
            done();
        });

        it('should not throw error if a method passed is PUT', function (done) {
            sinon.stub(restler, 'put', function (path, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            expect(trello.makeRequest.bind(trello, 'PUT', 'somePath', {}, function () {})).to.not.throw(Error);
            restler.put.restore();
            done();
        });

        it('should not throw error if a method passed is DELETE', function (done) {
            sinon.stub(restler, 'del', function (path, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            expect(trello.makeRequest.bind(trello, 'DELETE', 'somePath', {}, function () {})).to.not.throw(Error);
            restler.del.restore();
            done();
        });

        it('should not mutate passed options object', function (done) {
            sinon.stub(restler, 'get', function (path, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });
            var options = { webhooks: true };
            trello.makeRequest("get", "/1/cards", options)
                .then(function (result) {
                    expect(Object.keys(options).length, 1, "options object was mutated");
                    expect(options.webhooks, true)
                });
            restler.get.restore();
            done();
        })
    });

    describe('addBoard', function () {
        var query;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
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

    describe('addCard', function() {
        var query;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addCard('name', 'description', 'listId', function () {
                query = restler.post.args[0][1].query;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/cards', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/cards');
        });

        it('should include the description', function () {
            query.desc.should.equal('description');
        });

        it('should include the name', function () {
            query.name.should.equal('name');
        });

        it('should include the list id', function () {
            query.idList.should.equal('listId');
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
                    once: function (event, callback) {
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
                    once: function (event, callback) {
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
                    once: function (event, callback) {
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

    describe.skip('It is able to chain several calls', function () {
        var trello,
            options =  {
                key: "key",
                token: "tocken",
                listId: 'listId'
            },
            cardsToCreate = 30,
            cardsCreated = 0;


        beforeEach(function (done) {
            var index,
                promisesList = [],
                cardCreationPromise = q.defer();

            //Increase timeout due to real api calls
            this.timeout(1000000);

            //Setup a real trello client with a local configuration file
            if (fs.existsSync('./test/config.js')) {
                options = require('./config');
            }
            trello = new Trello(options.key, options.token);


            //It creates and removes as many cards as set in cardsToCreate
            for(index = 0; index < cardsToCreate; index++) {
                cardCreationPromise = q.defer();
                trello.addCard('Test card #' + index, 'test card', options.listId, cardCreationPromise.makeNodeResolver());

                promisesList.push(
                    //Remove the card created
                    cardCreationPromise.promise.then(function (card) {
                        if(!card.id) {
                            console.log(card);
                            throw "Trello call failed " + card;
                        } else {
                            var removeCardPromise = q.defer();
                            cardsCreated = cardsCreated + 1;
                            trello.deleteCard(card.id, removeCardPromise.makeNodeResolver());
                            return removeCardPromise.promise;
                        }
                    }).fail (function(e){
                        throw "Trello call failed " + e;
                    })
                );
            }

            q.allSettled(promisesList).then(function () {
                done();
            });
        });

        it('should chain several calls without failing', function () {
            cardsCreated.should.equal(cardsToCreate);
        });
    });

    describe('addAttachmentToCard', function() {
        var query;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addAttachmentToCard('myCardId', 'attachmentUrl', function () {
                query = restler.post.args[0][1].query;
                post = restler.post;
                done();
            });
        });

        it("should post to the card's attachment URI", function () {
            post.should.have.been.calledWith('https://api.trello.com/1/cards/myCardId/attachments');
        });

        it('should include the list id', function () {
            query.url.should.equal('attachmentUrl');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('renameList', function() {
        var query;
        var put;

        beforeEach(function (done) {
            sinon.stub(restler, 'put', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.renameList('myListId', 'new list name', function () {
                query = restler.put.args[0][1].query;
                put = restler.put;
                done();
            });
        });

        it("should PUT to the card's attachment URI", function () {
            put.should.have.been.calledWith('https://api.trello.com/1/lists/myListId/name');
        });

        it('should include the new list name', function () {
            query.name.should.equal('new list name');
        });

        afterEach(function () {
            restler.put.restore();
        });
    });

    describe('returnPromise', function() {
        it('should return a promise', function() {
            var shouldBeAPromise = trello.addAttachmentToCard('myCardId', 'attachmentUrl');

            shouldBeAPromise.should.be.a("Promise");
        });
    });

    describe('executeCallback', function() {
        it('should not return a promise', function() {
            var shouldNotBeAPromise = trello.addAttachmentToCard('myCardId', 'attachmentUrl', function() {});

            chai.assert.isUndefined(shouldNotBeAPromise);
        });
    });

    describe('getLabelsForBoard', function() {
        var get;

        beforeEach(function (done) {
            sinon.stub(restler, 'get', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.getLabelsForBoard('boardId', function () {
                get = restler.get;
                done();
            });
        });

        it('should get to https://api.trello.com/1/boards/boardId/labels', function () {
            get.should.have.been.calledWith('https://api.trello.com/1/boards/boardId/labels');
        });

        afterEach(function () {
            restler.get.restore();
        });
    });

    describe('addMemberToBoard', function () {
        var data;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'put', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addMemberToBoard('boardId', 'memberId', 'normal', function () {
                data = restler.put.args[0][1].data;
                put = restler.put;
                done();
            });
        });

        it('should post to https://api.trello.com/1/boards/boardId/members/memberId', function () {
            put.should.have.been.calledWith('https://api.trello.com/1/boards/boardId/members/memberId');
        });

        it('should include the type', function () {
            data.type.should.equal('normal');
        });

        afterEach(function () {
            restler.put.restore();
        });
    });

    describe('addLabelOnBoard', function() {
        var query;
        var data;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addLabelOnBoard('boardId', 'name', 'color', function () {
                query = restler.post.args[0][1].query;
                data = restler.post.args[0][1].data;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/labels', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/labels');
        });

        it('should include the color', function () {
            data.color.should.equal('color');
        });

        it('should include the name', function () {
            data.name.should.equal('name');
        });

        it('should include the board id', function () {
            data.idBoard.should.equal('boardId');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('deleteLabel', function(){
        var del;

        beforeEach(function (done) {
            sinon.stub(restler, 'del', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.deleteLabel('labelId', function () {
                del = restler.del;
                done();
            });
        });

        it('should delete to https://api.trello.com/1/labels/labelId', function () {
            del.should.have.been.calledWith('https://api.trello.com/1/labels/labelId');
        });

        afterEach(function () {
            restler.del.restore();
        });
    });

    describe('addLabelToCard', function() {
        var query;
        var data;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addLabelToCard('cardId', 'labelId', function () {
                query = restler.post.args[0][1].query;
                data = restler.post.args[0][1].data;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/cards/cardId/idLabels', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/idLabels');
        });

        it('should include the label id', function () {
            data.value.should.equal('labelId');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('deleteLabelFromCard', function(){
        var del;

        beforeEach(function (done) {
            sinon.stub(restler, 'del', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.deleteLabelFromCard('cardId', 'labelId', function () {
                del = restler.del;
                done();
            });
        });

        it('should delete to https://api.trello.com/1/cards/cardId/idLabels/labelId', function () {
            del.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/idLabels/labelId');
        });

        afterEach(function () {
            restler.del.restore();
        });
    });

    describe('updateLabel', function() {
        var query;
        var put;

        beforeEach(function (done) {
            sinon.stub(restler, 'put', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.updateLabel('labelId', 'field', 'value', function () {
                query = restler.put.args[0][1].query;
                put = restler.put;
                done();
            });
        });

        it('should put to https://api.trello.com/1/labels/labelId/field', function () {
            put.should.have.been.calledWith('https://api.trello.com/1/labels/labelId/field');
        });

        it('should include the updated value', function () {
            query.value.should.equal('value');
        });

        afterEach(function () {
            restler.put.restore();
        });
    });

    describe('getCardStickers', function() {
        var get;

        beforeEach(function (done) {
            sinon.stub(restler, 'get', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.getCardStickers('cardId', function () {
                get = restler.get;
                done();
            });
        });

        it('should get to https://api.trello.com/1/cards/cardId/stickers', function () {
            get.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/stickers');
        });

        afterEach(function () {
            restler.get.restore();
        });
    });

    describe('addStickerToCard', function() {
        var query;
        var data;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addStickerToCard('cardId', 'image', 'left', 'top', 'zIndex', 'rotate', function () {
                query = restler.post.args[0][1].query;
                data = restler.post.args[0][1].data;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/cards/cardId/stickers', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/stickers');
        });

        it('should include the sticker image', function () {
            data.image.should.equal('image');
        });

        it('should include the sticker top', function () {
            data.top.should.equal('top');
        });

        it('should include the sticker left', function () {
            data.left.should.equal('left');
        });

        it('should include the sticker zIndex', function () {
            data.zIndex.should.equal('zIndex');
        });

        it('should include the sticker rotate', function () {
            data.rotate.should.equal('rotate');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('addChecklistToCard', function() {
        var query;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addChecklistToCard('cardId', 'name', function () {
                query = restler.post.args[0][1].query;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/cards/cardId/checklists', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/checklists');
        });

        it('should include the checklist name', function () {
            query.name.should.equal('name');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('addExistingChecklistToCard', function() {
        var query;
        var post;

        beforeEach(function (done) {
            sinon.stub(restler, 'post', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.addExistingChecklistToCard('cardId', 'checklistId', function () {
                query = restler.post.args[0][1].query;
                post = restler.post;
                done();
            });
        });

        it('should post to https://api.trello.com/1/cards/cardId/checklists', function () {
            post.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/checklists');
        });

        it('should include the checklist ID', function () {
            query.idChecklistSource.should.equal('checklistId');
        });

        afterEach(function () {
            restler.post.restore();
        });
    });

    describe('getChecklistsOnCard', function() {
        var get;

        beforeEach(function (done) {
            sinon.stub(restler, 'get', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.getChecklistsOnCard('cardId', function () {
                get = restler.get;
                done();
            });
        });

        it('should get to https://api.trello.com/1/cards/cardId/checklists', function () {
            get.should.have.been.calledWith('https://api.trello.com/1/cards/cardId/checklists');
        });

        afterEach(function () {
            restler.get.restore();
        });
    });

    describe('getBoardMembers', function() {
        var get;

        beforeEach(function (done) {
            sinon.stub(restler, 'get', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.getBoardMembers('boardId', function () {
                get = restler.get;
                done();
            });
        });

        it('should get to https://api.trello.com/1/boards/boardId/members', function () {
            get.should.have.been.calledWith('https://api.trello.com/1/boards/boardId/members');
        });

        afterEach(function () {
            restler.get.restore();
        });
    });

    describe('getOrgMembers', function() {
        var get;

        beforeEach(function (done) {
            sinon.stub(restler, 'get', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.getOrgMembers('organizationId', function () {
                get = restler.get;
                done();
            });
        });

        it('should get to https://api.trello.com/1/organizations/organizationId/members', function () {
            get.should.have.been.calledWith('https://api.trello.com/1/organizations/organizationId/members');
        });

        afterEach(function () {
            restler.get.restore();
        });
    });

    describe('getOrgBoards', function() {
        var get;

        beforeEach(function (done) {
            sinon.stub(restler, 'get', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.getOrgBoards('organizationId', function () {
                get = restler.get;
                done();
            });
        });

        it('should get to https://api.trello.com/1/organizations/organizationId/boards', function () {
            get.should.have.been.calledWith('https://api.trello.com/1/organizations/organizationId/boards');
        });

        afterEach(function () {
            restler.get.restore();
        });
    });

    describe('updateChecklist', function() {
        var query;
        var put;

        beforeEach(function (done) {
            sinon.stub(restler, 'put', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });

            trello.updateChecklist('checklistId', 'field', 'value', function () {
                query = restler.put.args[0][1].query;
                put = restler.put;
                done();
            });
        });

        it('should put to https://api.trello.com/1/checklists/checklistId/field', function () {
            put.should.have.been.calledWith('https://api.trello.com/1/checklists/checklistId/field');
        });

        it('should include the checklist name', function () {
            query.value.should.equal('value');
        });

        afterEach(function () {
            restler.put.restore();
        });
    });
});

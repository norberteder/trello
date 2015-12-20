var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var q = require('q');
var fs = require('fs');

chai.should();
chai.use(sinonChai);

var restler = require('restler');
var Trello = require('../main');
var expect = chai.expect;

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
    
    it('should have ratelimiting off by default and limits set to 100 per a 10 second span', function () {
        expect(Trello.limitRate).to.be.false;
        expect(Trello.limits.count).to.equal(100);
        expect(Trello.limits.time).to.equal(10000);        
    });
    
    describe('when limits are set but not enabled', function () {
        beforeEach(function () {
            sinon.stub(restler, 'put', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });
            
            Trello.limits = {
                count: 3,
                time: 50
            };            
        }); 
        
        describe('and more calls than the rate limit is requested', function () {
            it('then it should not limit the rate and call all requests without delay', function (done) {
                var start = +new Date(),
                    returnCount = 0,
                    numberOfRequests = 4,
                    i;
                    
                for (i = 0; i < numberOfRequests; i++) {
                    trello.renameList('listId', 'name', function () { 
                        returnCount++;
                        if (returnCount === numberOfRequests) {
                            var end = +new Date();
                            expect(end - start).to.be.below(50);
                            restler.put.callCount.should.equal(4);
                            done();
                        }
                    });
                }
            });
        });
        
        afterEach(function () {
            restler.put.restore();
            Trello.limitRate = false;
        });
    });
    
    describe('when limiting request rate, to 3 per a 100ms span', function () {
        beforeEach(function () {
            sinon.stub(restler, 'put', function (uri, options) {
                return {once: function (event, callback) {
                    callback(null, null);
                }};
            });
            
            Trello.limits = {
                count: 3,
                time: 50
            };
            
            Trello.limitRate = true;
        });      
                
        function assertions(runCallback) {
            function runNTimes(numberOfRequests, done, expectionFn, finalExpectionFn) {
                var returnCount = 0,
                    handler = function () {                   
                        var query = restler.put.args[0][1].query,
                            put = restler.put;
                        
                        returnCount++;
                        expectionFn(returnCount, query, put);
                        if (returnCount === numberOfRequests) {
                            finalExpectionFn(returnCount, query, put);
                            done();
                        }
                    },
                    i;
                    
                for (i = 0; i < numberOfRequests; i++) {
                    if (runCallback) {
                        trello.renameList('listId', 'name', handler);
                    } else {
                        trello.renameList('listId', 'name').then(handler);
                    }                    
                }
            }
        
            describe('and less than or equal to 3 requests are made', function () {
                it('then it should fire all requests without delay', function (done) {
                    var start = +new Date();
                    runNTimes(3, done, function (returnCount, query, put) {
                        put.should.have.been.calledWith('https://api.trello.com/1/lists/listId/name');
                        query.name.should.equal('name');                   
                    }, function (returnCount, query, put) {
                        var end = +new Date();
                        expect(end - start).to.be.below(50);
                        put.callCount.should.equal(3);
                    });
                });
            });
       
            describe('and more than 3 requests are made', function () {
                it('then it should fire all requests eventually', function (done) {
                    var start = +new Date();
                    runNTimes(4, done, function (returnCount, query, put) {
                        put.should.have.been.calledWith('https://api.trello.com/1/lists/listId/name');
                        query.name.should.equal('name');                   
                    }, function (returnCount, query, put) {
                        var end = +new Date();
                        expect(end - start).to.be.above(50);
                        put.callCount.should.equal(4);
                    });
                });
                
                it('then it should keep the original order of invokation', function (done) {
                    var returnCount = 0,
                        numberOfRequests = 4,
                        handler = function () {
                            returnCount++;
                            if (returnCount === numberOfRequests) {
                                for (j = 0; j < numberOfRequests; j++) {
                                    restler.put.getCall(j).should.have.been.calledWith('https://api.trello.com/1/lists/' + j + '/name');
                                }
                                done();
                            }
                        },
                        i, j;
                        
                    for (i = 0; i < numberOfRequests; i++) {
                        if (runCallback) {
                            trello.renameList(i, 'value', handler);
                        } else {
                            trello.renameList(i, 'value').then(handler);
                        }
                    }
                });
            });
        }
        
        describe('using the callback version of the api', function () {
            assertions(true);
        });
        
        describe('using the promise version of the api', function () {
            assertions(false);
        });

        afterEach(function () {
            restler.put.restore();
            Trello.limitRate = false;
        });
    });        
});

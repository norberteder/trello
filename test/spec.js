var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var q = require("q");
var fs = require("fs");

chai.should();
chai.use(sinonChai);

const Trello = require("../main");
const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../library/helpers");

describe("Trello", () => {
  let trello;
  const expect = chai.expect;

  beforeEach(function() {
    trello = new Trello("key", "token");
  });

  describe("#makeRequest()", () => {
    it("should throw error if type of options passed is not object", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "GET",
          "https://www.example.com/somePath",
          "wrongOptions"
        )
      ).to.throw(Error);
    });

    it("should throw error if type of a method passed is not string", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          {},
          "https://www.example.com/somePath",
          {}
        )
      ).to.throw(Error);
    });

    it("should throw error if a method passed is not one of these: POST, GET, PUT, DELETE", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "patch",
          "https://www.example.com/somePath",
          {}
        )
      ).to.throw(Error);
    });

    it("should not throw error if no options are passed", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "GET",
          "https://www.example.com/1/members/me/tokens"
        )
      ).to.not.throw(Error);
    });

    it("should not throw error if a method passed is POST", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "POST",
          "https://www.example.com/somePath",
          {}
        )
      ).to.not.throw(Error);
    });

    it("should not throw error if a method passed is GET", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "GET",
          "https://www.example.com/somePath",
          {}
        )
      ).to.not.throw(Error);
    });

    it("should not throw error if a method passed is PUT", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "PUT",
          "https://www.example.com/somePath",
          {}
        )
      ).to.not.throw(Error);
    });

    it("should not throw error if a method passed is DELETE", () => {
      expect(
        trello.makeRequest.bind(
          trello,
          "DELETE",
          "https://www.example.com/somePath",
          {}
        )
      ).to.not.throw(Error);
    });

    it("should not mutate passed options object", () => {
      const options = { webhooks: true };

      trello
        .makeRequest("GET", "https://www.example.com/1/cards", options)
        .then(function(result) {
          expect(Object.keys(options).length, 1, "options object was mutated");
          expect(options.webhooks, true);
        });
    });
  });

  describe("/1/boards", () => {
    describe("#addBoard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addBoard.bind(trello, "name", "description", "teamId")
        ).to.not.throw(Error);
      });

      it("should throw if missing a param", () => {
        expect(trello.addBoard.bind(trello, "name", "teamId")).to.throw(Error);
      });
    });
  });

  describe("/1/cards", () => {
    describe("#addCard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.addCard.bind(trello, "name", "listId")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.addCard.bind(trello, "name")).to.throw(Error);
      });
    });
  });

  describe("/1/checklists", () => {
    describe("#addItemToChecklist()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addItemToChecklist.bind(
            trello,
            "checkListId",
            "name",
            "position"
          )
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(
          trello.addItemToChecklist.bind(trello, "checkListId", "name")
        ).to.throw(Error);
      });
    });
  });

  describe("/1/labels", () => {
    describe("#updateLabel()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.updateLabel.bind(trello, "labelId", "extraParams")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.updateLabel.bind(trello, "labelId")).to.throw(Error);
      });
    });
  });

  describe("/1/list", () => {
    describe("#renameList()", () => {
      it("should not throw an error when called", () => {
        expect(trello.renameList.bind(trello, "param1", "param2")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.renameList.bind(trello, "param1")).to.throw(Error);
      });
    });
  });

  describe("/1/members", () => {
    describe("#getBoards()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getBoards.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getBoards.bind(trello)).to.throw(Error);
      });
    });
  });

  describe("/1/organizations", () => {
    describe("#getBoards()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getBoards.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getBoards.bind(trello)).to.throw(Error);
      });
    });
  });

  describe("/1/webhooks", () => {
    describe("#addWebhook()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addWebhook.bind(trello, "param1", "param2", "param3")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addWebhook.bind(trello, "param1")).to.throw(Error);
      });
    });
  });
});

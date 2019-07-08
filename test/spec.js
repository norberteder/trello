const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const sinonStubPromise = require("sinon-stub-promise");
const fetchMock = require("fetch-mock");

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

    fetchMock.get("*", { statusCode: 200 });
    fetchMock.post("*", { statusCode: 200 });
    fetchMock.delete("*", { statusCode: 200 });
    fetchMock.put("*", { statusCode: 200 });
  });

  afterEach(() => {
    fetchMock.reset();
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

    it("should not throw error if a method passed is POST", async () => {
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
      const result = trello.makeRequest(
        "GET",
        "https://www.example.com/1/cards",
        options
      );

      result.then(function() {
        expect(Object.keys(options).length, 1, "options object was mutated");
        expect(options.webhooks, true);
      });
    });

    // it("should error if unable to to make request", () => {
    //   //
    //   expect(
    //     trello.makeRequest.bind(
    //       trello,
    //       "DELETE",
    //       "https://www.example.com/somePath",
    //       {}
    //     )
    //   ).to.throw(Error);

    // });
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

    describe("#updateBoardPref()", () => {
      it("should not throw an error when called", () => {
        expect(trello.updateBoardPref.bind(trello, "boardId", {})).to.not.throw(
          Error
        );
      });

      it("should throw if missing a param", () => {
        expect(trello.updateBoardPref.bind(trello, "boardId")).to.throw(Error);
      });
    });

    describe("#addListToBoard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addListToBoard.bind(trello, "boardId", "name")
        ).to.not.throw(Error);
      });

      it("should throw if missing a param", () => {
        expect(trello.addListToBoard.bind(trello, "boardId")).to.throw(Error);
      });
    });

    describe("#addMemberToBoard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addMemberToBoard.bind(
            trello,
            "boardId",
            "memberId",
            "memberRights"
          )
        ).to.not.throw(Error);
      });

      it("should throw if missing a param", () => {
        expect(trello.addMemberToBoard.bind(trello, "boardId")).to.throw(Error);
      });
    });

    describe("#getBoardMembers()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getBoardMembers.bind(trello, "boardId")).to.not.throw(
          Error
        );
      });

      it("should throw if missing a param", () => {
        expect(trello.getBoardMembers.bind(trello)).to.throw(Error);
      });
    });

    describe("#getListsOnBoard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getListsOnBoard.bind(trello, "boardId")).to.not.throw(
          Error
        );
      });

      it("should throw if missing a param", () => {
        expect(trello.getListsOnBoard.bind(trello)).to.throw(Error);
      });
    });

    describe("#getListsOnBoardByFilter()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.getListsOnBoardByFilter.bind(trello, "boardId", "filter")
        ).to.not.throw(Error);
      });

      it("should throw if missing a param", () => {
        expect(trello.getListsOnBoardByFilter.bind(trello, "boardId")).to.throw(
          Error
        );
      });
    });

    describe("#getCardsOnBoard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getCardsOnBoard.bind(trello, "boardId")).to.not.throw(
          Error
        );
      });

      it("should throw if missing a param", () => {
        expect(trello.getCardsOnBoard.bind(trello)).to.throw(Error);
      });
    });

    describe("#getLabelsForBoard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getLabelsForBoard.bind(trello, "boardId")).to.not.throw(
          Error
        );
      });

      it("should throw if missing a param", () => {
        expect(trello.getLabelsForBoard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addLabelOnBoard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addLabelOnBoard.bind(trello, "boardId", "name", "color")
        ).to.not.throw(Error);
      });

      it("should throw if missing a param", () => {
        expect(trello.addLabelOnBoard.bind(trello)).to.throw(Error);
      });
    });

    describe("#getCardsOnBoardWithExtraParams()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.getCardsOnBoardWithExtraParams.bind(trello, "boardId", {})
        ).to.not.throw(Error);
      });

      it("should throw if missing a param", () => {
        expect(trello.getCardsOnBoardWithExtraParams.bind(trello)).to.throw(
          Error
        );
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

    describe("#addCardWithExtraParams()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addCardWithExtraParams.bind(trello, "name", {}, "listId")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addCardWithExtraParams.bind(trello, "name")).to.throw(
          Error
        );
      });
    });

    describe("#getCard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getCard.bind(trello, "cardId")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addCommentToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addCommentToCard.bind(trello, "cardId", "comment")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addCommentToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addAttachmentToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addAttachmentToCard.bind(trello, "cardId", "url")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addAttachmentToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addMemberToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addMemberToCard.bind(trello, "param1", "param2")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addMemberToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addChecklistToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addChecklistToCard.bind(trello, "param1", "param2")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addChecklistToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addExistingChecklistToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addExistingChecklistToCard.bind(trello, "param1", "param2")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addExistingChecklistToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#getChecklistsOnCard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getChecklistsOnCard.bind(trello, "param1")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.getChecklistsOnCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#updateCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.updateCard.bind(trello, "param1", { param2: "param2" })
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.updateCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#addLabelToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addLabelToCard.bind(trello, "param1", "param2")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addLabelToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#deleteLabelFromCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.deleteLabelFromCard.bind(trello, "param1", "param2")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.deleteLabelFromCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#getCardStickers()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getCardStickers.bind(trello, "param1")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.getCardStickers.bind(trello)).to.throw(Error);
      });
    });

    describe("#addDueDateToCard()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addDueDateToCard.bind(trello, "param1", "param2")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.addDueDateToCard.bind(trello)).to.throw(Error);
      });
    });

    describe("#deleteCard()", () => {
      it("should not throw an error when called", () => {
        expect(trello.deleteCard.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.deleteCard.bind(trello)).to.throw(Error);
      });
    });
  });

  describe("/1/checklists", () => {
    describe("#addItemToChecklist()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.addItemToChecklist.bind(trello, "param1", "param2", "param3")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(
          trello.addItemToChecklist.bind(trello, "checkListId", "name")
        ).to.throw(Error);
      });
    });

    describe("#updateChecklist()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.updateChecklist.bind(trello, "param1", "param2", "param3")
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.updateChecklist.bind(trello)).to.throw(Error);
      });
    });
  });

  describe("/1/labels", () => {
    describe("#updateLabel()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.updateLabel.bind(trello, "labelId", { name: "name" })
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.updateLabel.bind(trello, "labelId")).to.throw(Error);
      });
    });

    describe("#deleteLabel()", () => {
      it("should not throw an error when called", () => {
        expect(trello.deleteLabel.bind(trello, "labelId")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.deleteLabel.bind(trello)).to.throw(Error);
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

    describe("#getCardsForList()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getCardsForList.bind(trello, "param1")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.getCardsForList.bind(trello)).to.throw(Error);
      });
    });

    describe("#getCardsOnList()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getCardsOnList.bind(trello, "param1")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.getCardsOnList.bind(trello)).to.throw(Error);
      });
    });

    describe("#getCardsOnListWithExtraParams()", () => {
      it("should not throw an error when called", () => {
        expect(
          trello.getCardsOnListWithExtraParams.bind(trello, "param1", [
            "id",
            "name",
            "badges"
          ])
        ).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getCardsOnListWithExtraParams.bind(trello)).to.throw(
          Error
        );
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

    describe("#getMember()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getMember.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getMember.bind(trello)).to.throw(Error);
      });
    });

    describe("#getMemberCards()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getMemberCards.bind(trello, "param1")).to.not.throw(
          Error
        );
      });

      it("should throw if missing params", () => {
        expect(trello.getMemberCards.bind(trello)).to.throw(Error);
      });
    });
  });

  describe("/1/organizations", () => {
    describe("#getOrgBoards()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getOrgBoards.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getOrgBoards.bind(trello)).to.throw(Error);
      });
    });

    describe("#getOrgMembers()", () => {
      it("should not throw an error when called", () => {
        expect(trello.getOrgMembers.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.getOrgMembers.bind(trello)).to.throw(Error);
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

    describe("#deleteWebhook()", () => {
      it("should not throw an error when called", () => {
        expect(trello.deleteWebhook.bind(trello, "param1")).to.not.throw(Error);
      });

      it("should throw if missing params", () => {
        expect(trello.deleteWebhook.bind(trello)).to.throw(Error);
      });
    });
  });
});

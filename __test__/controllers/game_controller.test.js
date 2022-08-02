const GameController = require('../../controllers/game_controller.js');

describe("GameController", () => {
  it("should construct a new GameController instance when initialized", () => {

    const gameController = new GameController();
    expect(gameController).toBeInstanceOf(GameController);
  });

  describe("handleCombat", () => {

    it("should have a handleCombat function", () => {

    });

    it("should accept userid, runid, and turn_data params", () => {

    })

    it("should error if userid is not provided", () => {

    })

    it("should error if runid is not provided", () => {

    })

    it("should return a 'result' object with valid data", () => {

    })
  });

  describe("validateTurnSubmission", () => {


    
  })
})
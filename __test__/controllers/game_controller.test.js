const GameController = require('../../controllers/game_controller.js');

describe("GameController", () => {
  let gc
  beforeEach(() => {
    gc = new GameController();
  })
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


    
  });

  describe("generateSoftwareRewards", () => {
    it("should (in testing) return an array with [1,4,6]", () => {
      expect(gc.generateSoftwareRewards()).toEqual([1,4,6]);
    });

    it("should return a pseudo-random array of reward ids based on the run seed", () => {

    })

    it("should not return ids of any items that the player already owns", () => {
      
    })
  })
})
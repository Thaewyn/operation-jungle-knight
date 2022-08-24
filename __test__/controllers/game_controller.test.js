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
    it("should return false if the player submits more than the maximum number of attacks allowed", () => {
      let fakeSession = {
        player: {
          software_list: [{
            id:1,
            cooldown:0
          }]
        }
      }
      let fakeSubmission = {
        attacks: [1,2,3,4,5,6,7]
      }
      let result = gc.validateTurnSubmission(fakeSession, fakeSubmission);
      expect(result).toBe(false);
    }) 
    it("should return false if any of the submitted ids are not in the software list", () => {
      let fakeSession = {
        player: {
          software_list: [{
            id:1,
            cooldown:0
          }]
        }
      }
      let fakeSubmission = {
        attacks: [2]
      }
      let result = gc.validateTurnSubmission(fakeSession, fakeSubmission);
      expect(result).toBe(false);
    })

    it("should return false if any of the submitted ids are in the software list, but their cooldown is not 0", () => {
      let fakeSession = {
        player: {
          software_list: [{
            id:1,
            cooldown:2
          }]
        }
      }
      let fakeSubmission = {
        attacks: [1]
      }
      let result = gc.validateTurnSubmission(fakeSession, fakeSubmission);
      expect(result).toBe(false);
    })

    it("should return false if the player submitted zero attacks", () => {
      let fakeSession = {
        player: {
          software_list: [{
            id:1,
            cooldown:2
          }]
        }
      }
      let fakeSubmission = {
        attacks: []
      }
      let result = gc.validateTurnSubmission(fakeSession, fakeSubmission);
      expect(result).toBe(false);

    })

    it("should return true if all submitted attacks are in the software_list and all their cooldowns are 0", () => {
      let fakeSession = {
        player: {
          software_list: [{
            id:1,
            cooldown:0
          },{
            id:2,
            cooldown:0
          }]
        }
      }
      let fakeSubmission = {
        attacks: [1,2]
      }
      let result = gc.validateTurnSubmission(fakeSession, fakeSubmission);
      expect(result).toBe(true);
    })
    
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
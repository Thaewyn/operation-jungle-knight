const GameController = require('../../controllers/game_controller.js');

describe("GameController", () => {
  let gc
  beforeEach(() => {
    //FIXME - update gamecontroller dbc with mock to prevent mysql errors
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

  describe("handlePlayerHeals", () => {
    let tempResult, tempSession, skill_data;
    beforeEach(() => {
      tempResult = {
        actions: [],
        next_turn: {
          player: {
            hp: 5,
            defense: 0,
            statuses: {
              burn: 2
            },
            skills: []
          }
        }
      }
      tempSession = {
        player: {
          max_hp: 20
        }
      }
      skill_data = [
        {
          "id": 4,
          "name": "Heal",
          "icon_url": "",
          "desc": "Restore a small amount of health",
          "cooldown": 4,
          "targets": "SELF",
          "power": 5,
          "effect": "HEAL",
          "status": [],
          "rarity": "C",
          "cost": 10
        }
      ]
    })
    it("if the player submitted a 'heal' skill, it should restore the player's HP by that skill's amount", () => {
      let result = gc.handlePlayerHeals(tempResult, tempSession, skill_data);
      expect(result.next_turn.player.hp).toEqual(10);
    })
    it("if the player is already at full HP, it should activate the skill, but not change the player's HP", () => {
      tempResult.next_turn.player.hp = 20;
      let result = gc.handlePlayerHeals(tempResult, tempSession, skill_data);
      expect(result.next_turn.player.hp).toEqual(20);
    })
    it("if the player did not submit any 'heal' skills, it should *not* change the result object at all", () => {
      skill_data = []
      let result = gc.handlePlayerHeals(tempResult, tempSession, skill_data);
      expect(result).toEqual(tempResult);
    })
    it("if the player heals more than their max hp, it should cap their hp at the maximum.", () => {
      tempResult.next_turn.player.hp = 18;
      let result = gc.handlePlayerHeals(tempResult, tempSession, skill_data);
      expect(result.next_turn.player.hp).toEqual(20);
    })
    it("should not change any skill timers if no cleanse skill is used", () => {
      let result = gc.handlePlayerHeals(tempResult, tempSession, skill_data);
      expect(result.next_turn.player.statuses).toHaveProperty('burn',2)
    })
    it("should set status effect timers to 0 when a status cleanse skill is used", () => {
      skill_data = [{
        "id": 5,
        "name": "Cleanse",
        "icon_url": "",
        "desc": "Remove burn and poison status effects.",
        "cooldown": 2,
        "targets": "SELF",
        "power": 0,
        "effect": "HEAL",
        "status": ["burn","poison"],
        "rarity": "C",
        "cost": 10
      }]
      let result = gc.handlePlayerHeals(tempResult, tempSession, skill_data);
      expect(result.next_turn.player.statuses).toHaveProperty('burn',0)
    })
  })

  describe("handlePlayerDefense", () => {
    it("should not change the result object if no Defense-type skills are activated", () => {

    })
    it("should increase player defense if the player submitted any defense-increasing skills, up to a maximum of level 5", () => {

    })
    it("should improve Connection quality if the player submitted any connection-affecting skills, up to a maximum of 2 and a minimum of 0", () => {

    })
    it("should increase Obfuscation if the player submitted any skills that affect it.", () => {
      
    })
  })

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
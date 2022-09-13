// console.log("that which does the game logic.")

class GameController {
  constructor() {
    //TODO: do we even need to instantiate this? Can we just have everything static?
  }
  /**
   * First step combat handler.
   * @param {number} userid - userid whose game is being handled
   * @param {number} runid - run id currently being handled
   * @param {Object} turn_data - organized turn data containing the player's submitted Actions.
   * @param {number[]} turn_data.actions - software ids of actions being taken this turn.
   * 
   * @returns {Object} The turn's result, ordered to include player action results, and enemy responses.
   */
  handleCombat(session, turn_data) {
    console.log("static GameController.handleCombat");
    //get data for user and run, to make sure requested moves are valid
    // they can only take actions if they have the matching software for the id, and it is off cooldown
    // they also can't submit more actions than their maximum actions per turn.
    // either of those cases will return an error.

    // get user game session information from database

    if(this.validateTurnSubmission(session, turn_data)) {

      let result = {
        victory: true,
        gameover: false,
        defeat: false,
        actions: [ //'actions' is basically a script for the front-end to animate, so make sure to include all required bits there.
          {
            type: 'player_attack_1',
            skill_id: 1,
            target: 1, //NOTE: target is the position id of the affected enemy. 0 means 'no enemies' -1 means 'all enemies'
            damage: 5,
            defeated: false //did this attack destroy the enemy?
          },{
            type: 'enemy_attack_1',
            enemy_skill_id: 2,
            source: 1, //which enemy used the skill
            damage: 2,
            defeated: false //FIXME: do we want a distinct property name for player kill vs enemy kill?
          }
        ],
        next_turn: {
          player: {
            hp: 30,
            defense: 5,
            statuses: [], //both positive and negative.
            skills: [] //skill cooldown state.
          },
          enemies: [
            {
              id: 1,
              hp: 10,
              defense: 5,
              statuses: [],
              intent: "attack"
            }
          ]
        }
      }
      /*
      Order of operations! This is going to be critical. Make sure things happen in the same order
      every time. No race conditions!
  
      Also note that we should hold on to 'Victory' and 'Defeat' booleans that can be set by any of 
      these steps if we detect that the player should definitely win or lose. At that point, that
      becomes a hard override for any future actions. 'Defeat' skips everything else, and 'Victory'
      skips all 'negative' effects that don't carry over (heals should still take effect, etc).
  
      Abilities:
      1: player heals. Any restorative effects. This includes both HP and 'Defense'
      2: defensive abilities, any buffs and protections. This includes Connection and Obfuscation.
      3: mass attacks (things that target multiple/all enemies)
      4: single target attacks (things that target a single enemy)
      Status effects:
      5: beneficial effects on the player
      6: beneficial effects on enemies
      7: detrimental effects on enemies
      8: detrimental effects on players
      Enemy behavior:
      9: each enemy attack, in order from front to back. No randomness here! This is simply resolving intents.
  
      */
      result = this.handlePlayerHeals(result, session, turn_data);
      result = this.handlePlayerDefense(result, session, turn_data);
      result = this.handlePlayerAttacks(result, session, turn_data);
      result = this.handleStatusEffects(result, session, turn_data);
      result = this.handleEnemyAttacks(result, session, turn_data);
  
      
      /**
       * Ability target keywords:
       * ALL
       * FRONT1
       * FRONT2, etc
       * BACK1
       * BACK2, etc
       * SELF
       * LOWEST
       * HIGHEST
       */
      
      /**
       * Ability effect keywords:
       * HEAL - heal player
       * DAMAGE - damage enemy
       * DEFEND - increase player defense
       */
  
      return result;
    } else {
      //invalid, return something?
      return false
    }

  }

  validateTurnSubmission(session, player_submission){
    console.log("gc.validateTurnSubmission");
    // TODO: make sure the player is not submitting more actions than they can do
    let max_attacks_per_turn = 3; //FIXME: arbitrary number, pull from session data?
    if (player_submission.attacks.length > max_attacks_per_turn) {
      return false;
    } else if (player_submission.attacks.length > 0) {
      for (let i = 0; i < player_submission.attacks.length; i++) {
        const sub_id = player_submission.attacks[i];
        //console.log("player attack validation id: "+sub_id);
  
        let is_valid = false;
        session.player.software_list.forEach(item => {
          if(item.id == sub_id && item.cooldown == 0) {
            is_valid = true
            //continue? break?
          }
        });
        if(!is_valid) {
          //console.log("did not find a valid match for id "+sub_id);
          return false;
        }
      }
      //console.log("all submitted ids appear valid")
      return true;
    } else {
      //console.log("player submission contained no attacks");
      return false;
    }
    //return false;
  }
  handlePlayerHeals(resultobj, session, submission){
    return false;
  }
  handlePlayerDefense(resultobj, session, submission){
    return false;
  }
  handlePlayerAttacks(resultobj, session, submission){
    return false;
  }
  handleStatusEffects(resultobj, session, submission){
    return false;
  }
  handleEnemyAttacks(resultobj, session, submission){
    return false;
  }

  /**
   * Generate a list of valid Software item ids based on inputs
   * @param {String} seed hex value seed string
   * @param {Number} userid unique identifier of the user
   */
  generateSoftwareRewards(seed, userid) {
    //TODO: generate ids based on seed data and user data.
    let list = [1,4,6];

    return list;
  }

  /**
   * Generate a list of valid Hardware item ids based on inputs
   * @param {String} seed hex value seed string
   * @param {Number} userid unique identifier of the user
   */
  generateHardwareRewards(seed, userid) {
    //TODO: generate properly later.
    let list = [2,3,5];

    return list;
  }

  validateRewardSelection(seed, userid, rewardid) {
    //FIXME: actually validate
    return true
  }

  generateDefaultPlayer() {
    let playerObj = {
      current_hp: 50,
      max_hp: 50,
      current_defense: 0,
      connection: 1.0,
      obfuscation: 0,
      software_list:[{
        id: 1,
        cooldown:0
      }],
      hardware_list:[{
        id: 2
      }],
      statuses:[]
    }

    return playerObj;
  }

  initializePlayerForCombat(current_player) {
    //if new run, call generateDefaultPlayer, else
    if(!current_player) {
      return this.generateDefaultPlayer();
    } else {
      let initialized = current_player;
      initialized.statuses = [];
      for(let i=0; i<initialized.software_list.length; i++) {
        initialized.software_list[i].cooldown = 0
      }
      initialized.current_defense = 0;
      initialized.connection = 1.0;
      initialized.obfuscation = 0;

      //TODO: apply pre-combat relic effects

      return initialized
    }
  }
}

module.exports = GameController
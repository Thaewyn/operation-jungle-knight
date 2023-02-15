// console.log("that which does the game logic.")
const DBController = require('./db_controller');
const dbc = new DBController();

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
      console.log("submission valid");
      let result = {
        victory: false,
        gameover: false,
        defeat: false,
        actions: [
          //'actions' is basically a script for the front-end to animate, so make sure to include all required bits there.
          // {
          //   type: 'player_attack_1',
          //   skill_id: 1,
          //   target: 1, //NOTE: target is the position id of the affected enemy. 0 means 'no enemies' -1 means 'all enemies'
          //   damage: 5,
          //   defeated: false, //did this attack destroy the enemy?
          //   log_entry: "Player hit Enemy 1 with Attack 1 for 5 damage"
          // },{
          //   type: 'enemy_attack_1',
          //   enemy_skill_id: 2,
          //   source: 1, //which enemy used the skill
          //   damage: 2,
          //   defeated: false, //FIXME: do we want a distinct property name for player kill vs enemy kill?
          //   log_entry: ""
          // }
        ],
        next_turn: {
          player: {
            hp: session.player.current_hp,
            defense: session.player.current_defense,
            statuses: session.player.statuses, //both positive and negative.
            skills: session.player.software_list, //skill cooldown state.
            connection: session.player.connection,
            obfuscation: session.player.obfuscation
          },
          enemies: session.encounter.enemies
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

      let full_skill_data = [];
      for (const id of turn_data.attacks) {
        let skill = dbc.getSoftwareDetailsById(id);
        full_skill_data.push(skill);
      }

      result = this.handlePlayerHeals(result, session, full_skill_data);
      result = this.handlePlayerDefense(result, session, full_skill_data);
      result = this.handlePlayerAttacks(result, session, full_skill_data);
      result = this.handleStatusEffects(result, session, full_skill_data);
      result = this.handleEnemyAttacks(result, session, full_skill_data);
      result = this.handleCooldowns(result, session, full_skill_data);
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
       *
       * Ability effect keywords:
       * HEAL - heal player
       * DAMAGE - damage enemy
       * DEFEND - increase player defense
       */
      return result;
    } else {
      console.log("submission invalid, return false");
      //invalid, return something?
      return false
    }
  }

  validateTurnSubmission(session, player_submission){
    // console.log("gc.validateTurnSubmission");
    // TODO: make sure the player is not submitting more actions than they can do
    let max_attacks_per_turn = 3; //FIXME: arbitrary number, pull from session data?
    if (player_submission.attacks.length > max_attacks_per_turn) {
      return false;
    } else if (player_submission.attacks.length > 0) {
      for (const sub_id of player_submission.attacks) {
        //console.log("player attack validation id: "+sub_id);
        let is_valid = false;
        session.player.software_list.forEach(item => {
          if(item.id == sub_id && item.cooldown == 0) {
            is_valid = true
            //continue? break?
          }
        });
        if(!is_valid) {
          // console.log("did not find a valid match for id "+sub_id);
          return false;
        }
      }
      // console.log("all submitted ids appear valid")
      return true;
    }
    //return false;
  }

  handlePlayerHeals(resultobj, session, skill_data){
    //console.log("gc.handlePlayerHeals");
    // make a copy of the result object
    let newresult = resultobj;
    // go through the player submission and see if there are any heal skills
    let heal_skill_list = [];
    for (const skill of skill_data) {
      if (skill.effect == "HEAL") {
        heal_skill_list.push(skill);
      }
    }
    //console.log(heal_skill_list);
    //if there are none, return newresult, otherwise unchanged
    if(heal_skill_list.length == 0) {
      return newresult;
    } else {
      // if there are heal abilities, iterate through each, and apply their heals
      // pull out values for player current hp, player max hp
      // let cur_hp = session.player.current_hp;
      // let max_hp = session.player.max_hp;
      for (const skill of heal_skill_list) {
        if (skill.targets == "SELF") {
          newresult.next_turn.player.hp += skill.power //TODO: modify by connection quality
          //remove statuses if any.
          for (const status of skill.status) {
            //console.log("remove status: "+status);
            // remove status from next turn player status list
            newresult.next_turn.player.statuses[status] = 0
          }
        }
        let action = {
          type: 'player_heal',
          log_entry: skill.desc
        }
        newresult.actions.push(action);
      }
      //console.log("new hp: "+newresult.next_turn.player.hp+", max hp:" +session.player.max_hp)
      if(newresult.next_turn.player.hp > session.player.max_hp) {
        newresult.next_turn.player.hp = session.player.max_hp;
      }
      // as we iterate, also apply animation 'actions' and log entries
      // once all iterations are complete, apply final hp values, and return newresult
      return newresult
    }
  }

  /**
   * HandlePlayerDefense deals with player skills affecting Defense, Connection, and Obfuscation.
   * Defense is an integer on a scale of 0-5, Connection is a float on the scale of 0-2,
   * and Obfuscation is a positive or negative integer.
   * @param {*} resultobj
   * @param {*} session
   * @param {*} submission
   * @returns
   */
  handlePlayerDefense(resultobj, session, skill_data){
    //console.log("gc.handlePlayerDefense");
    let newresult = resultobj;
    let defense_skill_list = [];
    for (const skill of skill_data) {
      if (skill.effect == "DEFEND" || skill.effect == "CONNECT" || skill.effect == "OBFUSCATE") {
        defense_skill_list.push(skill);
      }
    }
    //console.log(defense_skill_list);
    //if there are none, return newresult, otherwise unchanged
    if(defense_skill_list.length == 0) {
      return newresult;
    } else {
      for(const skill of defense_skill_list) {
        //individual handlers.
        if(skill.effect == "DEFEND") {
          //handle defense, 0-5
          newresult.next_turn.player.defense += skill.power;
          if(newresult.next_turn.player.defense > 5) {
            newresult.next_turn.player.defense = 5;
          }
        } else if(skill.effect == "CONNECT") {
          //handle connection, 0-2, float
          newresult.next_turn.player.connection += skill.power;
          if(newresult.next_turn.player.connection < 0) {
            newresult.next_turn.player.connection = 0
          } else if (newresult.next_turn.player.connection > 2) {
            newresult.next_turn.player.connection = 2
          }
        } else if(skill.effect == "OBFUSCATE") {
          //handle obfuscation, -inf - inf, integer
          newresult.next_turn.player.obfuscation += skill.power;
        }
      }
      return newresult;
    }
  }

  handlePlayerAttacks(resultobj, session, skill_data){
    // check skill data for attacks
    let newresult = resultobj;
    let attack_skill_list = [];
    for (const skill of skill_data) {
      if (skill.effect == "DAMAGE") {
        attack_skill_list.push(skill);
      }
    }
    if(attack_skill_list.length == 0) {
      return newresult;
    } else {
      for(const skill of attack_skill_list) {
        //calculate outgoing damage
        let damage = 0;
        if (newresult.next_turn.player.statuses["supercharge"] > 0) {
          damage = (skill.power * newresult.next_turn.player.connection) + newresult.next_turn.player.statuses["supercharge"];
        } else {
          damage = skill.power * newresult.next_turn.player.connection;
        }
        // in favor of the player, always round up
        damage = Math.ceil(damage);
        
        let deadEnemies = 0;
        let validTargets = 0;
        let dir = null;
        if (skill.targets == "FIRST1") {
          validTargets = 1;
          dir = "forward";
        } else if (skill.targets == "FIRST2") {
          validTargets = 2;
          dir = "forward";
        } else if (skill.targets == "ALL") {
          validTargets = 50;
          dir = "forward";
        } else if (skill.targets == "LAST1") {
          validTargets = 1;
          dir = "backward";
        }
        if (dir == "forward") {
          for (const target of newresult.next_turn.enemies) {
            if(target.current_health <= 0) {
              deadEnemies += 1;
            } else if (validTargets > 0) {
              target.current_health -= damage;
              validTargets--;
              if(target.current_health <= 0) {
                deadEnemies += 1;
              }
            } else {
              break; //this only works if we're going front to back in detection
            }
          }
        } else if (dir == "backward") {
          // not refactored to for-of loop
          for (let i = newresult.next_turn.enemies.length-1; i >= 0; i--) {
            const target = newresult.next_turn.enemies[i];
            if(target.current_health <= 0) {
              deadEnemies += 1;
            } else if (validTargets > 0) {
              target.current_health -= damage;
              validTargets--;
              if(target.current_health <= 0) {
                deadEnemies += 1;
              }
            } else {
              break;
            }
          }
        }
        if(deadEnemies == newresult.next_turn.enemies.length) {
          newresult.victory = true
        }
      }
      return newresult;
    }
  }

  handleStatusEffects(resultobj, session, skill_data){
    /*
    Status effects:
    5: beneficial effects on the player
    6: beneficial effects on enemies
    7: detrimental effects on enemies
    8: detrimental effects on players

    ---
    Potential status effects
    - burn - deals (%hp) damage every turn. 
    - poison - deals damage every turn per stack, loses one stack per turn.
    - freeze - if affected by freeze, all used skills get +1 cooldown (per stack)
    - glitch - like blind. some numbers on the front end are scrambled / invisible. on until it is removed
    - override - % chance of skill activation becoming a different (valid, off cooldown) skill. one stack affects one skill use, all stacks clear at end of turn
    - supercharged - all attack skills get +1 damage per stack, decays 1 stack per turn
    - regenerate - opposite of poison. Heals 1 damage per turn per stack, decays one stack per turn
    - temporary shield - immune to 1 hit, lasts until used.
    - mist form - 50% miss chance on incoming hit, decays 1 stack per turn

    - trace handling
    */
    let newresult = resultobj;
    // iterate through player, all enemies, deal with statuses.
    let playerStatuses = Object.keys(newresult.next_turn.player.statuses)
    
    for (let i = 0; i < playerStatuses.length; i++) {
      const status = playerStatuses[i]; //'burn'
      const stacks = newresult.next_turn.player.statuses[playerStatuses[i]]; //2
      let damage = 0;
      if(stacks > 0) {
        switch (status) {
          case "burn":
            //burn handling
            damage = Math.floor(session.player.max_hp * 0.05);
            newresult.next_turn.player.hp -= damage;
            newresult.next_turn.player.statuses[playerStatuses[i]] -= 1; //reduce stacks by 1
            // add event to event list
            break;
          case "poison":
            //- deals damage every turn per stack, loses one stack per turn.
            newresult.next_turn.player.hp -= stacks;
            newresult.next_turn.player.statuses[playerStatuses[i]] -= 1; //reduce stacks by 1
            break;
          case "freeze":
            //- if affected by freeze, all used skills get +1 cooldown (per stack)
            newresult.next_turn.player.statuses[playerStatuses[i]] -= 1; //reduce stacks by 1
            break;
          case "glitch":
            //- like blind. some numbers on the front end are scrambled / invisible. on until it is removed
            // no end of turn behaviors.
            break;
          case "override":
            //- % chance of skill activation becoming a different (valid, off cooldown) skill. 
            //one stack affects one skill use, all stacks clear at end of turn
            newresult.next_turn.player.statuses[playerStatuses[i]] = 0;
            // TODO - implement later.
            break;
          case "supercharge":
            //- all attack skills get +1 damage per stack, decays 1 stack per turn
            newresult.next_turn.player.statuses[playerStatuses[i]] -= 1; //reduce stacks by 1
            break;
          case "regen":
            //- opposite of poison. Heals 1 damage per turn per stack, decays one stack per turn
            newresult.next_turn.player.hp += stacks;
            if(newresult.next_turn.player.hp > session.player.max_hp) {
              newresult.next_turn.player.hp = session.player.max_hp;
            }
            newresult.next_turn.player.statuses[playerStatuses[i]] -= 1; //reduce stacks by 1
            break;
          case "shield":
            //- immune to 1 hit, lasts until used.
            // no end of turn effects
            break;
          case "mist":
            //- 50% miss chance on incoming hit, decays 1 stack per turn
            newresult.next_turn.player.statuses[playerStatuses[i]] -= 1; //reduce stacks by 1
            break;
          case "decon":
            // -- 'debuff' as status effect, reduce player Connection stat.
            break;
          default:
            break;
        }
      }
    }
    


    return newresult;
  }

  handleEnemyAttacks(resultobj, session, skill_data){
    let newresult = resultobj;
    // console.log(newresult.next_turn.enemies);
    // console.log(session.encounter.enemies);

    for (const enemy of newresult.next_turn.enemies) {
      // const enemy = newresult.next_turn.enemies[i];
      if (enemy.current_health > 0) {
        // console.log(enemy);
        //get that enemy's current attack:
        let att = enemy.enemy_attacks[enemy.next_attack_intent];
  
        if(att.strength > 0) {
          //hit the player - advantage players, always round down.
          let damage = Math.floor(att.strength * ((5-newresult.next_turn.player.defense)/5));
          // console.log("damage = "+damage);
          newresult.next_turn.player.hp -= damage;
        }

        //apply statuses to player
        if(att.status_effects.length > 0) {
          for (const newStatus of att.status_effects) {
            if (newresult.next_turn.player.statuses[newStatus]) {
              newresult.next_turn.player.statuses[newStatus] += 1
            } else {
              newresult.next_turn.player.statuses[newStatus] = 1
            }
          }
        }

        enemy.next_attack_intent += 1;
        if(enemy.next_attack_intent >= enemy.enemy_attacks.length) {
          enemy.next_attack_intent = 0;
        }
      }
    }

    //if player hp <= 0, handle game over.
    if (newresult.next_turn.player.hp <= 0) {
      newresult.defeat = true;
    }

    return newresult;
  }

  handleCooldowns(resultobj, session, skill_data) {
    let newresult = resultobj;
    for (const skill of newresult.next_turn.player.skills) {
      skill_data.forEach( used_skill => {
        if( used_skill.id == skill.id ){
          if (newresult.next_turn.player.statuses["freeze"] > 0) {
            skill.cooldown = used_skill.cooldown + newresult.next_turn.player.statuses["freeze"];
          } else {
            skill.cooldown = used_skill.cooldown;
          }
        }
      })
      if(skill.cooldown > 0){
        skill.cooldown -= 1;
      }
    }
    return newresult;
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
      software_list:[{ //FIXME: set proper initial skill list
        id: 1,
        cooldown:0
      },{
        id: 2,
        cooldown:0
      },{
        id: 9,
        cooldown:0
      },{
        id: 7,
        cooldown:0
      }],
      hardware_list:[{
        id: 2
      }],
      statuses:{}
    }
    return playerObj;
  }

  initializePlayerForCombat(current_player) {
    //if new run, call generateDefaultPlayer, else
    if(!current_player) {
      return this.generateDefaultPlayer();
    } else {
      let initialized = current_player;
      initialized.statuses = {};
      for(const skill of initialized.software_list) {
        skill.cooldown = 0
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
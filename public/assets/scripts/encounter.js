console.log("loaded encounter page script.");

fetch("/api/encounter/data", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById("enemy_list")
  for(let i=0; i< data.length; i++) {
    let enemy = document.createElement('li');
    enemy.textContent = data[i].enemy_name;
    enemy.dataset.hp = data[i].current_health;
    list.appendChild(enemy);
  }
});

//can be fetched in parallel because they don't depend on each other.
fetch("/api/player/attacks", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById("player_attacks")
  for(let i=0; i< data.attacks.length; i++) {
    let item = document.createElement('li');
    let atk = document.createElement('label');
    //atk.classList.add("action").add("attack");
    //atk.htmlFor = 
    atk.textContent = data.attacks[i].name;
    atk.dataset.str = data.attacks[i].str;
    let chk = document.createElement("input");
    chk.type = "checkbox";
    chk.value = data.attacks[i].id;

    atk.appendChild(chk);
    item.appendChild(atk);
    list.appendChild(item);
  }
});

//set up 'attack selection' handler
document.getElementById("player_attacks").addEventListener("click", (e) => {
  //e.preventDefault();
  //if the event target is a checkbox, then handle logic.
})

document.getElementById("submit_turn").addEventListener("click", (e) => {
  e.preventDefault();
  //on submit (attempt), check to make sure the player has not exceeded the maximum
  // number of actions (3 by default)
  let list = document.querySelectorAll("#player_attacks input:checked");
  if (list.length > 3) {
    //FIXME: These should be manually constructed modals. Javascript alerts and confirms are bad.
    alert("please select fewer than 3 actions");
  } else if (list.length <= 0) {
    //FIXME: These should be manually constructed modals. Javascript alerts and confirms are bad.
    confirm("are you sure you don't want to take any actions this turn?");
  } else {
    //assume valid? or should there be a final condition here to make sure?
    let submissionData = {
      attacks: []
    }
    list.forEach((el, i) => {
      submissionData.attacks.push(el.value);
    });
    console.log("attempting to post submissiondata:");
    console.log(submissionData);
    fetch("/api/encounter/turn",{
      method: "POST",
      body: submissionData
    }).then(res => res.json())
    .then(data => {
      console.log("turn submitted, got response from the server:");
      console.log(data);
      handleTurnResults(data);
    });
  }
})

function handleTurnResults(api_data) {
  let thingsToAnimate = api_data.data.actions;
  let statusToUpdate = api_data.data.next_turn;
  if (api_data.data.victory) {
    //what do we do when the player wins?
    //display modal with victory message
    displayModal("You Win!")
    if(api_data.data.gameover) {
      // player has won the entire run
      document.querySelector(".modal .runcomplete").style.display = "block";
    } else {
      document.querySelector(".modal .victory").style.display = "block";
    }
  } else if (api_data.data.defeat) {
    //what do we do when the player loses?
  }
}
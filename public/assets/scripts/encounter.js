console.log("loaded encounter page script.");

fetch("/api/encounter/data", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById("enemy_list")
  for(let i=0; i< data.ice.length; i++) {
    let enemy = document.createElement('li');
    enemy.textContent = data.ice[i].name;
    enemy.dataset.hp = data.ice[i].hp;
    list.appendChild(enemy);
  }
});

fetch("/api/player/attacks", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById("player_attacks")
  for(let i=0; i< data.attacks.length; i++) {
    let atk = document.createElement('li');
    atk.textContent = data.attacks[i].name;
    atk.dataset.str = data.attacks[i].str;
    list.appendChild(atk);
    // let ice = document.createElement('li');
    // ice.innerText(data.ice[i].name);
    // ice.dataset.hp = data.ice[i].hp;
    // list.appendChild(ice);
  }
});
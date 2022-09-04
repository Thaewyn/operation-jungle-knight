console.log("loaded rewards page script file.")

fetch("/api/encounter/rewards", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.querySelector("#reward_items");
  for(let i=0; i< data.items.length; i++) {
    let item = document.createElement('li');
    let link = document.createElement('a');
    link.textContent = data.items[i].name;
    link.dataset.itemid = data.items[i].id;
    link.href = "/api/encounter/rewards/"+data.items[i].id;
    link.setAttribute("id", "reward_choice");
    item.appendChild(link);
    item.dataset.type = data.items[i].type;
    list.appendChild(item);
  }
});

document.querySelector("#reward_items").addEventListener("click", (e) => {
  // console.log(e.target.href);
  if(e.target.href) {
    e.preventDefault();
    fetch(e.target.href, {
      method: "POST",
      body: {
        itemid: e.target.dataset.itemid
      }
    }).then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.status == "success") {
        //redirect to encounter select screen
        window.location.href = "/run/server";
      } else {
        // popup error message, request new selection.
      }
    });
  }
})
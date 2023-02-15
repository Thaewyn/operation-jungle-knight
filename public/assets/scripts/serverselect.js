console.log("server select page!");

fetch("/api/server/data", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById('server_options');

  for(const server in data) {
    let obj = data[server];
    let item = document.createElement('li');
    let link = document.createElement('a');
    link.setAttribute('href','/api/server/'+obj.id)
    link.setAttribute('id', 'server_option');
    link.classList.add('option');
    let displayname = server;
    if (obj.elite) {
      displayname += " (ELITE)";
    }
    link.textContent = displayname + " - " + obj.loot_type;
    link.dataset.id = obj.id;
    item.appendChild(link);
    list.appendChild(item);
  }

})
.catch(err => {
  console.log(err);
});

let picker = document.getElementById('server_options');
picker.addEventListener('click',(e) => {
  e.preventDefault();
  // console.log(e.target);
  if(e.target.dataset.id) {
    fetch("/api/run/server/"+e.target.dataset.id, {
      method: "POST"
    }).then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.success) {
        window.location = "/run/encounter";
      } else {
        console.log(data.msg);
      }
    });
  }
})
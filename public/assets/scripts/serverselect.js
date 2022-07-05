console.log("server select page!");

fetch("/api/server/data", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById('server_options');

  for(server in data) {
    let item = document.createElement('li');
    let link = document.createElement('a');
    link.setAttribute('href','/api/server/'+data[server].id)
    link.textContent = server;
    link.dataset.id = data[server].id;
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
  console.log(e.target);
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
})
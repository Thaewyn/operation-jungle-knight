console.log("server select page!");

fetch("/api/server/data", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById('server_options');
  let item1 = document.createElement('li');
  let link1 = document.createElement('a');
  link1.setAttribute('href','/api/server/'+data.server1.id)
  link1.textContent = data.server1.name;
  link1.dataset.id = data.server1.id;
  item1.appendChild(link1);
  list.appendChild(item1);
  let item2 = document.createElement('li');
  let link2 = document.createElement('a');
  link2.setAttribute('href','/api/server/'+data.server2.id)
  link2.textContent = data.server2.name;
  link2.dataset.id = data.server2.id;
  item2.appendChild(link2);
  list.appendChild(item2);
  let item3 = document.createElement('li');
  let link3 = document.createElement('a');
  link3.setAttribute('href','/api/server/'+data.server3.id)
  link3.textContent = data.server3.name;
  link3.dataset.id = data.server3.id;
  item3.appendChild(link3);
  list.appendChild(item3);
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
    window.location = "/run/encounter";
  });
})
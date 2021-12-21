console.log("server select page!");

fetch("/api/server/data", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
  let list = document.getElementById('server_options');
  let item1 = document.createElement('li');
  item1.textContent = data.server1.name
  list.appendChild(item1);
  let item2 = document.createElement('li');
  item2.textContent = data.server2.name
  list.appendChild(item2);
  let item3 = document.createElement('li');
  item3.textContent = data.server3.name
  list.appendChild(item3);
})
.catch(err => {
  console.log(err);
})
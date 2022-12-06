console.log("loaded runover.js");

fetch("/api/gameover", {
  method:"GET"
}).then(res => res.json())
.then(data => {
  console.log(data);
});
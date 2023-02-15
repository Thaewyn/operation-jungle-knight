//console.log("loaded menu.js");

fetch("/api/runstatus", {
  method: "GET"
}).then(res => res.json())
.then(data => {
  if (data.active) {
    //console.log("has active run");

    let link = document.createElement("a");
    link.href = "/run";
    link.textContent = "Continue Run";
    link.classList.add("option");
    let item = document.createElement("li");
    item.appendChild(link);
    document.querySelector(".run_menu").appendChild(item);

    //FIXME: need 'abandon run' functionality
    let link2 = document.createElement("a");
    link2.href = "#";
    link2.textContent = "Abandon Run";
    link2.classList.add("option");
    let item2 = document.createElement("li");
    item2.appendChild(link2);
    document.querySelector(".run_menu").appendChild(item2);

    link2.addEventListener('click', (e) => {
      e.preventDefault();
      // console.log("show the modal for confirm abandon.");
      displayModal();
    })

  } else {
    //console.log("no active run.");
    let link = document.createElement("a");
    link.href = "/run";
    link.textContent = "Start New Run";
    let item = document.createElement("li");
    item.appendChild(link);
    link.classList.add("option");
    document.querySelector(".run_menu").appendChild(item);
  }
});

document.querySelector("#abandonlink").addEventListener('click', e => {
  e.preventDefault();
  //user clicked on 'yes' to abandon run.
  fetch("/api/run/abandon", {
    method: "POST"
  }).then(res => res.json())
  .then(data => {
    if(data.deleted) {
      console.log("deleted runid successfully, load /run page?");
      window.location.reload();
    }
  });
})
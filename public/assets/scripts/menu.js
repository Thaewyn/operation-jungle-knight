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
    let item = document.createElement("li");
    item.appendChild(link);
    document.querySelector(".run_menu").appendChild(item);

    //FIXME: need 'abandon run' functionality
    // let link2 = document.createElement("a");
    // link2.href = "/run";
    // link2.textContent = "Abandon Run";
    // let item2 = document.createElement("li");
    // item2.appendChild(link2);
    // document.querySelector(".run_menu").appendChild(item2);

  } else {
    //console.log("no active run.");
    let link = document.createElement("a");
    link.href = "/run";
    link.textContent = "Start New Run";
    let item = document.createElement("li");
    item.appendChild(link);
    document.querySelector(".run_menu").appendChild(item);
  }
});
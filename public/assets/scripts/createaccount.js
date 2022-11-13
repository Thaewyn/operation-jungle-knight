// console.log("loaded createaccount.js")
function displayModal(message) {
  document.querySelector(".lightbox").style.display = "flex";
  if (message) {
    document.querySelector(".modal > .msg").textContent = message;
  }
}

document.querySelector("#go_home_button")?.addEventListener("click", (e) => {
  window.location.href = "/";
});

document.querySelector(".closebutton > a")?.addEventListener("click", (e) => {
  e.preventDefault();
  hideModal();
});

function hideModal() {
  document.querySelector(".lightbox").style.display = "none";
}

document.querySelector("#createform").addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    user: "",
    email: "",
    pass: "",
  };

  for (let i = 0; i < e.target.children.length; i++) {
    let el = e.target.children[i];
    if (el.type == "text") {
      data.user = el.value;
    } else if (el.type == "email") {
      data.email = el.value;
    } else if (el.type == "password") {
      data.pass = el.value;
    }
  }

  let str = JSON.stringify(data);

  if (data.user && data.pass) {
    fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: str,
    })
      .then((res) => {
        res.json();
        if (res.status === 200) {
          window.location.href = "/menu";
        } else {
          displayModal("Account creation failed!");
          document.querySelector("input[name='password']").value = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

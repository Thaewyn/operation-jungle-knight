// console.log("loaded createaccount.js")

document.querySelector("#createform").addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    user: "",
    email: "",
    pass: ""
  }
  
  for (let i = 0; i < e.target.children.length; i++) {
    let el = e.target.children[i];
    if (el.type == "text") {
      data.user = el.value
    } else if (el.type == "email") {
      data.email = el.value
    } else if (el.type == "password") {
      data.pass = el.value
    }
  }

  let str = JSON.stringify(data)

  if (data.user && data.pass) {
    fetch("/api/user/create",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: str
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log("success")
      // console.log(data);
    })
    .catch((err) => {
      // console.error("Error: "+err);
    })
  }
})
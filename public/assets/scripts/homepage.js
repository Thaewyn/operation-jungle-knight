console.log("successfully loaded homepage.js");

document.querySelector("#loginlink").addEventListener("click", (e) => {
  e.preventDefault()

  console.log("clicked login link");
  displayModal("Please log in:");
});

document.querySelector("#loginform").addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("submitted form");
  // console.log(e.target);

  let data = {
    user: "",
    pass: ""
  }
  
  for (let i = 0; i < e.target.children.length; i++) {
    let el = e.target.children[i];
    // console.log(el.type)
    if (el.type == "text") {
      data.user = el.value
    } else if (el.type == "email") {
      data.email = el.value
    } else if (el.type == "password") {
      // console.log("get password?");
      // console.log(el)
      data.pass = el.value
    }
  }

  console.log(data);

  let str = JSON.stringify(data)

  if (data.user && data.pass) {
    fetch("/api/login",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: str
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if(data.success) {
        //window.location.reload();
        window.location.href = "/menu";
      } else {
        //error?
        document.querySelector(".modal > .msg").innerHTML = "<span class='redalert'>Login credentials incorrect, please try again</span>";
      }
    })
    .catch((err) => {
      console.error("Error: "+err);
    })
  }
})
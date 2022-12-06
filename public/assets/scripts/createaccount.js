document.querySelector("#go_home_button")?.addEventListener("click", (e) => {
  window.location.href = "/";
});

document.querySelector("#createform").addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    user: "",
    email: "",
    pass: "",
  };

  for (const el of e.target.children) {
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

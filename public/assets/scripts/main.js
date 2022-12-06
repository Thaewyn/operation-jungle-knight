function displayModal(message) {
  document.querySelector(".lightbox").style.display = "flex"
  if (message) {
    document.querySelector(".modal > .msg").textContent = message;
  }
}

function hideModal() {
  document.querySelector(".lightbox").style.display = "none"
}

(function() {
  console.log("loaded main.js frontend.");

  document.querySelector(".closebutton > a")?.addEventListener("click", (e) => {
    e.preventDefault();
    hideModal();
  })

  document.querySelector("#logoutlink")?.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("/api/logout", {
      method: "POST",
      body: "{}"
    }).then(res => {
      console.log(res);
      window.location.href = "/";
    })
    .catch(err => {
      console.log(err);
    });
  });

})();
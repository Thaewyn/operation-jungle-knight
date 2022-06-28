console.log("loaded main.js frontend.");

function displayModal(message) {
  document.querySelector(".lightbox").style.display = "flex"
  if (message) {
    document.querySelector(".modal > .msg").textContent = message;
  }
}

function hideModal() {
  document.querySelector(".lightbox").style.display = "none"
}

document.querySelector(".closebutton > a")?.addEventListener("click", (e) => {
  e.preventDefault();
  hideModal();
})
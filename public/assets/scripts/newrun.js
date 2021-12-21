console.log("new run page.")

document.querySelector("#start_run").addEventListener('click', (e) => {
  e.preventDefault();
  console.log("clicked 'start run'");
  let runseed = document.querySelector("#run_seed").value;
  console.log(runseed);
  let reqbody = JSON.stringify({
    seed: runseed || ''
  })
  fetch('/api/newrun', {
    method: 'POST',
    body: reqbody,
    headers: {'Content-Type': 'application/json'}
  })
  .then((res) => res.json())
  .then((data) => {
    if(data.success) {
      window.location.reload();
    } else {
      //error?
    }
  })
  .catch((err) => {
    console.error("Error: "+err);
  })
})
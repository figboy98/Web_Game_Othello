const urlBase = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var tmp; 

function register(nick, pass){

  const url = urlBase + "register";
  console.log(url);
  const inputData = {"nick": nick, "pass": pass};
  postData(url, inputData)
  .then(data => {
    console.log(JSON.stringify(data));
    if(data.error != undefined)
    {
      console.log(data.error);
      tmp = document.getElementById("winner");
      tmp.innerHTML = data.error;
    }
    else
    {
      var x = document.getElementById("popUpDiv");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
  })
  .catch(console.log);
}


function postData(url, data = {}){
  return fetch(url, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .catch(console.log);
}


var flag;
var groupId, usrNick,passwd;



function loginForm(){
  usrNick = document.getElementById("uname").value;
  passwd  = document.getElementById("pass").value;
  flag=false;
  register(usrNick,passwd);
}


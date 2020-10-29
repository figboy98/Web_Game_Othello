
function openMenu(element){
    document.getElementById(element).style.width="100%";
    document.getElementById(element).style.overflowY="scroll";
    document.getElementById("copy").style.visibility = "hidden";
    document.body.style.overflowY = 'hidden';
    console.log(element + " is now visible");
}


function closeMenu(element){
    document.getElementById(element).style.width="0%";
    document.getElementById(element).style.overflowY="hidden";
    document.getElementById("copy").style.visibility = "visible";
    document.body.style.overflowY = 'visible';
    console.log(element + "is now hidden");
}
/* Login functions */
function showLogin(){
    document.getElementById('login-form').style.display='block';
}
function hideLogin(){
    document.getElementById('login-form').style.display='none';
}

function showRegister(){
    hideLogin();
    document.getElementById('singup-form').style.display='block';
}
function hideRegister(){
    document.getElementById('singup-form').style.display='none';
}


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

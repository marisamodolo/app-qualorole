
const modalOne = document.getElementById("myModal");
const btn = document.getElementById("eventModal");
const spanOne = document.getElementById("close");

btn.addEventListener('click', ()=>{
  modalOne.style.display = "block";    
});

spanOne.addEventListener('click', ()=>{
    modalOne.style.display = "none";    
});

window.onclick = function(event) {
  if (event.target == modalOne) {
    modalOne.style.display = "none";
  }
}


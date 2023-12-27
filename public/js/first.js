const delayedDiv=document.getElementById("delay");

window.addEventListener("load",function(){
    
    setTimeout(function(){
       delayedDiv.classList.remove("delay");
       delayedDiv.classList.add("slow-transition");
      
    },7000);
    
   
});
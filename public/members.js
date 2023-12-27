const image=document.querySelectorAll("img");
const title=document.getElementById("pageTitle");
const myImg=document.getElementById("myImage");
// for(var i=0; i<image.length; i++){
//  image[i].addEventListener("click",function(){
//     image[i].style.transform='rotate(45deg)';
//  });
// };
image.forEach(function(e){
e.addEventListener("click",function(){
    // e.style.opacity="0.5";
    // e.classList.toggle("rotateAnim");
    e.classList.toggle("rotate");
    title.classList.toggle("anim");
})
});
window.addEventListener("load",function(){
    var divs=document.querySelectorAll("div");
    var head=this.document.querySelectorAll("h5");
    var hojii=this.document.querySelectorAll(".work");
    var detail=this.document.querySelectorAll(".detail");
    var delay=0;
    var headD=4;
    var hojiD=8;
    var detailD=10;
    divs.forEach(function(div){
        div.style.animationDelay= delay + "s";
        delay = delay + 0.5;
    });
    head.forEach(function(head){
        head.style.animationDelay=headD + "s";
        headD+=1;
    });
    hojii.forEach(function(hoji){
        hoji.style.animationDelay= hojiD+"s";
        hojiD+=0.3;
    });
    detail.forEach(function(dtl){
        dtl.style.animationDelay=detailD + "s";
        detailD+=0.5;
    });

});
 

 
console.log(image);
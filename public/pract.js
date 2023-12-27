const api="15a09bc961229e6b15d3d2e16680336c";
const endPoint="https://api.openweathermap.org/data/2.5/weather?";


// const searchBox=document.querySelector(".search-box");
// searchBox.addEventListener("keypress",setQuery);
// function setQuery(evt){
//     if(evt.key == "Enter"){
       
//         getresults(searchBox.value);
//     }
// }
 
  

 function getresults(magaalaa){
    // try {
    //    const resp= await fetch(`${endPoint}q=${magaalaa}&units=metric&appid=${api}`)
        //   .then(response => response.json())
        // console.log(resp);
        //   .then(console.log("hi"));
        //   .then(displayResults)
        //   .catch(error => {
    
    // console.error('Error:', error);
//   });
        // const resp = await fetch(`${endPoint}q=${magaalaa}&units=metric&appid=${api}`)
    //   } catch (error) {
        // TypeError: Failed to fetch
        // console.error('There was an error', error);
    //   }
    fetch(`${endPoint}q=${magaalaa}&units=metric&appid=${api}`)
          .then(response => response.json())
          .then(displayResults);
          }
//           .catch(error => {
    
//     console.error('Error:', error);
//   });
// }
function displayResults(response){
    // console.log(response);
    if(response.name === "Addis Ababa"){
        console.log("hambaa");
        let city=document.querySelector(".location .city");
        city.innerHTML=`Finfinnee, ${response.sys.country}`;
    }
    else{
        let city=document.querySelector(".location .city");
        city.innerHTML=`${response.name}, ${response.sys.country}`;
    }
    // searchBox.value="";
    let now= new Date();
    let date=document.querySelector(".location .date");
    date.innerText=datebuilder(now);
    let temp=document.querySelector(".current .temp");
    temp.innerHTML=` ${Math.round(response.main.temp)}<span>&#8451;</span>`;
    let weather=document.querySelector(".current .weather");
    weather.innerText=`${response.weather[0].main}`;

}
function datebuilder(d){
    let months =["january","february","march","april","may","june","july",
"august","september","october","november","december"];
    let days =["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    let day=days[d.getDay()];
    let date=d.getDate();
    let month=months[d.getMonth()];
    let year=d.getFullYear();

    return `${day} ${date} ${month} ${year}`; 

}
function visi(){
    const app=document.querySelector(".app-container");
    app.classList.add("visible");
}
function executeForFiveSeconds() {
    const startTime = Date.now(); // Get the current time in milliseconds
    const toggleButton = document.getElementById('toggleButton');
  
    // Run the function every 100 milliseconds (adjust as needed)
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setInterval(function() {
        toggleButton.classList.toggle('on');
        toggleButton.classList.toggle('off');
      }, 2500);  // Get the current time
      
      // Check if 5 seconds (5000 milliseconds) have elapsed
      if (currentTime - startTime >= 5000) {
        clearInterval(interval);
         // Stop the interval
        console.log('Function stopped after 5 seconds.');
      }
    }, 5000); // Interval duration in milliseconds (100ms = 0.1 seconds)
  }
  function animateText() {
    var animatedText = document.querySelector('.animate-text');
    var animatedText2=document.querySelector(".animate-text-h1");
    var buttonAnim=document.querySelector(".btn-animate");
     animatedText.style.opacity = '1';
     animatedText.style.transform = 'translateY(0)';
     buttonAnim.style.opacity = '1';
     buttonAnim.style.transform = 'translateY(0)';
     animatedText2.style.transform="translateX(0)";
     animatedText2.style.opacity = '1';
   }
   function displayBody(){
    document.body.style.display="block";
   }
   function addClassBasedOnScreenSize() {
    var element = document.getElementById('myElement');
    if (window.matchMedia('(max-width: 1140px)').matches) {
      // If the screen size is smaller than or equal to 768px, add the class
      element.setAttribute("class","dropend");
    }
    else{
        var currentValue=element.getAttribute("class");
        element.removeAttribute("class");
        currentValue="nav-item btn-group dropdown";
        element.setAttribute("class",currentValue);

    }
  }

  // Call the function initially and add an event listener for window resize
  addClassBasedOnScreenSize(); // Call on initial page load

  // Call the function when the window is resized
  window.addEventListener('resize', addClassBasedOnScreenSize);
  
window.addEventListener("load", function(){
   
    // const timeout = setTimeout(() => {
    //     setInterval(function() {
    //         const toggleButton = document.getElementById('toggleButton');
    //         toggleButton.classList.toggle('on');
    //         toggleButton.classList.toggle('off');
    //       }, 1000);
    //     // Stop the function after 5 seconds
    //   }, 0); 
    //   setTimeout(() => {
    //     clearTimeout(timeout);
    //     console.log('Function stopped.');
    //   }, 5000); // 5000 milliseconds = 5 seconds
    displayBody();
    executeForFiveSeconds();
   getresults("Addis Ababa");
  

   // Function to trigger animation when the page is fully loaded
 
   // Trigger the animation after a slight delay to ensure the transition occurs
   setTimeout(animateText, 1000);
    
    setTimeout(visi,3000);
})


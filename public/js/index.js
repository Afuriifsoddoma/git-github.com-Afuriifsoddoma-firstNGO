window.addEventListener('load', () => {
    const text = document.querySelector('.animated-text');
    const replacementContent = document.querySelector('.replacement-content');
    const slidedisplay=document.getElementById("carouselExampleIndicators");

    setTimeout(()=>{
        text.style.display = 'block';
    },500);
  
    setTimeout(() => {
        text.style.display = 'none';
      replacementContent.style.display = 'flex';
      slidedisplay.style.display="block";
    }, 5000);
  });
  
  
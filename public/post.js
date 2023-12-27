const inputElement = document.getElementById('yourInputElementId');
const targetString = 'hello';

// Add an event listener to the input element
inputElement.addEventListener('keypress', function(event) {
    
  // Check if the pressed key is the Enter key
  if (event.key === 'Enter') {
    console.log("pressed");
    const inputValue = inputElement.value || ''; // Get value of the input element

    // Check if the input value contains the target string
    if (inputValue.includes(targetString)) {
      console.log(`The string "${targetString}" is contained in the input. Redirecting...`);
      // Redirect to another page
      window.location.href = 'http://localhost:3000/login'; // Replace with your desired URL
    }
  }
});

  
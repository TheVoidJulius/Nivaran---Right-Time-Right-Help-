// script.js - Written by [Khushbu Singh]
// Frontend Logic for Right Help, Right Time System

// Main function to handle problem submission
function submitProblem() {
  // Get references to HTML elements
  const problemInput = document.getElementById("problem");
  const resultDiv = document.getElementById("result");
  const submitButton = document.querySelector("button");
  
  // Get and clean the user's input
  const userProblem = problemInput.value.trim();
  
  // Clear any previous results
  resultDiv.innerHTML = "";
  
  // Validate input - don't send empty requests
  if (userProblem === "" || userProblem.length < 5) {
    displayError("Please describe your problem in detail (at least 5 characters).");
    return;
  }
  
  // Disable button to prevent multiple clicks
  submitButton.disabled = true;
  submitButton.textContent = "Analyzing...";
  
  // Show loading message
  displayLoading();
  
  // Prepare data to send to backend 
  const requestData = {
    problem: userProblem
  };
  
  // Send request to backend API
  sendToBackend(requestData, submitButton);
}

// Function to send data to backend
function sendToBackend(data, button) {
  fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    // Check if server responded properly
    if (!response.ok) {
      throw new Error("Server returned an error");
    }
    return response.json();
  })
  .then(result => {
    // Process the response from backend
    handleResponse(result);
    
    // Re-enable button
    button.disabled = false;
    button.textContent = "Get Help";
  })
  .catch(error => {
    // Handle errors (network issues, server down, etc.)
    handleError(error);
    
    // Re-enable button
    button.disabled = false;
    button.textContent = "Get Help";
  });
}

// Function to display loading state
function displayLoading() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <p style="color: #555; font-size: 16px;">
        🔍 Analyzing your problem...
      </p>
    </div>
  `;
}

// Function to handle successful response
function handleResponse(data) {
  const resultDiv = document.getElementById("result");
  
  // Check if problem was understood
  if (data.category === "Unknown") {
    resultDiv.innerHTML = `
      <div style="background: #fff3cd; padding: 15px; border-radius: 5px;">
        <p style="color: #856404; margin: 0;">
          ⚠️ ${data.message}
        </p>
        <p style="color: #856404; margin-top: 10px; font-size: 14px;">
          Try describing your problem differently or contact local authorities directly.
        </p>
      </div>
    `;
    return;
  }
  
  // Build the result HTML
  let resultHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="color: #28a745; margin-top: 0;">
        ✓ Category: ${data.category}
      </h3>
  `;
  
  // Add schemes section
  if (data.schemes && data.schemes.length > 0) {
    resultHTML += `
      <div style="margin: 15px 0;">
        <h4 style="color: #333;">📋 Available Schemes:</h4>
        <ul style="line-height: 1.8;">
    `;
    
    // Loop through schemes
    for (let i = 0; i < data.schemes.length; i++) {
      resultHTML += `<li>${data.schemes[i]}</li>`;
    }
    
    resultHTML += `</ul></div>`;
  }
  
  // Add steps section
  if (data.steps && data.steps.length > 0) {
    resultHTML += `
      <div style="margin: 15px 0;">
        <h4 style="color: #333;">📝 What to do next:</h4>
        <ol style="line-height: 1.8;">
    `;
    
    // Loop through steps
    for (let i = 0; i < data.steps.length; i++) {
      resultHTML += `<li>${data.steps[i]}</li>`;
    }
    
    resultHTML += `</ol></div>`;
  }
  
  // Add contact section
  if (data.contact) {
    resultHTML += `
      <div style="margin: 15px 0; padding: 10px; background: #e7f3ff; border-radius: 5px;">
        <p style="margin: 0;">
          <strong>👤 Contact:</strong> ${data.contact}
        </p>
      </div>
    `;
  }
  
  resultHTML += `</div>`;
  
  // Display the result
  resultDiv.innerHTML = resultHTML;
}

// Function to handle errors
function handleError(error) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <div style="background: #f8d7da; padding: 15px; border-radius: 5px;">
      <p style="color: #721c24; margin: 0;">
        ❌ Something went wrong. Please check:
      </p>
      <ul style="color: #721c24; margin-top: 10px;">
        <li>Is the backend server running?</li>
        <li>Is your internet connection stable?</li>
      </ul>
      <p style="color: #721c24; font-size: 14px; margin: 10px 0 0 0;">
        Error details: ${error.message}
      </p>
    </div>
  `;
  
  // Log error for debugging
  console.error("Error occurred:", error);
}

// Optional: Clear form function
function clearForm() {
  document.getElementById("problem").value = "";
  document.getElementById("result").innerHTML = "";
}
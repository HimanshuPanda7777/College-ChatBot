document.addEventListener("DOMContentLoaded", function() {
    // This function will be executed when the DOM is fully loaded
    writeLiveContent();
});

document.getElementById("message-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    var userInput = document.getElementById("message-input").value;

    // Append user message to chat
    appendMessage("User", userInput, true);

    // Send the user message to the backend for processing and receive the chatbot's response
    fetch('/answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Change content type to JSON
        },
        body: JSON.stringify({ user_question: userInput }),  // Send JSON payload
    })
    .then(response => response.json())
    .then(data => {
        // Append chatbot response to chat
        appendMessage("Chatbot", data.answer, false);
    });

    // Clear the user input field
    document.getElementById("message-input").value = "";
}

function appendMessage(sender, message, isUser) {
    var chatMessages = document.getElementById("chat-messages");

    var messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "chatbot-message";
    messageDiv.innerHTML = "<strong>" + sender + ":</strong> " + message;

    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function writeLiveContent() {
    // Get the element where you want to write the content
    var liveContentElement = document.getElementById("IamGaruda");

    // Your live content
    var liveContent = "Hello, I am Garuda. How can I help you?";

    // Clear the existing content
    liveContentElement.innerHTML = ''; // Assuming it's a div or another container

    // Split the content into letters
    var letters = liveContent.split('');

    // Initialize a counter for the letter index
    var letterIndex = 0;

    // Display letters at intervals
    function displayLetter() {
        // Append the current letter to the content
        liveContentElement.innerHTML += letters[letterIndex];

        // Move to the next letter
        letterIndex++;

        // Check if all letters have been displayed
        if (letterIndex < letters.length) {
            setTimeout(displayLetter, 70); // Schedule the next letter after a delay
        }
    }

    // Start displaying letters
    displayLetter();
}

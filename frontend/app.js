const button = document.getElementById("testButton");
const message = document.getElementById("message");
const messageInput = document.getElementById("messageInput");

button.addEventListener("click", async () => {

  const userMessage = messageInput.value;

  const response = await fetch(
    "https://jkr4rh399c.execute-api.us-east-1.amazonaws.com/messages",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: userMessage
      })
    }
  );

  const data = await response.json();

  message.textContent = data.message;
});

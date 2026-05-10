const button = document.getElementById("testButton");
const message = document.getElementById("message");
const messageInput = document.getElementById("messageInput");
const messagesList = document.getElementById("messagesList");

const apiUrl = "https://jkr4rh399c.execute-api.us-east-1.amazonaws.com";

async function loadMessages() {
  const response = await fetch(`${apiUrl}/messages`);
  const data = await response.json();

  messagesList.innerHTML = "";

  data.messages.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.message;
    messagesList.appendChild(li);
  });
}

button.addEventListener("click", async () => {
  const userMessage = messageInput.value;

  const response = await fetch(`${apiUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: userMessage
    })
  });

  const data = await response.json();

  message.textContent = data.message;
  messageInput.value = "";

  await loadMessages();
});

loadMessages();

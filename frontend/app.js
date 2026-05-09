const button = document.getElementById("testButton");
const message = document.getElementById("message");

button.addEventListener("click", async () => {

  const response = await fetch(
    "https://jkr4rh399c.execute-api.us-east-1.amazonaws.com/hello"
  );

  const data = await response.json();

  message.textContent = data.message;
});

const cognitoDomain = "https://us-east-1kcts80rzl.auth.us-east-1.amazoncognito.com";
const clientId = "7qdugdn6gq085h6belkqakbspn";
const redirectUri = "https://d2vtcezlte2dnf.cloudfront.net";

const button = document.getElementById("testButton");
const message = document.getElementById("message");
const messageInput = document.getElementById("messageInput");
const messagesList = document.getElementById("messagesList");
const logoutButton = document.getElementById("logoutButton");

const apiUrl = "https://jkr4rh399c.execute-api.us-east-1.amazonaws.com";

function getAuthHeaders() {
  const idToken = localStorage.getItem("idToken");

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${idToken}`
  };
}

async function exchangeCodeForToken(code) {
  const response = await fetch(`${cognitoDomain}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri
    })
  });

  const data = await response.json();

  if (data.id_token) {
    localStorage.setItem("idToken", data.id_token);
    window.history.replaceState({}, document.title, "/");
  }

  return data;
}

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  exchangeCodeForToken(code).then(() => {
    loadMessages();
  });
}

async function loadMessages() {
  const response = await fetch(`${apiUrl}/messages`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  messagesList.innerHTML = "";

  data.messages.forEach((item) => {
    const li = document.createElement("li");

    const messageText = document.createElement("span");
    messageText.textContent = item.message;

    messageText.addEventListener("click", () => {
      const input = document.createElement("input");
      input.value = item.message;

      li.replaceChild(input, messageText);
      input.focus();

      input.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
          await fetch(`${apiUrl}/messages/${item.id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              message: input.value
            })
          });

          await loadMessages();
        }
      });
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", async () => {
      await fetch(`${apiUrl}/messages/${item.id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      await loadMessages();
    });

    li.appendChild(messageText);
    li.appendChild(deleteButton);
    messagesList.appendChild(li);
  });
}

button.addEventListener("click", async () => {
  const userMessage = messageInput.value;

  const response = await fetch(`${apiUrl}/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message: userMessage
    })
  });

  const data = await response.json();

  message.textContent = data.message;
  messageInput.value = "";

  await loadMessages();
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("idToken");

  window.location.href =
    `${cognitoDomain}/logout?` +
    new URLSearchParams({
      client_id: clientId,
      logout_uri: redirectUri
    });
});

if (!code) {
  const idToken = localStorage.getItem("idToken");

  if (idToken) {
    loadMessages();
  } else {
    window.location.href =
      `${cognitoDomain}/login?` +
      new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        scope: "openid email",
        redirect_uri: redirectUri
      });
  }
}

let responses = {};

async function loadResponses() {
  try {
    const res = await fetch('responses.json');
    responses = await res.json();
  } catch (error) {
    console.error("Erro ao carregar responses.json", error);
  }
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message === "") return;

  appendMessage(message, "user");
  botResponse(message.toLowerCase());
  input.value = "";
}

document.getElementById("userInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

document.getElementById("sendBtn").addEventListener("click", sendMessage);

function appendMessage(text, sender) {
  const chat = document.getElementById("chat");
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;
  msgDiv.innerText = text;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

function botResponse(message) {
  const thinkingMsg = document.createElement("div");
  thinkingMsg.className = "message bot";
  thinkingMsg.id = "thinking";
  thinkingMsg.innerText = "⏳ Bot está digitando...";
  document.getElementById("chat").appendChild(thinkingMsg);
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;

  let response = responses[message] || responses["default"];

  setTimeout(() => {
    document.getElementById("thinking").remove();

    appendMessage(response, "bot");
    showQuickReplies();
  }, 800);
}

function showQuickReplies() {
  const quickReplies = document.getElementById("quick-replies");
  quickReplies.innerHTML = "";

  const options = [
    { text: "Resultados", value: "resultados" },
    { text: "Próximos Jogos", value: "próximos jogos" },
    { text: "Loja", value: "loja" },
    { text: "Time", value: "time" }
  ];

  options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.className = "quick-reply-btn";
    button.onclick = () => {
      appendMessage(option.text, "user");
      botResponse(option.value);
      quickReplies.innerHTML = "";
    };
    quickReplies.appendChild(button);
  });
}

window.onload = async () => {
  await loadResponses();
  showQuickReplies();
};

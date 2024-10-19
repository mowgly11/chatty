const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("msg");
const chattingArea = document.querySelector(".chatarea");

window.addEventListener("keypress", (e) => {
    if(e.key === "Enter") sendBtn.click();
});

sendBtn.addEventListener("click", async () => {
  let botMsgElement;
  const message = input.value;
  if (message.trim() === "") return;

  input.value = "";
  appendMessage(message, "user");

  await sleep(200);
  botMsgElement = appendMessage("...", "bot");

  let response;

  try {
    response = await getBotResponse(message);
    response = await response.json();
  } catch (err) {
    response = "Error";
  }
  
  botMsgElement.innerText = response.response;
});

function appendMessage(message, type) {
  const msgElement = document.createElement("div");
  msgElement.innerText = message;

  if (type === "user") msgElement.classList.add("userMessage");
  else msgElement.classList.add("botMessage");

  chattingArea.append(msgElement);

  return msgElement;
}

async function getBotResponse(message) {
  const botResponse = await fetch(`http://localhost:3000/response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return botResponse;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

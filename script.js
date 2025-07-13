let userName = "";
const apiKey = "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";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

function startChat() {
  const name = document.getElementById("userName").value.trim();
  if (!name) return alert("اكتب اسمك الأول!");

  userName = name;
  document.getElementById("nameArea").style.display = "none";
  chatBox.style.display = "block";
  document.getElementById("inputArea").style.display = "flex";

  addMessage(`أهلاً يا ${userName}! أنا Chat AMS، تحت أمرك!`, "bot");
}

sendBtn.onclick = async () => {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage(`${userName}: ${msg}`, "user");
  userInput.value = "";

  addMessage("جاري التفكير...", "bot");

  const reply = await getBotReply(msg);
  chatBox.lastChild.remove();
  addMessage("Chat AMS: " + reply, "bot");

  speak(reply);
};

clearBtn.onclick = () => {
  chatBox.innerHTML = "";
};

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("msg", sender);
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotReply(message) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "معذرةً، لم أستطع الرد.";
  } catch (error) {
    return "حدث خطأ في الاتصال 😢";
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  speechSynthesis.speak(utterance);
}
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const API_KEY = "AIzaSyB-lx-CkRqg3koGitXHCWpbYE9lr8No1G0";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async () => {
  const thinkingDiv = chatBody.querySelector(
    ".bot-message.thinking .message-text"
  );
  if (!thinkingDiv) return;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message },
            ...(userData.file && userData.file.data
              ? [{ inline_data: userData.file }]
              : []),
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(GEMINI_API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Lỗi API");

    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, tôi chưa trả lời được.";
    thinkingDiv.textContent = botReply;
    thinkingDiv.parentElement.classList.remove("thinking");
  } catch (error) {
    thinkingDiv.textContent = "Có lỗi khi kết nối AI!";
    thinkingDiv.parentElement.classList.remove("thinking");
  } finally {
    // Reset file sau khi gửi xong
    userData.file = {
      data: null,
      mime_type: null,
      name: null,
    };
  }
};

const handleOutgoingMessage = (e) => {
  if (e) e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";
  if (!userData.message) return;

  // Tạo nội dung tin nhắn, có thể kèm ảnh nếu userData.file.data tồn tại
  const messageContent = `
    <div class="message-text">
      ${userData.message}
      ${
        userData.file && userData.file.data
          ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
          : ""
      }
    </div>
  `;

  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Xóa file sau khi gửi (nếu muốn, để tránh gửi lại file cũ)
  userData.file = undefined;

  setTimeout(() => {
    const messageContent = `<svg class="bot-avatar" ...></svg>
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;
    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse();
  }, 600);
};

// Gửi tin nhắn khi nhấn Enter
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && messageInput.value.trim()) {
    e.preventDefault(); // Ngăn xuống dòng khi nhấn Enter
    handleOutgoingMessage(e);
  }
});

// Gửi tin nhắn khi bấm nút gửi
if (sendMessageButton) {
  sendMessageButton.addEventListener("click", handleOutgoingMessage);
}
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (!fileUploadWrapper) {
      console.error("fileUploadWrapper not found!");
      return;
    }
    const img = fileUploadWrapper.querySelector("img");
    if (img) {
      img.src = e.target.result;
      img.style.display = "block";
    }
    fileUploadWrapper.classList.add("file-uploaded");

    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };

    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});
fileCancelButton.addEventListener("click", () => {
  // 1. Xoá dữ liệu file
  userData.file = {
    data: null,
    mime_type: null,
  };
  // 2. Ẩn ảnh preview
  const img = fileUploadWrapper.querySelector("img");
  if (img) {
    img.src = "#";
    img.style.display = "none";
  }
  // 3. Xoá class file-uploaded (ẩn hiệu ứng preview)
  fileUploadWrapper.classList.remove("file-uploaded");
  // 4. Reset input file (nếu muốn chọn lại cùng 1 file)
  fileInput.value = "";
});

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());

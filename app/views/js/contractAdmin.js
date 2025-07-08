function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

function renderContacts(contacts) {
  const tbody = document.getElementById("contactTableBody");
  tbody.innerHTML = "";
  contacts.forEach((contact) => {
    // Kiểm tra đã có trả lời admin chưa (dựa vào message có chứa 'Admin:' hay không)
    const hasReply = contact.message && contact.message.includes("Admin:");
    let replyCell = "";
    if (!hasReply) {
      replyCell = `
        <form onsubmit="return sendReply(event, ${contact.contactID})">
          <input type="text" name="adminReply" placeholder="Nhập trả lời..." required style="width:120px;" />
          <button type="submit">Gửi</button>
        </form>
      `;
    } else {
      // Hiển thị toàn bộ message, xuống dòng đúng
      replyCell = `<div style='white-space:pre-line;'>${escapeHtml(
        contact.message
      )}</div>`;
    }
    tbody.innerHTML += `
      <tr>
        <td>${contact.contactID}</td>
        <td>${escapeHtml(contact.name)}</td>
        <td>${escapeHtml(contact.phone)}</td>
        <td>${escapeHtml(contact.email)}</td>
        <td>${escapeHtml(contact.serviceID)}</td>
        <td style='white-space:pre-line;'>${escapeHtml(contact.message)}</td>
        <td>${contact.created_at || ""}</td>
        <td>${replyCell}</td>
      </tr>
    `;
  });
}

function fetchContacts() {
  fetch("../../../controllers/ContactController.php?action=getAll")
    .then((res) => res.json())
    .then((result) => {
      if (!result.success) {
        document.getElementById(
          "contactTableBody"
        ).innerHTML = `<tr><td colspan='8'>${
          result.message || "Không thể tải dữ liệu!"
        }</td></tr>`;
        return;
      }
      renderContacts(result.contacts);
    })
    .catch(() => {
      document.getElementById("contactTableBody").innerHTML =
        '<tr><td colspan="8">Lỗi khi tải dữ liệu!</td></tr>';
    });
}

window.sendReply = function (event, contactID) {
  event.preventDefault();
  const form = event.target;
  const adminReply = form.adminReply.value.trim();
  if (!adminReply) return false;
  fetch("../../../controllers/ContactController.php?action=reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactID, adminReply }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        fetchContacts();
      } else {
        alert(result.message || "Trả lời thất bại!");
      }
    })
    .catch(() => alert("Lỗi khi gửi trả lời!"));
  return false;
};

document.addEventListener("DOMContentLoaded", fetchContacts);

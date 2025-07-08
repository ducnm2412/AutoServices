let realPassword = "abc123xyz";

function maskPassword(pw) {
  if (pw.length <= 3) return pw;
  return "*".repeat(pw.length - 3) + pw.slice(-3);
}

function showEditForm() {
  document.getElementById("editFullName").value = document.getElementById("fullName").textContent;
  document.getElementById("editEmail").value = document.getElementById("email").textContent;
  document.getElementById("editPhone").value = document.getElementById("phoneNumber").textContent;
  document.getElementById("editAddress").value = document.getElementById("address").textContent;

  document.getElementById("view-mode").style.display = "none";
  document.getElementById("edit-form").style.display = "block";
}

function cancelEdit() {
  document.getElementById("edit-form").style.display = "none";
  document.getElementById("view-mode").style.display = "block";
}

function submitInfo(event) {
  event.preventDefault();

  document.getElementById("fullName").textContent = document.getElementById("editFullName").value;
  document.getElementById("email").textContent = document.getElementById("editEmail").value;
  document.getElementById("phoneNumber").textContent = document.getElementById("editPhone").value;
  document.getElementById("address").textContent = document.getElementById("editAddress").value;

  cancelEdit();
}

function showPasswordForm() {
  document.getElementById("view-mode").style.display = "none";
  document.getElementById("password-form").style.display = "block";
  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
}

function cancelPasswordEdit() {
  document.getElementById("password-form").style.display = "none";
  document.getElementById("view-mode").style.display = "block";
}

function submitPassword(event) {
  event.preventDefault();

  const oldPw = document.getElementById("oldPassword").value;
  const newPw = document.getElementById("newPassword").value;

  if (oldPw !== realPassword) {
    alert("❌ Mật khẩu cũ không đúng!");
    return;
  }

  if (newPw.length < 6) {
    alert("⚠ Mật khẩu mới phải có ít nhất 6 ký tự.");
    return;
  }

  realPassword = newPw;
  document.getElementById("password").textContent = maskPassword(realPassword);
  cancelPasswordEdit();
  alert("✅ Đổi mật khẩu thành công!");
}

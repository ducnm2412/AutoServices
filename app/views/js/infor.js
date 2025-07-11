console.log("📌 infor.js đã được chạy!");

function loadInforData() {
  console.log("👉 Gọi loadInforData()");

  const userData = localStorage.getItem("user");
  const userID = localStorage.getItem("userID");
  console.log("👀 userID hiện tại:", userID);
  if (!userData) {
    console.warn("⚠️ Không tìm thấy user trong localStorage!");
    return;
  }

  const user = JSON.parse(userData);
  console.log("📥 Thông tin user:", user);

  // ✅ Hiển thị dữ liệu
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("email").textContent = user.email;
  document.getElementById("phoneNumber").textContent = user.phoneNumber;
  document.getElementById("address").textContent = user.address;
  document.getElementById("password").textContent =
    "******" + user.password.slice(-3);
}

// 👉 Hiển thị form sửa thông tin
function showEditForm() {
  document.getElementById("view-mode").style.display = "none";
  document.getElementById("edit-form").style.display = "block";

  // 👉 Lấy dữ liệu hiện tại để điền sẵn vào form
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("editFullName").value = user.name;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPhone").value = user.phoneNumber;
  document.getElementById("editAddress").value = user.address;
}

// 👉 Hủy chỉnh sửa
function cancelEdit() {
  document.getElementById("edit-form").style.display = "none";
  document.getElementById("view-mode").style.display = "block";
}

// 👉 Hiển thị form đổi mật khẩu
function showPasswordForm() {
  document.getElementById("view-mode").style.display = "none";
  document.getElementById("password-form").style.display = "block";
}

// 👉 Hủy đổi mật khẩu
function cancelPasswordEdit() {
  document.getElementById("password-form").style.display = "none";
  document.getElementById("view-mode").style.display = "block";
}

// 👉 Gửi dữ liệu khi sửa thông tin (viết xử lý gửi API tại đây nếu có)
// function submitInfo(e) {
//   e.preventDefault();

//   const updatedUser = {
//     ...JSON.parse(localStorage.getItem("user")),
//     name: document.getElementById("editFullName").value,
//     email: document.getElementById("editEmail").value,
//     phoneNumber: document.getElementById("editPhone").value,
//     address: document.getElementById("editAddress").value,
//   };

//   // ✅ Cập nhật localStorage
//   localStorage.setItem("user", JSON.stringify(updatedUser));

//   alert("Thông tin đã được cập nhật!");

//   // ✅ Reload lại thông tin
//   document.getElementById("view-mode").style.display = "block";
//   document.getElementById("edit-form").style.display = "none";

//   // Hiển thị lại dữ liệu mới
//   document.getElementById("user-name").textContent = updatedUser.name;
//   document.getElementById("email").textContent = updatedUser.email;
//   document.getElementById("phoneNumber").textContent = updatedUser.phoneNumber;
//   document.getElementById("address").textContent = updatedUser.address;
// }

function submitInfo(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user.userID;

  const updatedUser = {
    name: document.getElementById("editFullName").value,
    email: document.getElementById("editEmail").value,
    phoneNumber: document.getElementById("editPhone").value,
    address: document.getElementById("editAddress").value,
  };

  fetch(
    `/laptrinhweb/AutoServices/app/controllers/UserController.php?action=updateProfile&userID=${userID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Cập nhật thông tin thành công!",
          timer: 1800,
          showConfirmButton: false,
        });
        // ✅ Cập nhật lại localStorage
        const newUser = {
          ...user,
          ...updatedUser,
        };
        localStorage.setItem("user", JSON.stringify(newUser));

        // ✅ Hiển thị lại dữ liệu
        document.getElementById("user-name").textContent = newUser.name;
        document.getElementById("email").textContent = newUser.email;
        document.getElementById("phoneNumber").textContent =
          newUser.phoneNumber;
        document.getElementById("address").textContent = newUser.address;

        // ✅ Đóng form
        document.getElementById("view-mode").style.display = "block";
        document.getElementById("edit-form").style.display = "none";
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: data.message || "Cập nhật thất bại!",
        });
      }
    })
    .catch((err) => {
      console.error("Lỗi:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối đến server!",
      });
    });
}

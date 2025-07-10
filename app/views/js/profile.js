
// function loadPage(page) {
//   fetch(`${page}.html`)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("main-content").innerHTML = html;
//       loadPageStyle(`../css/${page}.css`);

//       // Gọi hàm JS tương ứng
//       if (page === "infor" && typeof loadInforData === "function") {
//         // Đợi DOM render xong
//         setTimeout(() => {
//           loadInforData();
//         }, 50);
//       }
//     })
//     .catch(err => {
//       document.getElementById("main-content").innerHTML =
//         `<p style="color:red">Không thể tải ${page}</p>`;
//     });
// }
function loadPage(page) {
  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      loadPageStyle(`../css/${page}.css`);

      // ⏳ Chờ DOM render xong rồi gọi hàm tương ứng
      setTimeout(() => {
        if (page === "infor" && typeof loadInforData === "function") {
          loadInforData();
        } else if (page === "feedback" && typeof initFeedback === "function") {
          initFeedback(); // 💥 GỌI HÀM Ở ĐÂY
        }
      }, 50); // Cho browser thời gian render DOM
    })
    .catch(err => {
      document.getElementById("main-content").innerHTML =
        `<p style="color:red">Không thể tải ${page}</p>`;
    });
}




function loadPageStyle(cssPath) {
  const old = document.getElementById("page-style");
  if (old) old.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssPath;
  link.id = "page-style";
  document.head.appendChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage("infor"); // Load mặc định
});



fetch("/laptrinhweb/AutoServices/app/controllers/auth.php?action=getCurrentUser", {
    method: "GET",
    credentials: "include" // 🔑 Gửi cookie PHPSESSID
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        document.getElementById("userName").textContent = data.user.name;

        // 👇 Hiển thị vai trò
        const roleText = data.user.role === "admin" ? "Quản Trị viên" : "Khách hàng";
        document.getElementById("userRole").textContent = roleText;

    } else {
        alert("Bạn chưa đăng nhập. Chuyển hướng...");
        window.location.href = "/laptrinhweb/login.html";
    }
})
.catch(err => {
    console.error("Lỗi khi gọi getCurrentUser:", err);
});

function showLogoutConfirm() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="logout-confirm" style="text-align:center; margin-top: 40px;">
      <p style="font-size:18px;">Bạn có chắc chắn muốn đăng xuất?</p>
      <button onclick="performLogout()" style="margin:10px; padding:8px 16px;">Đồng ý</button>
      <button onclick="cancelLogout()" style="margin:10px; padding:8px 16px;">Hủy</button>
    </div>
  `;
}

function performLogout() {
  fetch("/laptrinhweb/AutoServices/app/controllers/auth.php?action=logout", {
    method: "POST",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message || "Đăng xuất thành công!");
        localStorage.clear();
        // 🔁 Quay về trang chủ
        window.location.href = "/laptrinhweb/AutoServices/index.html";
      } else {
        alert("Đăng xuất thất bại.");
      }
    })
    .catch(err => {
      console.error("❌ Lỗi khi đăng xuất:", err);
      alert("Không thể kết nối đến server.");
    });
}

function cancelLogout() {
  // Reload lại trang profile.html
  window.location.href = "/laptrinhweb/AutoServices/app/views/html/profile.html";
}
document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.querySelector('a[href="#logout"]');
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      showLogoutConfirm();
    });
  }
});

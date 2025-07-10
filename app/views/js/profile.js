function loadPage(page) {
  fetch(`${page}.html`)  // Vì đã ở trong html/, không cần thêm html/
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      loadPageStyle(`../css/${page}.css`);  // css nằm ngoài html/
    })
    .catch(err => {
      document.getElementById("main-content").innerHTML = `<p style="color:red">Không thể tải ${page}</p>`;
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
  loadPage('infor'); // Mặc định
});


//
// document.addEventListener("DOMContentLoaded", () => {
//   const name = localStorage.getItem("name");
//   const role = localStorage.getItem("role");
//   const userId = localStorage.getItem("userId");

//   if (!name || !userId) {
//     alert("Bạn chưa đăng nhập!");
//     window.location.href = "login.html"; // Chuyển về trang đăng nhập nếu cần
//     return;
//   }

//   // Gán vào giao diện
//   document.getElementById("user-name").textContent = name;
//   document.getElementById("user-role").textContent = role;
// });

// const userId = localStorage.getItem("userId");
// fetch(`/laptrinhweb/AutoServices/app/controllers/UserController.php?action=getProfile&userID=${userId}`)
//   .then(res => res.json())
//   .then(data => {
//     if (data.success) {
//       const user = data.user;
//       document.getElementById("fullName").textContent = user.name;
//       document.getElementById("email").textContent = user.email;
//       document.getElementById("phoneNumber").textContent = user.phoneNumber;
//       document.getElementById("address").textContent = user.address;
//     } else {
//       alert(data.message);
//     }
//   });

let typed = null;

function runTyped() {
  // Hủy nếu đã có instance trước đó
  if (typed) {
    typed.destroy();
  }

  // Tìm phần tử .simple-text trong slide đang active
  const currentItem = items[active];
  const simpleText = currentItem.querySelector(".simple-text");

  if (simpleText) {
    typed = new Typed(simpleText, {
      strings: ["Services"],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });
  }
}

let listHome = document.querySelector(".slider-home .list");
let items = document.querySelectorAll(".slider-home .list .item");
let dots = document.querySelectorAll(".slider-home .dots li");
let prev = document.getElementById("prev");
let next = document.getElementById("next");

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function () {
  if (active + 1 > lengthItems) {
    active = 0;
  } else {
    active = active + 1;
  }
  reLoadSlider();
};

prev.onclick = function () {
  if (active - 1 < 0) {
    active = lengthItems;
  } else {
    active = active - 1;
  }
  reLoadSlider();
};
let refreshSlider = setInterval(() => {
  next.click();
}, 3000);
function reLoadSlider() {
  let offset = items[active].offsetLeft;
  listHome.style.transform = `translateX(-${offset}px)`;

  let lastActiveDot = document.querySelector(".slider-home .dots li.active");
  lastActiveDot.classList.remove("active");
  dots[active].classList.add("active");
  clearInterval(refreshSlider);
  refreshSlider = setInterval(() => {
    next.click();
  }, 3000);
  runTyped();
}

dots.forEach((li, key) => {
  li.addEventListener("click", function () {
    active = key;
    reLoadSlider();
  });
});

// Dừng slider nếu không nhìn thấy slider-home
window.addEventListener("scroll", () => {
  const slider = document.querySelector(".slider-home");
  const rect = slider.getBoundingClientRect();

  // Nếu slider không còn trong vùng hiển thị → dừng auto slide
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    clearInterval(refreshSlider);
  } else {
    if (!refreshSlider) {
      refreshSlider = setInterval(() => {
        next.click();
      }, 3000);
    }
  }
});
const menuBtn = document.querySelector(".btn-menu");
const closeBtn = document.querySelector(".btn-close");
const navBg = document.querySelector(".nav-bg");

menuBtn.addEventListener("click", function () {
  navBg.classList.add("active");
});

closeBtn.addEventListener("click", function () {
  navBg.classList.remove("active");
});
/*products-cart*/
let allProducts = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "/laptrinhweb/AutoServices/app/controllers/PartController.php?action=getAll"
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        allProducts = data.parts;

        // ✅ Hiển thị mặc định sản phẩm Lốp (pcat02)
        const defaultCategory = "pcat02";
        const filtered = allProducts.filter(
          (p) => p.categoryID === defaultCategory
        );
        renderProducts(filtered);

        // ✅ Đặt nút "Lốp" là active (nếu chưa)
        const defaultBtn = document.querySelector('[data-category="lop"]');
        if (defaultBtn) {
          document.querySelector(".tab-btn.active")?.classList.remove("active");
          defaultBtn.classList.add("active");
        }
      } else {
        console.error("Lỗi lấy danh sách sản phẩm");
      }
    })
    .catch((error) => {
      console.error("Lỗi kết nối API:", error);
    });

  // Gắn sự kiện click cho các tab
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".tab-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      let filtered = [];

      if (category === "lop") {
        filtered = allProducts.filter((p) => p.categoryID === "pcat02");
      } else if (category === "acquy") {
        filtered = allProducts.filter((p) => p.categoryID === "pcat03");
      } else {
        filtered = allProducts.filter(
          (p) => p.categoryID !== "pcat02" && p.categoryID !== "pcat03"
        );
      }

      renderProducts(filtered);
      setupBuyButtons();
    });
  });
});

function renderProducts(products) {
  const productList = document.querySelector(".product-list");
  productList.innerHTML = "";

  const limitedProducts = products.slice(0, 4);

  limitedProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images}" alt="${product.name}" />
      <p>${product.name}</p>
      <p><span>Giá:</span> ${Number(product.price).toLocaleString()}₫</p>
      <div class="cart">
        <button class="btn-buy"
          data-name="${product.name}"
          data-price="${product.price}"
          data-img="${product.images}">
          Mua
        </button>
        <button>Giỏ hàng</button>
      </div>
    `;

    productList.appendChild(card);
  });

  // ✅ Sau khi tạo xong các nút "Mua", gắn sự kiện cho chúng
  setupBuyButtons();
  setupCartButtons();
}

function setupBuyButtons() {
  const buyButtons = document.querySelectorAll(".btn-buy");
  buyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = btn.getAttribute("data-price");
      const img = btn.getAttribute("data-img");

      document.getElementById("modal-product-name").textContent = name;
      document.getElementById("modal-product-price").textContent =
        Number(price).toLocaleString() + "₫";
      document.getElementById("modal-product-img").src = img;

      document.getElementById("orderModal").classList.add("active");
    });
  });
}

document.querySelector(".modal .btn-close").addEventListener("click", () => {
  document.getElementById("orderModal").classList.remove("active");
});
/*xử lý giỏ hàng */
function setupCartButtons() {
  const cartButtons = document.querySelectorAll(".cart button:last-child"); // Nút Giỏ hàng
  cartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const name = card.querySelector("p").textContent;

      const priceText =
        card.querySelector("p:nth-of-type(2)")?.textContent || "0";
      const price = parseFloat(priceText.replace(/[^\d]/g, ""));
      const img = card.querySelector("img").src;

      const newItem = { name, price, img, quantity: 1 };
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(newItem);
      }
    });
  });
}

//popup
const btn_open = document.getElementById("btn-open");
const btn_close = document.getElementById("btn-close");
const mod_container = document.getElementById("mod-container");

btn_open.addEventListener("click", () => {
  const loggedIn = localStorage.getItem("loggedIn");

  if (loggedIn === "true") {
    // 👉 Nếu đã đăng nhập thì chuyển qua profile.html
    window.location.href =
      "/laptrinhweb/AutoServices/app/views/html/profile.html";
  } else {
    // 👉 Nếu chưa đăng nhập thì hiện modal
    mod_container.classList.add("show");
  }
});
btn_close.addEventListener("click", () => {
  // Add class .show
  mod_container.classList.remove("show");
});

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.textContent = "🙈"; // đổi icon khi hiện mật khẩu
  } else {
    passwordInput.type = "password";
    toggleIcon.textContent = "👁️"; // đổi lại icon khi ẩn mật khẩu
  }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/laptrinhweb/AutoServices/app/controllers/auth.php?action=login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.text())
    .then((text) => {
      console.log("🔍 Phản hồi từ server:", text);
      try {
        const data = JSON.parse(text);
        if (data.success) {
          const role = data.user.role;
          const token = data.token;
          const userID = data.user.userID;

          // ✅ Ghi thông tin người dùng vào localStorage
          localStorage.setItem("userID", userID);
          localStorage.setItem("token", token);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("user", JSON.stringify(data.user));

          // ✅ Ẩn form đăng nhập (ẩn thẻ cha chứa form nếu cần)
          document.getElementById("mod-container").style.display = "none";

          // ✅ Hiện thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // ✅ Chuyển trang sau khi đóng thông báo
            if (role === "admin") {
              window.location.href =
                "/laptrinhweb/AutoServices/app/views/html/admin.html";
            } else if (role === "customer") {
              window.location.href = "/laptrinhweb/AutoServices/index.html";
            }
          });

          console.log("📥 Phản hồi từ server:", data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Đăng nhập thất bại",
            text: data.message || "Thông tin đăng nhập không chính xác.",
          });
        }
      } catch (err) {
        console.error("❌ Không phải JSON:", text);
        Swal.fire({
          icon: "error",
          title: "Lỗi phản hồi từ server",
          text: "Không thể xử lý dữ liệu nhận được từ server.",
        });
      }
    })
    .catch((err) => {
      console.error("❌ Lỗi fetch:", err);
      Swal.fire({
        icon: "error",
        title: "Không thể kết nối server",
        text: "Vui lòng thử lại sau.",
      });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const openRegisterBtn = document.getElementById("open-register");
  const registerContainer = document.getElementById("register-container");
  const modRegister = document.getElementById("mod-register");
  const closeRegisterBtn = document.getElementById("btn-close-register");
  const switchToLoginBtn = document.getElementById("switch-to-login");
  const loginModal = document.getElementById("mod");
  const modContainer = document.getElementById("mod-container");

  openRegisterBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("✅ Click Sign Up");

    // Hiện khung đăng ký
    registerContainer.classList.add("show");
    registerContainer.style.display = "flex";

    modRegister.style.display = "flex"; // 👉 KHÔNG ĐƯỢC BỎ
    loginModal.style.display = "none";
    modContainer.classList.remove("show");
  });

  closeRegisterBtn?.addEventListener("click", function () {
    registerContainer.classList.remove("show");
    registerContainer.style.display = "none";
    modRegister.style.display = "none";
  });

  switchToLoginBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    registerContainer.classList.remove("show");
    registerContainer.style.display = "none";
    modRegister.style.display = "none";

    loginModal.style.display = "flex";
    modContainer.classList.add("show");
  });
});

// 👉 Gửi form đăng ký
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const phoneNumber = document.getElementById("reg-phone").value.trim();
    const address = document.getElementById("reg-address").value.trim();

    const role = "customer";
    const registerContainer = document.getElementById("register-container"); // ✅ Khai báo rõ ràng

    // Optional: kiểm tra dữ liệu trước khi gửi
    if (!name || !email || !password || !phoneNumber || !address) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    fetch(
      "/laptrinhweb/AutoServices/app/controllers/auth.php?action=register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          phoneNumber,
          role,
          address,
        }),
      }
    )
      .then((res) => res.text()) // ✅ Đọc toàn bộ nội dung trả về (dù là HTML hay JSON)
      .then((text) => {
        try {
          const data = JSON.parse(text); // ✅ Thử parse JSON
          if (data.success) {
            
            registerContainer?.classList.remove("show");
            Swal.fire({
              icon: "success",
              title: "Đăng ký thành công",
              text: data.message || "Vui lòng đăng nhập để tiếp tục",
            }).then(() => {
              registerContainer?.classList.remove("show");
              window.location.href = "/laptrinhweb/AutoServices/";
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Đăng ký thất bại",
              text: data.message || "Vui lòng thử lại sau!",
            });
          }
        } catch (err) {
          console.error("❌ Không parse được JSON. Nội dung trả về:", text);
          Swal.fire({
            icon: "error",
            title: "Lỗi máy chủ",
            text: "Phản hồi không hợp lệ từ máy chủ. Xem console để biết chi tiết.",
          });
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi fetch:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi kết nối",
          text: "Không thể kết nối đến máy chủ!",
        });
      });
  });
//contact//
function submitContactForm(event) {
  event.preventDefault();
  console.log("📥 Đã submit form liên hệ");

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const categoryID = document.getElementById("service").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !phone || !email || !categoryID || !message) {
    return Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: "Vui lòng điền đầy đủ thông tin!",
    });
  }

  if (!/^[0-9]{9,15}$/.test(phone)) {
    return Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: "Số điện thoại không hợp lệ!",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Swal.fire({
      icon: "error",
      title: "Lỗi!",
      text: "Email không hợp lệ!",
    });
  }

  const contactData = { name, phone, email, categoryID, message };
  console.log("🚀 Dữ liệu liên hệ gửi đi từ Frontend:", contactData);

  fetch(
    "/laptrinhweb/AutoServices/app/controllers/ContactController.php?action=create",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    }
  )
    .then((res) => res.text())
    .then((text) => {
      console.log("📦 Raw response từ server:", text);
      try {
        const data = JSON.parse(text.trim());
        console.log("✅ Phản hồi từ Backend:", data);

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: data.message,
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            document.getElementById("contactForm").reset();
          });
        } else {
          Swal.fire({ icon: "error", title: "Lỗi!", text: data.message });
        }
      } catch (err) {
        console.error("❌ Lỗi khi parse JSON:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Phản hồi không hợp lệ từ server!",
        });
      }
    })
    .catch((err) => {
      console.error("🚫 Lỗi trong quá trình gửi yêu cầu Fetch:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể kết nối đến server!",
      });
    });
}
//xử lý nút mua//
function setupBuyButtons() {
  const buyButtons = document.querySelectorAll(".btn-buy");
  buyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = btn.getAttribute("data-price");
      const img = btn.getAttribute("data-img");

      document.getElementById("modal-product-name").textContent = name;
      document.getElementById("modal-product-price").textContent =
        Number(price).toLocaleString() + "₫";
      document.getElementById("modal-product-img").src = img;

      // Gán item vào nút xác nhận
      const product = allProducts.find((p) => p.name === name);
      console.log("🔍 Tìm thấy sản phẩm:", product);
      if (product) {
        document.getElementById("confirmOrderBtn").dataset.item =
          JSON.stringify({
            id: product.partID,
            name: product.name,
            price: product.price,
            img: product.images,
            quantity: 1,
            type: "part",
          });
      } else {
        console.warn("❌ Không tìm thấy product hoặc thiếu ID:", product);
      }

      // Mở modal
      document.getElementById("orderModal").classList.add("active");
    });
  });
}

document.querySelector(".modal .btn-close").addEventListener("click", () => {
  document.getElementById("orderModal").classList.remove("active");
});
fetch(
  "/laptrinhweb/AutoServices/app/controllers/auth.php?action=getCurrentUser"
)
  .then((res) => res.text()) // ⚠️ Đọc text thay vì json
  .then((text) => {
    console.log("🔍 Phản hồi từ server:", text);
    try {
      const data = JSON.parse(text);
      if (data.success) {
        const user = data.user;
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        document.getElementById("modal-customer-name").textContent = user.name;
        document.getElementById("modal-customer-phone").textContent =
          user.phoneNumber;
        document.getElementById("modal-customer-address").textContent =
          user.address;

        window.loggedInUser = user;
      } else {
        console.warn("Chưa đăng nhập");
      }
    } catch (err) {
      console.error("❌ Phản hồi không phải JSON:", text);
    }
  })
  .catch((err) => {
    console.error("Lỗi khi lấy người dùng:", err);
  });

document.getElementById("confirmOrderBtn").addEventListener("click", () => {
  const confirmBtn = document.getElementById("confirmOrderBtn");
  const item = JSON.parse(confirmBtn.dataset.item || "{}");

  const user = window.loggedInUser;
  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Bạn chưa đăng nhập",
      text: "Vui lòng đăng nhập để đặt hàng.",
    });
    return;
  }

  if (!item || !item.id) {
    Swal.fire({
      icon: "warning",
      title: "Lỗi",
      text: "Không tìm thấy sản phẩm để đặt hàng.",
    });
    return;
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = "Đang xử lý...";
  const payload = {
    items: [item],
    customer: {
      name: user.name,
      phone: user.phoneNumber,
      address: user.address,
    },
  };

  console.log("📦 Đơn hàng gửi:", payload);
  fetch(
    "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        items: [item],
        customer: {
          name: user.name,
          phone: user.phoneNumber,
          address: user.address,
        },
      }),
    }
  )
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(error.message || "Có lỗi xảy ra.");
        });
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        // Đóng modal trước
        document.getElementById("orderModal").classList.remove("active");

        // Đợi modal đóng xong (có thể thêm một chút delay nếu có animation)
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đơn hàng của bạn đã được đặt.",
            timer: 2000,
            showConfirmButton: false,
          });
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Xác nhận đơn hàng";
        }, 300); // delay 300ms cho mượt mà
      } else {
        throw new Error(data.message || "Lỗi đặt hàng.");
      }
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi đặt hàng: " + err.message,
      });
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Xác nhận đơn hàng";
    });
});

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

/*
document.addEventListener("DOMContentLoaded", () => {
  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=getAll")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        renderProducts(data.parts);
      } else {
        console.error("Không thể tải sản phẩm:", data.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi kết nối:", err);
    });
});
function renderProducts(products) {
  const container = document.querySelector(".product-list");
  container.innerHTML = ""; // Clear cũ

  products.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("product-item");

    item.innerHTML = `
      <img src="${product.images}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Giá: ${formatCurrency(product.price)}</p>
      <button class="add-to-cart">Thêm vào giỏ</button>
    `;

    container.appendChild(item);
  });
}

function formatCurrency(value) {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
*/
/* xử lý mua */

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
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đơn hàng của bạn đã được đặt.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Xác nhận đơn hàng";
          document.getElementById("orderModal").classList.remove("active");
        });
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

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Đã thêm vào giỏ hàng!");
    });
  });
}

//popup
const btn_open = document.getElementById("btn-open");
const btn_close = document.getElementById("btn-close");
const mod_container = document.getElementById("mod-container");
btn_open.addEventListener("click", () => {
  // Add class .show
  mod_container.classList.add("show");
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.text())
    .then((text) => {
      console.log("🔍 Phản hồi từ server:", text);
      try {
        const data = JSON.parse(text);
        if (data.success) {
          const user = data.user;
          const role = user.role;
          const token = data.token;
          // Lưu user vào localStorage
          localStorage.setItem("user", JSON.stringify(user));

          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công!",
            text: "Xin chào " + user.name + "!",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            if (role === "admin") {
              window.location.href =
                "/laptrinhweb/AutoServices/app/views/html/admin.html";
            } else if (role === "customer") {
              window.location.href = "/laptrinhweb/AutoServices/";
            } else {
              Swal.fire({
                icon: "warning",
                title: "Không xác định vai trò",
                text: "Không thể điều hướng!",
              });
            }
          });
        } else {
          alert(data.message || "Đăng nhập thất bại.");
        }
      } catch (err) {
        console.error("❌ Phản hồi không phải JSON:", text);
        alert("Đã xảy ra lỗi khi xử lý phản hồi từ server.");
      }
    })
    .catch((err) => {
      console.error("❌ Lỗi fetch:", err);
      alert("Không thể kết nối đến server.");
    });
});
//register
// Mở & đóng form đăng ký
// 👉 Mở form đăng ký và ẩn form đăng nhập
// ==== Hiển thị form đăng nhập ====
const modContainer = document.getElementById("mod-container");

// ==== Hiển thị form đăng ký ====
const registerContainer = document.getElementById("register-container");

// 👉 Mở form đăng ký & ẩn đăng nhập
document.querySelector(".signUpBtn-link").addEventListener("click", (e) => {
  e.preventDefault();
  modContainer.classList.remove("show");

  registerContainer.style.display = "flex";
  setTimeout(() => {
    registerContainer.classList.add("show");
  }, 10);
});

// 👉 Đóng form đăng ký
document.getElementById("btn-close-register").addEventListener("click", () => {
  registerContainer.classList.remove("show");
  setTimeout(() => {
    registerContainer.style.display = "none";
  }, 300); // khớp với transition
});

// 👉 Chuyển từ đăng ký về đăng nhập
document.getElementById("switch-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.classList.remove("show");
  setTimeout(() => {
    registerContainer.style.display = "none";
    modContainer.classList.add("show");
  }, 300);
});

// 👉 Nút mở form đăng nhập
document.getElementById("btn-open").addEventListener("click", () => {
  modContainer.classList.add("show");
});

// 👉 Nút đóng form đăng nhập
document.getElementById("btn-close").addEventListener("click", () => {
  modContainer.classList.remove("show");
});

// Xử lý đăng ký
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const address = document.getElementById("reg-address").value.trim();

    if (!name || !email || !password || !phone || !address) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin!",
        text: "Vui lòng nhập đầy đủ thông tin!",
      });
      return;
    }

    fetch(
      "/laptrinhweb/AutoServices/app/controllers/auth.php?action=register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber: phone,
          address,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("registerForm").reset();
          registerContainer.classList.remove("show");
          setTimeout(() => {
            registerContainer.style.display = "none";
            modContainer.classList.add("show");

            Swal.fire({
              icon: "success",
              title: "Đăng ký thành công!",
              text: "Bạn có thể đăng nhập ngay.",
              timer: 2000,
              showConfirmButton: false,
            });
          }, 300);
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: data.message || "Đăng ký thất bại!",
          });
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi đăng ký:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi kết nối",
          text: "Không thể kết nối đến máy chủ.",
        });
      });
  });

//contact
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

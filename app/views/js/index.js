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
            type: "part"
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
    address: user.address
  }
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
  e.preventDefault(); // Ngăn reload form

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/laptrinhweb/AutoServices/app/controllers/auth.php?action=login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.text()) // 👈 Nhận dưới dạng text trước
    .then((text) => {
      console.log("🔍 Phản hồi từ server:", text); // 👈 thêm dòng này
      try {
        const data = JSON.parse(text); // ✅ Parse JSON thủ công
        if (data.success) {
          const role = data.user.role;
          const token = data.token;
          alert("Đăng nhập thành công! Token: " + token);

          if (role === "admin") {
            window.location.href =
              "/laptrinhweb/AutoServices/app/views/html/admin.html";
          } else if (role === "customer") {
            window.location.href = "/laptrinhweb/AutoServices/"; // hoặc "/" nếu là trang chủ
          } else {
            alert("Không xác định vai trò.");
          }
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

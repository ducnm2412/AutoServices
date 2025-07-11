let allProducts = []; // Lưu trữ toàn bộ sản phẩm sau khi fetch

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Lấy thông tin người dùng đã đăng nhập từ localStorage
  window.loggedInUser = JSON.parse(localStorage.getItem("user"));

  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");
  const noProductsMessage = document.getElementById("noProductsMessage");

  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=getAll")
    .then((res) => res.json())
    .then((data) => {
      loadingMessage.style.display = "none";

      if (data.success) {
        allProducts = data.parts;

        if (allProducts.length === 0) {
          noProductsMessage.style.display = "block";
        } else {
          document.querySelector('.tab-btn[data-category="lop"]').click();
        }
      } else {
        console.error("Lỗi lấy danh sách sản phẩm:", data.message);
        errorMessage.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Lỗi kết nối API:", error);
      loadingMessage.style.display = "none";
      errorMessage.style.display = "block";
    });

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
    });
  });

  // ✅ Xử lý nút đóng modal
  document.querySelector("#orderModal .btn-close").addEventListener("click", () => {
    document.getElementById("orderModal").classList.remove("active");
  });

  // ✅ Xử lý xác nhận đơn hàng
  document.getElementById("confirmOrderBtn").addEventListener("click", () => {
    const confirmBtn = document.getElementById("confirmOrderBtn");
    const item = JSON.parse(confirmBtn.dataset.item || "{}");
    window.loggedInUser = JSON.parse(localStorage.getItem("user"));
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

    fetch("/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
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
});

function renderProducts(products) {
  const productList = document.querySelector(".product-list");
  const noProductsMessage = document.getElementById("noProductsMessage");
  productList.innerHTML = "";

  if (products.length === 0) {
    if (noProductsMessage) noProductsMessage.style.display = "block";
    return;
  } else {
    if (noProductsMessage) noProductsMessage.style.display = "none";
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const priceFormatted = Number(product.price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    card.innerHTML = `
      <img src="${product.images}" alt="${product.name}" />
      <p>${product.name}</p>
      <p><span>Giá:</span> ${priceFormatted}</p>
      <div class="cart">
          <button class="btn-buy"
              data-id="${product.partID}"
              data-name="${product.name}"
              data-price="${product.price}"
              data-img="${product.images}"
              data-type="part">
              Mua
          </button>
          <button class="btn-add-to-cart">Giỏ hàng</button>
      </div>
    `;

    productList.appendChild(card);
  });

  setupBuyButtons();
  setupCartButtons();
}

function setupBuyButtons() {
  const buyButtons = document.querySelectorAll(".btn-buy");
  buyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const partID = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = btn.getAttribute("data-price");
      const img = btn.getAttribute("data-img");
      const type = btn.getAttribute("data-type");

      document.getElementById("modal-product-name").textContent = name;
      document.getElementById("modal-product-price").textContent = Number(price).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      document.getElementById("modal-product-img").src = img;
      if (window.loggedInUser) {
        document.getElementById("modal-customer-name").textContent = window.loggedInUser.name || "";
        document.getElementById("modal-customer-phone").textContent = window.loggedInUser.phoneNumber || "";
        document.getElementById("modal-customer-address").textContent = window.loggedInUser.address || "";
      }
      const productToOrder = {
        id: partID,
        name: name,
        price: price,
        img: img,
        quantity: 1,
        type: type,
      };
      document.getElementById("confirmOrderBtn").dataset.item = JSON.stringify(productToOrder);

      document.getElementById("orderModal").classList.add("active");
    });
  });
}

function setupCartButtons() {
  const cartButtons = document.querySelectorAll(".btn-add-to-cart");
  cartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const buyBtn = card.querySelector(".btn-buy");

      const partID = buyBtn.getAttribute("data-id");
      const name = buyBtn.getAttribute("data-name");
      const price = buyBtn.getAttribute("data-price");
      const img = buyBtn.getAttribute("data-img");
      const type = buyBtn.getAttribute("data-type");

      const newItem = { id: partID, name, price, img, quantity: 1, type };
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find((item) => item.id === partID && item.type === type);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "Thêm vào giỏ thành công!",
        text: `${name} đã được thêm vào giỏ hàng.`,
        timer: 1500,
        showConfirmButton: false,
      });
    });
  });
}

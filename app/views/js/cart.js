function formatCurrency(number) {
  return number.toLocaleString("vi-VN") + "₫";
}

function updateCartSummary() {
  let total = 0;
  let count = 0;
  const checkboxes = document.querySelectorAll(
    ".cart-container input[type='checkbox']"
  );
  const totalTextElement = document.querySelector(".sum .summary div");
  const modalTotalValue = document.querySelector(".modal-footer .total-value");

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const cartItem = checkbox.closest(".cart-item");
      const priceText = cartItem.querySelector(".new-price").textContent;
      const price = parseFloat(priceText.replace(/\D/g, ""));
      const quantity =
        parseInt(cartItem.querySelector("input[type='text']").value) || 1;

      total += price * quantity;
      count++;
    }
  });

  totalTextElement.innerHTML = `Tổng cộng (${count} Sản phẩm): <span class="total-price">${formatCurrency(
    total
  )}</span>`;
  if (modalTotalValue) modalTotalValue.textContent = formatCurrency(total);
}

function renderCartFromStorage() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
            <div class="checkbox"><input type="checkbox" checked /></div>
            <img src="${item.img}" alt="${item.name}" />
            <div class="item-info">
                <div class="title">${item.name}</div>
                <div class="price-group"><span class="new-price">${formatCurrency(
                  item.price
                )}</span></div>
            </div>
            <div class="quantity-control">
                <button><i class="ri-subtract-line"></i></button>
                <input type="text" value="${item.quantity}" />
                <button><i class="ri-add-fill"></i></button>
            </div>
            <div class="actions"><button>Xóa</button></div>
        `;
    cartContainer.appendChild(div);
  });

  updateCartSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartFromStorage();

  const cartContainer = document.querySelector(".cart-container");
  const modal = document.getElementById("orderModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalCartItems = document.querySelector(".modal-cart-items");
  const confirmBtn = document.querySelector(".btn-confirm");

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    modalCartItems.innerHTML = "";

    const cartItems = document.querySelectorAll(".cart-container .cart-item");
    cartItems.forEach((item) => {
      if (item.querySelector("input[type='checkbox']").checked) {
        const imgSrc = item.querySelector("img").src;
        const title = item.querySelector(".title").textContent;
        const price = item.querySelector(".new-price").textContent;
        const quantity = item.querySelector("input[type='text']").value;

        const modalItem = document.createElement("div");
        modalItem.className = "cart-item";
        modalItem.innerHTML = `
                    <img src="${imgSrc}" alt="${title}" />
                    <div class="item-info">
                        <div class="title">${title}</div>
                        <div class="price-group"><span class="new-price">${price}</span></div>
                    </div>
                    <div class="quantity-control"><span>Số lượng: ${quantity}</span></div>
                `;
        modalCartItems.appendChild(modalItem);
      }
    });

    if (!modalCartItems.children.length) {
      modalCartItems.innerHTML = "<p>Không có sản phẩm nào được chọn.</p>";
    }
  });

  closeModalBtn.addEventListener("click", () =>
    modal.classList.remove("active")
  );
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  cartContainer.addEventListener("click", (e) => {
    const target = e.target;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (target.tagName === "BUTTON" && target.textContent.trim() === "Xóa") {
      const cartItem = target.closest(".cart-item");
      const title = cartItem.querySelector(".title").textContent;
      const newCart = cart.filter((item) => item.name !== title);
      localStorage.setItem("cart", JSON.stringify(newCart));
      renderCartFromStorage();
    }

    if (target.matches(".ri-subtract-line, .ri-add-fill")) {
      const cartItem = target.closest(".cart-item");
      const title = cartItem.querySelector(".title").textContent;
      const input = cartItem.querySelector("input[type='text']");
      let quantity = parseInt(input.value);

      if (target.classList.contains("ri-subtract-line") && quantity > 1)
        quantity--;
      else if (target.classList.contains("ri-add-fill")) quantity++;

      input.value = quantity;

      const updatedCart = cart.map((item) =>
        item.name === title ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      updateCartSummary();
    }
  });

  cartContainer.addEventListener("input", (e) => {
    if (e.target.matches("input[type='text']")) {
      const cartItem = e.target.closest(".cart-item");
      const title = cartItem.querySelector(".title").textContent;
      const quantity = parseInt(e.target.value) || 1;
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.map((item) =>
        item.name === title ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      updateCartSummary();
    }
  });

  cartContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") updateCartSummary();
  });

  // Xác nhận đơn hàng
  confirmBtn.addEventListener("click", () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Đang xử lý...";

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Giỏ hàng của bạn đang trống!",
      });
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Xác nhận đơn hàng";
      return;
    }

    const selectedItems = [];
    const cartItems = document.querySelectorAll(".cart-container .cart-item");
    cartItems.forEach((item) => {
      if (item.querySelector("input[type='checkbox']").checked) {
        const title = item.querySelector(".title").textContent;
        const priceText = item.querySelector(".new-price").textContent;
        const price = parseFloat(priceText.replace(/\D/g, ""));
        const img = item.querySelector("img").src;
        const quantity = parseInt(
          item.querySelector("input[type='text']").value
        );

        selectedItems.push({ name: title, price, img, quantity });
      }
    });

    if (!selectedItems.length) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn ít nhất một sản phẩm!",
      });
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Xác nhận đơn hàng";
      return;
    }

    // Bước 1: Gọi API checkout để tạo đơn hàng
    fetch(
      "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=checkout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItems }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi đặt hàng: " + data.message,
          });
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Xác nhận đơn hàng";
          return;
        }

        // Bước 2: Gọi API processPayment để thanh toán và cập nhật trạng thái paid
        const orderID = data.orderID;
        fetch(
          "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=processPayment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID, paymentMethod: "cod" }), // hoặc paymentMethod khác nếu có
          }
        )
          .then((res) => res.json())
          .then((payResult) => {
            if (payResult.success) {
              Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: "Đơn hàng đã được thanh toán!",
                timer: 2000,
              }).then(() => {
                localStorage.removeItem("cart");
                window.location.href = "/laptrinhweb/AutoServices";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: payResult.message || "Thanh toán thất bại!",
              });
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Đã xảy ra lỗi khi thanh toán.",
            });
          })
          .finally(() => {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Xác nhận đơn hàng";
          });
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi gửi đơn hàng.",
        });
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Xác nhận đơn hàng";
      });
  });

  fetch(
    "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: selectedItems }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đặt hàng thành công!",
          timer: 2000,
        }).then(() => {
          localStorage.removeItem("cart");
          window.location.href = "/laptrinhweb/AutoServices";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Lỗi khi đặt hàng: " + data.message,
        });
      }
    })
    .catch((err) => {
      console.error("Lỗi:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi gửi đơn hàng.",
      });
    })
    .finally(() => {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Xác nhận đơn hàng";
    });
});

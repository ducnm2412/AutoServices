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
      const quantityInput = cartItem.querySelector("input[type='text']");
      const quantity = parseInt(quantityInput?.value) || 1;

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
            <button data-id="${item.id}" data-type="${
      item.type
    }" data-action="decrease"><i class="ri-subtract-line"></i></button>
            <input type="text" value="${item.quantity}" data-id="${
      item.id
    }" data-type="${item.type}" />
            <button data-id="${item.id}" data-type="${
      item.type
    }" data-action="increase"><i class="ri-add-fill"></i></button>
        </div>
        <div class="actions"><button class="remove-from-cart" data-id="${
          item.id
        }" data-type="${item.type}">Xóa</button></div>
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
    let modalTotal = 0;
    let selectedItems = [];

    const cartItems = document.querySelectorAll(".cart-container .cart-item");
    cartItems.forEach((item) => {
      const checkbox = item.querySelector("input[type='checkbox']");
      if (checkbox.checked) {
        const imgSrc = item.querySelector("img").src;
        const title = item.querySelector(".title").textContent;
        const priceText = item.querySelector(".new-price").textContent;
        const price = parseFloat(priceText.replace(/\D/g, ""));
        const quantityInput = item.querySelector("input[type='text']");
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        const itemId = item.querySelector(".remove-from-cart").dataset.id;
        const itemType = item.querySelector(".remove-from-cart").dataset.type;

        selectedItems.push({
          id: itemId,
          type: itemType,
          name: title,
          price,
          quantity,
          img: imgSrc,
        });
        modalTotal += price * quantity;

        const div = document.createElement("div");
        div.className = "modal-cart-item";
        div.innerHTML = `
          <img src="${imgSrc}" alt="${title}" />
          <div class="item-info">
            <div class="title">${title}</div>
            <div class="price-quantity">
              ${formatCurrency(price)} x ${quantity}
            </div>
          </div>
        `;
        modalCartItems.appendChild(div);
      }
    });

    document.querySelector(".modal-footer .total-value").textContent =
      formatCurrency(modalTotal);
    confirmBtn.dataset.selectedItems = JSON.stringify(selectedItems);
  });

  closeModalBtn.addEventListener("click", () =>
    modal.classList.remove("active")
  );
  window.addEventListener("click", (event) => {
    if (event.target == modal) modal.classList.remove("active");
  });

  cartContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      const button = e.target.closest("button");
      const action = button.dataset.action;
      const itemId = button.dataset.id;
      const itemType = button.dataset.type;

      // Handle "remove-from-cart" first
      // Handle "remove-from-cart" first
      if (button.classList.contains("remove-from-cart")) {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Cart before removal:", JSON.stringify(cart)); // ✅ Kiểm tra trước khi xóa
        console.log("Attempting to remove:", "ID:", itemId, "Type:", itemType); // ✅ Kiểm tra ID và Type

        cart = cart.filter(
          (item) => !(item.id === itemId && item.type === itemType)
        );
        console.log("Cart after filter:", JSON.stringify(cart)); // ✅ Kiểm tra sau khi lọc

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("localStorage updated. New cart:", localStorage.getItem("cart")); // ✅ Xác nhận đã lưu

        const cartItemToRemove = button.closest(".cart-item");
        if (cartItemToRemove) {
          cartItemToRemove.remove();
        }

        updateCartSummary();
        return;
      }

      // Now that "remove" is handled, safely get the item and quantity input
      const item = button.closest(".cart-item"); // This is line 172
      const quantityInput = item.querySelector("input[type='text']");
      let quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

      if (!quantityInput) {
        console.warn("Không tìm thấy input số lượng.");
        return;
      }

      // Handle increase/decrease actions
      if (action === "decrease" && quantity > 1) {
        quantity--;
      } else if (action === "increase") {
        quantity++;
      } else {
        return; // No relevant action or quantity not changed
      }

      quantityInput.value = quantity;
      updateCartSummary();

      // Update localStorage
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const itemIndex = cart.findIndex(
        (cartItem) => cartItem.id === itemId && cartItem.type === itemType
      );
      if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  });
  cartContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") updateCartSummary();
  });

  confirmBtn.addEventListener("click", () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Đang xử lý...";

    const selectedItemsData = JSON.parse(
      confirmBtn.dataset.selectedItems || "[]"
    );
    if (selectedItemsData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Giỏ hàng trống",
        text: "Vui lòng chọn ít nhất một sản phẩm/dịch vụ để đặt hàng.",
      });
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Xác nhận đơn hàng";
      return;
    }

    fetch(
      "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=checkout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItemsData }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(
              errorData.message || `HTTP error! status: ${res.status}`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          localStorage.removeItem("cart");
          renderCartFromStorage();
          updateCartSummary();
          confirmBtn.style.display = "none";

          if (modal) {
            modal.classList.remove("active");
            setTimeout(() => {
              Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: "Đặt hàng thành công!",
                timer: 2000,
                showConfirmButton: false,
              });
            }, 300);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi đặt hàng: " + data.message,
          });
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Xác nhận đơn hàng";
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi gửi đơn hàng: " + err.message,
        });
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Xác nhận đơn hàng";
      });
  });
});

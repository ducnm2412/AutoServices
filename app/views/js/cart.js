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

  // Xử lý sự kiện mở modal
  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    modalCartItems.innerHTML = "";
    let modalTotal = 0;

    // Lấy các mục đã chọn từ giỏ hàng thực tế
    const cartItems = document.querySelectorAll(".cart-container .cart-item");
    // Định nghĩa selectedItems ở đây để nó có thể được sử dụng
    let selectedItems = [];

    cartItems.forEach((item) => {
      const checkbox = item.querySelector("input[type='checkbox']");
      if (checkbox.checked) {
        const imgSrc = item.querySelector("img").src;
        const title = item.querySelector(".title").textContent;
        const priceText = item.querySelector(".new-price").textContent;
        const price = parseFloat(priceText.replace(/\D/g, ""));
        const quantity =
          parseInt(item.querySelector("input[type='text']").value) || 1;
        const itemId = item.querySelector(".remove-from-cart").dataset.id; // Lấy ID của sản phẩm/dịch vụ
        const itemType = item.querySelector(".remove-from-cart").dataset.type; // Lấy loại của sản phẩm/dịch vụ

        // Thêm vào mảng selectedItems
        selectedItems.push({
          id: itemId,
          type: itemType,
          name: title,
          price: price,
          quantity: quantity,
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

    // Lưu selectedItems vào thuộc tính dataset của nút xác nhận để có thể truy cập sau
    // Hoặc đơn giản hơn là định nghĩa fetch ở đây, ngay trong scope này
    confirmBtn.dataset.selectedItems = JSON.stringify(selectedItems);
  });

  // Xử lý sự kiện đóng modal
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Đóng modal khi click ra ngoài
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.classList.remove("active");
    }
  });

  // Xử lý thay đổi số lượng
  cartContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      const button = e.target.closest("button");
      const action = button.dataset.action;
      const itemId = button.dataset.id;
      const itemType = button.dataset.type;
      const quantityInput =
        button.parentNode.querySelector("input[type='text']");

      let quantity = parseInt(quantityInput.value);
      if (action === "decrease" && quantity > 1) {
        quantity--;
      } else if (action === "increase") {
        quantity++;
      } else if (button.classList.contains("remove-from-cart")) {
        // Xử lý xóa mục khỏi giỏ hàng
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart = cart.filter(
          (item) => !(item.id === itemId && item.type === itemType)
        );
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartFromStorage();
        return; // Thoát khỏi hàm để không xử lý tiếp quantity
      } else {
        return; // Không làm gì nếu không phải nút tăng/giảm hoặc xóa
      }

      quantityInput.value = quantity;
      updateCartSummary();

      // Cập nhật số lượng trong localStorage
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const itemIndex = cart.findIndex(
        (item) => item.id === itemId && item.type === itemType
      );
      if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  });

  // Cập nhật summary khi checkbox thay đổi
  cartContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      updateCartSummary();
    }
  });

  // Xử lý nút Xác nhận đơn hàng
  confirmBtn.addEventListener("click", () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Đang xử lý...";

    // Lấy dữ liệu selectedItems từ data attribute đã lưu khi mở modal
    const selectedItemsData = JSON.parse(
      confirmBtn.dataset.selectedItems || "[]"
    );
    console.log("Dữ liệu gửi đi:", selectedItemsData);
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

    // Di chuyển lệnh fetch vào đây
    fetch(
      "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=checkout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItemsData }), // Sử dụng selectedItemsData
      }
    )
      .then((res) => {
        if (!res.ok) {
          // Xử lý lỗi HTTP (ví dụ: 400, 500)
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
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đặt hàng thành công!",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            localStorage.removeItem("cart"); // Xóa giỏ hàng
            renderCartFromStorage(); // Hiển thị giỏ hàng trống trên giao diện
            updateCartSummary(); // Cập nhật tổng tiền/số lượng về 0

            // THÊM DÒNG NÀY ĐỂ ẨN NÚT XÁC NHẬN ĐƠN HÀNG KHI THÀNH CÔNG
            confirmBtn.style.display = "none";

            // Đảm bảo modal cũng được đóng nếu nó đang mở
            const modal = document.getElementById("orderModal");
            if (modal) {
              modal.classList.remove("active");
            }
          });
        } else {
          // Nếu có lỗi, hiển thị thông báo lỗi và kích hoạt lại nút
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi đặt hàng: " + data.message,
          });
          // Kích hoạt lại nút và đặt lại văn bản nếu có lỗi
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Xác nhận đơn hàng";
        }
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi gửi đơn hàng: " + err.message,
        });
        // Kích hoạt lại nút và đặt lại văn bản nếu có lỗi mạng
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Xác nhận đơn hàng";
      });
  });
});

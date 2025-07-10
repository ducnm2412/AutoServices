document.addEventListener("DOMContentLoaded", () => {
  const servicesGrid = document.getElementById("servicesGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");
  const noServicesMessage = document.getElementById("noServicesMessage");

  const API_BASE_URL =
    "/laptrinhweb/AutoServices/app/controllers/ServiceController.php";
  let currentCategoryID = "";

  // Gọi API đặt dịch vụ
  async function handleOrderService(service) {
    const itemToSend = {
      ...service,
      id: parseInt(service.serviceID), // 🔁 đổi từ serviceID -> id
      price: parseFloat(service.price),
      type: "service",
    };

    console.log("Dịch vụ gửi lên:", itemToSend);

    try {
      const response = await fetch(
        "/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=buySingle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item: itemToSend }),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        Swal.fire({
          icon: "success",
          title: "Đặt dịch vụ thành công!",
          html: `Mã đơn hàng của bạn là: <b>${result.orderID}</b>`,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Đặt dịch vụ thất bại",
          text: result.message || "Không thể đặt dịch vụ.",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (error) {
      console.error("Lỗi đặt dịch vụ:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Đã xảy ra lỗi khi đặt dịch vụ. Vui lòng thử lại sau.",
        confirmButtonText: "Đóng",
      });
    }
  }

  // Tạo thẻ dịch vụ
  function createServiceCard(service) {
    const priceDisplay = isNaN(parseFloat(service.price))
      ? `<p class="price-value contact-price">${service.price}</p>`
      : `<p class="price-value">${new Intl.NumberFormat("vi-VN").format(
          service.price
        )}<span class="currency">VNĐ</span></p>`;

    let descriptionHtml = "";
    try {
      const details = JSON.parse(service.description);
      if (Array.isArray(details)) {
        descriptionHtml = details
          .map(
            (detail) => `
                    <li><i class="fas fa-check-circle check-icon"></i> ${detail}</li>
                `
          )
          .join("");
      } else {
        descriptionHtml = service.description
          .split("\n")
          .map((line) => {
            if (line.trim() === "") return "";
            return `<li><i class="fas fa-check-circle check-icon"></i> ${line.trim()}</li>`;
          })
          .join("");
      }
    } catch (e) {
      descriptionHtml = service.description
        .split("\n")
        .map((line) => {
          if (line.trim() === "") return "";
          return `<li><i class="fas fa-check-circle check-icon"></i> ${line.trim()}</li>`;
        })
        .join("");
    }

    const card = document.createElement("div");
    card.classList.add("service-card");
    card.innerHTML = `
            <div class="card-header">
                <i class="fas fa-cog gear-icon"></i>
                <h3 class="service-title">${service.name}</h3>
            </div>
            <div class="card-price-time">
                <p class="price-label">MỨC GIÁ / THỜI GIAN</p>
                ${priceDisplay}
                <p class="time-value">/${
                  service.time || "Thời gian chưa xác định"
                }</p>
            </div>
            <ul class="service-details">
                ${descriptionHtml}
            </ul>
            <button class="order-btn">Đặt dịch vụ</button>
        `;

    // Gắn sự kiện đặt dịch vụ
    const orderBtn = card.querySelector(".order-btn");
    orderBtn.addEventListener("click", () => handleOrderService(service));

    return card;
  }

  // Lấy danh sách dịch vụ từ server
  async function fetchServices(categoryID = "") {
    servicesGrid.innerHTML = "";
    loadingMessage.style.display = "block";
    errorMessage.style.display = "none";
    noServicesMessage.style.display = "none";

    const url = categoryID
      ? `${API_BASE_URL}?action=getByCategory&categoryID=${categoryID}`
      : `${API_BASE_URL}?action=getAll`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success && data.services && data.services.length > 0) {
        data.services.forEach((service) => {
          servicesGrid.appendChild(createServiceCard(service));
        });
      } else if (data.success && data.services.length === 0) {
        noServicesMessage.style.display = "block";
      } else {
        throw new Error(data.message || "Lỗi không xác định từ server.");
      }
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
      errorMessage.style.display = "block";
    } finally {
      loadingMessage.style.display = "none";
    }
  }

  // Gán sự kiện lọc danh mục
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      currentCategoryID = button.dataset.categoryId;
      fetchServices(currentCategoryID);
    });
  });

  // Tải tất cả dịch vụ lần đầu
  fetchServices();
});

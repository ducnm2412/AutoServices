function initOrderHistory() {
  console.log("🧾 Đang tải lịch sử đơn hàng...");

  fetch("/laptrinhweb/AutoServices/app/controllers/CustomerController.php?action=viewMyOrderHistory", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
        console.log("📦 Dữ liệu nhận được từ server:", data); // ✅ In ra dữ liệu JSON trả về
      if (data.success) {
        renderOrderList(data.orders);
      } else {
        alert("Không thể tải lịch sử đơn hàng.");
      }
    })
    .catch(err => {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
      alert("Lỗi hệ thống khi tải lịch sử đơn hàng.");
    });
}

function renderOrderList(orders) {
  const tableBody = document.getElementById("orderTableBody");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  tableBody.innerHTML = ""; // Xoá dữ liệu cũ

  if (!orders || orders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Không có đơn hàng nào</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.orderID}</td>
      <td>${user ? user.name : "Chưa biết"}</td>
      <td>${order.userID || "N/A"}</td>
      <td>${order.orderDate}</td>
      <td>${order.totalAmount}</td>
      <td>${order.status}</td>
    `;

    tableBody.appendChild(row);
  });
}

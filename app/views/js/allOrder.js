// Lấy danh sách đơn hàng
function fetchOrders() {
  fetch("/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=getAllOrders")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        alert("Không lấy được danh sách đơn hàng!");
        return;
      }
      const tbody = document.getElementById("orderTableBody");
      tbody.innerHTML = "";
      data.orders.forEach((order) => {
        tbody.innerHTML += `
          <tr>
            <td>${order.orderID}</td>
            <td>${order.userID}</td>
            <td>${order.orderDate}</td>
            <td>${order.totalAmount}</td>
            <td>${order.status}</td>
            <td>
              <button onclick="viewOrderDetail('${order.orderID}')">Xem chi tiết</button>
            </td>
          </tr>
        `;
      });
    });
}

// Chuyển sang trang chi tiết đơn hàng
function viewOrderDetail(orderID) {
  window.location.href = `orderDetail.html?orderID=${orderID}`;
}

// Tải dữ liệu khi load trang
fetchOrders();

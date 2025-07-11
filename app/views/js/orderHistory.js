// orderHistory.js
function initOrderHistory() {
    console.log("📦 initOrderHistory chạy!")
  fetch("/laptrinhweb/AutoServices/app/controllers/order.php?action=getOrdersByUser", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("orderTableBody");
      tbody.innerHTML = "";

      if (data.success && data.orders.length > 0) {
        data.orders.forEach((order, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${order.orderID}</td>
              <td>${order.customerName}</td>
              <td>${order.orderDate}</td>
              <td>${order.totalAmount}</td>
              <td>${order.status}</td>
              <td><button onclick="sendFeedback('${order.orderID}')">Phản hồi</button></td>
            </tr>
          `;
          tbody.innerHTML += row;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="7">Không có đơn hàng nào</td></tr>`;
      }
    })
    .catch(err => {
      console.error("❌ Lỗi lấy đơn hàng:", err);
    });
}

function sendFeedback(orderID) {
  alert("Mở form phản hồi cho đơn hàng: " + orderID);
  // Có thể loadPage('feedback') kèm localStorage.setItem('orderID', orderID)
}

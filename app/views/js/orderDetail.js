// Lấy orderID từ query string
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
const orderID = getQueryParam("orderID");
if (!orderID) {
  document.body.innerHTML = "<h2>Không tìm thấy mã đơn hàng!</h2>";
} else {
  fetch(
    `/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=getOrderDetails&orderID=${orderID}`
  )
    .then((res) => res.json())
    .then((result) => {
      if (!result.success) {
        document.body.innerHTML = `<h2>${
          result.message || "Không tìm thấy đơn hàng!"
        }</h2>`;
        return;
      }
      const { order, details, user } = result.data;
      // Render thông tin đơn hàng
      document.getElementById("orderInfo").innerHTML = `
        <p><strong>Mã đơn hàng:</strong> ${order.orderID}</p>
        <p><strong>Khách hàng:</strong> ${user ? user.name : ""} (${
        user ? user.email : ""
      })</p>
        <p><strong>Ngày đặt:</strong> ${order.orderDate}</p>
        <p><strong>Trạng thái:</strong> ${order.status}</p>
      `;
      let total = 0;
      document.getElementById("orderDetailBody").innerHTML = details
        .map((item) => {
          const thanhTien = item.price * item.quantity;
          total += thanhTien;
          return `<tr>
          <td>${item.name}</td>
          <td>${item.type || ""}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString()}</td>
          <td>${thanhTien.toLocaleString()}</td>
        </tr>`;
        })
        .join("");
      document.getElementById(
        "orderTotal"
      ).innerText = `Tổng tiền: ${total.toLocaleString()} VNĐ`;
    })
    .catch(() => {
      document.body.innerHTML = "<h2>Lỗi khi tải dữ liệu đơn hàng!</h2>";
    });
}

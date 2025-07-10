// Lấy orderID từ query string
/*function getQueryParam(name) {
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
    .then((res) => {
      if (!res.ok) throw new Error("Lỗi HTTP: " + res.status);
      return res.json();
    })
    .then((result) => {
      
      if (!result.success) {
        document.body.innerHTML = `<h2>${
          result.message || "Không tìm thấy đơn hàng!"
        }</h2>`;
        return;
      }

      const { order, parts, services, user } = result.data;
      let customerName = order.userID; // Mặc định là userID
      if (user && user.name) {
        // Nếu user tồn tại và có thuộc tính name
        customerName = user.name;
      }

      // Hiển thị thông tin đơn hàng
      document.getElementById("orderInfo").innerHTML = `
  <p><strong>Mã đơn hàng:</strong> ${order.orderID}</p>
  <p><strong>Khách hàng:</strong> ${customerName}</p> // Sử dụng customerName ở đây
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
            <td>${item.type}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString()} VNĐ</td>
            <td>${thanhTien.toLocaleString()} VNĐ</td>
          </tr>`;
        })
        .join("");

      document.getElementById(
        "orderTotal"
      ).innerText = `Tổng tiền: ${total.toLocaleString()} VNĐ`;
    })
    .catch((err) => {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
      document.body.innerHTML = "<h2>Lỗi khi tải dữ liệu đơn hàng!</h2>";
    });
}*/
// Lấy orderID từ query string
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const orderID = getQueryParam("orderID");

if (!orderID) {
  document.body.innerHTML = "<h2>Không tìm thấy mã đơn hàng!</h2>";
} else {
  fetch(`/laptrinhweb/AutoServices/app/controllers/OrderController.php?action=getOrderDetails&orderID=${orderID}`)
    .then((res) => {
      if (!res.ok) {
        // Log lỗi HTTP nếu có
        console.error("Lỗi HTTP:", res.status, res.statusText);
        throw new Error("Lỗi HTTP: " + res.status);
      }
      return res.json();
    })
    .then((result) => {
      // Log kết quả nhận được từ server để kiểm tra
      console.log("Dữ liệu JSON nhận được:", result);

      if (!result.success) {
        document.body.innerHTML = `<h2>${result.message || "Không tìm thấy đơn hàng!"}</h2>`;
        return;
      }

      const { order, parts, services, user } = result.data;

      // Log dữ liệu sau khi giải cấu trúc để đảm bảo các biến tồn tại
      console.log("Order:", order);
      console.log("Parts:", parts);
      console.log("Services:", services);
      console.log("User:", user);

      const details = [
  ...(services || []).map(s => ({ ...s, type: 'Dịch vụ', quantity: 1 })), // ✅ thêm quantity mặc định
  ...(parts || []).map(p => ({ ...p, type: 'Phụ tùng' }))
];

      // Hiển thị thông tin đơn hàng
      // Đảm bảo user?.name hoạt động, nếu không có user.name sẽ dùng order.userID
      document.getElementById("orderInfo").innerHTML = `
        <p><strong>Mã đơn hàng:</strong> ${order.orderID}</p>
        <p><strong>Khách hàng:</strong> ${user?.name || order.userID}</p>
        <p><strong>Ngày đặt:</strong> ${order.orderDate}</p>
        <p><strong>Trạng thái:</strong> ${order.status}</p>
      `;

      let total = 0;
      document.getElementById("orderDetailBody").innerHTML = details
        .map((item) => {
          // Log từng item để kiểm tra giá trị và kiểu dữ liệu của price và quantity
          console.log("Processing item:", item);
          console.log("Item Price (raw):", item.price, "Type:", typeof item.price);
          console.log("Item Quantity (raw):", item.quantity, "Type:", typeof item.quantity);

          // Chuyển đổi price và quantity sang số để đảm bảo tính toán và toLocaleString() hoạt động
          const price = parseFloat(item.price);
          const quantity = parseInt(item.quantity);

          // Kiểm tra xem giá trị có hợp lệ là số không
          if (isNaN(price) || isNaN(quantity)) {
            console.error("Lỗi: Giá hoặc số lượng không hợp lệ cho item:", item);
            // Trả về một hàng trống hoặc hàng lỗi để không làm hỏng toàn bộ bảng
            return `<tr><td colspan="5" style="color: red;">Lỗi dữ liệu cho ${item.name}</td></tr>`;
          }

          const thanhTien = price * quantity;
          total += thanhTien;
          return `<tr>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${quantity}</td>
            <td>${price.toLocaleString()} VNĐ</td>
            <td>${thanhTien.toLocaleString()} VNĐ</td>
          </tr>`;
        })
        .join("");

      // Log tổng tiền cuối cùng
      console.log("Tổng tiền cuối cùng:", total);
      document.getElementById("orderTotal").innerText = `Tổng tiền: ${total.toLocaleString()} VNĐ`;
    })
    .catch((err) => {
      // Bắt lỗi tổng quát, bao gồm lỗi JavaScript trong khối .then
      console.error("❌ Lỗi khi tải đơn hàng:", err);
      // Hiển thị thông báo lỗi chung cho người dùng
      document.body.innerHTML = "<h2>Lỗi khi tải dữ liệu đơn hàng!</h2>";
    });
}
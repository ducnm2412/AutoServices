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
        console.error("Lỗi HTTP:", res.status, res.statusText);
        throw new Error("Lỗi HTTP: " + res.status);
      }
      return res.json();
    })
    .then((result) => {
      console.log("Dữ liệu JSON nhận được:", result);

      if (!result.success) {
        document.body.innerHTML = `<h2>${result.message || "Không tìm thấy đơn hàng!"}</h2>`;
        return;
      }

      const { order, parts, services, user } = result.data;
      const customerName = user?.name || order.userID;
      const customerPhone = user?.phoneNumber || "Không có";
      const customerAddress = user?.address || "Không có";

      const details = [
        ...(services || []).map(s => ({ ...s, type: 'Dịch vụ', quantity: s.quantity || 1 })),
        ...(parts || []).map(p => ({ ...p, type: 'Phụ tùng' }))
      ];

      // ✅ Hiển thị thông tin đơn hàng + KHÁCH HÀNG (gồm địa chỉ & SĐT)
      document.getElementById("orderInfo").innerHTML = `
        <p><strong>Mã đơn hàng:</strong> ${order.orderID}</p>
        <p><strong>Khách hàng:</strong> ${customerName}</p>
        <p><strong>Số điện thoại:</strong> ${customerPhone}</p>
        <p><strong>Địa chỉ:</strong> ${customerAddress}</p>
        <p><strong>Ngày đặt:</strong> ${order.orderDate}</p>
        <p><strong>Trạng thái:</strong> ${order.status}</p>
      `;

      let total = 0;
      document.getElementById("orderDetailBody").innerHTML = details
        .map((item) => {
          console.log("Processing item:", item);
          const price = parseFloat(item.price);
          const quantity = parseInt(item.quantity);

          if (isNaN(price) || isNaN(quantity)) {
            console.error("Lỗi: Giá hoặc số lượng không hợp lệ cho item:", item);
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

      document.getElementById("orderTotal").innerText = `Tổng tiền: ${total.toLocaleString()} VNĐ`;
    })
    .catch((err) => {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
      document.body.innerHTML = "<h2>Lỗi khi tải dữ liệu đơn hàng!</h2>";
    });
}

// Lấy danh sách dịch vụ
function fetchServices() {
  fetch("/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=getAll")
    .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok ' + res.statusText);
        return res.json();
    })
    .then((data) => {
      const tbody = document.getElementById("serviceTableBody");
      tbody.innerHTML = "";

      if (data.success && Array.isArray(data.services)) {
        data.services.forEach((service) => {
          const serviceID = parseInt(service.serviceID);
          tbody.innerHTML += `
            <tr>
              <td>${service.serviceID}</td>
              <td>${service.name}</td>
              <td>${service.price}</td>
              <td>${service.description}</td>
              <td>${service.categoryID}</td>
              <td>
                <button class="action-btn" onclick='editService(${JSON.stringify(service)})'>Sửa</button>
                <button class="action-btn" onclick="deleteService(${service.serviceID})">Xóa</button>
              </td>
            </tr>
          `;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Không có dịch vụ nào.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      const tbody = document.getElementById("serviceTableBody");
      tbody.innerHTML = `<tr><td colspan="6">Không thể tải dữ liệu dịch vụ. Vui lòng thử lại.</td></tr>`;
    });
}

// Thêm/Sửa dịch vụ
document.getElementById("serviceForm").onsubmit = function (e) {
  e.preventDefault();

  const form = this;
  const formData = new FormData(form);
  const serviceID = document.getElementById("serviceID").value;

  const action = serviceID ? "update" : "add";
  let bodyData;
  let headers = {};

  if (action === "update") {
    bodyData = {
      serviceID: serviceID,
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      description: formData.get("description"),
      categoryID: formData.get("categoryID")
    };
    headers['Content-Type'] = 'application/json';
    bodyData = JSON.stringify(bodyData);
  } else {
    bodyData = formData;
  }

  fetch(`/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=${action}`, {
    method: "POST",
    headers: headers,
    body: bodyData
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => { throw new Error(text || 'Network response was not ok'); });
      }
      return res.json();
    })
    .then(data => {
      console.log("📦 Server response data:", data);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: data.message || "Thao tác thành công!"
        });
        fetchServices();
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại!",
          text: data.message || "Có lỗi xảy ra."
        });
      }
    })
    .catch(err => {
      console.error("❌ Lỗi khi gửi form:", err);
      try {
        const errorData = JSON.parse(err.message);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: errorData.message || "Không thể xử lý yêu cầu."
        });
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Lỗi kết nối!",
          text: err.message || "Dữ liệu không hợp lệ hoặc kết nối thất bại."
        });
      }
    });
};

// Sửa (điền dữ liệu lên form)
function editService(service) {
  document.getElementById("serviceID").value = service.serviceID;
  document.getElementById("name").value = service.name;
  document.getElementById("price").value = service.price;
  document.getElementById("description").value = service.description;
  document.getElementById("categoryID").value = service.categoryID;
  document.getElementById("saveBtn").textContent = "Cập nhật";
}

// Xóa dịch vụ
function deleteService(serviceID) {
  Swal.fire({
    title: "Bạn có chắc muốn xóa?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceID: serviceID }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok ' + res.statusText);
          return res.json();
        })
        .then((result) => {
          if (result.success) {
            Swal.fire({
              icon: "success",
              title: "Đã xóa!",
              text: result.message || "Xóa dịch vụ thành công!"
            });
            fetchServices();
            resetForm();
          } else {
            Swal.fire({
              icon: "error",
              title: "Xóa thất bại!",
              text: result.message || "Không thể xóa dịch vụ."
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xóa dịch vụ:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Lỗi khi xóa dịch vụ: " + error.message
          });
        });
    }
  });
}

// Reset form
function resetForm() {
  document.getElementById("serviceForm").reset();
  document.getElementById("serviceID").value = "";
  document.getElementById("saveBtn").textContent = "Thêm";
}

// Tải dữ liệu khi load trang
document.addEventListener("DOMContentLoaded", function () {
  fetchServices();
});

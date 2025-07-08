// Lấy danh sách dịch vụ
function fetchServices() {
  fetch("/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=getAll")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("serviceTableBody");
      tbody.innerHTML = "";

      if (data.success && Array.isArray(data.services)) {
        data.services.forEach((service) => {
          tbody.innerHTML += `
            <tr>
              <td>${service.serviceID}</td>
              <td>${service.name}</td>
              <td>${service.price}</td>
              <td>${service.description}</td>
              <td>${service.categoryID}</td>
              <td>
                <button class="action-btn" onclick='editService(${JSON.stringify(
                  service
                )})'>Sửa</button>
                <button class="action-btn" onclick="deleteService('${service.serviceID}')">Xóa</button>
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
    });
}

// Thêm/Sửa dịch vụ
document.getElementById("serviceForm").onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  let action = formData.get("serviceID") ? "update" : "add";

  fetch(`/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=${action}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        fetchServices();
        resetForm();
      } else {
        alert(result.message || "Có lỗi xảy ra!");
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gửi form:", error);
    });
};

// Sửa (điền dữ liệu lên form)
function editService(service) {
  document.getElementById("serviceID").value = service.serviceID;
  document.getElementById("name").value = service.name;
  document.getElementById("price").value = service.price;
  document.getElementById("description").value = service.description;
  document.getElementById("categoryID").value = service.categoryID;
}

// Xóa dịch vụ
function deleteService(serviceID) {
  if (confirm("Bạn có chắc muốn xóa?")) {
    fetch("/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=delete", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `serviceID=${encodeURIComponent(serviceID)}`,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          fetchServices();
        } else {
          alert(result.message || "Xóa thất bại!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi xóa dịch vụ:", error);
      });
  }
}

// Reset form
function resetForm() {
  document.getElementById("serviceForm").reset();
  document.getElementById("serviceID").value = "";
}

// Tải dữ liệu khi load trang
fetchServices();

// Lấy danh sách dịch vụ
function fetchServices() {
  fetch("/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=getAll")
    .then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        return res.json();
    })
    .then((data) => {
      const tbody = document.getElementById("serviceTableBody");
      tbody.innerHTML = "";

      if (data.success && Array.isArray(data.services)) {
        data.services.forEach((service) => {
          // Ensure serviceID is treated as a number if it's int in DB
          const serviceID = parseInt(service.serviceID);
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
  const serviceID = document.getElementById("serviceID").value; // Get the ID directly

  const action = serviceID ? "update" : "add"; // Determine action
  let bodyData;
  let headers = {};

  if (action === "update") {
      // For update, send JSON body for compatibility with PHP's json_decode
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
      // For add, still use FormData as before (PHP $_POST handles it)
      bodyData = formData;
      // No specific Content-Type header needed for FormData; browser sets it to multipart/form-data
  }


  fetch(`/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=${action}`, {
    method: "POST", // POST is suitable for both add and update as per your controller
    headers: headers,
    body: bodyData
  })
    .then(res => {
        if (!res.ok) {
            // Handle HTTP errors
            return res.text().then(text => { throw new Error(text || 'Network response was not ok'); });
        }
        return res.json();
    })
    .then(data => {
      console.log("📦 Server response data:", data); // Log the parsed JSON
      if (data.success) {
        alert(data.message);
        fetchServices(); // Refresh table
        resetForm(); // Reset form
      } else {
        alert(data.message || "Có lỗi xảy ra.");
      }
    })
    .catch(err => {
      console.error("❌ Lỗi khi gửi form:", err);
      try {
          const errorData = JSON.parse(err.message); // Try to parse error message if it's JSON from PHP
          alert("Lỗi: " + (errorData.message || "Không thể xử lý yêu cầu."));
      } catch (e) {
          alert("Lỗi kết nối hoặc dữ liệu không hợp lệ: " + err.message);
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
  // Change button text to "Cập nhật"
  document.getElementById("saveBtn").textContent = "Cập nhật";
}

// Xóa dịch vụ
function deleteService(serviceID) {
  if (confirm("Bạn có chắc muốn xóa?")) {
    fetch("/laptrinhweb/AutoServices/app/controllers/ServiceController.php?action=delete", {
      method: "POST", // Or 'DELETE' if your server supports it and you configure it
      headers: { "Content-Type": "application/json" }, // <--- CHANGED to application/json
      body: JSON.stringify({ serviceID: serviceID }), // <--- CHANGED to JSON string
    })
      .then((res) => {
          if (!res.ok) {
              throw new Error('Network response was not ok ' + res.statusText);
          }
          return res.json();
      })
      .then((result) => {
        if (result.success) {
          alert(result.message || "Xóa dịch vụ thành công!");
          fetchServices(); // Refresh table
          resetForm(); // Reset form (important for cases where deleted item was being edited)
        } else {
          alert(result.message || "Xóa thất bại!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi xóa dịch vụ:", error);
        alert("Lỗi khi xóa dịch vụ: " + error.message);
      });
  }
}

// Reset form
function resetForm() {
  document.getElementById("serviceForm").reset();
  document.getElementById("serviceID").value = ""; // Clear hidden ID field
  document.getElementById("saveBtn").textContent = "Thêm"; // Reset button text
}

// Tải dữ liệu khi load trang
document.addEventListener("DOMContentLoaded", function () {
  fetchServices();
});
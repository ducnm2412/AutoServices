// Lấy danh sách phụ tùng
function fetchParts() {
  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=getAll")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("partTableBody");
      tbody.innerHTML = "";

      if (data.success && Array.isArray(data.parts)) {
        data.parts.forEach((part) => {
          tbody.innerHTML += `
            <tr>
              <td>${part.partID}</td>
              <td>${part.name}</td>
              <td>${part.price}</td>
              <td>${part.quantity}</td>
              <td><img src="${part.images}" alt="Ảnh" width="60" style="object-fit:cover; border-radius:6px;"></td>
              <td>${part.categoryID}</td>
              <td>
                <button class="action-btn edit-btn" onclick='editPart(${JSON.stringify(part)})'>Sửa</button>
                <button class="action-btn delete-btn" onclick="deletePart(${part.partID})">Xóa</button>
              </td>
            </tr>
          `;
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="7">Không có phụ tùng nào.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách phụ tùng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tải danh sách phụ tùng."
      });
    });
}

// Thêm/Sửa phụ tùng
document.getElementById("partForm").onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  let action = formData.get("partID") ? "update" : "add";

  if (action === "add") {
    formData.delete("partID");
  }

  fetch(`/laptrinhweb/AutoServices/app/controllers/PartController.php?action=${action}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      Swal.fire({
        icon: data.success ? "success" : "error",
        title: data.success ? "Thành công!" : "Thất bại!",
        text: data.message || "Đã xảy ra lỗi."
      });

      if (data.success) {
        fetchParts();
        resetForm();
      }
    })
    .catch((error) => {
      console.error("Lỗi khi thêm/sửa phụ tùng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi thực hiện thao tác."
      });
    });
};

// Sửa phụ tùng - Điền dữ liệu vào form
function editPart(part) {
  document.getElementById("partID").value = part.partID;
  document.getElementById("name").value = part.name;
  document.getElementById("price").value = part.price;
  document.getElementById("quantity").value = part.quantity;
  document.getElementById("images").value = part.images;
  document.getElementById("categoryID").value = part.categoryID;
  document.getElementById("saveBtn").textContent = "Cập nhật";
}

// Xóa phụ tùng
function deletePart(partID) {
  Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Thao tác này sẽ không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#aaa"
  }).then((result) => {
    if (result.isConfirmed) {
      confirmDeleteAction(partID);
    }
  });
}

// Gửi yêu cầu xóa
function confirmDeleteAction(partID) {
  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=delete", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `partID=${encodeURIComponent(partID)}`,
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      Swal.fire({
        icon: data.success ? "success" : "error",
        title: data.success ? "Đã xóa!" : "Xóa thất bại!",
        text: data.message || "Có lỗi xảy ra."
      });

      if (data.success) {
        fetchParts();
        resetForm();
      }
    })
    .catch((error) => {
      console.error("Lỗi khi xóa phụ tùng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể xóa phụ tùng: " + error.message
      });
    });
}

// Reset form
function resetForm() {
  document.getElementById("partForm").reset();
  document.getElementById("partID").value = "";
  document.getElementById("saveBtn").textContent = "Thêm";
}

// Tải dữ liệu khi load trang
fetchParts();

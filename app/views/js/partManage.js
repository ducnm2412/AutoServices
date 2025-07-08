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
    });
}


// Thêm/Sửa phụ tùng
document.getElementById("partForm").onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  let action = formData.get("partID") ? "update" : "add"; // Determine if it's an update or add operation

  // If adding, and partID is auto-increment, ensure it's not sent
  if (action === "add") {
    formData.delete("partID"); // Remove partID from formData for 'add' operation
  }

  fetch(`/laptrinhweb/AutoServices/app/controllers/PartController.php?action=${action}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert(data.message); // Use a simple alert for success/failure messages
      } else {
        alert(data.message);
      }
      fetchParts(); // Refresh the list of parts
      resetForm(); // Clear the form
    })
    .catch((error) => {
      console.error("Lỗi khi thêm/sửa phụ tùng:", error);
      alert("Đã xảy ra lỗi khi thực hiện thao tác.");
    });
};

// Sửa phụ tùng - Populates the form with existing part data
function editPart(part) {
  document.getElementById("partID").value = part.partID;
  document.getElementById("name").value = part.name;
  document.getElementById("price").value = part.price;
  document.getElementById("quantity").value = part.quantity;
  document.getElementById("images").value = part.images;
  document.getElementById("categoryID").value = part.categoryID;
  document.getElementById("saveBtn").textContent = "Cập nhật"; // Change button text
}

// Xóa phụ tùng - Shows the custom confirmation modal
function deletePart(partID) {
  // Thêm xác nhận bằng confirm() để tránh xóa nhầm.
  // Nếu bạn không muốn hộp thoại xác nhận, bạn có thể bỏ qua dòng if này.
  if (confirm("Bạn có chắc chắn muốn xóa phụ tùng này không?")) {
    confirmDeleteAction(partID);
  }
}

// Function to execute the delete action (logic không đổi)
function confirmDeleteAction(partID) {
  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=delete", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `partID=${encodeURIComponent(partID)}`,
  })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`Network response was not ok (${res.status})`);
        }
        return res.json();
    })
    .then((data) => {
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      }
      fetchParts(); // Refresh the list of parts
      resetForm(); // Clear the form
    })
    .catch((error) => {
      console.error("Lỗi khi xóa phụ tùng:", error);
      alert("Đã xảy ra lỗi khi xóa phụ tùng: " + error.message);
    });
}

// Reset form - Clears all input fields
function resetForm() {
  document.getElementById("partForm").reset();
  document.getElementById("partID").value = ""; // Ensure hidden partID is also cleared
  document.getElementById("saveBtn").textContent = "Thêm"; // Reset button text
}


// Tải dữ liệu khi load trang
fetchParts();

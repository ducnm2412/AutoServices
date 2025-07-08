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
                <button class="action-btn" onclick='editPart(${JSON.stringify(part)})'>Sửa</button>
                <button class="action-btn" onclick="deletePart('${part.partID}')">Xóa</button>
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
  let action = formData.get("partID") ? "update" : "add";
  fetch(`/laptrinhweb/AutoServices/app/controllers/PartController.php?action=${action}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      fetchParts();
      resetForm();
    });
};

// Sửa
function editPart(part) {
  document.getElementById("partID").value = part.partID;
  document.getElementById("name").value = part.name;
  document.getElementById("price").value = part.price;
  document.getElementById("quantity").value = part.quantity;
  document.getElementById("images").value = part.images;
  document.getElementById("categoryID").value = part.categoryID;
}

// Xóa
function deletePart(partID) {
  if (confirm("Bạn có chắc muốn xóa?")) {
    fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=delete", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `partID=${encodeURIComponent(partID)}`,
    })
      .then((res) => res.json())
      .then(() => fetchParts());
  }
}

// Reset form
function resetForm() {
  document.getElementById("partForm").reset();
  document.getElementById("partID").value = "";
}

// Tải dữ liệu khi load trang
fetchParts();

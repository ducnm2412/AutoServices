fetch("/laptrinhweb/AutoServices/app/controllers/FeedbackController.php?action=getAllWithUserInfo")
  .then((res) => res.json())
  .then((result) => {
    const tableBody = document.getElementById("feedbackTableBody");

    if (!result.success) {
      tableBody.innerHTML = `<tr><td colspan="6">${result.message || "Không thể tải dữ liệu!"}</td></tr>`;
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: result.message || "Không thể tải dữ liệu phản hồi từ máy chủ.",
      });
      return;
    }

    const feedbacks = result.feedbacks;

    if (!feedbacks.length) {
      tableBody.innerHTML =
        '<tr><td colspan="6">Không có phản hồi nào.</td></tr>';
      return;
    }

    tableBody.innerHTML = feedbacks
      .map(
        (fb) => `
      <tr>
        <td>${fb.feedbackID}</td>
        <td>${fb.userName}</td>
        <td>${fb.userEmail}</td>
        <td>${fb.content}</td>
        <td>${fb.rating || ""}</td>
        <td>${fb.feedbackDate}</td>
      </tr>`
      )
      .join("");
  })
  .catch((error) => {
    console.error("Lỗi khi tải phản hồi:", error);
    document.getElementById("feedbackTableBody").innerHTML =
      '<tr><td colspan="6">Lỗi khi tải dữ liệu!</td></tr>';
    Swal.fire({
      icon: "error",
      title: "Lỗi kết nối!",
      text: "Không thể kết nối tới máy chủ hoặc phản hồi không hợp lệ.",
    });
  });

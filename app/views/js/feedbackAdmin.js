fetch("/laptrinhweb/AutoServices/app/controllers/FeedbackController.php?action=getAllWithUserInfo")
  .then((res) => res.json())
  .then((result) => {
    if (!result.success) {
      document.getElementById(
        "feedbackTableBody"
      ).innerHTML = `<tr><td colspan="6">${
        result.message || "Không thể tải dữ liệu!"
      }</td></tr>`;
      return;
    }
    const feedbacks = result.feedbacks;
    if (!feedbacks.length) {
      document.getElementById("feedbackTableBody").innerHTML =
        '<tr><td colspan="6">Không có phản hồi nào.</td></tr>';
      return;
    }
    document.getElementById("feedbackTableBody").innerHTML = feedbacks
      .map(
        (fb) => `
      <tr>
        <td>${fb.feedbackID}</td>
        <td>${fb.userName}</td>
        <td>${fb.userEmail}</td>
        <td>${fb.content}</td>
        <td>${fb.rating || ""}</td>
        <td>${fb.feedbackDate}</td>
      </tr>
    `
      )
      .join("");
  })
  .catch(() => {
    document.getElementById("feedbackTableBody").innerHTML =
      '<tr><td colspan="6">Lỗi khi tải dữ liệu!</td></tr>';
  });

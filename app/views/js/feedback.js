// feedback.js
function initFeedback() {
  console.log("✅ Đã gọi initFeedback()");

  const form = document.getElementById("feedbackForm");
  if (!form) {
    console.warn("⚠️ Không tìm thấy form feedback!");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const orderID = document.getElementById("orderID").value.trim();
    const content = document.getElementById("feedback").value.trim();
    const rating = document.querySelector('input[name="rating"]:checked')?.value;

    const messageBox = document.getElementById("messageBox");

    if (!rating) {
      messageBox.textContent = "⚠️ Vui lòng chọn số sao đánh giá!";
      messageBox.style.color = "red";
      return;
    }

    fetch("/laptrinhweb/AutoServices/app/controllers/FeedbackController.php?action=submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID,
        content,
        rating: parseInt(rating)
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          messageBox.textContent = "✅ Gửi phản hồi thành công!";
          messageBox.style.color = "green";
          form.reset();
        } else {
          messageBox.textContent = "❌ " + (data.message || "Gửi thất bại!");
          messageBox.style.color = "red";
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi gửi phản hồi:", err);
        messageBox.textContent = "Lỗi kết nối đến server!";
        messageBox.style.color = "red";
      });
  });
}

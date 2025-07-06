
const form = document.getElementById("feedbackForm");
const messageBox = document.getElementById("messageBox");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
    orderID: document.getElementById("orderID").value.trim(),
    content: document.getElementById("content").value.trim(),
    rating: document.querySelector("input[name='rating']:checked")?.value,
    };

    // Validate rating selection
    if (!payload.rating) {
    messageBox.textContent = "Vui lòng chọn số sao đánh giá.";
    messageBox.className = "message error";
    messageBox.style.display = "block";
    return;
    }

    // Reset message box
    messageBox.style.display = "none";
    messageBox.textContent = "";

    try {
    const response = await fetch(
        "/controllers/FeedbackController.php?action=submit",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (data.success) {
        messageBox.textContent = data.message;
        messageBox.className = "message success";
        form.reset();
    } else {
        throw new Error(data.message);
    }
    } catch (err) {
    messageBox.textContent = err.message || "Có lỗi xảy ra. Vui lòng thử lại.";
    messageBox.className = "message error";
    }

    messageBox.style.display = "block";
});

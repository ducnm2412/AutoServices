document.addEventListener("DOMContentLoaded", function () {
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });
});

// Khởi tạo danh sách phản hồi từ localStorage hoặc dữ liệu mẫu
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [
    { name: "Nguyễn Văn A", rating: 5, comment: "Dịch vụ tuyệt vời, rất hài lòng!" },
    { name: "Trần Thị B", rating: 4, comment: "Tốt, nhưng có thể cải thiện tốc độ." },
    { name: "Lê Văn C", rating: 3, comment: "Bình thường, cần thêm tính năng mới." },
    { name: "Phạm Thị D", rating: 5, comment: "Rất chuyên nghiệp, sẽ quay lại!" },
    { name: "Hoàng Văn E", rating: 2, comment: "Cần cải thiện dịch vụ khách hàng." }
];

// Hàm lưu phản hồi vào localStorage
function saveFeedbacks() {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

// Hàm hiển thị phản hồi
function displayFeedbacks(limit = 3) {
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '<h2>Phản Hồi Từ Người Dùng</h2>'; // Reset danh sách
    feedbacks.forEach((fb, index) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');
        if (index >= limit) feedbackItem.classList.add('hidden');
        feedbackItem.innerHTML = `
            <h3>${fb.name}</h3>
            <div class="stars">${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</div>
            <p>${fb.comment}</p>
        `;
        feedbackList.appendChild(feedbackItem);
    });

    // Hiển thị nút "Xem tất cả" nếu có nhiều hơn 3 phản hồi
    const viewAllButton = document.getElementById('viewAll');
    viewAllButton.style.display = feedbacks.length > limit ? 'block' : 'none';
}

// Hàm hiển thị tất cả phản hồi
function showAllFeedbacks() {
    const feedbackItems = document.querySelectorAll('.feedback-item');
    feedbackItems.forEach(item => item.classList.remove('hidden'));
    document.getElementById('viewAll').style.display = 'none';
}

// Gọi hàm hiển thị khi trang tải
window.onload = () => {
    displayFeedbacks();
};

// Xử lý submit form
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById('feedback').value;
    
    if (name && rating && comment) {
        feedbacks.unshift({ name, rating: parseInt(rating), comment });
        saveFeedbacks(); // Lưu vào localStorage
        displayFeedbacks(); // Làm mới danh sách
        this.reset(); // Reset form
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const servicesGrid = document.getElementById('servicesGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const noServicesMessage = document.getElementById('noServicesMessage');

    // Đường dẫn đến ServiceController.php của bạn
    // Cập nhật đường dẫn này cho phù hợp với cấu trúc thư mục của bạn
    const API_BASE_URL = "/laptrinhweb/AutoServices/app/controllers/ServiceController.php";

    let currentCategoryID = ''; // Biến để lưu trữ categoryID hiện tại

    // Hàm để tạo một thẻ dịch vụ
    function createServiceCard(service) {
        // Định dạng giá (nếu có)
        // Nếu service.price là 'Liên hệ', hiển thị "Liên hệ".
        // Nếu là số, định dạng theo tiền tệ Việt Nam.
        const priceDisplay = isNaN(parseFloat(service.price))
            ? `<p class="price-value contact-price">${service.price}</p>` // Nếu không phải số (ví dụ 'Liên hệ')
            : `<p class="price-value">${new Intl.NumberFormat('vi-VN').format(service.price)}<span class="currency">VNĐ</span></p>`;

        // Xử lý mô tả để hiển thị danh sách chi tiết
        // Giả định service.description có thể là một chuỗi JSON của mảng hoặc một chuỗi văn bản thông thường
        let descriptionHtml = '';
        try {
            const details = JSON.parse(service.description);
            if (Array.isArray(details)) {
                // Nếu là một mảng JSON, tạo các li item
                descriptionHtml = details.map(detail => `
                    <li><i class="fas fa-check-circle check-icon"></i> ${detail}</li>
                `).join('');
            } else {
                // Nếu không phải mảng JSON, coi là chuỗi và chia theo dòng
                descriptionHtml = service.description.split('\n').map(line => {
                    if (line.trim() === '') return ''; // Bỏ qua dòng trống
                    return `<li><i class="fas fa-check-circle check-icon"></i> ${line.trim()}</li>`;
                }).join('');
            }
        } catch (e) {
            // Nếu không thể parse JSON (là chuỗi văn bản thuần), chia theo dòng
            descriptionHtml = service.description.split('\n').map(line => {
                if (line.trim() === '') return '';
                return `<li><i class="fas fa-check-circle check-icon"></i> ${line.trim()}</li>`;
            }).join('');
        }

        const card = document.createElement('div');
        card.classList.add('service-card');
        card.innerHTML = `
            <div class="card-header">
                <i class="fas fa-cog gear-icon"></i>
                <h3 class="service-title">${service.name}</h3>
            </div>
            <div class="card-price-time">
                <p class="price-label">MỨC GIÁ / THỜI GIAN</p>
                ${priceDisplay}
                <p class="time-value">/${service.time || 'Thời gian chưa xác định'}</p>
            </div>
            <ul class="service-details">
                ${descriptionHtml}
            </ul>
            <button class="order-btn">Đặt dịch vụ</button>
        `;
        return card;
    }

    // Hàm để fetch và hiển thị dịch vụ
    async function fetchServices(categoryID = '') {
        servicesGrid.innerHTML = ''; // Xóa các thẻ dịch vụ cũ
        loadingMessage.style.display = 'block'; // Hiện thông báo loading
        errorMessage.style.display = 'none'; // Ẩn thông báo lỗi
        noServicesMessage.style.display = 'none'; // Ẩn thông báo không có dịch vụ

        let url = '';
        if (categoryID) {
            url = `${API_BASE_URL}?action=getByCategory&categoryID=${categoryID}`;
        } else {
            url = `${API_BASE_URL}?action=getAll`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success && data.services && data.services.length > 0) {
                data.services.forEach(service => {
                    servicesGrid.appendChild(createServiceCard(service));
                });
            } else if (data.success && data.services && data.services.length === 0) {
                noServicesMessage.style.display = 'block'; // Hiện thông báo không có dịch vụ
            } else {
                throw new Error(data.message || 'Lỗi không xác định từ server.');
            }
        } catch (error) {
            console.error('Lỗi khi tải dịch vụ:', error);
            errorMessage.style.display = 'block'; // Hiện thông báo lỗi
        } finally {
            loadingMessage.style.display = 'none'; // Ẩn thông báo loading
        }
    }

    // Gán sự kiện cho các nút lọc
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Loại bỏ class 'active' khỏi tất cả các nút
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm class 'active' vào nút được click
            button.classList.add('active');

            currentCategoryID = button.dataset.categoryId;
            fetchServices(currentCategoryID);
        });
    });

    // Lần đầu tải trang, fetch tất cả dịch vụ
    fetchServices();
});
<?php
require_once __DIR__ . '/../repository/FeedbackRepository.php';

class FeedbackService {
    private $feedbackRepository;

    public function __construct() {
        $this->feedbackRepository = new FeedbackRepository();
    }

    // Tạo feedback mới (có thể thêm validate ở đây)
    public function createFeedback($orderID, $userID, $content, $rating, $feedbackDate) {
        // Validate dữ liệu đầu vào
        if (empty($orderID) || empty($userID) || empty($content) || empty($rating) || empty($feedbackDate)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin phản hồi!'];
        }
        if ($rating < 1 || $rating > 5) {
            return ['success' => false, 'message' => 'Rating phải từ 1 đến 5!'];
        }
        // Kiểm tra user đã feedback cho order này chưa
        if ($this->feedbackRepository->hasUserFeedbackedOrder($userID, $orderID)) {
            return ['success' => false, 'message' => 'Bạn đã gửi feedback cho đơn hàng này rồi!'];
        }
        $result = $this->feedbackRepository->create($orderID, $userID, $content, $rating, $feedbackDate);
        if ($result) {
            return ['success' => true, 'message' => 'Gửi feedback thành công!'];
        } else {
            return ['success' => false, 'message' => 'Có lỗi khi gửi feedback!'];
        }
    }

    // Lấy tất cả feedback
    public function getAllFeedbacks() {
        return $this->feedbackRepository->getAll();
    }

    // Lấy tất cả feedback kèm thông tin user
    public function getAllFeedbacksWithUserInfo() {
        return $this->feedbackRepository->getAllWithUserInfo();
    }

    // Lấy feedback theo userID
    public function getFeedbacksByUserID($userID) {
        return $this->feedbackRepository->getByUserID($userID);
    }

    // Lấy feedback theo orderID
    public function getFeedbacksByOrderID($orderID) {
        return $this->feedbackRepository->getByOrderID($orderID);
    }

    // Lấy feedback theo bộ lọc
    public function getFeedbacksByFilters($filters) {
        return $this->feedbackRepository->getByFilters($filters);
    }

    // Lấy feedback theo rating
    public function getFeedbacksByRating($rating) {
        return $this->feedbackRepository->getByRating($rating);
    }

    // Lấy feedback theo khoảng rating
    public function getFeedbacksByRatingRange($minRating, $maxRating) {
        return $this->feedbackRepository->getByRatingRange($minRating, $maxRating);
    }

    // Lấy feedback theo khoảng thời gian
    public function getFeedbacksByDateRange($startDate, $endDate) {
        return $this->feedbackRepository->getByDateRange($startDate, $endDate);
    }

    // Đếm số lượng feedback
    public function countFeedbacks() {
        return $this->feedbackRepository->count();
    }

    // Đếm số lượng feedback theo userID
    public function countFeedbacksByUserID($userID) {
        return $this->feedbackRepository->countByUserID($userID);
    }

    // Tính rating trung bình
    public function getAverageRating() {
        return $this->feedbackRepository->getAverageRating();
    }

    // Tính rating trung bình theo userID
    public function getAverageRatingByUser($userID) {
        return $this->feedbackRepository->getAverageRatingByUser($userID);
    }
}
?> 
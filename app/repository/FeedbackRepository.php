<?php
require_once __DIR__ . '/../models/FeedbackModel.php';

class FeedbackRepository {
    private $feedbackModel;

    public function __construct() {
        $this->feedbackModel = new FeedbackModel();
    }

    // Tạo feedback mới
    public function create($orderID, $userID, $content, $rating, $feedbackDate) {
        return $this->feedbackModel->submitFeedback($orderID, $userID, $content, $rating, $feedbackDate);
    }

    // Lấy tất cả feedback
    public function getAll() {
        return $this->feedbackModel->getAllFeedbacks();
    }

    // Lấy tất cả feedback với thông tin user
    public function getAllWithUserInfo() {
        return $this->feedbackModel->getAllFeedbacksWithUserInfo();
    }

    // Lấy feedback theo userID
    public function getByUserID($userID) {
        return $this->feedbackModel->getFeedbacksByUserID($userID);
    }

    // Lấy feedback theo bộ lọc
    public function getByFilters($filters) {
        return $this->feedbackModel->getFeedbacksByFilters($filters);
    }

    // Lấy feedback theo orderID
    public function getByOrderID($orderID) {
        return $this->getByFilters(['orderID' => $orderID]);
    }

    // Lấy feedback theo userID và orderID
    public function getByUserAndOrder($userID, $orderID) {
        return $this->getByFilters([
            'userID' => $userID,
            'orderID' => $orderID
        ]);
    }

    // Kiểm tra user đã feedback cho order này chưa
    public function hasUserFeedbackedOrder($userID, $orderID) {
        $feedbacks = $this->getByUserAndOrder($userID, $orderID);
        return !empty($feedbacks);
    }

    // Lấy feedback theo rating
    public function getByRating($rating) {
        // Thêm filter rating vào getFeedbacksByFilters nếu cần
        // Hoặc tạo method riêng trong model
        $allFeedbacks = $this->getAll();
        return array_filter($allFeedbacks, function($feedback) use ($rating) {
            return $feedback['rating'] == $rating;
        });
    }

    // Lấy feedback theo khoảng rating
    public function getByRatingRange($minRating, $maxRating) {
        $allFeedbacks = $this->getAll();
        return array_filter($allFeedbacks, function($feedback) use ($minRating, $maxRating) {
            return $feedback['rating'] >= $minRating && $feedback['rating'] <= $maxRating;
        });
    }

    // Lấy feedback theo khoảng thời gian
    public function getByDateRange($startDate, $endDate) {
        $allFeedbacks = $this->getAll();
        return array_filter($allFeedbacks, function($feedback) use ($startDate, $endDate) {
            $feedbackDate = $feedback['feedbackDate'];
            return $feedbackDate >= $startDate && $feedbackDate <= $endDate;
        });
    }

    // Đếm số lượng feedback
    public function count() {
        $feedbacks = $this->getAll();
        return count($feedbacks);
    }

    // Đếm số lượng feedback theo userID
    public function countByUserID($userID) {
        $feedbacks = $this->getByUserID($userID);
        return count($feedbacks);
    }

    // Tính rating trung bình
    public function getAverageRating() {
        $feedbacks = $this->getAll();
        if (empty($feedbacks)) {
            return 0;
        }
        
        $totalRating = 0;
        foreach ($feedbacks as $feedback) {
            $totalRating += $feedback['rating'];
        }
        
        return round($totalRating / count($feedbacks), 2);
    }

    // Tính rating trung bình theo userID
    public function getAverageRatingByUser($userID) {
        $feedbacks = $this->getByUserID($userID);
        if (empty($feedbacks)) {
            return 0;
        }
        
        $totalRating = 0;
        foreach ($feedbacks as $feedback) {
            $totalRating += $feedback['rating'];
        }
        
        return round($totalRating / count($feedbacks), 2);
    }
}
?> 
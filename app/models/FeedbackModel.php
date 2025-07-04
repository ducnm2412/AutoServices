<?php
require_once 'core/Database.php';

class FeedbackModel extends Database {
    // Gửi phản hồi
    public function submitFeedback($orderID, $userID, $content, $rating, $feedbackDate) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Feedback (orderID, userID, content, rating, feedbackDate) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("sssis", $orderID, $userID, $content, $rating, $feedbackDate);
        return $stmt->execute();
    }

    // Lấy tất cả phản hồi
    public function getAllFeedbacks() {
        $sql = "SELECT * FROM Feedback";
        $result = $this->conn->query($sql);
        $feedbacks = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $feedbacks[] = $row;
            }
        }
        return $feedbacks;
    }
    // Thêm hàm này vào trong class FeedbackModel
public function getFeedbacksByFilters($filters) {
    $sql = "SELECT * FROM Feedback WHERE 1=1";
    $params = [];
    $types = "";

    if (!empty($filters['userID'])) {
        $sql .= " AND userID = ?";
        $params[] = $filters['userID'];
        $types .= "s";
    }

    if (!empty($filters['orderID'])) {
        $sql .= " AND orderID = ?";
        $params[] = $filters['orderID'];
        $types .= "s";
    }

    $sql .= " ORDER BY feedbackDate DESC";

    $stmt = $this->conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $feedbacks = [];
    while ($row = $result->fetch_assoc()) {
        $feedbacks[] = $row;
    }
    return $feedbacks;
}
}
?> 
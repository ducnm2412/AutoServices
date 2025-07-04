<?php
require_once 'core/Database.php';

class AdminModel extends Database {
    public function addAdmin($userID, $role) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Admin (userID, role) VALUES (?, ?)"
        );
        $stmt->bind_param("ss", $userID, $role);
        if ($stmt->execute()) {
            return "Thêm admin thành công!";
        } else {
            return "Lỗi khi thêm admin: " . $stmt->error;
        }
    }

    public function getAllAdmins() {
        $sql = "SELECT * FROM Admin";
        $result = $this->conn->query($sql);
        $admins = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $admins[] = $row;
            }
        }
        return $admins;
    }

    // Quản lý dịch vụ
    public function manageServices() {
        $sql = "SELECT * FROM Service";
        $result = $this->conn->query($sql);
        $services = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $services[] = $row;
            }
        }
        return $services;
    }

    // Quản lý phụ tùng
    public function manageParts() {
        $sql = "SELECT * FROM Part";
        $result = $this->conn->query($sql);
        $parts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $parts[] = $row;
            }
        }
        return $parts;
    }

    // Xem đơn hàng đã thanh toán
    public function viewPaidOrders() {
        $sql = "SELECT * FROM `Order` WHERE status = 'paid'";
        $result = $this->conn->query($sql);
        $orders = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
        }
        return $orders;
    }

    // Xem phản hồi
    public function viewFeedback() {
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
}
?>
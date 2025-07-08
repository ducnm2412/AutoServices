<?php
require_once __DIR__ . '/../../core/Database.php';

class PaymentModel extends Database {
    // Xử lý thanh toán (lưu thông tin thanh toán)
    public function processPayment($orderID, $amount, $paymentMethodID) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Payment (orderID, amount, paymentMethod) VALUES (?, ?, ?)"
        );
        // paymentMethod giờ là INT (ID của PaymentCategory)
        $stmt->bind_param("idi", $orderID, $amount, $paymentMethodID);
        if ($stmt->execute()) {
            return $this->conn->insert_id; // trả về paymentID vừa tạo
        } else {
            return false;
        }
    }

    // Lấy thông tin hóa đơn/thanh toán theo paymentID
    public function generateInvoice($paymentID) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM Payment WHERE paymentID = ?"
        );
        $stmt->bind_param("i" , $paymentID);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // (Tuỳ chọn) Lấy thông tin hóa đơn/thanh toán theo orderID
    public function getPaymentByOrder($orderID) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM Payment WHERE orderID = ?"
        );
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // (Tuỳ chọn) Lấy tên phương thức thanh toán từ bảng PaymentCategory
    public function getPaymentMethodName($paymentMethodID) {
        $stmt = $this->conn->prepare(
            "SELECT methodName FROM PaymentCategory WHERE paymentCategoryID = ?"
        );
        $stmt->bind_param("i", $paymentMethodID);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row ? $row['methodName'] : null;
    }
}
?>
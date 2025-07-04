<?php
require_once 'core/Database.php';

class PaymentModel extends Database {
    // Xử lý thanh toán (lưu thông tin thanh toán)
    public function processPayment($orderID, $amount, $paymentMethod) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Payment (orderID, amount, paymentMethod) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("ids", $orderID, $amount, $paymentMethod);
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
        $stmt->bind_param("i", $paymentID);
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
}
?> 
<?php
require_once __DIR__ . '/../../core/Database.php';

class CustomerModel extends Database {

    // Đặt dịch vụ
    public function bookServices($customerID, $serviceID, $date, $note = "") {
        $stmt = $this->conn->prepare(
            "INSERT INTO `Order` (customerID, serviceID, date, note, status) VALUES (?, ?, ?, ?, 'pending')"
        );
        $stmt->bind_param("ssss", $customerID, $serviceID, $date, $note);
        return $stmt->execute();
    }

    // Xem lịch sử đặt hàng
    public function viewOrderHistory($userID) {
        $sql = "SELECT * FROM `Order` WHERE userID = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
        }
        return $orders;
    }

    // Thanh toán đơn hàng
    public function makePayment($orderID, $paymentInfo) {
        $stmt = $this->conn->prepare(
            "UPDATE `Order` SET status = 'paid', paymentInfo = ? WHERE orderID = ?"
        );
        $stmt->bind_param("ss", $paymentInfo, $orderID);
        return $stmt->execute();
    }

    // Đếm số lượng khách hàng
    public function countCustomers() {
        $sql = "SELECT COUNT(*) as total FROM User WHERE role = 'customer'";
        $result = $this->conn->query($sql);
        return $result->fetch_assoc()['total'] ?? 0;
    }
}
?>
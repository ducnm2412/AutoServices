<?php
require_once 'core/Database.php';

class OrderModel extends Database {
    // Tạo đơn hàng mới
    public function createOrder($userID, $orderDate, $totalAmount, $status = 'pending') {
        $stmt = $this->conn->prepare(
            "INSERT INTO `Order` (userID, orderDate, totalAmount, status) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("ssds", $userID, $orderDate, $totalAmount, $status);
        $stmt->execute();
        return $this->conn->insert_id; // trả về orderID vừa tạo
    }

    // Thêm dịch vụ vào đơn hàng
    public function addServiceToOrder($orderID, $serviceID) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Order_Service (orderID, serviceID) VALUES (?, ?)"
        );
        $stmt->bind_param("is", $orderID, $serviceID);
        return $stmt->execute();
    }

    // Thêm thiết bị/phụ tùng vào đơn hàng
    public function addPartToOrder($orderID, $partID) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Order_Part (orderID, partID) VALUES (?, ?)"
        );
        $stmt->bind_param("is", $orderID, $partID);
        return $stmt->execute();
    }

    // Thanh toán (checkout): tạo đơn hàng từ session giỏ hàng
    public function checkout($userID, $cart) {
        $orderDate = date('Y-m-d');
        $totalAmount = 0;
        foreach ($cart as $item) {
            $totalAmount += $item['price'];
        }
        $orderID = $this->createOrder($userID, $orderDate, $totalAmount, 'pending');
        foreach ($cart as $item) {
            if ($item['type'] == 'service') {
                $this->addServiceToOrder($orderID, $item['id']);
            } else if ($item['type'] == 'part') {
                $this->addPartToOrder($orderID, $item['id']);
            }
        }
        return $orderID;
    }

    // Sinh hóa đơn (trả về thông tin đơn hàng và chi tiết)
    public function generateInvoice($orderID) {
        // Lấy thông tin đơn hàng
        $stmt = $this->conn->prepare("SELECT * FROM `Order` WHERE orderID = ?");
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $order = $stmt->get_result()->fetch_assoc();

        // Lấy danh sách dịch vụ
        $services = [];
        $sql = "SELECT s.* FROM Service s JOIN Order_Service os ON s.serviceID = os.serviceID WHERE os.orderID = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }

        // Lấy danh sách phụ tùng
        $parts = [];
        $sql = "SELECT p.* FROM Part p JOIN Order_Part op ON p.partID = op.partID WHERE op.orderID = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $parts[] = $row;
        }

        return [
            'order' => $order,
            'services' => $services,
            'parts' => $parts
        ];
    }

    // Lấy tất cả đơn hàng (cho admin)
    public function getAllOrders() {
        $sql = "SELECT * FROM `Order` ORDER BY orderDate DESC";
        $result = $this->conn->query($sql);
        $orders = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
        }
        return $orders;
    }

    // Cập nhật trạng thái đơn hàng
    public function updateStatus($orderID, $status) {
        $stmt = $this->conn->prepare(
            "UPDATE `Order` SET status = ? WHERE orderID = ?"
        );
        $stmt->bind_param("si", $status, $orderID);
        return $stmt->execute();
    }
}
?> 
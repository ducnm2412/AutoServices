<?php
require_once __DIR__ . '/../../core/Database.php';

class OrderModel extends Database
{
    // Tạo đơn hàng mới
    public function createOrder($userID, $orderDate, $totalAmount, $status = 'pending')
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO `Order` (userID, orderDate, totalAmount, status) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("ssds", $userID, $orderDate, $totalAmount, $status);
        $stmt->execute();
        return $this->conn->insert_id; // trả về orderID vừa tạo
    }

    // Thêm phụ tùng vào đơn hàng (có quantity)
    public function addPartToOrder($orderID, $partID, $quantity = 1)
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO Order_Part (orderID, partID, quantity) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("isi", $orderID, $partID, $quantity);
        return $stmt->execute();
    }
    // Thêm dịch vụ vào đơn hàng (không cần quantity)
    public function addServiceToOrder($orderID, $serviceID, $quantity = 1)
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO Order_Service (orderID, serviceID, quantity) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("iii", $orderID, $serviceID, $quantity);
        return $stmt->execute();
    }

    // Checkout giỏ hàng
    public function checkout($userID, $cart)
    {
        $orderDate = date('Y-m-d');
        $totalAmount = 0;
        foreach ($cart as $item) {
            $totalAmount += $item['price'] * ($item['quantity'] ?? 1);
        }
        $orderID = $this->createOrder($userID, $orderDate, $totalAmount, 'pending');
        foreach ($cart as $item) {
            if ($item['type'] == 'service') {
                $this->addServiceToOrder($orderID, $item['id']);
            } else if ($item['type'] == 'part') {
                $this->addPartToOrder($orderID, $item['id'], $item['quantity'] ?? 1);
            }
        }
        return $orderID;
    }

    // Sinh hóa đơn (trả về thông tin đơn hàng và chi tiết)
    public function generateInvoice($orderID)
    {
        // Lấy thông tin đơn hàng
        $stmt = $this->conn->prepare(
            "SELECT * FROM `Order` WHERE orderID = ?"
        );
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $order = $stmt->get_result()->fetch_assoc();

        // Lấy danh sách dịch vụ
        $services = [];
        $sql = "SELECT s.*, os.quantity 
        FROM Service s 
        JOIN Order_Service os ON s.serviceID = os.serviceID 
        WHERE os.orderID = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }


        // Lấy danh sách phụ tùng
        $parts = [];
        $sql = "SELECT p.*, op.quantity FROM Part p JOIN Order_Part op ON p.partID = op.partID WHERE op.orderID = ?"; // Thêm op.quantity
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderID);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $parts[] = $row;
        }

        // Lấy thông tin người dùng
        $user = null; // Khởi tạo user là null
        if ($order && isset($order['userID'])) {
            // Sửa cột 'phone' thành 'phoneNumber' và 'address' nếu chúng tồn tại trong bảng User
            $stmtUser = $this->conn->prepare("SELECT userID, name, email, phoneNumber, address FROM `User` WHERE userID = ?");
            $stmtUser->bind_param("s", $order['userID']);
            $stmtUser->execute();
            $userResult = $stmtUser->get_result();
            if ($userResult->num_rows > 0) {
                $user = $userResult->fetch_assoc();
            }
        }

        return [
            'order' => $order,
            'services' => $services,
            'parts' => $parts,
            'user' => $user // Thêm thông tin người dùng vào đây
        ];
    }

    // Lấy tất cả đơn hàng (cho admin)
    public function getAllOrders()
    {
        $sql = "SELECT * FROM `order` ORDER BY orderID ASC"; // Sắp xếp theo số thứ tự tăng dần
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
    public function updateStatus($orderID, $status)
    {
        $stmt = $this->conn->prepare(
            "UPDATE `Order` SET status = ? WHERE orderID = ?"
        );
        $stmt->bind_param("si", $status, $orderID);
        return $stmt->execute();
    }
    // Mua nhanh 1 sản phẩm/dịch vụ
    public function buySingle($userID, $item)
    {
        $orderDate = date('Y-m-d');
        $totalAmount = $item['price'] * ($item['quantity'] ?? 1);
        $orderID = $this->createOrder($userID, $orderDate, $totalAmount, 'pending');
        if ($item['type'] == 'service') {
            $this->addServiceToOrder($orderID, $item['id']);
        } else if ($item['type'] == 'part') {
            $this->addPartToOrder($orderID, $item['id'], $item['quantity'] ?? 1);
        }
        return $orderID;
    }
    public function countOrders()
    {
        $sql = "SELECT COUNT(*) as total FROM `order`";
        $result = $this->conn->query($sql);
        return $result->fetch_assoc()['total'] ?? 0;
    }

    // Lấy số lượng đơn hàng theo từng tháng trong năm hiện tại
    public function getOrderChart()
    {
        $year = date('Y');
        $sql = "SELECT MONTH(orderDate) as month, COUNT(*) as total FROM `Order` WHERE YEAR(orderDate) = ? GROUP BY MONTH(orderDate) ORDER BY month";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = array_fill(1, 12, 0); // Khởi tạo mảng 12 tháng = 0
        while ($row = $result->fetch_assoc()) {
            $data[(int) $row['month']] = (int) $row['total'];
        }
        return $data;
    }
}
?>
<?php
require_once __DIR__ . '/../repository/OrderRepository.php';

class OrderService {
    private $orderRepository;

    public function __construct() {
        $this->orderRepository = new OrderRepository();
    }

    // Tạo đơn hàng mới
    public function createOrder($userID, $orderDate, $totalAmount, $status = 'pending') {
        if (empty($userID) || empty($orderDate) || empty($totalAmount)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin đơn hàng!'];
        }
        $orderID = $this->orderRepository->createOrder($userID, $orderDate, $totalAmount, $status);
        if ($orderID) {
            return ['success' => true, 'orderID' => $orderID];
        } else {
            return ['success' => false, 'message' => 'Tạo đơn hàng thất bại!'];
        }
    }

    // Thêm phụ tùng vào đơn hàng
    public function addPartToOrder($orderID, $partID, $quantity = 1) {
        return $this->orderRepository->addPartToOrder($orderID, $partID, $quantity);
    }

    // Thêm dịch vụ vào đơn hàng
    public function addServiceToOrder($orderID, $serviceID) {
        return $this->orderRepository->addServiceToOrder($orderID, $serviceID);
    }

public function checkout($userID, $cart) {
    if (empty($userID) || empty($cart) || !is_array($cart)) {
        return ['success' => false, 'message' => 'Thông tin giỏ hàng không hợp lệ!'];
    }
    $totalAmount = 0;
    foreach ($cart as $item) {
        if (!isset($item['id'], $item['type'], $item['price'])) {
            return ['success' => false, 'message' => 'Thiếu thông tin sản phẩm trong giỏ hàng!'];
        }
        if ($item['type'] == 'service') {
            $totalAmount += $item['price'];
        } else if ($item['type'] == 'part') {
            $quantity = isset($item['quantity']) ? (int)$item['quantity'] : 1;
            if ($quantity < 1) {
                return ['success' => false, 'message' => 'Số lượng phụ tùng không hợp lệ!'];
            }
            $totalAmount += $item['price'] * $quantity;
        }
    }
    // Gọi repository để lưu đơn hàng và chi tiết
    $orderID = $this->orderRepository->checkout($userID, $cart);
    if ($orderID) {
        return ['success' => true, 'orderID' => $orderID, 'totalAmount' => $totalAmount];
    } else {
        return ['success' => false, 'message' => 'Thanh toán thất bại!'];
    }
}

public function buySingle($userID, $item) {
    if (empty($userID) || empty($item) || !isset($item['id']) || !isset($item['price'])) {
        return ['success' => false, 'message' => 'Thông tin sản phẩm không hợp lệ!'];
    }
    if ($item['type'] == 'part') {
        $quantity = isset($item['quantity']) ? (int)$item['quantity'] : 1;
        if ($quantity < 1) {
            return ['success' => false, 'message' => 'Số lượng phụ tùng không hợp lệ!'];
        }
    }
    $orderID = $this->orderRepository->buySingle($userID, $item);
    if ($orderID) {
        return ['success' => true, 'orderID' => $orderID];
    } else {
        return ['success' => false, 'message' => 'Mua hàng thất bại!'];
    }
}

    // Sinh hóa đơn
    public function generateInvoice($orderID) {
        return $this->orderRepository->generateInvoice($orderID);
    }

    // Lấy tất cả đơn hàng (cho admin)
    public function getAllOrders() {
        return $this->orderRepository->getAllOrders();
    }

    // Cập nhật trạng thái đơn hàng
    public function updateStatus($orderID, $status) {
        return $this->orderRepository->updateStatus($orderID, $status);
    }
}
?> 
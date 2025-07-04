<?php
session_start();

class CartController {

    public function __construct() {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
    }

    // Lấy toàn bộ giỏ hàng
    public function get() {
        $cart = $_SESSION['cart'];
        $totalAmount = 0;
        foreach ($cart as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }

        echo json_encode([
            'success' => true,
            'cart' => array_values($cart), // Đảm bảo index luôn tuần tự
            'totalAmount' => $totalAmount
        ]);
    }

    // Thêm một item vào giỏ hàng
    public function add() {
        $data = json_decode(file_get_contents('php://input'), true);

        $newItem = [
            'id' => $data['id'],
            'type' => $data['type'],
            'name' => $data['name'],
            'price' => $data['price'],
            'quantity' => 1
        ];

        $itemKey = $data['type'] . '-' . $data['id'];

        if (isset($_SESSION['cart'][$itemKey])) {
            $_SESSION['cart'][$itemKey]['quantity']++;
        } else {
            $_SESSION['cart'][$itemKey] = $newItem;
        }
        
        echo json_encode(['success' => true, 'message' => 'Đã thêm vào giỏ hàng!']);
    }

    // Cập nhật số lượng của một item
    public function update() {
        $data = json_decode(file_get_contents('php://input'), true);
        $itemKey = $data['type'] . '-' . $data['id'];
        $quantity = $data['quantity'];

        if (isset($_SESSION['cart'][$itemKey])) {
            if ($quantity > 0) {
                $_SESSION['cart'][$itemKey]['quantity'] = $quantity;
                echo json_encode(['success' => true, 'message' => 'Cập nhật giỏ hàng thành công!']);
            } else {
                // Nếu số lượng <= 0 thì xóa item
                unset($_SESSION['cart'][$itemKey]);
                echo json_encode(['success' => true, 'message' => 'Đã xóa khỏi giỏ hàng.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Sản phẩm không tồn tại trong giỏ hàng.']);
        }
    }

    // Xóa một item khỏi giỏ hàng
    public function remove() {
        $data = json_decode(file_get_contents('php://input'), true);
        $itemKey = $data['type'] . '-' . $data['id'];

        if (isset($_SESSION['cart'][$itemKey])) {
            unset($_SESSION['cart'][$itemKey]);
            echo json_encode(['success' => true, 'message' => 'Đã xóa khỏi giỏ hàng.']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Sản phẩm không tồn tại trong giỏ hàng.']);
        }
    }

    // Xóa toàn bộ giỏ hàng
    public function clear() {
        $_SESSION['cart'] = [];
        echo json_encode(['success' => true, 'message' => 'Giỏ hàng đã được xóa.']);
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new CartController();

switch ($action) {
    case 'get':
        $controller->get();
        break;
    case 'add':
        $controller->add();
        break;
    case 'update':
        $controller->update();
        break;
    case 'remove':
        $controller->remove();
        break;
    case 'clear':
        $controller->clear();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
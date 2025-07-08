<?php
session_start();
require_once __DIR__ . '/../services/CartService.php';

class CartController {
    private $cartService;

    public function __construct() {
        $this->cartService = new CartService();
    }

    // Lấy toàn bộ giỏ hàng
    public function get() {
        $cart = $this->cartService->getCart();
        $totalAmount = 0;
        foreach ($cart as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }
        echo json_encode([
            'success' => true,
            'cart' => array_values($cart),
            'totalAmount' => $totalAmount
        ]);
    }

    // Thêm một item vào giỏ hàng
    public function add() {
        $data = json_decode(file_get_contents('php://input'), true);
        $item = [
            'id' => $data['id'],
            'type' => $data['type'],
            'name' => $data['name'],
            'price' => $data['price'],
            'quantity' => $data['quantity'] ?? 1
        ];
        $this->cartService->addToCart($item);
        echo json_encode(['success' => true, 'message' => 'Đã thêm vào giỏ hàng!']);
    }

    // Cập nhật số lượng của một item
    public function update() {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->cartService->updateQuantity($data['id'], $data['type'], $data['quantity']);
                echo json_encode(['success' => true, 'message' => 'Cập nhật giỏ hàng thành công!']);
    }

    // Xóa một item khỏi giỏ hàng
    public function remove() {
        $data = json_decode(file_get_contents('php://input'), true);
        $this->cartService->removeFromCart($data['id'], $data['type']);
            echo json_encode(['success' => true, 'message' => 'Đã xóa khỏi giỏ hàng.']);
    }

    // Xóa toàn bộ giỏ hàng
    public function clear() {
        $this->cartService->clearCart();
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
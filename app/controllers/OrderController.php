<?php
session_start();

require_once __DIR__ . '/../models/OrderModel.php';
require_once __DIR__ . '/../models/PaymentModel.php';

class OrderController {

    private function checkAuth($adminOnly = false) {
        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Bạn cần đăng nhập.']);
            exit();
        }
        if ($adminOnly && $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền thực hiện chức năng này.']);
            exit();
        }
    }

    // Checkout giỏ hàng
    public function checkout() {
        $this->checkAuth();

        if (empty($_SESSION['cart'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Giỏ hàng của bạn đang trống.']);
            exit();
        }

        $userID = $_SESSION['user']['userID'];
        $cart = $_SESSION['cart'];

        $orderModel = new OrderModel();
        $orderID = $orderModel->checkout($userID, $cart);

        if ($orderID) {
            unset($_SESSION['cart']);
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Đặt hàng thành công!', 'orderID' => $orderID]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Đã có lỗi xảy ra khi đặt hàng.']);
        }
    }

    // Xem chi tiết một đơn hàng
    public function getOrderDetails() {
        $this->checkAuth();
        $orderID = $_GET['orderID'] ?? 0;

        $orderModel = new OrderModel();
        $invoiceData = $orderModel->generateInvoice($orderID);

        if (!$invoiceData['order'] || ($_SESSION['user']['role'] !== 'admin' && $invoiceData['order']['userID'] !== $_SESSION['user']['userID'])) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Không tìm thấy đơn hàng hoặc bạn không có quyền xem.']);
            exit();
        }

        echo json_encode(['success' => true, 'data' => $invoiceData]);
    }
    
    // Admin xem tất cả đơn hàng
    public function getAllOrders() {
        $this->checkAuth(true); // Chỉ Admin mới được vào
        $orderModel = new OrderModel();
        // Bạn cũng cần thêm hàm getAllOrders() vào OrderModel
        $orders = $orderModel->getAllOrders();
        echo json_encode(['success' => true, 'orders' => $orders]);
    }

    // Thanh toán cho một đơn hàng
    public function processPayment() {
        $this->checkAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $orderID = $data['orderID'];
        $paymentMethod = $data['paymentMethod'];

        $orderModel = new OrderModel();
        $paymentModel = new PaymentModel();

        $invoiceData = $orderModel->generateInvoice($orderID);
        if (!$invoiceData['order'] || $invoiceData['order']['userID'] !== $_SESSION['user']['userID']) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Đơn hàng không hợp lệ.']);
            exit();
        }
        
        $totalAmount = $invoiceData['order']['totalAmount'];

        $paymentID = $paymentModel->processPayment($orderID, $totalAmount, $paymentMethod);
        
        // Gọi hàm updateStatus đã được thêm vào OrderModel
        $orderModel->updateStatus($orderID, 'paid');

        if ($paymentID) {
            echo json_encode(['success' => true, 'message' => 'Thanh toán thành công!', 'paymentID' => $paymentID]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Thanh toán thất bại.']);
        }
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new OrderController();

switch ($action) {
    case 'checkout':
        $controller->checkout();
        break;
    case 'getOrderDetails':
        $controller->getOrderDetails();
        break;
    case 'getAllOrders':
        $controller->getAllOrders();
        break;
    case 'processPayment':
        $controller->processPayment();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
<?php
session_start();

require_once __DIR__ . '/../services/OrderService.php';
require_once __DIR__ . '/../models/PaymentModel.php';

class OrderController {
    private $orderService;

    public function __construct() {
        $this->orderService = new OrderService();
    }

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
        $data = json_decode(file_get_contents('php://input'), true);
        $cart = $data['items'] ?? [];
        if (empty($cart)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Giỏ hàng của bạn đang trống.']);
            exit();
        }
        $userID = $_SESSION['user']['userID'];
        $result = $this->orderService->checkout($userID, $cart);
        if ($result['success']) {
            // Sau khi tạo đơn hàng thành công, tiến hành thanh toán luôn
            $orderID = $result['orderID'];
            $totalAmount = $result['totalAmount'];
            $paymentModel = new PaymentModel();
            $paymentID = $paymentModel->processPayment($orderID, $totalAmount, 'cod'); // hoặc lấy paymentMethod từ $data nếu muốn
            $this->orderService->updateStatus($orderID, 'paid');
            if ($paymentID) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Đặt hàng và thanh toán thành công!',
                    'orderID' => $orderID,
                    'paymentID' => $paymentID,
                    'totalAmount' => $totalAmount
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Thanh toán thất bại!']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $result['message']]);
        }
    }

    // Xem chi tiết một đơn hàng
    public function getOrderDetails() {
        $this->checkAuth();
        $orderID = $_GET['orderID'] ?? 0;
        $invoiceData = $this->orderService->generateInvoice($orderID);
        echo json_encode(['success' => true, 'data' => $invoiceData]);
    }
    
    // Admin xem tất cả đơn hàng
public function getAllOrders() {
    $this->checkAuth(true); // Chỉ Admin mới được vào
    $orders = $this->orderService->getAllOrders();
    echo json_encode(['success' => true, 'orders' => $orders]);
}

    // Thanh toán cho một đơn hàng
    public function processPayment() {
        $this->checkAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $orderID = $data['orderID'];
        $paymentMethod = $data['paymentMethod'];
        $invoiceData = $this->orderService->generateInvoice($orderID);
        if (!$invoiceData['order'] || $invoiceData['order']['userID'] !== $_SESSION['user']['userID']) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Đơn hàng không hợp lệ.']);
            exit();
        }
        $totalAmount = $invoiceData['order']['totalAmount'];
        $paymentModel = new PaymentModel();
        $paymentID = $paymentModel->processPayment($orderID, $totalAmount, $paymentMethod);
        $this->orderService->updateStatus($orderID, 'paid');
        if ($paymentID) {
            echo json_encode(['success' => true, 'message' => 'Thanh toán thành công!', 'paymentID' => $paymentID]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Thanh toán thất bại.']);
        }
    }

    // Mua nhanh 1 sản phẩm hoặc dịch vụ
    public function buySingle() {
        $this->checkAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $item = $data['item'] ?? null;
        $userID = $_SESSION['user']['userID'];
        $result = $this->orderService->buySingle($userID, $item);
        if ($result['success']) {
            echo json_encode(['success' => true, 'orderID' => $result['orderID']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result['message']]);
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
    case 'buySingle':
        $controller->buySingle();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
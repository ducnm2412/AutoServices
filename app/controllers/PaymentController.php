<?php
session_start();

require_once __DIR__ . '/../services/PaymentService.php';
require_once __DIR__ . '/../models/OrderModel.php';

class PaymentController {

    private $paymentService;

    public function __construct() {
        $this->paymentService = new PaymentService();
    }

    private function checkAuth() {
        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Bạn cần đăng nhập để thực hiện chức năng này.']);
            exit();
        }
    }

    // Xử lý thanh toán cho một đơn hàng đã có
    public function process() {
        $this->checkAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $orderID = $data['orderID'];
        $paymentMethod = $data['paymentMethod'];

        $orderModel = new OrderModel();

        // 1. Lấy thông tin đơn hàng để xác thực và lấy tổng tiền
        $orderData = $orderModel->generateInvoice($orderID)['order'];
        if (!$orderData || $orderData['userID'] !== $_SESSION['user']['userID']) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Đơn hàng không hợp lệ hoặc bạn không có quyền thanh toán.']);
            exit();
        }

        // 2. Kiểm tra xem đơn hàng đã được thanh toán chưa
        if ($orderData['status'] === 'paid') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Đơn hàng này đã được thanh toán trước đó.']);
            exit();
        }
        
        $totalAmount = $orderData['totalAmount'];

        // 3. Lưu thông tin thanh toán qua service
        $result = $this->paymentService->processPayment($orderID, $totalAmount, $paymentMethod);

        if ($result['success']) {
            // 4. Cập nhật trạng thái đơn hàng thành 'paid'
            $orderModel->updateStatus($orderID, 'paid');
            echo json_encode(['success' => true, 'message' => $result['message'], 'paymentID' => $result['paymentID']]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $result['message']]);
        }
    }

    // Xem hóa đơn thanh toán
    public function getInvoice() {
        $this->checkAuth();
        $paymentID = $_GET['paymentID'] ?? 0;
        
        $paymentDetails = $this->paymentService->getPaymentByID($paymentID);

        if (!$paymentDetails) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Không tìm thấy thông tin thanh toán.']);
            exit();
        }

        // Lấy thông tin order để kiểm tra quyền sở hữu
        $orderModel = new OrderModel();
        $order = $orderModel->generateInvoice($paymentDetails['orderID'])['order'];

        if ($_SESSION['user']['role'] !== 'admin' && $order['userID'] !== $_SESSION['user']['userID']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền xem hóa đơn này.']);
            exit();
        }

        echo json_encode(['success' => true, 'payment' => $paymentDetails]);
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new PaymentController();

switch ($action) {
    case 'process':
        $controller->process();
        break;
    case 'getInvoice':
        $controller->getInvoice();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
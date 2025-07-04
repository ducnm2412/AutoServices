<?php
session_start(); // Luôn bắt đầu session ở đầu file

require_once __DIR__ . '/../models/CustomerModel.php';
require_once __DIR__ . '/../models/FeedbackModel.php';

class CustomerController {

    private function checkAuth() {
        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Bạn cần đăng nhập để thực hiện chức năng này.']);
            exit();
        }
    }

    public function bookService() {
        $this->checkAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $customerID = $_SESSION['user']['userID'];

        $customerModel = new CustomerModel();
        $result = $customerModel->bookServices(
            $customerID,
            $data['serviceID'],
            $data['date'],
            $data['note'] ?? ''
        );

        if ($result) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Đặt dịch vụ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Đặt dịch vụ thất bại.']);
        }
    }

    public function viewMyOrderHistory() {
        $this->checkAuth();
        $customerID = $_SESSION['user']['userID'];

        $customerModel = new CustomerModel();
        $orders = $customerModel->viewOrderHistory($customerID);

        echo json_encode(['success' => true, 'orders' => $orders]);
    }

    // Gửi phản hồi / Đánh giá đơn hàng
    public function giveFeedback() {
        $this->checkAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $userID = $_SESSION['user']['userID'];

        $feedbackModel = new FeedbackModel();
        // Hàm này sẽ lưu cả rating (sao) và content (bình luận)
        $result = $feedbackModel->submitFeedback(
            $data['orderID'],
            $userID,
            $data['content'],
            $data['rating'],
            date('Y-m-d H:i:s')
        );

        if ($result) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Gửi phản hồi thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Gửi phản hồi thất bại.']);
        }
    }
}

// Routing đơn giản
$action = $_GET['action'] ?? '';
$controller = new CustomerController();

switch ($action) {
    case 'bookService':
        $controller->bookService();
        break;
    case 'viewMyOrderHistory':
        $controller->viewMyOrderHistory();
        break;
    case 'giveFeedback':
        $controller->giveFeedback();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
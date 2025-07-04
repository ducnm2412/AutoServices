<?php
session_start();

require_once __DIR__ . '/../models/FeedbackModel.php';

class FeedbackController {

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

    // Khách hàng gửi phản hồi
    public function submit() {
        $this->checkAuth(); // Bất kỳ user nào đã đăng nhập cũng có thể gửi
        $data = json_decode(file_get_contents('php://input'), true);
        $userID = $_SESSION['user']['userID'];

        $feedbackModel = new FeedbackModel();
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

    // Admin xem danh sách phản hồi (có thể lọc)
    public function getAll() {
        $this->checkAuth(true); // Chỉ admin được xem

        // Lấy các tham số lọc từ URL
        $filters = [
            'userID' => $_GET['userID'] ?? null,
            'orderID' => $_GET['orderID'] ?? null
        ];

        $feedbackModel = new FeedbackModel();
        // Bạn cần bổ sung hàm getFeedbacksByFilters trong FeedbackModel
        $feedbacks = $feedbackModel->getFeedbacksByFilters($filters);

        echo json_encode(['success' => true, 'feedbacks' => $feedbacks]);
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new FeedbackController();

switch ($action) {
    case 'submit':
        $controller->submit();
        break;
    case 'getAll':
        $controller->getAll();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
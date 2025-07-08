<?php
session_start();

require_once __DIR__ . '/../services/FeedbackService.php';

class FeedbackController {

    private $feedbackService;

    public function __construct() {
        $this->feedbackService = new FeedbackService();
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

    // Khách hàng gửi phản hồi
    public function submit() {
        $this->checkAuth(); // Bất kỳ user nào đã đăng nhập cũng có thể gửi
        $data = json_decode(file_get_contents('php://input'), true);
        $userID = $_SESSION['user']['userID'];

        $result = $this->feedbackService->createFeedback(
            $data['orderID'],
            $userID,
            $data['content'],
            $data['rating'],
            date('Y-m-d H:i:s')
        );

        if ($result['success']) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => $result['message']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result['message']]);
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

        $feedbacks = $this->feedbackService->getFeedbacksByFilters($filters);

        echo json_encode(['success' => true, 'feedbacks' => $feedbacks]);
    }

    // Admin xem tất cả feedback kèm thông tin user
    public function getAllWithUserInfo() {
        $this->checkAuth(true); // Chỉ admin được xem
        $feedbacks = $this->feedbackService->getAllFeedbacksWithUserInfo();
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
    case 'getAllWithUserInfo':
        $controller->getAllWithUserInfo();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
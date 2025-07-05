<?php
session_start(); // Luôn bắt đầu session ở đầu file

require_once __DIR__ . '/../services/CustomerService.php';

class CustomerController {
    private $customerService;

    public function __construct() {
        $this->customerService = new CustomerService();
    }

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
        $userID = $_SESSION['user']['userID'];
        $result = $this->customerService->bookServices(
            $userID,
            $data['serviceID'],
            $data['date'],
            $data['note'] ?? ''
        );
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => $result['message']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result['message']]);
        }
    }

    public function viewMyOrderHistory() {
        $this->checkAuth();
        $userID = $_SESSION['user']['userID'];
        $orders = $this->customerService->viewOrderHistory($userID);
        echo json_encode(['success' => true, 'orders' => $orders]);
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
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
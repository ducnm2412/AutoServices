<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../services/ContactService.php';

class ContactController {
    private $contactService;

    public function __construct() {
        $this->contactService = new ContactService();
    }

    // Tạo liên hệ mới
    public function create() {
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $phone = $data['phone'] ?? '';
        $email = $data['email'] ?? '';
        // Thay đổi serviceID thành categoryID
        $categoryID = $data['categoryID'] ?? ''; 
        $message = $data['message'] ?? '';
        // Truyền categoryID thay vì serviceID
        $result = $this->contactService->createContact($name, $phone, $email, $categoryID, $message);
        if ($result['success']) {
            http_response_code(201);
        } else {
            http_response_code(400);
        }
        echo json_encode($result);
    }

        // Lấy tất cả liên hệ
        public function getAll() {
            // Chỉ admin mới được xem danh sách liên hệ
            $contacts = $this->contactService->getAllContacts();
            echo json_encode(['success' => true, 'contacts' => $contacts]);
        }

    // Xóa liên hệ
    public function remove() {
        // Chỉ admin mới được xóa liên hệ
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền truy cập!']);
            exit();
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $contactID = $data['contactID'] ?? null;
        if (!$contactID) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu mã liên hệ!']);
            exit();
        }
        $result = $this->contactService->removeContact($contactID);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Xóa liên hệ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Xóa liên hệ thất bại!']);
        }
    }

    // Admin trả lời liên hệ (nối thêm vào message)
    public function reply() {
        // Chỉ admin mới được trả lời
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền truy cập!']);
            exit();
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $contactID = $data['contactID'] ?? null;
        $adminReply = $data['adminReply'] ?? '';
        if (!$contactID) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu mã liên hệ!']);
            exit();
        }
        $result = $this->contactService->replyContact($contactID, $adminReply);
        if ($result['success']) {
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode($result);
        }
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new ContactController();

switch ($action) {
    case 'create':
        $controller->create();
        break;
    case 'getAll':
        $controller->getAll();
        break;
    case 'remove':
        $controller->remove();
        break;
    case 'reply':
        $controller->reply();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
} 
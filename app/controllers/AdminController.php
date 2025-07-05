<?php
session_start();
require_once __DIR__ . '/../services/AdminService.php';

class AdminController {
    private $adminService;

    public function __construct() {
        $this->adminService = new AdminService();
    }

    // Kiểm tra quyền admin
    private function checkAdminAuth() {
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền thực hiện chức năng này.']);
            exit();
        }
    }

    // CRUD Service
    public function getAllServices() {
        $this->checkAdminAuth();
        $services = $this->adminService->getAllServices();
        echo json_encode(['success' => true, 'services' => $services]);
    }
    public function addService() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->adminService->addService(
            $data['serviceID'],
            $data['name'],
            $data['price'],
            $data['description'],
            $data['categoryID']
        );
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => $result['message']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result['message']]);
        }
    }
    public function updateService() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->adminService->updateService(
            $data['serviceID'],
            $data['name'],
            $data['price'],
            $data['description'],
            $data['categoryID']
        );
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Cập nhật dịch vụ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cập nhật dịch vụ thất bại!']);
        }
    }
    public function deleteService() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->adminService->deleteService($data['serviceID']);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Xóa dịch vụ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Xóa dịch vụ thất bại!']);
        }
    }

    // CRUD Part
    public function getAllParts() {
        $this->checkAdminAuth();
        $parts = $this->adminService->getAllParts();
        echo json_encode(['success' => true, 'parts' => $parts]);
    }
    public function addPart() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->adminService->addPart(
            $data['partID'],
            $data['name'],
            $data['price'],
            $data['quantity'],
            $data['images'],
            $data['categoryID']
        );
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => $result['message']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result['message']]);
        }
    }
    public function updatePart() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->adminService->updatePart(
            $data['partID'],
            $data['name'],
            $data['price'],
            $data['quantity'],
            $data['images'],
            $data['categoryID']
        );
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Cập nhật phụ tùng thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cập nhật phụ tùng thất bại!']);
        }
    }
    public function deletePart() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->adminService->deletePart($data['partID']);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Xóa phụ tùng thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Xóa phụ tùng thất bại!']);
        }
    }

    // Xem tất cả đơn hàng
    public function getAllOrders() {
        $this->checkAdminAuth();
        $orders = $this->adminService->getAllOrders();
        echo json_encode(['success' => true, 'orders' => $orders]);
    }

    // Xem tất cả phản hồi
    public function getAllFeedback() {
        $this->checkAdminAuth();
        $feedbacks = $this->adminService->getAllFeedback();
        echo json_encode(['success' => true, 'feedbacks' => $feedbacks]);
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new AdminController();

switch ($action) {
    case 'getAllServices':
        $controller->getAllServices();
        break;
    case 'addService':
        $controller->addService();
        break;
    case 'updateService':
        $controller->updateService();
        break;
    case 'deleteService':
        $controller->deleteService();
        break;
    case 'getAllParts':
        $controller->getAllParts();
        break;
    case 'addPart':
        $controller->addPart();
        break;
    case 'updatePart':
        $controller->updatePart();
        break;
    case 'deletePart':
        $controller->deletePart();
        break;
    case 'getAllOrders':
        $controller->getAllOrders();
        break;
    case 'getAllFeedback':
        $controller->getAllFeedback();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?> 
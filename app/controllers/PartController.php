<?php
session_start();

require_once __DIR__ . '/../services/PartService.php';

class PartController {
    private $partService;

    public function __construct() {
        $this->partService = new PartService();
    }

    // Kiểm tra xem người dùng có phải là admin không
    private function checkAdminAuth() {
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403); // 403 Forbidden
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền thực hiện chức năng này.']);
            exit();
        }
    }

    // Lấy tất cả phụ tùng (công khai)
    public function getAll() {
        $parts = $this->partService->getAllParts();
        echo json_encode(['success' => true, 'parts' => $parts]);
    }

    // Tìm kiếm phụ tùng (công khai)
    public function search() {
        $keyword = $_GET['keyword'] ?? '';
        $parts = $this->partService->searchPartByName($keyword);
        echo json_encode(['success' => true, 'parts' => $parts]);
    }

    // Thêm phụ tùng mới (chỉ admin)
    public function add() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->partService->addPart(
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

    // Cập nhật phụ tùng (chỉ admin)
    public function update() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->partService->updatePart(
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
            echo json_encode(['success' => false, 'message' => 'Cập nhật phụ tùng thất bại.']);
        }
    }

    // Xóa phụ tùng (chỉ admin)
    public function delete() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->partService->deletePart($data['partID']);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Xóa phụ tùng thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Xóa phụ tùng thất bại.']);
        }
    }
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new PartController();

switch ($action) {
    case 'getAll':
        $controller->getAll();
        break;
    case 'search':
        $controller->search();
        break;
    case 'add':
        $controller->add();
        break;
    case 'update':
        $controller->update();
        break;
    case 'delete':
        $controller->delete();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
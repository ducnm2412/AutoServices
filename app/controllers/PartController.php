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
        // Changed to use $_POST as partManage.js sends FormData
        $name = $_POST['name'] ?? null;
        $price = $_POST['price'] ?? null;
        $quantity = $_POST['quantity'] ?? null;
        $images = $_POST['images'] ?? null;
        $categoryID = $_POST['categoryID'] ?? null;

        // partID is auto-incrementing, so it's not passed to addPart
        $result = $this->partService->addPart(
            $name,
            $price,
            $quantity,
            $images,
            $categoryID
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
        // Changed to use $_POST as partManage.js sends FormData
        $partID = (int)($_POST['partID'] ?? 0); // Cast partID to integer
        $name = $_POST['name'] ?? null;
        $price = $_POST['price'] ?? null;
        $quantity = $_POST['quantity'] ?? null;
        $images = $_POST['images'] ?? null;
        $categoryID = $_POST['categoryID'] ?? null;

        $result = $this->partService->updatePart(
            $partID, // partID is required for update
            $name,
            $price,
            $quantity,
            $images,
            $categoryID
        );
        // Note: The previous logic for $result check was simplified.
        // It should check for success from the PartService method return if it's consistent.
        if ($result) { // Assuming updatePart returns true on success, false on failure
            echo json_encode(['success' => true, 'message' => 'Cập nhật phụ tùng thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cập nhật phụ tùng thất bại.']);
        }
    }

    // Xóa phụ tùng (chỉ admin)
    // Trong PartController.php, bên trong hàm delete():
public function delete() {
    $this->checkAdminAuth();
    $partID = (int)($_POST['partID'] ?? 0);
    error_log("Debug: Deleting partID = " . $partID); // Thêm dòng này để kiểm tra
    $result = $this->partService->deletePart($partID);
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
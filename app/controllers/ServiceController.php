<?php
session_start();

require_once __DIR__ . '/../services/ServiceService.php';

class ServiceController {
    private $serviceService;

    public function __construct() {
        $this->serviceService = new ServiceService();
    }

    // Kiểm tra xem người dùng có phải là admin không
    private function checkAdminAuth() {
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403); // 403 Forbidden
            header('Content-Type: application/json');

            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền thực hiện chức năng này.']);
            exit();
        }
    }

    // Lấy tất cả dịch vụ (công khai)
    public function getAll() {
        $services = $this->serviceService->getAllServices();
        header('Content-Type: application/json');

        echo json_encode(['success' => true, 'services' => $services]);
    }

    // Tìm kiếm dịch vụ (công khai)
    public function search() {
        $keyword = $_GET['keyword'] ?? '';
        $services = $this->serviceService->searchServiceByName($keyword);
        header('Content-Type: application/json');

        echo json_encode(['success' => true, 'services' => $services]);
    }

    // Thêm dịch vụ mới (chỉ admin)
public function add() {
    $this->checkAdminAuth();
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $description = $_POST['description'] ?? '';
    $categoryID = $_POST['categoryID'] ?? '';

    $result = $this->serviceService->addService($name, $price, $description, $categoryID);

    if ($result) {
        http_response_code(201);
        header('Content-Type: application/json');

        echo json_encode(['success' => true, 'message' => 'Thêm dịch vụ thành công!']);
    } else {
        http_response_code(400);
        header('Content-Type: application/json');

        echo json_encode(['success' => false, 'message' => 'Thêm dịch vụ thất bại.']);
    }
}

    // Cập nhật dịch vụ (chỉ admin)
    public function update() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->serviceService->updateService(
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
            echo json_encode(['success' => false, 'message' => 'Cập nhật dịch vụ thất bại.']);
        }
    }

    // Xóa dịch vụ (chỉ admin)
    public function delete() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->serviceService->deleteService($data['serviceID']);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Xóa dịch vụ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Xóa dịch vụ thất bại.']);
        }
    }
    // Lấy dịch vụ theo categoryID (công khai)
public function getByCategory() {
    $categoryID = $_GET['categoryID'] ?? '';
    $services = $this->serviceService->getServicesByCategory($categoryID);
    echo json_encode(['success' => true, 'services' => $services]);
}
}

// Routing
$action = $_GET['action'] ?? '';
$controller = new ServiceController();

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
    case 'getByCategory':
        $controller->getByCategory();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
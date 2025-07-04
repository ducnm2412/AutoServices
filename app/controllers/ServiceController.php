<?php
session_start();

require_once __DIR__ . '/../models/ServiceModel.php';

class ServiceController {

    // Kiểm tra xem người dùng có phải là admin không
    private function checkAdminAuth() {
        if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
            http_response_code(403); // 403 Forbidden
            echo json_encode(['success' => false, 'message' => 'Bạn không có quyền thực hiện chức năng này.']);
            exit();
        }
    }

    // Lấy tất cả dịch vụ (công khai)
    public function getAll() {
        $serviceModel = new ServiceModel();
        $services = $serviceModel->getAllServices();
        echo json_encode(['success' => true, 'services' => $services]);
    }

    // Tìm kiếm dịch vụ (công khai)
    public function search() {
        $keyword = $_GET['keyword'] ?? '';
        $serviceModel = new ServiceModel();
        $services = $serviceModel->searchServiceByName($keyword);
        echo json_encode(['success' => true, 'services' => $services]);
    }

    // Thêm dịch vụ mới (chỉ admin)
    public function add() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);

        $serviceModel = new ServiceModel();
        $result = $serviceModel->addService(
            $data['serviceID'],
            $data['name'],
            $data['price'],
            $data['description']
        );

        if ($result) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Thêm dịch vụ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thêm dịch vụ thất bại.']);
        }
    }

    // Cập nhật dịch vụ (chỉ admin)
    public function update() {
        $this->checkAdminAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        
        $serviceModel = new ServiceModel();
        $result = $serviceModel->updateService(
            $data['serviceID'],
            $data['name'],
            $data['price'],
            $data['description']
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
        
        $serviceModel = new ServiceModel();
        $result = $serviceModel->removeService($data['serviceID']);

        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Xóa dịch vụ thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Xóa dịch vụ thất bại.']);
        }
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
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
<?php
require_once __DIR__ . '/../repository/AdminRepository.php';

class AdminService {
    private $adminRepository;

    public function __construct() {
        $this->adminRepository = new AdminRepository();
    }

    // Thêm admin mới (có thể kiểm tra dữ liệu đầu vào ở đây)
    public function addAdmin($userID, $role) {
        if (empty($userID) || empty($role)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin admin!'];
        }
        $result = $this->adminRepository->add($userID, $role);
        if ($result === "Thêm admin thành công!") {
            return ['success' => true, 'message' => $result];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    // CRUD cho Service
    public function getAllServices() {
        return $this->adminRepository->getAllServices();
    }
public function addService($serviceID, $name, $price, $description, $categoryID) {
    if (empty($serviceID) || empty($name) || empty($price) || empty($description) || empty($categoryID)) {
        return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin dịch vụ!'];
    }
    // Có thể kiểm tra thêm: price phải là số dương
    if (!is_numeric($price) || $price <= 0) {
        return ['success' => false, 'message' => 'Giá dịch vụ phải là số dương!'];
    }
    $result = $this->adminRepository->addService($serviceID, $name, $price, $description, $categoryID);
    if ($result) {
        return ['success' => true, 'message' => 'Thêm dịch vụ thành công!'];
    } else {
        return ['success' => false, 'message' => 'Thêm dịch vụ thất bại!'];
    }
}
    public function updateService($serviceID, $name, $price, $description, $categoryID) {
        return $this->adminRepository->updateService($serviceID, $name, $price, $description, $categoryID);
    }
    public function deleteService($serviceID) {
        return $this->adminRepository->deleteService($serviceID);
    }

    // CRUD cho Part
    public function getAllParts() {
        return $this->adminRepository->getAllParts();
    }
public function addPart($partID, $name, $price, $quantity, $images, $categoryID) {
    if (empty($partID) || empty($name) || empty($price) || empty($quantity) || empty($images) || empty($categoryID)) {
        return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin phụ tùng!'];
    }
    if (!is_numeric($price) || $price <= 0) {
        return ['success' => false, 'message' => 'Giá phụ tùng phải là số dương!'];
    }
    if (!is_numeric($quantity) || $quantity < 0) {
        return ['success' => false, 'message' => 'Số lượng phải là số không âm!'];
    }
    $result = $this->adminRepository->addPart($partID, $name, $price, $quantity, $images, $categoryID);
    if ($result) {
        return ['success' => true, 'message' => 'Thêm phụ tùng thành công!'];
    } else {
        return ['success' => false, 'message' => 'Thêm phụ tùng thất bại!'];
    }
}
    public function updatePart($partID, $name, $price, $quantity, $images, $categoryID) {
        return $this->adminRepository->updatePart($partID, $name, $price, $quantity, $images, $categoryID);
    }
    public function deletePart($partID) {
        return $this->adminRepository->deletePart($partID);
    }

    // Lấy tất cả đơn hàng
    public function getAllOrders() {
        return $this->adminRepository->viewAllOrders();
    }

    // Lấy tất cả phản hồi
    public function getAllFeedback() {
        return $this->adminRepository->getAllFeedback();
    }
}
?>
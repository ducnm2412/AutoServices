<?php
require_once __DIR__ . '/../repositories/ServiceRepository.php';

class ServiceService {
    private $serviceRepository;

    public function __construct() {
        $this->serviceRepository = new ServiceRepository();
    }

    // Lấy tất cả dịch vụ (có thể xử lý logic bổ sung ở đây nếu cần)
    public function getAllServices() {
        return $this->serviceRepository->getAll();
    }

public function addService($serviceID, $name, $price, $description, $categoryID) {
    // Kiểm tra các trường không được để trống
    if (empty($serviceID) || empty($name) || empty($price) || empty($description) || empty($categoryID)) {
        return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin dịch vụ!'];
    }

    // Có thể kiểm tra thêm: price phải là số dương
    if (!is_numeric($price) || $price <= 0) {
        return ['success' => false, 'message' => 'Giá dịch vụ phải là số dương!'];
    }

    // Nếu hợp lệ, thêm dịch vụ
    $result = $this->serviceRepository->add($serviceID, $name, $price, $description, $categoryID);

    if ($result) {
        return ['success' => true, 'message' => 'Thêm dịch vụ thành công!'];
    } else {
        return ['success' => false, 'message' => 'Thêm dịch vụ thất bại!'];
    }
}

    // Xóa dịch vụ
    public function deleteService($serviceID) {
        return $this->serviceRepository->delete($serviceID);
    }

    // Cập nhật dịch vụ
    public function updateService($serviceID, $name, $price, $description, $categoryID) {
        return $this->serviceRepository->update($serviceID, $name, $price, $description, $categoryID);
    }

    // Tìm kiếm dịch vụ theo tên
    public function searchServiceByName($keyword) {
        return $this->serviceRepository->searchByName($keyword);
    }

    // Lấy dịch vụ theo categoryID
    public function getServicesByCategory($categoryID) {
        return $this->serviceRepository->getByCategory($categoryID);
    }
}
?>
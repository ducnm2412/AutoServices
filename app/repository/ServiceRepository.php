<?php
require_once __DIR__ . '/../models/ServiceModel.php';

class ServiceRepository {
    private $serviceModel;

    public function __construct() {
        $this->serviceModel = new ServiceModel();
    }

    // Lấy tất cả dịch vụ
    public function getAll() {
        return $this->serviceModel->getAllServices();
    }

    // Thêm dịch vụ mới
    public function add( $name, $price, $description, $categoryID) {
        return $this->serviceModel->addService( $name, $price, $description, $categoryID);
    }

    // Xóa dịch vụ
    public function delete($serviceID) {
        return $this->serviceModel->removeService($serviceID);
    }

    // Cập nhật dịch vụ
    public function update($serviceID, $name, $price, $description, $categoryID) {
        return $this->serviceModel->updateService($serviceID, $name, $price, $description, $categoryID);
    }

    // Tìm kiếm dịch vụ theo tên
    public function searchByName($keyword) {
        return $this->serviceModel->searchServiceByName($keyword);
    }

    // Lấy dịch vụ theo categoryID
    public function getByCategory($categoryID) {
        return $this->serviceModel->getServicesByCategory($categoryID);
    }

    // Đếm số lượng dịch vụ
    public function countServices() {
        return $this->serviceModel->countServices();
    }
}
?>
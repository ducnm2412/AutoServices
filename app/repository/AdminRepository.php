<?php
require_once __DIR__ . '/../models/AdminModel.php';

class AdminRepository {
    private $adminModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
    }

    // Thêm admin mới
    public function add($userID, $role) {
        return $this->adminModel->addAdmin($userID, $role);
    }

    // CRUD cho Service
    public function getAllServices() {
        return $this->adminModel->getAllServices();
    }
    public function addService($serviceID, $name, $price, $description, $categoryID) {
        return $this->adminModel->addService($serviceID, $name, $price, $description, $categoryID);
    }
    public function updateService($serviceID, $name, $price, $description, $categoryID) {
        return $this->adminModel->updateService($serviceID, $name, $price, $description, $categoryID);
    }
    public function deleteService($serviceID) {
        return $this->adminModel->deleteService($serviceID);
    }

    // CRUD cho Part
    public function getAllParts() {
        return $this->adminModel->getAllParts();
    }
    public function addPart($partID, $name, $price, $quantity, $images, $categoryID) {
        return $this->adminModel->addPart($partID, $name, $price, $quantity, $images, $categoryID);
    }
    public function updatePart($partID, $name, $price, $quantity, $images, $categoryID) {
        return $this->adminModel->updatePart($partID, $name, $price, $quantity, $images, $categoryID);
    }
    public function deletePart($partID) {
        return $this->adminModel->deletePart($partID);
    }

    // Xem tất cả đơn hàng
    public function viewAllOrders() {
        return $this->adminModel->viewAllOrders();
    }

    // Xem tất cả phản hồi
    public function getAllFeedback() {
        return $this->adminModel->viewFeedback();
    }
}
?>
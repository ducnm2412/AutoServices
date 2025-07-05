<?php
require_once __DIR__ . '/../models/PartModel.php';

class PartRepository {
    private $partModel;

    public function __construct() {
        $this->partModel = new PartModel();
    }

    // Thêm sản phẩm mới
    public function add($partID, $name, $price, $quantity, $images, $categoryID) {
        return $this->partModel->addPart($partID, $name, $price, $quantity, $images, $categoryID);
    }

    // Xóa sản phẩm
    public function delete($partID) {
        return $this->partModel->removePart($partID);
    }

    // Cập nhật sản phẩm
    public function update($partID, $name, $price, $quantity, $images, $categoryID) {
        return $this->partModel->updatePart($partID, $name, $price, $quantity, $images, $categoryID);
    }

    // Tìm kiếm sản phẩm theo tên
    public function searchByName($keyword) {
        return $this->partModel->searchPartByName($keyword);
    }

    // Lấy tất cả sản phẩm
    public function getAll() {
        return $this->partModel->getAllParts();
    }

    // Lấy sản phẩm theo categoryID
    public function getByCategory($categoryID) {
        return $this->partModel->getPartsByCategory($categoryID);
    }
}
?>
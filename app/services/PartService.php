<?php
require_once __DIR__ . '/../repository/PartRepository.php';


class PartService {
    private $partRepository;

    public function __construct() {
        $this->partRepository = new PartRepository();
    }

    // Thêm sản phẩm mới (có thể kiểm tra dữ liệu đầu vào ở đây)
    // Removed $partID from parameters as it's auto-incrementing in the database
    public function addPart($name, $price, $quantity, $images, $categoryID) {
        // Removed empty($partID) from validation as partID is auto-generated
        if (empty($name) || empty($price) || empty($quantity) || empty($images) || empty($categoryID)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin sản phẩm!'];
        }
        if (!is_numeric($price) || $price <= 0) {
            return ['success' => false, 'message' => 'Giá sản phẩm phải là số dương!'];
        }
        if (!is_numeric($quantity) || $quantity < 0) {
            return ['success' => false, 'message' => 'Số lượng phải là số không âm!'];
        }
        // Adjusted the call to PartRepository::add to no longer pass $partID
        $result = $this->partRepository->add($name, $price, $quantity, $images, $categoryID);
        if ($result) {
            return ['success' => true, 'message' => 'Thêm sản phẩm thành công!'];
        } else {
            return ['success' => false, 'message' => 'Thêm sản phẩm thất bại!'];
        }
    }

    // Xóa sản phẩm
    public function deletePart($partID) {
        return $this->partRepository->delete($partID);
    }

    // Cập nhật sản phẩm
    public function updatePart($partID, $name, $price, $quantity, $images, $categoryID) {
        return $this->partRepository->update($partID, $name, $price, $quantity, $images, $categoryID);
    }

    // Tìm kiếm sản phẩm theo tên
    public function searchPartByName($keyword) {
        return $this->partRepository->searchByName($keyword);
    }

    // Lấy tất cả sản phẩm
    public function getAllParts() {
        return $this->partRepository->getAll();
    }

    // Lấy sản phẩm theo categoryID
    public function getPartsByCategory($categoryID) {
        return $this->partRepository->getByCategory($categoryID);
    }

    // Đếm số lượng sản phẩm
    public function countParts() {
        return $this->partRepository->countParts();
    }
}
?>
<?php
require_once 'core/Database.php';

class PartModel extends Database {
    // Thêm sản phẩm mới
    public function addPart($partID, $name, $price, $quantity, $images) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Part (partID, name, price, quantity, images) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssdis", $partID, $name, $price, $quantity, $images);
        return $stmt->execute();
    }

    // Xóa sản phẩm
    public function removePart($partID) {
        $stmt = $this->conn->prepare(
            "DELETE FROM Part WHERE partID = ?"
        );
        $stmt->bind_param("s", $partID);
        return $stmt->execute();
    }

    // Cập nhật sản phẩm
    public function updatePart($partID, $name, $price, $quantity, $images) {
        $stmt = $this->conn->prepare(
            "UPDATE Part SET name = ?, price = ?, quantity = ?, images = ? WHERE partID = ?"
        );
        $stmt->bind_param("sdiss", $name, $price, $quantity, $images, $partID);
        return $stmt->execute();
    }

    // Tìm kiếm sản phẩm theo tên
    public function searchPartByName($keyword) {
        $sql = "SELECT * FROM Part WHERE name LIKE ?";
        $stmt = $this->conn->prepare($sql);
        $like = "%$keyword%";
        $stmt->bind_param("s", $like);
        $stmt->execute();
        $result = $stmt->get_result();
        $parts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $parts[] = $row;
            }
        }
        return $parts;
    }

    // Lấy tất cả sản phẩm
    public function getAllParts() {
        $sql = "SELECT * FROM Part";
        $result = $this->conn->query($sql);
        $parts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $parts[] = $row;
            }
        }
        return $parts;
    }
}
?> 
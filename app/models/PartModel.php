<?php
require_once __DIR__ . '/../../core/Database.php';


class PartModel extends Database {
    // Thêm sản phẩm mới
    public function addPart($name, $price, $quantity, $images, $categoryID) {
        $stmt = $this->conn->prepare(
            // Removed partID from INSERT statement as it's auto-incrementing
            "INSERT INTO Part (name, price, quantity, images, categoryID) VALUES (?, ?, ?, ?, ?)"
        );
        // Adjusted bind_param types: name (string), price (double), quantity (integer), images (string), categoryID (string)
        $stmt->bind_param("sdiss", $name, $price, $quantity, $images, $categoryID);
        return $stmt->execute();
    }

    // Xóa sản phẩm
    public function removePart($partID) {
        $stmt = $this->conn->prepare(
            "DELETE FROM Part WHERE partID = ?"
        );
        // Changed bind_param type for partID to 'i' (integer)
        $stmt->bind_param("i", $partID);
        return $stmt->execute();
    }

    // Cập nhật sản phẩm
    public function updatePart($partID, $name, $price, $quantity, $images, $categoryID) {
        $stmt = $this->conn->prepare(
            "UPDATE Part SET name = ?, price = ?, quantity = ?, images = ?, categoryID = ? WHERE partID = ?"
        );
        // Changed bind_param type for partID to 'i' (integer) at the end
        // Parameters: name (string), price (double), quantity (integer), images (string), categoryID (string), partID (integer)
        $stmt->bind_param("sdisis", $name, $price, $quantity, $images, $categoryID, $partID);
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

    // Lấy sản phẩm theo categoryID
    public function getPartsByCategory($categoryID) {
        $stmt = $this->conn->prepare("SELECT * FROM Part WHERE categoryID = ?");
        $stmt->bind_param("s", $categoryID);
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
}
?>
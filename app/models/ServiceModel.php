<?php
require_once __DIR__ . '/../../core/Database.php';

class ServiceModel extends Database {
    // Lấy tất cả dịch vụ
    public function getAllServices() {
        $sql = "SELECT * FROM Service";
        $result = $this->conn->query($sql);
        $services = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $services[] = $row;
            }
        }
        return $services;
    }

    // Thêm dịch vụ mới
    public function addService($serviceID, $name, $price, $description, $categoryID) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Service (serviceID, name, price, description, categoryID) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssdss", $serviceID, $name, $price, $description, $categoryID);
        return $stmt->execute();
    }

    // Xóa dịch vụ
    public function removeService($serviceID) {
        $stmt = $this->conn->prepare(
            "DELETE FROM Service WHERE serviceID = ?"
        );
        $stmt->bind_param("s", $serviceID);
        return $stmt->execute();
    }

    // Cập nhật dịch vụ
    public function updateService($serviceID, $name, $price, $description, $categoryID) {
        $stmt = $this->conn->prepare(
            "UPDATE Service SET name = ?, price = ?, description = ?, categoryID = ? WHERE serviceID = ?"
        );
        $stmt->bind_param("sdsss", $name, $price, $description, $categoryID, $serviceID);
        return $stmt->execute();
    }

    // Tìm kiếm dịch vụ theo tên
    public function searchServiceByName($keyword) {
        $sql = "SELECT * FROM Service WHERE name LIKE ?";
        $stmt = $this->conn->prepare($sql);
        $like = "%$keyword%";
        $stmt->bind_param("s", $like);
        $stmt->execute();
        $result = $stmt->get_result();
        $services = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $services[] = $row;
            }
        }
        return $services;
    }
    // Lấy dịch vụ theo categoryID
public function getServicesByCategory($categoryID) {
    $stmt = $this->conn->prepare("SELECT * FROM Service WHERE categoryID = ?");
    $stmt->bind_param("s", $categoryID);
    $stmt->execute();
    $result = $stmt->get_result();
    $services = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }
    }
    return $services;
}
}
?> 
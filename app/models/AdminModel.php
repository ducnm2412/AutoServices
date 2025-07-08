<?php
require_once 'core/Database.php';

class AdminModel extends Database {
    public function addAdmin($userID, $role) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Admin (userID, role) VALUES (?, ?)"
        );
        $stmt->bind_param("ss", $userID, $role);
        if ($stmt->execute()) {
            return "Thêm admin thành công!";
        } else {
            return "Lỗi khi thêm admin: " . $stmt->error;
        }
    }

    // CRUD cho Service
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
    public function addService($serviceID, $name, $price, $description, $categoryID) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Service (serviceID, name, price, description, categoryID) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssdss", $serviceID, $name, $price, $description, $categoryID);
        return $stmt->execute();
    }
    public function updateService($serviceID, $name, $price, $description, $categoryID) {
        $stmt = $this->conn->prepare(
            "UPDATE Service SET name = ?, price = ?, description = ?, categoryID = ? WHERE serviceID = ?"
        );
        $stmt->bind_param("sdsss", $name, $price, $description, $categoryID, $serviceID);
        return $stmt->execute();
    }
    public function deleteService($serviceID) {
        $stmt = $this->conn->prepare(
            "DELETE FROM Service WHERE serviceID = ?"
        );
        $stmt->bind_param("s", $serviceID);
        return $stmt->execute();
    }

    // CRUD cho Part
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
    public function addPart($partID, $name, $price, $quantity, $images, $categoryID) {
        $stmt = $this->conn->prepare(
            "INSERT INTO Part (partID, name, price, quantity, images, categoryID) VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssdis s", $partID, $name, $price, $quantity, $images, $categoryID);
        return $stmt->execute();
    }
    public function updatePart($partID, $name, $price, $quantity, $images, $categoryID) {
        $stmt = $this->conn->prepare(
            "UPDATE Part SET name = ?, price = ?, quantity = ?, images = ?, categoryID = ? WHERE partID = ?"
        );
        $stmt->bind_param("sdisss", $name, $price, $quantity, $images, $categoryID, $partID);
        return $stmt->execute();
    }
    public function deletePart($partID) {
        $stmt = $this->conn->prepare(
            "DELETE FROM Part WHERE partID = ?"
        );
        $stmt->bind_param("s", $partID);
        return $stmt->execute();
    }

    // Xem tất cả đơn hàng
public function viewAllOrders() {
    $sql = "SELECT * FROM `Order`";
    $result = $this->conn->query($sql);
    $orders = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }
    return $orders;
}
    // Xem tất cả phản hồi
    public function viewFeedback() {
        $sql = "SELECT * FROM Feedback";
        $result = $this->conn->query($sql);
        $feedbacks = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $feedbacks[] = $row;
            }
        }
        return $feedbacks;
    }
}
?>
<?php
require_once __DIR__ . '/../../core/Database.php';

class UserModel extends Database {
    // Đăng ký user mới
    public function addUser($email, $name, $password, $phoneNumber, $role, $address) {
        $stmt = $this->conn->prepare(
            "INSERT INTO User (email, name, password, phoneNumber, role, address) VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssssss", $email, $name, $password, $phoneNumber, $role, $address);
        if ($stmt->execute()) {
            return "Thêm user thành công!";
        } else {
            return "Lỗi khi thêm user: " . $stmt->error;
        }
    }

    // Đăng nhập
    public function login($email, $password) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM User WHERE email = ? AND password = ?"
        );
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $result->num_rows == 1) {
            return $result->fetch_assoc(); // Trả về thông tin user nếu đăng nhập thành công
        } else {
            return false; // Đăng nhập thất bại
        }
    }

    // Lấy thông tin user theo userID
    public function getUserByID($userID) {
        $stmt = $this->conn->prepare(
            "SELECT * FROM User WHERE userID = ?"
        );
        $stmt->bind_param("s", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $result->num_rows == 1) {
            return $result->fetch_assoc();
        } else {
            return null;
        }
    }
    public function updateUser($userID, $email, $name, $phoneNumber, $address) {
    $stmt = $this->conn->prepare(
        "UPDATE User SET email = ?, name = ?, phoneNumber = ?, address = ? WHERE userID = ?"
    );
    $stmt->bind_param("sssss", $email, $name, $phoneNumber, $address, $userID);
    return $stmt->execute();
}

}
?>
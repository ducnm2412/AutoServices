<?php
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../../core/Database.php'; 

class AuthRepository extends Database {
    private $userModel;

    public function __construct() {
        parent::__construct();
        $this->userModel = new UserModel();
    }
    public function generateNextUserID() {
        $result = $this->conn->query("SELECT MAX(userID) as maxID FROM User WHERE userID LIKE 'cus%'");
        $row = $result->fetch_assoc();
        $maxID = $row['maxID'] ?? 'cus00';
        $nextID = 'cus' . str_pad(((int)substr($maxID, 3)) + 1, 2, '0', STR_PAD_LEFT);
        return $nextID;
    }
    // Đăng ký user mới
    public function register($email, $name, $password, $phoneNumber, $role, $address) {
        $userID = $this->generateNextUserID(); // tạo userID mới
        return $this->userModel->addUser($userID, $email, $name, $password, $phoneNumber, $role, $address);
    }

    // Đăng nhập
    public function login($email, $password) {
        return $this->userModel->login($email, $password);
    }
}
?>
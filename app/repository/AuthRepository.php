<?php
require_once __DIR__ . '/../models/UserModel.php';

class AuthRepository {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // Đăng ký user mới
    public function register($email, $name, $password, $phoneNumber, $role, $address) {
        return $this->userModel->addUser($email, $name, $password, $phoneNumber, $role, $address);
    }

    // Đăng nhập
    public function login($email, $password) {
        return $this->userModel->login($email, $password);
    }
}
?>
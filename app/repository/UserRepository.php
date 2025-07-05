<?php
require_once __DIR__ . '/../models/UserModel.php';

class UserRepository {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function add($email, $name, $password, $phoneNumber, $role, $address) {
        return $this->userModel->addUser($email, $name, $password, $phoneNumber, $role, $address);
    }

    // Lấy thông tin user theo userID
    public function getByID($userID) {
        return $this->userModel->getUserByID($userID);
    }

    // Cập nhật thông tin user
    public function update($userID, $email, $name, $phoneNumber, $address) {
        return $this->userModel->updateUser($userID, $email, $name, $phoneNumber, $address);
    }
}
?>
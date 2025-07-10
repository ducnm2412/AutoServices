<?php
require_once __DIR__ . '/../repository/UserRepository.php';

class UserService {
    private $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    public function getUserByID($userID) {
        return $this->userRepository->getByID($userID);
    }

    // Cập nhật thông tin user
    public function updateUser($userID, $email, $name, $phoneNumber, $address) {
        return $this->userRepository->update($userID, $email, $name, $phoneNumber, $address);
    }
}
?> 
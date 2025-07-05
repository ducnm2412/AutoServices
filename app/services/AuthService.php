<?php
require_once __DIR__ . '/../repositories/AuthRepository.php';

class AuthService {
    private $authRepository;

    public function __construct() {
        $this->authRepository = new AuthRepository();
    }

    // Đăng ký user mới
    public function register($email, $name, $password, $phoneNumber, $role, $address) {
        // Validate dữ liệu đầu vào
        if (empty($email) || empty($name) || empty($password) || empty($phoneNumber) || empty($role) || empty($address)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin!'];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Email không đúng định dạng!'];
        }
        if (!preg_match('/^[0-9]+$/', $phoneNumber)) {
            return ['success' => false, 'message' => 'Số điện thoại chỉ được chứa số!'];
        }
        // Có thể hash password ở đây nếu muốn
        $result = $this->authRepository->register($email, $name, $password, $phoneNumber, $role, $address);
        if ($result === "Thêm user thành công!") {
            return ['success' => true, 'message' => 'Đăng ký thành công!'];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    // Đăng nhập
    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Vui lòng nhập email và mật khẩu!'];
        }
        $user = $this->authRepository->login($email, $password);
        if ($user) {
            return ['success' => true, 'user' => $user];
        } else {
            return ['success' => false, 'message' => 'Sai email hoặc mật khẩu!'];
        }
    }
}
?> 
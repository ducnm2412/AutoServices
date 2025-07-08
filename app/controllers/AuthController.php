<?php
require_once __DIR__ . '/../services/AuthService.php';

header('Content-Type: application/json'); // ✅ Đặt ở đầu file

class AuthController {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->authService->register(
            $data['email'],
            $data['name'],
            $data['password'],
            $data['phoneNumber'],
            $data['role'],
            $data['address']
        );
        http_response_code($result['success'] ? 201 : 400);
        echo json_encode($result);
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->authService->login($data['email'], $data['password']);
        if ($result['success']) {
            session_start();
            $_SESSION['user'] = $result['user'];
            echo json_encode([
                'success' => true,
                'user' => $result['user'],
                'token' => session_id() // ✅ Thêm token
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => $result['message']
            ]);
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Đăng xuất thành công!']);
    }
}

<?php
require_once __DIR__ . '/../services/AuthService.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

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
            $_SESSION['user'] = $result['user'];
            echo json_encode([
                'success' => true,
                'user' => $result['user'],
                'token' => session_id()
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
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Đăng xuất thành công!']);
    }

    public function getCurrentUser() {
        if (!isset($_SESSION['user'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'user' => $_SESSION['user'],
            'token' => session_id()
        ]);
    }
}

// ROUTING
$authController = new AuthController();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $authController->login();
        break;
    case 'register':
        $authController->register();
        break;
    case 'logout':
        $authController->logout();
        break;
    case 'getCurrentUser':
        $authController->getCurrentUser();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Action không hợp lệ']);
}
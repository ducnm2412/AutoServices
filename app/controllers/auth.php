<?php
require_once __DIR__ . '/../controllers/AuthController.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start(); // ✅ chỉ gọi khi chưa khởi tạo
}

header('Content-Type: application/json'); // Đặt sau session_start

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

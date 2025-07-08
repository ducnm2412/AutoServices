<?php
require_once __DIR__ . '/../controllers/AuthController.php';

$controller = new AuthController();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $controller->login();
        break;
    case 'register':
        $controller->register();
        break;
    case 'logout':
        $controller->logout();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Action không hợp lệ']);
}

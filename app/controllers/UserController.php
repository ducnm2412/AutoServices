<?php
require_once __DIR__ . '/../services/UserService.php';

class UserController {
    private $userService;
    public function __construct() {
        $this->userService = new UserService();
    }

    // Xem thông tin user theo userID
    public function getProfile($userID) {
        $user = $this->userService->getUserByID($userID);
        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Không tìm thấy user!']);
        }
    }

    // Sửa thông tin user (profile)
    public function updateProfile($userID) {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->userService->updateUser(
            $userID,
            $data['email'],
            $data['name'],
            $data['phoneNumber'],
            $data['address']
        );
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Cập nhật thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cập nhật thất bại!']);
        }
    }
}

$action = $_GET['action'] ?? '';
$userID = $_GET['userID'] ?? '';
$controller = new UserController();

switch ($action) {
    case 'getProfile':
        $controller->getProfile($userID);
        break;
    case 'updateProfile':
        $controller->updateProfile($userID);
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        break;
}
?>
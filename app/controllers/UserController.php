<?php
require_once __DIR__ . '/../models/UserModel.php';

class UserController {
    // Xem thông tin user theo userID
    public function getProfile($userID) {
        $userModel = new UserModel();
        $user = $userModel->getUserByID($userID);

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

        $userModel = new UserModel();
        $result = $userModel->updateUser(
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

// Routing đơn giản (?action=getProfile&userID=... hoặc ?action=updateProfile&userID=...)
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
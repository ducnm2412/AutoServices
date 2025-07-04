<?php
require_once 'models/UserModel.php';

class AuthController {
    // Đăng ký
    public function register() {
        // Lấy dữ liệu từ request (giả sử gửi dạng JSON)
        $data = json_decode(file_get_contents('php://input'), true);

        $userModel = new UserModel();
        $result = $userModel->addUser(
            $data['email'],
            $data['name'],
            $data['password'],
            $data['phoneNumber'],
            $data['role'],
            $data['address']
        );

        if ($result === "Thêm user thành công!") {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Đăng ký thành công!']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result]);
        }
    }

    // Đăng nhập
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);

        $userModel = new UserModel();
        $user = $userModel->login($data['email'], $data['password']);

        if ($user) {
            // Lưu session hoặc trả về token (nếu dùng JWT)
            session_start();
            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Sai email hoặc mật khẩu!']);
        }
    }

    // Đăng xuất
    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Đăng xuất thành công!']);
    }
}
?>
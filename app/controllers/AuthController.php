    <?php
require_once __DIR__ . '/../services/AuthService.php';

    class AuthController {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

        // Đăng ký
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
        if ($result['success']) {
                http_response_code(201);
            echo json_encode(['success' => true, 'message' => $result['message']]);
            } else {
                http_response_code(400);
            echo json_encode(['success' => false, 'message' => $result['message']]);
            }
        }

        // Đăng nhập
        public function login() {
            $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->authService->login($data['email'], $data['password']);
        if ($result['success']) {
                session_start();
            $_SESSION['user'] = $result['user'];
            echo json_encode(['success' => true, 'user' => $result['user']]);
            } else {
                http_response_code(401);
            echo json_encode(['success' => false, 'message' => $result['message']]);
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
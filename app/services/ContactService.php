<?php
require_once __DIR__ . '/../repository/ContactRepository.php';

class ContactService {
    private $contactRepository;

    public function __construct() {
        $this->contactRepository = new ContactRepository();
    }

    // Thêm liên hệ mới (có validate)
    public function createContact($name, $phone, $email, $serviceID, $message) {
        if (empty($name) || empty($phone) || empty($email) || empty($serviceID) || empty($message)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin liên hệ!'];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Email không hợp lệ!'];
        }
        if (!preg_match('/^[0-9]{9,15}$/', $phone)) {
            return ['success' => false, 'message' => 'Số điện thoại không hợp lệ!'];
        }
        $result = $this->contactRepository->create($name, $phone, $email, $serviceID, $message);
        if ($result) {
            return ['success' => true, 'message' => 'Gửi liên hệ thành công!'];
        } else {
            return ['success' => false, 'message' => 'Có lỗi khi gửi liên hệ!'];
        }
    }

    // Lấy tất cả liên hệ
    public function getAllContacts() {
        return $this->contactRepository->getAll();
    }

    // Xóa liên hệ
    public function removeContact($contactID) {
        return $this->contactRepository->remove($contactID);
    }

    // Admin trả lời liên hệ (nối thêm vào message)
    public function replyContact($contactID, $adminReply) {
        if (empty($adminReply)) {
            return ['success' => false, 'message' => 'Nội dung trả lời không được để trống!'];
        }
        $result = $this->contactRepository->reply($contactID, $adminReply);
        if ($result) {
            return ['success' => true, 'message' => 'Đã trả lời liên hệ!'];
        } else {
            return ['success' => false, 'message' => 'Trả lời thất bại!'];
        }
    }
}
?> 
<?php
require_once __DIR__ . '/../models/ContactModel.php';

class ContactRepository {
    private $contactModel;

    public function __construct() {
        $this->contactModel = new ContactModel();
    }

    // Thêm liên hệ mới
     public function create($name, $phone, $email, $categoryID, $message) {
        return $this->contactModel->addContact($name, $phone, $email, $categoryID, $message);
    }

    // Lấy tất cả liên hệ
    public function getAll() {
        return $this->contactModel->getAllContacts();
    }

    // Xóa liên hệ
    public function remove($contactID) {
        return $this->contactModel->removeContact($contactID);
    }

    // Trả lời liên hệ (admin)
    
}
?> 
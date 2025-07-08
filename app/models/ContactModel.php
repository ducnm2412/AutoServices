<?php
require_once 'core/Database.php';

class ContactModel extends Database {
    // Thêm liên hệ mới
    public function addContact($name, $phone, $email, $serviceID, $message) {
        $stmt = $this->conn->prepare(
            "INSERT INTO contact (name, phone, email, serviceID, message) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("sssss", $name, $phone, $email, $serviceID, $message);
        return $stmt->execute();
    }

    // Lấy tất cả liên hệ
    public function getAllContacts() {
        $sql = "SELECT * FROM contact ORDER BY created_at DESC";
        $result = $this->conn->query($sql);
        $contacts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
        }
        return $contacts;
    }

    // Xóa liên hệ
    public function removeContact($contactID) {
        $stmt = $this->conn->prepare(
            "DELETE FROM contact WHERE contactID = ?"
        );
        $stmt->bind_param("i", $contactID);
        return $stmt->execute();
    }
    // Admin trả lời liên hệ (nối thêm vào message)
public function replyContact($contactID, $adminReply) {
    // Lấy message cũ
    $stmt = $this->conn->prepare("SELECT message FROM contact WHERE contactID = ?");
    $stmt->bind_param("i", $contactID);
    $stmt->execute();
    $stmt->bind_result($oldMessage);
    if ($stmt->fetch()) {
        $stmt->close();
        // Nối thêm trả lời admin
        $newMessage = $oldMessage . "\n---\nAdmin: " . $adminReply;
        $stmt2 = $this->conn->prepare("UPDATE contact SET message = ? WHERE contactID = ?");
        $stmt2->bind_param("si", $newMessage, $contactID);
        return $stmt2->execute();
    } else {
        $stmt->close();
        return false;
    }
}
}
?>
<?php
require_once __DIR__ . '/../repository/PaymentRepository.php';

class PaymentService {
    private $paymentRepository;

    public function __construct() {
        $this->paymentRepository = new PaymentRepository();
    }

    // Xử lý thanh toán (tạo payment mới)
    public function processPayment($orderID, $amount, $paymentMethodID) {
        // Validate dữ liệu đầu vào
        if (empty($orderID) || empty($amount) || empty($paymentMethodID)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin thanh toán!'];
        }
        if (!is_numeric($amount) || $amount <= 0) {
            return ['success' => false, 'message' => 'Số tiền thanh toán không hợp lệ!'];
        }
        $paymentID = $this->paymentRepository->create($orderID, $amount, $paymentMethodID);
        if ($paymentID) {
            return ['success' => true, 'paymentID' => $paymentID, 'message' => 'Thanh toán thành công!'];
        } else {
            return ['success' => false, 'message' => 'Có lỗi khi xử lý thanh toán!'];
        }
    }

    // Lấy thông tin hóa đơn/thanh toán theo paymentID
    public function getPaymentByID($paymentID) {
        return $this->paymentRepository->getByID($paymentID);
    }

    // Lấy thông tin hóa đơn/thanh toán theo orderID
    public function getPaymentByOrderID($orderID) {
        return $this->paymentRepository->getByOrderID($orderID);
    }

    // Lấy tên phương thức thanh toán
    public function getPaymentMethodName($paymentMethodID) {
        return $this->paymentRepository->getPaymentMethodName($paymentMethodID);
    }
}
?> 
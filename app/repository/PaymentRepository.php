<?php
require_once __DIR__ . '/../models/PaymentModel.php';

class PaymentRepository {
    private $paymentModel;

    public function __construct() {
        $this->paymentModel = new PaymentModel();
    }

    // Xử lý thanh toán (tạo payment mới)
    public function create($orderID, $amount, $paymentMethodID) {
        return $this->paymentModel->processPayment($orderID, $amount, $paymentMethodID);
    }

    // Lấy thông tin hóa đơn/thanh toán theo paymentID
    public function getByID($paymentID) {
        return $this->paymentModel->generateInvoice($paymentID);
    }

    // Lấy thông tin hóa đơn/thanh toán theo orderID
    public function getByOrderID($orderID) {
        return $this->paymentModel->getPaymentByOrder($orderID);
    }

    // Lấy tên phương thức thanh toán
    public function getPaymentMethodName($paymentMethodID) {
        return $this->paymentModel->getPaymentMethodName($paymentMethodID);
    }
}
?> 
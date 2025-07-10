<?php
require_once __DIR__ . '/../models/CustomerModel.php';

class CustomerRepository {
    private $customerModel;

    public function __construct() {
        $this->customerModel = new CustomerModel();
    }

    // Đặt dịch vụ
    public function bookServices($customerID, $serviceID, $date, $note = "") {
        return $this->customerModel->bookServices($customerID, $serviceID, $date, $note);
    }

public function viewOrderHistory($userID) {
    return $this->customerModel->viewOrderHistory($userID);
}

    // Thanh toán đơn hàng
    public function makePayment($orderID, $paymentInfo) {
        return $this->customerModel->makePayment($orderID, $paymentInfo);
    }

    // Đếm số lượng khách hàng
    public function countCustomers() {
        return $this->customerModel->countCustomers();
    }
}
?>
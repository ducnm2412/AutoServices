<?php
require_once __DIR__ . '/../repositories/CustomerRepository.php';

class CustomerService {
    private $customerRepository;

    public function __construct() {
        $this->customerRepository = new CustomerRepository();
    }

    // Đặt dịch vụ (có thể kiểm tra dữ liệu đầu vào ở đây)
    public function bookServices($customerID, $serviceID, $date, $note = "") {
        if (empty($customerID) || empty($serviceID) || empty($date)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin đặt dịch vụ!'];
        }
        // Có thể kiểm tra định dạng ngày tháng ở đây nếu muốn
        $result = $this->customerRepository->bookServices($customerID, $serviceID, $date, $note);
        if ($result) {
            return ['success' => true, 'message' => 'Đặt dịch vụ thành công!'];
        } else {
            return ['success' => false, 'message' => 'Đặt dịch vụ thất bại!'];
        }
    }
public function viewOrderHistory($userID) {
    return $this->customerRepository->viewOrderHistory($userID);
}
    // Thanh toán đơn hàng
    public function makePayment($orderID, $paymentInfo) {
        if (empty($orderID) || empty($paymentInfo)) {
            return ['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin thanh toán!'];
        }
        $result = $this->customerRepository->makePayment($orderID, $paymentInfo);
        if ($result) {
            return ['success' => true, 'message' => 'Thanh toán thành công!'];
        } else {
            return ['success' => false, 'message' => 'Thanh toán thất bại!'];
        }
    }

    // Đếm số lượng khách hàng
    public function countCustomers() {
        return $this->customerRepository->countCustomers();
    }
}
?> 
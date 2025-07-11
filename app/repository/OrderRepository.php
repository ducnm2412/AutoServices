    <?php
require_once __DIR__ . '/../models/OrderModel.php';

class OrderRepository {
    private $orderModel;

    public function __construct() {
        $this->orderModel = new OrderModel();
    }

    // Tạo đơn hàng mới
    public function createOrder($userID, $orderDate, $totalAmount, $status = 'pending') {
        return $this->orderModel->createOrder($userID, $orderDate, $totalAmount, $status);
    }

    // Thêm phụ tùng vào đơn hàng
    public function addPartToOrder($orderID, $partID, $quantity = 1) {
        return $this->orderModel->addPartToOrder($orderID, $partID, $quantity);
    }

    // Thêm dịch vụ vào đơn hàng
    public function addServiceToOrder($orderID, $serviceID) {
        return $this->orderModel->addServiceToOrder($orderID, $serviceID);
    }

    // Checkout giỏ hàng
    public function checkout($userID, $cart) {
        return $this->orderModel->checkout($userID, $cart);
    }

    // Mua nhanh 1 sản phẩm/dịch vụ
    public function buySingle($userID, $item) {
        return $this->orderModel->buySingle($userID, $item);
    }

    // Sinh hóa đơn
    public function generateInvoice($orderID) {
        return $this->orderModel->generateInvoice($orderID);
    }

    // Lấy tất cả đơn hàng (cho admin)
    public function getAllOrders() {
        return $this->orderModel->getAllOrders();
    }

    // Lấy số lượng đơn hàng theo từng tháng
    public function getOrderChart() {
        return $this->orderModel->getOrderChart();
    }

    // Cập nhật trạng thái đơn hàng
    public function updateStatus($orderID, $status) {
        return $this->orderModel->updateStatus($orderID, $status);
    }
        // Đếm tổng số đơn hàng
    public function countOrders() {
        return $this->orderModel->countOrders();
    }
}
?>
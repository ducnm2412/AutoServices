<?php
class CartService {
    public function addToCart($item) {
        if (!isset($_SESSION['cart'])) $_SESSION['cart'] = [];
        // Nếu sản phẩm đã có trong giỏ thì tăng số lượng
        foreach ($_SESSION['cart'] as &$cartItem) {
            if ($cartItem['id'] === $item['id'] && $cartItem['type'] === $item['type']) {
                if (isset($item['quantity'])) {
                    $cartItem['quantity'] += $item['quantity'];
                } else {
                    $cartItem['quantity'] = ($cartItem['quantity'] ?? 1) + 1;
                }
                return;
            }
        }
        // Nếu chưa có thì thêm mới
        if (!isset($item['quantity'])) $item['quantity'] = 1;
        $_SESSION['cart'][] = $item;
    }

    public function removeFromCart($itemId, $type) {
        if (!isset($_SESSION['cart'])) return;
        $_SESSION['cart'] = array_filter($_SESSION['cart'], function($item) use ($itemId, $type) {
            return !($item['id'] === $itemId && $item['type'] === $type);
        });
        // Đặt lại chỉ số mảng
        $_SESSION['cart'] = array_values($_SESSION['cart']);
    }

    public function updateQuantity($itemId, $type, $quantity) {
        if (!isset($_SESSION['cart'])) return;
        foreach ($_SESSION['cart'] as &$item) {
            if ($item['id'] === $itemId && $item['type'] === $type) {
                $item['quantity'] = max(1, (int)$quantity);
            }
        }
    }

    public function getCart() {
        return $_SESSION['cart'] ?? [];
    }

    public function clearCart() {
        unset($_SESSION['cart']);
    }
}
?>
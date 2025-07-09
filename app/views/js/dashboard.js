// Lấy số liệu tổng
fetch("/app/controllers/AdminController.php?action=getStats")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      document.getElementById("orderCount").textContent = data.orderCount;
      document.getElementById("customerCount").textContent = data.customerCount;
      document.getElementById("feedbackCount").textContent = data.feedbackCount;
      document.getElementById("serviceCount").textContent = data.serviceCount;
      document.getElementById("partCount").textContent = data.partCount;
    }
  });

// Lấy dữ liệu biểu đồ
fetch("/app/controllers/AdminController.php?action=getOrderChart")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      // data.data = [12, 19, 3, 5, 2, 3, ...] (12 phần tử)
      const ctx = document.getElementById("orderChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
          ],
          datasets: [
            {
              label: "Đơn hàng theo tháng",
              data: data.data,
              backgroundColor: "#e67e22",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }
  });

let typed = null;

function runTyped() {
  // Hủy nếu đã có instance trước đó
  if (typed) {
    typed.destroy();
  }

  // Tìm phần tử .simple-text trong slide đang active
  const currentItem = items[active];
  const simpleText = currentItem.querySelector('.simple-text');

  if (simpleText) {
    typed = new Typed(simpleText, {
      strings: ["Services"],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });
  }
}

let listHome = document.querySelector('.slider-home .list');
let items = document.querySelectorAll('.slider-home .list .item');
let dots = document.querySelectorAll('.slider-home .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function () {
  if (active + 1 > lengthItems) {
    active = 0;
  } else {
    active = active + 1;
  }
  reLoadSlider();
};

prev.onclick = function () {
  if (active - 1 < 0) {
    active = lengthItems;
  } else {
    active = active - 1;
  }
  reLoadSlider();
};
let refreshSlider = setInterval(()=> {next.click()}, 3000)
function reLoadSlider() {
  let offset = items[active].offsetLeft;
  listHome.style.transform = `translateX(-${offset}px)`;

  let lastActiveDot = document.querySelector('.slider-home .dots li.active');
  lastActiveDot.classList.remove('active');
  dots[active].classList.add('active');
  clearInterval(refreshSlider);
  refreshSlider = setInterval(()=> {next.click()}, 3000);
  runTyped();
}

dots.forEach((li, key) => {
    li.addEventListener('click', function(){
        active = key;
        reLoadSlider();
    })
})

// Dừng slider nếu không nhìn thấy slider-home
window.addEventListener('scroll', () => {
  const slider = document.querySelector('.slider-home');
  const rect = slider.getBoundingClientRect();
  
  // Nếu slider không còn trong vùng hiển thị → dừng auto slide
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    clearInterval(refreshSlider);
  } else {
    if (!refreshSlider) {
      refreshSlider = setInterval(() => { next.click(); }, 3000);
    }
  }
});
const menuBtn = document.querySelector('.btn-menu');
const closeBtn = document.querySelector('.btn-close');
const navBg = document.querySelector('.nav-bg');

menuBtn.addEventListener('click', function() {
  navBg.classList.add('active');
});

closeBtn.addEventListener('click', function() {
  navBg.classList.remove('active');
});
/*products-cart*/
let allProducts = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=getAll")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        allProducts = data.parts;

        // ✅ Hiển thị mặc định sản phẩm Lốp (pcat02)
        const defaultCategory = "pcat02";
        const filtered = allProducts.filter(p => p.categoryID === defaultCategory);
        renderProducts(filtered);

        // ✅ Đặt nút "Lốp" là active (nếu chưa)
        const defaultBtn = document.querySelector('[data-category="lop"]');
        if (defaultBtn) {
          document.querySelector(".tab-btn.active")?.classList.remove("active");
          defaultBtn.classList.add("active");
        }
      } else {
        console.error("Lỗi lấy danh sách sản phẩm");
      }
    })
    .catch((error) => {
      console.error("Lỗi kết nối API:", error);
    });

  // Gắn sự kiện click cho các tab
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".tab-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      let filtered = [];

      if (category === "lop") {
        filtered = allProducts.filter(p => p.categoryID === "pcat02");
      } else if (category === "acquy") {
        filtered = allProducts.filter(p => p.categoryID === "pcat03");
      } else {
        filtered = allProducts.filter(p => p.categoryID !== "pcat02" && p.categoryID !== "pcat03");
      }

      renderProducts(filtered);
      setupBuyButtons();
    });
  });
});


function renderProducts(products) {
  const productList = document.querySelector(".product-list");
  productList.innerHTML = "";

  const limitedProducts = products.slice(0, 4);

  limitedProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images}" alt="${product.name}" />
      <p>${product.name}</p>
      <p><span>Giá:</span> ${Number(product.price).toLocaleString()}₫</p>
      <div class="cart">
        <button class="btn-buy"
          data-name="${product.name}"
          data-price="${product.price}"
          data-img="${product.images}">
          Mua
        </button>
        <button>Giỏ hàng</button>
      </div>
    `;

    productList.appendChild(card);
  });

  // ✅ Sau khi tạo xong các nút "Mua", gắn sự kiện cho chúng
  setupBuyButtons();
  setupCartButtons();
}


/*
document.addEventListener("DOMContentLoaded", () => {
  fetch("/laptrinhweb/AutoServices/app/controllers/PartController.php?action=getAll")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        renderProducts(data.parts);
      } else {
        console.error("Không thể tải sản phẩm:", data.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi kết nối:", err);
    });
});
function renderProducts(products) {
  const container = document.querySelector(".product-list");
  container.innerHTML = ""; // Clear cũ

  products.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("product-item");

    item.innerHTML = `
      <img src="${product.images}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Giá: ${formatCurrency(product.price)}</p>
      <button class="add-to-cart">Thêm vào giỏ</button>
    `;

    container.appendChild(item);
  });
}

function formatCurrency(value) {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
*/
/* xử lý mua */

function setupBuyButtons() {
  const buyButtons = document.querySelectorAll(".btn-buy");
  buyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = btn.getAttribute("data-price");
      const img = btn.getAttribute("data-img");

      document.getElementById("modal-product-name").textContent = name;
      document.getElementById("modal-product-price").textContent = Number(price).toLocaleString() + "₫";
      document.getElementById("modal-product-img").src = img;

      document.getElementById("orderModal").classList.add("active");
    });
  });
}

document.querySelector(".modal .btn-close").addEventListener("click", () => {
  document.getElementById("orderModal").classList.remove("active");
});
/*xử lý giỏ hàng */
function setupCartButtons() {
  const cartButtons = document.querySelectorAll(".cart button:last-child"); // Nút Giỏ hàng
  cartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const name = card.querySelector("p").textContent;

      const priceText = card.querySelector("p:nth-of-type(2)")?.textContent || "0";
      const price = parseFloat(priceText.replace(/[^\d]/g, ""));
      const img = card.querySelector("img").src;

      const newItem = { name, price, img, quantity: 1 };
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Đã thêm vào giỏ hàng!");
    });
  });
}




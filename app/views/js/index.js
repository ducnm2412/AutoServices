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


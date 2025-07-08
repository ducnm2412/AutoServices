function loadPage(page) {
  fetch(`${page}.html`)  // Vì đã ở trong html/, không cần thêm html/
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      loadPageStyle(`../css/${page}.css`);  // css nằm ngoài html/
    })
    .catch(err => {
      document.getElementById("main-content").innerHTML = `<p style="color:red">Không thể tải ${page}</p>`;
    });
}

function loadPageStyle(cssPath) {
  const old = document.getElementById("page-style");
  if (old) old.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssPath;
  link.id = "page-style";
  document.head.appendChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage('infor'); // Mặc định
});

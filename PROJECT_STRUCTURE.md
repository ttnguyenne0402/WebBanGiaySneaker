# Cau truc source SoleStyle

## Nguyen tac sap xep

- `assets/css/base.css`: style dung chung cho header, footer, product card, cart badge va cac thanh phan lap lai.
- `assets/css/pages/*.css`: style rieng cua tung trang. Ten file trung voi ten trang HTML.
- `assets/js/data/products.js`: du lieu san pham mau cua website.
- `assets/js/core/common.js`: localStorage, gio hang, tai khoan, render san pham va cac ham dung chung.
- `assets/js/pages/*.js`: code khoi tao va hanh vi rieng cua tung trang. Ten file trung voi ten trang HTML.
- `assets/css/legacy/style-old.css`: file CSS cu duoc giu lai de doi chieu, hien khong duoc HTML goi.

## Vi du luong chay trang

- `index.html` load `assets/js/data/products.js`, `assets/js/core/common.js`, sau do load `assets/js/pages/home.js`.
- `home.js` tu quan ly slider, countdown, nut mua tren banner va goi ham render san pham dung chung.
- `products.html` load `assets/js/pages/products.js` de xu ly bo loc va danh sach san pham.
- `cart.html` load `assets/js/pages/cart.js` de render gio hang.

## Quy uoc dat ten

- File dung chung: dat trong `core`, ten theo vai tro chung.
- File rieng tung trang: dat trong `pages`, ten kebab-case theo HTML, vi du `product-detail.js`.
- Khong dat ten kieu `script_login.js` hoac `style-products.css` nua vi kho tim khi project lon len.

﻿/**
 * ============================================================
 * FILE: common.js
 * VAI TRÒ: Đây là file "xương sống" của toàn bộ website.
 * Chứa các biến toàn cục, hàm dùng chung cho tất cả trang.
 * Các trang khác sẽ gọi các hàm trong này để xử lý giỏ hàng,
 * sản phẩm, đăng nhập...
 * ============================================================
 */

// ---------- 1. LẤY DANH SÁCH SẢN PHẨM MẶC ĐỊNH ----------
// Biến defaultProducts được định nghĩa ở file HTML (thường trong thẻ script)
// Ở đây ta copy mảng đó vào biến danhSachSanPham để sử dụng.
let danhSachSanPham = defaultProducts.slice();

// ---------- 2. CÁC KHÓA LƯU TRỮ TRÊN LOCALSTORAGE ----------
// Định nghĩa tên các key dùng để lưu dữ liệu trên trình duyệt.
const khoaLuuTru = {
  gioHang: "soleStyleGioHang",          // giỏ hàng
  taiKhoan: "soleStyleTaiKhoan",        // danh sách tài khoản
  nguoiDung: "soleStyleNguoiDung",      // người dùng hiện tại
  donHang: "soleStyleDonHang"           // danh sách đơn hàng
};

// ---------- 3. DOM ELEMENTS (THAM CHIẾU ĐẾN CÁC THẺ HTML) ----------
// Lưu các phần tử trên trang để thao tác nhanh.
const luoiSanPham = document.querySelector("#luoi-san-pham");
const soKetQua = document.querySelector("#so-ket-qua");
const tieuDeDanhSachSanPham = document.querySelector("#tieu-de-danh-sach-san-pham");
const oTimKiem = document.querySelector("#o-tim-kiem");
const bieuMauTimKiemDauTrang = document.querySelector("#bieu-mau-tim-kiem-dau-trang");
const sapXepSanPham = document.querySelector("#sap-xep-san-pham");
const locKhoangGia = document.querySelector("#loc-khoang-gia");
const nutXoaBoLoc = document.querySelector("#nut-xoa-bo-loc");
const nutXemThem = document.querySelector("#nut-xem-them");
const bangBoLoc = document.querySelector("#bang-bo-loc");
const nutMoBoLoc = document.querySelector("#nut-mo-bo-loc");
const nutDongBoLoc = document.querySelector("#nut-dong-bo-loc");
const nenBoLoc = document.querySelector("#nen-bo-loc");
const cacLocThuongHieu = document.querySelectorAll(".loc-thuong-hieu");
const cacLocDanhMuc = document.querySelectorAll(".loc-danh-muc");
const cacLocDoiTuong = document.querySelectorAll(".loc-doi-tuong");
const cacNutLocThuongHieu = document.querySelectorAll("[data-loc-thuong-hieu]");
const cacNutLocDanhMuc = document.querySelectorAll("[data-loc-danh-muc]");

// Các phần tử modal chi tiết sản phẩm
const hopChiTiet = document.querySelector("#hop-chi-tiet-san-pham");
const anhChiTiet = document.querySelector("#anh-chi-tiet");
const nhanChiTiet = document.querySelector("#nhan-chi-tiet");
const tenChiTiet = document.querySelector("#ten-chi-tiet");
const nhanGiamGiaChiTiet = document.querySelector("#nhan-giam-gia-chi-tiet");
const danhGiaChiTiet = document.querySelector("#danh-gia-chi-tiet");
const giaChiTiet = document.querySelector("#gia-chi-tiet");
const giaCuChiTiet = document.querySelector("#gia-cu-chi-tiet");
const moTaChiTiet = document.querySelector("#mo-ta-chi-tiet");
const nhomMauSac = document.querySelector("#nhom-mau-sac");
const nhomKichThuoc = document.querySelector("#nhom-kich-thuoc");
const mauDangChon = document.querySelector("#mau-dang-chon");
const sizeDangChon = document.querySelector("#size-dang-chon");
const soLuongMua = document.querySelector("#so-luong-mua");
const nutGiamSoLuong = document.querySelector("#nut-giam-so-luong");
const nutTangSoLuong = document.querySelector("#nut-tang-so-luong");
const nutThemVaoGio = document.querySelector("#nut-them-vao-gio");
const nutMuaNgay = document.querySelector("#nut-mua-ngay");
const loiLuaChon = document.querySelector("#loi-lua-chon");
const thuongHieuChiTiet = document.querySelector("#thuong-hieu-chi-tiet");
const danhMucChiTiet = document.querySelector("#danh-muc-chi-tiet");
const doiTuongChiTiet = document.querySelector("#doi-tuong-chi-tiet");
const loaiChiTiet = document.querySelector("#loai-chi-tiet");
const tonKhoChiTiet = document.querySelector("#ton-kho-chi-tiet");
const breadcrumbName = document.querySelector("#breadcrumb-name");

// Các phần tử giỏ hàng (offcanvas)
const soLuongGioHang = document.querySelector("#so-luong-gio-hang");
const danhSachGioHang = document.querySelector("#danh-sach-gio-hang");
const tongTienGioHang = document.querySelector("#tong-tien-gio-hang");
const nutThanhToan = document.querySelector("#nut-thanh-toan");
const khungGioHang = document.querySelector("#khung-gio-hang");

// Phần tử tài khoản (modal)
const hopTaiKhoan = document.querySelector("#hop-tai-khoan");
const hanhDongKhach = document.querySelector("#hanh-dong-khach");
const hanhDongNguoiDung = document.querySelector("#hanh-dong-nguoi-dung");
const tenNguoiDung = document.querySelector("#ten-nguoi-dung");
const emailNguoiDung = document.querySelector("#email-nguoi-dung");
const nutDangXuat = document.querySelector("#nut-dang-xuat");
const nutMoTaiKhoan = document.querySelectorAll("[data-mo-tai-khoan]");
const tabDangNhap = document.querySelector("#tab-dang-nhap");
const tabDangKy = document.querySelector("#tab-dang-ky");
const bieuMauDangNhap = document.querySelector("#bieu-mau-dang-nhap");
const bieuMauDangKy = document.querySelector("#bieu-mau-dang-ky");
const thongBaoDangNhap = document.querySelector("#thong-bao-dang-nhap");
const thongBaoDangKy = document.querySelector("#thong-bao-dang-ky");

// Toast thông báo nhanh
const thongBaoNhanh = document.querySelector("#thong-bao-nhanh");
const noiDungThongBao = document.querySelector("#noi-dung-thong-bao");
const danhSachGioHangTrang = document.querySelector("#danh-sach-gio-hang-trang");
const tongTienGioHangTrang = document.querySelector("#tong-tien-gio-hang-trang");
const tamTinhTrang = document.querySelector("#tam-tinh-trang");
const phiVanChuyenTrang = document.querySelector("#phi-van-chuyen-trang");
const tongThanhToanTrang = document.querySelector("#tong-thanh-toan-trang");
const nutThanhToanTrang = document.querySelector("#nut-thanh-toan-trang");
const thongBaoTrang = document.querySelector("#thong-bao-trang");
const trangHienTai = document.body.dataset.page || "";

// ---------- 4. CÁC BIẾN TOÀN CỤC KHÁC ----------
// Dùng để định dạng số tiền theo kiểu Việt Nam (VD: 1,000,000đ)
const dinhDangSo = new Intl.NumberFormat("vi-VN");

// Các biến trạng thái
let gioHang = docLuuTru(khoaLuuTru.gioHang, []);          // mảng các sản phẩm trong giỏ
let taiKhoan = docLuuTru(khoaLuuTru.taiKhoan, []);        // mảng tài khoản đã đăng ký
let nguoiDungHienTai = docLuuTru(khoaLuuTru.nguoiDung, null); // thông tin user đang đăng nhập
let donHang = docLuuTru(khoaLuuTru.donHang, []);          // mảng đơn hàng
let sanPhamDangXem = null;                                // sản phẩm đang xem chi tiết
let luaChonMau = null;                                    // màu đã chọn ở modal chi tiết
let luaChonSize = null;                                   // size đã chọn ở modal chi tiết
let gioiHanSanPham = 6;                                   // số lượng sản phẩm hiển thị (dùng cho nút "Xem thêm")

const soSanPhamMoiLan = 6;                                // mỗi lần bấm "Xem thêm" thêm 6 sản phẩm

// ---------- 5. HÀM ĐỌC/GHI LOCALSTORAGE ----------
// Hàm đọc dữ liệu từ localStorage, nếu không có thì trả về giá trị mặc định.
function docLuuTru(khoa, macDinh) {
  try {
    const duLieu = localStorage.getItem(khoa);
    return duLieu ? JSON.parse(duLieu) : macDinh;
  } catch (loi) {
    // Nếu có lỗi (ví dụ dữ liệu hỏng) thì trả về mặc định
    return macDinh;
  }
}

// Hàm ghi dữ liệu vào localStorage (tự động chuyển sang chuỗi JSON)
function ghiLuuTru(khoa, duLieu) {
  localStorage.setItem(khoa, JSON.stringify(duLieu));
}

// ---------- 6. HÀM ĐỊNH DẠNG TIỀN TỆ ----------
// Chuyển số thành chuỗi có dấu phân cách hàng nghìn và ký tự 'đ'
function dinhDangTien(soTien) {
  return `${dinhDangSo.format(soTien)}đ`;
}

// ---------- 7. HÀM CHUẨN HÓA DỮ LIỆU SẢN PHẨM ----------
// Đảm bảo một object sản phẩm có đầy đủ thuộc tính, dù dữ liệu đầu vào có thể thiếu.
function chuanHoaSanPham(sanPham) {
  // Xử lý màu sắc: nếu có mảng màu thì giữ nguyên, ngược lại tạo màu mặc định.
  const mauSac = Array.isArray(sanPham.mauSac)
    ? sanPham.mauSac.map((mau) => (typeof mau === "string" ? { ten: mau, maMau: mau } : mau))
    : [{ ten: "Mặc định", maMau: "#000000" }];

  // Trả về object với các thuộc tính đã được chuẩn hóa (lấy từ các tên gọi khác nhau)
  return {
    ma: sanPham.ma ?? sanPham.id ?? sanPham.account ?? sanPham.productId ?? sanPham.code ?? sanPham.slug ?? "",
    ten: sanPham.ten ?? sanPham.name ?? sanPham.productName ?? "Sản phẩm",
    thuongHieu: sanPham.thuongHieu ?? sanPham.brand ?? sanPham.categoryLabel ?? "",
    doiTuong: sanPham.doiTuong ?? "Unisex",
    danhMuc: sanPham.danhMuc ?? sanPham.categoryLabel ?? sanPham.category ?? "Sản phẩm",
    loai: sanPham.loai ?? sanPham.type ?? "",
    gia: Number(sanPham.gia ?? sanPham.price ?? 0) || 0,
    giaCu: Number(sanPham.giaCu ?? sanPham.oldPrice ?? 0) || 0,
    danhGia: Number(sanPham.danhGia ?? sanPham.rating ?? 0) || 0,
    soDanhGia: Number(sanPham.soDanhGia ?? 0) || 0,
    tonKho: Number(sanPham.tonKho ?? sanPham.stock ?? 0) || 0,
    nhan: sanPham.nhan ?? (sanPham.giaCu ? "-10%" : "new"),
    anh: sanPham.anh ?? sanPham.image ?? "",
    moTa: sanPham.moTa ?? sanPham.description ?? "",
    mauSac,
    kichThuoc: Array.isArray(sanPham.kichThuoc)
      ? sanPham.kichThuoc
      : sanPham.kichThuoc
        ? [sanPham.kichThuoc]
        : ["Free size"]
  };
}

// Hàm lấy email chuẩn (viết thường, bỏ khoảng trắng đầu cuối)
function layEmailChuan(email) {
  return email.trim().toLowerCase();
}

// ---------- 8. HÀM LIÊN QUAN ĐẾN SẢN PHẨM ----------
// Tạo đường dẫn đến trang chi tiết sản phẩm dựa trên mã sản phẩm
function layLienKetChiTietSanPham(maSanPham) {
  return `product-detail.html?id=${encodeURIComponent(maSanPham)}`;
}

// Chuyển hướng đến trang chi tiết sản phẩm
function moTrangChiTietSanPham(maSanPham) {
  window.location.href = layLienKetChiTietSanPham(maSanPham);
}

// Tìm sản phẩm trong danhSachSanPham theo mã
function laySanPhamTheoMa(maSanPham) {
  return danhSachSanPham.find((sanPham) => String(sanPham.ma) === String(maSanPham));
}

// Lấy lựa chọn mặc định (màu và size đầu tiên) của một sản phẩm
function layLuaChonMacDinh(sanPham) {
  return {
    mauSac: sanPham.mauSac?.[0]?.ten || "Mặc định",
    kichThuoc: sanPham.kichThuoc?.[0] || "Free size"
  };
}

// ---------- 9. HÀM LẤY SẢN PHẨM TỪ ADMIN (GHI ĐÈ) ----------
// Đọc sản phẩm do admin thêm/sửa từ localStorage
function laySanPhamAdminTuLuuTru() {
  const sanPhamAdmin = docLuuTru("admin_products", null);
  return Array.isArray(sanPhamAdmin) ? sanPhamAdmin.map(chuanHoaSanPham) : [];
}

// Lấy danh sách ID sản phẩm admin đã đánh dấu xóa
function layMaSanPhamAdminDaXoa() {
  const danhSachDaXoa = docLuuTru("admin_deleted_products", []);
  return new Set(Array.isArray(danhSachDaXoa) ? danhSachDaXoa.map((ma) => String(ma)) : []);
}

// Hàm hợp nhất sản phẩm mặc định + sản phẩm admin, loại bỏ sản phẩm đã xóa
function loadProductData() {
  const adminProducts = laySanPhamAdminTuLuuTru();
  const deletedProductIds = layMaSanPhamAdminDaXoa();
  // Bắt đầu từ sản phẩm mặc định, bỏ qua những sản phẩm có ID nằm trong danh sách xóa
  const mergedProducts = defaultProducts
    .filter((product) => !deletedProductIds.has(String(product.ma)))
    .slice();

  // Ghi đè hoặc thêm sản phẩm admin vào
  adminProducts.forEach((product) => {
    const key = String(product.ma);
    if (!key || deletedProductIds.has(key)) return;
    const existingIndex = mergedProducts.findIndex((item) => String(item.ma) === key);
    if (existingIndex > -1) {
      mergedProducts[existingIndex] = product;
    } else {
      mergedProducts.push(product);
    }
  });

  return mergedProducts;
}

// ---------- 10. HÀM HIỂN THỊ THÔNG BÁO ----------
// Hiển thị thông báo trên trang (dùng cho các trang không có toast)
function hienThongBaoTrang(noiDung) {
  if (!thongBaoTrang) return;
  thongBaoTrang.textContent = noiDung;
  thongBaoTrang.classList.remove("d-none");
}

// Lấy danh sách các checkbox đã được chọn (trong bộ lọc)
function layDanhSachDaChon(danhSachOChon) {
  return Array.from(danhSachOChon)
    .filter((oChon) => oChon.checked && oChon.value !== "tat-ca")
    .map((oChon) => oChon.value);
}

// Cuộn màn hình đến danh sách sản phẩm (mượt)
function cuonDenDanhSachSanPham() {
  document.querySelector("#khu-san-pham")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Đặt giá trị cho ô tìm kiếm
function datTuKhoaTimKiem(giaTri) {
  if (oTimKiem) oTimKiem.value = giaTri;
}

// Bỏ chọn tất cả checkbox trong một danh sách
function boChonTatCa(danhSachOChon) {
  danhSachOChon.forEach((oChon) => {
    oChon.checked = false;
  });
}

// ---------- 11. HÀM CẬP NHẬT TIÊU ĐỀ DANH SÁCH ----------
// Dựa vào bộ lọc đang chọn để hiển thị tiêu đề phù hợp (ví dụ "Sản phẩm Nike")
function capNhatTieuDeDanhSach() {
  if (!tieuDeDanhSachSanPham) return;

  const thuongHieuDaChon = layDanhSachDaChon(cacLocThuongHieu);
  const danhMucDaChon = layDanhSachDaChon(cacLocDanhMuc);
  const khongCoLocNhanh = thuongHieuDaChon.length === 0 && danhMucDaChon.length === 0;

  // Cập nhật trạng thái active cho các nút lọc nhanh (nếu có)
  cacNutLocThuongHieu.forEach((nut) => {
    nut.classList.toggle("dang-chon", thuongHieuDaChon.length === 1 && nut.dataset.locThuongHieu === thuongHieuDaChon[0]);
  });
  cacNutLocDanhMuc.forEach((nut) => {
    const danhMuc = nut.dataset.locDanhMuc;
    const dangChonTatCa = danhMuc === "tat-ca" && khongCoLocNhanh;
    const dangChonDanhMuc = danhMucDaChon.length === 1 && danhMuc === danhMucDaChon[0];
    nut.classList.toggle("active", dangChonTatCa || dangChonDanhMuc);
  });

  // Đặt tiêu đề
  if (thuongHieuDaChon.length === 1 && danhMucDaChon.length === 0) {
    tieuDeDanhSachSanPham.textContent = `Sản phẩm ${thuongHieuDaChon[0]}`;
  } else if (danhMucDaChon.length === 1 && thuongHieuDaChon.length === 0) {
    tieuDeDanhSachSanPham.textContent = danhMucDaChon[0];
  } else if (danhMucDaChon.length > 0 || thuongHieuDaChon.length > 0) {
    tieuDeDanhSachSanPham.textContent = "Sản phẩm đã lọc";
  } else {
    tieuDeDanhSachSanPham.textContent = "Tất cả sản phẩm";
  }
}

// Đặt lại số lượng hiển thị về mặc định và vẽ lại sản phẩm
function veLaiTuDau() {
  gioiHanSanPham = soSanPhamMoiLan;
  veSanPham();
}

// ---------- 12. HÀM MỞ/ĐÓNG BỘ LỌC SIDEBAR (TRÊN MOBILE) ----------
function moBoLoc() {
  if (!bangBoLoc || !nenBoLoc || !nutMoBoLoc) return;
  bangBoLoc.classList.add("dang-mo");
  nenBoLoc.hidden = false;
  document.body.classList.add("bo-loc-dang-mo");
  nutMoBoLoc.setAttribute("aria-expanded", "true");
}

function dongBoLoc() {
  if (!bangBoLoc || !nenBoLoc || !nutMoBoLoc) return;
  bangBoLoc.classList.remove("dang-mo");
  nenBoLoc.hidden = true;
  document.body.classList.remove("bo-loc-dang-mo");
  nutMoBoLoc.setAttribute("aria-expanded", "false");
}

// ---------- 13. HÀM TÍNH TOÁN GIỎ HÀNG ----------
// Tính tổng tiền tạm tính của giỏ hàng
function tinhTamTinh() {
  return gioHang.reduce((tong, monHang) => tong + monHang.gia * monHang.soLuong, 0);
}

// Tính phí vận chuyển: miễn phí nếu >= 799.000đ, ngược lại 30.000đ
function tinhPhiVanChuyen() {
  const tamTinh = tinhTamTinh();
  return tamTinh === 0 || tamTinh >= 799000 ? 0 : 30000;
}

// Tổng thanh toán = tạm tính + phí ship
function tinhTongThanhToan() {
  return tinhTamTinh() + tinhPhiVanChuyen();
}

// ---------- 14. HÀM HIỂN THỊ THÔNG BÁO NHANH (TOAST) ----------
function hienThongBaoNhanh(noiDung) {
  if (!thongBaoNhanh || !noiDungThongBao) {
    hienThongBaoTrang(noiDung);
    return;
  }
  noiDungThongBao.textContent = noiDung;
  if (window.bootstrap) {
    bootstrap.Toast.getOrCreateInstance(thongBaoNhanh).show();
  }
}

// Hiển thị thông báo trong modal đăng nhập/đăng ký
function hienThongBaoBieuMau(phanTu, kieu, noiDung) {
  if (!phanTu) {
    hienThongBaoTrang(noiDung);
    return;
  }
  phanTu.textContent = noiDung;
  phanTu.className = `thong-bao-bieu-mau ${kieu}`;
  phanTu.classList.remove("d-none");
}

// Xóa thông báo trong modal
function xoaThongBaoBieuMau(phanTu) {
  if (!phanTu) return;
  phanTu.textContent = "";
  phanTu.className = "thong-bao-bieu-mau d-none";
}

// ---------- 15. HÀM MỞ/ĐÓNG MODAL (BOOTSTRAP) ----------
function moHop(phanTu) {
  if (window.bootstrap && phanTu) {
    bootstrap.Modal.getOrCreateInstance(phanTu).show();
  }
}

function dongHop(phanTu) {
  if (window.bootstrap && phanTu) {
    bootstrap.Modal.getOrCreateInstance(phanTu).hide();
  }
}

function dongGioHang() {
  if (!window.bootstrap || !khungGioHang) return;
  const bangGioHang = bootstrap.Offcanvas.getInstance(khungGioHang);
  if (bangGioHang) bangGioHang.hide();
}

function moGioHang() {
  if (!window.bootstrap || !khungGioHang) {
    window.location.href = "cart.html";
    return;
  }
  bootstrap.Offcanvas.getOrCreateInstance(khungGioHang).show();
}

function chonTabTaiKhoan(kieu) {
  const tabCanMo = kieu === "dang-ky" ? tabDangKy : tabDangNhap;
  if (window.bootstrap && tabCanMo) {
    bootstrap.Tab.getOrCreateInstance(tabCanMo).show();
  }
}

function moHopTaiKhoan(kieu = "dang-nhap") {
  if (!hopTaiKhoan) {
    window.location.href = kieu === "dang-ky" ? "create-account.html" : "login.html";
    return;
  }
  xoaThongBaoBieuMau(thongBaoDangNhap);
  xoaThongBaoBieuMau(thongBaoDangKy);
  chonTabTaiKhoan(kieu);
  moHop(hopTaiKhoan);
}

// ---------- 16. HÀM TẠO NHÃN CHO SẢN PHẨM (hết hàng, giảm giá, new) ----------
function tinhPhanTramGiam(sanPham) {
  if (!sanPham.giaCu) return 0;
  return Math.round((1 - sanPham.gia / sanPham.giaCu) * 100);
}

function taoNhanSanPham(sanPham) {
  if (sanPham.tonKho === 0) {
    return '<span class="nhan-het-hang">Hết hàng</span>';
  }
  const phanTramGiam = tinhPhanTramGiam(sanPham);
  if (phanTramGiam > 0) {
    return `<span class="nhan-giam-gia">-${phanTramGiam}%</span>`;
  }
  return '<span class="nhan-moi">new</span>';
}

// ---------- 17. HÀM LỌC SẢN PHẨM ----------
function locSanPhamTheoGia(sanPham, khoangGia) {
  if (khoangGia === "duoi-2-trieu") return sanPham.gia < 2000000;
  if (khoangGia === "tu-2-den-3-trieu") return sanPham.gia >= 2000000 && sanPham.gia <= 3000000;
  if (khoangGia === "tren-3-trieu") return sanPham.gia > 3000000;
  return true;
}

// Lấy danh sách sản phẩm sau khi áp dụng bộ lọc và sắp xếp
function laySanPhamHienThi() {
  const tuKhoa = oTimKiem ? oTimKiem.value.trim().toLowerCase() : "";
  const thuongHieuDaChon = layDanhSachDaChon(cacLocThuongHieu);
  const danhMucDaChon = layDanhSachDaChon(cacLocDanhMuc);
  const doiTuongDaChon = layDanhSachDaChon(cacLocDoiTuong);
  const khoangGia = locKhoangGia ? locKhoangGia.value : "tat-ca";

  let sanPhamHienThi = danhSachSanPham.filter((sanPham) => {
    const hopThuongHieu = thuongHieuDaChon.length === 0 || thuongHieuDaChon.includes(sanPham.thuongHieu);
    const hopDanhMuc = danhMucDaChon.length === 0 || danhMucDaChon.includes(sanPham.danhMuc);
    const hopDoiTuong = doiTuongDaChon.length === 0 || doiTuongDaChon.includes(sanPham.doiTuong);
    const hopGia = locSanPhamTheoGia(sanPham, khoangGia);
    const mauSacTimKiem = Array.isArray(sanPham.mauSac) ? sanPham.mauSac.map((mau) => mau.ten).join(" ") : "";
    const chuoiTimKiem = `${sanPham.ten} ${sanPham.thuongHieu} ${sanPham.danhMuc} ${sanPham.loai} ${sanPham.doiTuong} ${mauSacTimKiem}`.toLowerCase();
    const hopTimKiem = chuoiTimKiem.includes(tuKhoa);
    return hopThuongHieu && hopDanhMuc && hopDoiTuong && hopGia && hopTimKiem;
  });

  // Sắp xếp
  if (sapXepSanPham?.value === "gia-tang") {
    sanPhamHienThi = sanPhamHienThi.sort((a, b) => a.gia - b.gia);
  } else if (sapXepSanPham?.value === "gia-giam") {
    sanPhamHienThi = sanPhamHienThi.sort((a, b) => b.gia - a.gia);
  } else if (sapXepSanPham?.value === "giam-gia") {
    sanPhamHienThi = sanPhamHienThi
      .filter((sanPham) => sanPham.giaCu > sanPham.gia)
      .sort((a, b) => tinhPhanTramGiam(b) - tinhPhanTramGiam(a));
  }

  return sanPhamHienThi;
}

// ---------- 18. HÀM VẼ DANH SÁCH SẢN PHẨM ----------
function veSanPham() {
  if (!luoiSanPham) return;

  const sanPhamHienThi = laySanPhamHienThi();
  const tongSanPham = sanPhamHienThi.length;
  const sanPhamDangVe = sanPhamHienThi.slice(0, gioiHanSanPham);

  capNhatTieuDeDanhSach();
  soKetQua.textContent = tongSanPham > 0
    ? `Đang hiển thị ${sanPhamDangVe.length} / ${tongSanPham} sản phẩm`
    : "0 sản phẩm";

  const soSanPhamConLai = Math.max(tongSanPham - gioiHanSanPham, 0);
  nutXemThem.classList.toggle("d-none", gioiHanSanPham >= tongSanPham);
  nutXemThem.textContent = soSanPhamConLai > 0
    ? `Xem thêm ${Math.min(soSanPhamMoiLan, soSanPhamConLai)} sản phẩm`
    : "Xem thêm sản phẩm";

  if (tongSanPham === 0) {
    luoiSanPham.innerHTML = `
      <div class="col-12">
        <div class="khong-co-san-pham">Không tìm thấy sản phẩm phù hợp.</div>
      </div>
    `;
    return;
  }

  // Tạo HTML cho từng sản phẩm
  luoiSanPham.innerHTML = sanPhamDangVe.map((sanPham) => `
    <div class="col-12 col-sm-6 col-xl-4">
      <article class="the-san-pham" data-ma-san-pham="${sanPham.ma}" tabindex="0" aria-label="Xem ${sanPham.ten}">
        <div class="khung-anh-san-pham">
          ${taoNhanSanPham(sanPham)}
          <button class="nut-yeu-thich" type="button" aria-label="Yêu thích">
            <i class="bi bi-heart"></i>
          </button>
          <img src="${sanPham.anh}" alt="${sanPham.ten}">
        </div>
        <div class="than-the-san-pham">
          <p class="thuong-hieu-san-pham">${sanPham.thuongHieu}</p>
          <span class="danh-muc-san-pham">${sanPham.danhMuc}</span>
          <h3 class="ten-san-pham">${sanPham.ten}</h3>
          <div class="danh-gia-san-pham">
            <span><i class="bi bi-star-fill"></i> ${sanPham.danhGia}</span>
            <span>${sanPham.soDanhGia} đánh giá</span>
          </div>
          <p class="ton-kho-san-pham">${sanPham.tonKho > 0 ? `${sanPham.tonKho} sản phẩm còn hàng` : "Tạm hết hàng"}</p>
          <div class="dong-gia-san-pham">
            <span class="gia-moi">${dinhDangTien(sanPham.gia)}</span>
            ${sanPham.giaCu ? `<del class="gia-cu">${dinhDangTien(sanPham.giaCu)}</del>` : ""}
          </div>
          <div class="hanh-dong-card-san-pham">
            <button class="nut-gio-card" type="button" data-ma-san-pham="${sanPham.ma}" ${sanPham.tonKho === 0 ? "disabled" : ""} aria-label="Thêm vào giỏ hàng">
              <i class="bi bi-bag-plus"></i>
            </button>
            <a class="nut-mua-ngay-card${sanPham.tonKho === 0 ? " disabled" : ""}" href="${sanPham.tonKho === 0 ? "#" : layLienKetChiTietSanPham(sanPham.ma)}">
              Mua ngay
            </a>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

// ---------- 19. HÀM QUẢN LÝ GIỎ HÀNG ----------
// Lưu giỏ hàng xuống localStorage
function luuGioHang() {
  ghiLuuTru(khoaLuuTru.gioHang, gioHang);
}

// Tạo HTML cho một dòng trong giỏ hàng (dùng trong offcanvas và trang giỏ)
function taoHtmlDongGioHang(monHang) {
  return `
    <div class="dong-gio-hang">
      <img src="${monHang.anh}" alt="${monHang.ten}">
      <div>
        <h3>${monHang.ten}</h3>
        <p>Size ${monHang.kichThuoc} - ${monHang.mauSac} • ${dinhDangTien(monHang.gia)}</p>
        <div class="nut-so-luong-gio">
          <button type="button" class="giam-gio" data-ma-dong="${monHang.maDong}" aria-label="Giảm số lượng">
            <i class="bi bi-dash"></i>
          </button>
          <strong>${monHang.soLuong}</strong>
          <button type="button" class="tang-gio" data-ma-dong="${monHang.maDong}" aria-label="Tăng số lượng">
            <i class="bi bi-plus"></i>
          </button>
          <button type="button" class="nut-xoa xoa-gio" data-ma-dong="${monHang.maDong}">Xóa</button>
        </div>
      </div>
    </div>
  `;
}

// Vẽ giỏ hàng (cập nhật số lượng badge và danh sách)
function veGioHang() {
  // Cập nhật số lượng trên badge (header)
  const soLuongBadge = document.querySelector("#so-luong-gio-hang");
  if (soLuongBadge) {
    const tongSoLuong = gioHang.reduce((tong, monHang) => tong + monHang.soLuong, 0);
    soLuongBadge.textContent = tongSoLuong;
  }

  // Cập nhật tổng tiền (nếu có)
  const tongTienText = document.querySelector("#tong-tien-gio-hang");
  if (tongTienText) {
    tongTienText.textContent = dinhDangTien(tinhTamTinh());
  }

  // Nếu không có danh sách giỏ hàng thì dừng (không phải trang giỏ)
  if (!danhSachGioHang) return;

  if (gioHang.length === 0) {
    danhSachGioHang.innerHTML = '<div class="gio-hang-trong p-3 text-center text-muted">Giỏ hàng đang trống.</div>';
    return;
  }

  // Render từng dòng
  danhSachGioHang.innerHTML = gioHang.map((monHang) => {
    const linkChiTiet = `product-detail.html?id=${monHang.maSanPham}`;
    return `
      <div class="dong-gio-hang d-flex align-items-center mb-3">
        <img src="${monHang.anh}" alt="${monHang.ten}" style="width: 80px;">
        <div class="ms-3 flex-grow-1">
          <h3 class="fs-6 mb-1">
            <a href="${linkChiTiet}" class="text-dark text-decoration-none">${monHang.ten}</a>
          </h3>
          <p class="small text-secondary mb-1">Size ${monHang.kichThuoc} - ${monHang.mauSac} • ${dinhDangTien(monHang.gia)}</p>
          <div class="nut-so-luong-gio d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline-secondary giam-gio" data-ma-dong="${monHang.maDong}">
              <i class="bi bi-dash"></i>
            </button>
            <strong>${monHang.soLuong}</strong>
            <button type="button" class="btn btn-sm btn-outline-secondary tang-gio" data-ma-dong="${monHang.maDong}">
              <i class="bi bi-plus"></i>
            </button>
            <button type="button" class="btn btn-sm btn-link text-danger xoa-gio" data-ma-dong="${monHang.maDong}">
              Xóa
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ---------- 20. MỞ CHI TIẾT SẢN PHẨM (MODAL) ----------
function moChiTietSanPham(maSanPham) {
  const sanPham = danhSachSanPham.find((mon) => String(mon.ma) === String(maSanPham));
  if (!sanPham) return;

  sanPhamDangXem = sanPham;
  luaChonMau = null;
  luaChonSize = null;
  soLuongMua.value = "1";
  loiLuaChon.classList.add("d-none");

  // Chuẩn bị danh sách màu và size
  const mauSacList = Array.isArray(sanPham.mauSac) ? sanPham.mauSac : [{ ten: "Mặc định", maMau: "#000000" }];
  const kichThuocList = Array.isArray(sanPham.kichThuoc) ? sanPham.kichThuoc : [sanPham.kichThuoc || "Free size"];

  // Điền thông tin vào các thẻ
  anhChiTiet.src = sanPham.anh;
  anhChiTiet.alt = sanPham.ten;
  nhanChiTiet.textContent = `${sanPham.thuongHieu} • ${sanPham.loai}`;
  tenChiTiet.textContent = sanPham.ten;
  danhGiaChiTiet.innerHTML = `<i class="bi bi-star-fill"></i> ${sanPham.danhGia} / 5 • ${sanPham.soDanhGia} đánh giá • ${sanPham.tonKho > 0 ? `${sanPham.tonKho} còn hàng` : "Tạm hết hàng"}`;
  giaChiTiet.textContent = dinhDangTien(sanPham.gia);
  giaCuChiTiet.textContent = sanPham.giaCu ? dinhDangTien(sanPham.giaCu) : "";
  giaCuChiTiet.classList.toggle("d-none", !sanPham.giaCu);
  moTaChiTiet.textContent = sanPham.moTa;
  mauDangChon.textContent = "Chưa chọn";
  sizeDangChon.textContent = "Chưa chọn";

  // Các thông tin phụ
  if (thuongHieuChiTiet) thuongHieuChiTiet.textContent = sanPham.thuongHieu;
  if (danhMucChiTiet) danhMucChiTiet.textContent = sanPham.danhMuc;
  if (doiTuongChiTiet) doiTuongChiTiet.textContent = sanPham.doiTuong;
  if (loaiChiTiet) loaiChiTiet.textContent = sanPham.loai;
  if (tonKhoChiTiet) tonKhoChiTiet.textContent = sanPham.tonKho > 0 ? `${sanPham.tonKho} sản phẩm còn hàng` : "Tạm hết hàng";
  if (breadcrumbName) breadcrumbName.textContent = sanPham.ten;

  // Nhãn giảm giá
  const phanTramGiam = tinhPhanTramGiam(sanPham);
  nhanGiamGiaChiTiet.textContent = phanTramGiam > 0 ? `-${phanTramGiam}%` : "new";
  nhanGiamGiaChiTiet.classList.toggle("d-none", sanPham.tonKho === 0);

  // Tạo các nút chọn màu
  nhomMauSac.innerHTML = mauSacList
    .map((mau) => `
      <button class="nut-mau-sac" type="button" data-mau="${mau.ten}">
        <span class="o-mau" style="background: ${mau.maMau}"></span>
        <span>${mau.ten}</span>
      </button>
    `)
    .join("");

  // Tạo các nút chọn size
  nhomKichThuoc.innerHTML = kichThuocList
    .map((kichThuoc) => `
      <button class="nut-kich-thuoc" type="button" data-size="${kichThuoc}">${kichThuoc}</button>
    `)
    .join("");

  // Vô hiệu hóa nút nếu hết hàng
  const hetHang = sanPham.tonKho === 0;
  nutThemVaoGio.disabled = hetHang;
  nutMuaNgay.disabled = hetHang;
  if (hetHang) {
    loiLuaChon.textContent = "Sản phẩm này đang tạm hết hàng.";
    loiLuaChon.classList.remove("d-none");
  }

  moHop(hopChiTiet);
}

// ---------- 21. KIỂM TRA LỰA CHỌN (màu, size) ----------
function kiemTraLuaChon() {
  if (!sanPhamDangXem) return false;
  if (sanPhamDangXem.tonKho === 0) {
    loiLuaChon.textContent = "Sản phẩm này đang tạm hết hàng.";
    loiLuaChon.classList.remove("d-none");
    return false;
  }
  if (!luaChonMau || !luaChonSize) {
    loiLuaChon.textContent = "Vui lòng chọn màu sắc và kích thước trước khi mua.";
    loiLuaChon.classList.remove("d-none");
    return false;
  }
  loiLuaChon.classList.add("d-none");
  return true;
}

// ---------- 22. THÊM VÀO GIỎ HÀNG ----------
function themVaoGioHang(sanPham, soLuong, mauSac = luaChonMau, kichThuoc = luaChonSize) {
  // Tạo mã dòng duy nhất cho biến thể
  const maDong = `${sanPham.ma}-${mauSac}-${kichThuoc}`;
  const monTrongGio = gioHang.find((monHang) => monHang.maDong === maDong);

  if (monTrongGio) {
    monTrongGio.soLuong += soLuong;
  } else {
    gioHang.push({
      maDong,
      maSanPham: sanPham.ma,
      ten: sanPham.ten,
      thuongHieu: sanPham.thuongHieu,
      anh: sanPham.anh,
      gia: sanPham.gia,
      mauSac,
      kichThuoc,
      soLuong
    });
  }

  luuGioHang();
  veGioHang();
}

// Thêm nhanh từ card sản phẩm (không cần mở modal)
function themNhanhVaoGio(maSanPham) {
  const sanPham = laySanPhamTheoMa(maSanPham);
  if (!sanPham || sanPham.tonKho === 0) {
    hienThongBaoNhanh("Sản phẩm đang tạm hết hàng.");
    return;
  }
  const luaChonMacDinh = layLuaChonMacDinh(sanPham);
  themVaoGioHang(sanPham, 1, luaChonMacDinh.mauSac, luaChonMacDinh.kichThuoc);
  hienThongBaoNhanh("Đã thêm sản phẩm vào giỏ hàng.");
  moGioHang();
}

// Xử lý khi bấm "Thêm vào giỏ" trong modal chi tiết
function xuLyThemGio() {
  if (!kiemTraLuaChon()) return;
  themVaoGioHang(sanPhamDangXem, Number(soLuongMua.value));
  hienThongBaoNhanh("Đã thêm sản phẩm vào giỏ hàng.");
  moGioHang();
}

// Xử lý "Mua ngay" – thêm giỏ, đóng modal, chuyển sang thanh toán
function xuLyMuaNgay() {
  if (!kiemTraLuaChon()) return;
  themVaoGioHang(sanPhamDangXem, Number(soLuongMua.value));
  dongHop(hopChiTiet);
  batDauThanhToan();
}

// ---------- 23. CẬP NHẬT SỐ LƯỢNG TRONG GIỎ ----------
function capNhatSoLuongGioHang(maDong, hanhDong) {
  const monHang = gioHang.find((mon) => mon.maDong === maDong);
  if (!monHang) return;
  if (hanhDong === "tang") monHang.soLuong += 1;
  if (hanhDong === "giam") monHang.soLuong -= 1;
  // Xóa nếu số lượng <= 0
  gioHang = gioHang.filter((mon) => mon.soLuong > 0);
  luuGioHang();
  veGioHang();
}

// ---------- 24. HÀM CHUYỂN HƯỚNG THANH TOÁN ----------
// Chỉ chuyển hướng sang trang checkout.html, toàn bộ logic thanh toán nằm ở checkout.js
function batDauThanhToan() {
  if (gioHang.length === 0) {
    hienThongBaoNhanh("Giỏ hàng đang trống. Hãy thêm sản phẩm trước.");
    return;
  }
  window.location.href = "checkout.html";
}

// ---------- 25. ĐĂNG KÝ / ĐĂNG NHẬP ----------
function dangKyTaiKhoan(suKien) {
  suKien.preventDefault();
  xoaThongBaoBieuMau(thongBaoDangKy);
  bieuMauDangKy.classList.add("was-validated");

  if (!bieuMauDangKy.checkValidity()) {
    hienThongBaoBieuMau(thongBaoDangKy, "loi", "Vui lòng nhập đầy đủ thông tin hợp lệ.");
    return;
  }

  const hoTen = document.querySelector("#ho-ten-dang-ky").value.trim();
  const email = layEmailChuan(document.querySelector("#email-dang-ky").value);
  const dienThoai = document.querySelector("#dien-thoai-dang-ky").value.trim();
  const matKhau = document.querySelector("#mat-khau-dang-ky").value;
  const nhapLaiMatKhau = document.querySelector("#nhap-lai-mat-khau").value;

  if (matKhau !== nhapLaiMatKhau) {
    hienThongBaoBieuMau(thongBaoDangKy, "loi", "Mật khẩu nhập lại không khớp.");
    return;
  }
  if (taiKhoan.some((taiKhoanCu) => taiKhoanCu.email === email)) {
    hienThongBaoBieuMau(thongBaoDangKy, "loi", "Email này đã được đăng ký.");
    return;
  }

  const taiKhoanMoi = {
    ma: Date.now(),
    hoTen,
    email,
    dienThoai,
    matKhau,
    ngayTao: new Date().toISOString()
  };

  taiKhoan.push(taiKhoanMoi);
  nguoiDungHienTai = {
    ma: taiKhoanMoi.ma,
    hoTen: taiKhoanMoi.hoTen,
    email: taiKhoanMoi.email,
    dienThoai: taiKhoanMoi.dienThoai
  };

  ghiLuuTru(khoaLuuTru.taiKhoan, taiKhoan);
  ghiLuuTru(khoaLuuTru.nguoiDung, nguoiDungHienTai);
  veTrangThaiNguoiDung();
  bieuMauDangKy.reset();
  bieuMauDangKy.classList.remove("was-validated");
  hienThongBaoBieuMau(thongBaoDangKy, "thanh-cong", "Đăng ký thành công. Bạn đã được đăng nhập.");
  hienThongBaoNhanh("Đăng ký tài khoản thành công.");

  if (trangHienTai === "create-account") {
    const trangTiepTheo = new URLSearchParams(window.location.search).get("next") || "index.html";
    window.setTimeout(() => { window.location.href = trangTiepTheo; }, 500);
    return;
  }
  window.setTimeout(() => { dongHop(hopTaiKhoan); }, 800);
}

function dangNhapTaiKhoan(suKien) {
  suKien.preventDefault();
  xoaThongBaoBieuMau(thongBaoDangNhap);
  bieuMauDangNhap.classList.add("was-validated");

  if (!bieuMauDangNhap.checkValidity()) {
    hienThongBaoBieuMau(thongBaoDangNhap, "loi", "Vui lòng nhập email và mật khẩu.");
    return;
  }

  const email = layEmailChuan(document.querySelector("#email-dang-nhap").value);
  const matKhau = document.querySelector("#mat-khau-dang-nhap").value;
  const taiKhoanTimThay = taiKhoan.find((muc) => muc.email === email && muc.matKhau === matKhau);
  const isAdminLogin = !taiKhoanTimThay && email === "admin@admin.com" && matKhau === "admin";

  if (!taiKhoanTimThay && !isAdminLogin) {
    hienThongBaoBieuMau(thongBaoDangNhap, "loi", "Email hoặc mật khẩu không đúng.");
    return;
  }

  nguoiDungHienTai = isAdminLogin
    ? { ma: "admin", hoTen: "Administrator", email, dienThoai: "" }
    : {
      ma: taiKhoanTimThay.ma,
      hoTen: taiKhoanTimThay.hoTen,
      email: taiKhoanTimThay.email,
      dienThoai: taiKhoanTimThay.dienThoai
    };

  if (isAdminLogin) {
    sessionStorage.setItem("is_admin", "true");
    sessionStorage.setItem("user_name", nguoiDungHienTai.hoTen);
    sessionStorage.setItem("user_email", nguoiDungHienTai.email);
  }

  ghiLuuTru(khoaLuuTru.nguoiDung, nguoiDungHienTai);
  veTrangThaiNguoiDung();
  bieuMauDangNhap.reset();
  bieuMauDangNhap.classList.remove("was-validated");
  hienThongBaoNhanh(`Xin chào, ${nguoiDungHienTai.hoTen}.`);

  if (trangHienTai === "login") {
    const trangTiepTheo = new URLSearchParams(window.location.search).get("next") || "index.html";
    window.location.href = trangTiepTheo;
    return;
  }
  dongHop(hopTaiKhoan);
}

function dangXuatTaiKhoan() {
  nguoiDungHienTai = null;
  localStorage.removeItem(khoaLuuTru.nguoiDung);
  sessionStorage.removeItem("is_admin");
  sessionStorage.removeItem("user_name");
  sessionStorage.removeItem("user_email");
  veTrangThaiNguoiDung();
  hienThongBaoNhanh("Bạn đã đăng xuất.");
}

// ---------- 26. XÓA TẤT CẢ BỘ LỌC ----------
function xoaTatCaBoLoc() {
  boChonTatCa(cacLocThuongHieu);
  boChonTatCa(cacLocDanhMuc);
  boChonTatCa(cacLocDoiTuong);
  locKhoangGia.value = "tat-ca";
  datTuKhoaTimKiem("");
  sapXepSanPham.value = "noi-bat";
  veLaiTuDau();
}

function apDungLocThuongHieu(thuongHieu) {
  boChonTatCa(cacLocThuongHieu);
  if (thuongHieu !== "tat-ca") {
    cacLocThuongHieu.forEach((oChon) => {
      oChon.checked = oChon.value === thuongHieu;
    });
  }
  veLaiTuDau();
  cuonDenDanhSachSanPham();
}

function apDungLocDanhMuc(danhMuc) {
  boChonTatCa(cacLocDanhMuc);
  if (danhMuc !== "tat-ca") {
    cacLocDanhMuc.forEach((oChon) => {
      oChon.checked = oChon.value === danhMuc;
    });
  }
  veLaiTuDau();
  cuonDenDanhSachSanPham();
}

// ---------- 27. SỰ KIỆN DOM (GÁN KHI TẢI TRANG) ----------
if (luoiSanPham) {
  // Click trên card sản phẩm
  luoiSanPham.addEventListener("click", (suKien) => {
    const nutGioCard = suKien.target.closest(".nut-gio-card");
    if (nutGioCard) {
      suKien.preventDefault();
      suKien.stopPropagation();
      themNhanhVaoGio(nutGioCard.dataset.maSanPham);
      return;
    }
    const nutMuaNgayCard = suKien.target.closest(".nut-mua-ngay-card");
    if (nutMuaNgayCard) {
      suKien.stopPropagation();
      if (nutMuaNgayCard.classList.contains("disabled")) {
        suKien.preventDefault();
        hienThongBaoNhanh("Sản phẩm đang tạm hết hàng.");
        return;
      }
      suKien.preventDefault();
      moTrangChiTietSanPham(nutMuaNgayCard.closest(".the-san-pham")?.dataset.maSanPham || nutMuaNgayCard.dataset.maSanPham);
      return;
    }
    if (suKien.target.closest(".nut-yeu-thich")) {
      suKien.stopPropagation();
      hienThongBaoNhanh("Đã thêm vào danh sách yêu thích.");
      return;
    }
    const theSanPham = suKien.target.closest(".the-san-pham");
    if (theSanPham) {
      moTrangChiTietSanPham(theSanPham.dataset.maSanPham);
    }
  });
  luoiSanPham.addEventListener("keydown", (suKien) => {
    if (suKien.key !== "Enter") return;
    const theSanPham = suKien.target.closest(".the-san-pham");
    if (theSanPham) moTrangChiTietSanPham(theSanPham.dataset.maSanPham);
  });
}

// Sự kiện chọn màu/size trong modal
nhomMauSac?.addEventListener("click", (suKien) => {
  const nutMau = suKien.target.closest(".nut-mau-sac");
  if (!nutMau) return;
  luaChonMau = nutMau.dataset.mau;
  mauDangChon.textContent = luaChonMau;
  nhomMauSac.querySelectorAll(".nut-mau-sac").forEach((nut) => nut.classList.remove("dang-chon"));
  nutMau.classList.add("dang-chon");
  loiLuaChon.classList.add("d-none");
});

nhomKichThuoc?.addEventListener("click", (suKien) => {
  const nutSize = suKien.target.closest(".nut-kich-thuoc");
  if (!nutSize) return;
  luaChonSize = nutSize.dataset.size;
  sizeDangChon.textContent = luaChonSize;
  nhomKichThuoc.querySelectorAll(".nut-kich-thuoc").forEach((nut) => nut.classList.remove("dang-chon"));
  nutSize.classList.add("dang-chon");
  loiLuaChon.classList.add("d-none");
});

// Tăng/giảm số lượng
nutGiamSoLuong?.addEventListener("click", () => {
  soLuongMua.value = Math.max(1, Number(soLuongMua.value) - 1);
});
nutTangSoLuong?.addEventListener("click", () => {
  soLuongMua.value = Math.min(10, Number(soLuongMua.value) + 1);
});

// Sự kiện trên giỏ hàng (offcanvas)
danhSachGioHang?.addEventListener("click", (suKien) => {
  const nut = suKien.target.closest("button");
  if (!nut) return;
  const maDong = nut.dataset.maDong;
  if (nut.classList.contains("tang-gio")) capNhatSoLuongGioHang(maDong, "tang");
  if (nut.classList.contains("giam-gio")) capNhatSoLuongGioHang(maDong, "giam");
  if (nut.classList.contains("xoa-gio")) {
    gioHang = gioHang.filter((mon) => mon.maDong !== maDong);
    luuGioHang();
    veGioHang();
  }
});

// Mở modal tài khoản
nutMoTaiKhoan.forEach((nut) => {
  nut.addEventListener("click", () => moHopTaiKhoan(nut.dataset.moTaiKhoan));
});

// Lọc khi checkbox thay đổi
[...cacLocThuongHieu, ...cacLocDanhMuc, ...cacLocDoiTuong].forEach((oChon) => {
  oChon.addEventListener("change", veLaiTuDau);
});

// Tìm kiếm
oTimKiem?.addEventListener("input", () => { veLaiTuDau(); });
bieuMauTimKiemDauTrang?.addEventListener("submit", (suKien) => {
  suKien.preventDefault();
  if (!luoiSanPham) {
    const tuKhoa = encodeURIComponent(oTimKiem?.value.trim() || "");
    window.location.href = tuKhoa ? `products.html?q=${tuKhoa}` : "products.html";
    return;
  }
  veLaiTuDau();
  cuonDenDanhSachSanPham();
});

// Các nút lọc nhanh
cacNutLocThuongHieu.forEach((nut) => {
  nut.addEventListener("click", () => apDungLocThuongHieu(nut.dataset.locThuongHieu));
});
cacNutLocDanhMuc.forEach((nut) => {
  nut.addEventListener("click", () => apDungLocDanhMuc(nut.dataset.locDanhMuc));
});

// Sắp xếp, khoảng giá, xóa bộ lọc
sapXepSanPham?.addEventListener("change", veLaiTuDau);
locKhoangGia?.addEventListener("change", veLaiTuDau);
nutXoaBoLoc?.addEventListener("click", xoaTatCaBoLoc);
nutMoBoLoc?.addEventListener("click", moBoLoc);
nutDongBoLoc?.addEventListener("click", dongBoLoc);
nenBoLoc?.addEventListener("click", dongBoLoc);
document.addEventListener("keydown", (suKien) => {
  if (suKien.key === "Escape" && bangBoLoc?.classList.contains("dang-mo")) dongBoLoc();
});
nutXemThem?.addEventListener("click", () => {
  gioiHanSanPham += soSanPhamMoiLan;
  veSanPham();
});

// Nút thêm giỏ, mua ngay, thanh toán, đăng xuất
nutThemVaoGio?.addEventListener("click", xuLyThemGio);
nutMuaNgay?.addEventListener("click", xuLyMuaNgay);
nutThanhToan?.addEventListener("click", batDauThanhToan);
nutThanhToanTrang?.addEventListener("click", batDauThanhToan);
nutDangXuat?.addEventListener("click", dangXuatTaiKhoan);

// ---------- 28. HÀM ÁP DỤNG THAM SỐ URL (cho trang products) ----------
function apDungThamSoTrangSanPham() {
  if (!luoiSanPham) return;
  const thamSo = new URLSearchParams(window.location.search);
  const tuKhoa = thamSo.get("q");
  const thuongHieu = thamSo.get("brand");
  if (tuKhoa && oTimKiem) oTimKiem.value = tuKhoa;
  if (thuongHieu) {
    cacLocThuongHieu.forEach((oChon) => {
      oChon.checked = oChon.value.toLowerCase() === thuongHieu.toLowerCase();
    });
  }
}

// ---------- 29. KHỞI TẠO TRANG CHI TIẾT SẢN PHẨM ----------
function khoiTaoTrangChiTietSanPham() {
  if (trangHienTai !== "product-detail") return;
  const maSanPham = new URLSearchParams(window.location.search).get("id");
  const sanPham = laySanPhamTheoMa(maSanPham);
  if (!sanPham) {
    hienThongBaoTrang("Không tìm thấy sản phẩm.");
    return;
  }
  document.title = `${sanPham.ten} - SoleStyle`;
  moChiTietSanPham(sanPham.ma);
}

// ---------- 30. CẬP NHẬT DANH SÁCH SẢN PHẨM TỪ ADMIN ----------
danhSachSanPham = loadProductData();

// ---------- 31. HIỂN THỊ TRẠNG THÁI NGƯỜI DÙNG (HEADER) ----------
function veTrangThaiNguoiDung() {
  // Đọc lại từ localStorage để đảm bảo đồng bộ
  const userData = docLuuTru(khoaLuuTru.nguoiDung, null);
  if (userData) nguoiDungHienTai = userData;

  const hanhDongKhach = document.querySelector("#hanh-dong-khach");
  const hanhDongNguoiDung = document.querySelector("#hanh-dong-nguoi-dung");
  const tenNguoiDung = document.querySelector("#ten-nguoi-dung");
  const emailNguoiDung = document.querySelector("#email-nguoi-dung");

  if (!hanhDongKhach || !hanhDongNguoiDung || !tenNguoiDung || !emailNguoiDung) return;

  if (nguoiDungHienTai) {
    hanhDongKhach.classList.add("d-none");
    hanhDongNguoiDung.classList.remove("d-none");
    tenNguoiDung.textContent = nguoiDungHienTai.hoTen;
    emailNguoiDung.textContent = nguoiDungHienTai.email;
    // Thêm link hồ sơ nếu chưa có
    const dropdownMenu = hanhDongNguoiDung.querySelector(".dropdown-menu");
    if (dropdownMenu && !dropdownMenu.querySelector('a[href="profile.html"]')) {
      dropdownMenu.insertAdjacentHTML(
        "afterbegin",
        `
          <li><a class="dropdown-item" href="profile.html">Hồ sơ</a></li>
          <li><hr class="dropdown-divider"></li>
        `
      );
    }
    return;
  }

  // Chưa đăng nhập
  hanhDongKhach.classList.remove("d-none");
  hanhDongNguoiDung.classList.add("d-none");
  tenNguoiDung.textContent = "Tài khoản";
  emailNguoiDung.textContent = "";
}

// ---------- 32. CHAT BOX ----------
function initChatBox() {
  const toggleBtn = document.getElementById("messenger-chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const closeBtn = document.getElementById("chat-close");
  if (!toggleBtn || !chatBox || !closeBtn) return;

  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    chatBox.classList.toggle("open");
  });
  closeBtn.addEventListener("click", function () {
    chatBox.classList.remove("open");
  });
  document.addEventListener("click", function (e) {
    if (chatBox.classList.contains("open")) {
      const isClickInside = chatBox.contains(e.target) || toggleBtn.contains(e.target);
      if (!isClickInside) chatBox.classList.remove("open");
    }
  });
}

// ---------- 33. KHỞI CHẠY KHI DOM SẴN SÀNG ----------
document.addEventListener("DOMContentLoaded", function () {
  initChatBox();
  veTrangThaiNguoiDung();
  // Nếu đang ở trang chi tiết, khởi tạo
  khoiTaoTrangChiTietSanPham();
  // Cập nhật giỏ hàng lần đầu
  veGioHang();
});
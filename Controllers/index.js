// Khai báo thư viện validation
var validation = new Validation();
//Khai báo thư viện QuanLySinhVienService
var sinhVienService = new QuanLySinhVienService();
var renderTableSV = function(result) {
    var noiDung = "";
    for (var i = 0; i < result.data.length; i++) {
        var sinhVien = result.data[i];
        //moi lan duyet du lieu 1 sinh vien tao ra mot tr moi
        var dtb = (
            (sinhVien.DiemToan + sinhVien.DiemLy + sinhVien.DiemHoa) /
            3
        ).toFixed(2);
        noiDung += `
       <tr>
       <td>${sinhVien.MaSV}</td>
       <td>${sinhVien.HoTen}</td>
       <td>${sinhVien.Email}</td>
       <td>${sinhVien.SoDT}</td>
       <td>${sinhVien.CMND}</td>
       <td>${sinhVien.DiemToan}</td>
       <td>${sinhVien.DiemLy}</td>
       <td>${sinhVien.DiemHoa}</td>
       <td>${dtb}</td>
       <td>
       <button class="btn btn-primary btnSua" onclick="suaSinhVien('${sinhVien.MaSV}')">Sua</button>
       <button class="btn btn-danger btnXoa" onclick="xoaSinhVien('${sinhVien.MaSV}')">Xoa</button>
       </td>
       
       </tr>
       `;
    }
    document.querySelector("#tblDanhSachNguoiDung").innerHTML = noiDung;
};
// Phương thức sửa dữu liệu
var suaSinhVien = function(maSV) {
    // bước 1: click vào sửa hiện modal, mượn click của thêm mới
    document.querySelector("#btnThemSinhVien").click();
    //bước 2: thay đổi title và thêm nút button sửa
    document.querySelector(".modal-title").innerHTML =
        "Cập nhật thông tin sinh viên";
    document.querySelector(".modal-footer").innerHTML = `
    <button class="btn btn-primary btn-capnhat" onclick="capNhatSinhVien()">Sửa</button>
    `;
    //remove class inputError ra khỏi các control input trước đó đã kiểm tra
    document.querySelector('#MaSV').classList.remove("inputError");
    document.querySelector('#TenSV').classList.remove("inputError");
    document.querySelector('#email').classList.remove("inputError");
    document.querySelector('#CMND').classList.remove("inputError");
    document.querySelector('#SoDT').classList.remove("inputError");
    document.querySelector('#DiemToan').classList.remove("inputError");
    document.querySelector('#DiemLy').classList.remove("inputError");
    document.querySelector('#DiemHoa').classList.remove("inputError");
    //Bước 3: DÙng mã sinh viên để lấy thông tin thừ sever về api
    sinhVienService
        .layThongTinSinhVien(maSV)
        .then(function(res) {
            var sinhVien = res.data;
            // Bước 4: Sau khi lấy thông tin thì load lại lên các control input
            domSelect("#MaSV").value = sinhVien.MaSV;
            domSelect("#TenSV").value = sinhVien.HoTen;
            domSelect("#email").value = sinhVien.Email;
            domSelect("#CMND").value = sinhVien.CMND;
            domSelect("#SoDT").value = sinhVien.SoDT;
            domSelect("#DiemToan").value = sinhVien.DiemToan;
            domSelect("#DiemLy").value = sinhVien.DiemLy;
            domSelect("#DiemHoa").value = sinhVien.DiemHoa;
        })
        .catch(function(err) {
            console.log(err);
        });
};

var domSelect = function(selector) {
    return document.querySelector(selector);
};
var capNhatSinhVien = function() {
    //Khi bấm nút lưu thì lấy thông tin người dùng nhập vào sau khi sửa => gọi phương thức lưu api
    var MaSV = document.querySelector("#MaSV").value;
    var HoTen = document.querySelector("#TenSV").value;
    var Email = document.querySelector("#email").value;
    var SoDT = document.querySelector("#SoDT").value;
    var CMND = document.querySelector("#CMND").value;
    var DiemToan = document.querySelector("#DiemToan").value;
    var DiemLy = document.querySelector("#DiemLy").value;
    var DiemHoa = document.querySelector("#DiemHoa").value;
    var svUpdate = new SinhVien(
        MaSV,
        HoTen,
        Email,
        SoDT,
        CMND,
        DiemToan,
        DiemLy,
        DiemHoa
    );
    //Kiểm tra thông tin cập nhật
    var valid = true;
    valid =
        //kiểm tra họ tên rỗng
        validation.kiemTraRong(svUpdate.HoTen, "#TenSV", "inputError") &
        //Kiểm tra điểm rỗng hoặc <0 >10
        validation.kiemTraDiem(svUpdate.DiemToan, 0, 10, "#DiemToan", "inputError") &
        validation.kiemTraDiem(svUpdate.DiemLy, 0, 10, "#DiemLy", "inputError") &
        validation.kiemTraDiem(svUpdate.DiemHoa, 0, 10, "#DiemHoa", "inputError") &
        //Kiểm tra email
        validation.kiemTraEmailRong(svUpdate.Email, "#email", "inputError") &
        //Kiểm tra mã sinh viên
        validation.kiemTraDoDaiVaSo(svUpdate.MaSV, 5, 5, "#MaSV", "inputError") &
        //kiểm tra cmnd và sdt
        validation.kiemTraDoDaiVaSo(svUpdate.CMND, 9, 12, "#CMND", "inputError") &
        validation.kiemTraDoDaiVaSo(svUpdate.SoDT, 10, 11, "#SoDT", "inputError");
    console.log(valid);
    if (!valid) {
        console.log("Nhập dữ liệu thất bại");
        return;
    }
    // Gọi sv  đưa dữ liệu về api
    sinhVienService
        .capNhatSinhVien(svUpdate)
        .then(function(res) {
            console.log(res);
            location.reload();
        })
        .catch(function(err) {
            console.log(err);
        });
    // alert(1);
};
// Lấy dữ liệu từ BE

var promiseGetSinhVien = sinhVienService.LayDanhSachSinhVien();
promiseGetSinhVien.then(renderTableSV).catch(function(err) {});
// cai dat tinh nang them sinh vien
document.querySelector("#btnThemSinhVien").onclick = function() {
    //Thay đổi model heading
    document.querySelector("#exampleModalLongTitle").innerHTML = "THÊM SINH VIÊN";
    //Thêm nút thêm sinh viên
    document.querySelector(".modal-footer").innerHTML = `
        <button class='btn btn-success btnTaoMoiSinhVien' onclick="themMoiSinhVien()">Thêm sinh viên</button>
    `;
    console.log(document.querySelector("#exampleModalLongTitle").innerHTML);
};
//Cập nhật thông tin sinh viên

// Xóa dữ liệu
var xoaSinhVien = function(MaSV) {
    var cfDialog = confirm("Ban co muon xoa hay khong");
    if (cfDialog === true) {
        sinhVienService
            .xoaSinhVien(MaSV)
            .then(function(result) {
                console.log("Thanh Cong");
                location.reload();
            })
            .catch(function(err) {
                alert("That bai");
            });
    }
};

// Thêm mới một sinh viên
var themMoiSinhVien = function() {
    // Lấy thông tin người dùng nhập vào
    var MaSV = document.querySelector("#MaSV").value;
    var HoTen = document.querySelector("#TenSV").value;
    var Email = document.querySelector("#email").value;
    var SoDT = document.querySelector("#SoDT").value;
    var CMND = document.querySelector("#CMND").value;
    var DiemToan = document.querySelector("#DiemToan").value;
    var DiemLy = document.querySelector("#DiemLy").value;
    var DiemHoa = document.querySelector("#DiemHoa").value;

    var sv = new SinhVien(
        MaSV,
        HoTen,
        Email,
        SoDT,
        CMND,
        DiemToan,
        DiemLy,
        DiemHoa
    );
    console.log(sv);
    var valid = true;
    valid =
        //Kiểm tra rỗng
        // validation.kiemTraRong(sv.MaSV, "#MaSV", "inputError") &
        validation.kiemTraRong(sv.HoTen, "#TenSV", "inputError") &
        // // validation.kiemTraRong(sv.Email, "#email", "inputError") &
        // validation.kiemTraRong(sv.SoDT, "#SoDT", "inputError") &
        // validation.kiemTraRong(sv.CMND, "#CMND", "inputError") &
        // // validation.kiemTraRong(sv.DiemToan, "#DiemToan", "inputError") &
        // // validation.kiemTraRong(sv.DiemLy, "#DiemLy", "inputError") &
        // // validation.kiemTraRong(sv.DiemHoa, "#DiemHoa", "inputError") &
        // //Kiểm tra độ dài mã sinh viên
        // validation.kiemTraDoDai(sv.MaSV, 3, 5, "#MaSV", "inputError") &
        // //Kiểm tra độ dài số điện thoại
        // validation.kiemTraDoDai(sv.SoDT, 10, 11, "#SoDT", "inputError") &
        // //Kiểm tra độ dài số cmnd
        // validation.kiemTraDoDai(sv.CMND, 9, 9, "#CMND", "inputError") &
        // // Kiểm tra định dạng email
        // // validation.kiemTraEmail(sv.Email, "#email", "inputError") &

        // //Kiểm tra định dạng số
        // // validation.kiemTraSo(sv.DiemToan, "#DiemToan", "inputError") &
        // // validation.kiemTraSo(sv.DiemLy, "#DiemLy", "inputError") &
        // // validation.kiemTraSo(sv.DiemHoa, "#DiemHoa", "inputError") &
        // validation.kiemTraSo(sv.SoDT, "#SoDT", "inputError") &
        // validation.kiemTraSo(sv.CMND, "#CMND", "inputError") &
        validation.kiemTraDiem(sv.DiemToan, 0, 10, "#DiemToan", "inputError") &
        validation.kiemTraDiem(sv.DiemLy, 0, 10, "#DiemLy", "inputError") &
        validation.kiemTraDiem(sv.DiemHoa, 0, 10, "#DiemHoa", "inputError") &
        validation.kiemTraEmailRong(sv.Email, "#email", "inputError") &
        validation.kiemTraDoDaiVaSo(sv.MaSV, 5, 5, "#MaSV", "inputError") &
        validation.kiemTraDoDaiVaSo(sv.CMND, 9, 9, "#CMND", "inputError") &
        validation.kiemTraDoDaiVaSo(sv.SoDT, 10, 11, "#SoDT", "inputError");
    //Kiểm tra giá trị của điểm
    // validation.kiemTraGiaTri(sv.DiemToan, 0, 10, "#DiemToan", "inputError") &
    // validation.kiemTraGiaTri(sv.DiemLy, 0, 10, "#DiemLy", "inputError") &
    // validation.kiemTraGiaTri(sv.DiemHoa, 0, 10, "#DiemHoa", "inputError");
    //Kiểm tra
    console.log(valid);
    if (!valid) {
        console.log("Nhập dữ liệu thất bại");
        return;
    }
    console.log("Nhập dữ liệu thành công ", valid);
    sinhVienService
        .ThemSinhVien()
        .then(function() {
            console.log("Thêm sinh viên thành công");
        })
        .catch(function(err) {
            console.log("Thêm thất bại");
        });
};
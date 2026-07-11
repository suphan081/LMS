# HƯỚNG DẪN KIỂM THỬ THIẾT BỊ THẬT - ZALO MINI APP DEMO

Tài liệu này hướng dẫn cách khởi chạy dự án tại local, kết nối với điện thoại thật qua WiFi, hoặc mở trực tiếp bên trong ứng dụng Zalo (WebView) bằng kết nối Internet bảo mật.

---

## 🚀 1. KHỞI CHẠY DỰ ÁN TẠI LOCAL

### Bước 1: Cài đặt các thư viện cần thiết
Mở Terminal/Command Prompt tại thư mục dự án và chạy lệnh:
```bash
npm install
```

### Bước 2: Khởi chạy máy chủ phát triển (Dev Server)
Khởi động máy chủ phát triển:
```bash
npm run dev
```
*Mặc định dev server sẽ chạy trên cổng `3000` (hoặc `5173` tùy cấu hình local).*

---

## 📶 2. KẾT NỐI QUA MẠNG NỘI BỘ (WIFI LAN)

Để truy cập từ điện thoại qua cùng mạng WiFi:

### Bước 1: Lấy địa chỉ IP của máy tính
* **Trên Windows (CMD / Powershell):** Chạy lệnh `ipconfig` và tìm địa chỉ IPv4 (ví dụ: `192.168.1.15`).
* **Trên macOS / Linux (Terminal):** Chạy lệnh `ifconfig` hoặc truy cập Settings > Network để xem IP hiện tại.

### Bước 2: Truy cập trên điện thoại
Đảm bảo điện thoại của bạn đang kết nối chung mạng WiFi với máy tính. Mở trình duyệt trên điện thoại (Chrome/Safari) và truy cập đường dẫn:
```text
http://<ĐỊA_CHỈ_IP_CỦA_BẠN>:3000/mini-app
```
*(Ví dụ: `http://192.168.1.15:3000/mini-app`)*

> **💡 Mẹo:** Bạn có thể sao chép liên kết này và chuyển thành mã QR miễn phí qua các trang web tạo QR trực tuyến để quét trực tiếp bằng camera điện thoại cho nhanh.

---

## 📱 3. KIỂM THỬ TRONG ỨNG DỤNG ZALO (WEBVIEW)

Ứng dụng Zalo yêu cầu giao thức bảo mật bắt buộc là **HTTPS** mới có thể mở được nội dung trong WebView. Vì vậy, các link local dạng `http://` sẽ không mở được trực tiếp trong chat Zalo.

### Bước 1: Expose dự án ra internet bằng ngrok
Chạy lệnh sau tại Terminal để tạo đường hầm HTTPS miễn phí:
```bash
npx ngrok http 3000
```
*(Thay đổi `3000` thành cổng thực tế đang chạy nếu cần).*

### Bước 2: Lấy liên kết HTTPS bảo mật
Tìm đường dẫn có dạng:
```text
https://xxxx.ngrok-free.app
```

### Bước 3: Thêm đường dẫn Zalo Mini App
Thêm hậu tố `/mini-app` vào sau đường dẫn ngrok đó:
```text
https://xxxx.ngrok-free.app/mini-app
```

### Bước 4: Mở trên Zalo
1. Sao chép link HTTPS đã hoàn thiện.
2. Gửi link này vào một đoạn chat Zalo bất kỳ trên điện thoại (ví dụ gửi vào hộp thoại "Cloud của tôi").
3. Nhấp trực tiếp vào link trên màn hình điện thoại. Zalo sẽ ngay lập tức khởi chạy Zalo WebView để bạn trải nghiệm ứng dụng như một Zalo Mini App thực thụ!

---

## 🛠️ 4. CHẨN ĐOÁN LỖI & DEBUG (TROUBLESHOOTING)

* **Không thể truy cập bằng WiFi nội bộ?**
  * Hãy chắc chắn điện thoại và máy tính kết nối **cùng một cục WiFi**.
  * Kiểm tra xem Tường lửa (Firewall) trên máy tính có đang chặn kết nối ngoài hay không. Nếu có, hãy tạm thời cho phép port `3000` đi qua hoặc tắt tường lửa tạm thời.
  * Kiểm tra xem bộ định tuyến (Router WiFi) có đang bật tính năng cô lập Client (AP Isolation) hay không.

* **Giao diện hiển thị bị vỡ, không đúng tỷ lệ?**
  * Đảm bảo bạn đang truy cập chính xác vào route `/mini-app`. Route này được thiết kế theo tư duy **Mobile-First**, không sử dụng khung điện thoại giả lập và tự động co giãn tối ưu cho màn hình cảm ứng thực tế.

* **Zalo không chịu tải nội dung link?**
  * Zalo WebView bắt buộc phải dùng **HTTPS**. Hãy kiểm tra xem bạn có đang dùng link dạng `http://` hay không. Sử dụng công cụ `ngrok` để lấy liên kết HTTPS bảo mật là giải pháp tốt nhất.

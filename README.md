# Milk Store - Ứng Dụng Bán Sữa

Ứng dụng web thương mại điện tử hiện đại được xây dựng bằng React và Vite, chuyên về bán sữa và các sản phẩm từ sữa.

## Công Nghệ Sử Dụng

### Frontend
- React 18 (Framework UI)
- Vite (Build tool)
- Redux Toolkit & RTK Query (Quản lý state và API)
- Tailwind CSS (Framework CSS)
- Socket.IO Client (Kết nối realtime)
- ESLint (Kiểm tra code)
- SWC (Trình biên dịch nhanh)

### Tính Năng Chính
- 🛍️ Hiển thị sản phẩm và danh mục
- 🛒 Giỏ hàng thời gian thực
- 👤 Quản lý tài khoản người dùng
- 📦 Theo dõi đơn hàng
- 💬 Chat trực tuyến với nhân viên (Socket.IO)
- 🔍 Tìm kiếm sản phẩm
- 📱 Giao diện responsive

## Yêu Cầu Hệ Thống

- Node.js (v16 trở lên)
- npm hoặc yarn
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

## Hướng Dẫn Cài Đặt

1. Clone dự án:
```bash
git clone [đường-dẫn-repository]
cd FE
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Cấu hình môi trường:
   - Copy file `.env.example` thành `.env`
   - Cập nhật các biến môi trường:
     - `VITE_API_BASE_URL`: URL của Backend API
     - `VITE_SOCKET_URL`: URL của Socket Server
     - `VITE_CLOUDINARY_URL`: URL Cloudinary (nếu sử dụng)

4. Khởi chạy môi trường development:
```bash
npm run dev
# hoặc
yarn dev
```

## Các Lệnh Có Sẵn

- `npm run dev` - Khởi chạy môi trường phát triển
- `npm run build` - Build cho môi trường production
- `npm run lint` - Kiểm tra lỗi với ESLint
- `npm run preview` - Xem trước bản build production

## Cấu Trúc Thư Mục

```
FE/
├── src/
│   ├── components/    # Components tái sử dụng
│   ├── services/      # Các service API và Socket
│   ├── store/         # Redux store và slices
│   ├── views/         # Các trang của ứng dụng
│   ├── layouts/       # Layout và templates
│   ├── contexts/      # React Contexts
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Hàm tiện ích
│   ├── constants/     # Hằng số và cấu hình
│   ├── assets/        # Tài nguyên tĩnh
│   └── styles/        # CSS và style modules
├── public/            # Tài nguyên công khai
└── ...các file cấu hình
```

## Hướng Dẫn Triển Khai

1. Build dự án:
```bash
npm run build
# hoặc
yarn build
```

2. Kết quả build sẽ nằm trong thư mục `dist`

### Các Bước Triển Khai

1. Cấu Hình Môi Trường:
   - Tạo file `.env.production` với các biến môi trường phù hợp
   - Đảm bảo URL API và Socket đúng với môi trường production

2. Cấu Hình Web Server:
   - Cấu hình Nginx/Apache để xử lý client-side routing
   - Cài đặt SSL/TLS
   - Cấu hình CORS phù hợp
   - Thiết lập các security headers

3. Triển Khai Frontend:
   - Upload thư mục `dist` lên hosting
   - Cấu hình CDN (nếu cần)
   - Kiểm tra tất cả các routes hoạt động

4. Kiểm Tra:
   - Kiểm tra kết nối API
   - Kiểm tra WebSocket
   - Kiểm tra tính năng upload
   - Kiểm tra responsive
   - Kiểm tra performance

## Tối Ưu Hóa

- Sử dụng lazy loading cho routes
- Tối ưu hóa hình ảnh
- Minify và compress assets
- Caching phía client
- Code splitting

## Quy Tắc Phát Triển

- Tuân thủ cấu hình ESLint
- Sử dụng TypeScript cho components mới
- Tuân thủ cấu trúc thư mục
- Viết commit message rõ ràng
- Tối ưu performance và SEO

## Đóng Góp

1. Tạo nhánh mới cho tính năng
2. Commit các thay đổi
3. Tạo Pull Request

## Xử Lý Sự Cố

### Lỗi Thường Gặp
1. Lỗi kết nối API:
   - Kiểm tra URL trong .env
   - Kiểm tra CORS
   - Xác thực token

2. Lỗi Socket:
   - Kiểm tra kết nối
   - Kiểm tra event listeners
   - Xử lý reconnection

3. Lỗi Build:
   - Xóa node_modules và cài lại
   - Kiểm tra version Node.js
   - Xóa cache

## Bảo Mật

- Xử lý JWT token an toàn
- Mã hóa dữ liệu nhạy cảm
- Prevent XSS attacks
- Implement rate limiting
- Secure WebSocket connections

## Giấy Phép

[Thêm thông tin giấy phép]

## Liên Hệ

- Email: [email]
- Website: [website]
- Telegram: [telegram]

# Football Field Booking App

Ứng dụng đặt sân bóng đá mobile được xây dựng với React Native (Expo) và TypeScript.

## 📁 Cấu trúc thư mục

```
football-field-booking/
├── App.tsx                 # Entry point của ứng dụng
├── package.json
├── tsconfig.json
└── src/
    ├── navigation/         # Cấu hình điều hướng
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   ├── PlayerNavigator.tsx
    │   └── OwnerNavigator.tsx
    ├── screens/            # Các màn hình
    │   ├── auth/          # Màn hình xác thực
    │   │   ├── LoginScreen.tsx
    │   │   └── RegisterScreen.tsx
    │   ├── player/        # Màn hình dành cho người chơi
    │   │   ├── HomeScreen.tsx
    │   │   ├── FieldListScreen.tsx
    │   │   ├── FieldDetailScreen.tsx
    │   │   ├── BookingScreen.tsx
    │   │   └── ProfileScreen.tsx
    │   └── owner/         # Màn hình dành cho chủ sân
    │       ├── DashboardScreen.tsx
    │       ├── ManageFieldsScreen.tsx
    │       └── ManageBookingsScreen.tsx
    ├── components/         # Các component tái sử dụng
    ├── services/          # API services và tích hợp bên ngoài
    ├── store/             # State management (Redux, Zustand, etc.)
    ├── types/             # TypeScript type definitions
    └── utils/             # Utility functions và helpers
```

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js (v18 trở lên)
- npm hoặc yarn
- Expo CLI
- Expo Go app (trên thiết bị di động) hoặc Android/iOS simulator

### Các bước cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Khởi chạy ứng dụng:**
```bash
npm start
```

3. **Chạy trên thiết bị cụ thể:**
```bash
# Android
npm run android

# iOS (chỉ trên macOS)
npm run ios

# Web
npm run web
```

## 📱 Navigation Flow

### Auth Stack (Chưa đăng nhập)
- **Login** - Màn hình đăng nhập
- **Register** - Màn hình đăng ký

### Player Stack (Người chơi)
- **Home** - Trang chủ
- **FieldList** - Danh sách sân
- **FieldDetail** - Chi tiết sân
- **Booking** - Đặt sân
- **Profile** - Hồ sơ cá nhân

### Owner Stack (Chủ sân)
- **Dashboard** - Bảng điều khiển
- **ManageFields** - Quản lý sân
- **ManageBookings** - Quản lý đặt sân

## 🛠 Tech Stack

- **React Native** - Framework mobile
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Routing và navigation

## 📝 Ghi chú

- Đây là project skeleton cơ bản, chỉ chứa cấu trúc và placeholder
- Các màn hình hiện tại chỉ hiển thị text đơn giản
- Chưa có business logic, API integration, hoặc state management
- Logic xác thực trong `RootNavigator.tsx` đang được hard-code (cần implement)

## 🔜 Các bước tiếp theo

1. Implement authentication logic
2. Tạo các component UI tái sử dụng
3. Setup state management (Redux/Zustand/Context API)
4. Tích hợp API backend
5. Thêm form validation
6. Implement business logic cho từng màn hình
7. Styling và UI/UX design

## 📄 License

Private project

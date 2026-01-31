# Football Field Booking App

Ứng dụng đặt sân bóng đá mobile được xây dựng với React Native (Expo) và TypeScript.

## 📁 Cấu trúc thư mục

```
football-field-booking/
└── src/
    ├── navigation/         # Cấu hình điều hướng
    ├── screens/            # Các màn hình
    │   ├── auth/          # Màn hình xác thực
    │   ├── player/        # Màn hình dành cho người chơi
    │   └── owner/         # Màn hình dành cho chủ sân
    ├── components/         # Các component tái sử dụng
    ├── services/          # API services và tích hợp bên ngoài
    ├── store/             # State management (Redux, Zustand, etc.)
    ├── types/             # TypeScript type definitions
    └── utils/             # Utility functions và helpers
```

## 📂 Chi tiết cấu trúc và tác dụng

### 📍 `src/navigation/`
**Tác dụng:** Quản lý tất cả các cấu hình điều hướng của ứng dụng.

**Nội dung:**
- `RootNavigator.tsx` - Điều hướng gốc, xử lý logic chuyển đổi giữa Auth/Player/Owner
- `AuthNavigator.tsx` - Stack điều hướng cho màn hình xác thực (Login, Register)
- `PlayerNavigator.tsx` - Stack điều hướng cho người chơi (Home, FieldList, Booking, etc.)
- `OwnerNavigator.tsx` - Stack điều hướng cho chủ sân (Dashboard, ManageFields, etc.)

**Khi nào sử dụng:**
- Thêm màn hình mới vào stack tương ứng
- Thay đổi flow điều hướng giữa các màn hình
- Cấu hình options cho navigation (header, animations, etc.)

---

### 🖥 `src/screens/`
**Tác dụng:** Chứa tất cả các màn hình (screens) của ứng dụng.

**Cấu trúc con:**

#### `screens/auth/`
Màn hình liên quan đến xác thực và đăng ký:
- `LoginScreen.tsx` - Màn hình đăng nhập
- `RegisterScreen.tsx` - Màn hình đăng ký tài khoản

#### `screens/player/`
Màn hình dành cho người dùng vai trò người chơi:
- `HomeScreen.tsx` - Trang chủ
- `FieldListScreen.tsx` - Danh sách sân bóng
- `FieldDetailScreen.tsx` - Chi tiết thông tin sân
- `BookingScreen.tsx` - Đặt sân
- `ProfileScreen.tsx` - Hồ sơ cá nhân

#### `screens/owner/`
Màn hình dành cho người dùng vai trò chủ sân:
- `DashboardScreen.tsx` - Bảng điều khiển tổng quan
- `ManageFieldsScreen.tsx` - Quản lý danh sách sân
- `ManageBookingsScreen.tsx` - Quản lý lịch đặt sân

**Khi nào sử dụng:**
- Tạo màn hình mới cho chức năng mới
- Implement UI và logic cho từng màn hình
- Xử lý navigation giữa các màn hình

---

### 🧩 `src/components/`
**Tác dụng:** Lưu trữ các React component có thể tái sử dụng trong nhiều màn hình khác nhau.

**Ví dụ component nên đặt ở đây:**
- `Button.tsx` - Button tùy chỉnh
- `Input.tsx` - Input field tùy chỉnh
- `Card.tsx` - Card component
- `FieldCard.tsx` - Card hiển thị thông tin sân bóng
- `BookingItem.tsx` - Item trong danh sách booking
- `Header.tsx` - Header component
- `Loading.tsx` - Loading indicator

**Khi nào sử dụng:**
- Khi một đoạn UI được sử dụng ở nhiều nơi
- Tạo component library riêng cho project
- Tách logic UI phức tạp ra khỏi màn hình

---

### 🌐 `src/services/`
**Tác dụng:** Xử lý tất cả các tương tác với API backend và các dịch vụ bên ngoài.

**Ví dụ service nên đặt ở đây:**
- `api.ts` - Cấu hình axios/fetch base
- `authService.ts` - API liên quan đến authentication
- `fieldService.ts` - API quản lý sân bóng
- `bookingService.ts` - API đặt sân và quản lý booking
- `userService.ts` - API quản lý user profile
- `storageService.ts` - AsyncStorage/SecureStore operations

**Khi nào sử dụng:**
- Tạo/gọi API endpoints
- Xử lý request/response
- Quản lý token và authentication
- Cache và offline data

---

### 🗄 `src/store/`
**Tác dụng:** Quản lý global state của ứng dụng (Redux, Zustand, MobX, Context API, etc.).

**Ví dụ store structure:**
- `authStore.ts` - State quản lý authentication (user info, token)
- `fieldStore.ts` - State quản lý danh sách sân
- `bookingStore.ts` - State quản lý bookings
- `uiStore.ts` - State quản lý UI (loading, modals, etc.)

**Khi nào sử dụng:**
- Chia sẻ state giữa nhiều màn hình
- Quản lý user session
- Cache dữ liệu từ API
- Quản lý app-wide settings

---

### 📝 `src/types/`
**Tác dụng:** Định nghĩa tất cả TypeScript types, interfaces và enums cho toàn bộ project.

**Ví dụ types nên đặt ở đây:**
- `index.ts` - Export tất cả types
- `auth.types.ts` - Types cho authentication (User, LoginCredentials, etc.)
- `field.types.ts` - Types cho sân bóng (Field, FieldDetail, etc.)
- `booking.types.ts` - Types cho booking (Booking, TimeSlot, etc.)
- `navigation.types.ts` - Types cho navigation params

**Khi nào sử dụng:**
- Định nghĩa shape của data từ API
- Type cho props của components
- Type cho function parameters
- Enum cho constants

---

### 🛠 `src/utils/`
**Tác dụng:** Chứa các utility functions, helpers và constants được sử dụng trong toàn project.

**Ví dụ utils nên đặt ở đây:**
- `constants.ts` - App constants (API_URL, colors, sizes, etc.)
- `formatters.ts` - Format date, currency, phone number
- `validators.ts` - Validation functions (email, password, etc.)
- `helpers.ts` - Các helper functions chung
- `theme.ts` - Theme configuration (colors, fonts, spacing)

**Khi nào sử dụng:**
- Tạo pure functions không phụ thuộc vào React
- Tái sử dụng logic ở nhiều nơi
- Định nghĩa constants và configurations

---

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

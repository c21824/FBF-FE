# Hướng dẫn thêm hình ảnh

## 📸 Cần thêm hình ảnh cho WelcomeScreen

Để hoàn thiện màn hình Welcome (GEAR UP), bạn cần thêm hình ảnh cầu thủ bóng đá:

### Bước 1: Chuẩn bị hình ảnh
- Tìm hoặc tạo hình ảnh cầu thủ bóng đá (PNG với nền trong suốt tốt nhất)
- Kích thước đề xuất: 280x300 px hoặc tương tự
- Format: PNG hoặc JPG

### Bước 2: Thêm vào project
1. Tạo thư mục `assets/` trong root project (nếu chưa có)
2. Đặt file hình ảnh vào: `assets/football-player.png`

### Bước 3: Cập nhật code
File `src/screens/auth/WelcomeScreen.tsx` đã được cấu hình sẵn để load hình:

```typescript
<Image
  source={require('../../../assets/football-player.png')}
  style={styles.illustration}
  resizeMode="contain"
/>
```

### Placeholder hiện tại
Nếu chưa có hình, uncommment phần placeholder trong code:

```typescript
{/* Fallback nếu chưa có ảnh */}
<View style={styles.placeholderIllustration}>
  <Typography variant="body" color="#9CA3AF">
    🏃⚽{'\n'}
    Cầu thủ bóng đá{'\n'}
    (Thêm ảnh vào assets/)
  </Typography>
</View>
```

### Gợi ý tìm hình
- **Miễn phí:** Freepik, Flaticon, unDraw
- **Tự vẽ:** Figma, Canva
- **AI:** DALL-E, Midjourney để tạo illustration

### Ví dụ style phù hợp
- Illustration phong cách flat design
- Màu chủ đạo: xanh lá (#10B981 - emerald)
- Nền trong suốt hoặc trắng
- Vui tươi, năng động

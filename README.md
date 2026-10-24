# KIẾM SĨ HUYỀN THOẠI — LEGENDARY SWORDSMAN
## Anime 2D Action Platformer — HTML5 Canvas + JavaScript ES6+

Game hành động platformer 2D phong cách anime Nhật Bản chạy trực tiếp trên Chrome/Edge, xây dựng bằng HTML5 Canvas và JavaScript ES6+ thuần, cấu trúc mô-đun hóa dễ bảo trì và nâng cấp.

---

## ⚔ HƯỚNG DẪN THAO TÁC & BỘ ĐIỀU KHIỂN

### 1. Bàn phím (PC / Laptop)
- `A` / `D` hoặc `←` / `→`: Di chuyển Trái / Phải
- `Space` / `W` / `↑`: Nhảy lên / Bật cao
- `J` hoặc `Z`: Tấn công bằng kiếm (Nhấn liên tiếp để thực hiện **Combo 3 nhịp**)
  - *Đòn 1 (Chém ngang)*: Tốc độ nhanh, sát thương cơ bản.
  - *Đòn 2 (Chém ngược)*: Sát thương cao hơn, hất lùi quái vật.
  - *Đòn 3 (Trảm kích)*: Đòn kết thúc uy lực, rung màn hình nhẹ, gây sát thương diện rộng.
- `K` hoặc `X`: **Nguyệt Quang Trảm** (Tuyệt kỹ sóng kiếm năng lượng, tốn 35 MP)
- `Shift`: **Lướt né đòn** (Kháng sát thương trong chốc lát, lướt xuyên kẻ địch)
- `E` / `J`: Mở rương kho báu / Kích hoạt điểm kiểm tra
- `P` / `Esc`: Tạm dừng trò chơi

### 2. Màn hình cảm ứng (Điện thoại / Máy tính bảng)
- Tự động hiển thị các nút điều khiển cảm ứng trực quan: Cụm phím di chuyển Trái/Phải bên trái và cụm phím hành động (Nhảy, Chém, Tuyệt kỹ, Lướt) bên phải.

---

## 📁 CẤU TRÚC TỆP MÔ-ĐƯN MỚI (`js/`)

Trò chơi đã được tách thành 8 tệp hệ thống chuyên biệt trong thư mục `js/`:

1. **[js/config.js](file:///G:/laptrinh/KiemSiPlatformer/js/config.js)**: Khai báo tham chiếu DOM, hằng số cấp kiếm (`SWORD_TIERS`), màn chơi (`STAGES`) và biến trạng thái toàn cục (`player`, `gold`, `stageIndex`, `enemies`,...).
2. **[js/audio.js](file:///G:/laptrinh/KiemSiPlatformer/js/audio.js)**: Bộ tổng hợp âm thanh Web Audio API (Tiếng vung kiếm, chém trúng, tuyệt kỹ, tiếng boss gầm, nhặt vàng, mở rương, nhạc chiến thắng/thất bại).
3. **[js/utils.js](file:///G:/laptrinh/KiemSiPlatformer/js/utils.js)**: Tiện ích toán học (`rand`, `clamp`, `rectIntersect`), chữ sát thương nổi (`spawnFloatingPopup`), thông báo và lưu/tải tiến trình (`LocalStorage`).
4. **[js/entities.js](file:///G:/laptrinh/KiemSiPlatformer/js/entities.js)**: Khởi tạo thực thể người chơi, quái vật, xử lý gây sát thương và hạt nổ năng lượng.
5. **[js/level.js](file:///G:/laptrinh/KiemSiPlatformer/js/level.js)**: Hệ thống sinh bản đồ tự động cho 3 màn chơi, bục nhảy, hố bẫy, rương báu, cổng thoát và Boss.
6. **[js/render.js](file:///G:/laptrinh/KiemSiPlatformer/js/render.js)**: Engine đồ họa Canvas 2D (Vẽ nền parallax, bục nhảy, vật phẩm, quái vật, Boss, nhân vật anime Kaito và hiệu ứng ánh sáng).
7. **[js/ui.js](file:///G:/laptrinh/KiemSiPlatformer/js/ui.js)**: Cập nhật thanh HUD (Máu/Mana/Vàng), quản lý các cửa sổ Modal (Menu, Hướng dẫn, Cài đặt, Upgrade Shop, Pause, Victory/GameOver).
8. **[js/main.js](file:///G:/laptrinh/KiemSiPlatformer/js/main.js)**: Engine chính của game (Cập nhật vật lý, AI quái vật & Boss, lắng nghe phím bấm/cảm ứng, vòng lặp `requestAnimationFrame`).

---

## 🎮 TÍNH NĂNG NỔI BẬT

1. **Combo Kiếm 3 Nhịp & Tuyệt kỹ**: Vung kiếm theo quỹ đạo phát sáng, tấn công trên không, Nguyệt Quang Trảm phóng sóng kiếm năng lượng, Lướt né có i-frames.
2. **5 Cấp Nâng Cấp Kiếm**: Kiếm Bạc, Kiếm Lam Quang, Kiếm Nguyệt Ảnh, Kiếm Thiên Không, Kiếm Huyền Thoại.
3. **3 Màn Chơi & 3 Boss Bá Đạo**: Rừng Nguyệt Quang (Hắc Lang), Tàn Tích Hoàng Hôn (Kỵ Sĩ Tro Tàn), Lâu Đài Bóng Đêm (Chúa Tể Bóng Đêm).
4. **Tự động lưu LocalStorage**: Lưu cấp kiếm, số vàng, màn chơi đã mở và cài đặt âm thanh.

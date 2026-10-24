/**
 * ============================================================================
 * TRÒ CHƠI: KIẾM SĨ HUYỀN THOẠI (LEGENDARY SWORDSMAN)
 * TỆP GAME01.JS - PHẦN 1: DỮ LIỆU, ÂM THANH, THỰC THỂ & CƠ CHẾ CHIẾN ĐẤU
 * ============================================================================
 * DANH MỤC THẺ TÌM KIẾM NHANH (Bấm Ctrl + F để tra cứu trực tiếp):
 * - [TÌM KIẾM: DOM_CANVAS]       : Thiết lập Canvas 2D và liên kết các phần tử giao diện DOM.
 * - [TÌM KIẾM: STATE_TOAN_CUC]   : Các biến quản lý trạng thái trò chơi toàn cục.
 * - [TÌM KIẾM: 10_THAN_KIEM]     : Bảng thông số 10 cấp độ Thần Kiếm (Sát thương, Hào quang).
 * - [TÌM KIẾM: 10_AO_GIAP]       : Bảng thông số 10 cấp độ Áo Giáp (+HP, Giảm DMG %, Kháng Tê Liệt).
 * - [TÌM KIẾM: 10_GIAY_CHIEN]    : Bảng thông số 10 cấp độ Giày (+Tốc độ, Nhảy Đôi, Tốc Biến).
 * - [TÌM KIẾM: 10_MAN_CHOI]      : Cấu hình 10 màn chơi, địa hình và thông số Boss.
 * - [TÌM KIẾM: BESTIARY_DATA]    : Bách khoa toàn thư 18 Quái vật & 10 Đại Boss.
 * - [TÌM KIẾM: LOCAL_STORAGE]    : Hệ thống Lưu / Tải dữ liệu tiến trình chơi.
 * - [TÌM KIẾM: WEB_AUDIO_SYNTH]  : Bộ tổng hợp âm thanh Web Audio API (Thuần code Synth).
 * - [TÌM KIẾM: POPUP_EFFECTS]    : Chữ số sát thương nổi, thông báo Toast & Hạt bụi VFX.
 * - [TÌM KIẾM: FACTORY_ENTITY]   : Khởi tạo Kaito, quái vật (tăng % máu theo màn) & nạp màn chơi.
 * - [TÌM KIẾM: PLAYER_COMBAT]    : Hành động Chém combo 3 nhát, Nguyệt Quang Trảm, Lướt/Tốc biến.
 * - [TÌM KIẾM: CONG_THUC_DAMAGE] : Toàn bộ công thức sát thương, né đòn, khiên chặn, hút máu 200%,
 *                                  miễn thương 90%, kén tái sinh, aura băng và tê liệt.
 * - [TÌM KIẾM: MATH_AABB]        : Hàm toán học ngẫu nhiên & Thuật toán kiểm tra va chạm AABB.
 * ============================================================================
 */

// ============================================================================
// [TÌM KIẾM: DOM_CANVAS] THIẾT LẬP CANVAS VÀ THAM CHIẾU DOM GIAO DIỆN
// ============================================================================
// Tham chiếu thẻ Canvas chính và ngữ cảnh dựng hình 2D
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

// Bật bộ lọc khử răng cưa và làm mịn hình ảnh chất lượng cao
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Hàm tiện ích truy vấn nhanh phần tử DOM theo ID
var $ = id => document.getElementById(id);

// Các phần tử hiển thị thông tin nổi và trạng thái HUD trên màn hình
var overlay = $('overlay');
var hud = $('hud');
var bossHud = $('bossHud');
var toast = $('toast');
var popupContainer = $('popupContainer');

// Các Modal bảng điều khiển chức năng
var panelIntro = $('panelIntro');
var panelBestiary = $('panelBestiary');
var panelGuide = $('panelGuide');
var panelSettings = $('panelSettings');
var panelUpgrade = $('panelUpgrade');
var panelPause = $('panelPause');
var panelEnd = $('panelEnd');
var panelPasscode = $('panelPasscode');
var panelStageSelect = $('panelStageSelect');

// Canvas phụ phục vụ tính năng xem trước mô hình hoạt họa quái vật trong Bestiary
var bCanvas = $('bestiaryCanvas');
var bCtx = bCanvas ? bCanvas.getContext('2d') : null;
if (bCtx) {
  bCtx.imageSmoothingEnabled = true;
  bCtx.imageSmoothingQuality = 'high';
}

// ============================================================================
// [TÌM KIẾM: STATE_TOAN_CUC] BIẾN TRẠNG THÁI TOÀN CỤC CỦA TRÒ CHƠI
// ============================================================================
var keys = Object.create(null); // Lưu trữ trạng thái bấm/nhả của bàn phím

var running = false;      // Cờ báo hiệu vòng lặp game đang hoạt động
var paused = false;       // Cờ tạm dừng game
var lastTime = 0;         // Mốc thời gian của khung hình trước (ms)
var worldTime = 0;        // Tổng thời gian trôi qua trong thế giới game (giây)
var cameraX = 0;          // Tọa độ cuộn khung nhìn camera theo chiều ngang
var shake = 0;            // Cường độ rung lắc màn hình khi có chấn động
var screenMode = 'intro'; // Màn hình hiển thị hiện tại: 'intro' | 'game' | 'bestiary' | 'stageSelect'

// Chỉ số tiến trình và trang bị của nhân vật Kaito
var stageIndex = 0;              // Chỉ số màn chơi hiện tại (0 -> 9 tương ứng Màn 1 -> 10)
var gold = 0;                    // Số vàng thu thập được
var kills = 0;                   // Số lượng quái vật đã tiêu diệt
var swordTier = 0;               // Cấp bậc Thần Kiếm (0 -> 9)
var armorTier = 0;               // Cấp bậc Áo Giáp (0 -> 9)
var bootsTier = 0;               // Cấp bậc Giày Chiến (0 -> 9)
var currentUpgradeTab = 'sword'; // Tab trang bị đang mở: 'sword' | 'armor' | 'boots'
var checkpointX = 80;            // Tọa độ điểm lưu Checkpoint trong màn hiện tại
var gameOver = false;            // Cờ kết thúc màn chơi khi tử trận
var victory = false;             // Cờ chiến thắng toàn bộ trò chơi

// Cấu hình âm thanh Synth
var soundOn = true;
var masterVolume = 0.7;
var audioCtx = null;

var SAVE_KEY = 'kiem_si_huyen_thoai_save_v4';

// Danh sách các mảng quản lý thực thể trong thế giới trò chơi
var player = null;            // Đối tượng kiếm sĩ Kaito
var enemies = [];             // Danh sách quái vật thường đang tồn tại
var particles = [];           // Danh sách hạt bụi hiệu ứng VFX
var platforms = [];           // Danh sách bục sàn địa hình
var pickups = [];             // Danh sách vật phẩm rơi (vàng, bình máu, bình năng lượng)
var hazards = [];             // Danh sách bẫy gai nguy hiểm
var chests = [];              // Danh sách rương kho báu
var projectiles = [];         // Danh sách đạn đạo, chiêu thức tầm xa
var boss = null;              // Thực thể Đại Trùm Cuối của màn hiện tại
var exitGate = null;          // Cổng dịch chuyển hoàn thành màn chơi
var checkpoint = null;        // Thực thể cột mốc Checkpoint
var currentAttackSwingId = 0; // ID của nhát chém hiện tại (chống lỗi dính nhiều lần sát thương trong 1 hit)

// Trạng thái giao diện Bestiary
var selectedBestiaryIndex = 0;
var bestiaryAction = 'idle';
var bestiaryActionTimer = 0;

// Trạng thái mã PIN mở khóa chọn màn (Mã: 9999)
var devUnlocked = (sessionStorage.getItem('devUnlocked') === 'true');
var keySeq = '';

// ============================================================================
// [TÌM KIẾM: 10_THAN_KIEM] BẢNG THÔNG SỐ 10 CẤP ĐỘ THẦN KIẾM
// ============================================================================
var SWORD_TIERS = [
  { name: 'Cấp 1: Kiếm Bạc', dmgBonus: 0, color: '#e2e8f0', glow: '#38bdf8', aura: 'Ánh Bạc', cost: 70 },
  { name: 'Cấp 2: Kiếm Lam Quang', dmgBonus: 8, color: '#38bdf8', glow: '#0284c7', aura: 'Lam Quang', cost: 150 },
  { name: 'Cấp 3: Kiếm Nguyệt Ảnh', dmgBonus: 18, color: '#c084fc', glow: '#7e22ce', aura: 'Nguyệt Ảnh', cost: 260 },
  { name: 'Cấp 4: Kiếm Thiên Không', dmgBonus: 30, color: '#60a5fa', glow: '#2563eb', aura: 'Thiên Không', cost: 400 },
  { name: 'Cấp 5: Kiếm Huyền Thoại', dmgBonus: 48, color: '#fbbf24', glow: '#d97706', aura: 'Thánh Quang', cost: 560 },
  { name: 'Cấp 6: Băng Hồn Kiếm', dmgBonus: 65, color: '#38bdf8', glow: '#e0f2fe', aura: 'Băng Tuyết', cost: 640 },
  { name: 'Cấp 7: Lôi Thần Trảm', dmgBonus: 85, color: '#fde047', glow: '#fbbf24', aura: 'Lôi Điện', cost: 900 },
  { name: 'Cấp 8: Hỏa Ngục Đại Kiếm', dmgBonus: 110, color: '#f97316', glow: '#ef4444', aura: 'Hỏa Ngục', cost: 1240 },
  { name: 'Cấp 9: Thánh Quang Kiếm', dmgBonus: 140, color: '#ffffff', glow: '#fef08a', aura: 'Thánh Linh', cost: 1700 },
  { name: 'Cấp 10: Vũ Trụ Khởi Nguyên', dmgBonus: 180, color: '#c084fc', glow: '#f43f5e', aura: 'Thái Cổ Vũ Trụ', cost: 0 }
];

// ============================================================================
// [TÌM KIẾM: 10_AO_GIAP] BẢNG THÔNG SỐ 10 CẤP ĐỘ ÁO GIÁP
// ============================================================================
var ARMOR_TIERS = [
  { name: 'Cấp 1: Giáp Bạc Hiệp Sĩ', hpBonus: 30, dmgReduction: 0.04, desc: 'Giảm 4% sát thương nhận vào', cost: 60, icon: '🛡' },
  { name: 'Cấp 2: Giáp Lam Quang Hoàng Hôn', hpBonus: 65, dmgReduction: 0.07, desc: 'Giảm 7% sát thương nhận vào', cost: 140, icon: '🛡' },
  { name: 'Cấp 3: Dạ Nguyệt Thiết Giáp', hpBonus: 110, dmgReduction: 0.10, desc: 'Giảm 10% sát thương nhận vào', cost: 240, icon: '🛡' },
  { name: 'Cấp 4: Hắc Long Vảy Giáp', hpBonus: 170, dmgReduction: 0.14, desc: 'Giảm 14% sát thương nhận vào', cost: 380, icon: '🛡' },
  { name: 'Cấp 5: Băng Tinh Thần Giáp', hpBonus: 240, dmgReduction: 0.18, desc: 'Giảm 18% sát thương nhận vào', cost: 540, icon: '🛡' },
  { name: 'Cấp 6: Lôi Thần Khôi Giáp', hpBonus: 320, dmgReduction: 0.22, desc: 'Kháng Tê Liệt (Stun) & Giảm 22% DMG', cost: 720, icon: '🛡' },
  { name: 'Cấp 7: Hỏa Ngục Nham Giáp', hpBonus: 420, dmgReduction: 0.26, desc: 'Miễn sát thương bẫy gai & Giảm 26%', cost: 960, icon: '🛡' },
  { name: 'Cấp 8: Thánh Quang Thiên Sứ Giáp', hpBonus: 540, dmgReduction: 0.30, desc: 'Giảm 30% sát thương nhận vào', cost: 1300, icon: '🛡' },
  { name: 'Cấp 9: Hỗn Mang Nghịch Giáp', hpBonus: 680, dmgReduction: 0.35, desc: 'Giảm 35% sát thương nhận vào', cost: 1700, icon: '🛡' },
  { name: 'Cấp 10: Sáng Thế Tinh Vân Giáp', hpBonus: 850, dmgReduction: 0.42, desc: 'Giảm 42% sát thương mọi đòn', cost: 0, icon: '🛡' }
];

// ============================================================================
// [TÌM KIẾM: 10_GIAY_CHIEN] BẢNG THÔNG SỐ 10 CẤP ĐỘ GIÀY CHIẾN ĐẤU
// ============================================================================
var BOOTS_TIERS = [
  { name: 'Cấp 1: Giày Da Lữ Khách', spdMult: 1.10, jumpMult: 1.0, canDoubleJump: false, canBlink: false, desc: 'Tốc độ chạy +10%', cost: 25, icon: '👢' },
  { name: 'Cấp 2: Thiết Ủng Lam Quang', spdMult: 1.15, jumpMult: 1.08, canDoubleJump: false, canBlink: false, desc: 'Tốc độ +15%, Nhảy +8%', cost: 120, icon: '👢' },
  { name: 'Cấp 3: Hắc Ảnh Dạ Hành Ủng', spdMult: 1.20, jumpMult: 1.08, canDoubleJump: false, canBlink: false, desc: 'Tốc độ +20%, Lướt mượt', cost: 220, icon: '👢' },
  { name: 'Cấp 4: Hư Không Long Trảo Ủng', spdMult: 1.25, jumpMult: 1.12, canDoubleJump: false, canBlink: false, desc: 'Tốc độ +25%, Bám sàn', cost: 360, icon: '👢' },
  { name: 'Cấp 5: Băng Phong Tuyết Ủng', spdMult: 1.30, jumpMult: 1.15, canDoubleJump: false, canBlink: false, desc: 'Tốc độ +30%, Chống trượt băng', cost: 520, icon: '👢' },
  { name: 'Cấp 6: Lôi Điểu Phong Ba Ủng', spdMult: 1.35, jumpMult: 1.18, canDoubleJump: false, canBlink: false, desc: 'Tốc độ +35%, Hồi lướt nhanh', cost: 700, icon: '👢' },
  { name: 'Cấp 7: Dung Nham Bạo Bộ', spdMult: 1.40, jumpMult: 1.20, canDoubleJump: false, canBlink: false, desc: 'Tốc độ +40%, Bật nhảy cao', cost: 940, icon: '👢' },
  { name: 'Cấp 8: Thiên Không Dực Ủng', spdMult: 1.45, jumpMult: 1.20, canDoubleJump: true, canBlink: false, desc: 'Kích hoạt Nhảy Đôi (Double Jump)', cost: 1280, icon: '👢' },
  { name: 'Cấp 9: Hỗn Mang Thời Không Ủng', spdMult: 1.50, jumpMult: 1.22, canDoubleJump: true, canBlink: true, desc: 'Tốc Biến Vô Địch (Blink xuyên vật thể)', cost: 1680, icon: '👢' },
  { name: 'Cấp 10: Tinh Vân Vạn Giới Ủng', spdMult: 1.60, jumpMult: 1.25, canDoubleJump: true, canBlink: true, desc: 'Nhảy đôi + Tốc biến + Tốc độ +60%', cost: 0, icon: '👢' }
];

// ============================================================================
// [TÌM KIẾM: 10_MAN_CHOI] CẤU HÌNH 10 MÀN CHƠI VÀ THÔNG SỐ ĐẠI BOSS
// ============================================================================
var STAGES = [
  { name: 'RỪNG NGUYỆT QUANG', sub: 'MÀN 1 · KHU RỪNG NGUYỆT QUANG', sky1: '#0a1128', sky2: '#1c2d5a', far: '#1e3a5f', near: '#0d5257', ground: '#14532d', length: 4200, bossName: 'HẮC LANG', bossHp: 220, enemyTypes: ['slime', 'goblin', 'bat'] },
  { name: 'TÀN TÍCH HOÀNG HÔN', sub: 'MÀN 2 · PHẾ TÍCH HOÀNG HÔN', sky1: '#451a03', sky2: '#7c2d12', far: '#78350f', near: '#581c87', ground: '#4c1d95', length: 4800, bossName: 'KỴ SĨ TRO TÀN', bossHp: 340, enemyTypes: ['goblin', 'skeleton', 'sorcerer'] },
  { name: 'LÂU ĐÀI BÓNG ĐÊM', sub: 'MÀN 3 · TRẬN CHIẾN BÓNG ĐÊM', sky1: '#1a0b2e', sky2: '#2e1065', far: '#4c1d95', near: '#1e1b4b', ground: '#1e1035', length: 5400, bossName: 'CHÚA TỂ BÓNG ĐÊM', bossHp: 500, enemyTypes: ['skeleton', 'sorcerer', 'dark_knight'] },
  { name: 'VỰC SÂU BÓNG ĐÊM', sub: 'MÀN 4 · KHE NỨT HƯ KHÔNG', sky1: '#090514', sky2: '#180728', far: '#2d124d', near: '#17092b', ground: '#120721', length: 6000, bossName: 'RỒNG BÓNG TỐI KHỔNG LỒ', bossHp: 800, enemyTypes: ['dark_knight', 'shadow_gargoyle', 'void_drake'] },
  { name: 'BĂNG NGUYÊN VĨNH CỬU', sub: 'MÀN 5 · BĂNG NGUYÊN VĨNH CỬU', sky1: '#082f49', sky2: '#0369a1', far: '#0369a1', near: '#38bdf8', ground: '#0284c7', length: 6600, bossName: 'BĂNG THẦN YMIR', bossHp: 1200, enemyTypes: ['frost_stalker', 'glacial_bat'] },
  { name: 'ĐỈNH NÚI LÔI VÂN', sub: 'MÀN 6 · ĐỈNH NÚI LÔI VÂN', sky1: '#0f172a', sky2: '#1e293b', far: '#334155', near: '#475569', ground: '#1e293b', length: 7200, bossName: 'LÔI PHƯỢNG HOÀNG', bossHp: 1600, enemyTypes: ['storm_raven', 'thunder_ape'] },
  { name: 'LÒ LUYỆN DUNG NHAM', sub: 'MÀN 7 · LÒ LUYỆN DUNG NHAM', sky1: '#2e0a0a', sky2: '#7f1d1d', far: '#78350f', near: '#9a3412', ground: '#451a03', length: 7800, bossName: 'TITAN SURTR', bossHp: 4000, enemyTypes: ['magma_brute', 'lava_crawler'] }, // Boss Titan 4000 HP, Miễn 12% DMG
  { name: 'THÀNH PHỐ THIÊN KHÔNG', sub: 'MÀN 8 · THÀNH PHỐ THIÊN KHÔNG', sky1: '#0284c7', sky2: '#38bdf8', far: '#38bdf8', near: '#fde047', ground: '#cbd5e1', length: 8400, bossName: 'SERAPH', bossHp: 3000, enemyTypes: ['sanctuary_golem', 'fallen_cherub'] },
  { name: 'KHE NỨT HỖN MANG', sub: 'MÀN 9 · KHE NỨT HỖN MANG', sky1: '#050505', sky2: '#1e1b4b', far: '#4c1d95', near: '#1e1b4b', ground: '#1e1035', length: 9000, bossName: 'CHRONOS', bossHp: 4000, enemyTypes: ['void_devourer', 'rift_phantom'] },
  { name: 'ĐIỆN THỜ KHỞI NGUYÊN', sub: 'MÀN 10 · TRẬN CHIẾN SÁNG THẾ', sky1: '#020617', sky2: '#0f172a', far: '#1e1b4b', near: '#4338ca', ground: '#020617', length: 10000, bossName: 'SÁNG THẾ THẦN', bossHp: 6000, enemyTypes: ['sanctuary_golem', 'void_devourer', 'dark_knight'] }
];

// ============================================================================
// [TÌM KIẾM: BESTIARY_DATA] BÁCH KHOA TOÀN THƯ (18 QUÁI VẬT & 10 ĐẠI BOSS)
// ============================================================================
var BESTIARY_DATA = [
  { id: 'slime', name: 'Quái Nhầy Slime', type: 'enemy', role: 'Quái Thường', hp: 35, dmg: 8, spd: 'Chậm (Phóng nảy)', desc: 'Sinh vật thạch dẻo dai. Nén mình tích lực và phóng giọt nước lao thẳng vào tấn công.' },
  { id: 'goblin', name: 'Yêu Tinh Goblin', type: 'enemy', role: 'Quái Thường', hp: 55, dmg: 12, spd: 'Nhanh', desc: 'Thợ săn hoang dã cầm dao găm lướt nhanh áp sát người chơi.' },
  { id: 'skeleton', name: 'Chiến Binh Bộ Xương', type: 'enemy', role: 'Cận Chiến Phòng Thủ', hp: 75, dmg: 15, spd: 'Trung bình', desc: 'Giương khiên chặn 70% sát thương. Dưới 40% HP biến hình khổng lồ, hồi 100% máu và tăng 80% công!' },
  { id: 'bat', name: 'Dơi Bóng Tối', type: 'enemy', role: 'Quái Bay Săn Mồi', hp: 30, dmg: 9, spd: 'Rất nhanh (Hit & Run)', desc: 'Bay lượn sóng trên cao, sà chéo xuống đâm cắn rồi rút lui. Có 25% xác suất né hoàn toàn đòn đánh!' },
  { id: 'sorcerer', name: 'Pháp Sư Hư Không', type: 'enemy', role: 'Nữ Pháp Vương Tầm Xa', hp: 80, dmg: 18, spd: 'Chậm (Bay bồng bềnh)', desc: 'Cầm quyền trượng trăng khuyết tụ bắn 3 quả cầu ma pháp bóng tối từ xa.' },
  { id: 'dark_knight', name: 'Kỵ Sĩ Bóng Đêm', type: 'enemy', role: 'Cận Chiến Tinh Anh', hp: 180, dmg: 28, spd: 'Nhanh (Hộ pháp cơ bắp)', desc: 'Chiến binh hắc giáp chữ V, giảm 35% sát thương, vác thanh Đại Cự Kiếm chém cực mạnh.' },
  { id: 'shadow_gargoyle', name: 'Thạch Quỷ Hắc Ám', type: 'enemy', role: 'Quái Dậm Đất Hạng Nặng', hp: 140, dmg: 26, spd: 'Bật nhảy dậm sàn', desc: 'Tảng đá Obsidian cổ đại. Nhún người bật nhảy cực cao giáng mạnh xuống đè bẹp đối thủ.' },
  { id: 'void_drake', name: 'Tiểu Long Hắc Ám', type: 'enemy', role: 'Rồng Bay Săn Mồi', hp: 125, dmg: 22, spd: 'Bay lượn (Tia năng lượng)', desc: 'Tụ quả cầu năng lượng tối trước mõm rồi bắn thẳng tia năng lượng hắc ám chuẩn xác vào người chơi.' },
  { id: 'frost_stalker', name: 'Thỏ Tuyết Sát Thủ', type: 'enemy', role: 'Sát Thủ Băng Nguyên', hp: 90, dmg: 18, spd: 'Cực nhanh (Tốc biến)', desc: 'Đánh thường chém tới; Skill chờ 1 giây tụ khí băng rồi lướt ra sau lưng chém 2 nhát đoản đao chữ X.' },
  { id: 'glacial_bat', name: 'Dơi Băng Tinh', type: 'enemy', role: 'Quái Bay Băng Giá', hp: 95, dmg: 16, spd: 'Bay lượn (Tầm xa)', desc: 'Đánh thường lao vào cắn rồi dạt ra xa né đòn; Skill tụ quả cầu sương tuyết bắn 3 mũi gai băng hình nón.' },
  { id: 'storm_raven', name: 'Lôi Điểu', type: 'enemy', role: 'Quái Điểu Sấm Sét', hp: 130, dmg: 24, spd: 'Tốc độ âm thanh', desc: 'Thu cánh bổ nhào tốc độ siêu nhanh bọc trong mũi khoan sét gây sát thương rồi bay ra xa. Sở hữu phản xạ né đòn 20%!' },
  { id: 'thunder_ape', name: 'Khỉ Đá Bọc Lôi', type: 'enemy', role: 'Hộ Pháp Lôi Thạch', hp: 160, dmg: 28, spd: 'Chậm (Nện sàn lan tỏa)', desc: 'Đánh thường vung nắm đấm hất văng Kaito; Skill nện 2 tay xuống đất phóng sóng điện gây tê liệt 1.0 giây!' },
  { id: 'magma_brute', name: 'Quỷ Lửa Nham Thạch', type: 'enemy', role: 'Hộ Pháp Núi Lửa', hp: 190, dmg: 32, spd: 'Cận chiến (Nổ tự sát)', desc: 'Nện sàn dung nham; khi cạn máu tự kích hoạt vụ nổ hủy diệt sau 1 giây.' },
  { id: 'lava_crawler', name: 'Kỳ Nhông Hỏa Ngục', type: 'enemy', role: 'Bò Sát Lửa Tầm Xa', hp: 150, dmg: 26, spd: 'Nhanh (Phun bãi nham)', desc: 'Phồng to cổ họng phun bãi dung nham nóng bỏng cắm xuống sàn.' },
  { id: 'sanctuary_golem', name: 'Hộ Vệ Thần Tượng', type: 'enemy', role: 'Tượng Thần Hộ Thuẫn', hp: 220, dmg: 30, spd: 'Vững chãi (Kháng đòn)', desc: 'Giảm 50% sát thương và vung Đại Đao quét vệt sáng bán nguyệt.' },
  { id: 'fallen_cherub', name: 'Thiên Thần Sa Ngã', type: 'enemy', role: 'Thiên Sứ Tầm Xa', hp: 160, dmg: 34, spd: 'Bay bồng bềnh', desc: 'Thiên sứ 4 cánh, giương Cung Ánh Sáng bắn mũi tên truy đuổi. Sở hữu nội tại Huyết Thần Tái Tạo: Cứ 4 giây tự động hồi phục 70% máu!' },
  { id: 'void_devourer', name: 'Kẻ Nuốt Không Gian', type: 'enemy', role: 'Thực Thể Hư Không', hp: 240, dmg: 38, spd: 'Hút trọng lực', desc: 'Miệng giếng đen xoáy sâu thẳm, tạo lực hút trọng lực kéo người chơi vào cắn nuốt. Có 20% xác suất tự bẻ cong không gian để né đòn hoàn toàn!' },
  { id: 'rift_phantom', name: 'Ảo Ảnh Bóng Ma', type: 'enemy', role: 'Bóng Ma Thời Gian', hp: 180, dmg: 35, spd: 'Tốc độ cao (Phân thân)', desc: 'Tốc biến ra sau lưng người chơi và vung móng vuốt thời gian. Sở hữu nội tại Hư Không Thời Gian: Cứ 4 giây tự hồi 30% máu và có 35% xác suất né đòn tấn công!' },

  // 10 ĐẠI TRÙM CUỐI (1 ĐÒN THƯỜNG + 3 SKILL)
  { id: 'boss_0', name: 'HẮC LANG (Boss 1)', type: 'boss', stage: 0, role: 'Đại Trùm Rừng Sâu', hp: 220, dmg: 18, spd: 'Nhanh', desc: '• Đòn thường: Vồ cào xé.\n• Skill 1: Gầm thét sóng âm.\n• Skill 2: Huyết Ảnh Đột Kích tàn ảnh.\n• Skill 3: Hắc Nguyệt Trảo Ba phóng 3 vuốt trảm.' },
  { id: 'boss_1', name: 'KỴ SĨ TRO TÀN (Boss 2)', type: 'boss', stage: 1, role: 'Chúa Tể Hoàng Hôn', hp: 340, dmg: 22, spd: 'Trung bình', desc: '• Đòn thường: Đại kiếm quét lửa.\n• Skill 1: Địa chấn 3 cột dung nham.\n• Skill 2: Tro Tàn Hộ Thuẫn.\n• Skill 3: Cự Kiếm Trảm Thiên nổ bão lửa 2 bên.' },
  { id: 'boss_2', name: 'CHÚA TỂ BÓNG ĐÊM (Boss 3)', type: 'boss', stage: 2, role: 'Đại Pháp Vương Hư Không', hp: 500, dmg: 30, spd: 'Bay lơ lửng & Tốc biến', desc: '• Đòn thường: 3 Cầu Hắc Viêm.\n• Skill 1: Tốc biến sau lưng.\n• Skill 2: Thiên lôi Hư Không.\n• Skill 3: Đại thiên thạch hủy diệt.\n• ĐẶC BIỆT: Huyết Ấn Hư Không giúp mỗi khi gây sát thương lên Kaito sẽ hồi máu bằng 30% sát thương gây ra!' },
  { id: 'boss_3', name: 'RỒNG BÓNG TỐI (Boss 4)', type: 'boss', stage: 3, role: 'Kẻ Hủy Diệt Cổ Đại', hp: 800, dmg: 40, spd: 'Bay lượn khổng lồ', desc: '• Đòn thường: Cào táp xé rách.\n• Skill 1: Bão lửa tím quét đất 3 đợt.\n• Skill 2: Tốc biến cắn rồi rút lui.\n• Skill 3: Mưa Thủy Tinh Thể 5 đợt.\n• ĐẶC BIỆT: Có 25% xác suất né hoàn toàn đòn đánh! Khi HP dưới 50% sẽ tăng 30% sát thương và bốc khói bóng tối ma quái!' },
  { id: 'boss_4', name: 'BĂNG THẦN YMIR (Boss 5)', type: 'boss', stage: 4, role: 'Goliath Băng Cổ Đại', hp: 1200, dmg: 45, spd: 'Cự Nhân Băng', desc: '• Đòn thường: Quét Đại Chùy Băng Gai.\n• Skill 1: Chông băng địa chấn.\n• Skill 2: Đại Băng Thạch Tinh Cầu nổ 4 hướng.\n• Skill 3: Bão Tuyết Tuyệt Đối mưa nhũ băng.\n• ĐẶC BIỆT: Khi HP <= 35%, kích hoạt Aura Băng Hộ Thể miễn 70% sát thương nhận vào!' },
  { id: 'boss_5', name: 'LÔI PHƯỢNG HOÀNG (Boss 6)', type: 'boss', stage: 5, role: 'Thượng Cổ Lôi Điểu', hp: 1600, dmg: 55, spd: 'Tốc Độ Âm Thanh (220)', desc: '• Đòn thường: Đao lôi plasma vàng óng.\n• Skill 1: Lôi Trận Thiên Đình 5 cột sét.\n• Skill 2: Trùng lôi bổ nhào chữ V siêu tốc.\n• Skill 3: Bão Điện Tinh Cầu khổng lồ.\n• ĐẶC BIỆT: Khi cạn máu hóa Kén Sấm hồi sinh 100% HP 1 lần duy nhất!' },
  { id: 'boss_6', name: 'TITAN SURTR (Boss 7)', type: 'boss', stage: 6, role: 'Chúa Tể Lò Luyện', hp: 4000, dmg: 65, spd: 'Titan Nham Thạch', desc: '• Đòn thường: Chiến chùy gang lửa.\n• Skill 1: Nện búa sóng thần lửa 2 bên.\n• Skill 2: Mưa bom nham thạch.\n• Skill 3: 3 Cột lửa hỏa ngục phun trào.\n• ĐẶC BIỆT: Thân bọc giáp gang hắc thiết cứng cáp, sở hữu 4000 HP và vĩnh viễn miễn 12% mọi sát thương nhận vào!' },
  { id: 'boss_7', name: 'SERAPH (Boss 8)', type: 'boss', stage: 7, role: 'Thánh Kiếm Bình Minh', hp: 3000, dmg: 75, spd: '6 Cánh Ánh Sáng', desc: '• Đòn thường: Song Kiếm Thánh Quang.\n• Skill 1: Vạn Kiếm Quy Tông 6 kiếm.\n• Skill 2: Thánh Quang tốc biến chém chữ X.\n• Skill 3: Thánh Phạt Thiên Đình 3 cột sáng.\n• ĐẶC BIỆT: Có 30% khả năng né đòn! Nội tại Thánh Quang Phục Sinh cứ mỗi 5 giây tự động hồi phục 15% máu tối đa (+450 HP)!' },
  { id: 'boss_8', name: 'CHRONOS (Boss 9)', type: 'boss', stage: 8, role: 'Thực Thể Hư Không', hp: 4000, dmg: 90, spd: 'Đảo Trọng Lực', desc: '• Đòn thường: 4 Xúc tu bóng tối.\n• Skill 1: Sóng nghịch lý giật lùi.\n• Skill 2: 3 Cầu Thời Gian ngưng đọng.\n• Skill 3: Hố Đen Sụp Đổ tạo lực hút trọng lực và hồi máu bằng 200% sát thương gây ra!\n• ĐẶC BIỆT: Cứ mỗi 3 giây xuất hiện vòng sáng đen bao quanh giúp miễn 90% mọi sát thương trong 2 giây!' },
  { id: 'boss_9', name: 'SÁNG THẾ THẦN (Boss 10)', type: 'boss', stage: 9, role: 'Thái Cổ Tối Thượng', hp: 6000, dmg: 120, spd: '3 Phase Nguyên Tố', desc: '• Đòn thường: Sóng ánh sao cầu vồng.\n• Skill 1: Lưỡng Cực Băng Hỏa đạn xoắn.\n• Skill 2: Thiên Đình Lôi Quang liên hoàn.\n• Skill 3: Tiểu hành tinh Supernova rơi nổ.\n• ĐẶC BIỆT 1: Cứ 4 giây tự hồi 30% máu tối đa (+1800 HP) và miễn thương hoàn toàn trong 2 giây!\n• ĐẶC BIỆT 2: Cứ 10 giây triệu hồi 2 quái trong màn hoặc triệu hồi 1 Ảo Ảnh Boss map khác trợ chiến!' }
];

// ============================================================================
// [TÌM KIẾM: LOCAL_STORAGE] HỆ THỐNG LƯU / TẢI TIẾN TRÌNH CHƠI
// ============================================================================
function loadSave() {
  try {
    var dataStr = localStorage.getItem(SAVE_KEY);
    if (dataStr) {
      var data = JSON.parse(dataStr);
      if (data && typeof data === 'object') {
        stageIndex = Math.min(data.stageIndex || 0, STAGES.length - 1);
        gold = data.gold || 0;
        kills = data.kills || 0;
        swordTier = Math.min(data.swordTier || 0, SWORD_TIERS.length - 1);
        armorTier = Math.min(data.armorTier || 0, ARMOR_TIERS.length - 1);
        bootsTier = Math.min(data.bootsTier || 0, BOOTS_TIERS.length - 1);
        soundOn = data.soundOn !== undefined ? data.soundOn : true;
        masterVolume = data.volume !== undefined ? data.volume : 0.7;
        updateSaveUI();
        return true;
      }
    }
  } catch (e) {}
  updateSaveUI();
  return false;
}

function writeSave() {
  try {
    var data = { stageIndex, gold, kills, swordTier, armorTier, bootsTier, soundOn, volume: masterVolume };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {}
}

function resetSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    stageIndex = 0; gold = 0; kills = 0; swordTier = 0; armorTier = 0; bootsTier = 0;
    updateSaveUI();
    say('Đã xóa dữ liệu lưu trò chơi!');
  } catch (e) {}
}

function updateSaveUI() {
  var hasSave = !!localStorage.getItem(SAVE_KEY);
  if ($('continueBtn')) $('continueBtn').hidden = !hasSave;
  if ($('soundBtn')) $('soundBtn').textContent = `♫ Âm thanh: ${soundOn ? 'Bật' : 'Tắt'}`;
  if ($('toggleSoundSetting')) $('toggleSoundSetting').textContent = soundOn ? 'Đang Bật' : 'Đang Tắt';
  if ($('volumeSlider')) $('volumeSlider').value = Math.round(masterVolume * 100);
}

// ============================================================================
// [TÌM KIẾM: WEB_AUDIO_SYNTH] BỘ TỔNG HỢP ÂM THANH THUẦN
// ============================================================================
function initAudio() {
  try {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {}
}

function playSynthSound(freq, dur = 0.1, type = 'sine', vol = 0.05, slideFreq = null) {
  if (!soundOn) return;
  initAudio();
  try {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    var now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), now + dur);
    }

    var finalVol = vol * masterVolume;
    gain.gain.setValueAtTime(finalVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur);
  } catch (e) {}
}

var playJumpSFX = () => playSynthSound(280, 0.1, 'triangle', 0.04, 520);
var playSlashSFX = combo => {
  var freq = combo === 3 ? 160 : combo === 2 ? 320 : 420;
  var slide = combo === 3 ? 720 : 220;
  var dur = combo === 3 ? 0.18 : 0.1;
  playSynthSound(freq, dur, combo === 3 ? 'sawtooth' : 'triangle', 0.06, slide);
};
var playSkillSFX = () => {
  playSynthSound(550, 0.25, 'sawtooth', 0.08, 120);
  setTimeout(() => playSynthSound(880, 0.3, 'sine', 0.06, 350), 50);
};
var playDashSFX = () => playSynthSound(220, 0.12, 'sine', 0.04, 80);
var playHitSFX = () => playSynthSound(180, 0.08, 'square', 0.05, 60);
var playHurtSFX = () => playSynthSound(130, 0.15, 'sawtooth', 0.08, 40);
var playCoinSFX = () => {
  playSynthSound(988, 0.08, 'sine', 0.04);
  setTimeout(() => playSynthSound(1318, 0.12, 'sine', 0.04), 40);
};
var playChestSFX = () => {
  playSynthSound(523, 0.12, 'triangle', 0.06);
  setTimeout(() => playSynthSound(659, 0.12, 'triangle', 0.06), 80);
  setTimeout(() => playSynthSound(784, 0.12, 'triangle', 0.06), 160);
  setTimeout(() => playSynthSound(1046, 0.25, 'sine', 0.08), 240);
};
var playBossRoarSFX = () => playSynthSound(90, 0.4, 'sawtooth', 0.1, 180);
var playVictorySFX = () => {
  [523, 659, 784, 1046, 1318].forEach((f, i) => {
    setTimeout(() => playSynthSound(f, 0.25, 'triangle', 0.07), i * 120);
  });
};
var playDefeatSFX = () => {
  [300, 250, 200, 150].forEach((f, i) => {
    setTimeout(() => playSynthSound(f, 0.3, 'sawtooth', 0.08), i * 150);
  });
};

// ============================================================================
// [TÌM KIẾM: POPUP_EFFECTS] THÔNG BÁO TOAST & CHỮ SỐ SÁT THƯƠNG NỔI
// ============================================================================
var toastTimer = 0;
function say(text, time = 2000) {
  if (!toast) return;
  toast.textContent = text;
  toast.hidden = false;
  toastTimer = time;
}

function spawnFloatingPopup(x, y, text, color = '#ffffff', scale = 1) {
  if (!popupContainer) return;
  var el = document.createElement('div');
  el.className = 'floating-popup';
  el.textContent = text;
  el.style.color = color;
  el.style.fontSize = `${13 * scale}px`;

  var screenX = x - cameraX;
  var rect = canvas.getBoundingClientRect();
  var ratioX = rect.width / W;
  var ratioY = rect.height / H;

  el.style.left = `${screenX * ratioX}px`;
  el.style.top = `${y * ratioY}px`;
  popupContainer.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 850);
}

function spawnParticleBurst(x, y, color, count = 12, force = 180) {
  for (var i = 0; i < count; i++) {
    var angle = rand(0, Math.PI * 2);
    var speed = rand(force * 0.2, force);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: rand(0.2, 0.6), maxLife: 0.6,
      color, size: rand(2, 6), gravity: 380
    });
  }
}

// ============================================================================
// [TÌM KIẾM: FACTORY_ENTITY] KHỞI TẠO THỰC THỂ & BỘ TẠO MÀN CHƠI
// ============================================================================
function newPlayer() {
  // Lượng HP tối đa ban đầu kết hợp chỉ số cộng thêm từ Áo Giáp
  var baseMaxHp = 100 + (ARMOR_TIERS[armorTier] ? ARMOR_TIERS[armorTier].hpBonus : 0);
  return {
    x: 80, y: 380,
    w: 42, h: 66,
    vx: 0, vy: 0,
    face: 1,
    hp: baseMaxHp, maxHp: baseMaxHp,
    mana: 100, maxMana: 100,
    onGround: false,
    attackTime: 0, attackCd: 0,
    combo: 0, comboTimer: 0,
    skillCd: 0, dashTimer: 0,
    dashCd: 0,    // Hồi chiêu Lướt chuẩn 0.5s
    invuln: 0, animTime: 0,
    airAttack: false, dead: false,
    stunTimer: 0, // Bộ đếm tê liệt (giây)
    jumpCount: 0  // Bộ đếm số lần nhảy (hỗ trợ Nhảy Đôi Double Jump)
  };
}

// Hàm khởi tạo màn chơi: Phân biệt giữa qua màn mới (isRespawn = false) và hồi sinh (isRespawn = true)
function buildStage(index, keepPlayerStats = true, isRespawn = false) {
  stageIndex = index;
  var stage = STAGES[index];
  var levelLength = stage.length;
  cameraX = 0;

  // 1. Khi qua màn mới (không phải hồi sinh): Đặt lại điểm lưu về đầu bản đồ
  if (!isRespawn) {
    checkpointX = 80;
  }

  checkpoint = { x: levelLength * 0.48, y: 520, w: 30, h: 80, active: false };
  var totalMaxHp = 100 + (ARMOR_TIERS[armorTier] ? ARMOR_TIERS[armorTier].hpBonus : 0);

  if (keepPlayerStats && player) {
    // 2. Chỉ xuất hiện ở checkpoint khi hồi sinh; còn qua màn mới luôn xuất hiện ở x = 80
    if (isRespawn && checkpointX > 80) {
      player.x = checkpointX;
    } else {
      player.x = 80;
    }
    player.y = 380;
    player.vx = 0;
    player.vy = 0;
    player.dead = false;
    player.invuln = 2.0;
    player.attackTime = 0;
    player.attackCd = 0;
    player.dashTimer = 0;
    player.dashCd = 0;
    player.stunTimer = 0;
    player.jumpCount = 0;
    player.maxHp = totalMaxHp;
    player.hp = player.maxHp;
    player.mana = player.maxMana;
  } else {
    player = newPlayer();
  }

  cameraX = 0;

  enemies = []; particles = []; pickups = []; hazards = []; chests = []; projectiles = []; platforms = [];
  platforms.push({ x: 0, y: 600, w: levelLength, h: 200, isGround: true });

  var curX = 320;
  while (curX < levelLength - 500) {
    var gap = rand(110, 180);
    curX += gap;
    var platY = rand(420, 520);
    var platW = rand(130, 220);
    platforms.push({ x: curX, y: platY, w: platW, h: 20, isGround: false });

    if (Math.random() < 0.7) pickups.push({ x: curX + platW / 2, y: platY - 28, type: 'gold', val: 5, taken: false });

    if (Math.random() < 0.75) {
      var enemyType = stage.enemyTypes[Math.floor(Math.random() * stage.enemyTypes.length)];
      enemies.push(makeEnemy(enemyType, curX + platW / 2, platY));
    }

    if (Math.random() < 0.25) chests.push({ x: curX + platW - 35, y: platY - 32, w: 32, h: 32, opened: false });
    if (Math.random() < 0.35 && curX < levelLength - 800) hazards.push({ x: curX - gap / 2, y: 585, w: 60, h: 15 });

    curX += platW;
  }

  for (var i = 0; i < Math.floor(levelLength / 400); i++) {
    var ex = rand(350, levelLength - 600);
    var enemyType = stage.enemyTypes[Math.floor(Math.random() * stage.enemyTypes.length)];
    enemies.push(makeEnemy(enemyType, ex, 600));
  }

  for (var i = 0; i < Math.floor(levelLength / 480); i++) {
    pickups.push({
      x: rand(200, levelLength - 400),
      y: rand(400, 530),
      type: Math.random() < 0.7 ? 'gold' : Math.random() < 0.85 ? 'heart' : 'mana',
      val: 5,
      taken: false
    });
  }

  checkpoint = { x: levelLength * 0.48, y: 520, w: 30, h: 80, active: false };
  exitGate = { x: levelLength - 160, y: 460, w: 70, h: 140, open: false };

  var bW = 96, bH = 92;
  if (index === 1) { bW = 100; bH = 110; }
  else if (index === 2) { bW = 85; bH = 135; }
  else if (index === 3) { bW = 140; bH = 130; }
  else if (index === 4) { bW = 130; bH = 150; }
  else if (index === 5) { bW = 150; bH = 120; }
  else if (index === 6) { bW = 140; bH = 160; }
  else if (index === 7) { bW = 90; bH = 140; }
  else if (index === 8) { bW = 130; bH = 140; }
  else if (index === 9) { bW = 150; bH = 170; }

  var isBossFlying = [2, 3, 5, 7, 8, 9].includes(index);

  // Tính tỷ lệ tăng máu cho Boss tương ứng theo màn chơi
  var bossHpMultiplier = index > 0 ? (1 + (index + 1) / 100) : 1.0;
  var scaledBossHp = Math.round(stage.bossHp * bossHpMultiplier);

  boss = {
    x: levelLength - 420,
    y: isBossFlying ? 360 : (600 - bH),
    baseY: isBossFlying ? 360 : (600 - bH),
    w: bW, h: bH,
    hp: scaledBossHp, maxHp: scaledBossHp,
    active: false, dead: false,
    attackCd: 1.5,
    skill1Cd: 3.5,
    skill2Cd: 6.0,
    skill3Cd: 9.5,
    phase: 1, flash: 0, animTime: 0,
    face: -1, vy: 0, vx: 0,
    fly: isBossFlying,
    castTimer: 0, meleeTimer: 0,
    crystalRainTimer: 0, shieldTimer: 0, teleportPhase: 0,
    hasRevived: false,      // Cờ hồi sinh Phượng Hoàng (Màn 6)
    isRebirthing: false,    // Trạng thái kén sấm tái sinh
    frostAuraActive: false  // Cờ kích hoạt Aura Băng Thần Ymir (Màn 5)
  };

  updateHUD();
  if ($('stageName')) $('stageName').textContent = stage.name;
  if ($('stageSub')) $('stageSub').textContent = stage.sub;
}

function makeEnemy(type, x, groundY) {
  var specs = {
    slime: { w: 38, h: 32, hp: 35, spd: 55, dmg: 8, color: '#4ade80', name: 'Slime', fly: false },
    goblin: { w: 38, h: 54, hp: 55, spd: 70, dmg: 12, color: '#84cc16', name: 'Goblin', fly: false },
    skeleton: { w: 36, h: 58, hp: 75, spd: 50, dmg: 15, color: '#cbd5e1', name: 'Bộ Xương', fly: false },
    bat: { w: 34, h: 30, hp: 30, spd: 90, dmg: 9, color: '#c084fc', name: 'Dơi Bóng Tối', fly: true },
    sorcerer: { w: 40, h: 60, hp: 80, spd: 40, dmg: 18, color: '#a855f7', name: 'Pháp Sư', ranged: true, fly: false },
    dark_knight: { w: 44, h: 64, hp: 180, spd: 60, dmg: 28, color: '#475569', name: 'Kỵ Sĩ Bóng Đêm', fly: false },
    shadow_gargoyle: { w: 48, h: 52, hp: 140, spd: 45, dmg: 26, color: '#3b0764', name: 'Thạch Quỷ', fly: false },
    void_drake: { w: 46, h: 36, hp: 125, spd: 95, dmg: 22, color: '#3b0764', name: 'Tiểu Long', fly: true },
    frost_stalker: { w: 40, h: 52, hp: 90, spd: 110, dmg: 18, color: '#e0f2fe', name: 'Thỏ Tuyết', fly: false },
    glacial_bat: { w: 38, h: 32, hp: 95, spd: 85, dmg: 16, color: '#38bdf8', name: 'Dơi Băng', fly: true, ranged: true },
    storm_raven: { w: 44, h: 36, hp: 130, spd: 105, dmg: 24, color: '#1e293b', name: 'Lôi Điểu', fly: true },
    thunder_ape: { w: 54, h: 58, hp: 160, spd: 50, dmg: 28, color: '#334155', name: 'Khỉ Đá', fly: false },
    magma_brute: { w: 56, h: 62, hp: 190, spd: 50, dmg: 32, color: '#7f1d1d', name: 'Quỷ Lửa', fly: false },
    lava_crawler: { w: 52, h: 30, hp: 150, spd: 85, dmg: 26, color: '#ea580c', name: 'Kỳ Nhông', fly: false, ranged: true },
    sanctuary_golem: { w: 50, h: 66, hp: 220, spd: 55, dmg: 30, color: '#ffffff', name: 'Hộ Vệ Thần Tượng', fly: false },
    fallen_cherub: { w: 42, h: 54, hp: 160, spd: 75, dmg: 34, color: '#3b0764', name: 'Thiên Thần Sa Ngã', fly: true, ranged: true },
    void_devourer: { w: 52, h: 52, hp: 240, spd: 40, dmg: 38, color: '#090514', name: 'Kẻ Nuốt Không Gian', fly: true },
    rift_phantom: { w: 44, h: 58, hp: 180, spd: 90, dmg: 35, color: '#10b981', name: 'Ảo Ảnh Bóng Ma', fly: false }
  }[type] || { w: 36, h: 50, hp: 40, spd: 60, dmg: 10, color: '#e2e8f0', name: 'Quái Vật', fly: false };

  // ==========================================================================
  // CƠ CHẾ TĂNG MÁU LŨY TIẾN THEO MÀN CHƠI:
  // Màn 1: Giữ nguyên máu gốc (+0%)
  // Thắng Màn 1 sang Màn 2: Quái Màn 2 tăng 2% máu
  // Thắng Màn 2 sang Màn 3: Quái Màn 3 tăng 3% máu
  // ... Màn 10: Quái Màn 10 tăng 10% máu
  // ==========================================================================
  var hpMultiplier = stageIndex > 0 ? (1 + (stageIndex + 1) / 100) : 1.0;
  var scaledHp = Math.round(specs.hp * hpMultiplier);

  var spawnY = specs.fly ? groundY - rand(160, 220) : groundY - specs.h;

  return {
    type,
    x: x - specs.w / 2, y: spawnY, baseY: spawnY,
    w: specs.w, h: specs.h,
    hp: scaledHp, maxHp: scaledHp, // Gán chỉ số máu đã tăng theo %
    spd: specs.spd, dmg: specs.dmg,
    color: specs.color, name: specs.name,
    face: -1, alive: true,
    attackCd: rand(0.5, 1.5), flash: 0, animTime: rand(0, 10),
    knockbackX: 0, isShielding: false,
    fly: specs.fly || false, ranged: specs.ranged || false,
    vy: 0, vx: 0, onGround: true,
    retreatTimer: 0, retreatDir: -1,
    isPouncing: false, chargeTimer: 0, pounceCd: rand(1.5, 2.5),
    chargeSlamTimer: 0, slamCd: rand(1.5, 3.0), isLeaping: false,
    windUpTimer: 0, skillCd: 1.0, // Bộ đếm tụ khí 1s và hồi chiêu cho Thỏ Tuyết
    slashTimer: 0, diveTimer: 0, slamTimer: 0, pullTimer: 0, castTimer: 0,
    dashCd: 0, spitCd: 0, teleportCd: 0, arrowCd: 0,
    transformed: false
  };
}

// ============================================================================
// [TÌM KIẾM: PLAYER_COMBAT] HÀNH ĐỘNG CHIẾN ĐẤU CỦA KAITO
// ============================================================================
function attack() {
  if (!running || paused || player.dead || player.stunTimer > 0 || player.attackCd > 0) return;

  player.combo = (player.combo % 3) + 1;
  player.comboTimer = 0.75;
  player.attackTime = 0.24;
  player.attackCd = 0.28;
  player.airAttack = !player.onGround;
  currentAttackSwingId++;

  var currentSwingId = currentAttackSwingId;
  var tier = SWORD_TIERS[swordTier];
  var baseDmg = 12 + tier.dmgBonus;
  var comboMultiplier = player.combo === 3 ? 1.6 : player.combo === 2 ? 1.25 : 1.0;
  var totalDmg = Math.round(baseDmg * comboMultiplier);

  var reach = player.airAttack ? 95 : 82;
  var attackX = player.face > 0 ? player.x + player.w : player.x - reach;
  var attackY = player.y - 5;
  var attackW = reach;
  var attackH = player.h + 10;

  playSlashSFX(player.combo);
  shake = player.combo === 3 ? 6 : 2;
  spawnParticleBurst(player.x + player.w / 2 + player.face * 40, player.y + player.h / 2, tier.color, player.combo === 3 ? 16 : 8, 160);

  // Quét va chạm chém trúng quái vật
  for (var enemy of enemies) {
    if (!enemy.alive) continue;
    if (rectIntersect(attackX, attackY, attackW, attackH, enemy.x, enemy.y, enemy.w, enemy.h)) {
      if (enemy.lastHitSwingId !== currentSwingId) {
        enemy.lastHitSwingId = currentSwingId;
        damageEnemy(enemy, totalDmg, player.face);
      }
    }
  }

  // Quét va chạm chém trúng Boss
  if (boss && !boss.dead && boss.active) {
    if (rectIntersect(attackX, attackY, attackW, attackH, boss.x, boss.y, boss.w, boss.h)) {
      if (boss.lastHitSwingId !== currentSwingId) {
        boss.lastHitSwingId = currentSwingId;
        damageBoss(totalDmg, player.face);
      }
    }
  }

  // Quét va chạm chém mở rương
  for (var chest of chests) {
    if (!chest.opened && rectIntersect(attackX, attackY, attackW, attackH, chest.x, chest.y, chest.w, chest.h)) {
      openChest(chest);
    }
  }
}

function skill() {
  if (!running || paused || player.dead || player.stunTimer > 0 || player.skillCd > 0 || player.mana < 35) {
    if (player && player.mana < 35) say('THIẾU NĂNG LƯỢNG (CẦN 35 MP)!');
    return;
  }

  player.mana -= 35;
  player.skillCd = 2.2;
  player.attackTime = 0.35;
  player.attackCd = 0.35;

  playSkillSFX();
  shake = 7;

  var tier = SWORD_TIERS[swordTier];
  var skillDmg = Math.round(35 + tier.dmgBonus * 1.5);

  projectiles.push({
    x: player.x + player.w / 2 + player.face * 30,
    y: player.y + player.h / 2 - 25,
    w: 60, h: 50,
    vx: player.face * 650, vy: 0,
    isPlayer: true,
    dmg: skillDmg, color: tier.glow,
    life: 0.8, facing: player.face,
    hitTargets: new Set()
  });

  spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, tier.glow, 25, 260);
  say('NGUYỆT QUANG TRẢM!');
}

function dash() {
  if (!running || paused || player.dead || player.stunTimer > 0 || player.skillCd > 2.0) return;
  // Khóa lướt nếu đang lướt hoặc đang trong thời gian hồi chiêu 0.5s
  if (player.dashTimer > 0 || player.dashCd > 0) return;

  var currentBoots = BOOTS_TIERS[bootsTier];

  // Nâng cấp Giày cấp 9 hoặc 10: Tốc biến vô địch (Blink)
  if (currentBoots && currentBoots.canBlink) {
    player.dashTimer = 0.18;
    player.dashCd = 0.5; // Hồi chiêu 0.5s
    player.invuln = 0.45;
    spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#10b981', 18, 220);
    player.x += player.face * 180;
    playDashSFX();
    spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#38bdf8', 18, 220);
    say('TỐC BIẾN THỜI KHÔNG!');
    return;
  }

  // Lướt cơ bản
  player.dashTimer = 0.22;
  player.dashCd = 0.5; // Hồi chiêu 0.5s
  player.invuln = Math.max(player.invuln, 0.32);
  playDashSFX();
  spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#7dd3fc', 12, 160);
}

// ============================================================================
// [TÌM KIẾM: CONG_THUC_DAMAGE] CÔNG THỨC SÁT THƯƠNG & HIỆU ỨNG CHIẾN ĐẤU
// ============================================================================
function damageEnemy(e, dmg, dir) {
  // 1. Phản xạ né đòn 25% của Dơi bóng tối
  if (e.type === 'bat' && Math.random() < 0.25) {
    playDashSFX();
    spawnFloatingPopup(e.x + e.w / 2, e.y - 12, 'NÉ ĐÒN!', '#38bdf8', 1.2);
    spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#c084fc', 8, 140);
    e.retreatTimer = 1.0;
    e.retreatDir = dir;
    e.y -= 35;
    return;
  }

  // 2. Phản xạ né đòn 20% của Lôi điểu
  if (e.type === 'storm_raven' && Math.random() < 0.20) {
    playDashSFX();
    spawnFloatingPopup(e.x + e.w / 2, e.y - 14, 'NÉ ĐÒN!', '#fde047', 1.3);
    spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#fde047', 10, 180);
    e.retreatTimer = 1.2;
    e.retreatDir = dir;
    e.y -= 45;
    return;
  }

  // 3. Phản xạ bẻ cong không gian né đòn 20% của Kẻ Nuốt Không Gian
  if (e.type === 'void_devourer' && Math.random() < 0.20) {
    playDashSFX();
    spawnFloatingPopup(e.x + e.w / 2, e.y - 16, 'NÉ ĐÒN!', '#c084fc', 1.3);
    spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#3b0764', 12, 160);
    e.x += (e.face > 0 ? -60 : 60);
    return;
  }

  // 4. Phản xạ thời gian né đòn 35% của Ảo Ảnh Bóng Ma
  if (e.type === 'rift_phantom' && Math.random() < 0.35) {
    playDashSFX();
    spawnFloatingPopup(e.x + e.w / 2, e.y - 16, 'NÉ ĐÒN!', '#10b981', 1.3);
    spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#34d399', 12, 160);
    e.x += (e.face > 0 ? -65 : 65);
    return;
  }

  // 5. Khiên thép Bộ Xương chặn 70% sát thương trực diện
  if (e.type === 'skeleton' && dir !== e.face) {
    dmg = Math.round(dmg * 0.3);
    say('BỊ KHIÊN CHẶN ĐÒN!');
  }

  if (e.type === 'dark_knight') dmg = Math.round(dmg * 0.65);
  if (e.type === 'sanctuary_golem') dmg = Math.round(dmg * 0.5);

  e.hp -= dmg;
  e.flash = 0.16;
  e.knockbackX = dir * 220;

  playHitSFX();
  spawnFloatingPopup(e.x + e.w / 2, e.y, `-${dmg}`, e.hp <= 0 ? '#ef4444' : '#fde047', e.hp <= 0 ? 1.4 : 1.0);
  spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#fde047', 9, 150);

  // 6. Kỹ năng Hóa khổng lồ cuồng nộ của Bộ Xương khi máu <= 40%
  if (e.type === 'skeleton' && !e.transformed && e.hp > 0 && e.hp <= e.maxHp * 0.4) {
    e.transformed = true;
    e.hp = e.maxHp;                   // Hồi 100% HP
    var oldH = e.h;
    e.w = Math.round(e.w * 1.45);     // Phóng to 145%
    e.h = Math.round(e.h * 1.45);
    e.y -= (e.h - oldH);
    e.dmg = Math.round(e.dmg * 1.8);  // Tăng 80% công
    e.spd = Math.round(e.spd * 1.25);
    e.flash = 0.35;

    shake = 9;
    playBossRoarSFX();
    spawnFloatingPopup(e.x + e.w / 2, e.y - 25, 'HỒI SINH BIẾN HÌNH +100% HP!', '#ef4444', 1.4);
    spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#ef4444', 28, 240);
    say('CHIẾN BINH BỘ XƯƠNG HÓA KHỔNG LỒ CUỒNG NỘ!', 2500);
  }

  if (e.hp <= 0) {
    e.alive = false;
    kills++;

    var bountyTable = {
      slime: 8, goblin: 12, skeleton: 16, bat: 10, sorcerer: 22,
      dark_knight: 28, shadow_gargoyle: 32, void_drake: 30,
      frost_stalker: 36, glacial_bat: 28, storm_raven: 42, thunder_ape: 48,
      magma_brute: 56, lava_crawler: 50, sanctuary_golem: 65, fallen_cherub: 58,
      void_devourer: 75, rift_phantom: 70
    };
    var goldReward = bountyTable[e.type] || (10 + stageIndex * 6);
    gold += goldReward;
    spawnFloatingPopup(e.x + e.w / 2, e.y - 15, `+${goldReward}G`, '#fde047', 1.2);

    if (Math.random() < 0.45) {
      pickups.push({
        x: e.x + e.w / 2, y: e.y + e.h / 2,
        type: Math.random() < 0.6 ? 'heart' : 'mana',
        taken: false
      });
    }
  }
}

function damageBoss(dmg, dir) {
  // --- 1. PHẢN XẠ NÉ ĐÒN 25% CỦA RỒNG BÓNG TỐI (MÀN 4) ---
  if (stageIndex === 3 && Math.random() < 0.25) {
    playDashSFX();
    spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 15, 'NÉ ĐÒN!', '#c084fc', 1.4);
    for (let k = 0; k < 8; k++) {
      particles.push({
        x: boss.x + boss.w / 2 + rand(-30, 30),
        y: boss.y + boss.h / 2 + rand(-20, 20),
        vx: rand(-40, 40),
        vy: -rand(50, 100),
        life: 0.6,
        maxLife: 0.6,
        color: '#3b0764',
        size: rand(6, 12),
        gravity: -30
      });
    }
    boss.x += (boss.face > 0 ? -60 : 60);
    return;
  }

  // --- 2. AURA BĂNG HỘ THỂ CỦA BĂNG THẦN YMIR (MÀN 5: HP <= 35% MIỄN 70% DMG) ---
  if (stageIndex === 4 && boss.hp <= boss.maxHp * 0.35) {
    dmg = Math.max(1, Math.round(dmg * 0.3));
    spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 18, 'AURA BĂNG HỘ THỂ (-70%)!', '#38bdf8', 1.3);
    spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#bae6fd', 12, 160);
  }

  // --- 3. GIÁP GANG HẮC THIẾT CỦA TITAN SURTR (MÀN 7: MIỄN 12% DMG) ---
  if (stageIndex === 6) {
    dmg = Math.max(1, Math.round(dmg * 0.88));
  }

  // --- 4. 30% KHẢ NĂNG NÉ ĐÒN CỦA SERAPH (MÀN 8) ---
  if (stageIndex === 7 && Math.random() < 0.30) {
    playDashSFX();
    spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 18, 'NÉ ĐÒN!', '#fde047', 1.4);
    spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffffff', 14, 200);
    boss.x += (boss.face > 0 ? -70 : 70);
    return;
  }

  // --- 5. VÒNG SÁNG ĐEN HƯ KHÔNG CỦA CHRONOS (MÀN 9: MIỄN 90% DMG TRONG 2S) ---
  if (stageIndex === 8 && boss && boss.chronosShieldTimer > 0) {
    dmg = Math.max(1, Math.round(dmg * 0.10)); // Chỉ nhận 10% sát thương
    spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 18, 'HƯ KHÔNG BẢO HỘ (-90%)!', '#c084fc', 1.3);
    spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#3b0764', 12, 160);
  }

  // --- 6. KHIÊN THẦN GIỚI MIỄN THƯƠNG HOÀN TOÀN CỦA SÁNG THẾ THẦN (MÀN 10) ---
  if (stageIndex === 9 && boss && boss.immuneTimer > 0) {
    playDashSFX();
    spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 20, 'MIỄN THƯƠNG HOÀN TOÀN!', '#ffffff', 1.5);
    spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fde047', 16, 200);
    spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffffff', 14, 180);
    return; // Khóa sạch 100% sát thương nhận vào
  }

  boss.hp -= dmg;
  boss.flash = 0.18;
  boss.x += dir * 10;

  playHitSFX();
  spawnFloatingPopup(boss.x + boss.w / 2, boss.y, `-${dmg}`, '#ef4444', 1.5);
  spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f87171', 14, 180);

  // --- 7. CƠ CHẾ HÓA KÉN SẤM SÉT HỒI SINH 100% HP CỦA LÔI PHƯỢNG HOÀNG (MÀN 6) ---
  if (stageIndex === 5 && boss.hp <= 0 && !boss.hasRevived) {
    boss.hasRevived = true;
    boss.hp = 1;
    boss.isRebirthing = true;
    boss.castTimer = 1.6;

    shake = 18;
    playBossRoarSFX();
    say('⚡ LÔI PHƯỢNG HOÀNG: HÓA KÉN SẤM SÉT CHUẨN BỊ TÁI SINH!', 2000);
    spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fde047', 40, 280);

    setTimeout(() => {
      if (boss && !boss.dead) {
        boss.isRebirthing = false;
        boss.hp = boss.maxHp; // Hồi phục 100% máu
        boss.phase = 2;       // Bật phase cuồng nộ

        shake = 22;
        playVictorySFX();
        playBossRoarSFX();

        damagePlayer(25, boss.x + boss.w / 2, -boss.face * 420, -280);
        spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 30, '⚡ PHƯỢNG HOÀNG TÁI SINH +100% HP!', '#fde047', 1.6);
        spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#38bdf8', 50, 320);
        say('⚡ PHƯỢNG HOÀNG TÁI SINH TỪ LÔI ĐIỆN VĨNH CỬU!', 3000);
      }
    }, 1500);

    return;
  }

  // Khi Boss cạn máu thực sự
  if (boss.hp <= 0) {
    boss.hp = 0;
    boss.dead = true;
    var bossReward = 120 + stageIndex * 60;
    gold += bossReward;
    exitGate.open = true;
    playVictorySFX();
    shake = 16;
    spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 20, `+${bossReward}G`, '#fde047', 1.8);
    say('BOSS BỊ TIÊU DIỆT! CỔNG DỊCH CHUYỂN ĐÃ MỞ', 3000);
  }
}

function damagePlayer(dmg, fromX, customKnockX = null, customKnockY = null, stunTime = 0, source = null) {
  if (player.invuln > 0 || player.dead || gameOver) return;

  // Giảm sát thương % theo Áo Giáp hiện tại
  var currentArmor = ARMOR_TIERS[armorTier];
  if (currentArmor && currentArmor.dmgReduction > 0) {
    dmg = Math.max(1, Math.round(dmg * (1 - currentArmor.dmgReduction)));
  }

  // Giáp Lôi Thần (Cấp 6 trở lên) kháng hoàn toàn hiệu ứng Tê Liệt
  if (armorTier >= 5 && stunTime > 0) {
    stunTime = 0;
    spawnFloatingPopup(player.x + player.w / 2, player.y - 25, 'KHÁNG TÊ LIỆT!', '#fde047', 1.2);
  }

  player.hp -= dmg;
  player.invuln = 1.1;

  // 1. HÚT MÁU 30% CỦA CHÚA TỂ BÓNG ĐÊM (BOSS MÀN 3)
  if ((source === 'boss3' || (stageIndex === 2 && source === 'boss')) && boss && !boss.dead && boss.active) {
    const healAmount = Math.round(dmg * 0.3);
    if (healAmount > 0) {
      boss.hp = Math.min(boss.maxHp, boss.hp + healAmount);
      spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 15, `+${healAmount} HP (HÚT MÁU)`, '#c084fc', 1.3);
      spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#e879f9', 14, 180);
      playSynthSound(580, 0.15, 'sine', 0.05, 880);
    }
  }

  // 2. HỐ ĐEN HÚT MÁU 200% CỦA CHRONOS (BOSS MÀN 9)
  if (source === 'chronos_blackhole' && boss && !boss.dead && boss.active) {
    const healAmount = Math.round(dmg * 2.0); // Hồi máu bằng 200% lượng sát thương gây ra
    if (healAmount > 0) {
      boss.hp = Math.min(boss.maxHp, boss.hp + healAmount);
      spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 25, `+${healAmount} HP (HỐ ĐEN HÚT MÁU 200%)`, '#c084fc', 1.5);
      spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#3b0764', 25, 240);
      spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#a855f7', 15, 180);
      playSynthSound(440, 0.28, 'sawtooth', 0.08, 880);
    }
  }

  // Xử lý hiệu ứng Tê Liệt 1.0 giây
  if (stunTime > 0) {
    player.stunTimer = Math.max(player.stunTimer || 0, stunTime);
    player.vx = 0;
    spawnFloatingPopup(player.x + player.w / 2, player.y - 20, '⚡ TÊ LIỆT (1s)!', '#fde047', 1.4);
    spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#fde047', 18, 200);
  } else if (customKnockX !== null && customKnockY !== null) {
    player.vx = customKnockX;
    player.vy = customKnockY;
    player.onGround = false;
  } else {
    player.vx = (player.x - fromX > 0 ? 1 : -1) * 260;
    player.vy = -220;
  }

  shake = 9;
  playHurtSFX();
  spawnFloatingPopup(player.x + player.w / 2, player.y, `-${dmg} HP`, '#ef4444', 1.3);
  spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#ef4444', 12, 170);

  if (player.hp <= 0) {
    player.hp = 0;
    player.dead = true;
    gameOver = true;
    running = false;
    playDefeatSFX();
    showEndScreen(false);
  }
}

function openChest(chest) {
  chest.opened = true;
  var chestGold = 50 + stageIndex * 25;
  gold += chestGold;
  player.hp = Math.min(player.maxHp, player.hp + 40);
  player.mana = player.maxMana;

  playChestSFX();
  spawnFloatingPopup(chest.x + chest.w / 2, chest.y - 15, `+${chestGold}G & FULL HP!`, '#fde047', 1.5);
  spawnParticleBurst(chest.x + chest.w / 2, chest.y + chest.h / 2, '#fde047', 30, 240);
}

// ============================================================================
// [TÌM KIẾM: MATH_AABB] TOÁN HỌC & VA CHẠM HÌNH HỘP AABB
// ============================================================================
function rand(a, b) { return a + Math.random() * (b - a); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

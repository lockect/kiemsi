/**
 * ============================================================================
 * CONFIG.JS - CẤU HÌNH VÀ HẰNG SỐ TOÀN CỤC (GLOBAL CONFIG & STATE)
 * ============================================================================
 */

'use strict';

// 1. DOM Canvas & Context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Hàm tiện ích lấy phần tử DOM theo ID
const $ = id => document.getElementById(id);

// 2. DOM HUD & Overlay Modals
const overlay = $('overlay');
const hud = $('hud');
const bossHud = $('bossHud');
const toast = $('toast');
const popupContainer = $('popupContainer');

const panelIntro = $('panelIntro');
const panelGuide = $('panelGuide');
const panelSettings = $('panelSettings');
const panelUpgrade = $('panelUpgrade');
const panelPause = $('panelPause');
const panelEnd = $('panelEnd');

// 3. Phím bấm và Trạng thái Trò chơi
const keys = Object.create(null);

let running = false;
let paused = false;
let lastTime = 0;
let worldTime = 0;
let cameraX = 0;
let shake = 0;
let screenMode = 'intro';

// 4. Tiến trình chơi và Âm thanh
let stageIndex = 0;
let gold = 0;
let kills = 0;
let swordTier = 0;
let checkpointX = 80;
let gameOver = false;
let victory = false;

let soundOn = true;
let masterVolume = 0.7;
let audioCtx = null;

const SAVE_KEY = 'kiem_si_huyen_thoai_save_v1';

// 5. Cấu hình 10 Cấp Kiếm
const SWORD_TIERS = [
  { name: 'Cấp 1: Kiếm Bạc', dmgBonus: 0, color: '#e2e8f0', glow: '#38bdf8', aura: 'Ánh Bạc', cost: 35 },
  { name: 'Cấp 2: Kiếm Lam Quang', dmgBonus: 8, color: '#38bdf8', glow: '#0284c7', aura: 'Lam Quang', cost: 75 },
  { name: 'Cấp 3: Kiếm Nguyệt Ảnh', dmgBonus: 18, color: '#c084fc', glow: '#7e22ce', aura: 'Nguyệt Ảnh', cost: 130 },
  { name: 'Cấp 4: Kiếm Thiên Không', dmgBonus: 30, color: '#60a5fa', glow: '#2563eb', aura: 'Thiên Không', cost: 200 },
  { name: 'Cấp 5: Kiếm Huyền Thoại', dmgBonus: 48, color: '#fbbf24', glow: '#d97706', aura: 'Thánh Quang', cost: 280 },
  { name: 'Cấp 6: Băng Hồn Kiếm', dmgBonus: 65, color: '#38bdf8', glow: '#e0f2fe', aura: 'Băng Tuyết', cost: 320 },
  { name: 'Cấp 7: Lôi Thần Trảm', dmgBonus: 85, color: '#fde047', glow: '#fbbf24', aura: 'Lôi Điện', cost: 450 },
  { name: 'Cấp 8: Hỏa Ngục Đại Kiếm', dmgBonus: 110, color: '#f97316', glow: '#ef4444', aura: 'Hỏa Ngục', cost: 620 },
  { name: 'Cấp 9: Thánh Quang Kiếm', dmgBonus: 140, color: '#ffffff', glow: '#fef08a', aura: 'Thánh Linh', cost: 850 },
  { name: 'Cấp 10: Vũ Trụ Khởi Nguyên', dmgBonus: 180, color: '#c084fc', glow: '#f43f5e', aura: 'Thái Cổ Vũ Trụ', cost: 0 }
];

// 6. Cấu hình 10 Màn chơi (Stages)
const STAGES = [
  {
    name: 'RỪNG NGUYỆT QUANG',
    sub: 'MÀN 1 · KHU RỪNG NGUYỆT QUANG',
    sky1: '#0f172a', sky2: '#1e293b',
    far: '#1e3a5f', near: '#0d5257', ground: '#14532d',
    length: 4200,
    bossName: 'HẮC LANG', bossHp: 220,
    enemyTypes: ['slime', 'goblin', 'bat']
  },
  {
    name: 'TÀN TÍCH HOÀNG HÔN',
    sub: 'MÀN 2 · PHẾ TÍCH HOÀNG HÔN',
    sky1: '#451a03', sky2: '#7c2d12',
    far: '#78350f', near: '#581c87', ground: '#4c1d95',
    length: 4800,
    bossName: 'KỴ SĨ TRO TÀN', bossHp: 340,
    enemyTypes: ['goblin', 'skeleton', 'sorcerer']
  },
  {
    name: 'LÂU ĐÀI BÓNG ĐÊM',
    sub: 'MÀN 3 · TRẬN CHIẾN BÓNG ĐÊM',
    sky1: '#2e1065', sky2: '#3b0764',
    far: '#4c1d95', near: '#1e1b4b', ground: '#1e1035',
    length: 5400,
    bossName: 'CHÚA TỂ BÓNG ĐÊM', bossHp: 500,
    enemyTypes: ['skeleton', 'sorcerer', 'dark_knight']
  },
  {
    name: 'VỰC SÂU BÓNG ĐÊM',
    sub: 'MÀN 4 · KHE NỨT HƯ KHÔNG',
    sky1: '#180e29', sky2: '#090514',
    far: '#2d124d', near: '#17092b', ground: '#120721',
    length: 6000,
    bossName: 'RỒNG BÓNG TỐI KHỔNG LỒ', bossHp: 800,
    enemyTypes: ['dark_knight', 'shadow_gargoyle', 'void_drake']
  },
  {
    name: 'BĂNG NGUYỆN VĨNH CỬU',
    sub: 'MÀN 5 · BĂNG NGUYÊN VĨNH CỬU',
    sky1: '#0284c7', sky2: '#e0f2fe',
    far: '#0369a1', near: '#38bdf8', ground: '#0284c7',
    length: 6600,
    bossName: 'BĂNG THẦN YMIR', bossHp: 1200,
    enemyTypes: ['frost_stalker', 'glacial_bat']
  },
  {
    name: 'ĐỈNH NÚI LÔI VÂN',
    sub: 'MÀN 6 · ĐỈNH NÚI LÔI VÂN',
    sky1: '#1e293b', sky2: '#0f172a',
    far: '#334155', near: '#475569', ground: '#1e293b',
    length: 7200,
    bossName: 'LÔI PHƯỢNG HOÀNG', bossHp: 1600,
    enemyTypes: ['storm_raven', 'thunder_ape']
  },
  {
    name: 'LÒ LUYỆN DUNG NHAM',
    sub: 'MÀN 7 · LÒ LUYỆN DUNG NHAM',
    sky1: '#451a03', sky2: '#7f1d1d',
    far: '#78350f', near: '#9a3412', ground: '#451a03',
    length: 7800,
    bossName: 'HỎA THẦN TITAN SURTR', bossHp: 2200,
    enemyTypes: ['magma_brute', 'lava_crawler']
  },
  {
    name: 'THÀNH PHỐ THIÊN KHÔNG',
    sub: 'MÀN 8 · THÀNH PHỐ THIÊN KHÔNG',
    sky1: '#0369a1', sky2: '#fef08a',
    far: '#38bdf8', near: '#fde047', ground: '#cbd5e1',
    length: 8400,
    bossName: 'THÁNH HIỆP SĨ SERAPH', bossHp: 3000,
    enemyTypes: ['sanctuary_golem', 'fallen_cherub']
  },
  {
    name: 'KHE NỨT HỖN MANG',
    sub: 'MÀN 9 · KHE NỨT HỖN MANG',
    sky1: '#2e1065', sky2: '#090d16',
    far: '#4c1d95', near: '#1e1b4b', ground: '#1e1035',
    length: 9000,
    bossName: 'QUÁI VẬT HỖN MANG CHRONOS', bossHp: 4000,
    enemyTypes: ['void_devourer', 'rift_phantom']
  },
  {
    name: 'ĐIỆN THỜ KHỞI NGUYÊN',
    sub: 'MÀN 10 · TRẬN CHIẾN SÁNG THẾ',
    sky1: '#000000', sky2: '#312e81',
    far: '#1e1b4b', near: '#4338ca', ground: '#020617',
    length: 10000,
    bossName: 'SÁNG THẾ THẦN THÁI CỔ', bossHp: 6000,
    enemyTypes: ['sanctuary_golem', 'void_devourer', 'dark_knight']
  }
];

// 7. Mảng Thực thể trong Game
let player = null;
let enemies = [];
let particles = [];
let platforms = [];
let pickups = [];
let hazards = [];
let chests = [];
let projectiles = [];
let boss = null;
let exitGate = null;
let checkpoint = null;
let currentAttackSwingId = 0;
let toastTimer = 0;

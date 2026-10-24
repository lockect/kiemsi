/**
 * ============================================================================
 * UTILS.JS - TIỆN ÍCH TOÁN HỌC, LƯU DỮ LIỆU VÀ THÔNG BÁO (UTILITIES & SAVE)
 * ============================================================================
 */

'use strict';

// 1. Math Helpers
function rand(a, b) {
  return a + Math.random() * (b - a);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// 2. Toast & Floating Damage Popups
function say(text, time = 2000) {
  if (!toast) return;
  toast.textContent = text;
  toast.hidden = false;
  toastTimer = time;
}

function spawnFloatingPopup(x, y, text, color = '#ffffff', scale = 1) {
  if (!popupContainer) return;
  const el = document.createElement('div');
  el.className = 'floating-popup';
  el.textContent = text;
  el.style.color = color;
  el.style.fontSize = `${13 * scale}px`;

  const screenX = x - cameraX;
  const rect = canvas.getBoundingClientRect();
  const ratioX = rect.width / W;
  const ratioY = rect.height / H;

  el.style.left = `${screenX * ratioX}px`;
  el.style.top = `${y * ratioY}px`;

  popupContainer.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 850);
}

// 3. Save & Load System (LocalStorage)
function loadSave() {
  try {
    const dataStr = localStorage.getItem(SAVE_KEY);
    if (dataStr) {
      const data = JSON.parse(dataStr);
      if (data && typeof data === 'object') {
        stageIndex = Math.min(data.stageIndex || 0, STAGES.length - 1);
        gold = data.gold || 0;
        kills = data.kills || 0;
        swordTier = Math.min(data.swordTier || 0, SWORD_TIERS.length - 1);
        soundOn = data.soundOn !== undefined ? data.soundOn : true;
        masterVolume = data.volume !== undefined ? data.volume : 0.7;
        updateSaveUI();
        return true;
      }
    }
  } catch (e) {
    console.warn('Không thể đọc file lưu:', e);
  }
  updateSaveUI();
  return false;
}

function writeSave() {
  try {
    const data = {
      stageIndex,
      gold,
      kills,
      swordTier,
      soundOn,
      volume: masterVolume
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Lỗi ghi file lưu:', e);
  }
}

function resetSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    stageIndex = 0;
    gold = 0;
    kills = 0;
    swordTier = 0;
    updateSaveUI();
    say('Đã xóa dữ liệu lưu trò chơi!');
  } catch (e) {}
}

function updateSaveUI() {
  const hasSave = loadSaveStateCheck();
  if ($('continueBtn')) $('continueBtn').hidden = !hasSave;
  if ($('soundBtn')) $('soundBtn').textContent = `♫ Âm thanh: ${soundOn ? 'Bật' : 'Tắt'}`;
  if ($('toggleSoundSetting')) $('toggleSoundSetting').textContent = soundOn ? 'Đang Bật' : 'Đang Tắt';
  if ($('volumeSlider')) $('volumeSlider').value = Math.round(masterVolume * 100);
}

function loadSaveStateCheck() {
  try {
    return !!localStorage.getItem(SAVE_KEY);
  } catch (e) {
    return false;
  }
}

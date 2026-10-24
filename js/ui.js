/**
 * ============================================================================
 * UI.JS - CẬP NHẬT HUD VÀ QUẢN LÝ CỬA SỔ OVERLAY (HUD & MODALS)
 * ============================================================================
 */

'use strict';

function updateHUD() {
  if (!player) return;

  if ($('hpText')) $('hpText').textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
  if ($('hpBar')) $('hpBar').style.width = `${Math.max(0, Math.min(100, 100 * player.hp / player.maxHp))}%`;

  if ($('manaText')) $('manaText').textContent = `${Math.ceil(player.mana)} / ${player.maxMana}`;
  if ($('manaBar')) $('manaBar').style.width = `${Math.max(0, Math.min(100, 100 * player.mana / player.maxMana))}%`;

  if ($('goldText')) $('goldText').textContent = gold;
  if ($('killText')) $('killText').textContent = kills;

  const tier = SWORD_TIERS[swordTier];
  if ($('swordTierName')) $('swordTierName').textContent = tier.name;
  if ($('goldCost')) $('goldCost').textContent = tier.cost > 0 ? tier.cost : 'MAX';

  const upgradeBtn = $('upgradeBtn');
  if (upgradeBtn) {
    if (swordTier >= SWORD_TIERS.length - 1) {
      upgradeBtn.disabled = true;
      upgradeBtn.textContent = 'ĐÃ ĐẠT TỐI ĐA';
    } else {
      upgradeBtn.disabled = gold < tier.cost;
      upgradeBtn.innerHTML = `⬆ NÂNG CẤP (<b>${tier.cost}</b>G)`;
    }
  }

  if (boss && boss.active && !boss.dead && bossHud) {
    bossHud.hidden = false;
    if ($('bossName')) $('bossName').textContent = STAGES[stageIndex].bossName;
    if ($('bossHpText')) $('bossHpText').textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
    if ($('bossBar')) $('bossBar').style.width = `${Math.max(0, Math.min(100, 100 * boss.hp / boss.maxHp))}%`;
  } else if (bossHud) {
    bossHud.hidden = true;
  }
}

function hideAllPanels() {
  if (panelIntro) panelIntro.hidden = true;
  if (panelGuide) panelGuide.hidden = true;
  if (panelSettings) panelSettings.hidden = true;
  if (panelUpgrade) panelUpgrade.hidden = true;
  if (panelPause) panelPause.hidden = true;
  if (panelEnd) panelEnd.hidden = true;
}

function updateMobileControlsVisibility() {
  var mc = $('mobileControls');
  if (!mc) return;

  var isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024);
  var isOverlayVisible = overlay && !overlay.hidden && overlay.style.display !== 'none' && !overlay.classList.contains('hidden');

  if (isMobile && running && !paused && !isOverlayVisible) {
    mc.removeAttribute('hidden');
    mc.classList.remove('hidden');
    mc.style.display = 'flex';
  } else {
    mc.setAttribute('hidden', 'true');
    mc.classList.add('hidden');
    mc.style.display = 'none';
  }
}

function showOverlay(panelEl) {
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.hidden = false;
  overlay.style.display = 'grid';
  hideAllPanels();
  if (panelEl) panelEl.hidden = false;
  updateMobileControlsVisibility();
}

function hideOverlay() {
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.hidden = true;
  overlay.style.display = 'none';
  hideAllPanels();
  updateMobileControlsVisibility();
}

function startNextStage() {
  if (stageIndex < STAGES.length - 1) {
    buildStage(stageIndex + 1, true);
    writeSave();
    say(`MÀN MỚI: ${STAGES[stageIndex].name}!`, 2500);
  } else {
    victory = true;
    running = false;
    showEndScreen(true);
  }
}

function showEndScreen(win) {
  showOverlay(panelEnd);
  if (hud) hud.hidden = true;
  if (bossHud) bossHud.hidden = true;

  writeSave();

  const endContent = $('endContent');
  if (endContent) {
    if (win) {
      endContent.innerHTML = `
        <div class="eyebrow">HUYỀN THOẠI ĐƯỢC VIẾT NÊN</div>
        <h1>CHIẾN THẮNG<br><em>VINH QUANG!</em></h1>
        <p>Chúc mừng bạn đã tiêu diệt Chúa Tể Bóng Đêm và mang lại hòa bình cho vương quốc!</p>
        <div class="intro-stats">
          <span>🪙 ${gold} Vàng</span>
          <span>☠ ${kills} Quái vật</span>
          <span>⚔ ${SWORD_TIERS[swordTier].name}</span>
        </div>
        <div class="menu-buttons">
          <button id="restartGameBtn" class="primary-btn">CHƠI LẠI TỪ ĐẦU <span>➜</span></button>
        </div>
      `;
    } else {
      endContent.innerHTML = `
        <div class="eyebrow">HÀNH TRÌNH CHƯA KẾT THÚC</div>
        <h1>BẠN ĐÃ<br><em>GỤC NGÃ</em></h1>
        <p>Đừng nản lòng! Hãy tích lũy vàng, nâng cấp kiếm và thử lại lần nữa!</p>
        <div class="intro-stats">
          <span>🪙 ${gold} Vàng</span>
          <span>☠ ${kills} Quái vật</span>
        </div>
        <div class="menu-buttons">
          <button id="restartGameBtn" class="primary-btn">THỬ LẠI TỪ ĐIỂM KIỂM TRA <span>➜</span></button>
        </div>
      `;
    }

    const restartBtn = $('restartGameBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        resetGame(win ? false : true);
      });
    }
  }
}

function resetGame(keepStats = false) {
  gameOver = false;
  victory = false;
  paused = false;

  if (!keepStats) {
    stageIndex = 0;
    gold = 0;
    kills = 0;
    swordTier = 0;
  }

  buildStage(stageIndex, keepStats);
  running = true;
  screenMode = 'game';

  hideOverlay();
  if (hud) hud.hidden = false;
  if ($('footerStatus')) $('footerStatus').textContent = 'Đang chiến đấu';
  say('HÃY TIẾN VỀ PHÍA TRƯỚC VÀ TIÊU DIỆT QUÁI VẬT!');
}

function openUpgradeModal() {
  if (swordTier >= SWORD_TIERS.length - 1) {
    say('KIẾM CỦA BẠN ĐÃ ĐẠT CẤP TỐI ĐA!');
    return;
  }

  const cur = SWORD_TIERS[swordTier];
  const next = SWORD_TIERS[swordTier + 1];

  if ($('upgradeSwordIcon')) $('upgradeSwordIcon').textContent = '⚔';
  if ($('upgradeCurrentTier')) $('upgradeCurrentTier').textContent = next.name;
  if ($('upgradeDmgText')) $('upgradeDmgText').textContent = `${12 + cur.dmgBonus} DMG ➔ ${12 + next.dmgBonus} DMG`;
  if ($('upgradeAuraText')) $('upgradeAuraText').textContent = `${cur.aura} ➔ ${next.aura}`;
  if ($('upgradeCostText')) $('upgradeCostText').textContent = `${cur.cost} Vàng`;

  showOverlay(panelUpgrade);
}

// ----------------------------------------------------------------------------
// XUẤT HÀM XỬ LÝ TOÀN CỤC CHO SỰ KIỆN HTML ONCLICK
// ----------------------------------------------------------------------------
function requestFullscreenAndLandscape() {
  try {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    }
  } catch (e) {}

  try {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  } catch (e) {}
}

function handleStartGame(keepStats = false) {
  requestFullscreenAndLandscape();
  try {
    initAudio();
  } catch (err) {}
  resetGame(keepStats);
}

function showGuide() {
  showOverlay(panelGuide);
}

function closeGuide() {
  if (running) hideOverlay();
  else showOverlay(panelIntro);
}

function showSettings() {
  showOverlay(panelSettings);
}

function closeSettings() {
  writeSave();
  if (running) hideOverlay();
  else showOverlay(panelIntro);
}

function toggleSound() {
  soundOn = !soundOn;
  if ($('soundBtn')) $('soundBtn').textContent = `♫ Âm thanh: ${soundOn ? 'Bật' : 'Tắt'}`;
  if ($('toggleSoundSetting')) $('toggleSoundSetting').textContent = soundOn ? 'Đang Bật' : 'Đang Tắt';
  writeSave();
}

function togglePause() {
  if (!running) return;
  paused = !paused;

  if (paused) {
    showOverlay(panelPause);
    if ($('pauseBtn')) $('pauseBtn').textContent = '▶ Tiếp tục';
    if ($('footerStatus')) $('footerStatus').textContent = 'Đang tạm dừng';
  } else {
    hideOverlay();
    if ($('pauseBtn')) $('pauseBtn').textContent = 'Ⅱ Tạm dừng';
    if ($('footerStatus')) $('footerStatus').textContent = 'Đang chiến đấu';
  }
}

window.handleStartGame = handleStartGame;
window.showGuide = showGuide;
window.closeGuide = closeGuide;
window.showSettings = showSettings;
window.closeSettings = closeSettings;
window.toggleSound = toggleSound;
window.togglePause = togglePause;

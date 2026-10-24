/**
 * ============================================================================
 * MAIN.JS - ENGINE CHÍNH, XỬ LÝ LẮNG NGHE PHÍM VÀ VÒNG LẶP GAME (MAIN ENTRY)
 * ============================================================================
 */

'use strict';

// 1. Tấn công Chém Kiếm Combo
function attack() {
  if (!running || paused || player.dead || player.attackCd > 0) return;

  player.combo = (player.combo % 3) + 1;
  player.comboTimer = 0.75;
  player.attackTime = 0.24;
  player.attackCd = 0.28;
  player.airAttack = !player.onGround;
  currentAttackSwingId++;

  const currentSwingId = currentAttackSwingId;
  const tier = SWORD_TIERS[swordTier];
  const baseDmg = 12 + tier.dmgBonus;
  const comboMultiplier = player.combo === 3 ? 1.6 : player.combo === 2 ? 1.25 : 1.0;
  const totalDmg = Math.round(baseDmg * comboMultiplier);

  const reach = player.airAttack ? 95 : 82;
  const attackX = player.face > 0 ? player.x + player.w : player.x - reach;
  const attackY = player.y - 5;
  const attackW = reach;
  const attackH = player.h + 10;

  playSlashSFX(player.combo);

  if (player.combo === 3) {
    shake = 6;
    spawnParticleBurst(player.x + player.w / 2 + player.face * 45, player.y + player.h / 2, tier.color, 16, 220);
  } else {
    spawnParticleBurst(player.x + player.w / 2 + player.face * 35, player.y + player.h / 2, tier.color, 8, 140);
  }

  // Va chạm Quái thường
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    if (rectIntersect(attackX, attackY, attackW, attackH, enemy.x, enemy.y, enemy.w, enemy.h)) {
      if (enemy.lastHitSwingId !== currentSwingId) {
        enemy.lastHitSwingId = currentSwingId;
        damageEnemy(enemy, totalDmg, player.face);
      }
    }
  }

  // Va chạm Boss
  if (boss && !boss.dead && boss.active) {
    if (rectIntersect(attackX, attackY, attackW, attackH, boss.x, boss.y, boss.w, boss.h)) {
      if (boss.lastHitSwingId !== currentSwingId) {
        boss.lastHitSwingId = currentSwingId;
        damageBoss(totalDmg, player.face);
      }
    }
  }

  // Mở rương
  for (const chest of chests) {
    if (!chest.opened && rectIntersect(attackX, attackY, attackW, attackH, chest.x, chest.y, chest.w, chest.h)) {
      openChest(chest);
    }
  }
}

// 2. Tuyệt kỹ Nguyệt Quang Trảm
function skill() {
  if (!running || paused || player.dead || player.skillCd > 0 || player.mana < 35) {
    if (player && player.mana < 35) say('THIẾU NĂNG LƯỢNG (CẦN 35 MP)!');
    return;
  }

  player.mana -= 35;
  player.skillCd = 2.2;
  player.attackTime = 0.35;
  player.attackCd = 0.35;

  playSkillSFX();
  shake = 7;

  const tier = SWORD_TIERS[swordTier];
  const skillDmg = Math.round((35 + tier.dmgBonus * 1.5));

  projectiles.push({
    x: player.x + player.w / 2 + player.face * 30,
    y: player.y + player.h / 2 - 25,
    w: 60, h: 50,
    vx: player.face * 650,
    vy: 0,
    isPlayer: true,
    dmg: skillDmg,
    color: tier.glow,
    life: 0.8,
    facing: player.face,
    hitTargets: new Set()
  });

  spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, tier.glow, 25, 260);
  say('NGUYỆT QUANG TRẢM!');
}

// 3. Lướt Né
function dash() {
  if (!running || paused || player.dead || player.skillCd > 2.0) return;
  if (player.dashTimer > 0) return;

  player.dashTimer = 0.22;
  player.invuln = Math.max(player.invuln, 0.32);
  playDashSFX();

  spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#7dd3fc', 12, 160);
}

// 4. Vòng lặp Cập nhật Vật lý và AI
function update(dt) {
  worldTime += dt;

  if (toastTimer > 0) {
    toastTimer -= dt * 1000;
    if (toastTimer <= 0 && toast) toast.hidden = true;
  }

  if (!running || paused) return;

  player.animTime += dt * 9;
  player.attackCd = Math.max(0, player.attackCd - dt);
  player.attackTime = Math.max(0, player.attackTime - dt);
  player.skillCd = Math.max(0, player.skillCd - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);

  player.comboTimer -= dt;
  if (player.comboTimer <= 0) player.combo = 0;

  player.mana = Math.min(player.maxMana, player.mana + 7 * dt);

  const left = keys.ArrowLeft || keys.KeyA;
  const right = keys.ArrowRight || keys.KeyD;

  if (player.dashTimer > 0) {
    player.vx = player.face * 620;
  } else {
    player.vx = (left ? -1 : 0) + (right ? 1 : 0);
    player.vx *= 240;
    if (left && !right) player.face = -1;
    if (right && !left) player.face = 1;
  }

  if (keys.Space || keys.ArrowUp || keys.KeyW) {
    if (player.onGround) {
      player.vy = -580;
      player.onGround = false;
      playJumpSFX();
      spawnParticleBurst(player.x + player.w / 2, player.y + player.h, '#94a3b8', 6, 80);
    }
    keys.Space = keys.ArrowUp = keys.KeyW = false;
  }

  player.vy += 1480 * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  const levelLength = STAGES[stageIndex].length;
  player.x = clamp(player.x, 0, levelLength - player.w);

  player.onGround = false;
  for (const plat of platforms) {
    if (rectIntersect(player.x, player.y, player.w, player.h, plat.x, plat.y, plat.w, plat.h)) {
      if (player.vy >= 0 && player.y + player.h - player.vy * dt <= plat.y + 12) {
        player.y = plat.y - player.h;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  if (player.y > H + 180) {
    damagePlayer(30, player.x);
    player.x = checkpoint.active ? checkpoint.x : checkpointX;
    player.y = 350;
    player.vy = 0;
  }

  if (checkpoint && !checkpoint.active && rectIntersect(player.x, player.y, player.w, player.h, checkpoint.x, checkpoint.y, checkpoint.w, checkpoint.h)) {
    checkpoint.active = true;
    checkpointX = checkpoint.x;
    say('ĐÃ KÍCH HOẠT ĐIỂM KIỂM TRA!');
    playChestSFX();
  }

  for (const haz of hazards) {
    if (rectIntersect(player.x, player.y, player.w, player.h, haz.x, haz.y, haz.w, haz.h)) {
      damagePlayer(18, haz.x + haz.w / 2);
    }
  }

  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    enemy.animTime += dt * 6;
    enemy.flash = Math.max(0, enemy.flash - dt);
    enemy.attackCd -= dt;

    if (enemy.knockbackX) {
      enemy.x += enemy.knockbackX * dt;
      enemy.knockbackX *= Math.max(0, 1 - 6 * dt);
      if (Math.abs(enemy.knockbackX) < 5) enemy.knockbackX = 0;
    }

    const distToPlayer = (player.x + player.w / 2) - (enemy.x + enemy.w / 2);

    if (Math.abs(distToPlayer) < 380) {
      enemy.face = distToPlayer > 0 ? 1 : -1;

      if (enemy.fly) {
        enemy.y = enemy.baseY + Math.sin(worldTime * 4 + enemy.x) * 30;
        if (Math.abs(distToPlayer) > 15) {
          enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
        }
      } else if (Math.abs(distToPlayer) > enemy.w + 8) {
        enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
      }

      if (enemy.ranged && enemy.attackCd <= 0) {
        enemy.attackCd = 2.2;
        projectiles.push({
          x: enemy.x + enemy.w / 2,
          y: enemy.y + enemy.h / 2,
          w: 16, h: 16,
          vx: Math.sign(distToPlayer) * 320,
          vy: 0,
          isPlayer: false,
          dmg: enemy.dmg,
          color: '#a855f7',
          life: 2.5
        });
      }
    }

    enemy.x = clamp(enemy.x, 0, levelLength - enemy.w);

    if (rectIntersect(player.x, player.y, player.w, player.h, enemy.x, enemy.y, enemy.w, enemy.h) && enemy.attackCd <= 0) {
      damagePlayer(enemy.dmg, enemy.x + enemy.w / 2);
      enemy.attackCd = 1.2;
    }
  }

  if (boss && !boss.dead) {
    const bossTriggerX = levelLength - 700;
    if (player.x > bossTriggerX && !boss.active) {
      boss.active = true;
      playBossRoarSFX();
      say(`BOSS XUẤT HIỆN: ${STAGES[stageIndex].bossName}!`, 2500);
    }

    if (boss.active) {
      boss.animTime += dt * 5;
      boss.flash = Math.max(0, boss.flash - dt);
      boss.attackCd -= dt;
      boss.skillCd -= dt;

      const bossDistX = (player.x + player.w / 2) - (boss.x + boss.w / 2);
      boss.face = bossDistX > 0 ? 1 : -1;

      if (boss.hp < boss.maxHp * 0.5) boss.phase = 2;
      const spdMultiplier = boss.phase === 2 ? 1.4 : 1.0;

      if (Math.abs(bossDistX) > 90) {
        boss.x += Math.sign(bossDistX) * 80 * spdMultiplier * dt;
      }

      if (boss.skillCd <= 0) {
        boss.skillCd = boss.phase === 2 ? 2.8 : 4.0;
        shake = 8;
        playBossRoarSFX();

        projectiles.push({
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h - 25,
          w: 32, h: 25,
          vx: boss.face * 380,
          vy: 0,
          isPlayer: false,
          dmg: stageIndex === 2 ? 26 : 20,
          color: stageIndex === 2 ? '#c084fc' : '#f87171',
          life: 2.5
        });
      }

      if (boss.attackCd <= 0) {
        boss.attackCd = boss.phase === 2 ? 1.2 : 1.6;
        if (Math.abs(bossDistX) < 180) {
          damagePlayer(stageIndex === 2 ? 25 : 18, boss.x + boss.w / 2);
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f87171', 12, 180);
        }
      }
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    if (p.isPlayer) {
      for (const enemy of enemies) {
        if (enemy.alive && !p.hitTargets.has(enemy) && rectIntersect(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
          p.hitTargets.add(enemy);
          damageEnemy(enemy, p.dmg, p.facing);
        }
      }
      if (boss && !boss.dead && boss.active && !p.hitTargets.has(boss) && rectIntersect(p.x, p.y, p.w, p.h, boss.x, boss.y, boss.w, boss.h)) {
        p.hitTargets.add(boss);
        damageBoss(p.dmg, p.facing);
      }
    } else {
      if (rectIntersect(player.x, player.y, player.w, player.h, p.x, p.y, p.w, p.h)) {
        damagePlayer(p.dmg, p.x);
        p.life = 0;
      }
    }

    if (p.life <= 0) projectiles.splice(i, 1);
  }

  for (const item of pickups) {
    if (item.taken) continue;
    if (rectIntersect(player.x, player.y, player.w, player.h, item.x - 12, item.y - 12, 24, 24)) {
      item.taken = true;
      if (item.type === 'gold') {
        gold += item.val;
        playCoinSFX();
        spawnFloatingPopup(item.x, item.y, `+${item.val}G`, '#fde047');
      } else if (item.type === 'heart') {
        player.hp = Math.min(player.maxHp, player.hp + 25);
        playCoinSFX();
        spawnFloatingPopup(item.x, item.y, '+25 HP', '#4ade80');
      } else if (item.type === 'mana') {
        player.mana = Math.min(player.maxMana, player.mana + 35);
        playCoinSFX();
        spawnFloatingPopup(item.x, item.y, '+35 MP', '#38bdf8');
      }
      spawnParticleBurst(item.x, item.y, item.type === 'gold' ? '#fde047' : item.type === 'heart' ? '#4ade80' : '#38bdf8', 8, 100);
    }
  }

  if (exitGate && exitGate.open && player.x > exitGate.x - 20) {
    if (stageIndex < STAGES.length - 1) {
      startNextStage();
    } else {
      victory = true;
      running = false;
      playVictorySFX();
      showEndScreen(true);
    }
  }

  cameraX = clamp(player.x - W * 0.38, 0, levelLength - W);
  shake = Math.max(0, shake - dt * 22);

  updateHUD();
}

// 5. Vòng lặp Khung hình (Animation Frame)
function gameLoop(timestamp) {
  const dt = Math.min(0.033, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

// 6. Đăng ký Sự kiện Bàn phím & Cảm ứng
document.addEventListener('keydown', e => {
  if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
    e.preventDefault();
  }

  if ((screenMode === 'intro' || !running) && !overlay.hidden) {
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyJ') {
      handleStartGame(false);
      return;
    }
  }

  keys[e.code] = true;
  if (e.repeat) return;

  if (e.code === 'KeyJ' || e.code === 'KeyZ') attack();
  if (e.code === 'KeyK' || e.code === 'KeyX') skill();
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') dash();
  if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
});

document.addEventListener('keyup', e => {
  keys[e.code] = false;
});

// Cảm ứng Mobile
if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024) {
  const mc = $('mobileControls');
  if (mc) mc.removeAttribute('hidden');
}

document.querySelectorAll('.mobile-controls button').forEach(btn => {
  const key = btn.dataset.key;

  const onDown = e => {
    e.preventDefault();
    initAudio();
    if (key === 'left') keys.ArrowLeft = true;
    else if (key === 'right') keys.ArrowRight = true;
    else if (key === 'jump') keys.Space = true;
    else if (key === 'attack') attack();
    else if (key === 'skill') skill();
    else if (key === 'dash') dash();
  };

  const onUp = e => {
    e.preventDefault();
    if (key === 'left') keys.ArrowLeft = false;
    if (key === 'right') keys.ArrowRight = false;
  };

  btn.addEventListener('pointerdown', onDown);
  btn.addEventListener('pointerup', onUp);
  btn.addEventListener('pointerleave', onUp);
});

// 7. Đăng ký Sự kiện Nút bấm UI
if ($('startBtn')) $('startBtn').addEventListener('click', () => handleStartGame(false));
if ($('continueBtn')) $('continueBtn').addEventListener('click', () => handleStartGame(true));
if ($('guideBtn')) $('guideBtn').addEventListener('click', showGuide);
if ($('closeGuideBtn')) $('closeGuideBtn').addEventListener('click', closeGuide);
if ($('settingsBtn')) $('settingsBtn').addEventListener('click', showSettings);
if ($('closeSettingsBtn')) $('closeSettingsBtn').addEventListener('click', closeSettings);
if ($('soundBtn')) $('soundBtn').addEventListener('click', toggleSound);
if ($('toggleSoundSetting')) $('toggleSoundSetting').addEventListener('click', toggleSound);

if ($('volumeSlider')) {
  $('volumeSlider').addEventListener('input', e => {
    masterVolume = parseFloat(e.target.value) / 100;
    writeSave();
  });
}

if ($('resetSaveBtn')) {
  $('resetSaveBtn').addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu lưu trò chơi không?')) {
      resetSave();
    }
  });
}

if ($('pauseBtn')) $('pauseBtn').addEventListener('click', togglePause);
if ($('resumeBtn')) $('resumeBtn').addEventListener('click', togglePause);
if ($('restartStageBtn')) $('restartStageBtn').addEventListener('click', () => resetGame(true));

if ($('quitMenuBtn')) {
  $('quitMenuBtn').addEventListener('click', () => {
    running = false;
    paused = false;
    showOverlay(panelIntro);
    if (hud) hud.hidden = true;
    if (bossHud) bossHud.hidden = true;
  });
}

if ($('upgradeBtn')) $('upgradeBtn').addEventListener('click', openUpgradeModal);
if ($('closeUpgradeBtn')) $('closeUpgradeBtn').addEventListener('click', hideOverlay);

if ($('confirmUpgradeBtn')) {
  $('confirmUpgradeBtn').addEventListener('click', () => {
    const cur = SWORD_TIERS[swordTier];
    if (gold >= cur.cost) {
      gold -= cur.cost;
      swordTier++;
      player.maxHp += 15;
      player.hp = player.maxHp;

      playChestSFX();
      say(`ĐÃ NÂNG CẤP THÀNH CÔNG: ${SWORD_TIERS[swordTier].name}!`, 2500);
      writeSave();
      hideOverlay();
      updateHUD();
    } else {
      say('CHƯA ĐỦ VÀNG ĐỂ NÂNG CẤP!');
    }
  });
}

// 8. Khởi chạy đầu tiên
loadSave();
buildStage(stageIndex, false);
running = false;
showOverlay(panelIntro);

requestAnimationFrame(gameLoop);

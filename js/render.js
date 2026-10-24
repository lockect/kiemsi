/**
 * ============================================================================
 * RENDER.JS - HỆ THỐNG VẼ HÌNH ẢNH GAME VÀ ĐỒ HỌA ANIME (CANVAS RENDER ENGINE)
 * ============================================================================
 */

'use strict';

function drawBackground() {
  const stage = STAGES[stageIndex];
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, stage.sky1);
  grad.addColorStop(1, stage.sky2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Mặt trăng
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = stageIndex === 2 ? '#e9d5ff' : stageIndex === 1 ? '#fed7aa' : '#e0f2fe';
  ctx.beginPath();
  ctx.arc(1020 - cameraX * 0.04, 110, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Parallax núi xa
  for (let i = -1; i < 12; i++) {
    const px = i * 240 - (cameraX * 0.15 % 240);
    ctx.fillStyle = stage.far;
    ctx.beginPath();
    ctx.moveTo(px, 510);
    ctx.lineTo(px + 120, 260 + Math.sin(i * 3) * 25);
    ctx.lineTo(px + 260, 510);
    ctx.closePath();
    ctx.fill();
  }

  // Parallax rừng cây gần
  for (let i = -1; i < 22; i++) {
    const px = i * 125 - (cameraX * 0.35 % 125);
    const h = 140 + Math.sin(i * 2.5) * 40;
    ctx.fillStyle = stage.near;
    ctx.beginPath();
    ctx.moveTo(px + 60, 600 - h);
    ctx.lineTo(px + 10, 600);
    ctx.lineTo(px + 120, 600);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPlatforms() {
  for (const plat of platforms) {
    const screenX = plat.x - cameraX;
    if (screenX + plat.w < 0 || screenX > W) continue;

    ctx.fillStyle = STAGES[stageIndex].ground;
    ctx.fillRect(screenX, plat.y, plat.w, plat.h);

    ctx.fillStyle = stageIndex === 2 ? '#a855f7' : stageIndex === 1 ? '#f97316' : '#22c55e';
    ctx.fillRect(screenX, plat.y, plat.w, 6);
  }
}

function drawHero() {
  if (!player) return;

  const screenX = player.x - cameraX;
  const screenY = player.y;

  ctx.save();
  ctx.translate(screenX + player.w / 2, screenY + player.h / 2);

  if (player.invuln > 0 && Math.floor(worldTime * 20) % 2 === 0) {
    ctx.globalAlpha = 0.5;
  }

  ctx.scale(player.face, 1);

  const moving = Math.abs(player.vx) > 10 && player.onGround;
  const runCycle = Math.sin(player.animTime) * (moving ? 6 : 1);

  // Bóng đổ
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, player.h / 2 - 2, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Khăn quàng / Áo choàng
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(-10, -16);
  ctx.lineTo(-24 - (moving ? 10 : 0), 16 + runCycle);
  ctx.lineTo(8, 12);
  ctx.closePath();
  ctx.fill();

  // Chân & Ủng chiến binh
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-8, 12);
  ctx.lineTo(-12 + runCycle, 28);
  ctx.moveTo(8, 12);
  ctx.lineTo(12 - runCycle, 28);
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-18 + runCycle, 25, 14, 7);
  ctx.fillRect(6 - runCycle, 25, 14, 7);

  // Thân giáp
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-12, -18);
  ctx.lineTo(12, -18);
  ctx.lineTo(14, 12);
  ctx.lineTo(-14, 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-10, -12, 20, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-2, -10, 4, 16);

  // Khuôn mặt anime
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -28, 13, 0, Math.PI * 2);
  ctx.fill();

  // Tóc kiếm sĩ
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-15, -28);
  ctx.lineTo(-12, -44);
  ctx.lineTo(-2, -38);
  ctx.lineTo(6, -45);
  ctx.lineTo(14, -30);
  ctx.lineTo(8, -26);
  ctx.closePath();
  ctx.fill();

  // Mắt
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(4, -30, 5, 3);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(6, -30, 2, 3);

  // Vẽ thanh kiếm theo Cấp độ (Tier)
  const tier = SWORD_TIERS[swordTier];
  ctx.save();

  if (player.attackTime > 0) {
    ctx.rotate(-0.8 + (0.24 - player.attackTime) * 6.2);
  } else if (!player.onGround) {
    ctx.rotate(-0.35);
  } else {
    ctx.rotate(0.15 + Math.sin(player.animTime) * 0.08);
  }

  // Chuôi kiếm
  ctx.fillStyle = '#451a03';
  ctx.fillRect(16, -8, 5, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(12, -4, 13, 4);

  // Lưỡi kiếm
  ctx.fillStyle = tier.color;
  ctx.beginPath();
  ctx.moveTo(18, -6);
  ctx.lineTo(58, -12);
  ctx.lineTo(48, 0);
  ctx.lineTo(18, 0);
  ctx.closePath();
  ctx.fill();

  // Phát quang viền kiếm
  ctx.strokeStyle = tier.glow;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // Vòng cung ánh sáng chém kiếm (Slash Arc)
  if (player.attackTime > 0) {
    ctx.strokeStyle = tier.glow;
    ctx.lineWidth = player.combo === 3 ? 8 : 4;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(10, -2, 58, -1.2, 0.7);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();
}

function drawEnemies() {
  for (const e of enemies) {
    if (!e.alive) continue;
    const screenX = e.x - cameraX;
    if (screenX + e.w < 0 || screenX > W) continue;

    ctx.save();
    ctx.translate(screenX + e.w / 2, e.y + e.h / 2);
    ctx.scale(e.face, 1);

    if (e.flash > 0) ctx.globalAlpha = 0.5;

    if (e.type === 'slime') {
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.ellipse(0, 6 + Math.sin(e.animTime) * 3, e.w / 2, e.h / 2, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(3, 0, 4, 5);
      ctx.fillRect(13, 0, 4, 5);
    } else {
      ctx.fillStyle = e.color;
      ctx.fillRect(-e.w / 2, -e.h / 2, e.w, e.h);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, -e.h / 2 + 8, 4, 4);
      ctx.fillRect(12, -e.h / 2 + 8, 4, 4);
    }

    ctx.restore();

    // Thanh máu quái vật
    if (e.hp < e.maxHp) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(screenX - 2, e.y - 10, e.w + 4, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(screenX - 2, e.y - 10, (e.w + 4) * Math.max(0, e.hp / e.maxHp), 4);
    }
  }
}

function drawBoss() {
  if (!boss || boss.dead) return;
  const screenX = boss.x - cameraX;
  if (screenX + boss.w < 0 || screenX > W) return;

  ctx.save();
  ctx.translate(screenX + boss.w / 2, boss.y + boss.h / 2);
  ctx.scale(boss.face, 1);

  if (boss.flash > 0) ctx.globalAlpha = 0.5;

  ctx.fillStyle = stageIndex === 2 ? '#581c87' : stageIndex === 1 ? '#78350f' : '#1e3a5f';
  ctx.fillRect(-boss.w / 2, -boss.h / 2, boss.w, boss.h);

  // Mắt đỏ phát sáng
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(8, -boss.h / 2 + 18, 12, 6);
  ctx.fillRect(26, -boss.h / 2 + 18, 12, 6);

  ctx.restore();

  if (!boss.active) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ BOSS ĐANG CHỜ PHÍA TRƯỚC', screenX + boss.w / 2, boss.y - 18);
  }
}

function drawPickupsAndObjects() {
  // Vật phẩm
  for (const item of pickups) {
    if (item.taken) continue;
    const screenX = item.x - cameraX;
    if (screenX < -30 || screenX > W + 30) continue;

    const bob = Math.sin(worldTime * 4 + item.x) * 4;
    ctx.save();
    ctx.translate(screenX, item.y + bob);

    if (item.type === 'gold') {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (item.type === 'heart') {
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Rương báu
  for (const chest of chests) {
    const screenX = chest.x - cameraX;
    if (screenX < -40 || screenX > W + 40) continue;

    ctx.fillStyle = chest.opened ? '#78350f' : '#f59e0b';
    ctx.fillRect(screenX, chest.y, chest.w, chest.h);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, chest.y, chest.w, chest.h);
  }

  // Tượng Checkpoint
  if (checkpoint) {
    const screenX = checkpoint.x - cameraX;
    if (screenX >= -40 && screenX <= W + 40) {
      ctx.fillStyle = checkpoint.active ? '#38bdf8' : '#475569';
      ctx.fillRect(screenX, checkpoint.y, checkpoint.w, checkpoint.h);
    }
  }

  // Bẫy gai
  for (const haz of hazards) {
    const screenX = haz.x - cameraX;
    if (screenX < -60 || screenX > W + 60) continue;

    ctx.fillStyle = '#ef4444';
    for (let sx = screenX; sx < screenX + haz.w; sx += 12) {
      ctx.beginPath();
      ctx.moveTo(sx, haz.y + haz.h);
      ctx.lineTo(sx + 6, haz.y);
      ctx.lineTo(sx + 12, haz.y + haz.h);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Cổng ra
  if (exitGate) {
    const screenX = exitGate.x - cameraX;
    if (screenX >= -100 && screenX <= W + 100) {
      ctx.fillStyle = exitGate.open ? '#38bdf8' : '#334155';
      ctx.fillRect(screenX, exitGate.y, exitGate.w, exitGate.h);
      ctx.strokeStyle = exitGate.open ? '#7dd3fc' : '#64748b';
      ctx.lineWidth = 4;
      ctx.strokeRect(screenX, exitGate.y, exitGate.w, exitGate.h);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(exitGate.open ? 'CỔNG MỞ (TIẾN VÀO)' : 'CỔNG KHÓA (CẦN DIỆT BOSS)', screenX + exitGate.w / 2, exitGate.y - 12);
    }
  }

  // Tuyệt kỹ sóng kiếm
  for (const p of projectiles) {
    const screenX = p.x - cameraX;
    if (screenX < -50 || screenX > W + 50) continue;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(screenX, p.y, p.w / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hạt tia sáng
  for (const p of particles) {
    const screenX = p.x - cameraX;
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(screenX, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
}

function draw() {
  ctx.save();
  if (shake > 0) {
    ctx.translate(rand(-shake, shake), rand(-shake, shake));
  }

  drawBackground();
  drawPlatforms();
  drawPickupsAndObjects();
  drawEnemies();
  drawBoss();
  drawHero();

  ctx.restore();
}

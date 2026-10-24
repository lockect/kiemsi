/**
 * ============================================================================
 * MONSTERS/FROSTSTALKER.JS - THỎ TUYẾT SÁT THỦ (MÀN 5: BĂNG NGUYÊN VĨNH CỬU)
 * ============================================================================
 * 1. ĐÒN ĐÁNH THƯỜNG: Tiếp cận vung đoản đao băng chém thẳng vào người chơi.
 * 2. TUYỆT KỸ (SKILL): Lướt tốc độ cao ra ngay sau lưng người chơi, tung 2 nhát
 *    song đoản đao chém chéo hình chữ X gây 2 LẦN SÁT THƯƠNG liên tiếp.
 * ============================================================================
 */

// ============================================================================
// 1. HÀM VẼ HOẠT ẢNH & HIỆU ỨNG CHIÊU THỨC (RENDER PIPELINE)
// ============================================================================
function drawFrostStalker(ctx, e, worldTime) {
  const w = e.w || 40;
  const h = e.h || 52;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isXSlashing = (e.slashTimer || 0) > 0;
  const isNormalSlash = (e.normalSlashTimer || 0) > 0;
  const isDashing = Math.abs(e.vx || 0) > 80;
  const runCycle = Math.sin(anim * 8) * (isDashing ? 8 : 2);
  const scarfWave = Math.sin(time * 8) * 6;

  ctx.save();

  // Khi đang chém hoặc lướt: cúi rạp người về phía trước
  if (isXSlashing || isNormalSlash || isDashing) {
    ctx.rotate(0.18);
  }

  // 1.1. BÓNG ĐỔ DƯỚI NỀN TUYẾT
  ctx.save();
  ctx.fillStyle = 'rgba(2, 44, 74, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.46, w * 0.45, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 1.2. KHĂN QUÀNG CỔ XANH BĂNG BAY PHẤP PHỚI PHÍA SAU
  ctx.save();
  const scarfGrad = ctx.createLinearGradient(-8, -h * 0.2, -w - 18, h * 0.25);
  scarfGrad.addColorStop(0, '#0284c7');
  scarfGrad.addColorStop(0.5, '#38bdf8');
  scarfGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = scarfGrad;

  ctx.beginPath();
  ctx.moveTo(-6, -h * 0.22);
  ctx.quadraticCurveTo(-w * 0.6, -h * 0.1, -w - 14 - (isDashing ? 12 : 2), h * 0.15 + scarfWave);
  ctx.lineTo(-w * 0.7, h * 0.25 + scarfWave);
  ctx.lineTo(-4, -h * 0.1);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 1.3. ĐÔI CHÂN THON NHẢY THOĂN THOẮT CỦA THỎ TUYẾT
  const drawLeg = (lx, ly, offset, isFar) => {
    ctx.save();
    ctx.fillStyle = isFar ? '#94a3b8' : '#e0f2fe';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 6, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lx - 3 + offset * 0.4, ly + 6, 6, 12);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(lx - 2 + offset * 0.4, ly + 16, 8, 3);
    ctx.restore();
  };

  drawLeg(-12, h * 0.15, -runCycle, true);
  drawLeg(4, h * 0.15, runCycle, false);

  // 1.4. THÂN HÌNH SÁT THỦ PHỦ LÔNG TRẮNG TUYẾT & ĐAI DA
  const bodyGrad = ctx.createLinearGradient(-w / 3, -h * 0.25, w / 3, h * 0.3);
  bodyGrad.addColorStop(0, '#ffffff');
  bodyGrad.addColorStop(0.5, '#e0f2fe');
  bodyGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.3, -h * 0.22, w * 0.6, h * 0.42, [12, 12, 8, 8]);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-w * 0.28, -h * 0.05, w * 0.56, 5);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-3, -h * 0.06, 6, 7);

  // 1.5. ĐẦU THỎ, TAI DÀI BĂNG TINH & MẮT HỒNG NGỌC
  const headY = -h * 0.32;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, headY, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(-7, headY + 2, 14, 8, 3);
  ctx.fill();

  // Đôi tai thỏ dài có ngọn băng phát sáng
  const drawEar = (ex, ey, isLeft) => {
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(isLeft ? -0.35 : 0.15);

    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(-6, -18, 0, -32);
    ctx.quadraticCurveTo(6, -18, 4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-1.5, -4);
    ctx.lineTo(0, -22);
    ctx.lineTo(1.5, -4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(-4, -34);
    ctx.lineTo(0, -40);
    ctx.lineTo(4, -34);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawEar(-7, headY - 8, true);
  drawEar(5, headY - 8, false);

  // Mắt hồng ngọc sắc lạnh phát quang
  ctx.save();
  ctx.fillStyle = '#f43f5e';
  ctx.shadowColor = '#f43f5e';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(3, headY, 3.5, 4.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4, headY - 1, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 1.6. SONG ĐOẢN ĐAO BĂNG TINH (DUAL FROST DAGGERS)
  const drawDagger = (dx, dy, angle) => {
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(angle);

    ctx.fillStyle = '#451a03';
    ctx.fillRect(-2, 0, 4, 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-6, -2, 12, 3);

    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    const bladeGrad = ctx.createLinearGradient(-4, 0, 4, -26);
    bladeGrad.addColorStop(0, '#bae6fd');
    bladeGrad.addColorStop(0.6, '#38bdf8');
    bladeGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = bladeGrad;

    ctx.beginPath();
    ctx.moveTo(-4, -2);
    ctx.lineTo(-3, -22);
    ctx.lineTo(0, -30);
    ctx.lineTo(3, -22);
    ctx.lineTo(4, -2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  };

  if (isXSlashing) {
    // Tư thế song đao chéo hình chữ X
    drawDagger(16, headY + 12, 1.35);
    drawDagger(-4, headY + 14, 0.5);
  } else if (isNormalSlash) {
    // Tư thế vung 1 đao đâm chém tới phía trước
    drawDagger(18, headY + 8, 1.45);
    drawDagger(-6, headY + 16, -0.2);
  } else {
    drawDagger(12, headY + 18, 0.7);
    drawDagger(-8, headY + 16, -0.4);
  }

  // 1.7. HIỆU ỨNG VỆT CHÉM THƯỜNG
  if (isNormalSlash) {
    ctx.save();
    ctx.strokeStyle = '#bae6fd';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(15, -5, 28, -0.8, 0.8);
    ctx.stroke();
    ctx.restore();
  }

  // 1.8. HIỆU ỨNG VỆT CHÉM SONG ĐAO CHỮ X (FROST CROSS SLASH)
  if (isXSlashing) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#bae6fd';
    ctx.shadowBlur = 18;
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';

    // Đường chém 1
    ctx.beginPath();
    ctx.moveTo(8, -26);
    ctx.lineTo(46, 16);
    ctx.stroke();

    // Đường chém 2 tạo chữ X
    ctx.beginPath();
    ctx.moveTo(46, -26);
    ctx.lineTo(8, 16);
    ctx.stroke();

    // Lõi chém trắng sắc ngọt
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// 2. BỘ LOGIC AI: ĐÒN THƯỜNG & TUYỆT KỸ SONG ĐAO CHỮ X (2 LẦN SÁT THƯƠNG)
// ============================================================================
/**
 * ============================================================================
 * LOGIC AI CHIẾN ĐẤU CỦA THỎ TUYẾT SÁT THỦ (FROST STALKER)
 * ============================================================================
 */
function updateFrostStalkerSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);
  const absDist = Math.abs(dist);

  // Đếm lùi các bộ đếm thời gian
  e.attackCd = Math.max(0, (e.attackCd || 0) - dt);
  e.skillCd = Math.max(0, (e.skillCd || 0) - dt);
  e.slashTimer = Math.max(0, (e.slashTimer || 0) - dt);

  // 1. KÍCH HOẠT CHUẨN BỊ SKILL: Cự ly 70px - 160px & chờ đúng 1 giây
  if (e.skillCd <= 0 && absDist >= 70 && absDist <= 210 && (e.windUpTimer || 0) <= 0 && e.slashTimer <= 0) {
    e.windUpTimer = 0.4; // Bắt đầu đếm lùi 0.4 giây
    e.skillCd = 4.0;     // Hồi chiêu 4 giây
    e.vx = 0;            // Đứng yên để tụ khí

    // Phát âm thanh an toàn (không bao giờ bị crash)
    if (typeof playSynthSound === 'function') {
      playSynthSound(450, 0.2, 'triangle', 0.04, 700);
    } else if (ctxGame.playSkillSFX) {
      ctxGame.playSkillSFX();
    }

    if (ctxGame.spawnFloatingPopup) {
      ctxGame.spawnFloatingPopup(e.x + e.w / 2, e.y - 18, 'TỤ KHÍ BĂNG...', '#38bdf8', 1.2);
    }
    if (ctxGame.spawnParticleBurst) {
      ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#e0f2fe', 10, 140);
    }
  }

  // 2. KHI ĐANG TRONG 1 GIÂY CHỜ TỤ KHÍ
  if (e.windUpTimer > 0) {
    e.windUpTimer -= dt;
    e.vx = 0; // Đứng yên trong suốt 1 giây

    if (Math.random() < 0.3 && ctxGame.spawnParticleBurst) {
      ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#38bdf8', 2, 80);
    }

    // Khi hết thời gian 1 giây -> THI TRIỂN LƯỚT VÀ CHÉM
    if (e.windUpTimer <= 0) {
      e.windUpTimer = 0;
      e.slashTimer = 0.5;

      // Lướt ra sau lưng Kaito
      const targetX = player.x - player.face * 55;
      if (ctxGame.spawnParticleBurst) {
        ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#bae6fd', 16, 220);
      }

      e.x = targetX;
      e.face = player.face; // Cùng hướng mặt với Kaito để chém bọc hậu

      if (ctxGame.playDashSFX) ctxGame.playDashSFX();
      if (ctxGame.spawnParticleBurst) {
        ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#38bdf8', 18, 240);
      }
      if (ctxGame.say) ctxGame.say('THỎ TUYẾT: ÁM SÁT CHỮ X!');

      // Nhát chém 1
      if (ctxGame.playSlashSFX) ctxGame.playSlashSFX(1);
      if (ctxGame.damagePlayer) ctxGame.damagePlayer(Math.round(e.dmg * 0.75), e.x);
      if (ctxGame.spawnParticleBurst) {
        ctxGame.spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#38bdf8', 10, 180);
      }

      // Nhát chém 2 (sau 150ms tạo thành vết chém chữ X)
      setTimeout(() => {
        if (!e.alive) return;
        if (ctxGame.playSlashSFX) ctxGame.playSlashSFX(2);
        if (ctxGame.shakeScreen) ctxGame.shakeScreen(5);
        if (ctxGame.damagePlayer) ctxGame.damagePlayer(Math.round(e.dmg * 0.75), e.x);
        if (ctxGame.spawnFloatingPopup) {
          ctxGame.spawnFloatingPopup(player.x + player.w / 2, player.y - 10, 'TRẢM CHỮ X!', '#38bdf8', 1.3);
        }
        if (ctxGame.spawnParticleBurst) {
          ctxGame.spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#e0f2fe', 14, 200);
        }
      }, 150);
    }
    return;
  }

  // 3. ĐÒN ĐÁNH THƯỜNG CẬN CHIẾN (khi cự ly < 60px)
  if (e.attackCd <= 0 && absDist < 60 && e.slashTimer <= 0) {
    e.attackCd = 1.6;
    if (ctxGame.playSlashSFX) ctxGame.playSlashSFX(1);
    if (ctxGame.damagePlayer) ctxGame.damagePlayer(e.dmg, e.x + e.w / 2);
    if (ctxGame.spawnParticleBurst) {
      ctxGame.spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#bae6fd', 8, 150);
    }
    return;
  }

  // 4. DI CHUYỂN BÌNH THƯỜNG
  if (e.slashTimer <= 0 && absDist > 45) {
    e.x += Math.sign(dist) * e.spd * dt;
  }
}
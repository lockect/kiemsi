/**
 * ============================================================================
 * MONSTERS/THUNDERAPE.JS - KHỈ ĐÁ BỌC LÔI (MÀN 6: ĐỈNH NÚI LÔI VÂN)
 * ============================================================================
 * 1. ĐÒN THƯỜNG: Vung nắm đấm đá bọc điện đánh trúng sẽ HẤT VĂNG Kaito ra xa.
 * 2. SKILL: Nện 2 nắm đấm đá xuống sàn phóng 2 đợt sóng điện plasma lan tỏa,
 *    gây sát thương nhỏ và làm TÊ LIỆT người chơi trong 0.2 giây.
 * ============================================================================
 */

function drawThunderApe(ctx, e, worldTime) {
  const w = e.w || 54;
  const h = e.h || 58;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isSlamming = (e.slamTimer || 0) > 0;
  const isPunching = (e.punchTimer || 0) > 0;
  const walkBob = Math.sin(anim * 5) * 2.5;

  ctx.save();

  // 1. BÓNG ĐỔ DƯỚI NỀN ĐÁ
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.46, w * 0.55, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. CÁC TINH THỂ LÔI THẠCH TRÊN LƯNG PHÁT SÁNG
  ctx.save();
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12;
  const drawCrystalSpike = (sx, sy, ang, sz) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(4, -sz * 0.5);
    ctx.lineTo(0, -sz);
    ctx.lineTo(-4, -sz * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  drawCrystalSpike(-w * 0.28, -h * 0.25 + walkBob, -0.6, 22);
  drawCrystalSpike(-w * 0.15, -h * 0.35 + walkBob, -0.2, 28);
  drawCrystalSpike(0, -h * 0.38 + walkBob, 0.1, 24);
  ctx.restore();

  // 3. ĐÔI CHÂN SAU RẮN CHẮC
  const legGrad = ctx.createLinearGradient(0, h * 0.15, 0, h * 0.45);
  legGrad.addColorStop(0, '#1e293b');
  legGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = legGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.32, h * 0.15, 14, h * 0.32, 4);
  ctx.roundRect(w * 0.12, h * 0.15, 14, h * 0.32, 4);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 4. THÂN HÌNH CƠ BẮP ĐÁ BAZAN NỨT NẺ
  const bodyGrad = ctx.createLinearGradient(0, -h * 0.25, 0, h * 0.3);
  bodyGrad.addColorStop(0, '#334155');
  bodyGrad.addColorStop(0.5, '#1e293b');
  bodyGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.4, -h * 0.25 + walkBob, w * 0.8, h * 0.52, [18, 18, 12, 12]);
  ctx.fill();

  // Mạch nứt lôi điện vàng rực chạy dọc ngực
  ctx.save();
  ctx.strokeStyle = '#fef08a';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-8, -h * 0.15 + walkBob);
  ctx.lineTo(2, -h * 0.05 + walkBob);
  ctx.lineTo(-4, h * 0.08 + walkBob);
  ctx.lineTo(6, h * 0.2 + walkBob);
  ctx.stroke();
  ctx.restore();

  // 5. ĐẦU KHỈ ĐÁ & RĂNG NANH NGƯỢC
  const headY = -h * 0.32 + walkBob;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(w * 0.08, headY, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(w * 0.05, headY + 3, 14, 10, 4);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(w * 0.1, headY + 11);
  ctx.lineTo(w * 0.12, headY + 4);
  ctx.lineTo(w * 0.14, headY + 11);
  ctx.moveTo(w * 0.16, headY + 11);
  ctx.lineTo(w * 0.18, headY + 4);
  ctx.lineTo(w * 0.2, headY + 11);
  ctx.fill();

  // Mắt phát quang lôi điện vàng cam
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;
  ctx.fillRect(w * 0.1, headY - 3, 4, 3.5);
  ctx.fillRect(w * 0.17, headY - 3, 4, 3.5);
  ctx.restore();

  // 6. HAI CÁNH TAY & NẮM ĐẤM ĐÁ
  const drawArmAndFist = (ax, ay, isLeft, isRaised, isStriking) => {
    ctx.save();
    ctx.translate(ax, ay);

    if (isRaised) {
      ctx.rotate(isLeft ? -1.6 : -1.3); // Giơ cao 2 tay lên trời khi nện sàn
    } else if (isStriking) {
      ctx.rotate(isLeft ? 0.4 : 1.35);  // Đấm thẳng tới trước hất văng
    }

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-7, 0, 14, 24, 5);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Nắm đấm đá bọc điện
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-10, 20, 20, 16, 5);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-8, 22, 4, 4);
    ctx.fillRect(4, 22, 4, 4);

    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-6, 28);
    ctx.lineTo(0, 34);
    ctx.lineTo(6, 28);
    ctx.stroke();
    ctx.restore();
  };

  if (isSlamming) {
    drawArmAndFist(-w * 0.25, headY + 8, true, true, false);
    drawArmAndFist(w * 0.22, headY + 8, false, true, false);
  } else if (isPunching) {
    drawArmAndFist(-w * 0.28, -h * 0.08 + walkBob, true, false, false);
    drawArmAndFist(w * 0.2, -h * 0.08 + walkBob, false, false, true);
  } else {
    drawArmAndFist(-w * 0.32, -h * 0.08 + walkBob, true, false, false);
    drawArmAndFist(w * 0.18, -h * 0.08 + walkBob, false, false, false);
  }

  // 7. HIỆU ỨNG SÓNG LÔI ĐIỆN KHI NỆN ĐẤT
  if (isSlamming) {
    ctx.save();
    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(w * 0.1, h * 0.42, 32, 0, Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(w * 0.1, h * 0.42, 20, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// LOGIC CHIẾN ĐẤU AI CỦA KHỈ ĐÁ BỌC LÔI
// ============================================================================
function updateThunderApeSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);

  e.attackCd = Math.max(0, (e.attackCd || 0) - dt);
  e.skillCd = Math.max(0, (e.skillCd || 0) - dt);
  e.slamTimer = Math.max(0, (e.slamTimer || 0) - dt);
  e.punchTimer = Math.max(0, (e.punchTimer || 0) - dt);

  // --------------------------------------------------------------------------
  // 1. KỸ NĂNG: NỆN 2 NẮM ĐẤM PHÓNG SÓNG ĐIỆN GÂY TÊ LIỆT 0.2S
  // Kích hoạt khi cách Kaito từ 90px đến 350px
  // --------------------------------------------------------------------------
  if (e.skillCd <= 0 && Math.abs(dist) >= 90 && Math.abs(dist) <= 350 && e.onGround && e.slamTimer <= 0) {
    e.skillCd = 4.0 + Math.random() * 1.5; // Hồi chiêu 4.0s - 5.5s
    e.slamTimer = 0.55;                    // Giơ 2 tay gồng nện trong 0.55s
    e.punchTimer = 0;
    ctxGame.playSkillSFX();
    ctxGame.say('KHỈ ĐÁ: NỆN SÀN LÔI ĐIỆN TÊ LIỆT!');

    // Khi nện chạm đất (sau 0.25s)
    setTimeout(() => {
      if (!e.alive) return;
      ctxGame.shakeScreen(9);
      ctxGame.playHitSFX();
      ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h, '#fde047', 22, 220);

      // Phóng 2 luồng sóng điện plasma chạy dọc sàn sang 2 bên
      [-380, 380].forEach(vx => {
        ctxGame.projectiles.push({
          type: 'thunder_wave',
          x: e.x + e.w / 2,
          y: e.y + e.h - 18,
          w: 36,
          h: 22,
          vx: vx,
          vy: 0,
          isPlayer: false,
          dmg: Math.round(e.dmg * 0.4), // Sát thương nhỏ (40% DMG)
          stun: 1,                   // Gây tê liệt 1s
          color: '#fef08a',
          life: 1.6
        });
      });
    }, 250);
    return;
  }

  // --------------------------------------------------------------------------
  // 2. ĐÒN ĐÁNH THƯỜNG: VUNG TAY ĐẤM CẬN CHIẾN HẤT VĂNG NGƯỜI CHƠI
  // Kích hoạt khi áp sát < 70px
  // --------------------------------------------------------------------------
  if (e.attackCd <= 0 && Math.abs(dist) < 70 && e.slamTimer <= 0) {
    e.attackCd = 1.8;
    e.punchTimer = 0.35;
    ctxGame.playSlashSFX(3);
    ctxGame.shakeScreen(6);

    // Gây sát thương đầy đủ và HẤT VĂNG người chơi ra xa
    const knockDir = dist >= 0 ? 1 : -1;
    ctxGame.damagePlayer(e.dmg, e.x + e.w / 2, knockDir * 460, -320);
    ctxGame.spawnFloatingPopup(player.x + player.w / 2, player.y - 10, 'HẤT VĂNG!', '#f97316', 1.2);
    ctxGame.spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#fde047', 15, 200);
    return;
  }

  // --------------------------------------------------------------------------
  // 3. DI CHUYỂN BƯỚC TỪNG BƯỚC NẶNG NỀ TIẾP CẬN
  // --------------------------------------------------------------------------
  if (e.slamTimer <= 0 && e.punchTimer <= 0) {
    if (Math.abs(dist) > 50) {
      e.x += Math.sign(dist) * e.spd * dt;
    }
  }
}
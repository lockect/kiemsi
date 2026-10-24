/**
 * ============================================================================
 * MONSTERS/OBSIDIAN DEMON.JS - THẠCH QUỶ HẮC ÁM (OBSIDIAN DARK MONOLITH)
 * ============================================================================
 * Thiết kế mới:
 * - Tảng đá cổ đại đen tuyền, góc cạnh sắc nhọn, đứng vững chắc trên mặt đất.
 * - Các khe nứt dung nham Hư Không và mắt rực lửa tím/đỏ phát quang.
 * - Các dải năng lượng bóng tối (Shadow Ribbons) xoay quanh thân bồng bềnh.
 * - Hoạt cảnh: Nén người dậm sàn, khi bật nhảy thân đá hơi chúc xuống giáng đòn.
 * ============================================================================
 */

function drawObsidianDemon(ctx, e, worldTime) {
  const w = e.w || 48;
  const h = e.h || 52;
  const isLeaping = !e.onGround && (e.isLeaping || Math.abs(e.vy || 0) > 30);
  const isCharging = (e.chargeSlamTimer || 0) > 0;

  // Nhịp thở năng lượng bóng tối
  const pulse = Math.sin((worldTime || 0) * 5) * 2;
  const rotAngle = (worldTime || 0) * 2.2;

  ctx.save();

  // Khi gồng nén dậm đất: dẹp người xuống; khi đang rơi từ trên cao: kéo dãn nhẹ
  if (isCharging) {
    ctx.scale(1.15, 0.85);
  } else if (isLeaping && e.vy > 0) {
    ctx.scale(0.92, 1.08); // Lao bổ nhào xuống
  }

  // 1. BÓNG ĐỔ VỮNG CHẮC DƯỚI NỀN ĐẤT
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.46, w * 0.52, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. CÁC DẢI NĂNG LƯỢNG BÓNG TỐI QUANH THÂN (DARK VOID RIBBONS)
  ctx.save();
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 14;
  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 2.5;

  // Dải xoáy năng lượng 1
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.58 + pulse, rotAngle, rotAngle + Math.PI * 0.8);
  ctx.stroke();

  // Dải xoáy năng lượng 2 (ngược chiều)
  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.68 - pulse, -rotAngle, -rotAngle + Math.PI * 0.7);
  ctx.stroke();

  // Các đốm tinh thể bóng tối trôi nổi
  ctx.fillStyle = '#f5d0fe';
  for (let i = 0; i < 3; i++) {
    const ang = rotAngle + (i * Math.PI * 2) / 3;
    const px = Math.cos(ang) * (w * 0.62);
    const py = Math.sin(ang) * (h * 0.48);
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. THÂN TẢNG ĐÁ NGUYÊN KHỐI OBSIDIAN ĐEN GÓC CẠNH
  const stoneGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  stoneGrad.addColorStop(0, '#2e1065');
  stoneGrad.addColorStop(0.3, '#1e1b4b');
  stoneGrad.addColorStop(0.75, '#090514');
  stoneGrad.addColorStop(1, '#020617');
  ctx.fillStyle = stoneGrad;

  // Khối đa giác tảng đá gồ ghề
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.5);              // Đỉnh tháp nhọn
  ctx.lineTo(w * 0.44, -h * 0.35);       // Mép vát góc phải
  ctx.lineTo(w * 0.52, h * 0.1);         // Khối vai phải
  ctx.lineTo(w * 0.38, h * 0.44);        // Chân đế phải
  ctx.lineTo(-w * 0.38, h * 0.44);       // Chân đế trái
  ctx.lineTo(-w * 0.52, h * 0.1);        // Khối vai trái
  ctx.lineTo(-w * 0.44, -h * 0.35);      // Mép vát góc trái
  ctx.closePath();
  ctx.fill();

  // Viền cạnh đá sắc nhọn
  ctx.strokeStyle = '#6b21a8';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // 4. MẶT CẮT TINH THỂ & KHE NỨT NĂNG LƯỢNG RỰC SÁNG
  ctx.save();
  ctx.strokeStyle = '#e879f9';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 1.8;

  // Rãnh nứt giữa thân đá
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.4);
  ctx.lineTo(0, h * 0.35);
  ctx.moveTo(-w * 0.3, -h * 0.05);
  ctx.lineTo(w * 0.3, -h * 0.05);
  ctx.moveTo(-w * 0.25, h * 0.18);
  ctx.lineTo(w * 0.25, h * 0.18);
  ctx.stroke();

  // Lõi ngọc Hư Không trung tâm phát quang
  ctx.fillStyle = isCharging ? '#f43f5e' : '#c026d3';
  ctx.beginPath();
  ctx.arc(0, 0, 5 + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1.2, -1.2, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. MẮT HẮC ÁM ĐỎ RỰC ẨN TRONG ĐÁ
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  // Mắt trái
  ctx.beginPath();
  ctx.moveTo(-11, -h * 0.16); ctx.lineTo(-4, -h * 0.14); ctx.lineTo(-8, -h * 0.08);
  ctx.closePath();
  ctx.fill();
  // Mắt phải
  ctx.beginPath();
  ctx.moveTo(11, -h * 0.16); ctx.lineTo(4, -h * 0.14); ctx.lineTo(8, -h * 0.08);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. HIỆU ỨNG CHẤN ĐỘNG KHI GỒNG DẬM ĐẤT
  if (isCharging) {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, h * 0.42, 20 + pulse * 2, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// Định danh tương thích
function drawShadowGargoyle(ctx, e, worldTime) {
  drawObsidianDemon(ctx, e, worldTime);
}
// Thêm vào cuối file monsters/Obsidian Demon.js:
function updateObsidianDemonSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);
  e.slamCd = (e.slamCd || 0) - dt;

  if (e.chargeSlamTimer > 0) {
    e.chargeSlamTimer -= dt;
    if (e.chargeSlamTimer <= 0) {
      e.isLeaping = true;
      e.onGround = false;
      e.vy = -680;
      e.vx = e.face * 260;
      ctxGame.playJumpSFX();
      ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h, '#c084fc', 12, 180);
    }
  } else if (e.slamCd <= 0 && e.onGround && Math.abs(dist) > 60 && Math.abs(dist) < 320) {
    e.chargeSlamTimer = 0.45;
    e.slamCd = 2.8 + Math.random() * 1.4;
    e.vx = 0;
  } else if (e.isLeaping) {
    e.x += e.vx * dt;
    if (e.onGround) {
      e.isLeaping = false;
      e.vx = 0;
      ctxGame.shakeScreen(8);
      ctxGame.playHitSFX();
      ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h, '#c026d3', 18, 220);
      if (Math.abs(dist) < 65) {
        ctxGame.damagePlayer(e.dmg, e.x + e.w / 2);
      }
    }
  } else if (Math.abs(dist) > 4) {
    e.x += Math.sign(dist) * e.spd * dt;
  }
}
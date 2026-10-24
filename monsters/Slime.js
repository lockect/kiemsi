/**
 * ============================================================================
 * SLIME.JS - QUÁI NHẦY THẠCH ANH (PHÓNG GIỌT NƯỚC KHI TẤN CÔNG)
 * ============================================================================
 */
function drawSlime(ctx, e) {
  const w = e.w;
  const h = e.h;
  const isPouncing = !!e.isPouncing;
  const isCharging = (e.chargeTimer || 0) > 0;

  // Tính toán biến dạng:
  // - Khi gồng: Nén bẹp dúm xuống sát sàn (squash)
  // - Khi phóng: Kéo dãn dài theo hình giọt nước (stretch)
  let squish = Math.sin(e.animTime * 4) * (e.onGround ? 3.5 : 1);
  let stretchX = 0;
  let stretchY = 0;

  if (isCharging) {
    squish = -8; // Nén chặt người tích lực
    stretchX = 6;
  } else if (isPouncing) {
    stretchX = -6; // Dẹp hông
    stretchY = 12; // Dãn dài thành mũi nhọn giọt nước
  }

  ctx.save();

  // Góc nghiêng theo hướng bay khi đang phóng trên không
  if (isPouncing) {
    const angle = Math.atan2(e.vy || 0, Math.abs(e.vx || 1));
    ctx.rotate(angle * 0.4);
  }

  // 1. Bóng đổ dưới sàn
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, h / 2 - 2, (w / 2) + stretchX, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Thân thạch dạng giọt nước
  const grad = ctx.createLinearGradient(0, -h / 2 - stretchY, 0, h / 2);
  grad.addColorStop(0, '#86efac'); // Đỉnh giọt nước phát sáng
  grad.addColorStop(0.4, '#22c55e');
  grad.addColorStop(1, '#14532d');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(-w / 2 - stretchX, h / 2);

  if (isPouncing) {
    // Đuôi vuốt nhọn về phía sau, đầu tròn lao về trước
    ctx.quadraticCurveTo(-w / 2, -h / 4, 4 + stretchY, -h / 2 - stretchY);
    ctx.quadraticCurveTo(w / 2, -h / 4, w / 2 + stretchX, h / 2);
  } else {
    // Trạng thái thạch bình thường
    ctx.quadraticCurveTo(-w / 2 - 3 - stretchX, -h / 4 - squish, 0, -h / 2 - squish);
    ctx.quadraticCurveTo(w / 2 + 3 + stretchX, -h / 4 - squish, w / 2 + stretchX, h / 2);
  }
  ctx.closePath();
  ctx.fill();

  // 3. Vệt sáng bóng phản chiếu (Specular Highlight)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.ellipse(-w / 5, -h / 4 - (isPouncing ? stretchY * 0.5 : squish * 0.5), w / 6, h / 9, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // 4. Mắt to tròn nhìn chằm chằm mục tiêu
  const eyeY = (isCharging ? 2 : -2) - (isPouncing ? stretchY * 0.3 : squish * 0.4);

  // Mắt trái
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(3, eyeY, 3.5, isCharging ? 2.5 : 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4, eyeY - 1, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Mắt phải
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(12, eyeY, 3.5, isCharging ? 2.5 : 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(13, eyeY - 1, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
// Thêm vào cuối file monsters/Slime.js:
function updateSlimeSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);
  e.pounceCd = (e.pounceCd || 0) - dt;

  if (e.chargeTimer > 0) {
    e.chargeTimer -= dt;
    if (e.chargeTimer <= 0) {
      e.isPouncing = true;
      e.onGround = false;
      e.vy = -320;
      e.vx = e.face * 340;
      ctxGame.playJumpSFX();
    }
  } else if (e.pounceCd <= 0 && e.onGround && Math.abs(dist) > 50 && Math.abs(dist) < 240) {
    e.chargeTimer = 0.35;
    e.pounceCd = 2.0 + Math.random() * 1.2;
    e.vx = 0;
  } else if (e.isPouncing) {
    e.x += e.vx * dt;
    if (e.onGround) {
      e.isPouncing = false;
      e.vx = 0;
    }
  } else if (Math.abs(dist) > 4) {
    e.x += Math.sign(dist) * e.spd * dt;
  }
}
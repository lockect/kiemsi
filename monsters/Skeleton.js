/**
 * SKELETON.JS - CHIẾN BINH BỘ XƯƠNG
 * Thiết kế: Hộp sọ có hốc mắt rực đỏ, lồng ngực lộ xương sườn, tay giơ khiên sắt kiên cố.
 */
function drawSkeleton(ctx, e) {
  const w = e.w;
  const h = e.h;
  const walk = Math.sin(e.animTime * 3.5) * 2;

  ctx.save();

  // 1. Bóng đổ
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, h / 2 - 2, 17, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Chân xương ống
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, h / 2 - 16);
  ctx.lineTo(-7 + walk, h / 2 - 2);
  ctx.moveTo(6, h / 2 - 16);
  ctx.lineTo(7 - walk, h / 2 - 2);
  ctx.stroke();

  // 3. Cột sống & Lồng ngực (Ribcage)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  // Cột sống giữa
  ctx.beginPath();
  ctx.moveTo(0, -h / 2 + 14);
  ctx.lineTo(0, h / 2 - 14);
  ctx.stroke();
  // 3 dải xương sườn cong
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, -h / 2 + 18 + i * 5, 7, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
  }

  // 4. Hộp sọ (Skull)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(0, -h / 2 + 6, 9, 0, Math.PI * 2);
  ctx.fill();
  // Hàm dưới
  ctx.fillRect(-5, -h / 2 + 11, 10, 5);

  // 5. Hốc mắt rực sáng linh hồn màu đỏ
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(3, -h / 2 + 6, 2.5, 0, Math.PI * 2);
  ctx.arc(8, -h / 2 + 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Khiên thép phòng ngự (Shield) giơ ra phía trước
  ctx.save();
  ctx.translate(-w / 2 + 2, -2);
  // Khung khiên
  const shieldGrad = ctx.createLinearGradient(-6, -14, 6, 14);
  shieldGrad.addColorStop(0, '#64748b');
  shieldGrad.addColorStop(0.5, '#475569');
  shieldGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = shieldGrad;

  ctx.beginPath();
  ctx.moveTo(-6, -14);
  ctx.lineTo(6, -14);
  ctx.lineTo(6, 4);
  ctx.lineTo(0, 14); // Đáy nhọn
  ctx.lineTo(-6, 4);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Đinh tán nổi trên khiên
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
// Thêm vào cuối file monsters/Skeleton.js:
function updateSkeletonSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);

  // Kỹ năng biến hình khi máu dưới 40%
  if (!e.transformed && e.hp > 0 && e.hp <= e.maxHp * 0.4) {
    e.transformed = true;
    e.hp = e.maxHp;                   // Hồi phục 100% HP
    const oldH = e.h;
    e.w = Math.round(e.w * 1.45);     // Phóng to 145%
    e.h = Math.round(e.h * 1.45);
    e.y -= (e.h - oldH);              // Chân chạm đất chuẩn xác
    e.dmg = Math.round(e.dmg * 1.8);  // Tăng 80% sát thương
    e.spd = Math.round(e.spd * 1.25);
    e.flash = 0.35;

    ctxGame.shakeScreen(9);
    ctxGame.playBossRoarSFX();
    ctxGame.spawnFloatingPopup(e.x + e.w / 2, e.y - 25, 'HỒI SINH BIẾN HÌNH +100% HP!', '#ef4444', 1.4);
    ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#ef4444', 28, 240);
    ctxGame.say('CHIẾN BINH BỘ XƯƠNG HÓA KHỔNG LỒ CUỒNG NỘ!', 2500);
  }

  if (Math.abs(dist) > 4) {
    e.x += Math.sign(dist) * e.spd * dt;
  }
}
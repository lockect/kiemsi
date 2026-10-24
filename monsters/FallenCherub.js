/**
 * ============================================================================
 * MONSTERS/FALLENCHERUB.JS - THIÊN THẦN SA NGÃ (MÀN 8: THÀNH PHỐ THIÊN KHÔNG)
 * ============================================================================
 * Thiết kế: Bay bồng bềnh, 4 cánh (2 trắng thánh thiện, 2 đen tím sa ngã),
 * mắt bịt lụa đen, giương Cung Ánh Sáng bắn tên truy đuổi sao chổi.
 * ============================================================================
 */

function drawFallenCherub(ctx, e, worldTime) {
  const w = e.w || 42;
  const h = e.h || 54;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isShooting = (e.castTimer || 0) > 0;
  const floatBob = Math.sin(time * 3.5) * 5;
  const wingFlap = Math.sin(time * 7) * 9;

  ctx.save();
  ctx.translate(0, floatBob);

  // 1. BỐN CÁNH LÔNG VŨ (2 CÁNH TRẮNG TRÊN, 2 CÁNH TÍM ĐEN DƯỚI)
  // --- CÁNH TRẮNG THÁNH THIỆN (PHÍA TRÊN) ---
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 10;
  // Cánh trắng trái
  ctx.beginPath();
  ctx.moveTo(-4, -h * 0.2);
  ctx.quadraticCurveTo(-w * 0.6, -h * 0.65 - wingFlap, -w - 8, -h * 0.35 - wingFlap * 0.5);
  ctx.lineTo(-w * 0.6, -h * 0.1);
  ctx.lineTo(-4, -h * 0.1);
  ctx.closePath();
  ctx.fill();
  // Cánh trắng phải
  ctx.beginPath();
  ctx.moveTo(4, -h * 0.2);
  ctx.quadraticCurveTo(w * 0.6, -h * 0.65 - wingFlap, w + 8, -h * 0.35 - wingFlap * 0.5);
  ctx.lineTo(w * 0.6, -h * 0.1);
  ctx.lineTo(4, -h * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --- CÁNH ĐEN TÍM SA NGÃ (PHÍA DƯỚI) ---
  ctx.save();
  const darkWingGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
  darkWingGrad.addColorStop(0, '#3b0764');
  darkWingGrad.addColorStop(1, '#090514');
  ctx.fillStyle = darkWingGrad;
  // Cánh tím trái
  ctx.beginPath();
  ctx.moveTo(-4, -h * 0.05);
  ctx.quadraticCurveTo(-w * 0.7, h * 0.15 + wingFlap * 0.4, -w * 0.85, h * 0.35);
  ctx.lineTo(-w * 0.4, h * 0.2);
  ctx.closePath();
  ctx.fill();
  // Cánh tím phải
  ctx.beginPath();
  ctx.moveTo(4, -h * 0.05);
  ctx.quadraticCurveTo(w * 0.7, h * 0.15 + wingFlap * 0.4, w * 0.85, h * 0.35);
  ctx.lineTo(w * 0.4, h * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. VÁY LỤA THIÊN SỨ BAY BỒNG BỀNH
  const dressGrad = ctx.createLinearGradient(0, -h * 0.2, 0, h * 0.45);
  dressGrad.addColorStop(0, '#ffffff');
  dressGrad.addColorStop(0.6, '#e0f2fe');
  dressGrad.addColorStop(1, '#3b0764'); // Đáy váy nhuốm màu sa ngã
  ctx.fillStyle = dressGrad;

  ctx.beginPath();
  ctx.moveTo(0, -h * 0.2);
  ctx.lineTo(w * 0.28, h * 0.42);
  ctx.quadraticCurveTo(0, h * 0.34, -w * 0.28, h * 0.42);
  ctx.closePath();
  ctx.fill();

  // 3. ĐẦU THIÊN THẦN, TÓC BẠCH KIM & BĂNG BỊT MẮT LỤA ĐEN
  const headY = -h * 0.28;

  // Tóc bạch kim dài xõa bồng bềnh
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.moveTo(-10, headY - 4);
  ctx.quadraticCurveTo(-18, headY + 12, -14, headY + 28);
  ctx.lineTo(-6, headY + 16);
  ctx.lineTo(0, headY + 22);
  ctx.lineTo(6, headY + 16);
  ctx.quadraticCurveTo(18, headY + 12, 14, headY + 28);
  ctx.lineTo(10, headY - 4);
  ctx.closePath();
  ctx.fill();

  // Khuôn mặt anime thanh thoát
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(0, headY, 9, 0, Math.PI * 2);
  ctx.fill();

  // Băng bịt mắt lụa đen huyền bí
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-8, headY - 3, 16, 4.5);

  // 4. CÁNH CUNG ÁNH SÁNG THẦN THÁNH (CELESTIAL LIGHT BOW)
  ctx.save();
  ctx.translate(w * 0.24, -h * 0.05);

  // Cánh cung cong phát sáng
  ctx.strokeStyle = '#facc15';
  ctx.shadowColor = '#fde047';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 16, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // Dây cung ánh sáng
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(Math.cos(-Math.PI * 0.4) * 16, Math.sin(-Math.PI * 0.4) * 16);
  ctx.lineTo(isShooting ? -6 : 0, 0); // Kéo căng dây cung khi bắn
  ctx.lineTo(Math.cos(Math.PI * 0.4) * 16, Math.sin(Math.PI * 0.4) * 16);
  ctx.stroke();

  // Mũi tên ánh sáng hình ngôi sao khi giương cung
  if (isShooting) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-4, -3);
    ctx.lineTo(-4, 3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}
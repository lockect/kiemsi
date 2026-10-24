/**
 * ============================================================================
 * MONSTERS/BOSSSERAPH.JS - THÁNH HIỆP SĨ SERAPH (SERAPHIM BLADE OF DAWN - BOSS MÀN 8)
 * ============================================================================
 * Đồ họa: Nữ chiến thần thánh linh mang 6 cánh lông vũ ánh sáng vàng kim,
 * bịt mắt lụa trắng, vạc giáp bạc cẩm thạch nẹp chỉ vàng, cầm Song Kiếm Thánh Quang.
 * ============================================================================
 */

function drawBossSeraphMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 110;
  const h = b.h || 140;
  const time = worldTime || anim;
  const wingWave = Math.sin(time * 6) * 14;
  const floatBob = Math.sin(time * 3.5) * 4;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isCasting = (b.castTimer || 0) > 0;

  ctx.save();
  ctx.translate(0, floatBob);

  if (isSlashing) ctx.rotate(0.2);
  if (isCasting) ctx.rotate(-0.15);

  // 1. THẦN QUANG HỘ THUẪN & VÒNG HÀO QUANG THÁNH SPIRIT (PHASE 2 / CASTING)
  if (isP2 || isCasting) {
    ctx.save();
    const auraGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, w * 0.95);
    auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    auraGrad.addColorStop(0.6, 'rgba(250, 204, 21, 0.2)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.95, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 3;
    ctx.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);
    ctx.restore();
  }

  // 2. 6 CÁNH LÔNG VŨ ÁNH SÁNG VÀNG KIM (6 SERAPHIM WINGS)
  ctx.save();
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 20;

  for (let i = -1; i <= 1; i++) {
    const angleOffset = i * 0.35;
    // Cánh trái
    ctx.beginPath();
    ctx.moveTo(0, i * 18);
    ctx.quadraticCurveTo(-w * 0.5, i * 25 - wingWave, -w * 0.9, i * 40 - wingWave * 0.8);
    ctx.quadraticCurveTo(-w * 0.4, i * 20, 0, i * 18);
    ctx.fill();

    // Cánh phải
    ctx.beginPath();
    ctx.moveTo(0, i * 18);
    ctx.quadraticCurveTo(w * 0.5, i * 25 - wingWave, w * 0.9, i * 40 - wingWave * 0.8);
    ctx.quadraticCurveTo(w * 0.4, i * 20, 0, i * 18);
    ctx.fill();
  }
  ctx.restore();

  // 3. ĐÔI CHÂN THON MANG THÁNH GIÁP CẨM THẠCH TRẮNG
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-5, h * 0.1);
  ctx.lineTo(-8, h * 0.42);
  ctx.moveTo(5, h * 0.1);
  ctx.lineTo(8, h * 0.42);
  ctx.stroke();

  // Ủng bạc nẹp vàng
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-10, h * 0.4, 6, 4);
  ctx.fillRect(6, h * 0.4, 6, 4);

  // 4. VÁY DẠ HỘI VÀ TẤM GIÁP NGỰC BẠC NẸP CHỈ VÀNG HOÀNG GIA
  const armorGrad = ctx.createLinearGradient(0, -h * 0.25, 0, h * 0.2);
  armorGrad.addColorStop(0, '#ffffff');
  armorGrad.addColorStop(0.5, '#f8fafc');
  armorGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = armorGrad;

  ctx.beginPath();
  ctx.moveTo(-w * 0.28, -h * 0.22);
  ctx.lineTo(w * 0.28, -h * 0.22);
  ctx.lineTo(w * 0.2, h * 0.18);
  ctx.lineTo(0, h * 0.25);
  ctx.lineTo(-w * 0.2, h * 0.18);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Tà váy lụa trắng thanh thoát bay phía sau
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-w * 0.22, h * 0.12);
  ctx.quadraticCurveTo(-w * 0.4, h * 0.32, -w * 0.3, h * 0.45);
  ctx.lineTo(w * 0.3, h * 0.45);
  ctx.quadraticCurveTo(w * 0.4, h * 0.32, w * 0.22, h * 0.12);
  ctx.closePath();
  ctx.fill();

  // 5. GƯƠNG MẶT ANIME BỊT DẢI LỤA TRẮNG & VÒNG HÀO QUANG (HALO)
  const headY = -h * 0.32;

  // Vòng hào quang thánh linh xoay tròn lơ lửng sau gáy
  ctx.save();
  ctx.strokeStyle = '#fde047';
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 18;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, headY - 14, 22, 6, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Gương mặt V-line xinh đẹp
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.moveTo(-8, headY - 4);
  ctx.lineTo(-8, headY + 2);
  ctx.quadraticCurveTo(-5, headY + 9, 0, headY + 10);
  ctx.quadraticCurveTo(5, headY + 9, 8, headY + 2);
  ctx.lineTo(8, headY - 4);
  ctx.closePath();
  ctx.fill();

  // Dải lụa bịt mắt thánh thiện
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-8.5, headY - 2, 17, 5);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.strokeRect(-8.5, headY - 2, 17, 5);

  // Mái tóc bạch kim buông xõa dài qua vai
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-9, headY - 6);
  ctx.quadraticCurveTo(-16, headY + 10, -12, headY + 25);
  ctx.lineTo(-6, headY + 18);
  ctx.lineTo(0, headY - 8);
  ctx.lineTo(6, headY + 18);
  ctx.lineTo(12, headY + 25);
  ctx.quadraticCurveTo(16, headY + 10, 9, headY - 6);
  ctx.closePath();
  ctx.fill();

  // 6. SONG KIẾM THÁNH QUANG (DUAL DAWNOBLADES)
  const drawDawnblade = (sx, sy, angle) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);

    // Chuôi kiếm vàng
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2, -5, 4, 12);

    // Lưỡi kiếm pha lê ánh sáng rực rỡ
    ctx.save();
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 18;
    const bladeGrad = ctx.createLinearGradient(-4, -5, 4, -48);
    bladeGrad.addColorStop(0, '#ffffff');
    bladeGrad.addColorStop(0.5, '#fef08a');
    bladeGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = bladeGrad;

    ctx.beginPath();
    ctx.moveTo(-4, -5);
    ctx.lineTo(-3, -42);
    ctx.lineTo(0, -52); // Mũi kiếm vát sắc ngọt
    ctx.lineTo(3, -42);
    ctx.lineTo(4, -5);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  };

  if (isSlashing) {
    drawDawnblade(w * 0.22, headY + 15, 1.2);
    drawDawnblade(-w * 0.22, headY + 15, -0.8);
  } else {
    drawDawnblade(w * 0.28, headY + 18, 0.4);
    drawDawnblade(-w * 0.28, headY + 18, -0.4);
  }

  // 7. VFX THÁNH QUANG LIÊN TRẢM HOẶC VẠN KIẾM QUY TÔNG
  if (isSlashing || isCasting) {
    ctx.save();
    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 4;

    // Vệt kiếm chém đan chéo hình mạng nhện
    ctx.beginPath();
    ctx.moveTo(-35, -35); ctx.lineTo(45, 35);
    ctx.moveTo(45, -35); ctx.lineTo(-35, 35);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

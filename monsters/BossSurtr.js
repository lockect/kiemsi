/**
 * ============================================================================
 * MONSTERS/BOSSSURTR.JS - HỎA THẦN TITAN SURTR (LORD OF UNDERFORGE - BOSS MÀN 7)
 * ============================================================================
 * Đồ họa: Cự nhân khổng lồ giáp gang hắc thiết nứt nẻ magma, đầu bốc cháy
 * ngọn lửa vĩnh cửu, tay cầm Đại Chiến Chùy Nham Thạch (Magma Warmace).
 * ============================================================================
 */

function drawBossSurtrMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 140;
  const h = b.h || 160;
  const time = worldTime || anim;
  const breathe = Math.sin(time * 4) * 4;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isCasting = (b.castTimer || 0) > 0;

  ctx.save();

  // 1. VỰNG HÀO QUANG LỬA NHAM THẠCH BỐC CHÁY (PHASE 2 / CASTING)
  if (isP2 || isCasting) {
    ctx.save();
    const auraGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, w * 0.9);
    auraGrad.addColorStop(0, 'rgba(249, 115, 22, 0.5)');
    auraGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.25)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#f97316';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 24;
    ctx.lineWidth = 3;
    ctx.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12);
    ctx.restore();
  }

  // 2. CHÂN ĐÁ GIÁP GANG NẶNG NỀ
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-w * 0.35, h * 0.15, 28, h * 0.32);
  ctx.fillRect(w * 0.15, h * 0.15, 28, h * 0.32);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-w * 0.35, h * 0.15, 28, h * 0.32);
  ctx.strokeRect(w * 0.15, h * 0.15, 28, h * 0.32);

  // Khe nứt dung nham ở đầu gối
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-w * 0.35, h * 0.28, 28, 3);
  ctx.fillRect(w * 0.15, h * 0.28, 28, 3);

  // 3. THÂN THỂ CỰ NHÂN BỌC GIÁP GANG HẮC THIẾT NỨT NẺ MAGMA
  const bodyGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  bodyGrad.addColorStop(0, '#44403c');
  bodyGrad.addColorStop(0.5, '#1c1917');
  bodyGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.44, -h * 0.28 + breathe, w * 0.88, h * 0.55, [18, 18, 10, 10]);
  ctx.fill();
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mạch dung nham nứt nẻ rực sáng cam đỏ trên ngực
  ctx.save();
  ctx.strokeStyle = '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-w * 0.25, -h * 0.12 + breathe);
  ctx.lineTo(0, h * 0.12 + breathe);
  ctx.lineTo(w * 0.25, -h * 0.12 + breathe);
  ctx.stroke();
  ctx.restore();

  // GAI ĐÁ NÚI LỬA TRÊN CẦU VAI
  const drawShoulderSpike = (sx, sy, isLeft) => {
    ctx.save();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (isLeft ? -18 : 18), sy - 28);
    ctx.lineTo(sx + (isLeft ? -8 : 8), sy + 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  };
  drawShoulderSpike(-w * 0.4, -h * 0.22 + breathe, true);
  drawShoulderSpike(w * 0.4, -h * 0.22 + breathe, false);

  // 4. ĐẦU VƯƠNG MIỆN SỪNG QUỶ & LỬA VĨNH CỬU
  const headY = -h * 0.35 + breathe;

  // Hộp sọ bazan
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(0, headY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Ngọn lửa rực cháy ngùn ngụt trên đỉnh đầu
  ctx.save();
  ctx.fillStyle = '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 20;
  const flameH = 22 + Math.sin(time * 10) * 8;
  ctx.beginPath();
  ctx.moveTo(-12, headY - 14);
  ctx.quadraticCurveTo(-4, headY - 14 - flameH * 0.6, 0, headY - 14 - flameH);
  ctx.quadraticCurveTo(4, headY - 14 - flameH * 0.6, 12, headY - 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, headY - 14 - flameH * 0.4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Mắt dung nham vàng rực
  ctx.save();
  ctx.fillStyle = '#fde047';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 15;
  ctx.fillRect(-12, headY - 4, 8, 5);
  ctx.fillRect(4, headY - 4, 8, 5);
  ctx.restore();

  // 5. TAY CẦM ĐẠI CHIẾN CHÙY NHAM THẠCH (MAGMA WARMACE)
  ctx.save();
  ctx.translate(w * 0.34, -h * 0.1 + breathe);
  if (isSlashing) ctx.rotate(1.3);
  if (isCasting) ctx.rotate(-0.9);

  // Cán chùy hắc thiết
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(-3, -70, 6, 90);

  // Đầu Đại Chiến Chùy Nham Thạch ngàn cân
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.roundRect(-22, -85, 44, 30, 6);
  ctx.fill();
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Rãnh dung nham sôi sùng sục giữa đầu chùy
  ctx.save();
  ctx.fillStyle = '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 14;
  ctx.fillRect(-16, -78, 32, 16);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-8, -74, 16, 8);
  ctx.restore();

  ctx.restore();

  // 6. VFX NỆN BÚA SÓNG THẦN LỬA HOẶC MƯA BOM NHAM THẠCH
  if (isSlashing || isCasting) {
    ctx.save();
    ctx.strokeStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 6;

    // Sóng búa lửa nện đất
    ctx.beginPath();
    ctx.arc(w * 0.4, 0, 75, -0.8, 0.8);
    ctx.stroke();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

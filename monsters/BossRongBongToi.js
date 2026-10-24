/**
 * ============================================================================
 * MONSTERS/BOSSRONGBONGTOI.JS - RỒNG BÓNG TỐI (VOID DRAGON - BOSS MÀN 4)
 * ============================================================================
 * Thiết kế: Kẻ Hủy Diệt Cổ Đại bay lượn khổng lồ, cánh vảy tím gân plasma,
 * sừng gai ma quỷ, phun bão lửa quét đất và cào xé rách không gian.
 * ============================================================================
 */

function drawBossRongBongToiMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 140;
  const h = b.h || 130;
  const breathe = Math.sin((worldTime || 0) * 3.5) * 3.5;
  const wingFlap = Math.sin((worldTime || 0) * 5.5) * 16;
  const isBreathing = (b.breathTimer || 0) > 0;
  const isBiting = (b.biteTimer || 0) > 0;
  const isSummoning = (b.crystalRainTimer || 0) > 0;
  const flamePulse = Math.sin((worldTime || 0) * 8) * 3;

  ctx.save();

  // 1. VẦNG LỬA HƯ KHÔNG QUANH CHÂN
  ctx.save();
  const flameBaseGrad = ctx.createRadialGradient(0, h * 0.35, 10, 0, h * 0.35, w * 0.65);
  flameBaseGrad.addColorStop(0, 'rgba(192, 38, 211, 0.45)');
  flameBaseGrad.addColorStop(0.5, 'rgba(88, 28, 135, 0.25)');
  flameBaseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = flameBaseGrad;
  ctx.beginPath();
  ctx.ellipse(0, h * 0.38, w * 0.65, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isP2 ? '#f43f5e' : '#c026d3';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 14;
  for (let f = -3; f <= 3; f++) {
    const fx = f * 18;
    const fy = h * 0.36;
    const fh = 14 + Math.sin((worldTime || 0) * 10 + f) * 6;
    ctx.beginPath();
    ctx.moveTo(fx - 7, fy);
    ctx.quadraticCurveTo(fx - 2, fy - fh * 0.6, fx, fy - fh);
    ctx.quadraticCurveTo(fx + 2, fy - fh * 0.6, fx + 7, fy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 2. TIA SÉT PLASMA TÍM
  ctx.save();
  ctx.strokeStyle = '#f5d0fe';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 1.6;
  const sparkStep = Math.floor((worldTime || 0) * 16);
  const sparkLocs = [
    { x: -w * 0.55, y: -h * 0.35 + (sparkStep % 4) * 3 },
    { x: w * 0.45,  y: -h * 0.45 - (sparkStep % 5) * 2 },
    { x: w * 0.15,  y: -h * 0.6 + (sparkStep % 3) * 4 },
    { x: -w * 0.2,  y: h * 0.1 - (sparkStep % 4) * 2 }
  ];
  sparkLocs.forEach((pt, i) => {
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x + (i % 2 === 0 ? 7 : -7), pt.y + 6);
    ctx.lineTo(pt.x + (i % 2 === 0 ? -5 : 6), pt.y + 13);
    ctx.lineTo(pt.x + (i % 2 === 0 ? 6 : -5), pt.y + 19);
    ctx.stroke();
  });
  ctx.restore();

  // 3. ĐUÔI RỒNG KHỔNG LỒ & GAI SỐNG ĐUÔI
  ctx.save();
  const tailWave = Math.sin((worldTime || 0) * 5) * 11;
  const tailGrad = ctx.createLinearGradient(-w / 2, h / 5, -w - 45, h * 0.45);
  tailGrad.addColorStop(0, '#1e1b4b');
  tailGrad.addColorStop(0.4, '#3b0764');
  tailGrad.addColorStop(0.8, '#581c87');
  tailGrad.addColorStop(1, '#c026d3');
  ctx.fillStyle = tailGrad;

  ctx.beginPath();
  ctx.moveTo(-w * 0.35, h * 0.1);
  ctx.quadraticCurveTo(-w * 0.75, h * 0.05 - tailWave, -w - 35, h * 0.38 + tailWave);
  ctx.quadraticCurveTo(-w * 0.8, h * 0.52, -w * 0.3, h * 0.32);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();

  // 4. ĐÔI CÁNH RỒNG HƯ KHÔNG KHỔNG LỒ
  ctx.save();
  const wingGrad = ctx.createLinearGradient(-w * 0.8, -h * 0.7, w * 0.8, h * 0.3);
  wingGrad.addColorStop(0, '#090514');
  wingGrad.addColorStop(0.3, '#1e1b4b');
  wingGrad.addColorStop(0.65, '#581c87');
  wingGrad.addColorStop(0.9, '#a855f7');
  wingGrad.addColorStop(1, '#f5d0fe');

  // Cánh trái
  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.moveTo(-15, -h * 0.15 + breathe);
  ctx.quadraticCurveTo(-w * 0.65, -h * 0.75 - wingFlap, -w - 28, -h * 0.45 - wingFlap * 0.5);
  ctx.lineTo(-w * 0.95, -h * 0.25 - wingFlap * 0.4);
  ctx.lineTo(-w * 0.75, -h * 0.05);
  ctx.lineTo(-w * 0.55, h * 0.08);
  ctx.lineTo(-12, -h * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Cánh phải
  ctx.beginPath();
  ctx.moveTo(12, -h * 0.15 + breathe);
  ctx.quadraticCurveTo(w * 0.6, -h * 0.82 - wingFlap, w + 36, -h * 0.48 - wingFlap * 0.5);
  ctx.lineTo(w * 0.95, -h * 0.22 - wingFlap * 0.3);
  ctx.lineTo(w * 0.72, -h * 0.02);
  ctx.lineTo(w * 0.45, h * 0.1);
  ctx.lineTo(8, -h * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Gân cánh phát sáng
  ctx.save();
  ctx.strokeStyle = '#f5d0fe';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(12, -h * 0.15 + breathe);
  ctx.lineTo(w * 0.62, -h * 0.38 - wingFlap * 0.5);
  ctx.lineTo(w * 0.92, -h * 0.2 - wingFlap * 0.3);
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  // 5. THÂN THỂ VÀNG VẢY ĐEN OBSIDIAN & TRÁI TIM HƯ KHÔNG
  ctx.save();
  const bodyY = -h * 0.22 + breathe;

  const bodyGrad = ctx.createLinearGradient(-w * 0.35, bodyY, w * 0.35, bodyY + h * 0.6);
  bodyGrad.addColorStop(0, '#090514');
  bodyGrad.addColorStop(0.3, '#1e1b4b');
  bodyGrad.addColorStop(0.7, '#0f172a');
  bodyGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.36, bodyY, w * 0.72, h * 0.58, [24, 20, 18, 22]);
  ctx.fill();

  ctx.strokeStyle = '#6b21a8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Lõi tim Hư Không
  ctx.save();
  const corePulse = isSummoning ? 5 : flamePulse;
  ctx.fillStyle = isP2 ? '#f43f5e' : '#c026d3';
  ctx.shadowColor = isP2 ? '#f43f5e' : '#e879f9';
  ctx.shadowBlur = isSummoning ? 35 : 22;

  ctx.beginPath();
  ctx.arc(0, bodyY + 28, 11 + corePulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // 6. ĐẦU RỒNG, CẶP SỪNG CỔ ĐẠI & HÀM RĂNG NANH
  ctx.save();
  const headX = w * 0.24;
  const headY = -h * 0.32 + breathe;
  const jawOpen = isBreathing ? 30 : (isBiting ? 26 : 8);

  // Sừng
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.moveTo(headX - 8, headY - 6);
  ctx.quadraticCurveTo(headX - 25, headY - 35, headX - 45, headY - 52);
  ctx.lineTo(headX - 16, headY - 12);
  ctx.moveTo(headX + 4, headY - 6);
  ctx.quadraticCurveTo(headX - 8, headY - 40, headX - 22, headY - 60);
  ctx.lineTo(headX - 2, headY - 10);
  ctx.fill();

  // Hộp sọ rồng
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(headX - 10, headY - 10);
  ctx.lineTo(w * 0.68, headY + 2);
  ctx.lineTo(w * 0.54, headY + 12 + jawOpen);
  ctx.lineTo(headX - 12, headY + 22);
  ctx.closePath();
  ctx.fill();

  // Nanh rồng
  ctx.fillStyle = '#ffffff';
  for (let n = 0; n < 4; n++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.38 + n * 7, headY + 4);
    ctx.lineTo(w * 0.41 + n * 7, headY + 14 + jawOpen * 0.3);
    ctx.lineTo(w * 0.45 + n * 7, headY + 4);
    ctx.fill();
  }

  // Mắt đỏ rực lửa
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.ellipse(headX + 16, headY - 1, 9, 5, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // 7. CHIÊU THỨC: BÃO LỬA TÍM HOẶC CÀO XÉ RÁCH KHÔNG GIAN
  if (isBreathing) {
    ctx.save();
    const breathL = 260 + Math.sin((worldTime || 0) * 20) * 40;
    const bGrad = ctx.createLinearGradient(w * 0.5, 0, w * 0.5 + breathL, 60);
    bGrad.addColorStop(0, '#ffffff');
    bGrad.addColorStop(0.2, '#f5d0fe');
    bGrad.addColorStop(0.5, '#c026d3');
    bGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
    ctx.fillStyle = bGrad;

    ctx.beginPath();
    ctx.moveTo(w * 0.52, -h * 0.2 + breathe);
    ctx.lineTo(w * 0.52 + breathL, 45);
    ctx.lineTo(w * 0.52 + breathL * 0.85, 115);
    ctx.lineTo(w * 0.52, 18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (isBiting) {
    ctx.save();
    ctx.strokeStyle = '#c026d3';
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 24;
    ctx.lineWidth = 5;
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.35, -45 + k * 22);
      ctx.lineTo(w * 0.95, -18 + k * 22);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

const drawRongBongToiMaster = drawBossRongBongToiMaster;
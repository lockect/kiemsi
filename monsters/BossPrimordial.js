/**
 * ============================================================================
 * MONSTERS/BUSSPRIMORDIAL.JS - SÁNG THẾ THẦN THÁI CỔ (THE PRIMORDIAL ONE - BOSS MÀN 10)
 * ============================================================================
 * Đồ họa: Thực thể vũ trụ tối thượng phát sáng hào quang ngũ sắc nguyên tố,
 * áo choàng Ngân hà chứa hàng tỷ vì tinh tú, vương miện Sáng Thế 7 nguyên tố.
 * ============================================================================
 */

function drawBossPrimordialMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 150;
  const h = b.h || 170;
  const time = worldTime || anim;
  const pulse = Math.sin(time * 4) * 6;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isCasting = (b.castTimer || 0) > 0;

  ctx.save();

  if (isSlashing) ctx.rotate(0.12);
  if (isCasting) ctx.rotate(-0.18);

  // 1. HÀO QUANG CẦU VỒNG NGUYÊN TỐ VŨ TRỤ (PHASE 1 -> 3 / CASTING)
  ctx.save();
  const rainbowGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, w * 0.95);
  rainbowGrad.addColorStop(0, '#ffffff');
  rainbowGrad.addColorStop(0.25, '#38bdf8');
  rainbowGrad.addColorStop(0.5, '#c084fc');
  rainbowGrad.addColorStop(0.75, '#f43f5e');
  rainbowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rainbowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.95 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = '#fde047';
  ctx.shadowBlur = 28;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12);
  ctx.restore();

  // 2. ÁO CHOÀNG NGÂN HÀ CHỨA HÀNG TỶ VÌ TINH TÚ (COSMIC MILKY WAY CLOAK)
  ctx.save();
  const cloakGrad = ctx.createLinearGradient(-w * 0.4, -h * 0.3, w * 0.4, h * 0.45);
  cloakGrad.addColorStop(0, '#312e81');
  cloakGrad.addColorStop(0.5, '#1e1b4b');
  cloakGrad.addColorStop(1, '#020617');
  ctx.fillStyle = cloakGrad;

  ctx.beginPath();
  ctx.moveTo(-w * 0.38, -h * 0.25);
  ctx.quadraticCurveTo(-w * 0.6, h * 0.2, -w * 0.48, h * 0.45);
  ctx.lineTo(w * 0.48, h * 0.45);
  ctx.quadraticCurveTo(w * 0.6, h * 0.2, w * 0.38, -h * 0.25);
  ctx.closePath();
  ctx.fill();

  // Bụi sao ngân hà lấp lánh trên áo choàng
  ctx.fillStyle = '#ffffff';
  for (let s = 0; s < 12; s++) {
    const sx = -w * 0.35 + (s * 23) % (w * 0.7);
    const sy = -h * 0.1 + (s * 17) % (h * 0.45);
    ctx.beginPath();
    ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. THÂN THẦN HÌNH TỐI THƯỢNG VŨ TRỤ
  const bodyGrad = ctx.createLinearGradient(0, -h * 0.25, 0, h * 0.3);
  bodyGrad.addColorStop(0, '#ffffff');
  bodyGrad.addColorStop(0.4, '#e0e7ff');
  bodyGrad.addColorStop(0.85, '#312e81');
  bodyGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.32, -h * 0.25, w * 0.64, h * 0.55, [16, 16, 10, 10]);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 4. VƯƠNG MIỆN SÁNG THẾ 7 NGUYÊN TỐ LƠ LỬNG
  const headY = -h * 0.35;

  ctx.save();
  ctx.fillStyle = '#fde047';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 20;

  // Hào quang vương miện
  ctx.beginPath();
  ctx.ellipse(0, headY - 18, 26, 8, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 7 Viên ngọc nguyên tố phát sáng trên miện
  const elemColors = ['#f43f5e', '#f97316', '#fde047', '#4ade80', '#38bdf8', '#6366f1', '#c084fc'];
  for (let e = 0; e < 7; e++) {
    const ang = (e * Math.PI) / 3.5;
    const ex = Math.cos(ang) * 26;
    const ey = headY - 18 + Math.sin(ang) * 8;
    ctx.fillStyle = elemColors[e];
    ctx.beginPath();
    ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Hộp sọ thần hình
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(0, headY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Mắt hố sao rực sáng vũ trụ
  ctx.save();
  ctx.fillStyle = '#fde047';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, headY - 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. HAI BÀN TAY NÂNG CÁC TINH CẦU MINI XOAY QUANH QUỸ ĐẠO
  const drawOrbittingPlanet = (px, py, color, rotAng) => {
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Vành đai hành tinh
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 4, rotAng, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  drawOrbittingPlanet(-w * 0.38, headY + 25, '#38bdf8', time * 3);
  drawOrbittingPlanet(w * 0.38, headY + 25, '#f43f5e', -time * 3);

  // 6. VFX TINH CẦU TẬN THẾ SUPERNOVA HOẶC BÃỎ SẤM NGUYÊN THỦY
  if (isSlashing || isCasting) {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 30;
    ctx.lineWidth = 6;

    // Sóng chấn động Sáng Thế
    ctx.beginPath();
    ctx.arc(0, 0, 85, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

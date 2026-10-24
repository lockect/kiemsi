/**
 * ============================================================================
 * MONSTERS/VOIDDEVOURER.JS - KẺ NUỐT KHÔNG GIAN (MÀN 9: KHE NỨT HỖN MANG)
 * ============================================================================
 * Thiết kế: Miệng giếng đen xoáy nuốt chửng ánh sáng, răng nanh xoáy ốc,
 * xúc tu bóng tối vặn xoắn, tạo lực hút trọng lực kéo người chơi vào tâm.
 * ============================================================================
 */

function drawVoidDevourer(ctx, e, worldTime) {
  const w = e.w || 52;
  const h = e.h || 52;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isPulling = (e.pullTimer || 0) > 0;
  const rotSpin = time * 2.5;

  ctx.save();

  // 1. CÁC XÚC TU BÓNG TỐI VẶN XOẮN XUNG QUANH (TENTACLES)
  ctx.save();
  ctx.strokeStyle = '#3b0764';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  for (let t = 0; t < 6; t++) {
    const tAngle = (t * Math.PI) / 3 + Math.sin(time * 3 + t) * 0.2;
    const tx = Math.cos(tAngle) * (w * 0.4);
    const ty = Math.sin(tAngle) * (h * 0.4);
    const tWave = Math.sin(time * 6 + t) * 12;

    ctx.beginPath();
    ctx.moveTo(tx * 0.6, ty * 0.6);
    ctx.quadraticCurveTo(tx * 1.3 + tWave, ty * 1.3 - tWave, tx * 1.6, ty * 1.6);
    ctx.stroke();
  }
  ctx.restore();

  // 2. VÒNG HÀO QUANG HƯ KHÔNG CO THẮT NGOÀI CÙNG
  ctx.save();
  const pulseR = (w * 0.45) + (isPulling ? Math.sin(time * 14) * 4 : Math.sin(time * 4) * 2);
  const outerGrad = ctx.createRadialGradient(0, 0, pulseR * 0.5, 0, 0, pulseR * 1.2);
  outerGrad.addColorStop(0, '#581c87');
  outerGrad.addColorStop(0.6, '#3b0764');
  outerGrad.addColorStop(1, 'rgba(9, 5, 20, 0)');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(0, 0, pulseR * 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. VÀNH RĂNG NANH XOÁY ỐC HƯ KHÔNG
  ctx.save();
  ctx.rotate(rotSpin);
  ctx.fillStyle = '#f5d0fe';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 8;
  const teethCount = 8;
  for (let k = 0; k < teethCount; k++) {
    ctx.rotate((Math.PI * 2) / teethCount);
    ctx.beginPath();
    ctx.moveTo(pulseR * 0.6, -3);
    ctx.lineTo(pulseR * 0.95, 0); // Răng nhọn hướng vào tâm
    ctx.lineTo(pulseR * 0.6, 3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 4. LỖ ĐEN VŨ TRỤ Ở TÂM NUỐT CHỬNG MỌI ÁNH SÁNG
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, 0, pulseR * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Điểm kỳ dị phát quang trắng ở chính tâm
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
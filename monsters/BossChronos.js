/**
 * ============================================================================
 * MONSTERS/BOSSCHRONOS.JS - HỖN MANG CHRONOS (ABYSSAL PARADOX - BOSS MÀN 9)
 * ============================================================================
 * Đồ họa: Thực thể bóng tối vô định hình đa diện, liên tục co giãn biến dạng,
 * con mắt xoáy ốc thôi miên thời gian, 6 xúc tu bóng tối quất nứt không gian.
 * ============================================================================
 */

function drawBossChronosMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 130;
  const h = b.h || 140;
  const time = worldTime || anim;
  const rot = time * 2;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isCasting = (b.castTimer || 0) > 0;

  ctx.save();

  if (isSlashing) ctx.rotate(0.15);
  if (isCasting) ctx.rotate(-0.25);

  // 1. VỰNG HÀO QUANG LỖ ĐEN HỔN MANG SỤP ĐỔ (PHASE 2 / CASTING)
  if (isP2 || isCasting) {
    ctx.save();
    const auraGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, w * 0.95);
    auraGrad.addColorStop(0, 'rgba(192, 132, 252, 0.55)');
    auraGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.25)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.95, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#c084fc';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 3;
    ctx.strokeRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);
    ctx.restore();
  }

  // 2. 6 XÚC TU BÓNG TỐI QUẤT XÉ KHÔNG GIAN (SPACE TENTACLES)
  ctx.save();
  ctx.strokeStyle = '#3b0764';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 16;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  for (let t = 0; t < 6; t++) {
    const ang = (t * Math.PI) / 3 + time * 3;
    const len = 55 + Math.sin(time * 6 + t) * 12;
    const tx = Math.cos(ang) * len;
    const ty = Math.sin(ang) * len;

    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * 15, Math.sin(ang) * 15);
    ctx.quadraticCurveTo(Math.cos(ang + 0.5) * (len * 0.6), Math.sin(ang + 0.5) * (len * 0.6), tx, ty);
    ctx.stroke();

    // Mảnh vỡ lập phương trôi ở ngọn xúc tu
    ctx.fillStyle = '#10b981';
    ctx.fillRect(tx - 3, ty - 3, 6, 6);
  }
  ctx.restore();

  // 3. CÁC MẢNH GƯƠNG VỠ THỜI GIAN ĐA DIỆN XOAY TRÒN (FRACTAL MIRROR FRAMES)
  ctx.save();
  ctx.rotate(rot);
  ctx.strokeStyle = '#c084fc';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 18;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-w * 0.45, -h * 0.45, w * 0.9, h * 0.9);

  ctx.rotate(-rot * 2.2);
  ctx.strokeStyle = '#10b981';
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 2;
  ctx.strokeRect(-w * 0.32, -h * 0.32, w * 0.64, h * 0.64);
  ctx.restore();

  // 4. LÕI THÂN THỂ VÔ ĐỊNH HÌNH LỖ ĐEN
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 5. CON MẮT XOÁY ỐC THỜI GIAN THÔI MIÊN TẠI TÂM (TIME EYE)
  ctx.save();
  ctx.fillStyle = isP2 ? '#f43f5e' : '#c084fc';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // Xoáy ốc đồng tử
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let r = 0; r < Math.PI * 4; r += 0.2) {
    const rx = Math.cos(r + time * 6) * (r * 1.2);
    const ry = Math.sin(r + time * 6) * (r * 1.2);
    if (r === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  }
  ctx.stroke();
  ctx.restore();

  // 6. VFX ĐẢO NGƯỢC TRỌNG LỰC HOẶC HỐ ĐEN NUỐT CHỬNG
  if (isSlashing || isCasting) {
    ctx.save();
    ctx.strokeStyle = '#10b981';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 4;

    // Vệt rách thực tại xanh ngọc
    ctx.beginPath();
    ctx.arc(0, 0, 75, -1.2, 1.2);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * ============================================================================
 * MONSTERS/BOSSYMIR.JS - BĂNG THẦN YMIR (GOLIATH BĂNG CỔ ĐẠI - BOSS MÀN 5)
 * ============================================================================
 * Đồ họa: Cự nhân đá băng khổng lồ, râu tóc tuyết, ngực mang lõi Băng Tinh,
 * tay vung Đại Chùy Băng Gai (Frost Morningstar) nện sàn bão tuyết.
 * ĐẶC BIỆT: Khi HP <= 35%, kích hoạt AURA BĂNG HỘ THỂ miễn 70% sát thương.
 * ============================================================================
 */

function drawBossYmirMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 130;
  const h = b.h || 150;
  const time = worldTime || anim;
  const breathe = Math.sin(time * 3) * 3;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isCasting = (b.castTimer || 0) > 0;
  const isFrostAura = (b.hp <= b.maxHp * 0.35); // Điều kiện kích hoạt Aura < 35% HP

  ctx.save();

  // 1. VỰNG HÀO QUANG BĂNG GIÁ BÃO TUYẾT (PHASE 2 / CASTING)
  if (isP2 || isCasting) {
    ctx.save();
    const auraGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, w * 0.9);
    auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    auraGrad.addColorStop(0.6, 'rgba(186, 230, 253, 0.2)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e0f2fe';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 1.1. HIỆU ỨNG AURA BĂNG HỘ THỂ BÁT GIÁC XOAY QUANH THÂN (HP <= 35%)
  // --------------------------------------------------------------------------
  if (isFrostAura) {
    ctx.save();
    const auraR = w * 0.85;
    const rotSpeed = time * 2.2;

    // Quầng sáng lam tuyết phát quang cực đại
    const shieldGrad = ctx.createRadialGradient(0, 0, auraR * 0.5, 0, 0, auraR * 1.15);
    shieldGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
    shieldGrad.addColorStop(0.7, 'rgba(224, 242, 254, 0.45)');
    shieldGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraR * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Vành khiên băng bát giác xoay tròn
    ctx.save();
    ctx.rotate(rotSpeed);
    ctx.strokeStyle = '#e0f2fe';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 22;
    ctx.lineWidth = 3.5;
    const sides = 8;
    ctx.beginPath();
    for (let s = 0; s < sides; s++) {
      const ang = (s * Math.PI * 2) / sides;
      const sx = Math.cos(ang) * auraR;
      const sy = Math.sin(ang) * auraR;
      if (s === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.stroke();

    // 8 Mảnh tinh thể băng nhọn xoay ở các đỉnh bát giác
    ctx.fillStyle = '#bae6fd';
    for (let s = 0; s < sides; s++) {
      const ang = (s * Math.PI * 2) / sides;
      const sx = Math.cos(ang) * auraR;
      const sy = Math.sin(ang) * auraR;
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Vành khiên phụ xoay ngược chiều tạo chiều sâu
    ctx.save();
    ctx.rotate(-rotSpeed * 1.4);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, auraR * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // 2. CHÂN CỰ NHÂN BĂNG VỮNG CHÃI
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-w * 0.35, h * 0.15, 26, h * 0.32);
  ctx.fillRect(w * 0.15, h * 0.15, 26, h * 0.32);
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-w * 0.35, h * 0.15, 26, h * 0.32);
  ctx.strokeRect(w * 0.15, h * 0.15, 26, h * 0.32);

  // 3. THÂN THỂ CỰ NHÂN ĐÚC TỪ CÁC KHỐI PHA LÊ BĂNG
  const bodyGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  bodyGrad.addColorStop(0, '#e0f2fe');
  bodyGrad.addColorStop(0.35, '#38bdf8');
  bodyGrad.addColorStop(0.75, '#0284c7');
  bodyGrad.addColorStop(1, '#082f49');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.45, -h * 0.28 + breathe, w * 0.9, h * 0.55, [18, 18, 12, 12]);
  ctx.fill();
  ctx.strokeStyle = isFrostAura ? '#38bdf8' : '#ffffff';
  ctx.lineWidth = isFrostAura ? 3.5 : 2;
  ctx.stroke();

  // Mạch vân băng phát sáng
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.2, -h * 0.1 + breathe);
  ctx.lineTo(0, h * 0.1 + breathe);
  ctx.lineTo(w * 0.2, -h * 0.1 + breathe);
  ctx.stroke();

  // LÕI BĂNG TINH PHÁT SÁNG TRƯỚC NGỰC (TỎA SÁNG CỰC ĐẠI KHI CÓ AURA)
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = isFrostAura ? 30 : 18;
  ctx.beginPath();
  ctx.arc(0, -h * 0.05 + breathe, isFrostAura ? 15 : 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, -h * 0.05 + breathe, isFrostAura ? 8 : 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. ĐẦU, RÂU TÓC TUYẾT & VƯƠNG MIỆN BĂNG
  const headY = -h * 0.35 + breathe;

  // Hộp sọ băng
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.arc(0, headY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Râu tuyết rủ dài
  ctx.fillStyle = '#f0f9ff';
  ctx.beginPath();
  ctx.moveTo(-16, headY + 5);
  ctx.quadraticCurveTo(0, headY + 45, 16, headY + 5);
  ctx.closePath();
  ctx.fill();

  // Vương miện chông băng nhọn hoắt
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.moveTo(-18, headY - 12);
  ctx.lineTo(-10, headY - 32);
  ctx.lineTo(-4, headY - 16);
  ctx.lineTo(0, headY - 38);
  ctx.lineTo(4, headY - 16);
  ctx.lineTo(10, headY - 32);
  ctx.lineTo(18, headY - 12);
  ctx.closePath();
  ctx.fill();

  // Đôi mắt tuyết phát quang
  ctx.fillStyle = isP2 ? '#ef4444' : '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.fillRect(-12, headY - 4, 8, 5);
  ctx.fillRect(4, headY - 4, 8, 5);

  // 5. TAY VUNG ĐẠI CHÙY BĂNG GAI (FROST MORNINGSTAR)
  ctx.save();
  ctx.translate(w * 0.32, -h * 0.1 + breathe);
  if (isSlashing) ctx.rotate(1.2);
  if (isCasting) ctx.rotate(-0.8);

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(15, -45);
  ctx.stroke();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(20, -55, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Gai băng nhọn đâm ra từ chùy
  ctx.fillStyle = '#e0f2fe';
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI) / 4;
    const gx = 20 + Math.cos(ang) * 24;
    const gy = -55 + Math.sin(ang) * 24;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(20 + Math.cos(ang) * 36, -55 + Math.sin(ang) * 36);
    ctx.lineTo(gx + 3, gy + 3);
    ctx.fill();
  }
  ctx.restore();

  // 6. VFX CHIÊU THỨC KHI TẤN CÔNG
  if (isSlashing || isCasting) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#bae6fd';
    ctx.shadowBlur = 22;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(w * 0.4, 0, 65, -0.8, 0.8);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
/**
 * ============================================================================
 * MONSTERS/DARKKNIGHT.JS - KỴ SĨ BÓNG ĐÊM HỘ PHÁP CƠ BẮP (DREADKNIGHT HD)
 * ============================================================================
 * Thiết kế:
 * - Vóc dáng hộ pháp chữ V, cơ ngực & cơ bụng đúc nổi trên giáp phiến hắc thiết.
 * - Cầu vai gai khổng lồ, bắp tay cuồn cuộn gân guốc bọc giáp hộ vệ.
 * - Máu nhiều, chịu đòn tốt. Khi áp sát vung Đại Cự Kiếm giáng đòn uy lực!
 * ============================================================================
 */

function drawDarkKnight(ctx, e, worldTime) {
  const w = e.w || 44;
  const h = e.h || 64;
  const anim = e.animTime || 0;
  const walkBob = Math.sin(anim * 4) * 2;
  const capeWave = Math.sin((worldTime || anim) * 6) * 4;
  const isSlashing = (e.slashTimer || 0) > 0 || (e.meleeTimer || 0) > 0;

  ctx.save();

  // 1. BÓNG ĐỔ HỘ PHÁP DƯỚI CHÂN
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.46, w * 0.55, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. ÁO CHOÀNG ĐỎ MÁU RÁCH TẢ TƠI BAY PHÍA SAU
  ctx.save();
  const capeGrad = ctx.createLinearGradient(-10, -h * 0.2, -w * 0.8, h * 0.45);
  capeGrad.addColorStop(0, '#991b1b');
  capeGrad.addColorStop(0.5, '#450a0a');
  capeGrad.addColorStop(1, '#1c1917');
  ctx.fillStyle = capeGrad;

  ctx.beginPath();
  ctx.moveTo(-10, -h * 0.22 + walkBob);
  ctx.quadraticCurveTo(-w * 0.65, 0, -w * 0.85 - capeWave, h * 0.38 + walkBob);
  ctx.lineTo(-w * 0.5, h * 0.44 + walkBob);
  ctx.lineTo(-w * 0.25, h * 0.2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 3. ĐÔI CHÂN HỘ PHÁP & GIÁP ỦNG SẮT NẶNG NỀ (GREAVES & SABATONS)
  const drawLeg = (lx, ly, offset, isFar) => {
    ctx.save();
    // Bắp đùi bọc giáp phiến dày
    const legGrad = ctx.createLinearGradient(lx, ly, lx + 14, ly + h * 0.35);
    legGrad.addColorStop(0, isFar ? '#090d16' : '#1e293b');
    legGrad.addColorStop(1, '#020617');
    ctx.fillStyle = legGrad;

    ctx.beginPath();
    ctx.roundRect(lx + offset * 0.5, ly, 13, h * 0.34, [4, 4, 2, 2]);
    ctx.fill();

    // Giáp bảo hộ đầu gối gai nhọn
    ctx.fillStyle = isFar ? '#1e293b' : '#334155';
    ctx.beginPath();
    ctx.moveTo(lx + offset * 0.5 - 2, ly + 6);
    ctx.lineTo(lx + offset * 0.5 + 7, ly + 2);
    ctx.lineTo(lx + offset * 0.5 + 15, ly + 6);
    ctx.lineTo(lx + offset * 0.5 + 7, ly + 12);
    ctx.closePath();
    ctx.fill();

    // Ủng sắt nhọn tiếp đất
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lx + offset * 0.5 - 2, ly + h * 0.34 - 5, 16, 5);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(lx + offset * 0.5 - 2, ly + h * 0.34 - 5, 16, 5);
    ctx.restore();
  };

  drawLeg(-15, h * 0.1, -walkBob, true);  // Chân sau
  drawLeg(2, h * 0.1, walkBob, false);    // Chân trước

  // 4. THÂN HÌNH CHỮ V HỘ PHÁP & GIÁP ĐÚC CƠ BẮP (MUSCLE CUIRASS)
  ctx.save();
  const chestY = -h * 0.28 + walkBob;

  // Lớp giáp hắc thiết chữ V
  const armorGrad = ctx.createLinearGradient(0, chestY, 0, chestY + h * 0.42);
  armorGrad.addColorStop(0, '#475569');
  armorGrad.addColorStop(0.3, '#1e293b');
  armorGrad.addColorStop(0.75, '#0f172a');
  armorGrad.addColorStop(1, '#020617');
  ctx.fillStyle = armorGrad;

  ctx.beginPath();
  ctx.moveTo(-16, chestY);
  ctx.lineTo(16, chestY);
  ctx.lineTo(11, chestY + h * 0.35);
  ctx.lineTo(0, chestY + h * 0.42); // Đáy nhọn chữ V
  ctx.lineTo(-11, chestY + h * 0.35);
  ctx.closePath();
  ctx.fill();

  // Viền thép bảo vệ
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // ĐƯỜNG NÉT ĐÚC KHỐI CƠ NGỰC & CƠ BỤNG VẠM VỠ TRÊN GIÁP
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  // Khối cơ ngực vạm vỡ bên trái & phải
  ctx.beginPath();
  ctx.arc(-6, chestY + 8, 5, 0.2, Math.PI * 0.8);
  ctx.arc(6, chestY + 8, 5, Math.PI * 0.8, Math.PI * 0.8);
  ctx.stroke();

  // Khối múi cơ bụng rắn rỏi
  ctx.beginPath();
  ctx.moveTo(0, chestY + 12);
  ctx.lineTo(0, chestY + 22);
  ctx.moveTo(-4, chestY + 16);
  ctx.lineTo(4, chestY + 16);
  ctx.stroke();

  // Lõi ấn ký huyết ngọc phát sáng giữa ngực
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(0, chestY + 7, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Đai thắt lưng chiến binh da nẹp kim loại
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-10, chestY + h * 0.32, 20, 4);
  ctx.fillStyle = '#78716c';
  ctx.fillRect(-3, chestY + h * 0.31, 6, 6);
  ctx.restore();

  // 5. GIÁP VAI GAI NHỌN KHỔNG LỒ (HEAVY PAULDRONS)
  const drawPauldron = (px, py, isLeft) => {
    ctx.save();
    const pGrad = ctx.createRadialGradient(px, py - 2, 2, px, py, 11);
    pGrad.addColorStop(0, '#64748b');
    pGrad.addColorStop(0.6, '#1e293b');
    pGrad.addColorStop(1, '#090514');
    ctx.fillStyle = pGrad;

    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(px - 5, py);
    ctx.lineTo(px + (isLeft ? -7 : 7), py - 14);
    ctx.lineTo(px + 5, py);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  drawPauldron(-17, chestY + 3, true);
  drawPauldron(17, chestY + 3, false);

  // 6. MŨ TRỤ HIỆP SĨ GOTHIC & CẶP SỪNG QUỶ SẮC NHỌN (HELMET & HORNS)
  ctx.save();
  const headY = -h * 0.38 + walkBob;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(-9, headY - 4, 18, 17, 4);
  ctx.fill();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(-8, headY + 2);
  ctx.quadraticCurveTo(-18, headY - 8, -16, headY - 18);
  ctx.lineTo(-6, headY - 2);
  ctx.moveTo(8, headY + 2);
  ctx.quadraticCurveTo(18, headY - 8, 16, headY - 18);
  ctx.lineTo(6, headY - 2);
  ctx.fill();

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1;
  ctx.stroke();

  // KHE MẮT CHỮ THẬP PHÁT SÁNG ĐỎ RỰC LỬA
  ctx.save();
  ctx.fillStyle = '#fca5a5';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.fillRect(-1, headY + 2, 10, 3);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(9, headY + 3.5);
  ctx.lineTo(19, headY + 1.5);
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  // 7. CÁNH TAY CƠ BẮP & THANH ĐẠI CỰ KIẾM KHỔNG LỒ (COLOSSAL GREATSWORD)
  ctx.save();
  ctx.translate(18, chestY + 10);

  if (isSlashing) {
    ctx.rotate(1.35); // Giáng đại cự kiếm từ trên xuống cực mạnh
  } else {
    ctx.rotate(0.22); // Vác cự kiếm chéo góc uy dũng
  }

  // Chuôi kiếm quấn da nâu
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-3, 8, 6, 18);

  // Đốc kiếm chữ thập mạ kim loại có ngạnh
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-12, 6, 24, 5);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-12, 6, 24, 5);

  // LƯỠI ĐẠI KIẾM TO BẢN KHỔNG LỒ RỰC LỬA
  ctx.save();
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = isSlashing ? 22 : 14;

  const swordGrad = ctx.createLinearGradient(-8, 6, 8, -52);
  swordGrad.addColorStop(0, '#1e293b');
  swordGrad.addColorStop(0.4, '#475569');
  swordGrad.addColorStop(0.85, '#cbd5e1');
  swordGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = swordGrad;

  ctx.beginPath();
  ctx.moveTo(-8, 6);
  ctx.lineTo(-8, -42);
  ctx.lineTo(0, -56);
  ctx.lineTo(8, -42);
  ctx.lineTo(8, 6);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(0, -42);
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // Hoàn thành vẽ kiếm & tay

  // VỆT HÀO QUANG VUNG CHÉM ĐẠI KIẾM NẶNG
  if (isSlashing) {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(10, 0, 52, -1.1, 0.9);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

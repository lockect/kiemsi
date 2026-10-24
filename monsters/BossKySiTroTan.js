/**
 * ============================================================================
 * MONSTERS/BOSSKYSITROTAN.JS - KỴ SĨ TRO TÀN (ASHEN KNIGHT - BOSS MÀN 2)
 * ============================================================================
 * Thiết kế: Hộp sọ xương nứt magma, tóc bạc dài xõa lưng, phóng sét plasma,
 * dựng Khiên Hắc Thiết cản sát thương và vung Đại Kiếm Địa Chấn Nham Thạch.
 * ============================================================================
 */

function drawBossKySiTroTanMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w;
  const h = b.h;
  const moving = Math.abs(b.vx || 0) > 10;
  const walkBob = Math.sin(anim * 5.5) * (moving ? 3.5 : 1);
  const breathe = Math.sin(worldTime * 4) * 2;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isSmashing = (b.castTimer || 0) > 0;
  const isShielding = (b.shieldTimer || 0) > 0;

  ctx.save();

  // 1. TIA SÉT PLASMA PHÓNG QUANH THÂN
  ctx.save();
  ctx.strokeStyle = isP2 ? '#ffffff' : '#fef08a';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 1.6;

  const t = Math.floor(worldTime * 18);
  const sparkPoints = [
    { x: -w * 0.35, y: -h * 0.42 + (t % 4) * 3 },
    { x: w * 0.32,  y: -h * 0.36 + ((t + 2) % 5) * 4 },
    { x: -w * 0.42, y: h * 0.05 + ((t + 1) % 4) * 3 },
    { x: w * 0.42,  y: h * 0.15 - ((t + 3) % 5) * 2 }
  ];

  sparkPoints.forEach((pt, i) => {
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x + (i % 2 === 0 ? 6 : -6), pt.y + 6);
    ctx.lineTo(pt.x + (i % 2 === 0 ? -5 : 5), pt.y + 12);
    ctx.lineTo(pt.x + (i % 2 === 0 ? 4 : -4), pt.y + 18);
    ctx.stroke();
  });
  ctx.restore();

  // 2. MÁI TÓC BẠCH KIM DÀI XÕA XUỐNG TẬN EO
  ctx.save();
  const hairWave = Math.sin(worldTime * 6) * 4;
  const headY = -h * 0.42 + breathe;

  const hairGrad = ctx.createLinearGradient(0, headY, 0, headY + h * 0.58);
  hairGrad.addColorStop(0, '#ffffff');
  hairGrad.addColorStop(0.35, '#e2e8f0');
  hairGrad.addColorStop(0.7, '#94a3b8');
  hairGrad.addColorStop(1, '#475569');
  ctx.fillStyle = hairGrad;

  ctx.beginPath();
  ctx.moveTo(-14, headY + 6);
  ctx.quadraticCurveTo(-w * 0.45, headY + 24, -w * 0.4 - hairWave, headY + h * 0.55);
  ctx.lineTo(-w * 0.22, headY + h * 0.48);
  ctx.lineTo(-4, headY + h * 0.56 + hairWave);
  ctx.lineTo(8, headY + h * 0.46);
  ctx.quadraticCurveTo(w * 0.36, headY + 24, 14, headY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. ÁO CHOÀNG TRO TÀN RÁCH TẢ TƠI
  ctx.save();
  const capeWave = Math.sin(worldTime * 8) * 6;
  const capeGrad = ctx.createLinearGradient(-16, 0, -w / 2 - 38, h / 2);
  capeGrad.addColorStop(0, '#7f1d1d');
  capeGrad.addColorStop(0.45, '#451a03');
  capeGrad.addColorStop(1, '#1c1917');
  ctx.fillStyle = capeGrad;

  ctx.beginPath();
  ctx.moveTo(-16, -h / 3 + breathe);
  ctx.quadraticCurveTo(-w / 2 - 12, h / 6, -w / 2 - 38 - (moving ? 12 : 2), h / 2 - 4 + walkBob + capeWave);
  ctx.lineTo(-w / 3, h / 3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(-w / 2 - 18, h / 4 + walkBob + Math.sin(worldTime * 6) * 4, 2, 0, Math.PI * 2);
  ctx.arc(-w / 2 - 28, h / 3 + walkBob - Math.cos(worldTime * 6) * 4, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. CHÂN GIÁP HẮC THIẾT & KHỚP GỐI MAGMA
  const legGrad = ctx.createLinearGradient(0, h / 4, 0, h / 2);
  legGrad.addColorStop(0, '#292524');
  legGrad.addColorStop(0.7, '#1c1917');
  legGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = legGrad;

  ctx.beginPath();
  ctx.roundRect(-w / 4, h / 4 + walkBob, 16, h / 4 - walkBob, [4, 4, 2, 2]);
  ctx.roundRect(w / 8, h / 4 - walkBob, 16, h / 4 + walkBob, [4, 4, 2, 2]);
  ctx.fill();

  ctx.save();
  ctx.fillStyle = isP2 ? '#fef08a' : '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 10;
  ctx.fillRect(-w / 4, h / 3, 16, 2.5);
  ctx.fillRect(w / 8, h / 3, 16, 2.5);
  ctx.fillRect(-w / 4, h / 2 - 6, 16, 2);
  ctx.fillRect(w / 8, h / 2 - 6, 16, 2);
  ctx.restore();

  // 5. GIÁP NGỰC ĐÁ MAGMA CHỮ V
  ctx.save();
  const plateGrad = ctx.createLinearGradient(0, -h / 3, 0, h / 4);
  plateGrad.addColorStop(0, '#57534e');
  plateGrad.addColorStop(0.35, '#292524');
  plateGrad.addColorStop(0.75, '#1c1917');
  plateGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = plateGrad;

  ctx.beginPath();
  ctx.roundRect(-w / 3, -h / 3 + breathe, w * 0.68, h * 0.58, 8);
  ctx.fill();
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Mạch dung nham chữ V
  ctx.save();
  ctx.strokeStyle = isP2 ? '#fef08a' : '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = isP2 ? 20 : 12;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, -h / 6 + breathe);
  ctx.lineTo(-2, 4 + breathe);
  ctx.lineTo(8, -h / 8 + breathe);
  ctx.lineTo(16, 6 + breathe);
  ctx.stroke();
  ctx.restore();

  // Cầu vai gai
  const drawPauldron = (px, py) => {
    ctx.save();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(px - 6, py - 4);
    ctx.lineTo(px, py - 18);
    ctx.lineTo(px + 6, py - 4);
    ctx.fill();
    ctx.restore();
  };
  drawPauldron(-w / 3, -h / 3 + breathe + 4);
  drawPauldron(w / 3, -h / 3 + breathe + 4);
  ctx.restore();

  // 6. ĐẦU HỘP SỌ XƯƠNG (SKULL HEAD)
  ctx.save();
  const skullGrad = ctx.createLinearGradient(0, headY - 18, 0, headY + 14);
  skullGrad.addColorStop(0, '#ffffff');
  skullGrad.addColorStop(0.4, '#e2e8f0');
  skullGrad.addColorStop(0.8, '#cbd5e1');
  skullGrad.addColorStop(1, '#64748b');
  ctx.fillStyle = skullGrad;

  ctx.beginPath();
  ctx.arc(0, headY, 13, Math.PI * 0.8, Math.PI * 0.2, false);
  ctx.lineTo(9, headY + 8);
  ctx.lineTo(6, headY + 16);
  ctx.lineTo(-6, headY + 16);
  ctx.lineTo(-9, headY + 8);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // Hốc mắt rực lửa dung nham
  ctx.save();
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.ellipse(-5, headY + 4, 3.8, 4.5, -0.15, 0, Math.PI * 2);
  ctx.ellipse(5, headY + 4, 3.8, 4.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isP2 ? '#ffffff' : '#fef08a';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = isP2 ? 18 : 12;
  ctx.beginPath();
  ctx.arc(-4.5, headY + 4, 2, 0, Math.PI * 2);
  ctx.arc(4.5, headY + 4, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(7, headY + 4);
  ctx.lineTo(18, headY + 1);
  ctx.stroke();
  ctx.restore();

  // Hàm răng xương sọ
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#090514';
  ctx.lineWidth = 1;
  for (let tooth = -2; tooth <= 2; tooth++) {
    const tx = tooth * 2.8;
    ctx.fillRect(tx - 1, headY + 13, 2, 4);
    ctx.strokeRect(tx - 1, headY + 13, 2, 4);
  }
  ctx.restore();

  // 7. KHIÊN HẮC THIẾT
  ctx.save();
  const shieldX = isShielding ? 18 : 6;
  const shieldY = -2 + breathe;
  ctx.translate(shieldX, shieldY);

  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.moveTo(-10, -28);
  ctx.lineTo(14, -28);
  ctx.lineTo(16, 18);
  ctx.lineTo(2, 32);
  ctx.lineTo(-10, 18);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (isShielding) {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(8, 0, 36, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // 8. ĐẠI CỰ KIẾM NHAM THẠCH
  ctx.save();
  let swordAngle = 0.22;
  let swordY = -4 + breathe;

  if (isSmashing) {
    swordAngle = 1.45;
    swordY = 16;
  } else if (isSlashing) {
    swordAngle = -1.25 + (0.35 - (b.meleeTimer || 0)) * 7.2;
  }

  ctx.translate(w / 3 + 8, swordY);
  ctx.rotate(swordAngle);

  ctx.fillStyle = '#451a03';
  ctx.fillRect(-3, 14, 6, 22);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-15, 12, 30, 6);

  ctx.save();
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = isP2 ? 28 : 16;
  const bladeGrad = ctx.createLinearGradient(-9, 12, 9, -56);
  bladeGrad.addColorStop(0, '#7c2d12');
  bladeGrad.addColorStop(0.35, '#ea580c');
  bladeGrad.addColorStop(0.8, '#f97316');
  bladeGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = bladeGrad;

  ctx.beginPath();
  ctx.moveTo(-9, 12);
  ctx.lineTo(-9, -48);
  ctx.lineTo(0, -64);
  ctx.lineTo(9, -48);
  ctx.lineTo(9, 12);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(0, -48);
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  // 9. VỆT CUNG LỬA KHI CHÉM
  if (isSlashing) {
    ctx.save();
    ctx.strokeStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(w / 4, 0, 78, -1.0, 0.95);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

const drawKySiTroTanMaster = drawBossKySiTroTanMaster;
/**
 * ============================================================================
 * MONSTERS/BOSSCHUATEBONGDEM.JS - CHÚA TỂ BÓNG ĐÊM (DARK LORD - BOSS MÀN 3)
 * ============================================================================
 * Thiết kế: Đại Pháp Vương Hư Không thuần ma pháp, bay lơ lửng, pháp trận xoay,
 * triệu hồi thiên lôi, bắn chùm bão lửa hắc viêm và nâng Quả Cầu Lửa Tối.
 * ============================================================================
 */

function drawBossChuaTeBongDemMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 85;
  const h = b.h || 135;
  const breathe = Math.sin(worldTime * 4) * 3;
  const floatBob = Math.sin(worldTime * 3) * 6;
  const isCasting = (b.castTimer || 0) > 0;
  const rotCircle = (worldTime || 0) * 1.5;

  ctx.save();
  ctx.translate(0, floatBob);

  // 1. PHÁP TRẬN HƯ KHÔNG XOAY TRÒN SAU LƯNG
  ctx.save();
  ctx.translate(0, -h * 0.15);
  ctx.rotate(rotCircle);

  ctx.strokeStyle = isP2 ? 'rgba(244, 63, 94, 0.65)' : 'rgba(192, 38, 211, 0.65)';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 18;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(232, 121, 249, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.45, 0, Math.PI * 2);
  for (let k = 0; k < 8; k++) {
    const rad = (k * Math.PI) / 4;
    ctx.moveTo(Math.cos(rad) * (w * 0.45), Math.sin(rad) * (w * 0.45));
    ctx.lineTo(Math.cos(rad) * (w * 0.65), Math.sin(rad) * (w * 0.65));
  }
  ctx.stroke();
  ctx.restore();

  // 2. TÀ ÁO CHOÀNG BÓNG TỐI
  ctx.save();
  const capeWave = Math.sin(worldTime * 7) * 8;
  const capeGrad = ctx.createLinearGradient(-15, -h / 3, -w - 30, h / 2);
  capeGrad.addColorStop(0, '#3b0764');
  capeGrad.addColorStop(0.5, '#1e1b4b');
  capeGrad.addColorStop(1, '#090514');
  ctx.fillStyle = capeGrad;

  ctx.beginPath();
  ctx.moveTo(-15, -h * 0.35 + breathe);
  ctx.quadraticCurveTo(-w * 0.75, 0, -w - 24, h * 0.42 + capeWave);
  ctx.lineTo(-w * 0.55, h * 0.48);
  ctx.lineTo(-w * 0.2, h * 0.25);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 3. ĐÔI CHÂN GIÁP BAY LƠ LỬNG
  const legGrad = ctx.createLinearGradient(0, h * 0.05, 0, h * 0.45);
  legGrad.addColorStop(0, '#1e1b4b');
  legGrad.addColorStop(0.7, '#0f172a');
  legGrad.addColorStop(1, '#020617');
  ctx.fillStyle = legGrad;

  ctx.beginPath();
  ctx.roundRect(-18, h * 0.1, 14, h * 0.34, [4, 4, 3, 3]);
  ctx.roundRect(4, h * 0.08, 14, h * 0.36, [4, 4, 3, 3]);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-18, h * 0.22, 14, 3);
  ctx.fillRect(4, h * 0.2, 14, 3);

  // 4. THÂN GIÁP PHÁP VƯƠNG VIỀN VÀNG & LÕI HƯ KHÔNG
  ctx.save();
  const chestY = -h * 0.34 + breathe;
  const plateGrad = ctx.createLinearGradient(0, chestY, 0, chestY + h * 0.45);
  plateGrad.addColorStop(0, '#312e81');
  plateGrad.addColorStop(0.35, '#1e1b4b');
  plateGrad.addColorStop(0.8, '#090514');
  ctx.fillStyle = plateGrad;

  ctx.beginPath();
  ctx.moveTo(-18, chestY);
  ctx.lineTo(18, chestY);
  ctx.lineTo(13, chestY + h * 0.36);
  ctx.lineTo(0, chestY + h * 0.45);
  ctx.lineTo(-13, chestY + h * 0.36);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Lõi ấn ký Hư Không
  ctx.save();
  ctx.fillStyle = isP2 ? '#f43f5e' : '#c026d3';
  ctx.shadowColor = isP2 ? '#f43f5e' : '#e879f9';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, chestY + 16, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1.5, chestY + 14.5, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // 5. MẶT ANIME TUẤN TÚ, TÓC BẠCH KIM & VƯƠNG MIỆN GAI
  ctx.save();
  const headY = -h * 0.44 + breathe;

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-7, headY + 10);
  ctx.lineTo(7, headY + 10);
  ctx.lineTo(0, headY + 20);
  ctx.closePath();
  ctx.fill();

  const hairGrad = ctx.createLinearGradient(0, headY - 10, 0, headY + 36);
  hairGrad.addColorStop(0, '#ffffff');
  hairGrad.addColorStop(0.5, '#e2e8f0');
  hairGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = hairGrad;

  ctx.beginPath();
  ctx.moveTo(-12, headY + 4);
  ctx.quadraticCurveTo(-24, headY + 18, -18, headY + 38);
  ctx.lineTo(-10, headY + 20);
  ctx.lineTo(-4, headY + 30);
  ctx.lineTo(0, headY + 18);
  ctx.lineTo(4, headY + 30);
  ctx.lineTo(10, headY + 20);
  ctx.quadraticCurveTo(24, headY + 18, 18, headY + 38);
  ctx.lineTo(12, headY + 4);
  ctx.closePath();
  ctx.fill();

  // Vương miện
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.moveTo(-13, headY + 4);
  ctx.lineTo(-14, headY - 12);
  ctx.lineTo(-6, headY - 2);
  ctx.lineTo(0, headY - 20);
  ctx.lineTo(6, headY - 2);
  ctx.lineTo(14, headY - 12);
  ctx.lineTo(13, headY + 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // Đôi mắt tím Hư Không
  ctx.save();
  ctx.fillStyle = isP2 ? '#f43f5e' : '#e879f9';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 16;
  ctx.fillRect(-1, headY + 9, 14, 3.5);

  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(11, headY + 10);
  ctx.quadraticCurveTo(22, headY + 6, 32, headY + 2);
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  // 6. TAY PHÓNG SÉT & NÂNG QUẢ CẦU HẮC ÁM (DARK FIRE ORB)
  ctx.save();
  const handY = -h * 0.16 + breathe;

  // Tay trái tụ sét
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-16, -h * 0.28 + breathe);
  ctx.lineTo(-28, handY);
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle = '#f5d0fe';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 1.8;
  const sparkT = (worldTime || 0) * 16;
  ctx.beginPath();
  ctx.moveTo(-28, handY);
  ctx.lineTo(-35, handY - 8 + (sparkT % 4) * 2);
  ctx.lineTo(-42, handY + 4);
  ctx.stroke();
  ctx.restore();

  // Tay phải nâng Cầu Hắc Ám
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(16, -h * 0.28 + breathe);
  ctx.lineTo(28, handY);
  ctx.stroke();

  ctx.save();
  const orbR = isCasting ? 16 + Math.sin(worldTime * 14) * 3 : 11;
  ctx.translate(34, handY - 2);
  ctx.shadowColor = '#d946ef';
  ctx.shadowBlur = isP2 ? 28 : 18;

  const fireGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, orbR);
  fireGrad.addColorStop(0, '#ffffff');
  fireGrad.addColorStop(0.4, '#e879f9');
  fireGrad.addColorStop(0.8, '#c026d3');
  fireGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
  ctx.fillStyle = fireGrad;
  ctx.beginPath();
  ctx.arc(0, 0, orbR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  ctx.restore();
}

const drawChuaTeBongDemMaster = drawBossChuaTeBongDemMaster;
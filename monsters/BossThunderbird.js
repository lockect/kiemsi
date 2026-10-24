/**
 * ============================================================================
 * MONSTERS/BOSSTHUNDERBIRD.JS - LÔI PHƯỢNG HOÀNG (THUNDER PHOENIX - BOSS MÀN 6)
 * ============================================================================
 * Thiết kế đồ họa bám sát ảnh concept art:
 * - Thân bọc giáp vảy lam ngọc hoàng gia pha vàng kim chói lọi.
 * - Sải cánh sấm sét đa tầng xanh - vàng phát quang plasma.
 * - Bờm lông tia chớp vươn cao, mắt lôi điện sắc lạnh, móng vuốt đại bàng.
 * - Đuôi dài 3 dải lôi lụa phát sáng uốn lượn.
 * - Hoạt ảnh Kén Lôi Cầu Tái Sinh khi hồi sinh 100% HP.
 * ============================================================================
 */

function drawBossThunderbirdMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w || 150;
  const h = b.h || 120;
  const time = worldTime || anim;
  const flap = Math.sin(time * 14) * 18;
  const isSlashing = (b.meleeTimer || 0) > 0;
  const isCasting = (b.castTimer || 0) > 0;
  const isRebirthing = !!b.isRebirthing;

  ctx.save();

  // --------------------------------------------------------------------------
  // 1. HIỆU ỨNG KÉN SẤM TÁI SINH (PHOENIX REBIRTH COCOON)
  // --------------------------------------------------------------------------
  if (isRebirthing) {
    const eggR = w * 0.55 + Math.sin(time * 20) * 8;
    ctx.save();

    // Vầng hào quang sấm sét nổ tung
    const eggGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, eggR * 1.3);
    eggGrad.addColorStop(0, '#ffffff');
    eggGrad.addColorStop(0.3, '#fde047');
    eggGrad.addColorStop(0.7, '#0284c7');
    eggGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = eggGrad;
    ctx.beginPath();
    ctx.arc(0, 0, eggR * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Vỏ kén năng lượng lôi điện
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 30;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, eggR, 0, Math.PI * 2);
    ctx.stroke();

    // Các tia sét giật bao bọc xung quanh kén
    for (let s = 0; s < 8; s++) {
      const ang = (s * Math.PI) / 4 + time * 12;
      const sr = eggR + Math.sin(time * 30 + s) * 18;
      ctx.strokeStyle = (s % 2 === 0) ? '#38bdf8' : '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * (eggR * 0.7), Math.sin(ang) * (eggR * 0.7));
      ctx.lineTo(Math.cos(ang) * sr, Math.sin(ang) * sr);
      ctx.lineTo(Math.cos(ang + 0.3) * (sr + 14), Math.sin(ang + 0.3) * (sr + 14));
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
    return; // Khi đang biến thành kén tái sinh, chỉ vẽ kén lôi điện
  }

  // Góc nghiêng khi tấn công hoặc bổ nhào
  if (isSlashing) ctx.rotate(0.35);
  if (isCasting) ctx.rotate(-0.2);

  // --------------------------------------------------------------------------
  // 2. MẠNG LƯỚI TIA SÉT PLASMA CHẰNG CHỊT TỰ DO
  // --------------------------------------------------------------------------
  ctx.save();
  ctx.strokeStyle = isP2 ? '#ffffff' : '#fef08a';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 18;
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const ang = time * 7 + i * 1.3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * 35, Math.sin(ang) * 25);
    ctx.lineTo(Math.cos(ang) * 90, Math.sin(ang) * 60);
    ctx.lineTo(Math.cos(ang + 0.2) * 110, Math.sin(ang + 0.2) * 75);
    ctx.stroke();
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // 3. ĐUÔI LỤA PHƯỢNG HOÀNG 3 DẢI XANH LAM - VÀNG KIM UỐN LƯỢN
  // --------------------------------------------------------------------------
  ctx.save();
  for (let d = -1; d <= 1; d++) {
    const tailWave = Math.sin(time * 7 + d * 1.5) * 16;
    const tailGrad = ctx.createLinearGradient(-w * 0.2, 0, -w - 40, d * 30);
    tailGrad.addColorStop(0, '#0284c7');
    tailGrad.addColorStop(0.5, '#38bdf8');
    tailGrad.addColorStop(0.85, '#fde047');
    tailGrad.addColorStop(1, '#ffffff');

    ctx.strokeStyle = tailGrad;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 4.5 - Math.abs(d);
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(-w * 0.2, d * 8);
    ctx.quadraticCurveTo(-w * 0.6, d * 22 + tailWave, -w - 35, d * 28 - tailWave);
    ctx.stroke();

    // Mũi lông vũ nhọn hình ngọn lửa ở chóp đuôi
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-w - 35, d * 28 - tailWave, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // 4. SẢI CÁNH LÔI PHƯỢNG HOÀNG ĐA TẦNG (XANH LAM HOÀNG GIA - VÀNG KIM)
  // --------------------------------------------------------------------------
  const drawPhoenixWing = (isLeft) => {
    ctx.save();
    const sign = isLeft ? -1 : 1;
    ctx.scale(sign, 1);

    // Lớp 1: Khung cánh lông vũ xanh lam hoàng gia phía sau
    const blueWingGrad = ctx.createLinearGradient(0, -h * 0.5, w * 0.7, h * 0.4);
    blueWingGrad.addColorStop(0, '#0f172a');
    blueWingGrad.addColorStop(0.35, '#1e3a8a');
    blueWingGrad.addColorStop(0.7, '#0284c7');
    blueWingGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = blueWingGrad;

    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(w * 0.55, -h * 0.85 - flap);
    ctx.lineTo(w * 0.88, -h * 0.4 - flap * 0.6);
    ctx.lineTo(w * 0.65, h * 0.2);
    ctx.lineTo(15, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lớp 2: Các phiến lông vũ vàng kim rực lửa xếp tầng bên trong (như ảnh)
    const goldFeatherGrad = ctx.createLinearGradient(15, -10, w * 0.8, -h * 0.5);
    goldFeatherGrad.addColorStop(0, '#b45309');
    goldFeatherGrad.addColorStop(0.4, '#f59e0b');
    goldFeatherGrad.addColorStop(0.8, '#fde047');
    goldFeatherGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = goldFeatherGrad;

    // Hàng lông vũ nhọn xòe rộng
    for (let f = 0; f < 5; f++) {
      const fx = 20 + f * 18;
      const fy = -h * 0.25 - flap * (0.3 + f * 0.15);
      ctx.beginPath();
      ctx.moveTo(fx, fy + 20);
      ctx.lineTo(fx + 22, fy - 18);
      ctx.lineTo(fx + 28, fy + 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Lớp 3: Đường gân cánh sấm sét phát quang rực rỡ
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(w * 0.52, -h * 0.7 - flap * 0.9);
    ctx.lineTo(w * 0.82, -h * 0.35 - flap * 0.5);
    ctx.stroke();

    ctx.restore();
  };

  drawPhoenixWing(true);  // Cánh trái
  drawPhoenixWing(false); // Cánh phải

  // --------------------------------------------------------------------------
  // 5. THÂN MÌNH BỌC GIÁP VẢY LAM NGỌC KIM CƯƠNG (DIAMOND FEATHER SCALES)
  // --------------------------------------------------------------------------
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -h * 0.35, 0, h * 0.4);
  bodyGrad.addColorStop(0, '#fde047');
  bodyGrad.addColorStop(0.3, '#0284c7');
  bodyGrad.addColorStop(0.7, '#1e3a8a');
  bodyGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bodyGrad;

  // Thân hình chim ưng hộ pháp
  ctx.beginPath();
  ctx.ellipse(0, 2, 22, 34, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Các phiến vảy ngực hình thoi lấp lánh như ngọc lam bọc chỉ vàng
  ctx.fillStyle = '#fde047';
  for (let r = -2; r <= 2; r++) {
    const rx = r * 6;
    const ry = r * 4;
    ctx.beginPath();
    ctx.moveTo(rx, ry - 6);
    ctx.lineTo(rx + 4, ry);
    ctx.lineTo(rx, ry + 6);
    ctx.lineTo(rx - 4, ry);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // 6. ĐÔI CHÂN ĐẠI BÀNG VỚI MÓNG VUỐT VÀNG KIM BẮT LÓA
  // --------------------------------------------------------------------------
  ctx.save();
  const drawClaw = (cx, cy) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 4, cy, 8, 14);

    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      ctx.moveTo(cx + c * 5 - 2, cy + 12);
      ctx.lineTo(cx + c * 6, cy + 22);
      ctx.lineTo(cx + c * 5 + 3, cy + 12);
      ctx.fill();
    }
  };
  drawClaw(-10, 24);
  drawClaw(10, 24);
  ctx.restore();

  // --------------------------------------------------------------------------
  // 7. ĐẦU PHƯỢNG HOÀNG, BỜM LÔNG TIA SÉT CAO VÚT & MỎ QUẶP HOÀNG KIM
  // --------------------------------------------------------------------------
  ctx.save();
  const headX = w * 0.28;
  const headY = -h * 0.28;

  // BỜM TÓC LÔNG VŨ SẤM SÉT VƯƠN CAO KIÊU HÃNH (XANH & VÀNG NHƯ ẢNH)
  const crestGrad = ctx.createLinearGradient(headX, headY, headX - 35, headY - 55);
  crestGrad.addColorStop(0, '#0284c7');
  crestGrad.addColorStop(0.5, '#38bdf8');
  crestGrad.addColorStop(0.85, '#fde047');
  crestGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = crestGrad;

  ctx.beginPath();
  ctx.moveTo(headX - 6, headY - 8);
  ctx.quadraticCurveTo(headX - 18, headY - 32, headX - 38, headY - 58);
  ctx.lineTo(headX - 16, headY - 26);
  ctx.quadraticCurveTo(headX - 28, headY - 45, headX - 48, headY - 68);
  ctx.lineTo(headX - 8, headY - 20);
  ctx.quadraticCurveTo(headX - 15, headY - 35, headX - 28, headY - 52);
  ctx.lineTo(headX + 4, headY - 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Hộp sọ đầu chim hoàng gia
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.arc(headX, headY, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Mỏ đại bàng vàng quặp sắc ngọt nẹp viền đen
  const beakGrad = ctx.createLinearGradient(headX + 6, headY - 4, headX + 32, headY + 8);
  beakGrad.addColorStop(0, '#fef08a');
  beakGrad.addColorStop(0.5, '#facc15');
  beakGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = beakGrad;

  ctx.beginPath();
  ctx.moveTo(headX + 6, headY - 6);
  ctx.lineTo(headX + 32, headY + 3);  // Chóp mỏ quặp
  ctx.lineTo(headX + 22, headY + 15);
  ctx.lineTo(headX + 6, headY + 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // ĐÔI MẮT ANIME LÔI ĐIỆN XANH LAM BĂNG SẮC SẢO
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(headX + 4, headY - 4, 11, 6);

  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(headX + 9, headY - 1, 3.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(headX + 10, headY - 2, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Tia lửa điện lóa dài sau đuôi mắt
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(headX + 4, headY - 1);
  ctx.lineTo(headX - 14, headY - 5);
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // Kết thúc vẽ đầu chim

  // --------------------------------------------------------------------------
  // 8. VFX ĐÒN ĐÁNH CẮT CÁNH / BỔ NHÀO SẤM SÉT
  // --------------------------------------------------------------------------
  if (isSlashing || isCasting) {
    ctx.save();
    ctx.strokeStyle = '#fde047';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 25;
    ctx.lineWidth = 5;

    // Vệt cắt lôi điện bán nguyệt vàng - xanh
    ctx.beginPath();
    ctx.arc(w * 0.45, 0, 75, -1.0, 1.0);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

const drawThunderbirdMaster = drawBossThunderbirdMaster;
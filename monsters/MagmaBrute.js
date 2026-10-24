/**
 * ============================================================================
 * MONSTERS/MAGMABRUTE.JS - QUỶ LỬA NHAM THẠCH (MÀN 7: LÒ LUYỆN DUNG NHAM)
 * ============================================================================
 * Thiết kế: Hộ pháp đá bazan đen nứt nẻ rỉ dung nham sôi sùng sục,
 * hai vai gai đá núi lửa, nắm đấm khổng lồ nện sàn, nổ tự sát khi chết.
 * ============================================================================
 */

function drawMagmaBrute(ctx, e, worldTime) {
  const w = e.w || 56;
  const h = e.h || 62;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isSlamming = (e.slamTimer || 0) > 0;
  const walkBob = Math.sin(anim * 4) * 2.5;

  ctx.save();

  // 1. BÓNG ĐỔ DƯỚI NỀN ĐÁ NÓNG
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.46, w * 0.55, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. CHÂN ĐÁ BAZAN NGẮN VỮNG CHÃI
  const legGrad = ctx.createLinearGradient(0, h * 0.15, 0, h * 0.45);
  legGrad.addColorStop(0, '#292524');
  legGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = legGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.32, h * 0.15, 14, h * 0.32, 4);
  ctx.roundRect(w * 0.12, h * 0.15, 14, h * 0.32, 4);
  ctx.fill();
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Khe nứt rỉ dung nham ở đầu gối
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-w * 0.32, h * 0.28, 14, 2.5);
  ctx.fillRect(w * 0.12, h * 0.28, 14, 2.5);

  // 3. THÂN HÌNH HỘ PHÁP ĐÁ NÚI LỬA NỨT NẺ
  const bodyGrad = ctx.createLinearGradient(0, -h * 0.25, 0, h * 0.3);
  bodyGrad.addColorStop(0, '#44403c');
  bodyGrad.addColorStop(0.5, '#1c1917');
  bodyGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.4, -h * 0.25 + walkBob, w * 0.8, h * 0.52, [16, 16, 10, 10]);
  ctx.fill();

  // Mạch dung nham sôi sùng sục chữ V phát quang trên ngực
  ctx.save();
  ctx.strokeStyle = '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-12, -h * 0.15 + walkBob);
  ctx.lineTo(0, 4 + walkBob);
  ctx.lineTo(12, -h * 0.12 + walkBob);
  ctx.lineTo(4, 16 + walkBob);
  ctx.stroke();
  ctx.restore();

  // GAI ĐÁ NÚI LỬA TRÊN CẦU VAI
  const drawShoulderSpikes = (sx, sy, isLeft) => {
    ctx.save();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (isLeft ? -14 : 14), sy - 20);
    ctx.lineTo(sx + (isLeft ? -6 : 6), sy + 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };
  drawShoulderSpikes(-w * 0.35, -h * 0.22 + walkBob, true);
  drawShoulderSpikes(w * 0.35, -h * 0.22 + walkBob, false);

  // 4. ĐẦU ĐÁ BỐC CHÁY LỬA VĨNH CỬU
  const headY = -h * 0.32 + walkBob;

  // Khối đầu bazan
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(0, headY, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Ngọn lửa rực cháy trên đỉnh đầu
  ctx.save();
  ctx.fillStyle = '#f97316';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 14;
  const flameH = 14 + Math.sin(time * 10) * 5;
  ctx.beginPath();
  ctx.moveTo(-8, headY - 10);
  ctx.quadraticCurveTo(-2, headY - 10 - flameH * 0.6, 0, headY - 10 - flameH);
  ctx.quadraticCurveTo(2, headY - 10 - flameH * 0.6, 8, headY - 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, headY - 10 - flameH * 0.3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Đôi mắt dung nham vàng cam rực lửa
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 10;
  ctx.fillRect(-2, headY - 2, 5, 3.5);
  ctx.fillRect(5, headY - 2, 5, 3.5);
  ctx.restore();

  // 5. HAI CÁNH TAY ĐÁ KHỔNG LỒ & NẮM ĐẤM MAGMA
  const drawMagmaArm = (ax, ay, isLeft, isRaised) => {
    ctx.save();
    ctx.translate(ax, ay);
    if (isRaised) ctx.rotate(isLeft ? -1.6 : -1.3);

    // Bắp tay đá to bản
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.roundRect(-8, 0, 16, 26, 5);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Nắm đấm dung nham nứt nẻ
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(-12, 22, 24, 18, 5);
    ctx.fill();

    // Lõi nham thạch nóng chảy ở nắm đấm
    ctx.save();
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 12;
    ctx.fillRect(-8, 26, 16, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-4, 28, 8, 2.5);
    ctx.restore();

    ctx.restore();
  };

  if (isSlamming) {
    drawMagmaArm(-w * 0.25, headY + 8, true, true);
    drawMagmaArm(w * 0.22, headY + 8, false, true);
  } else {
    drawMagmaArm(-w * 0.32, -h * 0.08 + walkBob, true, false);
    drawMagmaArm(w * 0.18, -h * 0.08 + walkBob, false, false);
  }

  // 6. HIỆU ỨNG ĐỊA CHẤN LỬA KHI NỆN ĐẤT
  if (isSlamming) {
    ctx.save();
    ctx.strokeStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, h * 0.45, 30, 0, Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, h * 0.45, 18, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
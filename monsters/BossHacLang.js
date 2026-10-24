/**
 * ============================================================================
 * MONSTERS/BOSSHACLANG.JS - HẮC LANG (SHADOW WOLF - BOSS MÀN 1)
 * ============================================================================
 * Thiết kế: Ma thú sói hắc ám khổng lồ, lông than chì, bờm gai rực lửa Crimson,
 * đuôi lửa bập bùng, vồ cào xé để lại vệt móng vuốt đỏ và gầm sóng âm đẩy lùi.
 * ============================================================================
 */

function drawBossHacLangMaster(ctx, b, anim, isP2, worldTime) {
  const w = b.w;
  const h = b.h;
  const running = Math.abs(b.vx || 0) > 15;
  const legCycle = Math.sin(anim * 9) * (running ? 14 : 2);
  const legCycleRear = Math.cos(anim * 9) * (running ? 12 : 1.5);
  const breathe = Math.sin(worldTime * 4) * 2.5;
  const isCasting = (b.castTimer || 0) > 0;
  const isSlashing = (b.meleeTimer || 0) > 0;

  ctx.save();

  // 1. ĐUÔI LỬA CRIMSON KHỔNG LỒ UỐN LƯỢN
  ctx.save();
  const tailWave = Math.sin(worldTime * 6) * 6;
  const tailX = -w / 2 + 10;
  const tailY = h / 6;

  ctx.fillStyle = isP2 ? '#ef4444' : '#991b1b';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.quadraticCurveTo(tailX - 35, tailY - 30 + tailWave, tailX - 60, tailY + 5 - tailWave);
  ctx.quadraticCurveTo(tailX - 30, tailY + 36, tailX + 8, tailY + 22);
  ctx.closePath();
  ctx.fill();

  const tailCoreGrad = ctx.createLinearGradient(tailX, tailY, tailX - 50, tailY);
  tailCoreGrad.addColorStop(0, '#090d16');
  tailCoreGrad.addColorStop(0.6, '#1e293b');
  tailCoreGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = tailCoreGrad;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY + 4);
  ctx.quadraticCurveTo(tailX - 28, tailY - 20 + tailWave, tailX - 48, tailY + 6 - tailWave);
  ctx.quadraticCurveTo(tailX - 22, tailY + 26, tailX + 6, tailY + 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. CHÂN SAU & MÓNG VUỐT BÁM ĐẤT
  const drawRearLeg = (lx, ly, offset, isFar) => {
    ctx.save();
    ctx.fillStyle = isFar ? '#090d16' : '#0f172a';
    ctx.beginPath();
    ctx.ellipse(lx + 4, ly + 6, 15, 20, 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isFar ? '#090d16' : '#1e293b';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lx + 4, ly + 14);
    ctx.lineTo(lx - 4 + offset, ly + 28);
    ctx.lineTo(lx + 6 + offset, h / 2 - 4);
    ctx.stroke();

    if (!isFar) {
      ctx.strokeStyle = isP2 ? '#ef4444' : '#b91c1c';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(lx + 2, ly + 2);
      ctx.lineTo(lx + 8, ly + 12);
      ctx.lineTo(lx + 3, ly + 22);
      ctx.stroke();
    }

    ctx.fillStyle = '#dc2626';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(lx + offset + i * 5, h / 2 - 4);
      ctx.lineTo(lx + offset + 3 + i * 5, h / 2);
      ctx.lineTo(lx + offset + 6 + i * 5, h / 2 - 4);
      ctx.fill();
    }
    ctx.restore();
  };

  drawRearLeg(-w / 3 - 6, h / 10, -legCycleRear * 0.4, true);
  drawRearLeg(-w / 3 + 4, h / 10, legCycleRear * 0.5, false);

  // 3. THÂN HÌNH CƠ BẮP & BỜM GAI RỰC LỬA
  ctx.save();
  const bodyY = isCasting ? -h / 4 + 8 : -h / 4 + breathe;
  const bodyGrad = ctx.createLinearGradient(-w / 2, bodyY, w / 2, bodyY + h / 2);
  bodyGrad.addColorStop(0, '#090d16');
  bodyGrad.addColorStop(0.35, '#0f172a');
  bodyGrad.addColorStop(0.7, '#1e293b');
  bodyGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w / 2 + 6, bodyY, w - 16, h * 0.55, [18, 14, 22, 16]);
  ctx.fill();

  // Bờm gai nhọn
  ctx.save();
  ctx.fillStyle = isP2 ? '#b91c1c' : '#7f1d1d';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = isCasting || isP2 ? 18 : 8;
  const spikeHeight = isCasting ? 26 : 18;
  ctx.beginPath();
  for (let x = -w / 3 - 2; x <= w / 5; x += 11) {
    ctx.moveTo(x, bodyY + 3);
    ctx.lineTo(x + 5, bodyY - spikeHeight + Math.sin(x + worldTime * 8) * 3);
    ctx.lineTo(x + 11, bodyY + 4);
  }
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();

  // 4. CHÂN TRƯỚC VỒ MỒI
  const drawFrontLeg = (lx, ly, isAttack, isFar) => {
    ctx.save();
    ctx.fillStyle = isFar ? '#090d16' : '#1e293b';
    ctx.beginPath();
    ctx.ellipse(lx + 6, ly + 4, 14, 18, -0.2, 0, Math.PI * 2);
    ctx.fill();

    const footX = isAttack ? lx + 22 : lx + legCycle;
    const footY = isAttack ? ly + 6 : h / 2 - 4;

    ctx.strokeStyle = isFar ? '#090d16' : '#0f172a';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lx + 6, ly + 12);
    ctx.lineTo(footX + 4, footY);
    ctx.stroke();

    if (!isFar) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(lx + 4, ly + 14);
      ctx.lineTo(footX + 2, footY - 8);
      ctx.stroke();
    }

    ctx.fillStyle = '#dc2626';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(footX + i * 5, footY);
      ctx.lineTo(footX + 4 + i * 5, footY + 5);
      ctx.lineTo(footX + 7 + i * 5, footY);
      ctx.fill();
    }
    ctx.restore();
  };

  drawFrontLeg(w / 6 - 8, h / 8, false, true);
  drawFrontLeg(w / 6 + 4, h / 8, isSlashing, false);

  // 5. ĐẦU SÓI, HÁ MÕM GẦM SÓNG ÂM
  const headX = w / 4;
  const headY = bodyY + (isCasting ? -6 : 1);
  const jawOpen = isCasting ? 22 : (isSlashing ? 14 : 4);

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(headX, headY - 6);
  ctx.lineTo(w / 2 + 24, headY + 2);
  ctx.lineTo(w / 2 + 16, headY + 12 + jawOpen);
  ctx.lineTo(headX - 6, headY + 22);
  ctx.closePath();
  ctx.fill();

  if (jawOpen > 5) {
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(w / 2 - 2, headY + 5, 18, jawOpen * 0.7);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 1, headY + 5);
    ctx.lineTo(w / 2 + 5, headY + 14 + jawOpen * 0.3);
    ctx.lineTo(w / 2 + 9, headY + 5);
    ctx.fill();
  }

  // Mắt đỏ phát sáng rực lửa ma mị
  ctx.save();
  ctx.fillStyle = isP2 ? '#fef08a' : '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = isP2 ? 22 : 14;
  ctx.beginPath();
  ctx.ellipse(headX + 9, headY + 2, 7, 4, 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(headX + 14, headY + 2);
  ctx.quadraticCurveTo(headX + 26, headY - 2, headX + 38, headY - 8);
  ctx.stroke();
  ctx.restore();

  // 6. HIỆU ỨNG VỆT CÀO KHI TẤN CÔNG CẬN CHIẾN
  if (isSlashing) {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 18;
    ctx.lineWidth = 4;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(w / 2 + 10, -22 + k * 16);
      ctx.lineTo(w / 2 + 52, -8 + k * 16);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
  ctx.restore();
}

const drawHacLangMaster = drawBossHacLangMaster;
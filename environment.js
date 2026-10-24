/**
 * ============================================================================
 * ENVIRONMENT.JS - BỘ RENDER MÔI TRƯỜNG & HÀNG CÂY ĐẶC THÙ CHO 10 MÀN CHƠI
 * ============================================================================
 */

// ============================================================================
// 1. KẾT XUẤT CẢNH NỀN, THIÊN THỂ, PARALLAX & HÀNG CÂY TRUNG CẢNH
// ============================================================================
function drawBackground(ctx, STAGES, stageIndex, cameraX, W, H, worldTime = 0) {
  if (!ctx) return;
  const stage = (STAGES && STAGES[stageIndex]) ? STAGES[stageIndex] : {
    sky1: '#0f172a', sky2: '#1e293b', far: '#1e3a5f', near: '#0d5257', ground: '#14532d'
  };
  const time = worldTime || (Date.now() * 0.001);
  const sIdx = stageIndex % 10;

  // --------------------------------------------------------------------------
  // 1.1. BẦU TRỜI CHUYỂN SẮC GRADIENT
  // --------------------------------------------------------------------------
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  switch (sIdx) {
    case 0: skyGrad.addColorStop(0, '#0a1128'); skyGrad.addColorStop(0.65, '#1c2d5a'); skyGrad.addColorStop(1, '#112240'); break;
    case 1: skyGrad.addColorStop(0, '#451a03'); skyGrad.addColorStop(0.55, '#7c2d12'); skyGrad.addColorStop(1, '#c2410c'); break;
    case 2: skyGrad.addColorStop(0, '#1a0b2e'); skyGrad.addColorStop(0.6, '#2e1065'); skyGrad.addColorStop(1, '#3b0764'); break;
    case 3: skyGrad.addColorStop(0, '#090514'); skyGrad.addColorStop(0.5, '#180728'); skyGrad.addColorStop(1, '#2e0854'); break;
    case 4: skyGrad.addColorStop(0, '#082f49'); skyGrad.addColorStop(0.6, '#0369a1'); skyGrad.addColorStop(1, '#e0f2fe'); break;
    case 5: skyGrad.addColorStop(0, '#0f172a'); skyGrad.addColorStop(0.65, '#1e293b'); skyGrad.addColorStop(1, '#334155'); break;
    case 6: skyGrad.addColorStop(0, '#2e0a0a'); skyGrad.addColorStop(0.5, '#7f1d1d'); skyGrad.addColorStop(1, '#ea580c'); break;
    case 7: skyGrad.addColorStop(0, '#0284c7'); skyGrad.addColorStop(0.6, '#38bdf8'); skyGrad.addColorStop(1, '#fef08a'); break;
    case 8: skyGrad.addColorStop(0, '#050505'); skyGrad.addColorStop(0.5, '#1e1b4b'); skyGrad.addColorStop(1, '#3b0764'); break;
    case 9: skyGrad.addColorStop(0, '#020617'); skyGrad.addColorStop(0.5, '#0f172a'); skyGrad.addColorStop(1, '#312e81'); break;
    default: skyGrad.addColorStop(0, stage.sky1); skyGrad.addColorStop(1, stage.sky2); break;
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // --------------------------------------------------------------------------
  // 1.2. THIÊN THỂ ĐẶC TRƯNG MỖI MÀN
  // --------------------------------------------------------------------------
  ctx.save();
  if (sIdx === 0) { // Trăng to Màn 1
    const mx = 1020 - cameraX * 0.03, my = 130, mr = 64;
    const g = ctx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 2.5);
    g.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(mx, my, mr * 2.5, 0, Math.PI * 2); ctx.fill();

    const mg = ctx.createRadialGradient(mx - 12, my - 12, 6, mx, my, mr);
    mg.addColorStop(0, '#ffffff'); mg.addColorStop(0.7, '#e0f2fe'); mg.addColorStop(1, '#bae6fd');
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
  } else if (sIdx === 1) { // Mặt trời lặn Màn 2
    const sx = 980 - cameraX * 0.03, sy = 180, sr = 75;
    const sg = ctx.createRadialGradient(sx, sy, sr * 0.4, sx, sy, sr * 2.8);
    sg.addColorStop(0, 'rgba(249, 115, 22, 0.55)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(sx, sy, sr * 2.8, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  } else if (sIdx === 4) { // Cực quang Màn 5
    for (let a = 0; a < 3; a++) {
      const ag = ctx.createLinearGradient(0, 0, W, 220);
      ag.addColorStop(0, 'rgba(56, 189, 248, 0)');
      ag.addColorStop(0.5, `rgba(74, 222, 128, ${0.15 + Math.sin(time + a) * 0.08})`);
      ag.addColorStop(1, 'rgba(192, 132, 252, 0)');
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.moveTo(0, 60 + a * 30);
      ctx.bezierCurveTo(W * 0.35, 120 + Math.sin(time * 1.5 + a) * 40, W * 0.65, 40 + Math.cos(time + a) * 35, W, 90 + a * 20);
      ctx.lineTo(W, 180 + a * 30);
      ctx.bezierCurveTo(W * 0.65, 140, W * 0.35, 190, 0, 150 + a * 30);
      ctx.closePath();
      ctx.fill();
    }
  } else if (sIdx === 5) { // Chớp sét Màn 6
    if (Math.sin(time * 5) > 0.96) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.fillRect(0, 0, W, H);
    }
  } else if (sIdx === 9) { // Ngân hà Màn 10
    const gg = ctx.createLinearGradient(0, 0, W, H * 0.6);
    gg.addColorStop(0, 'rgba(99, 102, 241, 0)');
    gg.addColorStop(0.5, 'rgba(236, 72, 153, 0.22)');
    gg.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = gg;
    ctx.beginPath(); ctx.ellipse(W / 2, 120, W * 0.6, 60, -0.25, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // 1.3. CẢNH XA PARALLAX (DÃY NÚI / PHẾ TÍCH / TÒA THÁP / ĐẢO BAY)
  // --------------------------------------------------------------------------
  const farSpacing = 280;
  const startFarX = cameraX * 0.14;
  const firstFar = Math.floor(startFarX / farSpacing) - 1;
  const farCount = Math.ceil(W / farSpacing) + 3;

  for (let k = 0; k < farCount; k++) {
    const fIdx = firstFar + k;
    const screenX = fIdx * farSpacing - startFarX;
    const peakY = 550 - (180 + Math.sin(fIdx * 2.3) * 45);

    ctx.save();
    if (sIdx === 2) { // Tháp Gothic Màn 3
      ctx.fillStyle = '#1e1138';
      ctx.beginPath();
      ctx.moveTo(screenX, 550); ctx.lineTo(screenX, peakY + 60);
      ctx.lineTo(screenX + 50, peakY); ctx.lineTo(screenX + 100, peakY + 60);
      ctx.lineTo(screenX + 100, 550); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#c084fc'; ctx.fillRect(screenX + 42, peakY + 35, 16, 26);
    } else if (sIdx === 7) { // Đảo bay Màn 8
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.roundRect(screenX, peakY + 80, 180, 50, [16, 16, 30, 30]); ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(screenX + 90, peakY + 80, 24, Math.PI, 0); ctx.fill();
    } else {
      const farGrad = ctx.createLinearGradient(screenX, peakY, screenX, 550);
      farGrad.addColorStop(0, stage.far || '#1e3a5f');
      farGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = farGrad;
      ctx.beginPath();
      ctx.moveTo(screenX - 40, 560); ctx.lineTo(screenX + 140, peakY); ctx.lineTo(screenX + 320, 560);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 1.4. CẢNH TRUNG PARALLAX: HÀNG CÂY 10 CHỦ ĐỀ RIÊNG BIỆT (KHÔNG GIẬT LAG)
  // --------------------------------------------------------------------------
  const midSpacing = 160;
  const startMidX = cameraX * 0.32;
  const firstMid = Math.floor(startMidX / midSpacing) - 2;
  const midCount = Math.ceil(W / midSpacing) + 4;

  for (let k = 0; k < midCount; k++) {
    const mIdx = firstMid + k;
    const screenX = mIdx * midSpacing - startMidX;
    drawStageTree(ctx, sIdx, screenX, mIdx, time, stage);
  }

  // --------------------------------------------------------------------------
  // 1.5. HỆ THỐNG SINH VẬT MÔI TRƯỜNG THEO TỪNG VÙNG ĐẤT
  // --------------------------------------------------------------------------
  ctx.save();
  if (sIdx === 2) { // Quạ bay Màn 3
    ctx.fillStyle = '#090514';
    for (let q = 0; q < 3; q++) {
      const qx = W - ((time * 35 + q * 40 + cameraX * 0.25) % (W + 200));
      const qy = 120 + q * 35 + Math.sin(time * 8 + q) * 12;
      const qWing = Math.sin(time * 16 + q) * 8;
      ctx.beginPath();
      ctx.moveTo(qx, qy); ctx.lineTo(qx - 10, qy + qWing); ctx.lineTo(qx - 5, qy);
      ctx.lineTo(qx + 8, qy); ctx.lineTo(qx + 14, qy + qWing); ctx.closePath(); ctx.fill();
    }
  } else if (sIdx === 3) { // Cò ma Màn 4
    ctx.strokeStyle = 'rgba(232, 121, 249, 0.75)'; ctx.lineWidth = 1.8;
    const hx = ((time * 22) % (W + 250)) - 100, hy = 160 + Math.sin(time * 2) * 25, hw = Math.sin(time * 4) * 14;
    ctx.beginPath();
    ctx.moveTo(hx - 22, hy + hw); ctx.quadraticCurveTo(hx - 10, hy - 4, hx, hy); ctx.quadraticCurveTo(hx + 10, hy - 4, hx + 22, hy + hw);
    ctx.stroke();
  } else if (sIdx === 4) { // Hươu tuyết Màn 5
    const deerX = 850 - ((cameraX * 0.15) % 1200), deerY = 480;
    if (deerX > -60 && deerX < W + 60) {
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath(); ctx.roundRect(deerX, deerY, 26, 16, 4); ctx.fill();
      ctx.fillRect(deerX + 2, deerY + 16, 3, 16); ctx.fillRect(deerX + 22, deerY + 16, 3, 16);
      ctx.beginPath(); ctx.arc(deerX + 26, deerY - 4, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(deerX + 26, deerY - 8); ctx.lineTo(deerX + 32, deerY - 20); ctx.stroke();
    }
  } else if (sIdx === 5) { // Đại bàng sấm Màn 6
    const ep = (time * 0.8) % (Math.PI * 2), ex = 550 + Math.cos(ep) * 140, ey = 140 + Math.sin(ep) * 35;
    ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.ellipse(ex, ey, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ex - 28, ey - 4); ctx.lineTo(ex, ey); ctx.lineTo(ex + 28, ey - 4); ctx.stroke();
  } else if (sIdx === 6) { // Cọp nham thạch Màn 7
    const tx = 720 - ((cameraX * 0.14) % 1400), ty = 490;
    if (tx > -80 && tx < W + 80) {
      ctx.fillStyle = '#1c1917';
      ctx.beginPath(); ctx.roundRect(tx, ty, 36, 18, 4); ctx.fill();
      ctx.fillRect(tx + 4, ty + 18, 5, 14); ctx.fillRect(tx + 27, ty + 18, 5, 14);
      ctx.fillRect(tx + 32, ty - 6, 12, 12);
      ctx.fillStyle = '#f97316'; ctx.fillRect(tx + 12, ty + 2, 3, 12); ctx.fillRect(tx + 40, ty - 2, 2, 2);
    }
  } else if (sIdx === 7) { // Hạc trắng Màn 8
    for (let c = 0; c < 2; c++) {
      const cx = ((time * 26 + c * 80) % (W + 200)) - 60, cy = 130 + c * 40 + Math.sin(time * 3 + c) * 14, cf = Math.sin(time * 5 + c) * 12;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(cx - 18, cy + cf); ctx.quadraticCurveTo(cx - 8, cy - 2, cx, cy); ctx.quadraticCurveTo(cx + 8, cy - 2, cx + 18, cy + cf); ctx.stroke();
    }
  } else if (sIdx === 8) { // Cá voi Hư Không Màn 9
    const wx = W - ((time * 14) % (W + 400)), wy = 150 + Math.sin(time * 0.8) * 30;
    ctx.fillStyle = 'rgba(192, 132, 252, 0.22)';
    ctx.beginPath(); ctx.ellipse(wx, wy, 90, 28, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(wx + 85, wy); ctx.lineTo(wx + 130, wy - 25); ctx.lineTo(wx + 115, wy); ctx.lineTo(wx + 130, wy + 25); ctx.closePath(); ctx.fill();
  } else if (sIdx === 9) { // Kỳ lân tinh vân Màn 10
    const kx = 600 - ((cameraX * 0.08) % 1500), ky = 360;
    if (kx > -80 && kx < W + 80) {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
      ctx.beginPath(); ctx.ellipse(kx, ky, 28, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(kx - 10, ky + 14, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // 1.6. HẠT BỤI MÔI TRƯỜNG ĐẶC TRƯNG
  // --------------------------------------------------------------------------
  ctx.save();
  if (sIdx === 0) { // Đom đóm Màn 1
    for (let f = 0; f < 16; f++) {
      const fx = (f * 95 + time * 16 * ((f % 2 === 0) ? 1 : -0.7) - cameraX * 0.15) % (W + 80);
      const fy = 320 + Math.sin(time * 2.2 + f * 5) * 40 + (f * 14) % 180;
      ctx.fillStyle = (f % 3 === 0) ? '#fde047' : '#38bdf8';
      ctx.beginPath(); ctx.arc(fx < 0 ? fx + W + 80 : fx, fy, 2, 0, Math.PI * 2); ctx.fill();
    }
  } else if (sIdx === 1 || sIdx === 6) { // Tàn tro than hồng Màn 2 & 7
    for (let e = 0; e < 18; e++) {
      const ex = (e * 80 + time * 20 - cameraX * 0.2) % (W + 50);
      const ey = 580 - ((time * 45 + e * 25) % 360);
      ctx.fillStyle = (e % 2 === 0) ? '#f97316' : '#ea580c';
      ctx.beginPath(); ctx.arc(ex, ey, 1.8, 0, Math.PI * 2); ctx.fill();
    }
  } else if (sIdx === 4) { // Tuyết rơi Màn 5
    for (let s = 0; s < 25; s++) {
      const sx = (s * 60 + time * 45 - cameraX * 0.3) % (W + 50);
      const sy = ((time * 70 + s * 30) % H);
      ctx.fillStyle = 'rgba(240, 249, 255, 0.8)';
      ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  } else if (sIdx === 7) { // Lông vũ Màn 8
    for (let l = 0; l < 8; l++) {
      const lx = (l * 180 + Math.sin(time + l) * 25) % W;
      const ly = ((time * 30 + l * 80) % H);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 6, ly + 10); ctx.stroke();
    }
  }
  ctx.restore();
}

// ============================================================================
// HÀM VẼ CHI TIẾT 10 LOẠI CÂY / THỰC VẬT ĐẶC THÙ CHO TỪNG MÀN CHƠI
// ============================================================================
function drawStageTree(ctx, sIdx, screenX, mIdx, time, stage) {
  const hVar = Math.sin(mIdx * 3.7) * 25;
  const mH = 175 + hVar;
  const topY = 600 - mH;
  const cx = screenX + 50;

  ctx.save();

  switch (sIdx) {
    // ------------------------------------------------------------------------
    // MÀN 1: CÂY ĐẠI THỤ RỪNG NGUYỆT QUANG (TÁN TRÒN XẾP TẦNG, RỄ GỒ GHỀ, NẤM DẠ QUANG)
    // ------------------------------------------------------------------------
    case 0: {
      // Thân gỗ cổ thụ to bản
      ctx.fillStyle = '#0a192f';
      ctx.beginPath();
      ctx.moveTo(cx - 16, 600);
      ctx.quadraticCurveTo(cx - 8, topY + 70, cx - 6, topY + 30);
      ctx.lineTo(cx + 6, topY + 30);
      ctx.quadraticCurveTo(cx + 8, topY + 70, cx + 16, 600);
      ctx.closePath();
      ctx.fill();

      // Tán lá tròn 3 tầng um tùm
      const foliageGrad = ctx.createLinearGradient(cx, topY - 10, cx, topY + 90);
      foliageGrad.addColorStop(0, '#10b981');
      foliageGrad.addColorStop(0.5, '#047857');
      foliageGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = foliageGrad;

      ctx.beginPath(); ctx.arc(cx, topY + 55, 42, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - 15, topY + 30, 32, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 15, topY + 30, 32, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx, topY, 26, 0, Math.PI * 2); ctx.fill();

      // Viền sáng ánh trăng mép trên
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, topY, 26, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke();

      // Nấm dạ quang dưới gốc cây
      if (mIdx % 2 === 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(cx - 16, 594, 4.5, Math.PI, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(cx + 14, 595, 3.5, Math.PI, Math.PI * 2); ctx.fill();
      }
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 2: CÂY TRO TÀN KHÔ CHÁY (ASHEN WITHERED TREE - THÂN NỨT DUNG NHAM, CÀNH KHẲNG KHIU)
    // ------------------------------------------------------------------------
    case 1: {
      ctx.strokeStyle = '#1c1917';
      ctx.fillStyle = '#1c1917';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      // Thân cây khô khẳng khiu uốn éo
      ctx.beginPath();
      ctx.moveTo(cx, 600);
      ctx.quadraticCurveTo(cx - 15, topY + 90, cx - 6, topY + 45);
      ctx.stroke();

      // Cành cây nhọn hoắt như móng vuốt quỷ
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(cx - 6, topY + 45);
      ctx.lineTo(cx - 38, topY + 15);
      ctx.lineTo(cx - 48, topY - 10);
      ctx.moveTo(cx - 6, topY + 45);
      ctx.lineTo(cx + 25, topY + 20);
      ctx.lineTo(cx + 38, topY - 5);
      ctx.stroke();

      // Các kẽ nứt nham thạch rực sáng cam đỏ trên thân
      ctx.strokeStyle = '#f97316';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 2, 590);
      ctx.lineTo(cx - 8, topY + 100);
      ctx.lineTo(cx - 4, topY + 60);
      ctx.stroke();

      // Đốm than hồng bốc khói ở ngọn cành
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(cx - 48, topY - 10, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 38, topY - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 3: CÂY BÁCH GOTHIC U ÁM (GOTHIC CYPRESS SPIRE - TÁN NHỌN HOẮT NHƯ ĐẦU GIÁO)
    // ------------------------------------------------------------------------
    case 2: {
      // Thân cây mảnh khảnh đen tuyền
      ctx.fillStyle = '#090514';
      ctx.fillRect(cx - 4, topY + 50, 8, mH - 50);

      // Tán lá hình chóp nhọn cao vút phân 3 tầng
      const gothicGrad = ctx.createLinearGradient(cx, topY - 20, cx, topY + 120);
      gothicGrad.addColorStop(0, '#581c87');
      gothicGrad.addColorStop(0.5, '#2e1065');
      gothicGrad.addColorStop(1, '#0f0a1c');
      ctx.fillStyle = gothicGrad;

      // Tầng dưới
      ctx.beginPath();
      ctx.moveTo(cx, topY + 20);
      ctx.lineTo(cx - 24, topY + 80);
      ctx.lineTo(cx + 24, topY + 80);
      ctx.closePath();
      ctx.fill();

      // Tầng giữa
      ctx.beginPath();
      ctx.moveTo(cx, topY - 10);
      ctx.lineTo(cx - 18, topY + 45);
      ctx.lineTo(cx + 18, topY + 45);
      ctx.closePath();
      ctx.fill();

      // Tầng ngọn nhọn hoắt
      ctx.beginPath();
      ctx.moveTo(cx, topY - 35);
      ctx.lineTo(cx - 12, topY + 10);
      ctx.lineTo(cx + 12, topY + 10);
      ctx.closePath();
      ctx.fill();

      // Viền dạ quang tím ma mị
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, topY - 35); ctx.lineTo(cx - 12, topY + 10);
      ctx.stroke();
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 4: CÂY THẠCH ANH HƯ KHÔNG (VOID CRYSTAL TREE - CÀNH TINH THỂ OBSIDIAN NHỌN)
    // ------------------------------------------------------------------------
    case 3: {
      ctx.save();
      // Khối tinh thể chính vươn thẳng
      const crystalGrad = ctx.createLinearGradient(cx - 10, topY - 20, cx + 10, 600);
      crystalGrad.addColorStop(0, '#f5d0fe');
      crystalGrad.addColorStop(0.3, '#c026d3');
      crystalGrad.addColorStop(0.7, '#3b0764');
      crystalGrad.addColorStop(1, '#090514');
      ctx.fillStyle = crystalGrad;

      // Trụ pha lê trung tâm
      ctx.beginPath();
      ctx.moveTo(cx, topY - 30);
      ctx.lineTo(cx + 9, topY + 40);
      ctx.lineTo(cx + 6, 600);
      ctx.lineTo(cx - 6, 600);
      ctx.lineTo(cx - 9, topY + 40);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e879f9'; ctx.lineWidth = 1.5; ctx.stroke();

      // Các nhánh tinh thể chĩa xiên 45 độ
      const drawSpire = (bx, by, ang, len) => {
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(ang);
        ctx.fillStyle = '#7e22ce';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(5, -len * 0.5); ctx.lineTo(0, -len); ctx.lineTo(-5, -len * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f5d0fe'; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      };

      drawSpire(cx - 6, topY + 60, -0.65, 42);
      drawSpire(cx + 6, topY + 40, 0.7, 48);
      drawSpire(cx - 4, topY + 15, -0.5, 32);
      ctx.restore();
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 5: CÂY THÔNG TUYẾT BẮC CỰC (GLACIAL FIR TREE - PHỦ TUYẾT DÀY & NHŨ BĂNG TRONG SUỐT)
    // ------------------------------------------------------------------------
    case 4: {
      // Thân thông sẫm màu phủ sương
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 5, topY + 60, 10, mH - 60);

      // Tán thông 3 tầng hình tháp phủ tuyết
      const drawPineTier = (py, width, hgt) => {
        // Tán lá xanh đen
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.moveTo(cx, py - hgt);
        ctx.lineTo(cx + width, py);
        ctx.lineTo(cx - width, py);
        ctx.closePath();
        ctx.fill();

        // Lớp tuyết trắng phủ trên sống tán
        ctx.fillStyle = '#f0f9ff';
        ctx.beginPath();
        ctx.moveTo(cx, py - hgt);
        ctx.lineTo(cx + width * 0.5, py - hgt * 0.4);
        ctx.lineTo(cx + width, py);
        ctx.lineTo(cx + width * 0.7, py + 3);
        ctx.lineTo(cx, py - hgt * 0.2);
        ctx.lineTo(cx - width * 0.7, py + 3);
        ctx.lineTo(cx - width, py);
        ctx.closePath();
        ctx.fill();

        // Nhũ băng rủ dưới mép tán
        ctx.fillStyle = '#bae6fd';
        for (let i = -width + 6; i < width - 6; i += 12) {
          ctx.beginPath();
          ctx.moveTo(cx + i, py);
          ctx.lineTo(cx + i + 3, py + 8);
          ctx.lineTo(cx + i + 6, py);
          ctx.fill();
        }
      };

      drawPineTier(topY + 90, 36, 45);
      drawPineTier(topY + 50, 28, 40);
      drawPineTier(topY + 15, 20, 35);
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 6: CÂY TÙNG PHONG BA VÁCH ĐÁ (THUNDER BONSAI PINE - THÂN VẶN XOẮN, TÁN LÁ NHẬN SÉT)
    // ------------------------------------------------------------------------
    case 5: {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';

      // Thân vặn xoắn gân guốc quằn quại
      ctx.beginPath();
      ctx.moveTo(cx, 600);
      ctx.quadraticCurveTo(cx + 25, topY + 100, cx - 10, topY + 50);
      ctx.stroke();

      // Cành gãy vì sét đánh
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 10, topY + 50);
      ctx.lineTo(cx - 36, topY + 30);
      ctx.moveTo(cx - 10, topY + 50);
      ctx.lineTo(cx + 28, topY + 25);
      ctx.stroke();

      // Tán lá kim dẹp phong cách bonsai
      ctx.fillStyle = '#0f766e';
      ctx.beginPath(); ctx.ellipse(cx - 36, topY + 28, 22, 9, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 28, topY + 23, 20, 8, 0.25, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx - 8, topY + 45, 18, 7, 0, 0, Math.PI * 2); ctx.fill();

      // Tia sét plasma giật li ti quanh cành
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - 36, topY + 20); ctx.lineTo(cx - 32, topY + 12); ctx.lineTo(cx - 40, topY + 8);
      ctx.stroke();
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 7: TRỤ ĐÁ BAZAN HỎA NGỤC (BASALT MAGMA SPIRE - CỘT ĐÁ ĐỐT LỤC GIÁC, ĐỈNH BỐC LỬA)
    // ------------------------------------------------------------------------
    case 6: {
      // Cột đá bazan đen phân đoạn
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - 14, topY + 20, 28, mH - 20);
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.strokeRect(cx - 14, topY + 20, 28, mH - 20);

      // Các khớp nối nứt nẻ nham thạch cam rực
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(cx - 14, topY + 60, 28, 4);
      ctx.fillRect(cx - 14, topY + 110, 28, 4);

      // Miệng vòm đá trên đỉnh chứa nham thạch sôi
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(cx - 20, topY + 20);
      ctx.lineTo(cx + 20, topY + 20);
      ctx.lineTo(cx + 14, topY + 36);
      ctx.lineTo(cx - 14, topY + 36);
      ctx.closePath();
      ctx.fill();

      // Ngọn lửa dung nham bốc cháy ngùn ngụt trên ngọn trụ
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#ea580c'; ctx.shadowBlur = 12;
      const flameH = 22 + Math.sin(time * 10 + mIdx) * 6;
      ctx.beginPath();
      ctx.moveTo(cx - 16, topY + 20);
      ctx.quadraticCurveTo(cx - 4, topY + 5, cx, topY + 20 - flameH);
      ctx.quadraticCurveTo(cx + 4, topY + 5, cx + 16, topY + 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.save();
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 8: CÂY SỰ SỐNG HOÀNG KIM (GOLDEN CELESTIAL TREE - GỖ TRẮNG CẨM THẠCH, LÁ VÀNG KIM)
    // ------------------------------------------------------------------------
    case 7: {
      // Thân cây cẩm thạch trắng mềm mại
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, 600);
      ctx.quadraticCurveTo(cx - 12, topY + 70, cx, topY + 30);
      ctx.stroke();

      // Tán lá vàng kim bồng bềnh như đám mây thần
      const goldGrad = ctx.createRadialGradient(cx, topY + 20, 10, cx, topY + 20, 48);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.6, '#facc15');
      goldGrad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = goldGrad;
      ctx.shadowColor = '#fde047'; ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(cx - 18, topY + 30, 24, 0, Math.PI * 2);
      ctx.arc(cx + 18, topY + 30, 24, 0, Math.PI * 2);
      ctx.arc(cx, topY + 10, 28, 0, Math.PI * 2);
      ctx.fill();

      // Các chuỗi hạt ánh sáng rủ xuống từ cành
      ctx.fillStyle = '#ffffff';
      for (let j = -2; j <= 2; j++) {
        const jx = cx + j * 12;
        const jy = topY + 45 + Math.sin(time * 3 + j) * 4;
        ctx.beginPath(); ctx.arc(jx, jy, 2.2, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 9: CÂY NGHỊCH LÝ THỜI GIAN (FRACTAL PARADOX TREE - THÂN GÃY KHÚC, LÁ LẬP PHƯƠNG XOAY)
    // ------------------------------------------------------------------------
    case 8: {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 4;

      // Thân cây gãy khúc ziczac phi thực tế
      ctx.beginPath();
      ctx.moveTo(cx, 600);
      ctx.lineTo(cx - 15, topY + 110);
      ctx.lineTo(cx + 20, topY + 60);
      ctx.lineTo(cx - 5, topY + 20);
      ctx.stroke();

      // Các khối lập phương ma trận trôi nổi xoay tròn thay cho lá
      const drawCube = (bx, by, size, rot) => {
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(rot);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      };

      drawCube(cx - 5, topY + 15, 20, time * 2);
      drawCube(cx - 28, topY + 40, 16, -time * 1.5);
      drawCube(cx + 26, topY + 35, 18, time * 1.8);
      break;
    }

    // ------------------------------------------------------------------------
    // MÀN 10: CÂY VŨ TRỤ KHỞI NGUYÊN (COSMIC WORLD TREE - PHA LÊ ÁNH BẠC, TÁN XOÁY NGÂN HÀ)
    // ------------------------------------------------------------------------
    case 9: {
      // Thân pha lê vũ trụ trong suốt phản chiếu ánh sao
      const cosmicTrunk = ctx.createLinearGradient(cx - 6, 0, cx + 6, 0);
      cosmicTrunk.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      cosmicTrunk.addColorStop(0.5, 'rgba(224, 231, 255, 0.85)');
      cosmicTrunk.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
      ctx.fillStyle = cosmicTrunk;

      ctx.beginPath();
      ctx.moveTo(cx - 10, 600);
      ctx.lineTo(cx - 4, topY + 30);
      ctx.lineTo(cx + 4, topY + 30);
      ctx.lineTo(cx + 10, 600);
      ctx.closePath();
      ctx.fill();

      // Tán cây xoáy tròn tinh vân thiên hà đa sắc
      ctx.save();
      ctx.translate(cx, topY + 15);
      ctx.rotate(time * 0.8 + mIdx);

      const nebGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 42);
      nebGrad.addColorStop(0, '#ffffff');
      nebGrad.addColorStop(0.3, '#ec4899');
      nebGrad.addColorStop(0.65, '#6366f1');
      nebGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = nebGrad;

      ctx.beginPath();
      ctx.ellipse(0, 0, 46, 22, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 0, 22, 46, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bụi sao lấp lánh ở tâm cây
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    }
  }

  ctx.restore();
}

// ============================================================================
// 2. KẾT XUẤT NỀN ĐẤT & BẬC BỤC NHẢY
// ============================================================================
function drawPlatforms(ctx, platforms, STAGES, stageIndex, cameraX, W, worldTime = 0) {
  if (!ctx || !platforms) return;
  const stage = (STAGES && STAGES[stageIndex]) ? STAGES[stageIndex] : { ground: '#14532d' };
  const sIdx = stageIndex % 10;
  const time = worldTime || (Date.now() * 0.001);

  for (const plat of platforms) {
    const screenX = plat.x - cameraX;
    if (screenX + plat.w < -60 || screenX > W + 60) continue;

    ctx.save();

    // RỄ CÂY ĐUNG ĐƯA (Màn 1)
    if (sIdx === 0 && !plat.isGround) {
      ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      const count = Math.max(2, Math.floor(plat.w / 60));
      for (let v = 0; v < count; v++) {
        const vx = screenX + 25 + v * (plat.w / count);
        const vLen = 22 + ((v * 17) % 24);
        const sway = Math.sin(time * 2.8 + v * 2 + plat.x) * 6;
        ctx.beginPath();
        ctx.moveTo(vx, plat.y + plat.h);
        ctx.quadraticCurveTo(vx + sway * 0.5, plat.y + plat.h + vLen * 0.5, vx + sway, plat.y + plat.h + vLen);
        ctx.stroke();
      }
    }
    // NHŨ BĂNG (Màn 5)
    else if (sIdx === 4 && !plat.isGround) {
      ctx.fillStyle = '#bae6fd';
      for (let ic = screenX + 15; ic < screenX + plat.w - 15; ic += 28) {
        ctx.beginPath();
        ctx.moveTo(ic, plat.y + plat.h);
        ctx.lineTo(ic + 6, plat.y + plat.h + 16);
        ctx.lineTo(ic + 12, plat.y + plat.h);
        ctx.closePath();
        ctx.fill();
      }
    }

    // KHỐI ĐẤT ĐÁ NỀN
    const blockGrad = ctx.createLinearGradient(screenX, plat.y, screenX, plat.y + plat.h);
    switch (sIdx) {
      case 1: blockGrad.addColorStop(0, '#4c1d95'); blockGrad.addColorStop(1, '#1c1917'); break;
      case 2: blockGrad.addColorStop(0, '#1e1035'); blockGrad.addColorStop(1, '#090514'); break;
      case 3: blockGrad.addColorStop(0, '#090514'); blockGrad.addColorStop(1, '#1e0836'); break;
      case 4: blockGrad.addColorStop(0, '#0369a1'); blockGrad.addColorStop(1, '#082f49'); break;
      case 5: blockGrad.addColorStop(0, '#1e293b'); blockGrad.addColorStop(1, '#0f172a'); break;
      case 6: blockGrad.addColorStop(0, '#451a03'); blockGrad.addColorStop(1, '#1c1917'); break;
      case 7: blockGrad.addColorStop(0, '#f8fafc'); blockGrad.addColorStop(1, '#cbd5e1'); break;
      case 8: blockGrad.addColorStop(0, '#3b0764'); blockGrad.addColorStop(1, '#090514'); break;
      case 9: blockGrad.addColorStop(0, 'rgba(99, 102, 241, 0.45)'); blockGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)'); break;
      default: blockGrad.addColorStop(0, stage.ground || '#14532d'); blockGrad.addColorStop(1, '#061c0f'); break;
    }
    ctx.fillStyle = blockGrad;
    ctx.fillRect(screenX, plat.y, plat.w, plat.h);

    // NẸP VIỀN SÁNG MẶT BỤC
    let crestColor = '#22c55e';
    if (sIdx === 1) crestColor = '#f97316';
    else if (sIdx === 2) crestColor = '#a855f7';
    else if (sIdx === 3) crestColor = '#e879f9';
    else if (sIdx === 4) crestColor = '#e0f2fe';
    else if (sIdx === 5) crestColor = '#fbbf24';
    else if (sIdx === 6) crestColor = '#ea580c';
    else if (sIdx === 7) crestColor = '#fde047';
    else if (sIdx === 8) crestColor = '#10b981';
    else if (sIdx === 9) crestColor = '#38bdf8';

    ctx.fillStyle = crestColor;
    ctx.fillRect(screenX, plat.y, plat.w, 6);
    ctx.restore();
  }
}

// ============================================================================
// 3. KẾT XUẤT VẬT THỂ TƯƠNG TÁC (RƯƠNG, BẪY GAI, CHECKPOINT & CỔNG QUA MÀN)
// ============================================================================
function drawPickupsAndObjects(ctx, pickups, chests, hazards, checkpoint, exitGate, cameraX, W, worldTime = 0) {
  if (!ctx) return;
  const time = worldTime || (Date.now() * 0.001);

  // VẬT PHẨM (VÀNG / MÁU / MANA)
  for (const item of pickups) {
    if (item.taken) continue;
    const screenX = item.x - cameraX;
    if (screenX < -30 || screenX > W + 30) continue;

    const bob = Math.sin(time * 4.5 + item.x) * 5;
    ctx.save();
    ctx.translate(screenX, item.y + bob);

    if (item.type === 'gold') {
      ctx.shadowColor = '#fde047'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
    } else if (item.type === 'heart') {
      ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(0, 4); ctx.bezierCurveTo(-7, -4, -10, -9, 0, -11); ctx.bezierCurveTo(10, -9, 7, -4, 0, 4);
      ctx.fill();
    } else {
      ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, -11); ctx.lineTo(8, 0); ctx.lineTo(0, 11); ctx.lineTo(-8, 0);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // RƯƠNG BÁU
  for (const chest of chests) {
    const screenX = chest.x - cameraX;
    if (screenX < -40 || screenX > W + 40) continue;

    ctx.save();
    ctx.fillStyle = chest.opened ? '#451a03' : '#78350f';
    ctx.fillRect(screenX, chest.y, chest.w, chest.h);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
    ctx.strokeRect(screenX, chest.y, chest.w, chest.h);

    if (!chest.opened) {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(screenX + chest.w / 2 - 4, chest.y + chest.h / 2 - 4, 8, 8);
    }
    ctx.restore();
  }

  // CHECKPOINT
  if (checkpoint) {
    const screenX = checkpoint.x - cameraX;
    if (screenX >= -50 && screenX <= W + 50) {
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(screenX, checkpoint.y + checkpoint.h - 18, checkpoint.w, 18);
      ctx.fillStyle = checkpoint.active ? '#38bdf8' : '#64748b';
      ctx.fillRect(screenX + checkpoint.w / 2 - 3, checkpoint.y + 10, 6, checkpoint.h - 28);
      ctx.fillRect(screenX + checkpoint.w / 2 - 10, checkpoint.y + 8, 20, 5);

      if (checkpoint.active) {
        ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(screenX + checkpoint.w / 2, checkpoint.y - 4, 7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  // BẪY GAI
  for (const haz of hazards) {
    const screenX = haz.x - cameraX;
    if (screenX < -60 || screenX > W + 60) continue;

    ctx.save();
    ctx.fillStyle = '#0f172a';
    for (let sx = screenX; sx < screenX + haz.w; sx += 12) {
      ctx.beginPath();
      ctx.moveTo(sx, haz.y + haz.h); ctx.lineTo(sx + 6, haz.y); ctx.lineTo(sx + 12, haz.y + haz.h);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(sx + 4, haz.y + 6); ctx.lineTo(sx + 6, haz.y); ctx.lineTo(sx + 8, haz.y + 6);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#0f172a';
    }
    ctx.restore();
  }

  // CỔNG QUA MÀN
  if (exitGate) {
    const screenX = exitGate.x - cameraX;
    if (screenX >= -120 && screenX <= W + 120) {
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(screenX, exitGate.y, 14, exitGate.h);
      ctx.fillRect(screenX + exitGate.w - 14, exitGate.y, 14, exitGate.h);
      ctx.beginPath();
      ctx.arc(screenX + exitGate.w / 2, exitGate.y + 20, exitGate.w / 2, Math.PI, 0);
      ctx.fill();

      if (exitGate.open) {
        ctx.save();
        const gateGrad = ctx.createRadialGradient(
          screenX + exitGate.w / 2, exitGate.y + exitGate.h / 2, 8,
          screenX + exitGate.w / 2, exitGate.y + exitGate.h / 2, exitGate.w * 0.6
        );
        gateGrad.addColorStop(0, '#ffffff');
        gateGrad.addColorStop(0.4, '#38bdf8');
        gateGrad.addColorStop(1, '#090514');
        ctx.fillStyle = gateGrad;
        ctx.beginPath();
        ctx.roundRect(screenX + 14, exitGate.y + 16, exitGate.w - 28, exitGate.h - 16, [16, 16, 0, 0]);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX + 14, exitGate.y + 16, exitGate.w - 28, exitGate.h - 16);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = exitGate.open ? '#38bdf8' : '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText(
        exitGate.open ? '✦ CỔNG ĐÃ MỞ (TIẾN VÀO) ✦' : '🔒 CỔNG KHÓA (CẦN DIỆT BOSS)',
        screenX + exitGate.w / 2,
        exitGate.y - 14
      );
      ctx.restore();
    }
  }
}
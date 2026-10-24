/**
 * ============================================================================
 * MONSTERS/GLACIALBAT.JS - DƠI BĂNG TINH (MÀN 5: BĂNG NGUYÊN VĨNH CỬU)
 * ============================================================================
 * 1. ĐÒN THƯỜNG: Sà chéo lao vào cắn gây sát thương, lập tức vỗ cánh dạt ra xa né đòn.
 * 2. SKILL: Tụ sương tuyết phát quang phóng 3 mũi gai băng hình nón về phía Kaito.
 * ============================================================================
 */

function drawGlacialBat(ctx, e, worldTime) {
  const w = e.w || 38;
  const h = e.h || 32;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isShooting = (e.castTimer || 0) > 0;
  const isRetreating = (e.retreatTimer || 0) > 0;
  const flap = Math.sin(time * 14) * (isShooting ? 4 : 12);

  ctx.save();

  // Góc nghiêng: sà xuống lao cắn hoặc vút lên khi rút lui
  const tilt = isRetreating ? -0.3 : 0.18;
  ctx.rotate(tilt);

  // 1. VÒNG HÀO QUANG HOA TUYẾT DƯỚI THÂN DƠI
  ctx.save();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 18 + Math.sin(time * 6) * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. ĐÔI CÁNH PHIẾN BĂNG GÓC CẠNH (GLACIAL CRYSTAL WINGS)
  const wingGrad = ctx.createLinearGradient(-w, -h * 0.5, w, h * 0.5);
  wingGrad.addColorStop(0, '#0284c7');
  wingGrad.addColorStop(0.4, '#38bdf8');
  wingGrad.addColorStop(0.8, '#bae6fd');
  wingGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = wingGrad;

  // --- CÁNH TRÁI ---
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(-w * 0.5, -h * 0.6 + flap);
  ctx.lineTo(-w * 0.85, -h * 0.15 + flap * 0.7);
  ctx.lineTo(-w * 0.65, h * 0.25 + flap * 0.3);
  ctx.lineTo(-w * 0.35, h * 0.1);
  ctx.lineTo(-3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // --- CÁNH PHẢI ---
  ctx.beginPath();
  ctx.moveTo(4, -2);
  ctx.lineTo(w * 0.5, -h * 0.6 + flap);
  ctx.lineTo(w * 0.85, -h * 0.15 + flap * 0.7);
  ctx.lineTo(w * 0.65, h * 0.25 + flap * 0.3);
  ctx.lineTo(w * 0.35, h * 0.1);
  ctx.lineTo(3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Nhũ băng nhọn rủ dưới mép cánh
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.moveTo(-w * 0.65, h * 0.25 + flap * 0.3);
  ctx.lineTo(-w * 0.72, h * 0.45 + flap * 0.3);
  ctx.lineTo(-w * 0.58, h * 0.22 + flap * 0.3);
  ctx.moveTo(w * 0.65, h * 0.25 + flap * 0.3);
  ctx.lineTo(w * 0.72, h * 0.45 + flap * 0.3);
  ctx.lineTo(w * 0.58, h * 0.22 + flap * 0.3);
  ctx.fill();

  // Gân băng phát quang trên cánh
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-4, -2); ctx.lineTo(-w * 0.55, -h * 0.25 + flap * 0.5);
  ctx.moveTo(4, -2);  ctx.lineTo(w * 0.55, -h * 0.25 + flap * 0.5);
  ctx.stroke();

  // 3. THÂN DƠI BẰNG KHỐI PHA LÊ TRÒN
  const bodyGrad = ctx.createLinearGradient(0, -10, 0, 10);
  bodyGrad.addColorStop(0, '#e0f2fe');
  bodyGrad.addColorStop(0.5, '#38bdf8');
  bodyGrad.addColorStop(1, '#0369a1');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 4. HAI TAI NHŨ BĂNG DỰNG ĐỨNG
  ctx.fillStyle = '#bae6fd';
  ctx.beginPath();
  ctx.moveTo(-6, -6);
  ctx.lineTo(-4, -16);
  ctx.lineTo(-1, -7);
  ctx.moveTo(1, -7);
  ctx.lineTo(4, -16);
  ctx.lineTo(6, -6);
  ctx.fill();

  // 5. ĐÔI MẮT PHÁT QUANG ÁNH SÁNG TRẮNG BĂNG
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.fillRect(1.5, -3, 3, 3);
  ctx.fillRect(5, -3, 3, 3);
  ctx.restore();

  // Răng nanh nhọn băng giá
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2.5, 4, 1.4, 3);
  ctx.fillRect(5, 4, 1.4, 3);

  // 6. HIỆU ỨNG TỤ QUẢ CẦU SƯƠNG BĂNG KHI BẮN GAI BĂNG
  if (isShooting) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(10, 2, 7 + Math.sin(time * 16) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// LOGIC CHIẾN ĐẤU AI CỦA DƠI BĂNG TINH: LAO CẮN RÚT LUI & SKILL TỤ SƯƠNG 3 GAI BĂNG
// ============================================================================
function updateGlacialBatSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);

  e.attackCd = Math.max(0, (e.attackCd || 0) - dt);
  e.skillCd = Math.max(0, (e.skillCd || 0) - dt);
  e.castTimer = Math.max(0, (e.castTimer || 0) - dt);

  // --------------------------------------------------------------------------
  // 1. TUYỆT KỸ (SKILL): TỤ SƯƠNG BẮN 3 MŨI GAI BĂNG HÌNH NÓN
  // Kích hoạt khi cách Kaito từ 150px đến 450px
  // --------------------------------------------------------------------------
  if (e.skillCd <= 0 && Math.abs(dist) >= 150 && Math.abs(dist) <= 450 && (e.retreatTimer || 0) <= 0) {
    e.skillCd = 3.5 + Math.random() * 1.5; // Hồi chiêu 3.5s - 5.0s
    e.castTimer = 0.55;                   // Dừng lại tụ sương trong 0.55s
    ctxGame.playSkillSFX();

    const ex = e.x + e.w / 2 + e.face * 16;
    const ey = e.y + e.h / 2;
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const baseAngle = Math.atan2(py - ey, px - ex);

    // Bắn 3 gai nhọn tỏa hình nón (-18 độ, thẳng, +18 độ)
    [-0.32, 0, 0.32].forEach(angOffset => {
      const finalAng = baseAngle + angOffset;
      const speed = 420;
      ctxGame.projectiles.push({
        type: 'ice_shard',
        x: ex,
        y: ey,
        w: 24,
        h: 12,
        vx: Math.cos(finalAng) * speed,
        vy: Math.sin(finalAng) * speed,
        isPlayer: false,
        dmg: Math.round(e.dmg * 0.9),
        color: '#bae6fd',
        life: 2.2
      });
    });

    ctxGame.spawnParticleBurst(ex, ey, '#38bdf8', 16, 200);
    ctxGame.say('DƠI BĂNG TINH: PHÓNG 3 GAI BĂNG SƯƠNG GIÁ!');
    return;
  }

  // --------------------------------------------------------------------------
  // 2. DI CHUYỂN, LAO VÀO CẮN & RÚT LUI NÉ RA XA (HIT & RUN)
  // --------------------------------------------------------------------------
  if (e.castTimer > 0) return; // Đang tụ sương thì dừng lại giữa không trung

  // Đang trong trạng thái rút lui né ra xa sau khi cắn
  if (e.retreatTimer > 0) {
    e.retreatTimer -= dt;
    e.x += e.retreatDir * (e.spd * 1.35) * dt;

    // Vút ngược lên cao hơn đầu Kaito
    const targetRetreatY = player.y - 140;
    e.y += (targetRetreatY - e.y) * 3.8 * dt;
  }
  // Đang sà xuống nhào cắn
  else {
    const hoverWave = Math.sin(ctxGame.worldTime * 6 + e.animTime) * 16;
    const targetY = (player.y + player.h / 2 - e.h / 2) + hoverWave;

    // Sà chéo thẳng vào người Kaito
    e.y += (targetY - e.y) * 2.8 * dt;

    // Lao ngang tiếp cận
    if (Math.abs(dist) > 4) {
      e.x += Math.sign(dist) * e.spd * dt;
    }
  }
}
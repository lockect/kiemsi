/**
 * ============================================================================
 * MONSTERS/STORMRAVEN.JS - LÔI ĐIỂU (MÀN 6: ĐỈNH NÚI LÔI VÂN)
 * ============================================================================
 * 1. ĐÒN TẤN CÔNG THƯỜNG: Thu cánh lao bổ nhào tốc độ siêu nhanh bọc trong
 *    mũi khoan sét plasma lao chéo vào Kaito gây sát thương, rồi bay vọt lên
 *    trời và dạt ra xa theo đường chữ V.
 * 2. SKILL NỘI TẠI: Phản xạ lôi điện giúp né đòn tấn công với tỉ lệ 20%.
 * ============================================================================
 */

// ============================================================================
// 1. HÀM VẼ HOẠT ẢNH & HIỆU ỨNG MŨI KHOAN SÉT
// ============================================================================
function drawStormRaven(ctx, e, worldTime) {
  const w = e.w || 44;
  const h = e.h || 36;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isDiving = !!e.isDiving || (e.diveTimer || 0) > 0 || Math.abs(e.vy || 0) > 120;
  const isRetreating = (e.retreatTimer || 0) > 0;
  const flap = Math.sin(time * 16) * (isDiving ? 2 : 12);

  ctx.save();

  // Góc nghiêng: Bổ nhào thì chúi mũi tên 45 độ, rút lui thì ngửa đầu 30 độ
  if (isDiving) {
    ctx.rotate(0.55);
  } else if (isRetreating) {
    ctx.rotate(-0.35);
  }

  // 1.1. CÁC TIA SÉT PLASMA PHÓNG XUANH THÂN & ĐUÔI
  ctx.save();
  ctx.strokeStyle = '#fef08a';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12;
  ctx.lineWidth = 1.6;
  const sparkT = Math.floor(time * 18);
  ctx.beginPath();
  ctx.moveTo(-w * 0.4, 0);
  ctx.lineTo(-w * 0.65, -8 + (sparkT % 4) * 4);
  ctx.lineTo(-w * 0.8, 4);
  ctx.moveTo(w * 0.3, -h * 0.2);
  ctx.lineTo(w * 0.55, -h * 0.4 - (sparkT % 3) * 3);
  ctx.stroke();
  ctx.restore();

  // 1.2. ĐUÔI LÔNG VŨ CHẺ ĐÔI HÌNH TIA CHỚP
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-w * 0.2, 4);
  ctx.lineTo(-w * 0.65, -4);
  ctx.lineTo(-w * 0.5, 8);
  ctx.lineTo(-w * 0.7, 16);
  ctx.lineTo(-w * 0.15, 10);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // 1.3. SẢI CÁNH LÔI ĐIỆN GÓC CẠNH (LIGHTNING WINGS)
  const wingGrad = ctx.createLinearGradient(-w * 0.5, -h * 0.6, w * 0.5, h * 0.4);
  wingGrad.addColorStop(0, '#334155');
  wingGrad.addColorStop(0.5, '#1e293b');
  wingGrad.addColorStop(0.85, '#0f172a');
  wingGrad.addColorStop(1, '#facc15');
  ctx.fillStyle = wingGrad;

  // Cánh trái
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(-w * 0.4, -h * 0.75 - flap);
  ctx.lineTo(-w * 0.7, -h * 0.35 - flap * 0.6);
  ctx.lineTo(-w * 0.5, h * 0.1);
  ctx.lineTo(-3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Cánh phải
  ctx.beginPath();
  ctx.moveTo(4, -2);
  ctx.lineTo(w * 0.4, -h * 0.75 - flap);
  ctx.lineTo(w * 0.7, -h * 0.35 - flap * 0.6);
  ctx.lineTo(w * 0.5, h * 0.1);
  ctx.lineTo(3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 1.4. THÂN CHIM CƠ BẮP LÔNG VŨ XÁM ĐEN KIM LOẠI
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 12, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // 1.5. ĐẦU, MÀO TIA SÉT & MỎ QUẶP ĐẠI BÀNG
  const headX = w * 0.24;
  const headY = -h * 0.12;

  // Mào lông tia chớp trên đỉnh đầu
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(headX - 6, headY - 6);
  ctx.lineTo(headX - 14, headY - 18);
  ctx.lineTo(headX - 8, headY - 12);
  ctx.lineTo(headX - 16, headY - 26);
  ctx.lineTo(headX, headY - 8);
  ctx.closePath();
  ctx.fill();

  // Hộp sọ chim
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(headX, headY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Mỏ đại bàng quặp vàng
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(headX + 4, headY - 3);
  ctx.lineTo(headX + 16, headY + 1);
  ctx.lineTo(headX + 12, headY + 8);
  ctx.lineTo(headX + 4, headY + 5);
  ctx.closePath();
  ctx.fill();

  // Đôi mắt lôi điện rực sáng
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.ellipse(headX + 4, headY - 1, 4, 2.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Vệt sáng lôi điện xé gió ra sau gáy
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(headX + 5, headY - 1);
  ctx.lineTo(headX - 12, headY - 4);
  ctx.stroke();
  ctx.restore();

  // Móng vuốt kẹp bọc điện
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-2, 10, 5, 6);
  ctx.fillRect(4, 10, 5, 6);

  // 1.6. HIỆU ỨNG MŨI KHOAN LÔI ĐIỆN SIÊU TỐC KHI BỔ NHÀO (THUNDER DRILL DIVE)
  if (isDiving) {
    ctx.save();
    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 24;
    ctx.lineWidth = 3.5;

    // Hình nón lôi điện plasma xoắn ốc bao bọc toàn thân
    ctx.beginPath();
    ctx.moveTo(w * 0.85, 0);
    ctx.lineTo(-w * 0.7, -h * 0.9);
    ctx.lineTo(-w * 0.7, h * 0.9);
    ctx.closePath();
    ctx.stroke();

    // Lõi xoáy năng lượng màu trắng
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(w * 0.85, 0);
    ctx.lineTo(-w * 0.5, -h * 0.5);
    ctx.lineTo(-w * 0.5, h * 0.5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// 2. BỘ LOGIC AI: BỔ NHÀO SIÊU TỐC BỌC MŨI KHOAN SÉT & BAY RA XA
// ============================================================================
function updateStormRavenSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);

  e.attackCd = Math.max(0, (e.attackCd || 0) - dt);
  e.diveTimer = Math.max(0, (e.diveTimer || 0) - dt);

  // --------------------------------------------------------------------------
  // 1. TRẠNG THÁI RÚT LUI SAU ĐÒN BỔ NHÀO (BAY VỌT LÊN TRỜI VÀ DẠT RA XA)
  // --------------------------------------------------------------------------
  if (e.retreatTimer > 0) {
    e.retreatTimer -= dt;
    e.isDiving = false;
    e.diveTimer = 0;

    // Bay dạt ra xa theo hướng ngược lại
    e.x += e.retreatDir * (e.spd * 1.5) * dt;

    // Bay vút lên cao tầng mây (cách đầu người chơi 160px)
    const targetRetreatY = player.y - 160;
    e.y += (targetRetreatY - e.y) * 4.2 * dt;
    return;
  }

  // --------------------------------------------------------------------------
  // 2. KÍCH HOẠT ĐÒN BỔ NHÀO SIÊU TỐC BỌC MŨI KHOAN SÉT (THUNDER DRILL DIVE)
  // Kích hoạt khi cách Kaito từ 140px đến 420px và hết thời gian hồi chiêu
  // --------------------------------------------------------------------------
  if (e.attackCd <= 0 && Math.abs(dist) >= 140 && Math.abs(dist) <= 420 && !e.isDiving) {
    e.isDiving = true;
    e.diveTimer = 0.85; // Duy trì mũi khoan sét trong 0.85s
    e.attackCd = 2.8;   // Hồi chiêu cú bổ nhào
    ctxGame.playSkillSFX();
    ctxGame.say('LÔI ĐIỂU: MŨI KHOAN SÉT BỔ NHÀO!', 1600);
  }

  // --------------------------------------------------------------------------
  // 3. DI CHUYỂN BỔ NHÀO HOẶC LƯỢN SĂN MỒI
  // --------------------------------------------------------------------------
  if (e.isDiving) {
    // Tốc độ bổ nhào cực nhanh (x3 tốc độ bay bình thường)
    const diveSpeed = 520;
    e.x += Math.sign(dist) * diveSpeed * dt;

    // Chúi thẳng xuống ngang thắt lưng Kaito
    const targetY = player.y + player.h * 0.4;
    e.y += (targetY - e.y) * 5.5 * dt;

    // Tạo vệt điện trường plasma kéo dài sau đuôi
    if (Math.random() < 0.4) {
      ctxGame.spawnParticleBurst(e.x + e.w / 2, e.y + e.h / 2, '#fef08a', 4, 120);
    }

    // Khi bổ nhào trúng Kaito ở cự ly rất gần (< 50px)
    if (Math.abs(dist) < 50 && Math.abs((player.y + player.h / 2) - (e.y + e.h / 2)) < 40) {
      ctxGame.playHitSFX();
      ctxGame.shakeScreen(6);
      ctxGame.damagePlayer(e.dmg, e.x + e.w / 2);
      ctxGame.spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#fde047', 18, 220);

      // Ngay sau cú đâm: kích hoạt bay vọt ngược lên trời và dạt ra xa
      e.isDiving = false;
      e.diveTimer = 0;
      e.retreatTimer = 1.6;
      e.retreatDir = -e.face;
      e.attackCd = 2.6;
    }
  } else {
    // Bay lượn sóng tuần tra bình thường
    const hoverWave = Math.sin(ctxGame.worldTime * 5 + e.animTime) * 20;
    const targetY = (player.y - 120) + hoverWave;
    e.y += (targetY - e.y) * 2.5 * dt;

    if (Math.abs(dist) > 160) {
      e.x += Math.sign(dist) * e.spd * dt;
    }
  }
}
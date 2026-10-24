/**
 * ============================================================================
 * MONSTERS/DARKLING DRAGON.JS - TIỂU LONG HẮC ÁM (VOID DRAKE)
 * ============================================================================
 * Thiết kế mới:
 * - Rồng con có đôi cánh rồng tím đập nhịp nhàng, bay lơ lửng tự do trên không.
 * - Chiếc đuôi rồng dài uốn lượn mềm mại theo hình sóng sin, chóp đuôi có vây gai.
 * - Đầu rồng oai vệ có cặp sừng nhỏ vuốt sau, mắt rực lửa và mõm nanh nhọn.
 * - Thân rồng vảy đen ánh tím hư không, 2 chân sau co quắp săn mồi gọn gàng.
 * ============================================================================
 */

function drawDarklingDragon(ctx, e, worldTime) {
  const w = e.w || 46;
  const h = e.h || 36;

  // Trạng thái rút lui hoặc nhào xuống cắn
  const isRetreating = (e.retreatTimer || 0) > 0;
  const anim = e.animTime || 0;

  // Tần số đập cánh rồng & nhịp đuôi uốn lượn
  const wingFlap = Math.sin((worldTime || anim) * 12) * 12;
  const tailWave = Math.sin((worldTime || anim) * 6) * 8;

  ctx.save();

  // Khi nhào tới thì chúc đầu xuống, khi rút lui thì ngửa đầu bay vọt lên
  const tilt = isRetreating ? -0.28 : 0.18;
  ctx.rotate(tilt);

  // 1. ĐUÔI RỒNG DÀI UỐN LƯỢN CÓ VÂY GAI
  ctx.save();
  const tailGrad = ctx.createLinearGradient(-w * 0.25, 0, -w * 0.9, h * 0.3);
  tailGrad.addColorStop(0, '#1e1b4b');
  tailGrad.addColorStop(0.5, '#3b0764');
  tailGrad.addColorStop(1, '#c026d3');
  ctx.strokeStyle = tailGrad;
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-w * 0.2, 2);
  ctx.quadraticCurveTo(-w * 0.5, -h * 0.2 + tailWave * 0.5, -w * 0.75, h * 0.1 - tailWave);
  ctx.quadraticCurveTo(-w * 0.9, h * 0.3 - tailWave, -w * 1.05, h * 0.05 + tailWave);
  ctx.stroke();

  // Vây gai nhọn ở chóp đuôi phát sáng tím
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 8;
  const tipX = -w * 1.05;
  const tipY = h * 0.05 + tailWave;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - 10, tipY - 6);
  ctx.lineTo(tipX - 4, tipY + 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. HAI CHÂN SAU CỦA RỒNG CO QUẮP SẮP VỒ
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.roundRect(-w * 0.18, h * 0.15, 6, 9, 2);
  ctx.roundRect(w * 0.02, h * 0.15, 6, 9, 2);
  ctx.fill();
  // Móng rồng đỏ
  ctx.fillStyle = '#c026d3';
  ctx.fillRect(-w * 0.2, h * 0.36, 8, 2.5);
  ctx.fillRect(0, h * 0.36, 8, 2.5);

  // 3. THÂN RỒNG BỌC VẢY ĐEN ÁNH TÍM HƯ KHÔNG
  const bodyGrad = ctx.createLinearGradient(-w * 0.3, -h * 0.2, w * 0.3, h * 0.2);
  bodyGrad.addColorStop(0, '#090514');
  bodyGrad.addColorStop(0.4, '#1e1b4b');
  bodyGrad.addColorStop(0.85, '#3b0764');
  bodyGrad.addColorStop(1, '#090514');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.32, -h * 0.22, w * 0.64, h * 0.48, [12, 14, 8, 10]);
  ctx.fill();

  // Gai nhọn dọc sống lưng rồng
  ctx.fillStyle = '#c026d3';
  for (let g = 0; g < 3; g++) {
    const gx = -w * 0.18 + g * 8;
    ctx.beginPath();
    ctx.moveTo(gx, -h * 0.22);
    ctx.lineTo(gx + 3, -h * 0.38);
    ctx.lineTo(gx + 6, -h * 0.22);
    ctx.fill();
  }

  // 4. ĐÔI CÁNH RỒNG HẮC ÁM (VỖ CÁNH BAY BỔNG)
  ctx.save();
  const wingGrad = ctx.createLinearGradient(-w * 0.3, -h * 0.5, w * 0.3, h * 0.2);
  wingGrad.addColorStop(0, '#581c87');
  wingGrad.addColorStop(0.5, '#3b0764');
  wingGrad.addColorStop(1, '#090514');
  ctx.fillStyle = wingGrad;

  // Cánh rồng trái (phía sau)
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, -h * 0.1);
  ctx.quadraticCurveTo(-w * 0.35, -h * 0.7 - wingFlap, -w * 0.55, -h * 0.4 - wingFlap * 0.5);
  ctx.quadraticCurveTo(-w * 0.35, -h * 0.2, -w * 0.1, -h * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Cánh rồng phải (phía trước, to rõ hơn)
  ctx.beginPath();
  ctx.moveTo(w * 0.05, -h * 0.12);
  ctx.quadraticCurveTo(w * 0.25, -h * 0.85 - wingFlap, w * 0.6, -h * 0.45 - wingFlap * 0.5);
  ctx.quadraticCurveTo(w * 0.4, -h * 0.1, w * 0.15, -h * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Gân cánh phát sáng rực tím
  ctx.strokeStyle = '#f5d0fe';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, -h * 0.12);
  ctx.lineTo(w * 0.4, -h * 0.55 - wingFlap * 0.7);
  ctx.stroke();
  ctx.restore();

  // 5. ĐẦU RỒNG, MÕM NHAU CẮN & CẶP SỪNG NHỌN
  const headX = w * 0.22;
  const headY = -h * 0.1;

  // Cặp sừng rồng vuốt cong về sau
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.moveTo(headX, headY - 4);
  ctx.quadraticCurveTo(headX - 10, headY - 18, headX - 18, headY - 24);
  ctx.lineTo(headX - 6, headY - 2);
  ctx.fill();
  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Hộp sọ & mõm rồng
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(headX - 4, headY - 6);
  ctx.lineTo(w * 0.58, headY);           // Mũi nhọn
  ctx.lineTo(w * 0.42, headY + 12);       // Hàm dưới mở nhẹ chuẩn bị cắn
  ctx.lineTo(headX - 4, headY + 10);
  ctx.closePath();
  ctx.fill();

  // Răng nanh trắng sắc nhọn
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(w * 0.36, headY + 1);
  ctx.lineTo(w * 0.42, headY + 7);
  ctx.lineTo(w * 0.48, headY + 1);
  ctx.fill();

  // Đôi mắt đỏ rực ma mị có vệt sáng
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(headX + 8, headY - 1, 4.5, 2.8, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(headX + 9.5, headY - 1, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Quả cầu năng lượng tối tụ tại mõm rồng khi bắn chiêu
  if (e.isShooting > 0) {
    ctx.save();
    ctx.fillStyle = '#e879f9';
    ctx.shadowColor = '#c026d3';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(w * 0.58 + 8, headY + 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w * 0.58 + 8, headY + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// Định danh tương thích
function drawVoidDrake(ctx, e, worldTime) {
  drawDarklingDragon(ctx, e, worldTime);
}
// Thêm vào cuối file monsters/Darkling Dragon.js:
function updateDarklingDragonSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);
  e.isShooting = Math.max(0, (e.isShooting || 0) - dt);
  e.fireballCd = (e.fireballCd === undefined ? 0.8 : e.fireballCd) - dt;

  // 1. KỸ NĂNG: BẮN DÒNG NĂNG LƯỢNG HẮC ÁM VÀO THẲNG NGƯỜI CHƠI
  if (e.fireballCd <= 0 && Math.abs(dist) < 800) {
    e.fireballCd = 2.4 + Math.random() * 1.0; // Hồi chiêu 2.4s - 3.4s
    e.isShooting = 0.5; // Kích hoạt hiệu ứng quả cầu tụ tại mõm rồng
    ctxGame.playSkillSFX();

    // Tọa độ mõm rồng (nơi phát tia)
    const ex = e.x + e.w / 2 + e.face * 18;
    const ey = e.y + e.h / 2 - 4;

    // Tọa độ tâm người chơi (mục tiêu ngắm)
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;

    // Tính toán vector góc chuẩn xác theo đường thẳng ngắm tới người chơi
    const dx = px - ex;
    const dy = py - ey;
    const len = Math.hypot(dx, dy) || 1;
    const speed = 460; // Tốc độ dòng năng lượng bay tới

    // Sinh dòng tia năng lượng hắc ám (tia kéo dài hoặc cầu đậm đặc)
    ctxGame.projectiles.push({
      type: 'dark_beam',
      x: ex,
      y: ey,
      w: 32,
      h: 22,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      isPlayer: false,
      dmg: e.dmg,
      color: '#c026d3',
      life: 2.5
    });

    ctxGame.spawnParticleBurst(ex, ey, '#c026d3', 15, 200);
    ctxGame.say('TIỂU LONG: DÒNG NĂNG LƯỢNG HẮC ÁM!');
  }

  // 2. CƠ CHẾ BAY LƯỢN & GIỮ KHOẢNG CÁCH CHIẾN ĐẤU
  if (e.retreatTimer > 0) {
    e.retreatTimer -= dt;
    e.x += e.retreatDir * (e.spd * 1.3) * dt;
    e.y += ((player.y - 140) - e.y) * 4 * dt;
  } else {
    const hoverWave = Math.sin(ctxGame.worldTime * 5 + e.animTime) * 22;
    const targetY = (player.y - 40) + hoverWave;
    e.y += (targetY - e.y) * 2.8 * dt;

    if (Math.abs(dist) > 160) {
      e.x += Math.sign(dist) * e.spd * dt;
    }
  }
}
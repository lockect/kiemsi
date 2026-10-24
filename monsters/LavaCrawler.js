/**
 * ============================================================================
 * MONSTERS/LAVACRAWLER.JS - KỲ NHÔNG HỎA NGỤC (MÀN 7: LÒ LUYỆN DUNG NHAM)
 * ============================================================================
 * Thiết kế: Bò sát 4 chân thân dẹp vảy đá lửa, vây gai lưng răng cưa,
 * đuôi uốn lượn có lửa ở chóp, há họng phồng to phun bãi dung nham.
 * ============================================================================
 */

function drawLavaCrawler(ctx, e, worldTime) {
  const w = e.w || 52;
  const h = e.h || 30;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isSpitting = (e.castTimer || 0) > 0;
  const crawlWave = Math.sin(anim * 8) * 3;
  const tailWave = Math.sin(time * 7) * 8;

  ctx.save();

  // 1. ĐUÔI KỲ NHÔNG UỐN LƯỢN CÓ NGỌN LỬA Ở CHÓP
  ctx.save();
  const tailGrad = ctx.createLinearGradient(-w * 0.25, 0, -w - 18, tailWave);
  tailGrad.addColorStop(0, '#7f1d1d');
  tailGrad.addColorStop(0.5, '#ea580c');
  tailGrad.addColorStop(1, '#f97316');
  ctx.strokeStyle = tailGrad;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-w * 0.25, 4);
  ctx.quadraticCurveTo(-w * 0.6, -8 + tailWave * 0.5, -w * 0.85, 2 + tailWave);
  ctx.stroke();

  // Ngọn lửa nhỏ ở chóp đuôi
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-w * 0.85, 2 + tailWave, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. BỐN CHÂN BÒ SÁT BÁM ĐẤT
  const drawLizardLeg = (lx, ly, isForward) => {
    ctx.save();
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.roundRect(lx, ly, 8, 12, 2);
    ctx.fill();
    // Móng vuốt sắc
    ctx.fillStyle = '#f97316';
    ctx.fillRect(lx - (isForward ? 2 : 0), ly + 10, 10, 2.5);
    ctx.restore();
  };

  drawLizardLeg(-w * 0.28, h * 0.15 + crawlWave, false);
  drawLizardLeg(w * 0.08, h * 0.15 - crawlWave, true);

  // 3. THÂN BÒ SÁT THÔN DẸP VẢY ĐÁ LỬA
  const bodyGrad = ctx.createLinearGradient(-w * 0.35, -h * 0.2, w * 0.35, h * 0.2);
  bodyGrad.addColorStop(0, '#451a03');
  bodyGrad.addColorStop(0.4, '#7f1d1d');
  bodyGrad.addColorStop(0.8, '#ea580c');
  bodyGrad.addColorStop(1, '#f97316');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.35, -h * 0.22, w * 0.7, h * 0.44, [8, 12, 6, 8]);
  ctx.fill();

  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Hàng vây gai nhọn như răng cưa dọc sống lưng
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 6;
  for (let g = 0; g < 4; g++) {
    const gx = -w * 0.2 + g * 9;
    ctx.beginPath();
    ctx.moveTo(gx, -h * 0.22);
    ctx.lineTo(gx + 3, -h * 0.42);
    ctx.lineTo(gx + 6, -h * 0.22);
    ctx.closePath();
    ctx.fill();
  }

  // 4. ĐẦU KỲ NHÔNG TAM GIÁC & MÕM PHỒNG PHUN LỬA
  const headX = w * 0.25;
  const headY = -h * 0.05;

  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(headX - 6, headY - 8);
  ctx.lineTo(w * 0.65, headY);       // Mũi nhọn
  ctx.lineTo(headX - 4, headY + 10);
  ctx.closePath();
  ctx.fill();

  // Cổ họng phồng to rực sáng khi chuẩn bị phun dung nham
  if (isSpitting) {
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(headX + 4, headY + 4, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Đôi mắt vàng sắc lẹm
  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#ea580c';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(headX + 6, headY - 3, 3.5, 2.2, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.fillRect(headX + 7, headY - 4, 1.2, 2.5);
  ctx.restore();

  ctx.restore();
}
// Thêm vào cuối file monsters/LavaCrawler.js:
function updateLavaCrawlerSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);
  e.castTimer = Math.max(0, (e.castTimer || 0) - dt);
  e.spitCd = (e.spitCd || 0) - dt;

  if (e.spitCd <= 0 && Math.abs(dist) < 420) {
    e.spitCd = 2.5 + Math.random() * 1.3;
    e.castTimer = 0.5;
    ctxGame.playSkillSFX();
    ctxGame.projectiles.push({
      type: 'magma',
      x: e.x + (e.face > 0 ? e.w : -28),
      y: e.y + e.h / 2,
      w: 24, h: 20,
      vx: e.face * 360,
      vy: 0,
      isPlayer: false,
      dmg: e.dmg,
      color: '#f97316',
      life: 2.0
    });
  } else if (Math.abs(dist) > 120 && e.castTimer <= 0) {
    e.x += Math.sign(dist) * e.spd * dt;
  }
}
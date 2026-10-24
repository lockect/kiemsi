/**
 * ============================================================================
 * MONSTERS/SANCTUARYGOLEM.JS - HỘ VỆ THẦN TƯỢNG (MÀN 8: THÀNH PHỐ THIÊN KHÔNG)
 * ============================================================================
 * Thiết kế: Tượng cẩm thạch trắng viền vàng kim Hy Lạp, vòng hào quang sau lưng,
 * mắt xanh thiên thanh, cầm Đại Đao Thánh Quang vung quét vệt sáng bán nguyệt.
 * ============================================================================
 */

function drawSanctuaryGolem(ctx, e, worldTime) {
  const w = e.w || 50;
  const h = e.h || 66;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isSlashing = (e.slashTimer || 0) > 0;
  const walkBob = Math.sin(anim * 4.5) * 2;

  ctx.save();

  // 1. VÒNG HÀO QUANG THÁNH LINH XOAY SAU LƯNG (DIVINE HALO RING)
  ctx.save();
  ctx.translate(0, -h * 0.15 + walkBob);
  ctx.rotate(time * 1.5);
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.75)';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.55, 0, Math.PI * 2);
  ctx.stroke();

  // 4 tia sáng chữ thập trên vòng hào quang
  for (let k = 0; k < 4; k++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -w * 0.55 - 4, 4, 8);
  }
  ctx.restore();

  // 2. CHÂN TRỤ CẨM THẠCH TRẮNG NẸP VÀNG
  const legGrad = ctx.createLinearGradient(0, h * 0.15, 0, h * 0.45);
  legGrad.addColorStop(0, '#ffffff');
  legGrad.addColorStop(0.7, '#f1f5f9');
  legGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = legGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.28, h * 0.15, 12, h * 0.32, 3);
  ctx.roundRect(w * 0.1, h * 0.15, 12, h * 0.32, 3);
  ctx.fill();

  // Đai vàng nẹp ống chân
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-w * 0.28, h * 0.26, 12, 3);
  ctx.fillRect(w * 0.1, h * 0.26, 12, 3);

  // 3. THÂN TƯỢNG ĐÁ CẨM THẠCH OAI NGHIÊM
  const bodyGrad = ctx.createLinearGradient(0, -h * 0.25, 0, h * 0.3);
  bodyGrad.addColorStop(0, '#ffffff');
  bodyGrad.addColorStop(0.6, '#e2e8f0');
  bodyGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.roundRect(-w * 0.35, -h * 0.25 + walkBob, w * 0.7, h * 0.52, [12, 12, 8, 8]);
  ctx.fill();

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Phù văn thánh linh phát quang trên ngực
  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, -h * 0.05 + walkBob, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cầu vai tròn Hy Lạp
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(-w * 0.35, -h * 0.2 + walkBob, 8, 0, Math.PI * 2);
  ctx.arc(w * 0.35, -h * 0.2 + walkBob, 8, 0, Math.PI * 2);
  ctx.fill();

  // 4. ĐẦU TƯỢNG THẦN VÔ CẢM & MẮT XANH THIÊN THANH
  const headY = -h * 0.34 + walkBob;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, headY, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Vương miện nguyệt quế vàng
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(-10, headY - 4);
  ctx.lineTo(-4, headY - 14);
  ctx.lineTo(0, headY - 6);
  ctx.lineTo(4, headY - 14);
  ctx.lineTo(10, headY - 4);
  ctx.closePath();
  ctx.fill();

  // Đôi mắt phát quang xanh ngọc thánh thiện
  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.fillRect(-2, headY - 1, 5, 3);
  ctx.fillRect(4, headY - 1, 5, 3);
  ctx.restore();

  // 5. ĐẠI ĐAO THÁNH QUANG (HOLY GLAIVE)
  ctx.save();
  const swordAngle = isSlashing ? 1.45 : 0.25;
  ctx.translate(w * 0.25, -h * 0.05 + walkBob);
  ctx.rotate(swordAngle);

  // Cán đao vàng
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(-2, 10, 4, 30);

  // Lưỡi đao cẩm thạch sắc lẹm
  ctx.save();
  ctx.shadowColor = '#fde047';
  ctx.shadowBlur = 12;
  const bladeGrad = ctx.createLinearGradient(-5, 10, 5, -45);
  bladeGrad.addColorStop(0, '#ffffff');
  bladeGrad.addColorStop(0.5, '#fef08a');
  bladeGrad.addColorStop(1, '#facc15');
  ctx.fillStyle = bladeGrad;

  ctx.beginPath();
  ctx.moveTo(-6, 10);
  ctx.lineTo(-6, -38);
  ctx.lineTo(0, -50);
  ctx.lineTo(6, -38);
  ctx.lineTo(6, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // 6. VỆT CHÉM BÁN NGUYỆT VÀNG KIM KHI VUNG ĐAO
  if (isSlashing) {
    ctx.save();
    ctx.strokeStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(w * 0.2, 0, 55, -0.8, 0.8);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
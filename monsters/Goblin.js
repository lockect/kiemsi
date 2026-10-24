/**
 * GOBLIN.JS - YÊU TINH RỪNG NHANH NHẸN
 * Thiết kế: Da xanh nõn chuối, tai dơi nhọn, quần áo da rách, tay vung dao găm gỉ sét.
 * Khi tấn công: Lướt cực nhanh áp sát đâm dao găm sát thương vào người chơi!
 */
function drawGoblin(ctx, e) {
  const w = e.w || 38;
  const h = e.h || 54;
  const walkBob = Math.sin(e.animTime * 4) * 2;
  const isDashing = e.isDashing || (e.slashTimer || 0) > 0;

  ctx.save();

  // Khi lướt đâm: Cúi rạp người về phía trước
  if (isDashing) {
    ctx.rotate(0.22);

    // Vệt bóng ma thuật lướt gió sau lưng
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#84cc16';
    ctx.shadowColor = '#a3e635';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(-18, 0, 14, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 1. Bóng đổ
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, h / 2 - 2, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Chân & Khố da rách
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-8, h / 2 - 14, 16, 12);

  // 3. Thân mình Goblin da xanh
  const skinGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  skinGrad.addColorStop(0, '#a3e635');
  skinGrad.addColorStop(1, '#65a30d');
  ctx.fillStyle = skinGrad;

  ctx.beginPath();
  ctx.roundRect(-w / 2 + 4, -h / 2 + 12 + walkBob, w - 8, 22, 6);
  ctx.fill();

  // Áo giáp da chéo ngực
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + 6, -h / 2 + 14 + walkBob);
  ctx.lineTo(w / 2 - 6, -h / 2 + 30 + walkBob);
  ctx.stroke();

  // 4. Đầu Goblin
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.arc(0, -h / 2 + 8 + walkBob, 11, 0, Math.PI * 2);
  ctx.fill();

  // Đôi tai nhọn kiểu yêu tinh
  ctx.fillStyle = '#65a30d';
  ctx.beginPath();
  // Tai trái
  ctx.moveTo(-8, -h / 2 + 6 + walkBob);
  ctx.lineTo(-18, -h / 2 - 2 + walkBob);
  ctx.lineTo(-6, -h / 2 + 12 + walkBob);
  // Tai phải
  ctx.moveTo(8, -h / 2 + 6 + walkBob);
  ctx.lineTo(18, -h / 2 - 2 + walkBob);
  ctx.lineTo(6, -h / 2 + 12 + walkBob);
  ctx.fill();

  // 5. Mắt vàng gian xảo & Mũi nhọn
  ctx.fillStyle = '#fde047';
  ctx.fillRect(2, -h / 2 + 5 + walkBob, 4, 4);
  ctx.fillRect(8, -h / 2 + 5 + walkBob, 4, 4);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(4, -h / 2 + 6 + walkBob, 2, 3);
  ctx.fillRect(10, -h / 2 + 6 + walkBob, 2, 3);

  // 6. Cánh tay cầm Dao Găm (Dagger) ĐÂM TỚI
  ctx.save();
  ctx.translate(8, -h / 2 + 22 + walkBob);
  if (isDashing) ctx.rotate(-0.3); // Giương dao đâm thẳng về phía trước

  // Cán dao
  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, -2, 5, 4);

  // Lưỡi dao găm sắc lẹm
  ctx.save();
  ctx.shadowColor = '#a3e635';
  ctx.shadowBlur = isDashing ? 14 : 4;
  ctx.fillStyle = isDashing ? '#fef08a' : '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(5, -4);
  ctx.lineTo(24, 0); // Đâm dài tới
  ctx.lineTo(5, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  // Vệt chém/đâm đỏ khi lướt trúng
  if (isDashing) {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(20, -10);
    ctx.lineTo(42, -5);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

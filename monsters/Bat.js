/**
 * BAT.JS - DƠI BÓNG TỐI
 * Thiết kế: Thân tròn bọc lông tím, đôi cánh uốn lượn có màng cánh sắc nét, đập nhanh trên không.
 */
function drawBat(ctx, e, worldTime) {
  ctx.save();

  // Nhịp vỗ cánh mềm mại theo hàm Sin tần số cao
  const flap = Math.sin((worldTime || 0) * 14) * 11;

  // 1. Màng cánh dơi 2 bên (Dual Wings)
  const wingGrad = ctx.createLinearGradient(-22, -10, 22, 10);
  wingGrad.addColorStop(0, '#581c87');
  wingGrad.addColorStop(0.5, '#7e22ce');
  wingGrad.addColorStop(1, '#3b0764');
  ctx.fillStyle = wingGrad;

  ctx.beginPath();
  // Cánh trái
  ctx.moveTo(-3, -2);
  ctx.quadraticCurveTo(-12, -15 + flap, -22, -2 + flap);
  ctx.quadraticCurveTo(-14, 6 + flap, -3, 3);
  // Cánh phải
  ctx.moveTo(3, -2);
  ctx.quadraticCurveTo(12, -15 + flap, 22, -2 + flap);
  ctx.quadraticCurveTo(14, 6 + flap, 3, 3);
  ctx.fill();

  // Viền cánh phát sáng tím ma mị
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 2. Thân dơi béo tròn
  ctx.fillStyle = '#2e1065';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Hai tai nhọn vểnh cao
  ctx.fillStyle = '#4c1d95';
  ctx.beginPath();
  ctx.moveTo(-5, -6);
  ctx.lineTo(-3, -13);
  ctx.lineTo(-1, -7);
  ctx.moveTo(1, -7);
  ctx.lineTo(3, -13);
  ctx.lineTo(5, -6);
  ctx.fill();

  // 4. Mắt đỏ phát sáng trong bóng đêm
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 8;
  ctx.fillRect(1, -3, 2.5, 2.5);
  ctx.fillRect(4, -3, 2.5, 2.5);
  ctx.restore();

  // 5. Hai răng nanh trắng nhỏ
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2, 3, 1.2, 2.5);
  ctx.fillRect(4, 3, 1.2, 2.5);

  ctx.restore();
}

/**
 * ============================================================================
 * MONSTERS/RIFTPHANTOM.JS - ẢO ẢNH BÓNG MA (MÀN 9: KHE NỨT HỖN MANG)
 * ============================================================================
 * Thiết kế: Bóng ma thời gian trong suốt nửa thực nửa ảo, áo choàng phân giải
 * khối ma trận, mắt xoáy ốc hai màu nghịch lý, phân thân tam ảnh vung vuốt.
 * ============================================================================
 */

function drawRiftPhantom(ctx, e, worldTime) {
  const w = e.w || 44;
  const h = e.h || 58;
  const anim = e.animTime || 0;
  const time = worldTime || anim;
  const isSlashing = (e.slashTimer || 0) > 0;
  const floatBob = Math.sin(time * 4) * 4;
  const glitchOffset = Math.sin(time * 18) > 0.85 ? (Math.random() - 0.5) * 8 : 0;

  ctx.save();
  ctx.translate(glitchOffset, floatBob);

  // 1. TÀN ẢNH MA TRẬN MỜ PHÍA SAU (GLITCH SHADOW)
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#10b981'; // Xanh ngọc nghịch lý
  ctx.beginPath();
  ctx.ellipse(-6, 0, w * 0.35, h * 0.45, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. ÁO CHOÀNG BÓNG MA PHÂN MẢNH TRONG SUỐT (PHANTOM ROBE)
  ctx.save();
  ctx.globalAlpha = 0.75;
  const robeGrad = ctx.createLinearGradient(0, -h * 0.3, 0, h * 0.45);
  robeGrad.addColorStop(0, '#c084fc');
  robeGrad.addColorStop(0.5, '#6366f1');
  robeGrad.addColorStop(1, '#090514');
  ctx.fillStyle = robeGrad;

  ctx.beginPath();
  ctx.moveTo(0, -h * 0.3);
  ctx.lineTo(w * 0.35, h * 0.42);
  // Đáy áo choàng rách dạng răng cưa kỹ thuật số
  ctx.lineTo(w * 0.15, h * 0.32);
  ctx.lineTo(0, h * 0.44);
  ctx.lineTo(-w * 0.15, h * 0.32);
  ctx.lineTo(-w * 0.35, h * 0.42);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // Các khối pixel ma trận trôi nổi quanh thân
  ctx.fillStyle = '#a7f3d0';
  for (let p = 0; p < 4; p++) {
    const px = Math.sin(time * 5 + p) * 16;
    const py = -h * 0.1 + p * 12;
    ctx.fillRect(px, py, 3, 3);
  }

  // 3. MẶT NẠ GƯƠNG VỠ & ĐÔI MẮT XOÁY ỐC NGHỊCH LÝ
  const headY = -h * 0.28;

  // Đầu bóng ma không mặt
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.arc(0, headY, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // ĐÔI MẮT HAI MÀU NGHỊCH LÝ (TÍM HƯ KHÔNG & XANH NGỌC)
  ctx.save();
  // Mắt trái: Tím Hư Không
  ctx.fillStyle = '#e879f9';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 8;
  ctx.fillRect(-5, headY - 2, 3.5, 3.5);

  // Mắt phải: Xanh ngọc nghịch lý
  ctx.fillStyle = '#34d399';
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 8;
  ctx.fillRect(2, headY - 2, 3.5, 3.5);
  ctx.restore();

  // 4. MÓNG VUỐT THỜI GIAN SẮC NHỌN (TIME CLAWS)
  ctx.save();
  ctx.strokeStyle = '#10b981';
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  const clawReach = isSlashing ? 26 : 14;
  ctx.beginPath();
  ctx.moveTo(w * 0.2, 0);
  ctx.lineTo(w * 0.2 + clawReach, -4);
  ctx.moveTo(w * 0.2, 4);
  ctx.lineTo(w * 0.2 + clawReach + 4, 4);
  ctx.moveTo(w * 0.2, 8);
  ctx.lineTo(w * 0.2 + clawReach, 12);
  ctx.stroke();
  ctx.restore();

  // 5. HIỆU ỨNG VẾT CHÉM KHÔNG GIAN GLITCH
  if (isSlashing) {
    ctx.save();
    ctx.strokeStyle = '#34d399';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, -20);
    ctx.lineTo(w * 0.9, 10);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
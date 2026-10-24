/**
 * ============================================================================
 * HERO.JS - BỘ VẼ VÀ HIỆU ỨNG ĐỒ HỌA CAO CẤP NHÂN VẬT KAITO (PRO ANIME HD)
 * ============================================================================
 * - Thiết kế vector chi tiết cao: Áo giáp kim loại, ngọc phát quang, tóc anime.
 * - Hoạt ảnh nhịp thở (Breathe), bước chạy (Run Cycle), xoay kiếm theo đòn đánh.
 * - Hiệu ứng bóng lướt gió (Dash), vệt chém hào quang 2 lớp và tia lửa combo 3.
 * - Tương thích 100% với mọi trình duyệt Canvas 2D (không phụ thuộc roundRect).
 * ============================================================================
 */

function drawHero(ctx, player, cameraX, worldTime, swordTier, SWORD_TIERS) {
  if (!player || !ctx) return;

  const screenX = player.x - cameraX;
  const screenY = player.y;

  ctx.save();
  ctx.translate(screenX + player.w / 2, screenY + player.h / 2);

  // --------------------------------------------------------------------------
  // 0. TRẠNG THÁI BẤT TỬ & HƯỚNG NHÌN
  // --------------------------------------------------------------------------
  // Hiệu ứng chớp nháy mềm khi nhân vật đang trong thời gian bất tử
  if (player.invuln > 0) {
    ctx.globalAlpha = Math.floor(worldTime * 24) % 2 === 0 ? 0.35 : 0.85;
  }

  // Lật hướng nhìn: 1 là sang Phải, -1 là sang Trái
  ctx.scale(player.face || 1, 1);

  // Tính toán nhịp động lực học
  const moving = Math.abs(player.vx) > 10 && player.onGround;
  const runCycle = Math.sin(player.animTime || 0) * (moving ? 7.5 : 1.2);
  const breathe = Math.sin(worldTime * 4) * 1.6;
  const pulseCore = Math.sin(worldTime * 6) * 0.25 + 0.75; // Nhịp đập ngọc ma thuật

  // Tra cứu màu sắc kiếm theo cấp độ (Tier) an toàn
  const tier = (SWORD_TIERS && SWORD_TIERS[swordTier])
    ? SWORD_TIERS[swordTier]
    : { color: '#e2e8f0', glow: '#38bdf8' };

  // --------------------------------------------------------------------------
  // 1. HIỆU ỨNG BÓNG MỜ KHI LƯỚT (DASH GHOST AFTERIMAGE)
  // --------------------------------------------------------------------------
  if (player.dashTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.fillStyle = tier.glow;
    ctx.shadowColor = tier.glow;
    ctx.shadowBlur = 12;

    // Vệt bóng ma thuật lùi lại phía sau lưng
    ctx.beginPath();
    ctx.ellipse(-player.face * 20, 0, 15, 27, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-player.face * 32, 2, 10, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 2. BÓNG ĐỔ DƯỚI NỀN ĐẤT (RADIAL DROP SHADOW)
  // --------------------------------------------------------------------------
  ctx.save();
  const shadowGrad = ctx.createRadialGradient(0, player.h / 2 - 2, 2, 0, player.h / 2 - 2, 28);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  shadowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.35)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;

  ctx.beginPath();
  ctx.ellipse(0, player.h / 2 - 2, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 3. KHĂN CHOÀNG / ÁO CHOÀNG BAY KHÍ ĐỘNG LỰC (3-LAYER FLOWING CAPE)
  // --------------------------------------------------------------------------
  ctx.save();
  const capeLag = moving ? 15 : 2;
  const capeWave = Math.sin(worldTime * 8.5) * 5;

  // Lớp 1: Mặt trong áo choàng tối màu tạo chiều sâu
  ctx.fillStyle = '#082f49';
  ctx.beginPath();
  ctx.moveTo(-7, -13 + breathe);
  ctx.quadraticCurveTo(-26, 2, -34 - capeLag, 24 + runCycle + capeWave);
  ctx.lineTo(-24 - capeLag, 26 + runCycle + capeWave);
  ctx.quadraticCurveTo(-14, 18, 5, -8 + breathe);
  ctx.closePath();
  ctx.fill();

  // Lớp 2: Thân áo choàng chính dải chuyển sắc xanh hoàng gia
  const capeGrad = ctx.createLinearGradient(-10, -15, -34, 25);
  capeGrad.addColorStop(0, '#0284c7');
  capeGrad.addColorStop(0.5, '#0369a1');
  capeGrad.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = capeGrad;

  ctx.beginPath();
  ctx.moveTo(-6, -14 + breathe);
  ctx.quadraticCurveTo(-22, -3, -30 - capeLag, 19 + runCycle + capeWave);
  ctx.quadraticCurveTo(-16, 21, -8, 13 + breathe);
  ctx.quadraticCurveTo(-1, 2, 7, -8 + breathe);
  ctx.closePath();
  ctx.fill();

  // Lớp 3: Đường may gân dạ quang viền áo choàng
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // Nếp lụa tạo nếp gấp sống động
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-10, -6 + breathe);
  ctx.quadraticCurveTo(-18, 8, -24 - capeLag, 18 + runCycle + capeWave);
  ctx.stroke();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 4. ĐÔI CHÂN & ỦNG CHIẾN BINH KIM LOẠI (GREAVES & BOOTS)
  // --------------------------------------------------------------------------
  ctx.save();
  // Quần chiến binh bó sát sẫm màu
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 7.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Chân sau
  ctx.moveTo(-7, 10 + breathe);
  ctx.lineTo(-12 + runCycle, 24);
  // Chân trước
  ctx.moveTo(7, 10 + breathe);
  ctx.lineTo(12 - runCycle, 24);
  ctx.stroke();

  // Hàm vẽ ủng giáp kim loại mạ vàng viền sáng
  const drawArmorBoot = (bx, by) => {
    ctx.save();
    // Giáp cổ chân dải gradient vàng đồng hoàng kim
    const bootGrad = ctx.createLinearGradient(bx, by, bx, by + 10);
    bootGrad.addColorStop(0, '#fef08a');
    bootGrad.addColorStop(0.3, '#f59e0b');
    bootGrad.addColorStop(0.8, '#b45309');
    bootGrad.addColorStop(1, '#451a03');
    ctx.fillStyle = bootGrad;

    // Khối ủng chính
    ctx.beginPath();
    ctx.moveTo(bx - 7, by);
    ctx.lineTo(bx + 7, by);
    ctx.lineTo(bx + 8, by + 9);
    ctx.lineTo(bx - 8, by + 9);
    ctx.closePath();
    ctx.fill();

    // Viền kim loại nổi
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Đai vàng ngang cổ chân
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bx - 7, by + 2, 14, 2);

    // Miếng đệm giáp đầu gối tròn nhỏ
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(bx - 0.5, by - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  };

  drawArmorBoot(-12 + runCycle, 22);
  drawArmorBoot(12 - runCycle, 22);
  ctx.restore();

  // --------------------------------------------------------------------------
  // 5. THÂN ÁO GIÁP, GIÁP VAI & LÕI MA THUẬT PHÁT QUANG
  // --------------------------------------------------------------------------
  ctx.save();
  // Lớp áo lót sẫm màu bên trong
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-13, -16 + breathe, 26, 27);

  // Tấm giáp ngực chữ V ánh kim bọc ngoài (Metallic Chestplate)
  const chestGrad = ctx.createLinearGradient(0, -16 + breathe, 0, 12 + breathe);
  chestGrad.addColorStop(0, '#ffffff');
  chestGrad.addColorStop(0.2, '#e2e8f0');
  chestGrad.addColorStop(0.65, '#94a3b8');
  chestGrad.addColorStop(1, '#334155');
  ctx.fillStyle = chestGrad;

  ctx.beginPath();
  ctx.moveTo(-13, -15 + breathe);
  ctx.lineTo(13, -15 + breathe);
  ctx.lineTo(10, 7 + breathe);
  ctx.lineTo(0, 13 + breathe); // Đáy nhọn chữ V phong cách hiệp sĩ
  ctx.lineTo(-10, 7 + breathe);
  ctx.closePath();
  ctx.fill();

  // Đường gờ rãnh chữ V sắc sảo giữa giáp
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-9, -12 + breathe);
  ctx.lineTo(0, 6 + breathe);
  ctx.lineTo(9, -12 + breathe);
  ctx.stroke();

  // Viền bạc phản quang ngoài cùng của giáp
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-13, -15 + breathe);
  ctx.lineTo(13, -15 + breathe);
  ctx.lineTo(10, 7 + breathe);
  ctx.lineTo(0, 13 + breathe);
  ctx.lineTo(-10, 7 + breathe);
  ctx.closePath();
  ctx.stroke();

  // Giáp vai 2 bên mạ vàng (Pauldrons)
  const drawPauldron = (px, py) => {
    ctx.save();
    const pGrad = ctx.createRadialGradient(px, py - 1, 1, px, py, 6);
    pGrad.addColorStop(0, '#fef08a');
    pGrad.addColorStop(0.6, '#f59e0b');
    pGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = pGrad;

    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };
  drawPauldron(-14, -13 + breathe);
  drawPauldron(14, -13 + breathe);

  // Lõi ngọc ma thuật phát quang theo cấp độ kiếm (Arcane Core Gem)
  ctx.save();
  ctx.fillStyle = tier.glow;
  ctx.shadowColor = tier.glow;
  ctx.shadowBlur = 10 * pulseCore;

  ctx.beginPath();
  ctx.arc(0, -3 + breathe, 4, 0, Math.PI * 2);
  ctx.fill();

  // Đốm sáng tinh khôi giữa lõi ngọc
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1, -4.2 + breathe, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Thắt lưng chiến binh da nâu & khóa vàng
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-11, 8 + breathe, 22, 4);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-3.5, 7 + breathe, 7, 6);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(-3.5, 7 + breathe, 7, 6);

  ctx.fillStyle = tier.glow;
  ctx.beginPath();
  ctx.arc(0, 10 + breathe, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 6. KHUÔN MẶT ANIME V-LINE & MÁI TÓC PHONG TRẦN
  // --------------------------------------------------------------------------
  ctx.save();
  const headY = -28 + breathe * 0.8;

  // Cổ
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-3.5, headY + 8, 7, 6);

  // Gương mặt V-line Anime phủ gradient sáng
  const skinGrad = ctx.createLinearGradient(0, headY - 14, 0, headY + 14);
  skinGrad.addColorStop(0, '#fff7ed');
  skinGrad.addColorStop(0.65, '#ffedd5');
  skinGrad.addColorStop(1, '#fed7aa');
  ctx.fillStyle = skinGrad;

  ctx.beginPath();
  ctx.moveTo(-11, headY - 6);
  ctx.lineTo(-11, headY + 2);
  ctx.quadraticCurveTo(-8, headY + 12, 0, headY + 14);
  ctx.quadraticCurveTo(8, headY + 12, 11, headY + 2);
  ctx.lineTo(11, headY - 6);
  ctx.closePath();
  ctx.fill();

  // Đôi tai nhỏ hai bên
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(-11, headY + 1, 2.2, 0, Math.PI * 2);
  ctx.arc(11, headY + 1, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Nét mũi nhẹ & Miệng cương nghị
  ctx.strokeStyle = '#fba78b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(1, headY + 4);
  ctx.lineTo(2, headY + 6);
  ctx.stroke();

  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(2, headY + 9);
  ctx.lineTo(5, headY + 9);
  ctx.stroke();

  // Đôi mắt Anime tinh anh hướng về phía trước
  // Viền mi mắt sắc sảo
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(3, headY - 3);
  ctx.lineTo(10, headY - 2.5);
  ctx.stroke();

  // Tròng trắng mắt
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(3.5, headY - 2);
  ctx.lineTo(9.5, headY - 2);
  ctx.lineTo(9.5, headY + 3);
  ctx.lineTo(3.5, headY + 3);
  ctx.closePath();
  ctx.fill();

  // Đồng tử xanh ánh lam sâu thẳm
  const eyeGrad = ctx.createLinearGradient(4, headY - 2, 4, headY + 3);
  eyeGrad.addColorStop(0, '#0369a1');
  eyeGrad.addColorStop(0.5, '#0284c7');
  eyeGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = eyeGrad;
  ctx.fillRect(5, headY - 2, 3.5, 5);

  // Đồng tử đen trung tâm
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(6, headY - 1, 2, 3.5);

  // Hai đốm sáng bắt lóa trong mắt (Double Catchlights)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(5.8, headY - 0.8, 1, 0, Math.PI * 2);
  ctx.arc(7.2, headY + 1.2, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Mái tóc tỉa từng tầng uốn lượn phong cách kiếm khách
  const hairGrad = ctx.createLinearGradient(0, headY - 24, 0, headY + 8);
  hairGrad.addColorStop(0, '#475569');
  hairGrad.addColorStop(0.4, '#1e293b');
  hairGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = hairGrad;

  ctx.beginPath();
  ctx.moveTo(-13, headY - 1);
  ctx.quadraticCurveTo(-18, -44, -5, headY - 22);
  ctx.lineTo(-1, headY - 17);
  ctx.lineTo(7, headY - 26); // Lọn tóc dựng đỉnh đầu cá tính
  ctx.lineTo(12, headY - 16);
  ctx.lineTo(18, headY - 8);
  ctx.quadraticCurveTo(15, headY + 6, 11, headY + 8); // Tóc mai vuốt nhọn
  ctx.lineTo(7, headY - 3);
  ctx.lineTo(2, headY + 3); // Mái chéo ngang trán
  ctx.lineTo(-4, headY - 5);
  ctx.lineTo(-9, headY + 5);
  ctx.closePath();
  ctx.fill();

  // Viền tóc sắc nét
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dải sáng Highlight óng ả trên mái tóc (Hair Sheen)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-3, headY - 17);
  ctx.lineTo(5, headY - 19);
  ctx.stroke();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-7, headY - 12);
  ctx.lineTo(-1, headY - 14);
  ctx.stroke();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 7. CÁNH TAY, GIÁP CẲNG TAY & THẦN KIẾM PHÁT QUANG (SWORD & ARM)
  // --------------------------------------------------------------------------
  ctx.save();
  // Hoạt cảnh vung chém xoay kiếm theo góc mượt mà
  if (player.attackTime > 0) {
    const swingProgress = (0.24 - player.attackTime) / 0.24;
    ctx.rotate(-1.25 + swingProgress * 2.9);
  } else if (!player.onGround) {
    ctx.rotate(-0.4); // Tư thế thủ kiếm trên không
  } else {
    ctx.rotate(0.12 + Math.sin(player.animTime || 0) * 0.06); // Nhịp kiếm khi đứng yên
  }

  // Cẳng tay áo giáp
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(7, -8 + breathe, 9, 7);

  // Giáp bọc cẳng tay kim loại mạ vàng (Vambrace)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(8, -8 + breathe, 6, 7);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(8, -8 + breathe, 6, 7);

  // Chuôi kiếm quấn da chiến binh
  ctx.fillStyle = '#451a03';
  ctx.fillRect(16, -6, 5, 17);

  // Vân dây quấn chuôi kiếm
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, -2); ctx.lineTo(21, 0);
  ctx.moveTo(16, 3); ctx.lineTo(21, 5);
  ctx.moveTo(16, 8); ctx.lineTo(21, 10);
  ctx.stroke();

  // Đốc kiếm chữ thập mạ vàng (Crossguard)
  const guardGrad = ctx.createLinearGradient(11, -3, 26, -3);
  guardGrad.addColorStop(0, '#fef08a');
  guardGrad.addColorStop(0.5, '#f59e0b');
  guardGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = guardGrad;

  ctx.beginPath();
  ctx.moveTo(11, -3);
  ctx.lineTo(26, -3);
  ctx.lineTo(24, 2);
  ctx.lineTo(13, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Viên ngọc đuôi chuôi kiếm (Pommel Jewel)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(18.5, 12.5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = tier.glow;
  ctx.beginPath();
  ctx.arc(18.5, 12.5, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // LƯỠI KIẾM PHÁT QUANG NEON BLOOM RỰC RỠ
  ctx.save();
  ctx.shadowColor = tier.glow;
  ctx.shadowBlur = 16; // Tỏa quầng sáng neon rực rỡ

  // Thân lưỡi kiếm vuốt nhọn sắc lẹm
  const bladeGrad = ctx.createLinearGradient(16, -5, 68, -11);
  bladeGrad.addColorStop(0, tier.color);
  bladeGrad.addColorStop(0.4, '#ffffff');
  bladeGrad.addColorStop(1, tier.glow);
  ctx.fillStyle = bladeGrad;

  ctx.beginPath();
  ctx.moveTo(17, -5);
  ctx.lineTo(68, -10.5); // Mũi kiếm vát dài sắc nhọn
  ctx.lineTo(56, 1.5);
  ctx.lineTo(17, 1.5);
  ctx.closePath();
  ctx.fill();

  // Sống kiếm & Phù văn ma thuật phát sáng
  ctx.strokeStyle = tier.glow;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(21, -2);
  ctx.lineTo(52, -5);
  ctx.stroke();

  // Ký tự phù văn nhỏ dọc theo rãnh kiếm
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(28, -2.5, 2.5, 1.2);
  ctx.fillRect(36, -3.5, 3, 1.2);
  ctx.fillRect(44, -4.5, 2.5, 1.2);

  // Lưỡi cắt bạc sáng chói
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(18, -4.5);
  ctx.lineTo(67, -10);
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // Hoàn thành vẽ kiếm & tay

  // --------------------------------------------------------------------------
  // 8. VỆT SÁNG VUNG ĐAO 2 LỚP & TIA LỬA COMBO (DUAL-LAYER SLASH ARC)
  // --------------------------------------------------------------------------
  if (player.attackTime > 0) {
    ctx.save();
    const slashAlpha = Math.min(1, player.attackTime / 0.16);
    ctx.globalAlpha = slashAlpha;
    ctx.shadowColor = tier.glow;
    ctx.shadowBlur = player.combo === 3 ? 28 : 14;

    // Lớp 1: Vệt hào quang năng lượng bán nguyệt bên ngoài
    ctx.strokeStyle = tier.glow;
    ctx.lineWidth = player.combo === 3 ? 10 : 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(8, 0, 58, -1.3, 0.95);
    ctx.stroke();

    // Lớp 2: Lõi chém trắng tinh khiết cực kỳ bén ngọt
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = player.combo === 3 ? 3.8 : 2.2;
    ctx.beginPath();
    ctx.arc(8, 0, 58, -1.0, 0.75);
    ctx.stroke();

    // Nếu là đòn chém Combo 3 uy lực: Tạo thêm các tia sét / tia lửa năng lượng
    if (player.combo === 3) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(48, -35); ctx.lineTo(62, -45);
      ctx.moveTo(58, -10); ctx.lineTo(72, -12);
      ctx.moveTo(46, 25); ctx.lineTo(60, 35);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore(); // Khôi phục trạng thái khung hình
}
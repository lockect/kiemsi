// ==========================================================================
  // HÀM VẼ NHÂN VẬT KAITO CHI TIẾT CAO (HIGH-DETAIL VECTOR ANIME RENDERER)
  // ==========================================================================
  function drawHero() {
    if (!player) return;

    const screenX = player.x - cameraX;
    const screenY = player.y;

    ctx.save();
    ctx.translate(screenX + player.w / 2, screenY + player.h / 2);

    // Hiệu ứng chớp nháy mềm khi đang bất tử
    if (player.invuln > 0) {
      ctx.globalAlpha = Math.floor(worldTime * 24) % 2 === 0 ? 0.35 : 0.85;
    }

    // Đổi hướng nhìn Trái / Phải
    ctx.scale(player.face, 1);

    const moving = Math.abs(player.vx) > 10 && player.onGround;
    const runCycle = Math.sin(player.animTime) * (moving ? 7 : 1.2);
    const breathe = Math.sin(worldTime * 4) * 1.5;
    const tier = SWORD_TIERS[swordTier];

    // ------------------------------------------------------------------------
    // 1. BÓNG ĐỔ NỀN ĐẤT (Radial Gradient Shadow)
    // ------------------------------------------------------------------------
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(0, player.h / 2 - 2, 2, 0, player.h / 2 - 2, 26);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    shadowGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.3)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, player.h / 2 - 2, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ------------------------------------------------------------------------
    // 2. KHĂN CHOÀNG CHIẾN BINH BAY THEO GIÓ (Cape / Scarf With Flowing Curves)
    // ------------------------------------------------------------------------
    ctx.save();
    const capeLag = moving ? (player.face > 0 ? 12 : -12) : 0;
    const capeWave = Math.sin(worldTime * 8) * 4;
    const capeGrad = ctx.createLinearGradient(-10, -14, -36, 22);
    capeGrad.addColorStop(0, '#0284c7');
    capeGrad.addColorStop(0.5, '#0369a1');
    capeGrad.addColorStop(1, '#082f49');

    ctx.fillStyle = capeGrad;
    ctx.beginPath();
    ctx.moveTo(-6, -14 + breathe);
    ctx.quadraticCurveTo(-22, -4, -28 - capeLag, 18 + runCycle + capeWave);
    ctx.quadraticCurveTo(-18, 22, -10, 14 + breathe);
    ctx.quadraticCurveTo(-2, 2, 6, -8 + breathe);
    ctx.closePath();
    ctx.fill();

    // Viền sáng cho khăn choàng
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // ------------------------------------------------------------------------
    // 3. ĐÔI CHÂN & ỦNG CHIẾN BINH (Boots & Greaves)
    // ------------------------------------------------------------------------
    // Quần đen bó sát
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Chân sau
    ctx.moveTo(-7, 10 + breathe);
    ctx.lineTo(-11 + runCycle, 24);
    // Chân trước
    ctx.moveTo(7, 10 + breathe);
    ctx.lineTo(11 - runCycle, 24);
    ctx.stroke();

    // Giáp bảo hộ chân trước (Greaves)
    const drawBoot = (bx, by) => {
      ctx.save();
      const bootGrad = ctx.createLinearGradient(bx, by, bx, by + 10);
      bootGrad.addColorStop(0, '#f59e0b');
      bootGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = bootGrad;
      ctx.beginPath();
      ctx.roundRect(bx - 7, by, 14, 8, [2, 5, 3, 2]);
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    drawBoot(-11 + runCycle, 22);
    drawBoot(11 - runCycle, 22);

    // ------------------------------------------------------------------------
    // 4. GIÁP THÂN & VAI CHIẾN BINH (Layered Armor & Breastplate)
    // ------------------------------------------------------------------------
    ctx.save();
    // Áo lót sẫm màu
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-14, -18 + breathe, 28, 30, [4, 4, 6, 6]);
    ctx.fill();

    // Giáp ngực ánh kim (Metallic Chestplate)
    const armorGrad = ctx.createLinearGradient(0, -18 + breathe, 0, 10 + breathe);
    armorGrad.addColorStop(0, '#ffffff');
    armorGrad.addColorStop(0.3, '#e2e8f0');
    armorGrad.addColorStop(0.7, '#94a3b8');
    armorGrad.addColorStop(1, '#475569');

    ctx.fillStyle = armorGrad;
    ctx.beginPath();
    ctx.moveTo(-12, -16 + breathe);
    ctx.lineTo(12, -16 + breathe);
    ctx.lineTo(10, 8 + breathe);
    ctx.lineTo(0, 13 + breathe); // Đáy nhọn chữ V
    ctx.lineTo(-10, 8 + breathe);
    ctx.closePath();
    ctx.fill();

    // Viền kim loại sáng bóng của giáp ngực
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Lõi năng lượng ngực (Core Gem)
    ctx.fillStyle = tier.glow;
    ctx.shadowColor = tier.glow;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -3 + breathe, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Tắt bloom để vẽ chi tiết khác

    // Đai lưng & thắt lưng da
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-11, 8 + breathe, 22, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, 7 + breathe, 6, 6); // Mặt khóa vàng
    ctx.restore();

    // ------------------------------------------------------------------------
    // 5. ĐẦU, MẶT ANIME & TÓC BỒNG BỀNH (Anime Head & Styled Hair)
    // ------------------------------------------------------------------------
    ctx.save();
    const headY = -28 + breathe * 0.8;

    // Khuôn mặt (Cằm V-line anime)
    const skinGrad = ctx.createLinearGradient(0, headY - 14, 0, headY + 12);
    skinGrad.addColorStop(0, '#ffedd5');
    skinGrad.addColorStop(1, '#fed7aa');
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.moveTo(-11, headY - 6);
    ctx.lineTo(-11, headY + 2);
    ctx.quadraticCurveTo(-8, headY + 12, 0, headY + 14); // Cằm
    ctx.quadraticCurveTo(8, headY + 12, 11, headY + 2);
    ctx.lineTo(11, headY - 6);
    ctx.closePath();
    ctx.fill();

    // Đôi mắt Anime tinh anh
    // Lòng trắng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(3, headY - 2, 7, 5, 2);
    ctx.fill();
    // Đồng tử ánh xanh lam
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(5, headY - 2, 3.5, 5);
    // Điểm sáng phản chiếu trong mắt (Catchlight)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, headY - 2, 1.2, 1.5);
    // Lông mày sắc sảo
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(2, headY - 5);
    ctx.lineTo(10, headY - 3);
    ctx.stroke();

    // Tóc kiếm sĩ nhiều lớp (Multi-layer Hair Strands)
    const hairGrad = ctx.createLinearGradient(0, headY - 20, 0, headY + 6);
    hairGrad.addColorStop(0, '#334155');
    hairGrad.addColorStop(0.5, '#1e293b');
    hairGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = hairGrad;

    ctx.beginPath();
    ctx.moveTo(-13, headY - 2);
    ctx.quadraticCurveTo(-16, headY - 18, -6, headY - 22);
    ctx.lineTo(-2, headY - 16);
    ctx.lineTo(6, headY - 24); // Đỉnh tóc dựng cao
    ctx.lineTo(11, headY - 15);
    ctx.lineTo(16, headY - 10);
    ctx.quadraticCurveTo(13, headY + 4, 10, headY + 6); // Lọn tóc mai
    ctx.lineTo(6, headY - 4);
    ctx.lineTo(1, headY + 2); // Mái chéo giữa trán
    ctx.lineTo(-4, headY - 6);
    ctx.lineTo(-10, headY + 4);
    ctx.closePath();
    ctx.fill();

    // Nét highlight óng ả trên mái tóc
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-4, headY - 17);
    ctx.lineTo(4, headY - 18);
    ctx.stroke();
    ctx.restore();

    // ------------------------------------------------------------------------
    // 6. THANH KIẾM HUYỀN THOẠI & HÀO QUANG (Sword Model with Bloom Glow)
    // ------------------------------------------------------------------------
    ctx.save();
    // Tính góc xoay kiếm theo đòn đánh hoặc chuyển động
    if (player.attackTime > 0) {
      const swingProgress = (0.24 - player.attackTime) / 0.24;
      ctx.rotate(-1.2 + swingProgress * 2.8);
    } else if (!player.onGround) {
      ctx.rotate(-0.4);
    } else {
      ctx.rotate(0.12 + Math.sin(player.animTime) * 0.06);
    }

    // Chuôi & Đốc kiếm mạ vàng
    ctx.fillStyle = '#451a03';
    ctx.fillRect(14, -6, 6, 16);
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, -2, 14, 4);
    ctx.fillRect(10, -2, 14, 4);

    // Viên ngọc đốc kiếm (Pommel Jewel)
    ctx.fillStyle = tier.glow;
    ctx.beginPath();
    ctx.arc(17, 12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Lưỡi kiếm sắc bén (Blade with Dynamic Lighting & Glow)
    ctx.save();
    ctx.shadowColor = tier.glow;
    ctx.shadowBlur = 14; // Hào quang tỏa sáng xung quanh kiếm

    const bladeGrad = ctx.createLinearGradient(14, -4, 62, -10);
    bladeGrad.addColorStop(0, tier.color);
    bladeGrad.addColorStop(0.7, '#ffffff');
    bladeGrad.addColorStop(1, tier.glow);
    ctx.fillStyle = bladeGrad;

    ctx.beginPath();
    ctx.moveTo(16, -5);
    ctx.lineTo(62, -11); // Mũi kiếm nhọn dài
    ctx.lineTo(52, 1);
    ctx.lineTo(16, 1);
    ctx.closePath();
    ctx.fill();

    // Rãnh máu & Sống kiếm phát quang (Fuller line)
    ctx.strokeStyle = tier.glow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, -2);
    ctx.lineTo(48, -5);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // Khôi phục trạng thái xoay của kiếm

    // ------------------------------------------------------------------------
    // 7. VỆT SÁNG VUNG KIẾM (Dynamic Curved Slash Arc)
    // ------------------------------------------------------------------------
    if (player.attackTime > 0) {
      ctx.save();
      const slashAlpha = Math.min(1, player.attackTime / 0.16);
      ctx.globalAlpha = slashAlpha;
      ctx.shadowColor = tier.glow;
      ctx.shadowBlur = player.combo === 3 ? 24 : 12;

      // Vệt ngoài cùng (Hào quang)
      ctx.strokeStyle = tier.glow;
      ctx.lineWidth = player.combo === 3 ? 9 : 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(8, 0, 56, -1.3, 0.9);
      ctx.stroke();

      // Lõi vệt sáng trắng ở giữa (Tạo độ bén ngọt của nhát chém)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = player.combo === 3 ? 3.5 : 2;
      ctx.beginPath();
      ctx.arc(8, 0, 56, -1.0, 0.7);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore(); // Kết thúc dịch chuyển tọa độ nhân vật
  }
```[cite: 1]

---

### Những điểm nâng cấp chính trong bản vẽ mới:
1. **Áo giáp phân tầng & Lõi ngực:** Sử dụng dải màu gradient dọc thân (`#ffffff` chuyển dần sang xám thép `#475569`), có lõi ngọc tỏa sáng đồng bộ theo màu của cấp kiếm đang trang bị[cite: 1].
2. **Khuôn mặt & Tóc tỉ mỉ:** Tạo cằm nhọn anime, mắt có lòng trắng, đồng tử xanh và đốm bắt sáng (Catchlight) cùng mái tóc tỉa tầng có vệt phản chiếu[cite: 1].
3. **Thanh kiếm phát sáng chân thực (Bloom Glow):** Sử dụng `ctx.shadowBlur` và `ctx.shadowColor` làm thanh kiếm rực sáng trong không gian tối[cite: 1]. Mũi kiếm được vuốt thanh mảnh và có rãnh kiếm phát quang[cite: 1].
4. **Khăn choàng bay mềm mại:** Thay thế hình tam giác cứng trước đây bằng đường cong Bézier 2 chiều uốn lượn nhịp nhàng theo chuyển động chạy và thở của nhân vật[cite: 1].
5. **Vệt chém 2 lớp:** Có lớp ngoài rực màu kiếm và lõi giữa màu trắng tinh khôi, tạo cảm giác chém trúng đích dứt khoát và sắc sảo[cite: 1].
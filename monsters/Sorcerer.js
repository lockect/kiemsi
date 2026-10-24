/**
 * ============================================================================
 * MONSTERS/SORCERER.JS - NỮ PHÁP SƯ HƯ KHÔNG (ENCHANTING VOID SORCERESS)
 * ============================================================================
 * Thiết kế mới:
 * - Vóc dáng thon thả đồng hồ cát quyến rũ, váy dạ hội xẻ tà lơ lửng bay bổng.
 * - Mái tóc tím bạch kim dài mượt mà, khuôn mặt anime sắc sảo, mắt tím ma mị.
 * - Mũ phù thủy hắc ám cách điệu vành cong mềm mại, nẹp ngọc hư không.
 * - Đôi chân thon mang vớ đùi ren đen huyền ảo, lướt trên ma trận hư không.
 * - Tay cầm Quyền Trượng Trăng Khuyết (Void Crescent Staff) tụ ngọc phát quang.
 * ============================================================================
 */

function drawSorcerer(ctx, e, worldTime) {
  const w = e.w || 40;
  const h = e.h || 60;

  // Nhịp bồng bềnh lơ lửng không chạm đất
  const floatBob = Math.sin((worldTime || 0) * 3.5) * 3.5;
  const dressWave = Math.sin((worldTime || 0) * 6) * 4;
  const hairWave = Math.cos((worldTime || 0) * 5) * 3;

  ctx.save();
  ctx.translate(0, floatBob);

  // --------------------------------------------------------------------------
  // 1. MA TRẬN PHÙ VĂN HƯ KHÔNG XOAY DƯỚI CHÂN (ARCANE NEBULA)
  // --------------------------------------------------------------------------
  ctx.save();
  ctx.translate(0, h * 0.46);
  ctx.scale(1, 0.32); // Làm bẹt thành vòng tròn phối cảnh sàn

  // Vòng sáng ma thuật tỏa nhẹ
  ctx.strokeStyle = 'rgba(192, 38, 211, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.stroke();

  // Vòng phù văn xoay nhịp theo thời gian
  ctx.rotate((worldTime || 0) * 1.5);
  ctx.strokeStyle = 'rgba(232, 121, 249, 0.6)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.moveTo(Math.cos(angle) * 16, Math.sin(angle) * 16);
    ctx.lineTo(Math.cos(angle) * 25, Math.sin(angle) * 25);
  }
  ctx.stroke();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 2. MÁI TÓC BẠCH KIM TÍM DÀI PHÍA SAU (BACK HAIR)
  // --------------------------------------------------------------------------
  ctx.save();
  const backHairGrad = ctx.createLinearGradient(0, -h * 0.3, 0, h * 0.3);
  backHairGrad.addColorStop(0, '#f5d0fe');
  backHairGrad.addColorStop(0.4, '#c084fc');
  backHairGrad.addColorStop(1, '#581c87');
  ctx.fillStyle = backHairGrad;

  // Lọn tóc dài phía sau uốn lượn qua hông
  ctx.beginPath();
  ctx.moveTo(-6, -h * 0.2);
  ctx.quadraticCurveTo(-18, 0, -14 - hairWave, h * 0.28);
  ctx.lineTo(-4, h * 0.18);
  ctx.quadraticCurveTo(-2, 0, -2, -h * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 3. ĐÔI CHÂN THON THẢ & VỚ ĐÙI REN ĐEN (SEDUCTIVE LEGS)
  // --------------------------------------------------------------------------
  ctx.save();
  // Chân trụ phía sau
  ctx.strokeStyle = '#090514'; // Vớ đùi đen tuyền
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-3, h * 0.08);
  ctx.lineTo(-5, h * 0.36);
  ctx.stroke();

  // Chân trước thanh mảnh hơi chéo duyên dáng (Lộ qua tà váy xẻ)
  const legGrad = ctx.createLinearGradient(2, h * 0.02, 6, h * 0.4);
  legGrad.addColorStop(0, '#ffedd5'); // Đùi trắng sáng
  legGrad.addColorStop(0.35, '#fed7aa');
  legGrad.addColorStop(0.4, '#3b0764'); // Viền ren vớ đùi tím sẫm
  legGrad.addColorStop(1, '#090514'); // Giày gót nhọn hắc ám
  ctx.strokeStyle = legGrad;
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(3, h * 0.05);
  ctx.quadraticCurveTo(6, h * 0.2, 4, h * 0.4);
  ctx.stroke();

  // Giày gót nhọn ma thuật
  ctx.fillStyle = '#c026d3';
  ctx.beginPath();
  ctx.moveTo(2, h * 0.38);
  ctx.lineTo(7, h * 0.42);
  ctx.lineTo(2, h * 0.43);
  ctx.fill();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 4. VÁY DẠ HỘI GOTHIC HƯ KHÔNG XẺ TÀ (FLOWING CORSET DRESS)
  // --------------------------------------------------------------------------
  ctx.save();
  // Lớp tà váy lụa đen phía sau
  ctx.fillStyle = '#090514';
  ctx.beginPath();
  ctx.moveTo(-7, -h * 0.02);
  ctx.quadraticCurveTo(-18, h * 0.15, -16 - dressWave, h * 0.42);
  ctx.lineTo(-4, h * 0.35);
  ctx.lineTo(-2, h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Thân váy cúp ngực & eo thon đồng hồ cát
  const corsetGrad = ctx.createLinearGradient(0, -h * 0.18, 0, h * 0.1);
  corsetGrad.addColorStop(0, '#581c87');
  corsetGrad.addColorStop(0.5, '#3b0764');
  corsetGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = corsetGrad;

  // Đường cong eo thon và cúp ngực
  ctx.beginPath();
  ctx.moveTo(-6, -h * 0.14);
  ctx.quadraticCurveTo(0, -h * 0.12, 6, -h * 0.14); // Cúp ngực gợi cảm
  ctx.lineTo(5, -h * 0.02);
  ctx.quadraticCurveTo(3, h * 0.02, 5, h * 0.06);   // Eo thon gọn
  ctx.lineTo(-5, h * 0.06);
  ctx.quadraticCurveTo(-3, h * 0.02, -5, -h * 0.02);
  ctx.closePath();
  ctx.fill();

  // Viền chỉ vàng và đai ren eo
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Lõi ngọc Hư Không nhỏ trước ngực phát sáng
  ctx.save();
  ctx.fillStyle = '#e879f9';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(0, -h * 0.08, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tà váy tím xẻ tà bồng bềnh phía trước
  const skirtGrad = ctx.createLinearGradient(-10, 0, 10, h * 0.35);
  skirtGrad.addColorStop(0, '#7e22ce');
  skirtGrad.addColorStop(0.6, '#581c87');
  skirtGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = skirtGrad;

  ctx.beginPath();
  ctx.moveTo(-5, h * 0.05);
  ctx.quadraticCurveTo(-14, h * 0.2, -12 - dressWave, h * 0.38);
  ctx.quadraticCurveTo(-4, h * 0.34, 0, h * 0.25); // Xẻ tà để lộ chân thon
  ctx.lineTo(2, h * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 5. CỔ, VAI TRẦN & GƯƠNG MẶT ANIME XINH ĐẸP (ANIME FACE)
  // --------------------------------------------------------------------------
  ctx.save();
  const headY = -h * 0.26;

  // Cổ và vai trần trắng mịn
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.moveTo(-4, -h * 0.16);
  ctx.lineTo(4, -h * 0.16);
  ctx.lineTo(2, headY + 5);
  ctx.lineTo(-2, headY + 5);
  ctx.closePath();
  ctx.fill();

  // Gương mặt V-line thon gọn
  const skinGrad = ctx.createLinearGradient(0, headY - 8, 0, headY + 8);
  skinGrad.addColorStop(0, '#fff7ed');
  skinGrad.addColorStop(1, '#fed7aa');
  ctx.fillStyle = skinGrad;

  ctx.beginPath();
  ctx.moveTo(-7, headY - 4);
  ctx.lineTo(-7, headY + 2);
  ctx.quadraticCurveTo(-4, headY + 8, 0, headY + 9); // Cằm nhọn V-line
  ctx.quadraticCurveTo(4, headY + 8, 7, headY + 2);
  ctx.lineTo(7, headY - 4);
  ctx.closePath();
  ctx.fill();

  // Đôi môi mọng hồng quyến rũ
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(1.5, headY + 6, 1.2, 0, Math.PI);
  ctx.fill();

  // Đôi mắt Anime tím biếc ma mị
  // Viền mi mắt cong sắc sảo
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(1.5, headY);
  ctx.lineTo(6.5, headY + 0.5);
  ctx.stroke();

  // Lòng trắng mắt
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2, headY + 1, 4.5, 3.5);

  // Đồng tử tím ma pháp phát sáng
  ctx.save();
  ctx.fillStyle = '#c026d3';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 6;
  ctx.fillRect(3, headY + 1, 3, 3.5);

  // Đốm bắt sáng lấp lánh trong mắt
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4.2, headY + 1.8, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tóc mái trước trán tỉa lọn bồng bềnh
  ctx.fillStyle = '#e9d5ff';
  ctx.beginPath();
  ctx.moveTo(-7, headY - 3);
  ctx.lineTo(-2, headY + 3);
  ctx.lineTo(0, headY - 1);
  ctx.lineTo(4, headY + 4);
  ctx.lineTo(7, headY - 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 6. MŨ PHÙ THỦY GOTHIC HƯ KHÔNG (WITCH HAT)
  // --------------------------------------------------------------------------
  ctx.save();
  const hatY = -h * 0.3;

  // Vành mũ rộng cong mềm mại
  ctx.save();
  ctx.translate(0, hatY);
  ctx.rotate(-0.08); // Hơi nghiêng kiêu sa

  const hatGrad = ctx.createLinearGradient(-18, 0, 18, -25);
  hatGrad.addColorStop(0, '#1e1b4b');
  hatGrad.addColorStop(0.5, '#3b0764');
  hatGrad.addColorStop(1, '#090514');
  ctx.fillStyle = hatGrad;

  // Vành mũ uốn lượn
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 5.5, -0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Chóp nón cao vuốt cong nhọn về sau
  ctx.beginPath();
  ctx.moveTo(-9, -2);
  ctx.quadraticCurveTo(-14, -16, -6, -26);
  ctx.quadraticCurveTo(-2, -30, 2, -28); // Đỉnh chóp uốn nhẹ
  ctx.quadraticCurveTo(4, -16, 9, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dải ruy băng thắt nơ & đính hoa hồng ma thuật
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(-8.5, -4.5, 17, 3);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(-2, -3, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 7. TAY THON & GĂNG TAY REN DÀI (ARMS & SLEEVES)
  // --------------------------------------------------------------------------
  ctx.save();
  // Tay trái chống nhẹ bên eo kiêu sa
  ctx.strokeStyle = '#2e1065'; // Găng tay nhung đen tím dài qua khuỷu
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-5, -h * 0.12);
  ctx.lineTo(-10, -h * 0.04);
  ctx.lineTo(-5, 0);
  ctx.stroke();

  // Cánh tay phải vươn ra giữ quyền trượng
  ctx.beginPath();
  ctx.moveTo(5, -h * 0.12);
  ctx.lineTo(12, -h * 0.08);
  ctx.lineTo(15, -h * 0.02);
  ctx.stroke();

  // Bàn tay trắng thon thả nắm trượng
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.arc(15, -h * 0.02, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --------------------------------------------------------------------------
  // 8. QUYỀN TRƯỢNG TRĂNG KHUYẾT HƯ KHÔNG (VOID CRESCENT STAFF)
  // --------------------------------------------------------------------------
  ctx.save();
  const staffX = 16;
  const staffY = -h * 0.02;
  ctx.translate(staffX, staffY);

  // Thân trượng hắc kim thon dài viền vàng
  const staffGrad = ctx.createLinearGradient(0, -28, 0, 32);
  staffGrad.addColorStop(0, '#fbbf24');
  staffGrad.addColorStop(0.5, '#1e1b4b');
  staffGrad.addColorStop(1, '#090514');
  ctx.strokeStyle = staffGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(0, 32);
  ctx.stroke();

  // Đầu trượng hình Vầng Trăng Khuyết (Crescent Moon)
  ctx.save();
  ctx.translate(0, -26);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, 0, 9, -Math.PI * 0.7, Math.PI * 0.7, false);
  ctx.arc(3, 0, 7.5, Math.PI * 0.7, -Math.PI * 0.7, true);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Quả cầu ngọc Hư Không ở tâm vầng trăng (Pulsing Void Orb)
  const orbPulse = Math.sin((worldTime || 0) * 6) * 1.8;
  ctx.fillStyle = '#e879f9';
  ctx.shadowColor = '#c026d3';
  ctx.shadowBlur = 16; // Hào quang tỏa sáng rực rỡ
  ctx.beginPath();
  ctx.arc(2, 0, 5 + orbPulse, 0, Math.PI * 2);
  ctx.fill();

  // Lõi ánh sáng trắng tinh khiết
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(1, -1, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Bụi ma thuật tím li ti bay quanh đầu trượng
  ctx.fillStyle = '#f5d0fe';
  ctx.beginPath();
  ctx.arc(Math.cos((worldTime || 0) * 4) * 10, Math.sin((worldTime || 0) * 4) * 6, 1.4, 0, Math.PI * 2);
  ctx.arc(Math.cos((worldTime || 0) * 5 + 2) * 8, Math.sin((worldTime || 0) * 5 + 2) * 8, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  ctx.restore();
}
// Thêm vào cuối file monsters/Sorcerer.js:
function updateSorcererSkill(e, player, dt, ctxGame) {
  const dist = (player.x + player.w / 2) - (e.x + e.w / 2);
  e.castTimer = Math.max(0, (e.castTimer || 0) - dt);
  e.skillCd = (e.skillCd === undefined ? 0.5 : e.skillCd) - dt;

  if (e.skillCd <= 0 && Math.abs(dist) < 850) {
    e.skillCd = 2.5 + Math.random() * 1.3;
    e.castTimer = 0.6;
    ctxGame.playSkillSFX();

    const ex = e.x + e.w / 2;
    const ey = e.y + e.h / 2 - 10;
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    const angle = Math.atan2(py - ey, px - ex);

    [-0.28, 0, 0.28].forEach(angOffset => {
      const finalAng = angle + angOffset;
      ctxGame.projectiles.push({
        type: 'dark_fire',
        x: ex, y: ey,
        w: 22, h: 22,
        vx: Math.cos(finalAng) * 380,
        vy: Math.sin(finalAng) * 380,
        isPlayer: false,
        dmg: 20,
        color: '#c026d3',
        life: 2.8
      });
    });
    ctxGame.spawnParticleBurst(ex, ey, '#e879f9', 14, 180);
    ctxGame.say('PHÁP SƯ HƯ KHÔNG: BẮN 3 TIA MA PHÁP!', 2000);
  } else if (Math.abs(dist) > 4) {
    e.x += Math.sign(dist) * e.spd * dt;
  }
}
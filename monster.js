/**
 * ============================================================================
 * MONSTER.JS - BỘ ĐIỀU PHỐI KẾT XUẤT ĐỒ HỌA QUÁI VẬT & ĐẠI TRÙM CUỐI (BOSS)
 * ============================================================================
 * Tệp này đảm nhận:
 * 1. drawEnemies(): Lọc quái vật nằm trong khung nhìn camera, điều hướng gọi
 *    hàm vẽ chuyên biệt từ thư mục monsters/, hiển thị thanh máu trên đầu quái.
 * 2. drawBoss(): Chuyển tiếp dữ liệu sang monsters/Boss.js để vẽ chi tiết 4 Đại Boss,
 *    xử lý cảnh báo khi Boss chưa kích hoạt và hào quang cuồng nộ (Phase 2).
 * ============================================================================
 */

/**
 * Kết xuất toàn bộ quái vật thường trong màn chơi
 * @param {CanvasRenderingContext2D} ctx - Ngữ cảnh đồ họa Canvas 2D
 * @param {Array} enemies - Danh sách các đối tượng quái vật hiện có
 * @param {number} cameraX - Tọa độ cuộn camera theo trục ngang
 * @param {number} W - Chiều rộng khung nhìn Canvas
 * @param {number} worldTime - Tổng thời gian thế giới game (dùng cho hoạt ảnh)
 */
function drawEnemies(ctx, enemies, cameraX, W, worldTime) {
  if (!ctx || !enemies) return;

  for (const e of enemies) {
    if (!e.alive) continue;

    // Tọa độ trên màn hình sau khi trừ độ dịch camera
    const screenX = e.x - cameraX;

    // Tối ưu hóa hiệu năng (Frustum Culling): Bỏ qua quái nằm ngoài màn hình
    if (screenX + e.w < -60 || screenX > W + 60) continue;

    ctx.save();
    // Di chuyển gốc tọa độ về tâm của quái vật
    ctx.translate(screenX + e.w / 2, e.y + e.h / 2);
    // Lật hướng nhìn theo thuộc tính face (1: Phải, -1: Trái)
    ctx.scale(e.face || -1, 1);

    // Hiệu ứng nhấp nháy trắng đỏ khi vừa nhận sát thương
    if (e.flash > 0) {
      ctx.globalAlpha = 0.55;
    }

    // ------------------------------------------------------------------------
    // ĐIỀU HƯỚNG GỌI HÀM VẼ TỪ TỪNG FILE MONSTER TƯƠNG ỨNG
    // ------------------------------------------------------------------------
    switch (e.type) {
      // === QUÁI VẬT MÀN 1 -> MÀN 4 ===
      case 'slime':
        if (typeof drawSlime === 'function') drawSlime(ctx, e);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'goblin':
        if (typeof drawGoblin === 'function') drawGoblin(ctx, e);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'skeleton':
        if (typeof drawSkeleton === 'function') drawSkeleton(ctx, e);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'bat':
        if (typeof drawBat === 'function') drawBat(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'sorcerer':
        if (typeof drawSorcerer === 'function') drawSorcerer(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'dark_knight':
        if (typeof drawDarkKnight === 'function') drawDarkKnight(ctx, e);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'shadow_gargoyle':
        if (typeof drawObsidianDemon === 'function') drawObsidianDemon(ctx, e, worldTime);
        else if (typeof drawShadowGargoyle === 'function') drawShadowGargoyle(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'void_drake':
        if (typeof drawDarklingDragon === 'function') drawDarklingDragon(ctx, e, worldTime);
        else if (typeof drawVoidDrake === 'function') drawVoidDrake(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      // === QUÁI VẬT MÀN 5 (BĂNG NGUYÊN VĨNH CỬU) ===
      case 'frost_stalker':
        if (typeof drawFrostStalker === 'function') drawFrostStalker(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'glacial_bat':
        if (typeof drawGlacialBat === 'function') drawGlacialBat(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      // === QUÁI VẬT MÀN 6 (ĐỈNH NÚI LÔI VÂN) ===
      case 'storm_raven':
        if (typeof drawStormRaven === 'function') drawStormRaven(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'thunder_ape':
        if (typeof drawThunderApe === 'function') drawThunderApe(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      // === QUÁI VẬT MÀN 7 (LÒ LUYỆN DUNG NHAM) ===
      case 'magma_brute':
        if (typeof drawMagmaBrute === 'function') drawMagmaBrute(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'lava_crawler':
        if (typeof drawLavaCrawler === 'function') drawLavaCrawler(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      // === QUÁI VẬT MÀN 8 (THÀNH PHỐ THIÊN KHÔNG) ===
      case 'sanctuary_golem':
        if (typeof drawSanctuaryGolem === 'function') drawSanctuaryGolem(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'fallen_cherub':
        if (typeof drawFallenCherub === 'function') drawFallenCherub(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      // === QUÁI VẬT MÀN 9 (KHE NỨT HỖN MANG) ===
      case 'void_devourer':
        if (typeof drawVoidDevourer === 'function') drawVoidDevourer(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      case 'rift_phantom':
        if (typeof drawRiftPhantom === 'function') drawRiftPhantom(ctx, e, worldTime);
        else fallbackDrawEnemy(ctx, e);
        break;

      // Quái vật chưa xác định (Dự phòng)
      default:
        fallbackDrawEnemy(ctx, e);
        break;
    }

    ctx.restore();

    // ------------------------------------------------------------------------
    // THANH MÁU NHỎ TRÊN ĐẦU QUÁI VẬT (CHỈ HIỆN KHI ĐÃ BỊ THƯƠNG)
    // ------------------------------------------------------------------------
    if (e.hp < e.maxHp && e.hp > 0) {
      const barW = Math.max(28, e.w);
      const barH = 4;
      const barX = screenX + e.w / 2 - barW / 2;
      const barY = e.y - 12;
      const hpRatio = Math.max(0, Math.min(1, e.hp / e.maxHp));

      ctx.save();
      // Khung viền nền đen trong suốt
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

      // Thanh máu đỏ/cam chuyển màu theo phần trăm HP
      const hpGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
      hpGrad.addColorStop(0, '#ef4444');
      hpGrad.addColorStop(1, '#f97316');
      ctx.fillStyle = hpGrad;
      ctx.fillRect(barX, barY, barW * hpRatio, barH);
      ctx.restore();
    }
  }
}

/**
 * Hàm vẽ dự phòng hình khối cơ bản nếu tệp vẽ chuyên biệt chưa được nạp
 */
function fallbackDrawEnemy(ctx, e) {
  ctx.fillStyle = e.color || '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(-e.w / 2, -e.h / 2, e.w, e.h, 6);
  ctx.fill();

  // Mắt đỏ phát sáng
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(e.w * 0.1, -e.h * 0.2, 4, 4);
}

/**
 * Kết xuất Trùm Cuối (Boss) trong màn chơi
 * @param {CanvasRenderingContext2D} ctx - Ngữ cảnh đồ họa Canvas
 * @param {Object} boss - Đối tượng Boss hiện tại
 * @param {number} cameraX - Tọa độ cuộn camera
 * @param {number} W - Chiều rộng Canvas
 * @param {number} stageIndex - Chỉ mục màn chơi hiện tại (0 -> 3+)
 * @param {number} worldTime - Tổng thời gian thế giới game
 */
function drawBoss(ctx, boss, cameraX, W, stageIndex, worldTime) {
  if (!boss || boss.dead || !ctx) return;

  const screenX = boss.x - cameraX;
  // Bỏ qua nếu Boss nằm hoàn toàn ngoài tầm hiển thị
  if (screenX + boss.w < -120 || screenX > W + 120) return;

  // Chuyển toàn bộ quyền vẽ đồ họa sang hàm Master trong monsters/Boss.js
  if (typeof drawBossDetail === 'function') {
    drawBossDetail(ctx, boss, cameraX, W, stageIndex, worldTime);
    return;
  }

  // --- PHƯƠNG ÁN DỰ PHÒNG NẾU monsters/Boss.js CHƯA NẠP ---
  ctx.save();
  ctx.translate(screenX + boss.w / 2, boss.y + boss.h / 2);
  ctx.scale(boss.face || -1, 1);

  if (boss.flash > 0) ctx.globalAlpha = 0.6;

  // Thân Boss
  ctx.fillStyle = stageIndex === 3 ? '#1e1b4b' : (stageIndex === 2 ? '#3b0764' : (stageIndex === 1 ? '#78350f' : '#1e3a5f'));
  ctx.beginPath();
  ctx.roundRect(-boss.w / 2, -boss.h / 2, boss.w, boss.h, 14);
  ctx.fill();

  // Đôi mắt đỏ phát sáng
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.fillRect(8, -boss.h / 4, 12, 6);
  ctx.fillRect(26, -boss.h / 4, 12, 6);

  // Viền cảnh báo Phase 2 (Cuồng nộ)
  if (boss.phase === 2) {
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 4;
    ctx.strokeRect(-boss.w / 2 - 3, -boss.h / 2 - 3, boss.w + 6, boss.h + 6);
  }

  ctx.restore();

  // Hiển thị chữ cảnh báo khi Boss đang chờ phía trước
  if (!boss.active) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;
    ctx.fillText('⚠ TRÙM CUỐI ĐANG CHỜ PHÍA TRƯỚC', screenX + boss.w / 2, boss.y - 18);
    ctx.restore();
  }
}
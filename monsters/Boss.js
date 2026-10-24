/**
 * ============================================================================
 * MONSTERS/BOSS.JS - BỘ ĐIỀU PHỐI KẾT XUẤT 10 ĐẠI TRÙM CUỐI (BOSS DISPATCHER)
 * ============================================================================
 * Đảm nhiệm:
 * 1. Kiểm tra giới hạn camera (Frustum Culling) và căn tâm Boss.
 * 2. Cảnh báo Boss đang chờ phía trước.
 * 3. Chuyển tiếp tới hàm vẽ Master trong 10 file Boss độc lập tương ứng.
 * ============================================================================
 */

function drawBossDetail(ctx, boss, cameraX, W, stageIndex, worldTime) {
  if (!boss || boss.dead || !ctx) return;
  const screenX = boss.x - cameraX;
  if (screenX + boss.w < -180 || screenX > W + 180) return;

  ctx.save();
  ctx.translate(screenX + boss.w / 2, boss.y + boss.h / 2);
  ctx.scale(boss.face || -1, 1);

  if (boss.flash > 0) ctx.globalAlpha = 0.55;

  const isP2 = boss.phase === 2;
  const anim = boss.animTime || 0;

  // 1. BÓNG ĐỔ DƯỚI SÀN DÙNG CHUNG
  ctx.save();
  const shadowRadius = boss.w * 0.55;
  const shadowGrad = ctx.createRadialGradient(0, boss.h / 2 - 2, 4, 0, boss.h / 2 - 2, shadowRadius);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  shadowGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.35)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(0, boss.h / 2 - 2, shadowRadius, stageIndex === 3 ? 12 : 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. PHÂN LUỒNG GỌI HÀM DRAW CỦA TỪNG FILE BOSS ĐỘC LẬP (0 -> 9)
  switch (stageIndex) {
    case 0:
      if (typeof drawBossHacLangMaster === 'function') drawBossHacLangMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 1:
      if (typeof drawBossKySiTroTanMaster === 'function') drawBossKySiTroTanMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 2:
      if (typeof drawBossChuaTeBongDemMaster === 'function') drawBossChuaTeBongDemMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 3:
      if (typeof drawBossRongBongToiMaster === 'function') drawBossRongBongToiMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 4:
      if (typeof drawBossYmirMaster === 'function') drawBossYmirMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 5:
      if (typeof drawBossThunderbirdMaster === 'function') drawBossThunderbirdMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 6:
      if (typeof drawBossSurtrMaster === 'function') drawBossSurtrMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 7:
      if (typeof drawBossSeraphMaster === 'function') drawBossSeraphMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 8:
      if (typeof drawBossChronosMaster === 'function') drawBossChronosMaster(ctx, boss, anim, isP2, worldTime);
      break;
    case 9:
      if (typeof drawBossPrimordialMaster === 'function') drawBossPrimordialMaster(ctx, boss, anim, isP2, worldTime);
      break;
    default:
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-boss.w / 2, -boss.h / 2, boss.w, boss.h);
      break;
  }

  ctx.restore();

  // 3. CẢNH BÁO BOSS ĐANG CHỜ PHÍA TRƯỚC
  if (!boss.active) {
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 10;
    ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ TRÙM CUỐI ĐANG CHỜ PHÍA TRƯỚC', screenX + boss.w / 2, boss.y - 20);
    ctx.restore();
  }
}
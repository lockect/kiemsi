/**
 * ============================================================================
 * TRÒ CHƠI: KIẾM SĨ HUYỀN THOẠI (LEGENDARY SWORDSMAN)
 * TỆP GAME02.JS - PHẦN 2: VÒNG LẶP ENGINE, AI 10 BOSS, RENDER & GIAO DIỆN
 * ============================================================================
 * DANH MỤC THẺ TÌM KIẾM NHANH (Bấm Ctrl + F để tra cứu trực tiếp):
 * - [TÌM KIẾM: UPDATE_PHYSICS]   : Vòng lặp vật lý, vận tốc, bục sàn, bẫy gai.
 * - [TÌM KIẾM: DOUBLE_JUMP]      : Cơ chế Nhảy Đôi giữa không trung (Giày Cấp 8 trở lên).
 * - [TÌM KIẾM: HOOK_MONSTER_AI]  : Điều phối Skill 18 quái vật (Fallen Cherub hồi 70%, Phantom hồi 30%).
 * - [TÌM KIẾM: AI_10_BOSS]       : AI 10 Boss (Seraph hồi 15%, Chronos Vòng Sáng & Hố Đen, Sáng Thế Thần).
 * - [TÌM KIẾM: PROJECTILES_LOOP] : Vòng lặp va chạm đường đạn, lực hút Hố Đen, sóng xung kích.
 * - [TÌM KIẾM: RENDER_PIPELINE]  : Vẽ Canvas 60 FPS, Vòng Sáng Đen, Khiên Miễn Thương, tia sét Stun.
 * - [TÌM KIẾM: BESTIARY_PREVIEW] : Xem trước mô hình hoạt họa trong Bách Khoa Quái.
 * - [TÌM KIẾM: MAIN_LOOP]        : Vòng lặp requestAnimationFrame chính của engine.
 * - [TÌM KIẾM: TAB_UPGRADE]      : Giao diện và logic Nâng Cấp 3 Tab (Kiếm / Giáp / Giày).
 * - [TÌM KIẾM: INPUT_CONTROLS]   : Xử lý bàn phím, điều khiển cảm ứng di động.
 * - [TÌM KIẾM: STAGE_SELECT_9999]: Luồng mở khóa và bảng chọn nhanh 10 màn chơi.
 * ============================================================================
 */

// ============================================================================
// [TÌM KIẾM: UPDATE_PHYSICS] VÒNG LẶP VẬT LÝ VÀ TRẠNG THÁI TOÀN THẾ GIỚI
// ============================================================================
function update(dt) {
  worldTime += dt;

  // Xử lý bộ đếm thời gian hiển thị thông báo Toast
  if (toastTimer > 0) {
    toastTimer -= dt * 1000;
    if (toastTimer <= 0 && toast) toast.hidden = true;
  }

  // Nếu game chưa bắt đầu hoặc đang tạm dừng thì bỏ qua cập nhật
  if (!running || paused) return;

  // Đếm lùi các mốc hồi chiêu của nhân vật Kaito
  player.attackCd = Math.max(0, player.attackCd - dt);
  player.attackTime = Math.max(0, player.attackTime - dt);
  player.skillCd = Math.max(0, player.skillCd - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.dashCd = Math.max(0, (player.dashCd || 0) - dt); // Hồi chiêu Lướt chuẩn 0.5s
  player.stunTimer = Math.max(0, (player.stunTimer || 0) - dt);

  // Nếu Kaito đang dính trạng thái Tê Liệt (Stun): Khóa hoạt họa và đứng hình bất động
  if (player.stunTimer > 0) {
    player.vx = 0;
  } else {
    player.animTime += dt * 9;
  }

  // Bộ đếm chuỗi Combo chém 3 nhát
  player.comboTimer -= dt;
  if (player.comboTimer <= 0) player.combo = 0;

  // Tự động hồi phục Năng lượng Mana (7 MP mỗi giây)
  player.mana = Math.min(player.maxMana, player.mana + 7 * dt);

  // Nhận tín hiệu phím di chuyển Trái / Phải
  var left = keys.ArrowLeft || keys.KeyA;
  var right = keys.ArrowRight || keys.KeyD;

  // Lấy chỉ số Giày hiện tại để tính tốc độ chạy và lực nhảy
  var currentBoots = BOOTS_TIERS[bootsTier] || { spdMult: 1.0, jumpMult: 1.0, canDoubleJump: false };

  // --- 1. TÍNH TOÁN VẬN TỐC DI CHUYỂN NGANG (VX) ---
  if (player.stunTimer > 0) {
    player.vx = 0;
  } else if (player.dashTimer > 0) {
    // Vận tốc lướt nhanh (nếu mang Giày Tốc Biến Cấp 9-10 sẽ tăng thêm 30% tốc độ lướt)
    player.vx = player.face * (620 * (currentBoots.canBlink ? 1.3 : 1.0));
  } else {
    // Vận tốc đi bộ cơ bản nhân với hệ số tốc độ của Giày
    player.vx = (left ? -1 : 0) + (right ? 1 : 0);
    player.vx *= (240 * currentBoots.spdMult);
    if (left && !right) player.face = -1;
    if (right && !left) player.face = 1;
  }

  // ==========================================================================
  // [TÌM KIẾM: DOUBLE_JUMP] XỬ LÝ NHẢY & NHẢY ĐÔI (DOUBLE JUMP)
  // ==========================================================================
  if ((keys.Space || keys.ArrowUp || keys.KeyW) && player.stunTimer <= 0) {
    var baseJumpForce = -600 * currentBoots.jumpMult; // Lực nhảy cơ bản theo Giày

    // Cú nhảy 1: Khi Kaito đang đứng chạm mặt đất/bục sàn
    if (player.onGround) {
      player.vy = baseJumpForce;
      player.onGround = false;
      player.jumpCount = 1;
      playJumpSFX();
      spawnParticleBurst(player.x + player.w / 2, player.y + player.h, '#94a3b8', 6, 80);
    }
    // Cú nhảy 2: Giữa không trung (Kích hoạt khi trang bị Giày Cấp 8 trở lên)
    else if (currentBoots.canDoubleJump && player.jumpCount === 1) {
      player.vy = baseJumpForce * 0.75; // Cú nhảy đôi đạt 75% lực nhảy cơ bản
      player.jumpCount = 2;             // Đã sử dụng hết số lần nhảy
      playJumpSFX();
      spawnFloatingPopup(player.x + player.w / 2, player.y, 'NHẢY ĐÔI!', '#38bdf8', 1.2);
      spawnParticleBurst(player.x + player.w / 2, player.y + player.h, '#fde047', 14, 180);
    }
    // Hủy cờ phím nhảy để tránh giữ phím tự động nhảy liên tục
    keys.Space = keys.ArrowUp = keys.KeyW = false;
  }

  // Áp dụng trọng lực rơi tự do và cập nhật tọa độ Kaito
  player.vy += 1680 * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // Giới hạn Kaito không đi ra khỏi biên bản đồ màn chơi
  var levelLength = STAGES[stageIndex].length;
  player.x = clamp(player.x, 0, levelLength - player.w);

  // --- XỬ LÝ VA CHẠM BỤC SÀN ĐỊA HÌNH (PLATFORMS) ---
  player.onGround = false;
  for (var plat of platforms) {
    if (rectIntersect(player.x, player.y, player.w, player.h, plat.x, plat.y, plat.w, plat.h)) {
      // Khi đang rơi xuống và bàn chân chạm mặt trên của bục sàn
      if (player.vy >= 0 && player.y + player.h - player.vy * dt <= plat.y + 14) {
        player.y = plat.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.jumpCount = 0; // Đặt lại bộ đếm lượt nhảy khi tiếp đất
      }
    }
  }

  // Khi rơi xuống vực thẳm dưới đáy màn hình
  if (player.y > H + 180) {
    damagePlayer(30, player.x);
    player.x = checkpoint.active ? checkpoint.x : checkpointX;
    player.y = 350;
    player.vy = 0;
  }

  // Kích hoạt cột cờ Điểm Lưu (Checkpoint)
  if (checkpoint && !checkpoint.active && rectIntersect(player.x, player.y, player.w, player.h, checkpoint.x, checkpoint.y, checkpoint.w, checkpoint.h)) {
    checkpoint.active = true;
    checkpointX = checkpoint.x;
    say('ĐÃ KÍCH HOẠT ĐIỂM KIỂM TRA!');
    playChestSFX();
  }

  // Va chạm bẫy gai nhọn (Giáp Hỏa Ngục Cấp 7 trở lên miễn nhiễm hoàn toàn)
  for (var haz of hazards) {
    if (rectIntersect(player.x, player.y, player.w, player.h, haz.x, haz.y, haz.w, haz.h)) {
      if (armorTier >= 6) {
        // Miễn nhiễm sát thương bẫy gai
      } else {
        damagePlayer(18, haz.x + haz.w / 2);
      }
    }
  }

  // Ngữ cảnh truyền cho các tệp quái vật riêng (đã có playSynthSound chống crash game)[cite: 5]
  var ctxGame = {
    projectiles,
    worldTime,
    playSynthSound, // Đảm bảo luôn sẵn sàng cho quái gọi âm thanh[cite: 5]
    playJumpSFX, playSlashSFX, playSkillSFX, playDashSFX, playHitSFX, playBossRoarSFX,
    spawnParticleBurst, spawnFloatingPopup, damagePlayer,
    say, shakeScreen: s => { shake = s; }
  };

  // ==========================================================================
  // [TÌM KIẾM: HOOK_MONSTER_AI] BẢNG ĐIỀU PHỐI SKILL QUÁI VẬT TỰ ĐỘNG
  // ==========================================================================
  var monsterSkillHandlers = {
    slime: typeof updateSlimeSkill === 'function' ? updateSlimeSkill : null,
    skeleton: typeof updateSkeletonSkill === 'function' ? updateSkeletonSkill : null,
    sorcerer: typeof updateSorcererSkill === 'function' ? updateSorcererSkill : null,
    frost_stalker: typeof updateFrostStalkerSkill === 'function' ? updateFrostStalkerSkill : null,
    glacial_bat: typeof updateGlacialBatSkill === 'function' ? updateGlacialBatSkill : null,
    lava_crawler: typeof updateLavaCrawlerSkill === 'function' ? updateLavaCrawlerSkill : null,
    shadow_gargoyle: typeof updateObsidianDemonSkill === 'function' ? updateObsidianDemonSkill : null,
    void_drake: typeof updateDarklingDragonSkill === 'function' ? updateDarklingDragonSkill : null,
    storm_raven: typeof updateStormRavenSkill === 'function' ? updateStormRavenSkill : null,
    thunder_ape: typeof updateThunderApeSkill === 'function' ? updateThunderApeSkill : null
  };

  // Cập nhật từng quái vật thường đang sống
  for (var enemy of enemies) {
    if (!enemy.alive) continue;
    enemy.animTime += dt * 6;
    enemy.flash = Math.max(0, enemy.flash - dt);
    enemy.attackCd -= dt;

    // Giảm dần lực đẩy lùi (Knockback)
    if (enemy.knockbackX) {
      enemy.x += enemy.knockbackX * dt;
      enemy.knockbackX *= Math.max(0, 1 - 6 * dt);
      if (Math.abs(enemy.knockbackX) < 5) enemy.knockbackX = 0;
    }

    var distToPlayer = (player.x + player.w / 2) - (enemy.x + enemy.w / 2);

    // Kích hoạt tầm nhận biết khi người chơi đến gần trong cự ly 450px
    if (Math.abs(distToPlayer) < 450) {
      enemy.face = distToPlayer > 0 ? 1 : -1;

      // Nếu quái đã có file script riêng -> gọi qua bảng Handler
      if (monsterSkillHandlers[enemy.type]) {
        monsterSkillHandlers[enemy.type](enemy, player, dt, ctxGame);
      } else {
        // Logic mặc định cho quái chưa tách file riêng
        if (enemy.type === 'goblin') {
          enemy.dashCd = (enemy.dashCd || 0) - dt;
          if (enemy.isDashing) {
            enemy.x += enemy.face * 320 * dt;
            enemy.slashTimer = Math.max(0, (enemy.slashTimer || 0) - dt);
            if (enemy.slashTimer <= 0) enemy.isDashing = false;
          } else if (enemy.dashCd <= 0 && Math.abs(distToPlayer) < 220 && Math.abs(distToPlayer) > 15) {
            enemy.isDashing = true;
            enemy.slashTimer = 0.4;
            enemy.dashCd = rand(1.8, 2.8);
            playSlashSFX(1);
          } else if (Math.abs(distToPlayer) > 4) {
            enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
          }
        } else if (enemy.type === 'dark_knight') {
          enemy.slashTimer = Math.max(0, (enemy.slashTimer || 0) - dt);
          if (Math.abs(distToPlayer) < 85 && enemy.attackCd <= 0) {
            enemy.attackCd = 1.8;
            enemy.slashTimer = 0.55;
            playSlashSFX(3);
            shake = 6;
            damagePlayer(enemy.dmg, enemy.x + enemy.w / 2);
            spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, '#ef4444', 12, 180);
          } else if (Math.abs(distToPlayer) > 4) {
            enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
          }
        } else if (enemy.type === 'magma_brute') {
          enemy.slamTimer = Math.max(0, (enemy.slamTimer || 0) - dt);
          if (Math.abs(distToPlayer) < 90 && enemy.attackCd <= 0) {
            enemy.attackCd = rand(2.2, 3.2);
            enemy.slamTimer = 0.5;
            shake = 7;
            playHitSFX();
            damagePlayer(enemy.dmg, enemy.x + enemy.w / 2);
            spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h, '#ea580c', 16, 200);
          } else if (Math.abs(distToPlayer) > 4 && enemy.slamTimer <= 0) {
            enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
          }
        } else if (enemy.type === 'sanctuary_golem') {
          enemy.slashTimer = Math.max(0, (enemy.slashTimer || 0) - dt);
          if (Math.abs(distToPlayer) < 110 && enemy.attackCd <= 0) {
            enemy.attackCd = 2.4;
            enemy.slashTimer = 0.55;
            playSlashSFX(3);
            shake = 5;
            damagePlayer(enemy.dmg, enemy.x + enemy.w / 2);
            spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#fde047', 15, 180);
          } else if (Math.abs(distToPlayer) > 4 && enemy.slashTimer <= 0) {
            enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
          }
        }
        // --- ẢO ẢNH BÓNG MA (CỨ 4S HỒI 30% MÁU) ---
        else if (enemy.type === 'rift_phantom') {
          if (enemy.phantomHealTimer === undefined) enemy.phantomHealTimer = 4.0;
          enemy.phantomHealTimer -= dt;

          if (enemy.phantomHealTimer <= 0) {
            enemy.phantomHealTimer = 4.0; // Đặt lại chu kỳ 4 giây

            if (enemy.hp < enemy.maxHp) {
              var heal30 = Math.round(enemy.maxHp * 0.30); // 30% lượng máu tối đa
              enemy.hp = Math.min(enemy.maxHp, enemy.hp + heal30);

              spawnFloatingPopup(enemy.x + enemy.w / 2, enemy.y - 20, `+${heal30} HP (HỒI 30%)`, '#10b981', 1.3);
              spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#34d399', 16, 200);
              spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#a7f3d0', 10, 160);
              playSynthSound(580, 0.2, 'triangle', 0.05, 880);
            }
          }

          enemy.slashTimer = Math.max(0, (enemy.slashTimer || 0) - dt);
          enemy.teleportCd = (enemy.teleportCd || 0) - dt;
          if (enemy.teleportCd <= 0 && Math.abs(distToPlayer) < 320 && Math.abs(distToPlayer) > 70) {
            enemy.teleportCd = rand(3.0, 4.5);
            spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#10b981', 12, 160);
            enemy.x = player.x - player.face * 65;
            enemy.face = player.face;
            enemy.slashTimer = 0.4;
            playDashSFX();
            damagePlayer(enemy.dmg, enemy.x + enemy.w / 2);
          } else if (Math.abs(distToPlayer) > 4) {
            enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
          }
        }
        // --- THIÊN THẦN SA NGÃ (CỨ 4S HỒI 70% MÁU) ---
        else if (enemy.type === 'fallen_cherub' && enemy.fly) {
          if (enemy.cherubHealTimer === undefined) enemy.cherubHealTimer = 4.0;
          enemy.cherubHealTimer -= dt;

          if (enemy.cherubHealTimer <= 0) {
            enemy.cherubHealTimer = 4.0; // Đặt lại chu kỳ 4 giây

            if (enemy.hp < enemy.maxHp) {
              var heal70 = Math.round(enemy.maxHp * 0.70); // 70% lượng máu tối đa
              enemy.hp = Math.min(enemy.maxHp, enemy.hp + heal70);

              spawnFloatingPopup(enemy.x + enemy.w / 2, enemy.y - 20, `+${heal70} HP (HỒI 70%)`, '#e879f9', 1.3);
              spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#c084fc', 16, 200);
              spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#ffffff', 10, 160);
              playSynthSound(660, 0.2, 'triangle', 0.05, 990);
            }
          }

          enemy.castTimer = Math.max(0, (enemy.castTimer || 0) - dt);
          enemy.arrowCd = (enemy.arrowCd || 0) - dt;
          if (enemy.arrowCd <= 0 && Math.abs(distToPlayer) < 600) {
            enemy.arrowCd = rand(2.8, 3.8);
            enemy.castTimer = 0.6;
            playSkillSFX();
            projectiles.push({
              x: enemy.x + (enemy.face > 0 ? enemy.w : -20),
              y: enemy.y + enemy.h / 2 - 8,
              w: 22, h: 16,
              vx: enemy.face * 420, vy: 0,
              isPlayer: false, dmg: enemy.dmg, color: '#facc15', life: 2.2
            });
          }
        }
        // --- KẺ NUỐT KHÔNG GIAN (LỰC HÚT TRỌNG LỰC) ---
        else if (enemy.type === 'void_devourer' && enemy.fly && Math.abs(distToPlayer) < 350) {
          enemy.pullTimer = 1.0;
          player.x += Math.sign(distToPlayer) * -120 * dt;
        }

        // Xử lý cơ chế bay bồng bềnh lượn sóng của quái bay
        if (enemy.fly) {
          if (enemy.retreatTimer > 0) {
            enemy.retreatTimer -= dt;
            enemy.x += enemy.retreatDir * (enemy.spd * 1.4) * dt;
            enemy.y += ((player.y - 150) - enemy.y) * 4 * dt;
          } else {
            var hoverWave = Math.sin(worldTime * 6 + enemy.animTime) * 18;
            enemy.y += (((player.y + player.h / 2 - enemy.h / 2) + hoverWave) - enemy.y) * 3.2 * dt;
            if (Math.abs(distToPlayer) > 4) enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
          }
        } else if (Math.abs(distToPlayer) > 4 && !enemy.isDashing && (enemy.slamTimer || 0) <= 0 && (enemy.slashTimer || 0) <= 0) {
          enemy.x += Math.sign(distToPlayer) * enemy.spd * dt;
        }
      }
    }

    // Trọng lực cho quái đi bộ trên sàn
    if (!enemy.fly) {
      enemy.vy = (enemy.vy || 0) + 1480 * dt;
      enemy.y += enemy.vy * dt;
      enemy.onGround = false;
      for (var plat of platforms) {
        if (rectIntersect(enemy.x, enemy.y, enemy.w, enemy.h, plat.x, plat.y, plat.w, plat.h)) {
          if (enemy.vy >= 0 && enemy.y + enemy.h - enemy.vy * dt <= plat.y + 14) {
            enemy.y = plat.y - enemy.h;
            enemy.vy = 0;
            enemy.onGround = true;
          }
        }
      }
      if (enemy.y > H + 100) enemy.alive = false;
    }

    enemy.x = clamp(enemy.x, 0, levelLength - enemy.w);

    // Va chạm thân xác gây sát thương trực tiếp lên Kaito
    if (rectIntersect(player.x, player.y, player.w, player.h, enemy.x - 3, enemy.y, enemy.w + 6, enemy.h) && enemy.attackCd <= 0) {
      damagePlayer(enemy.dmg, enemy.x + enemy.w / 2);
      enemy.attackCd = 1.2;

      if (enemy.type === 'slime') {
        enemy.isPouncing = false;
        enemy.vx = -enemy.face * 120;
      }

      if (enemy.fly) {
        enemy.retreatTimer = 1.5;
        enemy.retreatDir = -enemy.face;
        enemy.attackCd = 1.8;
      }
    }
  }

  // ==========================================================================
  // [TÌM KIẾM: AI_10_BOSS] TRÍ TUỆ NHÂN TẠO CỦA 10 ĐẠI TRÙM CUỐI
  // ==========================================================================
  if (boss && !boss.dead) {
    var bossTriggerX = levelLength - 700;
    // Khi Kaito bước vào khu vực Đấu Trường Trùm Cuối
    if (player.x > bossTriggerX && !boss.active) {
      boss.active = true;
      playBossRoarSFX();
      say(`BOSS XUẤT HIỆN: ${STAGES[stageIndex].bossName}!`, 2500);
    }

    if (boss.active) {
      boss.animTime = (boss.animTime || 0) + dt;
      boss.flash = Math.max(0, boss.flash - dt);
      boss.attackCd -= dt;
      boss.skill1Cd = Math.max(0, (boss.skill1Cd || 0) - dt);
      boss.skill2Cd = Math.max(0, (boss.skill2Cd || 0) - dt);
      boss.skill3Cd = Math.max(0, (boss.skill3Cd || 0) - dt);
      boss.castTimer = Math.max(0, (boss.castTimer || 0) - dt);
      boss.meleeTimer = Math.max(0, (boss.meleeTimer || 0) - dt);
      boss.shieldTimer = Math.max(0, (boss.shieldTimer || 0) - dt);
      boss.crystalRainTimer = Math.max(0, (boss.crystalRainTimer || 0) - dt);

      var bossDistX = (player.x + player.w / 2) - (boss.x + boss.w / 2);
      boss.face = bossDistX > 0 ? 1 : -1;

      // Khi máu Boss dưới 50%: Bật trạng thái Cuồng Nộ (Phase 2)
      if (boss.hp < boss.maxHp * 0.5 && boss.phase !== 2) {
        boss.phase = 2;
        shake = 12;
        playBossRoarSFX();
        say(`BOSS NỔI GIẬN: CUỒNG NỘ KÍCH HOẠT!`, 2000);
        spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ef4444', 35, 260);
      }

      // Xử lý cơ chế bay hoặc tiếp đất của từng Boss
      if (boss.fly) {
        var wave = Math.sin(worldTime * (stageIndex === 3 ? 3 : 4)) * (stageIndex === 3 ? 25 : 20);
        var targetY = (player.y - (stageIndex === 3 ? 95 : 60)) + wave;
        boss.y += (targetY - boss.y) * 2.2 * dt;
      } else {
        boss.vy = (boss.vy || 0) + 1480 * dt;
        boss.y += boss.vy * dt;
        for (var plat of platforms) {
          if (rectIntersect(boss.x, boss.y, boss.w, boss.h, plat.x, plat.y, plat.w, plat.h)) {
            if (boss.vy >= 0 && boss.y + boss.h - boss.vy * dt <= plat.y + 14) {
              boss.y = plat.y - boss.h;
              boss.vy = 0;
            }
          }
        }
      }

      var spdMult = boss.phase === 2 ? 1.45 : 1.0;

      // ----------------------------------------------------------------------
      // BOSS 1: HẮC LANG (MÀN 1)
      // ----------------------------------------------------------------------
      if (stageIndex === 0) {
        if (Math.abs(bossDistX) > 80 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 90 * spdMult * dt;
          boss.vx = Math.sign(bossDistX) * 90;
        } else { boss.vx = 0; }

        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 135) {
          boss.attackCd = boss.phase === 2 ? 1.1 : 1.6;
          boss.meleeTimer = 0.3;
          playSlashSFX(3);
          damagePlayer(18, boss.x + boss.w / 2);
        }

        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.0 : 4.5;
          boss.castTimer = 0.5;
          playBossRoarSFX();
          shake = 8;
          projectiles.push({
            type: 'shockwave',
            x: boss.x + boss.w / 2 + boss.face * 30, y: boss.y + boss.h / 2,
            w: 36, h: 28, vx: boss.face * 420, vy: 0,
            isPlayer: false, dmg: 22, color: '#ef4444', life: 2.2
          });
          say('HẮC LANG: SÓNG ÂM HUYỀN ẢO!');
        }

        if (boss.skill2Cd <= 0 && Math.abs(bossDistX) > 100) {
          boss.skill2Cd = boss.phase === 2 ? 4.5 : 6.0;
          boss.meleeTimer = 0.4;
          playDashSFX();
          boss.x += boss.face * 180;
          damagePlayer(24, boss.x);
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ef4444', 20, 220);
          say('HẮC LANG: HUYẾT ẢNH ĐỘT KÍCH!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 6.5 : 8.5;
          boss.castTimer = 0.7;
          shake = 10;
          playBossRoarSFX();
          [-80, 0, 80].forEach(vy => {
            projectiles.push({
              type: 'shockwave',
              x: boss.x + boss.w / 2 + boss.face * 35, y: boss.y + boss.h / 2,
              w: 42, h: 32, vx: boss.face * 380, vy: vy,
              isPlayer: false, dmg: 26, color: '#f87171', life: 2.4
            });
          });
          say('HẮC LANG: HẮC NGUYỆT TRẢO BA!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 2: KỴ SĨ TRO TÀN (MÀN 2)
      // ----------------------------------------------------------------------
      else if (stageIndex === 1) {
        if (Math.abs(bossDistX) > 95 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 75 * spdMult * dt;
          boss.vx = Math.sign(bossDistX) * 75;
        } else { boss.vx = 0; }

        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 155) {
          boss.attackCd = boss.phase === 2 ? 1.2 : 1.7;
          boss.meleeTimer = 0.35;
          playSlashSFX(2);
          damagePlayer(22, boss.x + boss.w / 2);
        }

        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.5 : 5.0;
          boss.castTimer = 0.6;
          shake = 10;
          playBossRoarSFX();
          for (var i = 0; i < 3; i++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                projectiles.push({
                  type: 'magma',
                  x: boss.x + boss.w / 2 + boss.face * (40 + i * 75),
                  y: boss.y + boss.h - 30,
                  w: 34, h: 35, vx: boss.face * 340, vy: 0,
                  isPlayer: false, dmg: 25, color: '#f97316', life: 2.5
                });
              }
            }, i * 180);
          }
          say('KỴ SĨ TRO TÀN: ĐỊA CHẤN NHAM THẠCH!');
        }

        if (boss.skill2Cd <= 0 && Math.abs(bossDistX) < 160) {
          boss.skill2Cd = boss.phase === 2 ? 5.0 : 7.0;
          boss.shieldTimer = 0.8;
          playHitSFX();
          shake = 8;
          damagePlayer(18, boss.x);
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f97316', 22, 220);
          say('KỴ SĨ TRO TÀN: TRO TÀN HỘ THUẪN!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 7.0 : 9.5;
          boss.castTimer = 0.9;
          shake = 14;
          playBossRoarSFX();
          [-360, 360].forEach(dir => {
            projectiles.push({
              type: 'magma',
              x: boss.x + boss.w / 2, y: boss.y + boss.h - 30,
              w: 42, h: 36, vx: dir, vy: 0,
              isPlayer: false, dmg: 28, color: '#ea580c', life: 2.2
            });
          });
          say('KỴ SĨ TRO TÀN: CỰ KIẾM TRẢM THIÊN!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 3: CHÚA TỂ BÓNG ĐÊM (MÀN 3: HÚT MÁU 30% SÁT THƯƠNG)
      // ----------------------------------------------------------------------
      else if (stageIndex === 2) {
        if (Math.abs(bossDistX) > 130 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 80 * spdMult * dt;
        }

        if (boss.attackCd <= 0 && boss.castTimer <= 0) {
          boss.attackCd = boss.phase === 2 ? 1.5 : 2.2;
          playSkillSFX();
          [-70, 0, 70].forEach(vy => {
            projectiles.push({
              type: 'dark_fire',
              x: boss.x + boss.w / 2 + boss.face * 35,
              y: boss.y + boss.h / 2 - 10,
              w: 28, h: 28, vx: boss.face * 380, vy: vy,
              isPlayer: false, dmg: 22, color: '#c026d3', life: 2.2,
              fromBoss: true // Kích hoạt hồi máu 30% khi trúng đòn
            });
          });
        }

        if (boss.skill1Cd <= 0 && (Math.abs(bossDistX) < 85 || Math.random() < 0.008)) {
          boss.skill1Cd = boss.phase === 2 ? 3.5 : 5.0;
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#c084fc', 25, 220);
          boss.x = player.x - player.face * 90;
          boss.face = player.face;
          playDashSFX();
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#e879f9', 25, 220);
          say('CHÚA TỂ BÓNG ĐÊM: TỐC BIẾN SAU LƯNG!');
        }

        if (boss.skill2Cd <= 0 && boss.castTimer <= 0) {
          boss.skill2Cd = boss.phase === 2 ? 3.2 : 4.8;
          shake = 8;
          playHitSFX();
          var targetX = player.x;
          setTimeout(() => {
            if (boss && !boss.dead) {
              projectiles.push({
                type: 'lightning',
                x: targetX, y: 0,
                w: 24, h: 600, vx: 0, vy: 0,
                isPlayer: false, dmg: 24, color: '#f5d0fe', life: 0.35,
                fromBoss: true
              });
              spawnParticleBurst(targetX, 580, '#f5d0fe', 16, 200);
            }
          }, 300);
          say('CHÚA TỂ BÓNG ĐÊM: THIÊN LÔI HƯ KHÔNG!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 5.5 : 7.5;
          boss.castTimer = 0.8;
          shake = 12;
          playBossRoarSFX();
          var targetMeteorX = player.x;
          setTimeout(() => {
            if (boss && !boss.dead) {
              projectiles.push({
                type: 'big_meteor',
                x: targetMeteorX, y: -60,
                w: 56, h: 56, vx: 0, vy: 450,
                isPlayer: false, dmg: 32, color: '#3b0764', life: 2.5,
                fromBoss: true
              });
              spawnParticleBurst(targetMeteorX, 40, '#a855f7', 22, 180);
            }
          }, 500);
          say('CHÚA TỂ BÓNG ĐÊM: ĐẠI THIÊN THẠCH HỦY DIỆT!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 4: RỒNG BÓNG TỐI (MÀN 4: NÉ ĐÒN 25%, MÁU <= 50% +30% DMG & KHÓI ĐEN)
      // ----------------------------------------------------------------------
      else if (stageIndex === 3) {
        if (Math.abs(bossDistX) > 150 && boss.castTimer <= 0 && (boss.teleportPhase || 0) === 0) {
          boss.x += Math.sign(bossDistX) * 75 * spdMult * dt;
        }

        var isEnraged = (boss.hp <= boss.maxHp * 0.5);
        var dmgBoost = isEnraged ? 1.3 : 1.0;

        // Bốc khói đen hư không khi máu dưới 50%
        if (isEnraged && Math.random() < 0.45) {
          particles.push({
            x: boss.x + rand(10, boss.w - 10),
            y: boss.y + boss.h * 0.6 + rand(-15, 15),
            vx: rand(-30, 30),
            vy: -rand(40, 90),
            life: 0.6,
            maxLife: 0.6,
            color: Math.random() < 0.5 ? '#090514' : '#3b0764',
            size: rand(6, 14),
            gravity: -25
          });
        }

        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 180 && boss.castTimer <= 0) {
          boss.attackCd = boss.phase === 2 ? 1.4 : 2.0;
          boss.meleeTimer = 0.4;
          playSlashSFX(3);
          var finalDmg = Math.round(26 * dmgBoost);
          damagePlayer(finalDmg, boss.x + boss.w / 2);

          if (isEnraged) {
            for (let k = 0; k < 6; k++) {
              particles.push({
                x: player.x + player.w / 2 + rand(-20, 20),
                y: player.y + player.h / 2 + rand(-20, 20),
                vx: rand(-40, 40),
                vy: -rand(50, 110),
                life: 0.5,
                maxLife: 0.5,
                color: '#090514',
                size: rand(5, 12),
                gravity: -30
              });
            }
          }
        }

        if (boss.skill1Cd <= 0 && boss.castTimer <= 0 && (boss.teleportPhase || 0) === 0) {
          boss.skill1Cd = boss.phase === 2 ? 4.0 : 6.0;
          boss.castTimer = 0.9;
          shake = 12;
          playBossRoarSFX();
          say('RỒNG BÓNG TỐI: BÃO LỬA TÍM QUÉT ĐẤT (3 ĐỢT)!');
          for (var wave = 0; wave < 3; wave++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                projectiles.push({
                  type: 'dragon_fire_sweep',
                  x: boss.x + boss.w / 2 + boss.face * 60, y: 570,
                  w: 80, h: 45, vx: boss.face * 520, vy: 0,
                  isPlayer: false,
                  dmg: Math.round(20 * dmgBoost),
                  isEnraged: isEnraged,
                  color: '#c026d3', life: 2.2
                });
              }
            }, wave * 250);
          }
        }

        if (boss.skill2Cd <= 0 && boss.castTimer <= 0 && (boss.teleportPhase || 0) === 0) {
          boss.skill2Cd = boss.phase === 2 ? 5.5 : 7.5;
          boss.teleportPhase = 1;
          say('RỒNG BÓNG TỐI: XÉ RÁCH KHÔNG GIAN!');
          setTimeout(() => {
            if (boss && !boss.dead) {
              spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#c026d3', 25, 240);
              boss.x = player.x - player.face * 110;
              boss.y = player.y - 40;
              boss.face = player.face;
              boss.meleeTimer = 0.4;
              playDashSFX();
              playSlashSFX(3);
              var finalDmg = Math.round(28 * dmgBoost);
              damagePlayer(finalDmg, boss.x + boss.w / 2);

              if (isEnraged) {
                for (let s = 0; s < 10; s++) {
                  particles.push({
                    x: boss.x + boss.w / 2 + rand(-30, 30),
                    y: boss.y + boss.h / 2 + rand(-20, 20),
                    vx: rand(-50, 50),
                    vy: -rand(60, 120),
                    life: 0.6,
                    maxLife: 0.6,
                    color: '#090514',
                    size: rand(7, 15),
                    gravity: -30
                  });
                }
              }

              setTimeout(() => {
                if (boss && !boss.dead) {
                  boss.x = player.x + (boss.face > 0 ? -420 : 420);
                  boss.y = 360;
                  boss.teleportPhase = 0;
                }
              }, 350);
            }
          }, 300);
        }

        if (boss.skill3Cd <= 0 && boss.castTimer <= 0 && (boss.teleportPhase || 0) === 0) {
          boss.skill3Cd = boss.phase === 2 ? 6.0 : 8.5;
          boss.crystalRainTimer = 1.3;
          boss.castTimer = 1.3;
          shake = 15;
          playBossRoarSFX();
          say('RỒNG BÓNG TỐI: MƯA THỦY TINH THỂ (5 ĐỢT)!');
          for (var c = 0; c < 5; c++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + rand(-30, 30);
                projectiles.push({
                  type: 'void_crystal',
                  x: targetX, y: -50,
                  w: 36, h: 54, vx: 0, vy: 540,
                  isPlayer: false,
                  dmg: Math.round(24 * dmgBoost),
                  isEnraged: isEnraged,
                  color: '#e879f9', life: 2.5
                });
              }
            }, c * 220);
          }
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 5: BĂNG THẦN YMIR (MÀN 5: AURA BĂNG HỘ THỂ KHI HP <= 35%)
      // ----------------------------------------------------------------------
      else if (stageIndex === 4) {
        if (boss.hp <= boss.maxHp * 0.35 && !boss.frostAuraActive) {
          boss.frostAuraActive = true;
          shake = 14;
          playBossRoarSFX();
          say('BĂNG THẦN YMIR: KÍCH HOẠT AURA BĂNG HỘ THỂ (MIỄN 70% SÁT THƯƠNG)!', 2800);
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#38bdf8', 35, 260);
        }

        if (Math.abs(bossDistX) > 110 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 70 * spdMult * dt;
          boss.vx = Math.sign(bossDistX) * 70;
        } else { boss.vx = 0; }

        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 170) {
          boss.attackCd = boss.phase === 2 ? 1.2 : 1.8;
          boss.meleeTimer = 0.4;
          playSlashSFX(3);
          damagePlayer(25, boss.x + boss.w / 2);
        }

        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.5 : 5.0;
          boss.castTimer = 0.6;
          shake = 10;
          playBossRoarSFX();
          for (var i = 0; i < 3; i++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                projectiles.push({
                  type: 'shockwave',
                  x: boss.x + boss.w / 2 + boss.face * (40 + i * 70),
                  y: boss.y + boss.h / 2,
                  w: 42, h: 36, vx: boss.face * 450, vy: 0,
                  isPlayer: false, dmg: 26, color: '#38bdf8', life: 2.2
                });
              }
            }, i * 180);
          }
          say('BĂNG THẦN YMIR: CHÔNG BĂNG ĐỊA CHẤN!');
        }

        if (boss.skill2Cd <= 0) {
          boss.skill2Cd = boss.phase === 2 ? 4.8 : 6.8;
          boss.castTimer = 0.7;
          playBossRoarSFX();
          projectiles.push({
            type: 'big_meteor',
            x: player.x, y: -40,
            w: 50, h: 50, vx: 0, vy: 460,
            isPlayer: false, dmg: 30, color: '#bae6fd', life: 2.5
          });
          say('BĂNG THẦN YMIR: ĐẠI BĂNG THẠCH TINH CẦU!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 7.0 : 9.5;
          boss.castTimer = 1.0;
          shake = 15;
          playBossRoarSFX();
          for (var s = 0; s < 4; s++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + rand(-120, 120);
                projectiles.push({
                  type: 'void_crystal',
                  x: targetX, y: -40,
                  w: 30, h: 48, vx: 0, vy: 520,
                  isPlayer: false, dmg: 28, color: '#e0f2fe', life: 2.0
                });
              }
            }, s * 220);
          }
          say('BĂNG THẦN YMIR: BÃO TUYẾT TUYỆT ĐỐI!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 6: LÔI PHƯỢNG HOÀNG (MÀN 6: TỐC ĐỘ 220, KÉN SẤM TÁI SINH 100% HP)
      // ----------------------------------------------------------------------
      else if (stageIndex === 5) {
        if (boss.isRebirthing) {
          boss.vx = 0;
          return;
        }

        if (Math.abs(bossDistX) > 120 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 220 * spdMult * dt;
        }

        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 190) {
          boss.attackCd = boss.phase === 2 ? 1.0 : 1.5;
          boss.meleeTimer = 0.35;
          playSlashSFX(3);
          damagePlayer(28, boss.x + boss.w / 2);
        }

        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.0 : 4.5;
          boss.castTimer = 0.8;
          shake = 12;
          playSkillSFX();
          for (var i = 0; i < 5; i++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + (i - 2) * 80;
                projectiles.push({
                  type: 'lightning',
                  x: targetX, y: 0,
                  w: 26, h: 600, vx: 0, vy: 0,
                  isPlayer: false, dmg: 26, color: '#fef08a', life: 0.35
                });
                spawnParticleBurst(targetX, 580, '#fde047', 16, 200);
              }
            }, i * 160);
          }
          say('LÔI PHƯỢNG HOÀNG: LÔI TRẬN THIÊN ĐÌNH!');
        }

        if (boss.skill2Cd <= 0 && Math.abs(bossDistX) > 120) {
          boss.skill2Cd = boss.phase === 2 ? 4.5 : 6.5;
          boss.meleeTimer = 0.5;
          playDashSFX();
          shake = 10;
          boss.x += boss.face * 260;
          damagePlayer(30, boss.x);
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fde047', 25, 240);
          say('LÔI PHƯỢNG HOÀNG: TRÙNG LÔI BỔ NHÀO!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 6.5 : 9.0;
          boss.castTimer = 0.9;
          shake = 14;
          playBossRoarSFX();
          projectiles.push({
            type: 'big_meteor',
            x: boss.x + boss.w / 2 + boss.face * 40, y: boss.y + 20,
            w: 54, h: 54, vx: boss.face * 260, vy: 40,
            isPlayer: false, dmg: 34, color: '#facc15', life: 3.0
          });
          say('LÔI PHƯỢNG HOÀNG: BÃO ĐIỆN TINH CẦU!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 7: TITAN SURTR (MÀN 7: 4000 HP, VĨNH VIỄN MIỄN 12% SÁT THƯƠNG)
      // ----------------------------------------------------------------------
      else if (stageIndex === 6) {
        if (Math.abs(bossDistX) > 120 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 65 * spdMult * dt;
          boss.vx = Math.sign(bossDistX) * 65;
        } else { boss.vx = 0; }

        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 180) {
          boss.attackCd = boss.phase === 2 ? 1.3 : 1.9;
          boss.meleeTimer = 0.4;
          playSlashSFX(3);
          damagePlayer(32, boss.x + boss.w / 2);
        }

        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.5 : 5.0;
          boss.castTimer = 0.8;
          shake = 14;
          playBossRoarSFX();
          [-380, 380].forEach(dir => {
            projectiles.push({
              type: 'magma',
              x: boss.x + boss.w / 2, y: boss.y + boss.h - 30,
              w: 48, h: 42, vx: dir, vy: 0,
              isPlayer: false, dmg: 30, color: '#ea580c', life: 2.2
            });
          });
          say('TITAN SURTR: SÓNG THẦN LỬA NỆN ĐẤT!');
        }

        if (boss.skill2Cd <= 0) {
          boss.skill2Cd = boss.phase === 2 ? 4.8 : 6.8;
          boss.castTimer = 0.8;
          shake = 12;
          playBossRoarSFX();
          for (var i = 0; i < 4; i++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + (i - 1.5) * 90;
                projectiles.push({
                  type: 'big_meteor',
                  x: targetX, y: -60,
                  w: 48, h: 48, vx: 0, vy: 460,
                  isPlayer: false, dmg: 28, color: '#f97316', life: 2.5
                });
              }
            }, i * 180);
          }
          say('TITAN SURTR: MƯA BOM NHAM THẠCH!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 7.0 : 9.5;
          boss.castTimer = 1.0;
          shake = 16;
          playBossRoarSFX();
          for (var c = 0; c < 3; c++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                projectiles.push({
                  type: 'magma',
                  x: player.x + (c - 1) * 70, y: 560,
                  w: 40, h: 60, vx: 0, vy: -120,
                  isPlayer: false, dmg: 35, color: '#ef4444', life: 1.5
                });
              }
            }, c * 250);
          }
          say('TITAN SURTR: CỘT LỬA HỎA NGỤC PHUN TRÀO!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 8: THÁNH HIỆP SĨ SERAPH (MÀN 8: 30% NÉ ĐÒN, CỨ 5S HỒI 15% HP)
      // ----------------------------------------------------------------------
      else if (stageIndex === 7) {
        // NỘI TẠI BỊ ĐỘNG: Cứ mỗi 5 giây tự động phục hồi 15% máu tối đa (+450 HP)
        boss.seraphHealTimer = (boss.seraphHealTimer !== undefined ? boss.seraphHealTimer : 5.0) - dt;
        if (boss.seraphHealTimer <= 0) {
          boss.seraphHealTimer = 5.0; // Reset bộ đếm 5 giây
          if (boss.hp < boss.maxHp) {
            const healAmount = Math.round(boss.maxHp * 0.15); // 15% của 3000 = 450 HP
            boss.hp = Math.min(boss.maxHp, boss.hp + healAmount);
            spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 25, `+${healAmount} HP (THÁNH QUANG PHỤC HỒI)`, '#facc15', 1.5);
            spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fde047', 24, 240);
            spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffffff', 14, 180);
            playSynthSound(680, 0.25, 'triangle', 0.07, 1020);
          }
        }

        if (Math.abs(bossDistX) > 110 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 100 * spdMult * dt;
        }

        // Đòn thường: Song Kiếm Thánh Quang
        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 160) {
          boss.attackCd = boss.phase === 2 ? 1.2 : 1.7;
          boss.meleeTimer = 0.35;
          playSlashSFX(3);
          damagePlayer(30, boss.x + boss.w / 2);
        }

        // Skill 1: Vạn Kiếm Quy Tông (6 phi kiếm thánh quang)
        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.5 : 5.0;
          boss.castTimer = 0.6;
          playSkillSFX();
          for (var i = 0; i < 6; i++) {
            projectiles.push({
              type: 'dark_fire',
              x: boss.x + boss.w / 2, y: boss.y + boss.h / 2,
              w: 22, h: 22,
              vx: boss.face * (320 + i * 35), vy: (i - 2.5) * 60,
              isPlayer: false, dmg: 24, color: '#fde047', life: 2.2
            });
          }
          say('SERAPH: VẠN KIẾM QUY TÔNG!');
        }

        // Skill 2: Thánh Quang Tốc Biến Chém Chữ X
        if (boss.skill2Cd <= 0) {
          boss.skill2Cd = boss.phase === 2 ? 4.5 : 6.5;
          boss.x = player.x - player.face * 95;
          boss.face = player.face;
          boss.meleeTimer = 0.4;
          playDashSFX();
          playSlashSFX(3);
          damagePlayer(34, boss.x);
          spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fef08a', 24, 220);
          say('SERAPH: THÁNH QUANG TỐC BIẾN CHÉM CHỮ X!');
        }

        // Skill 3: Thánh Phạt Thiên Đình (3 Cột Sáng Sấm Sét)
        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 6.5 : 9.0;
          boss.castTimer = 0.9;
          shake = 14;
          playSkillSFX();
          for (var k = 0; k < 3; k++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + (k - 1) * 90;
                projectiles.push({
                  type: 'lightning',
                  x: targetX, y: 0,
                  w: 32, h: 600, vx: 0, vy: 0,
                  isPlayer: false, dmg: 32, color: '#fef08a', life: 0.4
                });
              }
            }, k * 220);
          }
          say('SERAPH: THÁNH PHẠT THIÊN ĐÌNH!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 9: QUÁI VẬT HỖN MANG CHRONOS (MÀN 9: VÒNG SÁNG ĐEN & HỐ ĐEN HÚT MÁU 200%)
      // ----------------------------------------------------------------------
      else if (stageIndex === 8) {
        // NỘI TẠI BỊ ĐỘNG: Cứ mỗi 3 giây xuất hiện Vòng Sáng Đen miễn 90% sát thương trong 2 giây
        if (boss.chronosShieldTimer === undefined) {
          boss.chronosShieldTimer = 0;
          boss.chronosShieldCooldown = 3.0;
        }

        if (boss.chronosShieldTimer > 0) {
          boss.chronosShieldTimer -= dt;
          if (Math.random() < 0.35) {
            particles.push({
              x: boss.x + rand(0, boss.w),
              y: boss.y + rand(0, boss.h),
              vx: rand(-30, 30),
              vy: -rand(40, 80),
              life: 0.5, maxLife: 0.5,
              color: Math.random() < 0.5 ? '#090514' : '#c084fc',
              size: rand(4, 9), gravity: -20
            });
          }
          if (boss.chronosShieldTimer <= 0) {
            boss.chronosShieldCooldown = 3.0; // Chu kỳ đếm lùi 3 giây tiếp theo
          }
        } else {
          boss.chronosShieldCooldown -= dt;
          if (boss.chronosShieldCooldown <= 0) {
            boss.chronosShieldTimer = 2.0; // Bật Vòng Sáng Đen bảo hộ trong 2 giây
            playSynthSound(220, 0.25, 'sawtooth', 0.07, 440);
            spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 25, 'VÒNG SÁNG ĐEN (-90% DMG)!', '#c084fc', 1.4);
            spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#3b0764', 20, 200);
          }
        }

        if (Math.abs(bossDistX) > 130 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 85 * spdMult * dt;
        }

        // Đòn thường: 4 Xúc tu bóng tối
        if (boss.attackCd <= 0 && Math.abs(bossDistX) < 170) {
          boss.attackCd = boss.phase === 2 ? 1.3 : 1.9;
          boss.meleeTimer = 0.4;
          playSlashSFX(3);
          damagePlayer(36, boss.x + boss.w / 2);
        }

        // Skill 1: Sóng nghịch lý thời gian hất văng lùi
        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.5 : 5.0;
          boss.castTimer = 0.6;
          shake = 8;
          playSkillSFX();
          player.vx = -boss.face * 300;
          damagePlayer(22, boss.x);
          spawnParticleBurst(player.x, player.y, '#10b981', 18, 180);
          say('CHRONOS: SÓNG NGHỊCH LÝ THỜI GIAN!');
        }

        // Skill 2: Cầu Thời Gian ngưng đọng (3 quả cầu năng lượng xanh ngọc)
        if (boss.skill2Cd <= 0) {
          boss.skill2Cd = boss.phase === 2 ? 4.8 : 6.8;
          boss.castTimer = 0.7;
          playSkillSFX();
          [-60, 0, 60].forEach(vy => {
            projectiles.push({
              type: 'dark_fire',
              x: boss.x + boss.w / 2, y: boss.y + boss.h / 2,
              w: 30, h: 30, vx: boss.face * 260, vy: vy,
              isPlayer: false, dmg: 28, color: '#34d399', life: 3.0
            });
          });
          say('CHRONOS: CẦU THỜI GIAN NGƯNG ĐỘNG!');
        }

        // Skill 3: Hố Đen Sụp Đổ Hút Nuốt & Hồi Máu 200%
        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 6.5 : 9.0;
          boss.castTimer = 1.0;
          shake = 16;
          playBossRoarSFX();
          var targetX = player.x;
          setTimeout(() => {
            if (boss && !boss.dead) {
              projectiles.push({
                type: 'chronos_blackhole', // Loại đạn Hố Đen đặc thù
                x: targetX, y: -60,
                w: 70, h: 70,
                vx: 0, vy: 460,
                isPlayer: false,
                dmg: 45,
                color: '#090514',
                life: 2.8,
                fromChronosBlackhole: true // Cờ nhận diện hồi máu 200%
              });
            }
          }, 400);
          say('CHRONOS: HỐ ĐEN SỤP ĐỔ HÚT NUỐT!');
        }
      }

      // ----------------------------------------------------------------------
      // BOSS 10: SÁNG THẾ THẦN THÁI CỔ (MÀN 10: 6000 HP, 3 PHASE NGUYÊN TỐ)
      // ----------------------------------------------------------------------
      else if (stageIndex === 9) {
        // NỘI TẠI 1: Cứ 4 giây hồi 30% HP (+1800 HP) & Miễn thương hoàn toàn trong 2 giây
        if (boss.immuneTimer === undefined) boss.immuneTimer = 0;
        if (boss.healCycleTimer === undefined) boss.healCycleTimer = 4.0;

        if (boss.immuneTimer > 0) {
          boss.immuneTimer -= dt;
          if (Math.random() < 0.4) {
            particles.push({
              x: boss.x + rand(0, boss.w),
              y: boss.y + rand(0, boss.h),
              vx: rand(-40, 40),
              vy: -rand(50, 100),
              life: 0.5, maxLife: 0.5,
              color: Math.random() < 0.5 ? '#fde047' : '#ffffff',
              size: rand(4, 9), gravity: -20
            });
          }
        }

        boss.healCycleTimer -= dt;
        if (boss.healCycleTimer <= 0) {
          boss.healCycleTimer = 4.0;
          boss.immuneTimer = 2.0; // Bật khiên bất tử 2 giây

          if (boss.hp < boss.maxHp) {
            var heal30 = Math.round(boss.maxHp * 0.30); // 30% của 6000 = 1800 HP
            boss.hp = Math.min(boss.maxHp, boss.hp + heal30);

            playVictorySFX();
            playSynthSound(784, 0.3, 'sine', 0.08, 1174);
            spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 30, `+${heal30} HP (HỒI 30% & MIỄN THƯƠNG 2S)`, '#fde047', 1.6);
            spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fde047', 35, 260);
            spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffffff', 25, 220);
            say('⚡ SÁNG THẾ THẦN: PHỤC HỒI 30% HP & BẬT KHIÊN BẤT TỬ 2 GIÂY!', 2500);
          }
        }

        // NỘI TẠI 2: Cứ 10 giây triệu hồi 2 quái trong màn 10 hoặc 1 Ảo Ảnh Boss map khác
        if (boss.summonTimer === undefined) boss.summonTimer = 10.0;
        boss.summonTimer -= dt;

        if (boss.summonTimer <= 0) {
          boss.summonTimer = 10.0; // Đặt lại chu kỳ 10 giây
          playBossRoarSFX();
          shake = 14;

          // 50% xác suất triệu hồi 2 quái thường trong màn 10
          if (Math.random() < 0.5) {
            var stagePool = STAGES[9].enemyTypes;
            for (var m = 0; m < 2; m++) {
              var randomType = stagePool[Math.floor(Math.random() * stagePool.length)];
              var spawnOffset = (m === 0 ? -160 : 160);
              var spawnedEnemy = makeEnemy(randomType, clamp(boss.x + spawnOffset, 200, levelLength - 200), 600);
              enemies.push(spawnedEnemy);
              spawnParticleBurst(spawnedEnemy.x + spawnedEnemy.w / 2, spawnedEnemy.y + spawnedEnemy.h / 2, '#a855f7', 20, 200);
            }
            say('⚡ SÁNG THẾ THẦN: TRIỆU HỒI 2 QUÁI HƯ KHÔNG HỘ GIÁ!', 2500);
            spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 15, 'TRIỆU HỒI 2 QUÁI!', '#c084fc', 1.4);
          }
          // 50% xác suất triệu hồi 1 Ảo Ảnh Boss map khác
          else {
            var bossList = [
              { name: 'HẮC LANG', type: 'dark_knight', hp: 500, dmg: 28, color: '#ef4444' },
              { name: 'KỴ SĨ TRO TÀN', type: 'dark_knight', hp: 600, dmg: 32, color: '#f97316' },
              { name: 'CHÚA TỂ BÓNG ĐÊM', type: 'sorcerer', hp: 650, dmg: 35, color: '#c026d3' },
              { name: 'RỒNG BÓNG TỐI', type: 'void_drake', hp: 750, dmg: 38, color: '#3b0764' },
              { name: 'BĂNG THẦN YMIR', type: 'sanctuary_golem', hp: 800, dmg: 40, color: '#38bdf8' },
              { name: 'LÔI PHƯỢNG HOÀNG', type: 'storm_raven', hp: 850, dmg: 42, color: '#fde047' },
              { name: 'TITAN SURTR', type: 'magma_brute', hp: 950, dmg: 45, color: '#ea580c' },
              { name: 'SERAPH', type: 'sanctuary_golem', hp: 900, dmg: 45, color: '#ffffff' },
              { name: 'CHRONOS', type: 'rift_phantom', hp: 1000, dmg: 50, color: '#10b981' }
            ];
            var pickedBoss = bossList[Math.floor(Math.random() * bossList.length)];
            var spawnX = clamp(boss.x + (boss.face > 0 ? -220 : 220), 200, levelLength - 200);

            var miniBoss = makeEnemy(pickedBoss.type, spawnX, 600);
            miniBoss.name = `[ẢO ẢNH] ${pickedBoss.name}`;
            miniBoss.hp = pickedBoss.hp;
            miniBoss.maxHp = pickedBoss.hp;
            miniBoss.dmg = pickedBoss.dmg;
            miniBoss.color = pickedBoss.color;
            miniBoss.w = Math.round(miniBoss.w * 1.35); // Phóng to tạo dáng trùm phụ
            miniBoss.h = Math.round(miniBoss.h * 1.35);
            enemies.push(miniBoss);

            playSynthSound(150, 0.4, 'sawtooth', 0.1, 400);
            spawnParticleBurst(miniBoss.x + miniBoss.w / 2, miniBoss.y + miniBoss.h / 2, pickedBoss.color, 35, 260);
            say(`⚡ SÁNG THẾ THẦN: HIỆU TRIỆU ẢO ẢNH TRÙM [${pickedBoss.name}]!`, 3000);
            spawnFloatingPopup(boss.x + boss.w / 2, boss.y - 15, `TRIỆU HỒI: ${pickedBoss.name}!`, '#ef4444', 1.5);
          }
        }

        if (Math.abs(bossDistX) > 110 && boss.castTimer <= 0) {
          boss.x += Math.sign(bossDistX) * 95 * spdMult * dt;
        }

        if (boss.attackCd <= 0 && boss.castTimer <= 0) {
          boss.attackCd = boss.phase === 2 ? 1.0 : 1.6;
          boss.meleeTimer = 0.35;
          playSkillSFX();
          shake = 10;
          [-100, 0, 100].forEach(vy => {
            projectiles.push({
              type: 'dark_fire',
              x: boss.x + boss.w / 2, y: boss.y + boss.h / 2,
              w: 32, h: 32, vx: boss.face * 420, vy: vy,
              isPlayer: false, dmg: 35, color: '#fde047', life: 2.2
            });
          });
        }

        if (boss.skill1Cd <= 0) {
          boss.skill1Cd = boss.phase === 2 ? 3.0 : 4.5;
          boss.castTimer = 0.6;
          playSkillSFX();
          projectiles.push({
            type: 'dark_fire',
            x: boss.x + boss.w / 2, y: boss.y + boss.h / 2 - 20,
            w: 36, h: 36, vx: boss.face * 460, vy: 40,
            isPlayer: false, dmg: 36, color: '#38bdf8', life: 2.5
          });
          projectiles.push({
            type: 'magma',
            x: boss.x + boss.w / 2, y: boss.y + boss.h / 2 + 20,
            w: 36, h: 36, vx: boss.face * 460, vy: -40,
            isPlayer: false, dmg: 36, color: '#f97316', life: 2.5
          });
          say('SÁNG THẾ THẦN: LƯỠNG CỰC BĂNG HỎA!');
        }

        if (boss.skill2Cd <= 0) {
          boss.skill2Cd = boss.phase === 2 ? 4.5 : 6.5;
          boss.castTimer = 0.8;
          shake = 14;
          playSkillSFX();
          for (var i = 0; i < 4; i++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + (i - 1.5) * 85;
                projectiles.push({
                  type: 'lightning',
                  x: targetX, y: 0,
                  w: 28, h: 600, vx: 0, vy: 0,
                  isPlayer: false, dmg: 38, color: '#ffffff', life: 0.35
                });
              }
            }, i * 160);
          }
          say('SÁNG THẾ THẦN: THIÊN ĐÌNH LÔI QUANG!');
        }

        if (boss.skill3Cd <= 0) {
          boss.skill3Cd = boss.phase === 2 ? 6.5 : 9.0;
          boss.castTimer = 1.0;
          shake = 22;
          playBossRoarSFX();
          for (var i = 0; i < 3; i++) {
            setTimeout(() => {
              if (boss && !boss.dead) {
                var targetX = player.x + (i - 1) * 120;
                projectiles.push({
                  type: 'big_meteor',
                  x: targetX, y: -80,
                  w: 70, h: 70, vx: 0, vy: 520,
                  isPlayer: false, dmg: 50, color: '#ec4899', life: 2.5
                });
              }
            }, i * 220);
          }
          say('SÁNG THẾ THẦN: TIỂU HÀNH TINH SUPERNOVA!');
        }
      }
    }
  }

  // ==========================================================================
  // [TÌM KIẾM: PROJECTILES_LOOP] CẬP NHẬT ĐƯỜNG ĐẠN, VA CHẠM & HIỆU ỨNG VFX
  // ==========================================================================
  for (var i = projectiles.length - 1; i >= 0; i--) {
    var p = projectiles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    // Lực hút trọng lực kéo Kaito vào tâm Hố Đen của Chronos
    if (!p.isPlayer && p.type === 'chronos_blackhole') {
      var pullDistX = (p.x + p.w / 2) - (player.x + player.w / 2);
      if (Math.abs(pullDistX) < 420) {
        player.x += Math.sign(pullDistX) * 220 * dt;
        if (Math.random() < 0.25) {
          particles.push({
            x: player.x + rand(-10, player.w + 10),
            y: player.y + rand(0, player.h),
            vx: Math.sign(pullDistX) * 140,
            vy: -40,
            life: 0.35, maxLife: 0.35,
            color: '#c084fc', size: 4, gravity: 0
          });
        }
      }
    }

    // Vệt khói đen bốc lên theo bão lửa rồng khi cuồng nộ
    if (p.type === 'dragon_fire_sweep' && p.isEnraged && Math.random() < 0.4) {
      particles.push({
        x: p.x + rand(-20, 20),
        y: p.y + rand(-10, 10),
        vx: -p.vx * 0.15 + rand(-20, 20),
        vy: -rand(40, 80),
        life: 0.5,
        maxLife: 0.5,
        color: '#090514',
        size: rand(5, 11),
        gravity: -20
      });
    }

    // Khi Đại Thiên Thạch chạm mặt sàn phát nổ sóng chấn động 2 bên
    if (!p.isPlayer && p.type === 'big_meteor' && p.y >= 560) {
      p.life = 0;
      shake = 16;
      playHitSFX();
      spawnParticleBurst(p.x, 590, p.color || '#d946ef', 40, 320);

      [-340, 340].forEach(dir => {
        projectiles.push({
          type: 'blast_wave',
          x: p.x, y: 575,
          w: 38, h: 32,
          vx: dir, vy: 0,
          isPlayer: false, dmg: 20, color: p.color || '#c026d3', life: 1.4,
          fromBoss: p.fromBoss
        });
      });
    }

    // Khi Hố Đen chạm sàn phát nổ sóng chấn động hư không (vẫn giữ cờ hút máu 200%)
    if (!p.isPlayer && p.type === 'chronos_blackhole' && p.y >= 555) {
      p.life = 0;
      shake = 18;
      playHitSFX();
      spawnParticleBurst(p.x + p.w / 2, 590, '#3b0764', 45, 340);
      spawnParticleBurst(p.x + p.w / 2, 590, '#c084fc', 25, 260);

      [-360, 360].forEach(dir => {
        projectiles.push({
          type: 'blast_wave',
          x: p.x + p.w / 2, y: 575,
          w: 44, h: 36,
          vx: dir, vy: 0,
          isPlayer: false, dmg: 25, color: '#c084fc', life: 1.4,
          fromChronosBlackhole: true
        });
      });
    }

    // Khi Tinh Thể Hư Không cắm xuống sàn
    if (!p.isPlayer && p.type === 'void_crystal' && p.y >= 580) {
      p.life = 0;
      shake = 8;
      playHitSFX();
      spawnParticleBurst(p.x, 595, '#e879f9', 20, 220);

      if (p.isEnraged) {
        for (let k = 0; k < 6; k++) {
          particles.push({
            x: p.x + rand(-15, 15),
            y: 590,
            vx: rand(-30, 30),
            vy: -rand(50, 100),
            life: 0.6,
            maxLife: 0.6,
            color: '#090514',
            size: rand(6, 12),
            gravity: -25
          });
        }
      }
    }

    // Va chạm giữa đạn của Kaito và Quái vật / Boss
    if (p.isPlayer) {
      for (var enemy of enemies) {
        if (enemy.alive && !p.hitTargets.has(enemy) && rectIntersect(p.x, p.y, p.w, p.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
          p.hitTargets.add(enemy);
          damageEnemy(enemy, p.dmg, p.facing);
        }
      }
      if (boss && !boss.dead && boss.active && !p.hitTargets.has(boss) && rectIntersect(p.x, p.y, p.w, p.h, boss.x, boss.y, boss.w, boss.h)) {
        p.hitTargets.add(boss);
        damageBoss(p.dmg, p.facing);
      }
    } else {
      // Va chạm giữa đạn của Quái / Boss vào Kaito
      if (rectIntersect(player.x, player.y, player.w, player.h, p.x, p.y, p.w, p.h)) {
        const source = p.fromChronosBlackhole ? 'chronos_blackhole' :
                       ((p.fromBoss && stageIndex === 2) ? 'boss3' :
                       (p.fromBoss ? 'boss' : null));
        damagePlayer(p.dmg, p.x, null, null, p.stun || 0, source);
        if (p.type !== 'lightning') p.life = 0;
      }
    }

    if (p.life <= 0) projectiles.splice(i, 1);
  }

  // Thu thập vật phẩm rơi ra trên bản đồ
  for (var item of pickups) {
    if (item.taken) continue;
    if (rectIntersect(player.x, player.y, player.w, player.h, item.x - 12, item.y - 12, 24, 24)) {
      item.taken = true;
      if (item.type === 'gold') {
        gold += item.val;
        playCoinSFX();
        spawnFloatingPopup(item.x, item.y, `+${item.val}G`, '#fde047');
      } else if (item.type === 'heart') {
        player.hp = Math.min(player.maxHp, player.hp + 25);
        playCoinSFX();
        spawnFloatingPopup(item.x, item.y, '+25 HP', '#4ade80');
      } else if (item.type === 'mana') {
        player.mana = Math.min(player.maxMana, player.mana + 35);
        playCoinSFX();
        spawnFloatingPopup(item.x, item.y, '+35 MP', '#38bdf8');
      }
    }
  }

  // Chạm Cổng Dịch Chuyển để qua màn tiếp theo
  if (exitGate && exitGate.open && player.x > exitGate.x - 20) {
    if (stageIndex < STAGES.length - 1) {
      startNextStage();
    } else {
      victory = true;
      running = false;
      playVictorySFX();
      showEndScreen(true);
    }
  }

  // Cập nhật vị trí Camera cuộn theo bước chân Kaito
  cameraX = clamp(player.x - W * 0.38, 0, levelLength - W);
  shake = Math.max(0, shake - dt * 22);

  updateHUD();
}

// ============================================================================
// [TÌM KIẾM: RENDER_PIPELINE] VẼ TOÀN BỘ ĐỒ HỌA CANVAS 60 FPS
// ============================================================================
function draw() {
  ctx.save();
  // Áp dụng rung lắc màn hình khi có chấn động
  if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));

  // 1. Vẽ hình nền bầu trời, mây và núi xa
  if (typeof drawBackground === 'function') drawBackground(ctx, STAGES, stageIndex, cameraX, W, H, worldTime);
  // 2. Vẽ các bục sàn địa hình
  if (typeof drawPlatforms === 'function') drawPlatforms(ctx, platforms, STAGES, stageIndex, cameraX, W, worldTime);
  // 3. Vẽ vật phẩm rơi, rương kho báu, bẫy gai và cổng qua màn
  if (typeof drawPickupsAndObjects === 'function') drawPickupsAndObjects(ctx, pickups, chests, hazards, checkpoint, exitGate, cameraX, W, worldTime);

  // 4. Vẽ toàn bộ đường đạn và kỹ năng ma pháp
  for (var p of projectiles) {
    var screenX = p.x - cameraX;
    if (screenX < -100 || screenX > W + 100) continue;

    ctx.save();
    ctx.shadowColor = p.color || '#38bdf8';
    ctx.shadowBlur = p.isPlayer ? 14 : 20;

    if (p.type === 'shockwave') {
      ctx.strokeStyle = p.color; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(screenX, p.y, p.w, -0.7, 0.7); ctx.stroke();
    } else if (p.type === 'magma') {
      ctx.fillStyle = p.color || '#f97316';
      ctx.beginPath();
      ctx.moveTo(screenX - p.w / 2, p.y + p.h / 2);
      ctx.lineTo(screenX, p.y - p.h / 2);
      ctx.lineTo(screenX + p.w / 2, p.y + p.h / 2);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'lightning') {
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;
      ctx.shadowColor = p.color || '#c026d3'; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, 600); ctx.stroke();
      ctx.strokeStyle = p.color || '#e879f9'; ctx.lineWidth = 14;
      ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, 600); ctx.stroke();
    } else if (p.type === 'dark_fire') {
      var fireGrad = ctx.createRadialGradient(screenX, p.y, 2, screenX, p.y, p.w / 2);
      fireGrad.addColorStop(0, '#ffffff'); fireGrad.addColorStop(0.3, p.color || '#f43f5e'); fireGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath(); ctx.arc(screenX, p.y, p.w / 2, 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'big_meteor') {
      ctx.fillStyle = p.color || '#1e1b4b'; ctx.beginPath(); ctx.arc(screenX, p.y, p.w / 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5; ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(screenX - 3, p.y - 3, p.w * 0.2, 0, Math.PI * 2); ctx.fill();
    } else if (p.type === 'chronos_blackhole') {
      // Vẽ Hố Đen Hỗn Mang của Chronos
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 30;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(screenX + p.w / 2, p.y + p.h / 2, p.w * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#090514';
      ctx.beginPath();
      ctx.arc(screenX + p.w / 2, p.y + p.h / 2, p.w * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3b0764';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (p.type === 'blast_wave') {
      ctx.strokeStyle = p.color || '#c026d3'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(screenX, p.y, p.w * 0.7, -Math.PI * 0.45, Math.PI * 0.45); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(screenX, p.y, p.w * 0.5, -Math.PI * 0.35, Math.PI * 0.35); ctx.stroke();
    } else if (p.type === 'dragon_fire_sweep') {
      var fireGrad = ctx.createLinearGradient(screenX - p.w / 2, p.y + p.h / 2, screenX + p.w / 2, p.y - p.h / 2);
      fireGrad.addColorStop(0, '#3b0764'); fireGrad.addColorStop(0.3, '#c026d3'); fireGrad.addColorStop(0.7, '#f43f5e'); fireGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.moveTo(screenX - p.w / 2, p.y + p.h / 2);
      ctx.quadraticCurveTo(screenX, p.y - p.h, screenX + p.w / 2, p.y + p.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
    } else if (p.type === 'void_crystal') {
      var crystalGrad = ctx.createLinearGradient(screenX - p.w / 2, p.y - p.h / 2, screenX + p.w / 2, p.y + p.h / 2);
      crystalGrad.addColorStop(0, '#ffffff'); crystalGrad.addColorStop(0.4, '#f5d0fe'); crystalGrad.addColorStop(0.8, '#c026d3'); crystalGrad.addColorStop(1, '#3b0764');
      ctx.fillStyle = crystalGrad;
      ctx.beginPath();
      ctx.moveTo(screenX, p.y + p.h / 2);
      ctx.lineTo(screenX + p.w / 2, p.y);
      ctx.lineTo(screenX, p.y - p.h / 2);
      ctx.lineTo(screenX - p.w / 2, p.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.stroke();
    } else if (p.type === 'dark_beam') {
      var angle = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(screenX + p.w / 2, p.y + p.h / 2);
      ctx.rotate(angle);
      ctx.shadowColor = '#e879f9'; ctx.shadowBlur = 18;
      var beamGrad = ctx.createLinearGradient(-p.w / 2, 0, p.w / 2, 0);
      beamGrad.addColorStop(0, 'rgba(59, 7, 100, 0)');
      beamGrad.addColorStop(0.3, '#7e22ce');
      beamGrad.addColorStop(0.8, '#c026d3');
      beamGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(p.w / 2, 0);
      ctx.lineTo(-p.w / 4, -p.h / 2);
      ctx.lineTo(-p.w / 2, 0);
      ctx.lineTo(-p.w / 4, p.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (p.type === 'ice_shard') {
      var angle = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(screenX + p.w / 2, p.y + p.h / 2);
      ctx.rotate(angle);
      ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 14;
      var shardGrad = ctx.createLinearGradient(-p.w / 2, 0, p.w / 2, 0);
      shardGrad.addColorStop(0, '#0284c7');
      shardGrad.addColorStop(0.5, '#38bdf8');
      shardGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = shardGrad;
      ctx.beginPath();
      ctx.moveTo(p.w / 2, 0);
      ctx.lineTo(0, -p.h / 2);
      ctx.lineTo(-p.w / 2, 0);
      ctx.lineTo(0, p.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
    } else if (p.type === 'thunder_wave') {
      ctx.save();
      ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 16;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(screenX + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI, true);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(screenX + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 5. Vẽ các hạt bụi hiệu ứng VFX
  for (var p of particles) {
    var screenX = p.x - cameraX;
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(screenX, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 6. Vẽ quái vật thường
  if (typeof drawEnemies === 'function') drawEnemies(ctx, enemies, cameraX, W, worldTime);

  // 7. Vẽ Boss
  if (typeof drawBoss === 'function') drawBoss(ctx, boss, cameraX, W, stageIndex, worldTime);

  // HIỆU ỨNG VÒNG SÁNG ĐEN HƯ KHÔNG BAO QUANH CHRONOS (MIỄN 90% DMG TRONG 2S)
  if (stageIndex === 8 && boss && !boss.dead && boss.chronosShieldTimer > 0) {
    ctx.save();
    var bScreenX = boss.x - cameraX + boss.w / 2;
    var bScreenY = boss.y + boss.h / 2;
    var pulse = Math.sin(worldTime * 12) * 6;
    var shieldR = boss.w * 0.75 + pulse;

    // Vành hào quang đen tím xoay tròn
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 28;
    ctx.strokeStyle = '#090514';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(bScreenX, bScreenY, shieldR, 0, Math.PI * 2);
    ctx.stroke();

    // Vành viền năng lượng tím phát quang
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bScreenX, bScreenY, shieldR - 3, 0, Math.PI * 2);
    ctx.stroke();

    // Các mảnh hư không xoay quanh vành bảo hộ
    for (var k = 0; k < 6; k++) {
      var rot = worldTime * 4 + (k * Math.PI / 3);
      var ox = bScreenX + Math.cos(rot) * shieldR;
      var oy = bScreenY + Math.sin(rot) * shieldR;
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(ox, oy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // HIỆU ỨNG KHIÊN THẦN GIỚI MIỄN THƯƠNG CỦA SÁNG THẾ THẦN (MÀN 10)
  if (stageIndex === 9 && boss && !boss.dead && boss.immuneTimer > 0) {
    ctx.save();
    var bScreenX = boss.x - cameraX + boss.w / 2;
    var bScreenY = boss.y + boss.h / 2;
    var pulse = Math.sin(worldTime * 14) * 8;
    var shieldR = boss.w * 0.85 + pulse;

    // Vành hào quang thần thánh ngũ sắc
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 32;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(bScreenX, bScreenY, shieldR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bScreenX, bScreenY, shieldR - 4, 0, Math.PI * 2);
    ctx.stroke();

    // 6 tinh cầu ánh sáng xoay vòng quanh khiên miễn thương
    for (var s = 0; s < 6; s++) {
      var rot = worldTime * 5 + (s * Math.PI / 3);
      var ox = bScreenX + Math.cos(rot) * shieldR;
      var oy = bScreenY + Math.sin(rot) * shieldR;
      ctx.fillStyle = s % 2 === 0 ? '#38bdf8' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(ox, oy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 8. Vẽ Hiệp sĩ Kaito
  if (typeof drawHero === 'function') drawHero(ctx, player, cameraX, worldTime, swordTier, SWORD_TIERS);

  // HIỆU ỨNG TIA SÉT PLASMA GIẬT QUANH KAITO KHI BỊ TÊ LIỆT (1 GIÂY)
  if (player && player.stunTimer > 0) {
    ctx.save();
    var screenPx = player.x - cameraX + player.w / 2;
    var screenPy = player.y + player.h / 2;
    ctx.strokeStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2;

    for (var s = 0; s < 4; s++) {
      var ang = (worldTime * 18 + s * 1.5);
      var r = 24 + Math.sin(worldTime * 25 + s) * 8;
      ctx.beginPath();
      ctx.moveTo(screenPx + Math.cos(ang) * 10, screenPy + Math.sin(ang) * 10);
      ctx.lineTo(screenPx + Math.cos(ang) * r, screenPy + Math.sin(ang) * r);
      ctx.lineTo(screenPx + Math.cos(ang + 0.4) * (r + 8), screenPy + Math.sin(ang + 0.4) * (r + 8));
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

// ============================================================================
// [TÌM KIẾM: BESTIARY_PREVIEW] KẾT XUẤT MÔ HÌNH BESTIARY (LIVE PREVIEW RENDERER)
// ============================================================================
function renderBestiaryPreview() {
  if (!bCtx || screenMode !== 'bestiary') return;

  if (bCanvas.width !== 300 || bCanvas.height !== 190) {
    bCanvas.width = 300;
    bCanvas.height = 190;
  }

  bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);

  var item = BESTIARY_DATA[selectedBestiaryIndex];
  if (!item) return;

  if (bestiaryActionTimer > 0) {
    bestiaryActionTimer -= 0.016;
    if (bestiaryActionTimer <= 0) bestiaryAction = 'idle';
  }

  var isAttacking = (bestiaryAction === 'attack');
  var isSkilling = (bestiaryAction === 'skill');

  bCtx.save();
  var centerX = bCanvas.width / 2;
  var centerY = bCanvas.height / 2 + 10;

  if (item.type === 'enemy') {
    var isSkeletonTrans = (item.id === 'skeleton' && isSkilling);
    var dummyEnemy = {
      type: item.id,
      x: 0, y: 0,
      w: isSkeletonTrans ? 52 : (item.id === 'bat' ? 44 : (item.id === 'shadow_gargoyle' ? 48 : 50)),
      h: isSkeletonTrans ? 84 : (item.id === 'slime' ? 38 : (item.id === 'bat' ? 36 : 64)),
      color: item.id === 'slime' ? '#22c55e' : (item.id === 'bat' ? '#a855f7' : '#94a3b8'),
      animTime: worldTime * 4,
      face: 1, flash: 0,
      vy: isAttacking ? -120 : 0,
      onGround: true,
      transformed: isSkeletonTrans,
      normalSlashTimer: (item.id === 'frost_stalker' && isAttacking) ? 1.0 : 0,
      slashTimer: (item.id === 'frost_stalker' && isSkilling) ? 1.0 : (isAttacking ? 1.0 : 0),
      diveTimer: (isAttacking || isSkilling) ? 1.0 : 0,
      slamTimer: (isAttacking || isSkilling) ? 1.0 : 0,
      castTimer: (isAttacking || isSkilling) ? 1.0 : 0,
      pullTimer: isSkilling ? 1.0 : 0,
      isShooting: isSkilling ? 1.0 : 0,
      isPouncing: isAttacking,
      isLeaping: isSkilling
    };

    bCtx.translate(centerX, centerY);
    bCtx.scale(1.4, 1.4);

    if (item.id === 'slime' && typeof drawSlime === 'function') drawSlime(bCtx, dummyEnemy);
    else if (item.id === 'goblin' && typeof drawGoblin === 'function') drawGoblin(bCtx, dummyEnemy);
    else if (item.id === 'skeleton' && typeof drawSkeleton === 'function') drawSkeleton(bCtx, dummyEnemy);
    else if (item.id === 'bat' && typeof drawBat === 'function') drawBat(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'sorcerer' && typeof drawSorcerer === 'function') drawSorcerer(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'dark_knight' && typeof drawDarkKnight === 'function') drawDarkKnight(bCtx, dummyEnemy);
    else if (item.id === 'shadow_gargoyle' && typeof drawObsidianDemon === 'function') drawObsidianDemon(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'void_drake' && typeof drawDarklingDragon === 'function') drawDarklingDragon(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'frost_stalker' && typeof drawFrostStalker === 'function') drawFrostStalker(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'glacial_bat' && typeof drawGlacialBat === 'function') drawGlacialBat(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'storm_raven' && typeof drawStormRaven === 'function') drawStormRaven(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'thunder_ape' && typeof drawThunderApe === 'function') drawThunderApe(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'magma_brute' && typeof drawMagmaBrute === 'function') drawMagmaBrute(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'lava_crawler' && typeof drawLavaCrawler === 'function') drawLavaCrawler(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'sanctuary_golem' && typeof drawSanctuaryGolem === 'function') drawSanctuaryGolem(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'fallen_cherub' && typeof drawFallenCherub === 'function') drawFallenCherub(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'void_devourer' && typeof drawVoidDevourer === 'function') drawVoidDevourer(bCtx, dummyEnemy, worldTime);
    else if (item.id === 'rift_phantom' && typeof drawRiftPhantom === 'function') drawRiftPhantom(bCtx, dummyEnemy, worldTime);
  } else if (item.type === 'boss') {
    var stageIdx = item.stage;
    var bW = 96, bH = 92;
    if (stageIdx === 1) { bW = 100; bH = 110; }
    else if (stageIdx === 2) { bW = 85; bH = 135; }
    else if (stageIdx === 3) { bW = 140; bH = 130; }
    else if (stageIdx === 4) { bW = 130; bH = 150; }
    else if (stageIdx === 5) { bW = 150; bH = 120; }
    else if (stageIdx === 6) { bW = 140; bH = 160; }
    else if (stageIdx === 7) { bW = 90; bH = 140; }
    else if (stageIdx === 8) { bW = 130; bH = 140; }
    else if (stageIdx === 9) { bW = 150; bH = 170; }

    var dummyBoss = {
      w: bW, h: bH,
      x: -bW / 2, y: -bH / 2,
      animTime: worldTime * 3,
      face: 1, flash: 0,
      phase: isSkilling ? 2 : 1,
      active: true,
      meleeTimer: isAttacking ? 1.0 : 0,
      castTimer: isSkilling ? 1.0 : 0,
      vx: 0, vy: 0
    };

    bCtx.translate(centerX, centerY + 5);
    bCtx.scale(0.9, 0.9);

    if (typeof drawBossDetail === 'function') {
      drawBossDetail(bCtx, dummyBoss, 0, 1000, stageIdx, worldTime);
    }
  }

  bCtx.restore();
}

// ============================================================================
// [TÌM KIẾM: MAIN_LOOP] VÒNG LẶP CHÍNH CỦA GAME (ANIMATION FRAME)
// ============================================================================
function gameLoop(timestamp) {
  var dt = Math.min(0.033, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;

  if (screenMode === 'bestiary') {
    worldTime += dt;
    renderBestiaryPreview();
  } else {
    update(dt);
    draw();
  }

  requestAnimationFrame(gameLoop);
}

// ============================================================================
// [TÌM KIẾM: BESTIARY_UI] QUẢN LÝ GIAO DIỆN BÁCH KHOA QUÁI VẬT
// ============================================================================
function triggerBestiaryAction(mode) {
  bestiaryAction = mode;
  bestiaryActionTimer = 1.8;

  var item = BESTIARY_DATA[selectedBestiaryIndex];
  if (!item) return;

  if (mode === 'attack') {
    playSlashSFX(2);
    say(`XEM: ${item.name} - ĐÒN TẤN CÔNG!`, 1500);
  } else {
    if (item.type === 'boss') playBossRoarSFX();
    else playSkillSFX();
    say(`XEM: ${item.name} - THI TRIỂN TUYỆT KỸ!`, 1500);
  }
}

function initBestiaryUI() {
  var tabList = $('bestiaryTabList');
  if (!tabList) return;
  tabList.innerHTML = '';

  BESTIARY_DATA.forEach((item, index) => {
    var btn = document.createElement('button');
    btn.className = `bestiary-btn ${item.type === 'boss' ? 'boss-btn' : ''} ${index === selectedBestiaryIndex ? 'active' : ''}`;
    btn.innerHTML = `<span>${item.name}</span> <small>${item.type === 'boss' ? 'BOSS' : 'QUÁI'}</small>`;
    btn.onclick = () => {
      selectedBestiaryIndex = index;
      bestiaryAction = 'idle';
      document.querySelectorAll('.bestiary-btn').forEach((b, i) => b.classList.toggle('active', i === index));
      updateBestiaryDetails();
    };
    tabList.appendChild(btn);
  });

  updateBestiaryDetails();
}

function updateBestiaryDetails() {
  var item = BESTIARY_DATA[selectedBestiaryIndex];
  var info = $('bestiaryInfo');
  if (!item || !info) return;

  info.innerHTML = `
    <span class="role-tag" style="background:${item.type === 'boss' ? '#b91c1c' : '#0284c7'}">${item.role}</span>
    <h3 style="color:${item.type === 'boss' ? '#f87171' : '#38bdf8'}">${item.name}</h3>
    <div class="bestiary-stats">
      <div class="stat-pill">Máu: <b>${item.hp} HP</b></div>
      <div class="stat-pill">Sát thương: <b>${item.dmg} DMG</b></div>
      <div class="stat-pill">Tốc độ: <b>${item.spd}</b></div>
    </div>
    <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0; white-space: pre-line;">${item.desc}</p>
  `;
}

function showBestiary() {
  screenMode = 'bestiary';
  bestiaryAction = 'idle';
  showOverlay(panelBestiary);
  initBestiaryUI();
}

function closeBestiary() {
  if (running) {
    hideOverlay();
    screenMode = 'game';
  } else {
    showOverlay(panelIntro);
    screenMode = 'intro';
  }
}

// ============================================================================
// [TÌM KIẾM: HUD_UPDATE] CẬP NHẬT HUD VÀ ĐIỀU HƯỚNG GIAO DIỆN
// ============================================================================
function updateHUD() {
  if (!player) return;
  if ($('hpText')) $('hpText').textContent = `${Math.ceil(player.hp)} / ${player.maxHp} HP`;
  if ($('hpBar')) $('hpBar').style.width = `${Math.max(0, Math.min(100, (100 * player.hp) / player.maxHp))}%`;
  if ($('manaText')) $('manaText').textContent = `${Math.ceil(player.mana)} / ${player.maxMana} MP`;
  if ($('manaBar')) $('manaBar').style.width = `${Math.max(0, Math.min(100, (100 * player.mana) / player.maxMana))}%`;
  if ($('goldText')) $('goldText').textContent = gold;
  if ($('killText')) $('killText').textContent = kills;

  var tier = SWORD_TIERS[swordTier];
  if ($('swordTierName')) $('swordTierName').textContent = tier.name;
  if ($('goldCost')) $('goldCost').textContent = tier.cost > 0 ? tier.cost : 'MAX';

  var upgradeBtn = $('upgradeBtn');
  if (upgradeBtn) {
    upgradeBtn.innerHTML = `⬆ NÂNG CẤP TRANG BỊ`;
  }

  // Cập nhật thanh máu và tên Boss khi kích hoạt
  if (boss && boss.active && !boss.dead && bossHud) {
    bossHud.hidden = false;
    if ($('bossName')) $('bossName').textContent = STAGES[stageIndex].bossName;
    if ($('bossHpText')) $('bossHpText').textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
    if ($('bossBar')) $('bossBar').style.width = `${Math.max(0, Math.min(100, (100 * boss.hp) / boss.maxHp))}%`;
  } else if (bossHud) {
    bossHud.hidden = true;
  }
}

function hideAllPanels() {
  if (panelIntro) panelIntro.hidden = true;
  if (panelBestiary) panelBestiary.hidden = true;
  if (panelGuide) panelGuide.hidden = true;
  if (panelSettings) panelSettings.hidden = true;
  if (panelUpgrade) panelUpgrade.hidden = true;
  if (panelPause) panelPause.hidden = true;
  if (panelEnd) panelEnd.hidden = true;
  if (panelPasscode) panelPasscode.hidden = true;
  if (panelStageSelect) panelStageSelect.hidden = true;
}

function showOverlay(panelEl) {
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.hidden = false;
  overlay.style.display = 'flex';
  hideAllPanels();
  if (panelEl) panelEl.hidden = false;
}

function hideOverlay() {
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.hidden = true;
  overlay.style.display = 'none';
  hideAllPanels();
}

function startNextStage() {
  if (stageIndex < STAGES.length - 1) {
    buildStage(stageIndex + 1, true, false); // isRespawn = false -> luôn ở đầu màn x = 80
    writeSave();
    var bonusPercent = stageIndex + 1;
    say(`MÀN MỚI: ${STAGES[stageIndex].name} (QUÁI VẬT +${bonusPercent}% MÁU)!`, 2500);
  } else {
    victory = true; running = false;
    showEndScreen(true);
  }
}

function showEndScreen(win) {
  showOverlay(panelEnd);
  if (hud) hud.hidden = true;
  if (bossHud) bossHud.hidden = true;
  writeSave();

  var endContent = $('endContent');
  if (endContent) {
    endContent.innerHTML = win ? `
      <div class="eyebrow">HUYỀN THOẠI ĐƯỢC VIẾT NÊN</div>
      <h1>CHIẾN THẮNG<br><em>VINH QUANG!</em></h1>
      <p>Chúc mừng dũng sĩ Kaito đã vượt qua muôn vàn cõi giới và cứu rỗi toàn thể vương quốc!</p>
      <div class="intro-stats">
        <span>🪙 ${gold} Vàng</span>
        <span>☠ ${kills} Quái vật</span>
        <span>⚔ ${SWORD_TIERS[swordTier].name}</span>
      </div>
      <div class="menu-buttons">
        <button id="restartGameBtn" class="primary-btn">CHƠI LẠI TỪ ĐẦU <span>➜</span></button>
      </div>
    ` : `
      <div class="eyebrow">HÀNH TRÌNH CHƯA KẾT THÚC</div>
      <h1>BẠN ĐÃ<br><em>GỤC NGÃ</em></h1>
      <p>Đừng nản lòng! Tích lũy thêm vàng, rèn giáp sắc bén hơn và tái chiến!</p>
      <div class="intro-stats">
        <span>🪙 ${gold} Vàng</span>
        <span>☠ ${kills} Quái vật</span>
      </div>
      <div class="menu-buttons">
        <button id="restartGameBtn" class="primary-btn">HỒI SINH TẠI ĐIỂM KIỂM TRA <span>➜</span></button>
      </div>
    `;

    var restartBtn = $('restartGameBtn');
    if (restartBtn) restartBtn.onclick = () => resetGame(!win);
  }
}

function resetGame(keepStats = false) {
  gameOver = false;
  victory = false;
  paused = false;
  running = true;
  screenMode = 'game';

  // Xóa sạch bộ nhớ phím bấm đang kẹt
  for (var k in keys) keys[k] = false;

  if (!keepStats) {
    stageIndex = 0;
    gold = 0;
    kills = 0;
    swordTier = 0;
    armorTier = 0;
    bootsTier = 0;
    checkpointX = 80;
  }

  // keepStats = true nghĩa là hồi sinh tại chỗ/checkpoint -> truyền isRespawn = keepStats
  buildStage(stageIndex, keepStats, keepStats);

  if (player) {
    player.dead = false;
  }

  hideOverlay();

  // Trả lại tiêu điểm cho cửa sổ trình duyệt để nhận phím ngay
  if (document.activeElement) document.activeElement.blur();
  window.focus();

  if (hud) hud.hidden = false;
  if ($('footerStatus')) $('footerStatus').textContent = 'Đang chiến đấu';
  say('HÃY TIẾN VỀ PHÍA TRƯỚC VÀ TIÊU DIỆT QUÁI VẬT!');
}

// ============================================================================
// [TÌM KIẾM: TAB_UPGRADE] QUẢN LÝ GIAO DIỆN & NÂNG CẤP 3 TAB (KIẾM / GIÁP / GIÀY)
// ============================================================================
function switchUpgradeTab(tab) {
  currentUpgradeTab = tab;

  // Đổi trạng thái active giữa 3 nút tab
  if ($('tabSwordBtn')) $('tabSwordBtn').className = (tab === 'sword') ? 'primary-btn' : 'secondary-btn';
  if ($('tabArmorBtn')) $('tabArmorBtn').className = (tab === 'armor') ? 'primary-btn' : 'secondary-btn';
  if ($('tabBootsBtn')) $('tabBootsBtn').className = (tab === 'boots') ? 'primary-btn' : 'secondary-btn';

  renderUpgradeModalContent();
}

function renderUpgradeModalContent() {
  var iconEl = $('upgradeIcon');
  var titleEl = $('upgradeCurrentTier');
  var statLabel = $('upgradeStatLabel');
  var statText = $('upgradeStatText');
  var specLabel = $('upgradeSpecialLabel');
  var specText = $('upgradeSpecialText');
  var costText = $('upgradeCostText');
  var confirmBtn = $('confirmUpgradeBtn');

  if (!iconEl || !titleEl) return;

  // TAB 1: THẦN KIẾM
  if (currentUpgradeTab === 'sword') {
    iconEl.textContent = '⚔';
    var cur = SWORD_TIERS[swordTier];
    var next = SWORD_TIERS[swordTier + 1];

    if (swordTier >= SWORD_TIERS.length - 1) {
      titleEl.textContent = cur.name + ' (TỐI ĐA)';
      statLabel.textContent = 'Sát thương cơ bản:';
      statText.textContent = `${12 + cur.dmgBonus} DMG (MAX)`;
      specLabel.textContent = 'Hào quang:';
      specText.textContent = cur.aura;
      costText.textContent = 'ĐÃ ĐẠT TỐI ĐA';
      confirmBtn.disabled = true;
    } else {
      titleEl.textContent = next.name;
      statLabel.textContent = 'Sát thương tăng:';
      statText.textContent = `${12 + cur.dmgBonus} DMG ➔ ${12 + next.dmgBonus} DMG`;
      specLabel.textContent = 'Hào quang:';
      specText.textContent = `${cur.aura} ➔ ${next.aura}`;
      costText.textContent = `${cur.cost} Vàng`;
      confirmBtn.disabled = (gold < cur.cost);
    }
  }
  // TAB 2: ÁO GIÁP
  else if (currentUpgradeTab === 'armor') {
    iconEl.textContent = '🛡';
    var cur = ARMOR_TIERS[armorTier];
    var next = ARMOR_TIERS[armorTier + 1];

    if (armorTier >= ARMOR_TIERS.length - 1) {
      titleEl.textContent = cur.name + ' (TỐI ĐA)';
      statLabel.textContent = 'Máu & Giảm thương:';
      statText.textContent = `+${cur.hpBonus} HP | Giảm ${Math.round(cur.dmgReduction * 100)}% DMG`;
      specLabel.textContent = 'Nội tại:';
      specText.textContent = cur.desc;
      costText.textContent = 'ĐÃ ĐẠT TỐI ĐA';
      confirmBtn.disabled = true;
    } else {
      titleEl.textContent = next.name;
      statLabel.textContent = 'Máu & Giảm thương:';
      statText.textContent = `+${cur.hpBonus} HP ➔ +${next.hpBonus} HP (Giảm ${Math.round(next.dmgReduction * 100)}%)`;
      specLabel.textContent = 'Nội tại:';
      specText.textContent = next.desc;
      costText.textContent = `${cur.cost} Vàng`;
      confirmBtn.disabled = (gold < cur.cost);
    }
  }
  // TAB 3: GIÀY CHIẾN
  else if (currentUpgradeTab === 'boots') {
    iconEl.textContent = '👢';
    var cur = BOOTS_TIERS[bootsTier];
    var next = BOOTS_TIERS[bootsTier + 1];

    if (bootsTier >= BOOTS_TIERS.length - 1) {
      titleEl.textContent = cur.name + ' (TỐI ĐA)';
      statLabel.textContent = 'Tốc độ di chuyển:';
      statText.textContent = `+${Math.round((cur.spdMult - 1) * 100)}% (MAX)`;
      specLabel.textContent = 'Kỹ năng cơ động:';
      specText.textContent = cur.desc;
      costText.textContent = 'ĐÃ ĐẠT TỐI ĐA';
      confirmBtn.disabled = true;
    } else {
      titleEl.textContent = next.name;
      statLabel.textContent = 'Tốc độ tăng:';
      statText.textContent = `+${Math.round((cur.spdMult - 1) * 100)}% ➔ +${Math.round((next.spdMult - 1) * 100)}%`;
      specLabel.textContent = 'Kỹ năng:';
      specText.textContent = next.desc;
      costText.textContent = `${cur.cost} Vàng`;
      confirmBtn.disabled = (gold < cur.cost);
    }
  }
}

function openUpgradeModal() {
  switchUpgradeTab('sword');
  showOverlay(panelUpgrade);
}

// ============================================================================
// [TÌM KIẾM: INPUT_CONTROLS] SỰ KIỆN PHÍM BẤM & TƯƠNG TÁC
// ============================================================================
document.addEventListener('keydown', e => {
  if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
  if (screenMode === 'intro' && !overlay.hidden) {
    if (e.code === 'Enter' || e.code === 'KeyJ') { handleStartGame(false); return; }
  }

  // Nhận diện mã PIN 9999 mở khóa chọn màn
  if (e.key >= '0' && e.key <= '9') {
    keySeq += e.key;
    if (keySeq.length > 4) keySeq = keySeq.slice(-4);
    if (keySeq === '9999') {
      devUnlocked = true;
      sessionStorage.setItem('devUnlocked', 'true');
      openStageSelectGrid();
      say('🔓 ĐÃ MỞ KHÓA CHỌN MÀN CHƠI (MÃ: 9999)!', 2200);
      keySeq = '';
    }
  }

  keys[e.code] = true;
  if (e.repeat) return;
  if (e.code === 'KeyJ' || e.code === 'KeyZ') attack();
  if (e.code === 'KeyK' || e.code === 'KeyX') skill();
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') dash();
  if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
});

document.addEventListener('keyup', e => { keys[e.code] = false; });

function togglePause() {
  if (!running) {
    say('HÃY BẮT ĐẦU TRÒ CHƠI ĐỂ TẠM DỪNG!');
    return;
  }
  paused = !paused;
  if (paused) {
    showOverlay(panelPause);
    if ($('pauseBtn')) $('pauseBtn').textContent = '▶ Tiếp tục';
    if ($('footerStatus')) $('footerStatus').textContent = 'Đang tạm dừng';
  } else {
    hideOverlay();
    if ($('pauseBtn')) $('pauseBtn').textContent = 'Ⅱ Tạm dừng';
    if ($('footerStatus')) $('footerStatus').textContent = 'Đang chiến đấu';
  }
}

function toggleSound() {
  soundOn = !soundOn;
  if (soundOn) initAudio();
  if ($('soundBtn')) $('soundBtn').textContent = `♫ Âm thanh: ${soundOn ? 'Bật' : 'Tắt'}`;
  if ($('toggleSoundSetting')) $('toggleSoundSetting').textContent = soundOn ? 'Đang Bật' : 'Đang Tắt';
  writeSave();
}

// Hỗ trợ nút điều khiển cảm ứng di động
document.querySelectorAll('.mobile-controls button').forEach(btn => {
  var key = btn.dataset.key;
  btn.addEventListener('pointerdown', e => {
    e.preventDefault();
    initAudio();
    if (key === 'left') keys.ArrowLeft = true;
    else if (key === 'right') keys.ArrowRight = true;
    else if (key === 'jump') keys.Space = true;
    else if (key === 'attack') attack();
    else if (key === 'skill') skill();
    else if (key === 'dash') dash();
  });
  btn.addEventListener('pointerup', e => {
    e.preventDefault();
    if (key === 'left') keys.ArrowLeft = false;
    if (key === 'right') keys.ArrowRight = false;
  });
});

function handleStartGame(keepStats = false) {
  initAudio();
  resetGame(keepStats);
}

function showGuide() { showOverlay(panelGuide); }
function closeGuide() { if (running) hideOverlay(); else showOverlay(panelIntro); }
function showSettings() { showOverlay(panelSettings); }
function closeSettings() { writeSave(); if (running) hideOverlay(); else showOverlay(panelIntro); }

// ============================================================================
// [TÌM KIẾM: STAGE_SELECT_9999] QUẢN LÝ BẢNG CHỌN MÀN CHƠI & MẬT MÃ MỞ KHÓA
// ============================================================================
var passcodeInput = $('passcodeInput');
var passcodeError = $('passcodeError');
var stageGrid = $('stageGrid');

function openStageSelectFlow() {
  initAudio();
  if (devUnlocked) {
    openStageSelectGrid();
  } else {
    if (passcodeInput) passcodeInput.value = '';
    if (passcodeError) passcodeError.hidden = true;
    showOverlay(panelPasscode);
    if (passcodeInput) setTimeout(() => passcodeInput.focus(), 120);
  }
}

function verifyPasscode() {
  var val = passcodeInput ? passcodeInput.value.trim() : '';
  if (val === '9999') {
    devUnlocked = true;
    sessionStorage.setItem('devUnlocked', 'true');
    if (passcodeError) passcodeError.hidden = true;
    openStageSelectGrid();
    say('🔓 ĐÃ MỞ KHÓA BẢNG CHỌN MÀN CHƠI!', 2200);
  } else {
    if (passcodeError) passcodeError.hidden = false;
    playHitSFX();
    shake = 8;
  }
}

function openStageSelectGrid() {
  screenMode = 'stageSelect';
  renderStageSelectGrid();
  showOverlay(panelStageSelect);
}

function renderStageSelectGrid() {
  if (!stageGrid) return;
  stageGrid.innerHTML = '';

  STAGES.forEach((stage, idx) => {
    var card = document.createElement('div');
    card.className = 'stage-card';
    card.innerHTML = `
      <div>
        <div class="stage-card-num">MÀN ${idx + 1} / 10</div>
        <div class="stage-card-title">${stage.name}</div>
        <div class="stage-card-boss">💥 Trùm: ${stage.bossName} (${stage.bossHp} HP)</div>
      </div>
      <button class="stage-card-btn">⚡ CHƠI NAY</button>
    `;
    card.onclick = () => jumpToStage(idx);
    stageGrid.appendChild(card);
  });
}

function jumpToStage(idx) {
  stageIndex = idx;
  checkpointX = 80;
  buildStage(stageIndex, true, false); // isRespawn = false -> luôn ở đầu màn x = 80
  if (player) {
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    player.dead = false;
  }
  gameOver = false;
  victory = false;
  running = true;
  paused = false;
  screenMode = 'game';
  hideOverlay();
  if (hud) hud.hidden = false;
  if ($('footerStatus')) $('footerStatus').textContent = 'Đang chiến đấu';
  say(`⚡ ĐÃ CHUYỂN TỚI ${STAGES[stageIndex].name}!`, 2500);
}

// Gán toàn bộ hàm ra window để HTML gọi trực tiếp
window.handleStartGame = handleStartGame;
window.showBestiary = showBestiary;
window.closeBestiary = closeBestiary;
window.showGuide = showGuide;
window.closeGuide = closeGuide;
window.showSettings = showSettings;
window.closeSettings = closeSettings;
window.toggleSound = toggleSound;
window.togglePause = togglePause;
window.openStageSelectFlow = openStageSelectFlow;
window.switchUpgradeTab = switchUpgradeTab;

// Gán sự kiện click nút DOM
if ($('startBtn')) $('startBtn').onclick = () => handleStartGame(false);
if ($('continueBtn')) $('continueBtn').onclick = () => handleStartGame(true);
if ($('bestiaryBtn')) $('bestiaryBtn').onclick = showBestiary;
if ($('bestiaryNavBtn')) $('bestiaryNavBtn').onclick = showBestiary;
if ($('closeBestiaryBtn')) $('closeBestiaryBtn').onclick = closeBestiary;
if ($('guideBtn')) $('guideBtn').onclick = showGuide;
if ($('closeGuideBtn')) $('closeGuideBtn').onclick = closeGuide;
if ($('settingsBtn')) $('settingsBtn').onclick = showSettings;
if ($('closeSettingsBtn')) $('closeSettingsBtn').onclick = closeSettings;
if ($('soundBtn')) $('soundBtn').onclick = toggleSound;
if ($('toggleSoundSetting')) $('toggleSoundSetting').onclick = toggleSound;

if ($('passcodeInput')) {
  $('passcodeInput').onkeydown = (e) => {
    if (e.key === 'Enter') verifyPasscode();
  };
}
if ($('confirmPasscodeBtn')) $('confirmPasscodeBtn').onclick = verifyPasscode;
if ($('closePasscodeBtn')) $('closePasscodeBtn').onclick = () => {
  if (running) hideOverlay(); else showOverlay(panelIntro);
};
if ($('closeStageSelectBtn')) $('closeStageSelectBtn').onclick = () => {
  if (running) hideOverlay(); else showOverlay(panelIntro);
};
if ($('stageSelectBtn')) $('stageSelectBtn').onclick = openStageSelectFlow;
if ($('stageSelectNavBtn')) $('stageSelectNavBtn').onclick = openStageSelectFlow;

if ($('btnBestiaryAttack')) $('btnBestiaryAttack').onclick = () => triggerBestiaryAction('attack');
if ($('btnBestiarySkill')) $('btnBestiarySkill').onclick = () => triggerBestiaryAction('skill');

if ($('volumeSlider')) {
  $('volumeSlider').addEventListener('input', e => {
    masterVolume = parseFloat(e.target.value) / 100;
    writeSave();
  });
}

if ($('resetSaveBtn')) {
  $('resetSaveBtn').onclick = () => {
    if (confirm('Bạn có chắc chắn muốn xóa dữ liệu chơi lại từ đầu không?')) resetSave();
  };
}

if ($('pauseBtn')) $('pauseBtn').onclick = togglePause;
if ($('resumeBtn')) $('resumeBtn').onclick = togglePause;
if ($('restartStageBtn')) $('restartStageBtn').onclick = () => resetGame(true);
if ($('quitMenuBtn')) {
  $('quitMenuBtn').onclick = () => {
    running = false; paused = false; screenMode = 'intro';
    showOverlay(panelIntro);
    if (hud) hud.hidden = true;
    if (bossHud) bossHud.hidden = true;
  };
}

if ($('upgradeBtn')) $('upgradeBtn').onclick = openUpgradeModal;
if ($('closeUpgradeBtn')) $('closeUpgradeBtn').onclick = hideOverlay;

// Xử lý xác nhận nâng cấp cho từng Tab (Kiếm / Giáp / Giày)
if ($('confirmUpgradeBtn')) {
  $('confirmUpgradeBtn').onclick = () => {
    if (currentUpgradeTab === 'sword') {
      var cur = SWORD_TIERS[swordTier];
      if (gold >= cur.cost && swordTier < SWORD_TIERS.length - 1) {
        gold -= cur.cost;
        swordTier++;
        playChestSFX();
        say(`NÂNG CẤP KIẾM THÀNH CÔNG: ${SWORD_TIERS[swordTier].name}!`, 2500);
        writeSave();
        renderUpgradeModalContent();
        updateHUD();
      } else {
        say('CHƯA ĐỦ VÀNG HOẶC ĐÃ ĐẠT CẤP TỐI ĐA!');
      }
    } else if (currentUpgradeTab === 'armor') {
      var cur = ARMOR_TIERS[armorTier];
      if (gold >= cur.cost && armorTier < ARMOR_TIERS.length - 1) {
        gold -= cur.cost;
        armorTier++;
        player.maxHp = 100 + ARMOR_TIERS[armorTier].hpBonus; // Đồng bộ lượng Max HP mới
        player.hp = player.maxHp;                             // Hồi đầy thanh máu mới
        playChestSFX();
        say(`NÂNG CẤP GIÁP THÀNH CÔNG: ${ARMOR_TIERS[armorTier].name}!`, 2500);
        writeSave();
        renderUpgradeModalContent();
        updateHUD();
      } else {
        say('CHƯA ĐỦ VÀNG HOẶC ĐÃ ĐẠT CẤP TỐI ĐA!');
      }
    } else if (currentUpgradeTab === 'boots') {
      var cur = BOOTS_TIERS[bootsTier];
      if (gold >= cur.cost && bootsTier < BOOTS_TIERS.length - 1) {
        gold -= cur.cost;
        bootsTier++;
        playChestSFX();
        say(`NÂNG CẤP GIÀY THÀNH CÔNG: ${BOOTS_TIERS[bootsTier].name}!`, 2500);
        writeSave();
        renderUpgradeModalContent();
        updateHUD();
      } else {
        say('CHƯA ĐỦ VÀNG HOẶC ĐÃ ĐẠT CẤP TỐI ĐA!');
      }
    }
  };
}

// ============================================================================
// KHỞI ĐỘNG TRÒ CHƠI LẦN ĐẦU TIÊN
// ============================================================================
loadSave();
buildStage(stageIndex, false);
running = false;
screenMode = 'intro';
showOverlay(panelIntro);

requestAnimationFrame(gameLoop);
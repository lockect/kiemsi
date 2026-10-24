/**
 * ============================================================================
 * LEVEL.JS - QUẢN LÝ VÀ KHỞI TẠO BẢN ĐỒ MÀN CHƠI (LEVEL BUILDER)
 * ============================================================================
 */

'use strict';

function buildStage(index, keepPlayerStats = true) {
  stageIndex = index;
  const stage = STAGES[index];
  const levelLength = stage.length;
  cameraX = 0;
  checkpointX = 80;

  if (keepPlayerStats && player) {
    player.x = 80;
    player.y = 380;
    player.vx = 0;
    player.vy = 0;
    player.invuln = 1.5;
    player.attackTime = 0;
    player.attackCd = 0;
    player.dashTimer = 0;
    player.hp = Math.min(player.maxHp, player.hp + 30);
    player.mana = player.maxMana;
  } else {
    player = newPlayer();
  }

  enemies = [];
  particles = [];
  pickups = [];
  hazards = [];
  chests = [];
  projectiles = [];
  platforms = [];

  // Platform mặt đất chính
  platforms.push({ x: 0, y: 600, w: levelLength, h: 200, isGround: true });

  // Tự động sinh bục nhảy, hố bẫy, rương báu, quái vật
  let curX = 320;
  while (curX < levelLength - 500) {
    const gap = rand(110, 180);
    curX += gap;

    const platY = rand(420, 520);
    const platW = rand(130, 220);

    platforms.push({ x: curX, y: platY, w: platW, h: 20, isGround: false });

    // Tiền vàng
    if (Math.random() < 0.7) {
      pickups.push({ x: curX + platW / 2, y: platY - 28, type: 'gold', val: 5, taken: false });
    }

    // Quái vật trên bục
    if (Math.random() < 0.75) {
      const enemyType = stage.enemyTypes[Math.floor(Math.random() * stage.enemyTypes.length)];
      enemies.push(makeEnemy(enemyType, curX + platW / 2, platY));
    }

    // Rương kho báu
    if (Math.random() < 0.25) {
      chests.push({ x: curX + platW - 35, y: platY - 32, w: 32, h: 32, opened: false });
    }

    // Bẫy gai
    if (Math.random() < 0.35 && curX < levelLength - 800) {
      hazards.push({ x: curX - gap / 2, y: 585, w: 60, h: 15 });
    }

    curX += platW;
  }

  // Quái vật đất
  for (let i = 0; i < Math.floor(levelLength / 400); i++) {
    const ex = rand(350, levelLength - 600);
    const enemyType = stage.enemyTypes[Math.floor(Math.random() * stage.enemyTypes.length)];
    enemies.push(makeEnemy(enemyType, ex, 600));
  }

  // Tinh thể và tim nhặt
  for (let i = 0; i < Math.floor(levelLength / 480); i++) {
    pickups.push({
      x: rand(200, levelLength - 400),
      y: rand(400, 530),
      type: Math.random() < 0.7 ? 'gold' : Math.random() < 0.85 ? 'heart' : 'mana',
      val: 5,
      taken: false
    });
  }

  // Tượng Checkpoint
  checkpoint = { x: levelLength * 0.48, y: 520, w: 30, h: 80, active: false };

  // Cổng ra
  exitGate = { x: levelLength - 160, y: 460, w: 70, h: 140, open: false };

  // Boss màn
  boss = {
    x: levelLength - 380, y: 480,
    w: index === 2 ? 110 : 96,
    h: index === 2 ? 110 : 92,
    hp: stage.bossHp, maxHp: stage.bossHp,
    active: false, dead: false,
    attackCd: 1.5,
    skillCd: 3.0,
    phase: 1,
    flash: 0,
    animTime: 0,
    face: -1
  };

  updateHUD();
  if ($('stageName')) $('stageName').textContent = stage.name;
  if ($('stageSub')) $('stageSub').textContent = stage.sub;
}

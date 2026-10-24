
/**
 * ============================================================================
 * AUDIO.JS - HỆ THỐNG TỔNG HỢP ÂM THANH (WEB AUDIO API SYNTHESIZER)
 * ============================================================================
 */

'use strict';

function initAudio() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    console.warn('Khởi tạo AudioContext bị chặn:', e);
  }
}

function playSynthSound(freq, dur = 0.1, type = 'sine', vol = 0.05, slideFreq = null) {
  if (!soundOn) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), now + dur);
    }

    const finalVol = vol * masterVolume;
    gain.gain.setValueAtTime(finalVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + dur);
  } catch (e) {}
}

const playJumpSFX = () => playSynthSound(280, 0.1, 'triangle', 0.04, 520);

const playSlashSFX = (combo) => {
  const freq = combo === 3 ? 160 : combo === 2 ? 320 : 420;
  const slide = combo === 3 ? 720 : 220;
  const dur = combo === 3 ? 0.18 : 0.1;
  playSynthSound(freq, dur, combo === 3 ? 'sawtooth' : 'triangle', 0.06, slide);
};

const playSkillSFX = () => {
  playSynthSound(550, 0.25, 'sawtooth', 0.08, 120);
  setTimeout(() => playSynthSound(880, 0.3, 'sine', 0.06, 350), 50);
};

const playDashSFX = () => playSynthSound(220, 0.12, 'sine', 0.04, 80);
const playHitSFX = () => playSynthSound(180, 0.08, 'square', 0.05, 60);
const playHurtSFX = () => playSynthSound(130, 0.15, 'sawtooth', 0.08, 40);

const playCoinSFX = () => {
  playSynthSound(988, 0.08, 'sine', 0.04);
  setTimeout(() => playSynthSound(1318, 0.12, 'sine', 0.04), 40);
};

const playChestSFX = () => {
  playSynthSound(523, 0.12, 'triangle', 0.06);
  setTimeout(() => playSynthSound(659, 0.12, 'triangle', 0.06), 80);
  setTimeout(() => playSynthSound(784, 0.12, 'triangle', 0.06), 160);
  setTimeout(() => playSynthSound(1046, 0.25, 'sine', 0.08), 240);
};

const playBossRoarSFX = () => playSynthSound(90, 0.4, 'sawtooth', 0.1, 180);

const playVictorySFX = () => {
  [523, 659, 784, 1046, 1318].forEach((f, i) => {
    setTimeout(() => playSynthSound(f, 0.25, 'triangle', 0.07), i * 120);
  });
};

const playDefeatSFX = () => {
  [300, 250, 200, 150].forEach((f, i) => {
    setTimeout(() => playSynthSound(f, 0.3, 'sawtooth', 0.08), i * 150);
  });
};

"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const LEFT = -1;
const RIGHT = 1;
let LINE = "#161616";
let PAPER = "#fafaf8";
let BLUE = "#245cc4";
let RED = "#c4302a";
let YOLK = "#eebc2d";
let WHITE = "#fffffa";
const GRAVITY = 420;

const settings = {
  colorScheme: "sunset",
  colorSchemes: {
    classic: {
      line: "#161616",
      paper: "#fafaf8",
      pale: "#e8e8e2",
      blueTeam: "#245cc4",
      redTeam: "#c4302a",
      yolk: "#eebc2d",
      eggWhite: "#fffffa",
    },
    dark: {
      line: "#f4f4ec",
      paper: "#06080a",
      pale: "#20242a",
      blueTeam: "#5ab4ff",
      redTeam: "#ff6066",
      yolk: "#ffd54a",
      eggWhite: "#fafaf0",
    },
    blueprint: {
      line: "#ebf9ff",
      paper: "#0b2f56",
      pale: "#24527a",
      blueTeam: "#74d4ff",
      redTeam: "#ff787e",
      yolk: "#ffdc58",
      eggWhite: "#f8feff",
    },
    sunset: {
      line: "#2e1f24",
      paper: "#ffeecb",
      pale: "#f4cda4",
      blueTeam: "#2069b6",
      redTeam: "#c43540",
      yolk: "#ee9e2d",
      eggWhite: "#fffbef",
    },
    forest: {
      line: "#eef4e2",
      paper: "#143024",
      pale: "#36523e",
      blueTeam: "#60beff",
      redTeam: "#ff765c",
      yolk: "#f2ca4a",
      eggWhite: "#f8fae6",
    },
  },
  maxLeftTanks: 4,
  maxLeftMotorcycles: 3,
  maxLeftAirplanes: 3,
  maxLeftBombers: 1,
  maxLeftHelicopters: 1,
  maxLeftDrones: 5,
  maxLeftCastles: 1,
  maxLeftSoldiers: 12,
  maxRightTanks: 4,
  maxRightMotorcycles: 3,
  maxRightAirplanes: 3,
  maxRightBombers: 1,
  maxRightHelicopters: 1,
  maxRightDrones: 5,
  maxRightCastles: 1,
  maxRightSoldiers: 12,
  countReduction: 0.5,
  aircraftCountMin: 0,
  fireRate: 0.1,
  tankFireRate: 0.1,
  motorcycleFireRate: 0.1,
  airplaneFireRate: 0.1,
  bomberFireRate: 0.1,
  helicopterFireRate: 0.1,
  castleFireRate: 0.1,
  soldierFireRate: 0.1,
  soldierProjectileRangeMultiplier: 0.5,
  motorcycleProjectileRangeMultiplier: 0.5,
  soundVolume: 3.0,
  showWreckage: true,
  speechBubbleFrequency: 0.1,
  speechIdleComments: [
    "Hold the line!",
    "Keep firing!",
    "We can do this!",
    "Don't give up!",
    "Stay strong!",
    "We need reinforcements!",
    "Watch your six!",
    "Keep your heads down!",
    "We can win this!",
    "Stay alert!",
    "Don't let them through!",
    "We need more ammo!",
    "Keep your eyes open!",
    "We can hold them off!",
    "Stay focused!",
    "Don't let them flank us!",
    "We need backup!",
    "Keep your positions!",
    "We can take them!",
    "Stay sharp!",
    "Shell yeah!",
    "Yolk squad ready!",
    "No cracked ranks!",
    "Eggspect trouble!",
    "Shell formation!",
    "Keep it over easy!",
    "Nobody gets poached today!",
    "Crack team ready!",
    "Don't chicken out!",
    "Guard the carton!",
  ],
  speechHitComments: [
    "Incoming!",
    "Take cover!",
    "We're under attack!",
    "They're hitting us!",
    "Watch out!",
    "They're getting through!",
    "We need reinforcements!",
    "Hold the line!",
    "Keep firing!",
    "Don't give up!",
    "Stay strong!",
    "Keep your heads down!",
    "We can do this!",
    "Stay alert!",
    "Don't let them through!",
    "We need more ammo!",
    "Keep your eyes open!",
    "We can hold them off!",
    "Stay focused!",
    "Don't let them flank us!",
    "Egg incoming!",
    "That one stung!",
    "Shells down!",
    "I've been scrambled!",
    "My shell has a dent!",
    "That cracked me up!",
    "Yolk breach!",
    "Egg on my face!",
    "They poached us!",
    "Shell shock!",
  ],
  speechFireComments: [
    "Reloading!",
    "Keep shooting!",
    "Don't stop firing!",
    "We need more ammo!",
    "Keep your heads down!",
    "We can do this!",
    "Stay alert!",
    "Don't let them through!",
    "We need backup!",
    "Hold the line!",
    "Keep firing!",
    "Don't give up!",
    "Stay strong!",
    "Watch your six!",
    "We can win this!",
    "Stay focused!",
    "Don't let them flank us!",
    "We can take them!",
    "Stay sharp!",
    "Let it fly!",
    "Scramble them!",
    "Sunny side up!",
    "Launch the breakfast!",
    "Serve it hot!",
    "Eggs away!",
    "Time to shell out!",
    "Put them on toast!",
    "Over easy, under fire!",
    "Crack shot!",
  ],
  endGameTitles: [
    "Eggshell Domination",
    "Yolkstorm Victory",
    "Scrambled Defeat",
    "Shell Shocked",
    "Omelet Overload",
    "Sunny Side Supremacy",
    "Hard-Boiled Triumph",
    "The Great Eggsplosion",
    "Crackdown Complete",
    "Breakfast Battlefield",
  ],
  unitLegend: [
    "C = castle",
    "B = bomber",
    "H = helicopter",
    "D = drone",
    "A = airplane",
    "T = tank",
    "M = motorcycle",
    "S = soldier",
  ],
  gameplayHints: [
    "Click battlefield when yolk drop is ready.",
    "Win fast for wipeout bonus gold.",
    "Use gold to buy blue units.",
    "Buttons buy units only for BLUE.",
    "Mega Knight is a tougher tank upgrade.",
    "Fire Wizard is a stronger soldier with rapid fire.",
    "Yolk Bomber is a stronger bomber with bigger egg bursts.",
    "Unlocked units join future blue armies automatically.",
  ],
  scale: 0.5,
  terrainLine: 3,
  unitLine: 2,
  tankHp: 5,
  motorcycleHp: 2,
  airplaneHp: 2,
  bomberHp: 3,
  helicopterHp: 3,
  droneHp: 1,
  castleHp: 10,
  soldierHp: 1,
  tankSpeed: 10,
  motorcycleSpeedMultiplier: 4,
  soldierSpeed: 30,
  airplaneSpeed: 200,
  bomberSpeed: 115,
  helicopterSpeed: 85,
  droneSpeed: 85,
  airplaneBombSpeed: 70,
  bomberBombSpeed: 55,
  helicopterBombSpeed: 38,
  airplaneBurst: 10,
  bomberBurst: 20,
  helicopterBurst: 8,
  droneBurst: 2,
  castleBurst: 5,
  helicopterHoverDistance: 28,
  droneAltitudeRatio: 0.43,
  droneDiveSpeedMultiplier: 2.35,
  airplaneShotSpeed: 360,
  airplaneShotSpread: 18,
  airplaneFireRange: 320,
  roundMinSeconds: 30,
  roundMaxSeconds: 45,
  roundSecondsPerStage: 2,
  powerUpCooldown: 5,
  powerUpBurst: 8,
  goldWinBase: 25,
  goldPerStage: 2,
  fullDestructionGoldBonus: 20,
  showScore: false,
  scoreWinBase: 0,
  enemyHpScalePerStage: 0.18,
  enemyFireScalePerStage: 0.04,
  unitSpawnCosts: {
    soldier: 5,
    motorcycle: 12,
    tank: 20,
    airplane: 25,
    helicopter: 35,
    drone: 2,
    bomber: 40,
    castle: 50,
  },
  unlocks: [
    { stage: 2, name: "Mega Knight" },
    { stage: 4, name: "Fire Wizard" },
    { stage: 6, name: "Yolk Bomber" },
  ],
  specialUnitLabelSeconds: 10,
  specialUnitVisualScale: 1.2,
};

function applyColorScheme() {
  const colors = settings.colorSchemes[settings.colorScheme] || settings.colorSchemes.classic;
  LINE = colors.line;
  PAPER = colors.paper;
  BLUE = colors.blueTeam;
  RED = colors.redTeam;
  YOLK = colors.yolk;
  WHITE = colors.eggWhite;
}

applyColorScheme();

const s = (v) => v * settings.scale;
const sw = (v = 2) => Math.max(settings.unitLine, Math.round(s(v)));
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
const speechCooldown = (a, b) => settings.speechBubbleFrequency <= 0 ? Infinity : rand(a, b) / Math.max(0.01, settings.speechBubbleFrequency);
const choice = (items) => items[Math.floor(Math.random() * items.length)];

function teamColor(side) {
  return side === RIGHT ? BLUE : RED;
}

function hexToRgb(hex) {
  const normalized = String(hex).replace("#", "");
  if (normalized.length !== 6) return [250, 250, 248];
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function rgbaFromHex(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

class AudioFx {
  constructor() {
    this.ctx = null;
    this.unlocked = false;
    this.aliases = {
      splat: "egg_splat",
      hit: "tank_hit",
      win: "end_jingle",
      loss: "sad_jingle",
    };
    this.sounds = {};
    [
      "fire",
      "tank_hit",
      "tank_destroyed",
      "soldier_hit",
      "soldier_destroyed",
      "egg_splat",
      "start_reveille",
      "end_jingle",
      "sad_jingle",
    ].forEach((name) => {
      const sound = new window.Audio(`assets/sounds/${name}.wav`);
      sound.preload = "auto";
      sound.volume = Math.min(1, settings.soundVolume / 3);
      this.sounds[name] = sound;
    });
  }

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.unlocked = true;
    Object.values(this.sounds).forEach((sound) => sound.load());
  }

  tone(freq, duration, type = "square", volume = 0.05) {
    if (!this.ctx || !this.unlocked || this.ctx.state === "suspended") return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = Math.min(0.35, volume * settings.soundVolume);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  play(name) {
    if (!this.ctx || !this.unlocked) return;
    const soundName = this.aliases[name] || name;
    const sound = this.sounds[soundName];
    if (sound) {
      const player = sound.cloneNode();
      player.volume = sound.volume;
      player.play().catch(() => this.playFallback(soundName));
      return;
    }
    this.playFallback(soundName);
  }

  playFallback(name) {
    if (name === "fire") this.tone(720, 0.08, "square", 0.05);
    if (name === "egg_splat") this.tone(140, 0.12, "sawtooth", 0.06);
    if (name === "tank_hit" || name === "soldier_hit") this.tone(260, 0.1, "square", 0.065);
    if (name === "end_jingle") [392, 523, 659, 784].forEach((f, i) => setTimeout(() => this.tone(f, 0.16, "square", 0.055), i * 110));
    if (name === "sad_jingle") [392, 330, 262].forEach((f, i) => setTimeout(() => this.tone(f, i === 2 ? 0.34 : 0.2, "triangle", 0.07), i * 180));
  }
}

const audio = new AudioFx();

class Terrain {
  constructor() {
    this.points = [];
    this.regenerate();
  }

  regenerate() {
    const minY = H * 0.64;
    const maxY = H * 0.86;
    let x = -90;
    let y = rand(minY + 80, maxY - 60);
    this.points = [[x, y]];
    while (x < W + 90) {
      x += Math.floor(rand(8, 21));
      y = clamp(y + rand(-100, 100), minY, maxY);
      this.points.push([x, y]);
    }
    for (let pass = 0; pass < 5; pass++) this.smooth();
    this.points = this.points.map(([px, py]) => {
      const d = Math.abs(px - W * 0.5) / (W * 0.5);
      return [px, clamp(py + (1 - Math.min(d, 1)) * rand(20, 52), minY, maxY)];
    });
  }

  smooth() {
    const next = [this.points[0]];
    for (let i = 1; i < this.points.length - 1; i++) {
      const [x, y] = this.points[i];
      next.push([x, y * 0.5 + (this.points[i - 1][1] + this.points[i + 1][1]) * 0.25]);
    }
    next.push(this.points[this.points.length - 1]);
    this.points = next;
  }

  yAt(x) {
    for (let i = 0; i < this.points.length - 1; i++) {
      const [x1, y1] = this.points[i];
      const [x2, y2] = this.points[i + 1];
      if (x >= x1 && x <= x2) {
        const p = (x - x1) / (x2 - x1);
        return y1 + (y2 - y1) * p;
      }
    }
    return this.points[this.points.length - 1][1];
  }

  slopeAt(x) {
    return Math.atan2(this.yAt(x + 8) - this.yAt(x - 8), 16);
  }

  draw() {
    ctx.strokeStyle = LINE;
    ctx.lineWidth = settings.terrainLine;
    ctx.beginPath();
    this.points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
  }
}

class Unit {
  constructor(x, side, terrain) {
    this.x = x;
    this.side = side;
    this.terrain = terrain;
    this.dead = false;
    this.fireClock = rand(0, 1);
    this.fireRate = settings.fireRate;
    this.speechText = "";
    this.speechTimer = 0;
    this.speechCooldown = speechCooldown(3, 8);
    this.wobble = rand(0, Math.PI * 2);
    this.visualScale = 1;
  }

  get y() {
    return this.terrain.yAt(this.x) - this.groundOffset;
  }

  direction() {
    return this.side;
  }

  radius() {
    return this.size * 0.75;
  }

  blockingRadius() {
    return this.size * 0.65;
  }

  ready(dt) {
    this.fireClock -= dt;
    if (this.fireClock > 0) return false;
    this.fireClock = rand(0.45, 1.55) / Math.max(0.03, this.fireRate);
    return true;
  }

  updateSpeech(dt) {
    if (settings.speechBubbleFrequency <= 0) {
      this.speechText = "";
      this.speechTimer = 0;
      return;
    }
    if (this.speechTimer > 0) this.speechTimer = Math.max(0, this.speechTimer - dt);
    this.speechCooldown -= dt;
    if (this.speechCooldown <= 0) {
      if (settings.speechIdleComments.length) this.say(choice(settings.speechIdleComments), rand(1, 1.45));
      this.speechCooldown = speechCooldown(8, 18);
    }
  }

  say(text, duration = 1.2) {
    this.speechText = text;
    this.speechTimer = duration;
  }

  move(dt, enemies) {
    let step = this.speed * dt;
    const ahead = enemies.filter((e) => !(e instanceof Airplane) && (e.x - this.x) * this.side > 0);
    if (ahead.length) {
      const blocker = ahead.reduce((a, b) => Math.abs(a.x - this.x) < Math.abs(b.x - this.x) ? a : b);
      const gap = Math.abs(blocker.x - this.x);
      const stop = this.blockingRadius() + blocker.blockingRadius();
      if (gap <= stop) return;
      step = Math.min(step, gap - stop);
    }
    this.x = clamp(this.x + this.side * step, s(45), W - s(45));
  }

  takeHit() {
    this.hp -= 1;
    this.dead = this.hp <= 0;
  }

  withVisualScale(drawFn) {
    if (this.visualScale === 1) {
      drawFn();
      return;
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.visualScale, this.visualScale);
    ctx.translate(-this.x, -this.y);
    drawFn();
    ctx.restore();
  }
}

class Soldier extends Unit {
  constructor(x, side, terrain) {
    super(x, side, terrain);
    this.speed = rand(settings.soldierSpeed * 0.5, settings.soldierSpeed);
    this.size = s(22);
    this.groundOffset = s(20);
    this.hp = settings.soldierHp;
    this.fireRate = settings.soldierFireRate;
  }

  muzzle() {
    return [
      this.x + this.side * s(17) * this.visualScale,
      this.y - s(10) * this.visualScale,
    ];
  }

  draw() {
    this.withVisualScale(() => {
    const c = teamColor(this.side);
    const y = this.y;
    const step = Math.sin(performance.now() * 0.009 + this.wobble) * s(4);
    ctx.strokeStyle = c;
    ctx.lineWidth = sw(2);
    ctx.beginPath();
    ctx.arc(this.x, y - s(23), s(6), 0, Math.PI * 2);
    ctx.stroke();
    line(this.x, y - s(17), this.x, y + s(4), c);
    line(this.x, y - s(8), this.x + this.side * s(15), y - s(12), c);
    line(this.x + this.side * s(7), y - s(12), this.x + this.side * s(17), y - s(10), c);
    line(this.x, y + s(4), this.x - s(7), y + s(18) + step, c);
    line(this.x, y + s(4), this.x + s(8), y + s(18) - step, c);
    });
  }
}

class Castle extends Unit {
  constructor(x, side, terrain) {
    super(x, side, terrain);
    this.size = s(80);
    this.width = s(58);
    this.height = s(116);
    this.hp = settings.castleHp;
    this.bombBurst = settings.castleBurst;
    this.speed = 0;
    this.fireRate = settings.castleFireRate;
    this.catapultAngle = side === RIGHT ? -Math.PI / 7 : Math.PI + Math.PI / 7;
  }

  get y() {
    return this.terrain.yAt(this.x) - this.height * 0.5;
  }

  radius() {
    return this.size * 0.9;
  }

  blockingRadius() {
    return this.width * 0.55;
  }

  move() {}

  catapultBase() {
    return [this.x - this.side * s(6), this.terrain.yAt(this.x) - this.height - s(4)];
  }

  muzzle() {
    const [baseX, baseY] = this.catapultBase();
    return [
      baseX + Math.cos(this.catapultAngle) * s(44),
      baseY + Math.sin(this.catapultAngle) * s(44),
    ];
  }

  aim(vx, vy) {
    this.catapultAngle = Math.atan2(vy, vx);
  }

  draw() {
    const c = teamColor(this.side);
    const left = this.x - this.width * 0.5;
    const right = this.x + this.width * 0.5;
    const surfaceY = this.terrain.yAt(this.x);
    const top = surfaceY - this.height;
    const leftGround = this.terrain.yAt(left);
    const rightGround = this.terrain.yAt(right);
    const tooth = s(10);
    ctx.strokeStyle = c;
    ctx.lineWidth = sw(3);
    ctx.beginPath();
    [
      [left, top + tooth],
      [left, top],
      [left + tooth, top],
      [left + tooth, top + tooth],
      [left + tooth * 2, top + tooth],
      [left + tooth * 2, top],
      [left + tooth * 3, top],
      [left + tooth * 3, top + tooth],
      [right - tooth * 2, top + tooth],
      [right - tooth * 2, top],
      [right - tooth, top],
      [right - tooth, top + tooth],
      [right, top + tooth],
    ].forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
    ctx.stroke();
    line(left, top + tooth, left, leftGround, c, sw(3));
    line(right, top + tooth, right, rightGround, c, sw(3));
    circle(this.x - s(13), top + s(45), s(4), c);
    circle(this.x + s(13), top + s(45), s(4), c);
    ctx.beginPath();
    ctx.arc(this.x, surfaceY - s(17), s(9), Math.PI, Math.PI * 2);
    ctx.stroke();
    line(this.x - s(9), surfaceY - s(17), this.x - s(9), surfaceY, c);
    line(this.x + s(9), surfaceY - s(17), this.x + s(9), surfaceY, c);

    const [baseX, baseY] = this.catapultBase();
    const [tipX, tipY] = this.muzzle();
    line(baseX, baseY, tipX, tipY, c, sw(3));
    line(baseX - this.side * s(12), baseY + s(15), baseX, baseY, c);
    circle(baseX, baseY + s(16), s(9), c);
    circle(tipX, tipY, s(5), c);

    for (let mark = 0; mark < this.hp; mark++) {
      const row = Math.floor(mark / 5);
      const col = mark % 5;
      const y = Math.min(surfaceY - s(4), top + s(70) + row * s(10));
      line(left + s(9) + col * s(9), y, left + s(14) + col * s(9), y, c);
    }
  }
}

class Tank extends Unit {
  constructor(x, side, terrain) {
    super(x, side, terrain);
    this.speed = rand(settings.tankSpeed * 0.5, settings.tankSpeed);
    this.size = s(46);
    this.groundOffset = s(18);
    this.hp = settings.tankHp;
    this.fireRate = settings.tankFireRate;
    this.barrelAngle = side === RIGHT ? -Math.PI / 10 : Math.PI + Math.PI / 10;
    this.wheelOffsets = [-s(24), 0, s(24)];
    this.wheelRadius = s(10);
    this.maxWheelSpan = s(72);
    this.visualWheelYs = this.targetWheelYs();
    this.visualAngle = this.targetBodyAngle();
    this.visualCenterY = this.targetCenterY();
  }

  get y() {
    return this.visualCenterY;
  }

  move(dt, enemies) {
    super.move(dt, enemies);
    this.updateVisualPose(dt);
  }

  targetWheelY(offset) {
    return this.terrain.yAt(this.x + offset) - this.wheelRadius;
  }

  targetWheelYs() {
    const wheelYs = this.wheelOffsets.map((offset) => this.targetWheelY(offset));
    const xSpan = this.wheelOffsets[this.wheelOffsets.length - 1] - this.wheelOffsets[0];
    const maxYSpan = Math.sqrt(Math.max(0, this.maxWheelSpan * this.maxWheelSpan - xSpan * xSpan));
    const minY = Math.min(...wheelYs);
    const maxY = Math.max(...wheelYs);
    const currentSpan = maxY - minY;
    if (currentSpan <= maxYSpan || currentSpan === 0) return wheelYs;

    const centerY = wheelYs.reduce((sum, y) => sum + y, 0) / wheelYs.length;
    const scale = maxYSpan / currentSpan;
    return wheelYs.map((y) => centerY + (y - centerY) * scale);
  }

  targetBodyAngle() {
    const wheelYs = this.targetWheelYs();
    const leftY = wheelYs[0];
    const rightY = wheelYs[wheelYs.length - 1];
    return Math.atan2(rightY - leftY, this.wheelOffsets[this.wheelOffsets.length - 1] - this.wheelOffsets[0]);
  }

  targetCenterY() {
    return this.visualWheelYs.reduce((sum, y) => sum + y, 0) / this.visualWheelYs.length - s(17) * this.visualScale;
  }

  updateVisualPose(dt) {
    const smoothing = Math.min(1, dt * 8);
    const targetYs = this.targetWheelYs();
    this.visualWheelYs = this.visualWheelYs.map((y, index) => y + (targetYs[index] - y) * smoothing);
    const targetAngle = this.targetBodyAngle();
    this.visualAngle += (targetAngle - this.visualAngle) * smoothing;
    const targetY = this.targetCenterY();
    this.visualCenterY += (targetY - this.visualCenterY) * smoothing;
  }

  bodyPoint(localX, localY) {
    localX *= this.visualScale;
    localY *= this.visualScale;
    const cos = Math.cos(this.visualAngle);
    const sin = Math.sin(this.visualAngle);
    return [
      this.x + localX * cos - localY * sin,
      this.visualCenterY + localX * sin + localY * cos,
    ];
  }

  bodyPath(points) {
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      const [px, py] = this.bodyPoint(x, y);
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
  }

  barrelStart() {
    return this.bodyPoint(this.side * s(12), -s(18));
  }

  muzzle() {
    const [startX, startY] = this.barrelStart();
    return [
      startX + Math.cos(this.barrelAngle) * s(36) * this.visualScale,
      startY + Math.sin(this.barrelAngle) * s(36) * this.visualScale,
    ];
  }

  aim(vx, vy) {
    this.barrelAngle = Math.atan2(vy, vx);
  }

  draw() {
    const c = teamColor(this.side);
    ctx.strokeStyle = c;
    ctx.lineWidth = sw(3);
    this.bodyPath([
      [-s(36), -s(12)],
      [s(34), -s(12)],
      [s(38), s(4)],
      [s(28), s(12)],
      [-s(34), s(12)],
      [-s(38), s(2)],
    ]);
    ctx.stroke();

    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 1;
    this.bodyPath([
      [-s(28), -s(6)],
      [s(26), -s(6)],
      [s(29), s(5)],
      [-s(27), s(5)],
    ]);
    ctx.stroke();

    ctx.strokeStyle = c;
    ctx.lineWidth = sw(3);
    let turret = [
      [-s(18), -s(16)],
      [s(12), -s(24)],
      [s(28), -s(12)],
      [-s(8), -s(8)],
    ];
    if (this.side === LEFT) turret = turret.map(([x, y]) => [-x, y]);
    this.bodyPath(turret);
    ctx.stroke();

    const [mx, my] = this.muzzle();
    const [barrelX, barrelY] = this.barrelStart();
    line(barrelX, barrelY, mx, my, c, sw(5));
    circle(mx, my, s(5), PAPER);

    this.wheelOffsets.forEach((off, index) => {
      const wx = this.x + off;
      const wy = this.visualWheelYs[index];
      circle(wx, wy, this.wheelRadius, c);
      circle(wx, wy, s(3), c);
    });

    for (let mark = 0; mark < this.hp; mark++) {
      const [x1, y1] = this.bodyPoint(-s(22) + mark * s(12), s(34));
      const [x2, y2] = this.bodyPoint(-s(14) + mark * s(12), s(34));
      line(x1, y1, x2, y2, c, sw(2));
    }
  }
}

class Motorcycle extends Unit {
  constructor(x, side, terrain) {
    super(x, side, terrain);
    this.speed = rand(settings.tankSpeed * settings.motorcycleSpeedMultiplier * 0.5, settings.tankSpeed * settings.motorcycleSpeedMultiplier);
    this.size = s(34);
    this.groundOffset = s(26);
    this.hp = settings.motorcycleHp;
    this.fireRate = settings.motorcycleFireRate;
    this.gunAngle = side === RIGHT ? -Math.PI / 12 : Math.PI + Math.PI / 12;
  }

  muzzle() {
    return [this.x + this.side * s(24), this.y - s(15)];
  }

  aim(vx, vy) {
    this.gunAngle = Math.atan2(vy, vx);
  }

  draw() {
    const c = teamColor(this.side);
    const y = this.y;
    circle(this.x - s(16), this.terrain.yAt(this.x - s(16)) - s(7), s(7), c);
    circle(this.x + s(16), this.terrain.yAt(this.x + s(16)) - s(7), s(7), c);
    line(this.x - s(16), y, this.x, y - s(16), c);
    line(this.x, y - s(16), this.x + s(16), y, c);
    line(this.x, y - s(28), this.x, y - s(10), c);
    circle(this.x, y - s(34), s(5), c);
    line(this.x, y - s(22), ...this.muzzle(), c);
  }
}

class Airplane extends Unit {
  constructor(x, side, terrain, lane = 0) {
    super(x, side, terrain);
    this.flightY = H * 0.1 + (lane % 4) * (H * 0.2 / 3) + rand(-s(6), s(6));
    this.speed = settings.airplaneSpeed;
    this.size = s(52);
    this.hp = settings.airplaneHp;
    this.fireRate = settings.airplaneFireRate;
    this.loopMargin = s(70);
    this.bombBurst = settings.airplaneBurst;
    this.bombSpeed = settings.airplaneBombSpeed;
  }

  get y() {
    return this.flightY;
  }

  move(dt) {
    this.x += this.side * this.speed * dt;
    if (this.side === RIGHT && this.x > W + this.loopMargin) this.x = -this.loopMargin;
    if (this.side === LEFT && this.x < -this.loopMargin) this.x = W + this.loopMargin;
  }

  bombBay() {
    return [this.x - this.side * s(6), this.y + s(9)];
  }

  muzzle() {
    return [this.x + this.side * s(32), this.y];
  }

  draw() {
    drawPlaneShape(this.x, this.y, this.side, teamColor(this.side), 1);
  }
}

class Bomber extends Airplane {
  constructor(x, side, terrain, lane = 0) {
    super(x, side, terrain, lane);
    this.speed = settings.bomberSpeed;
    this.size = s(104);
    this.hp = settings.bomberHp;
    this.fireRate = settings.bomberFireRate;
    this.loopMargin = s(130);
    this.bombBurst = settings.bomberBurst;
    this.bombSpeed = settings.bomberBombSpeed;
  }

  bombBay() {
    return [
      this.x - this.side * s(2) * this.visualScale,
      this.y + s(13) * this.visualScale,
    ];
  }

  muzzle() {
    return [
      this.x + this.side * s(64) * this.visualScale,
      this.y + s(1) * this.visualScale,
    ];
  }

  draw() {
    this.withVisualScale(() => {
      drawPlaneShape(this.x, this.y, this.side, teamColor(this.side), 2);
      line(this.x - this.side * s(34), this.y + s(8), this.x + this.side * s(34), this.y + s(7), teamColor(this.side));
    });
  }
}

class Helicopter extends Airplane {
  constructor(x, side, terrain, lane = 0) {
    super(x, side, terrain, lane);
    this.speed = settings.helicopterSpeed;
    this.size = s(58);
    this.hp = settings.helicopterHp;
    this.fireRate = settings.helicopterFireRate;
    this.loopMargin = s(85);
    this.bombBurst = settings.helicopterBurst;
    this.bombSpeed = settings.helicopterBombSpeed;
    this.hoverDistance = s(settings.helicopterHoverDistance);
    this.facing = side;
  }

  direction() {
    return this.facing;
  }

  move(dt, enemies) {
    const ground = enemies.filter((e) => e instanceof Castle || e instanceof Tank || e instanceof Motorcycle || e instanceof Soldier);
    if (ground.length) {
      const target = ground.reduce((a, b) => Math.abs(a.x - this.x) < Math.abs(b.x - this.x) ? a : b);
      const delta = target.x - this.x;
      if (Math.abs(delta) > this.hoverDistance) {
        const step = Math.min(Math.abs(delta) - this.hoverDistance, this.speed * dt);
        this.x += Math.sign(delta) * step;
        this.facing = delta > 0 ? RIGHT : LEFT;
      }
      return;
    }

    this.x += this.facing * this.speed * dt;
    if (this.x > W - this.loopMargin) {
      this.x = W - this.loopMargin;
      this.facing = LEFT;
    }
    if (this.x < this.loopMargin) {
      this.x = this.loopMargin;
      this.facing = RIGHT;
    }
  }

  bombBay() {
    return [this.x, this.y + s(16)];
  }

  muzzle() {
    return [this.x + this.facing * s(34), this.y + s(2)];
  }

  draw() {
    drawHelicopterShape(this.x, this.y, this.facing, teamColor(this.side));
  }
}

class Drone extends Airplane {
  constructor(x, side, terrain, lane = 0) {
    super(x, side, terrain, lane);
    this.speed = settings.droneSpeed;
    this.size = s(30);
    this.hp = settings.droneHp;
    this.fireRate = 0;
    this.bombBurst = settings.droneBurst;
    this.targetAltitude = H * settings.droneAltitudeRatio + rand(-s(8), s(8));
    this.flightY = this.terrain.yAt(this.x) - s(10);
    this.loopMargin = s(50);
    this.state = "launch";
    this.target = null;
    this.hoverTimer = 0;
    this.impactTarget = null;
  }

  move(dt, enemies) {
    this.impactTarget = null;
    const ground = enemies.filter((e) => e instanceof Castle || e instanceof Tank || e instanceof Motorcycle || e instanceof Soldier);
    if (this.target && (this.target.dead || !ground.includes(this.target))) {
      this.target = null;
      this.state = "patrol";
    }

    if (this.state === "launch") {
      const step = this.speed * dt / Math.sqrt(2);
      this.x += this.side * step;
      this.flightY -= step;
      if (this.flightY <= this.targetAltitude) {
        this.flightY = this.targetAltitude;
        this.state = "patrol";
      }
      return;
    }

    if (this.state === "patrol") {
      if (ground.length) {
        this.target = ground.reduce((a, b) => Math.abs(a.x - this.x) < Math.abs(b.x - this.x) ? a : b);
        this.state = "hover";
      } else {
        this.x += this.side * this.speed * dt;
      }
      return;
    }

    if (this.state === "hover") {
      if (!this.target) {
        this.state = "patrol";
        return;
      }
      const dx = this.target.x - this.x;
      if (Math.abs(dx) > s(8)) this.x += Math.sign(dx) * Math.min(Math.abs(dx), this.speed * dt);
      this.flightY += (this.targetAltitude - this.flightY) * Math.min(1, dt * 6);
      if (Math.abs(dx) <= s(10)) {
        this.hoverTimer += dt;
        if (this.hoverTimer >= 0.35) this.state = "dive";
      } else {
        this.hoverTimer = 0;
      }
      return;
    }

    if (this.state === "dive") {
      if (!this.target) {
        this.state = "patrol";
        return;
      }
      const targetY = this.target.y - this.target.radius() * 0.35;
      const dx = this.target.x - this.x;
      const dy = targetY - this.flightY;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const step = this.speed * settings.droneDiveSpeedMultiplier * dt;
      if (step >= distance || distance <= this.radius() + this.target.radius() * 0.35) {
        this.x = this.target.x;
        this.flightY = targetY;
        this.impactTarget = this.target;
        return;
      }
      this.x += dx / distance * step;
      this.flightY += dy / distance * step;
    }
  }

  draw() {
    const c = teamColor(this.side);
    const y = this.y;
    const wobble = Math.sin(performance.now() * 0.02 + this.wobble) * s(2);
    ctx.strokeStyle = c;
    ctx.lineWidth = sw(2);
    ctx.beginPath();
    ctx.ellipse(this.x, y, s(12), s(9), 0, 0, Math.PI * 2);
    ctx.stroke();
    circle(this.x + this.side * s(4), y - s(1), s(2), c);
    const hubY = y - s(15) + wobble;
    line(this.x - s(13), hubY - s(13), this.x + s(13), hubY + s(13), c);
    line(this.x - s(13), hubY + s(13), this.x + s(13), hubY - s(13), c);
    line(this.x, y - s(9), this.x, hubY, c);
  }
}

class Egg {
  constructor(x, y, vx, vy, side, burst = 0) {
    Object.assign(this, { x, y, vx, vy, side, burst });
    this.radius = s(8);
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += GRAVITY * dt;
  }

  draw() {
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class Splat {
  constructor(x, y, slope) {
    Object.assign(this, { x, y, slope });
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.slope);
    ctx.fillStyle = WHITE;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -s(3), s(18), s(6), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = YOLK;
    ctx.beginPath();
    ctx.arc(s(2), -s(5), s(6), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function line(x1, y1, x2, y2, color = LINE, width = sw(2)) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function circle(x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = sw(2);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlaneShape(x, y, side, color, lengthScale) {
  ctx.strokeStyle = color;
  ctx.lineWidth = sw(2);
  const nose = [x + side * s(32 * lengthScale), y];
  const tail = [x - side * s(28 * lengthScale), y + s(2)];
  ctx.beginPath();
  ctx.moveTo(...nose);
  ctx.lineTo(x - side * s(14 * lengthScale), y - s(8));
  ctx.lineTo(...tail);
  ctx.lineTo(x - side * s(12 * lengthScale), y + s(8));
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - side * s(2), y - s(2));
  ctx.lineTo(x - side * s(18 * lengthScale), y + s(20));
  ctx.lineTo(x + side * s(14 * lengthScale), y + s(4));
  ctx.closePath();
  ctx.stroke();
  line(tail[0], tail[1], tail[0] - side * s(10), tail[1] - s(14), color);
}

class Game {
  constructor() {
    this.terrain = new Terrain();
    this.units = [];
    this.eggs = [];
    this.splats = [];
    this.wreckage = [];
    this.buttons = [];
    this.score = { blue: 0, red: 0 };
    this.gold = 0;
    this.points = 0;
    this.stage = 1;
    this.unlockedNames = [];
    this.lastUnlock = "";
    this.roundTime = 0;
    this.roundLimit = this.nextRoundLimit();
    this.powerUpCooldown = 0;
    this.resultMode = "battle";
    this.lastGoldReward = 0;
    this.lastGoldBonus = 0;
    this.noticeBubble = null;
    this.selectedGameplayHint = "";
    this.titleTimer = 2;
    this.winner = null;
    this.endGameTitle = "";
    this.clouds = [
      { x: 305, y: 164, scale: 1, speed: 8 },
      { x: 780, y: 156, scale: 0.86, speed: 5.5 },
      { x: 1030, y: 214, scale: 0.72, speed: 6.8 },
    ];
    this.startStage();
  }

  count(max) {
    return Math.ceil(max * (1 - rand(0, settings.countReduction)));
  }

  aircraftCount(max) {
    const low = Math.max(0, Math.floor(settings.aircraftCountMin));
    const high = Math.max(low, Math.floor(max));
    return low + Math.floor(Math.random() * (high - low + 1));
  }

  nextRoundLimit() {
    const stageBonus = Math.max(0, this.stage) * settings.roundSecondsPerStage;
    return rand(settings.roundMinSeconds + stageBonus, settings.roundMaxSeconds + stageBonus);
  }

  startStage() {
    this.terrain.regenerate();
    this.units = [];
    this.eggs = [];
    this.splats = [];
    this.wreckage = [];
    this.winner = null;
    this.endGameTitle = "";
    this.resultMode = "battle";
    this.roundTime = 0;
    this.roundLimit = this.nextRoundLimit();
    this.powerUpCooldown = 0;
    this.noticeBubble = null;
    this.selectedGameplayHint = "";
    this.spawn();
    audio.play("start_reveille");
  }

  spawn() {
    this.units = [];
    this.addMany(RIGHT, "tank", this.count(settings.maxLeftTanks));
    this.addMany(RIGHT, "motorcycle", this.count(settings.maxLeftMotorcycles));
    this.addMany(RIGHT, "airplane", this.aircraftCount(settings.maxLeftAirplanes));
    this.addMany(RIGHT, "bomber", this.aircraftCount(settings.maxLeftBombers));
    this.addMany(RIGHT, "helicopter", this.aircraftCount(settings.maxLeftHelicopters));
    this.addMany(RIGHT, "drone", this.count(settings.maxLeftDrones));
    this.addMany(RIGHT, "castle", this.count(settings.maxLeftCastles));
    this.addMany(RIGHT, "soldier", this.count(settings.maxLeftSoldiers));
    this.addMany(LEFT, "tank", this.count(settings.maxRightTanks));
    this.addMany(LEFT, "motorcycle", this.count(settings.maxRightMotorcycles));
    this.addMany(LEFT, "airplane", this.aircraftCount(settings.maxRightAirplanes));
    this.addMany(LEFT, "bomber", this.aircraftCount(settings.maxRightBombers));
    this.addMany(LEFT, "helicopter", this.aircraftCount(settings.maxRightHelicopters));
    this.addMany(LEFT, "drone", this.count(settings.maxRightDrones));
    this.addMany(LEFT, "castle", this.count(settings.maxRightCastles));
    this.addMany(LEFT, "soldier", this.count(settings.maxRightSoldiers));
    this.addUnlockedPlayerUnits();
    this.scaleEnemiesForStage();
    const blue = this.living(RIGHT);
    const red = this.living(LEFT);
    if (!blue.length || !red.length) this.finishRound(blue.length > 0, red.length === 0);
  }

  addUnlockedPlayerUnits() {
    if (this.unlockedNames.includes("Mega Knight")) {
      const knight = new Tank(s(315), RIGHT, this.terrain);
      knight.hp += 6;
      knight.fireRate *= 1.6;
      knight.label = "Mega Knight";
      knight.labelTimer = settings.specialUnitLabelSeconds;
      this.scaleSpecialUnit(knight);
      this.units.push(knight);
    }
    if (this.unlockedNames.includes("Fire Wizard")) {
      const wizard = new Soldier(s(185), RIGHT, this.terrain);
      wizard.hp = 3;
      wizard.fireRate = 0.42;
      wizard.label = "Fire Wizard";
      wizard.labelTimer = settings.specialUnitLabelSeconds;
      this.scaleSpecialUnit(wizard);
      this.units.push(wizard);
    }
    if (this.unlockedNames.includes("Yolk Bomber")) {
      const bomber = new Bomber(-s(240), RIGHT, this.terrain, 3);
      bomber.hp += 2;
      bomber.bombBurst += 6;
      bomber.label = "Yolk Bomber";
      bomber.labelTimer = settings.specialUnitLabelSeconds;
      this.scaleSpecialUnit(bomber);
      this.units.push(bomber);
    }
  }

  scaleSpecialUnit(unit) {
    const scale = settings.specialUnitVisualScale;
    unit.visualScale = scale;
    unit.size *= scale;
    if (unit.wheelOffsets) {
      unit.wheelOffsets = unit.wheelOffsets.map((offset) => offset * scale);
      unit.wheelRadius *= scale;
      unit.maxWheelSpan *= scale;
      unit.visualWheelYs = unit.targetWheelYs();
      unit.visualAngle = unit.targetBodyAngle();
      unit.visualCenterY = unit.targetCenterY();
    }
  }

  scaleEnemiesForStage() {
    const hpScale = 1 + (this.stage - 1) * settings.enemyHpScalePerStage;
    const fireScale = 1 + (this.stage - 1) * settings.enemyFireScalePerStage;
    this.units.forEach((u) => {
      if (u.side !== LEFT) return;
      u.hp = Math.max(1, Math.ceil(u.hp * hpScale));
      u.fireRate *= fireScale;
    });
  }

  updateUnlocks() {
    this.lastUnlock = "";
    settings.unlocks.forEach((unlock) => {
      if (this.stage >= unlock.stage && !this.unlockedNames.includes(unlock.name)) {
        this.unlockedNames.push(unlock.name);
        this.lastUnlock = unlock.name;
      }
    });
  }

  armyScore(units) {
    return units.reduce((sum, u) => sum + Math.max(0, u.hp) + (u instanceof Airplane ? 4 : 0) + (u instanceof Castle ? 5 : 0), 0);
  }

  finishRound(blueWon, fullDestruction = false) {
    if (this.winner) return;
    this.resultMode = blueWon ? "won" : "lost";
    this.winner = blueWon ? "BLUE TEAM WINS" : "RED TEAM WINS";
    this.endGameTitle = settings.endGameTitles.length ? choice(settings.endGameTitles) : "";
    this.selectedGameplayHint = settings.gameplayHints.length ? choice(settings.gameplayHints) : "";
    this.lastGoldReward = 0;
    this.lastGoldBonus = 0;
    if (blueWon) {
      let reward = settings.goldWinBase + this.stage * settings.goldPerStage;
      if (fullDestruction) {
        this.lastGoldBonus = settings.fullDestructionGoldBonus;
        reward += this.lastGoldBonus;
      }
      const bonus = settings.scoreWinBase * this.stage + Math.round(this.armyScore(this.living(RIGHT)) * 4);
      reward += bonus;
      this.gold += reward;
      this.lastGoldReward = reward;
      if (settings.showScore) this.points += bonus;
      this.score.blue++;
      this.stage++;
      this.updateUnlocks();
    } else {
      this.score.red++;
    }
    audio.play(blueWon ? "end_jingle" : "sad_jingle");
  }

  addMany(side, type, count) {
    for (let i = 0; i < count; i++) this.addUnit(side, type);
  }

  addUnit(side, type) {
    const n = this.units.filter((u) => u.side === side && unitType(u) === type).length;
    if (side === RIGHT) {
      if (type === "tank") this.units.push(new Tank(s(255) - n * s(64), side, this.terrain));
      if (type === "motorcycle") this.units.push(new Motorcycle(s(197) - n * s(46), side, this.terrain));
      if (type === "airplane") this.units.push(new Airplane(-s(70) - n * s(125), side, this.terrain, n));
      if (type === "bomber") this.units.push(new Bomber(-s(150) - n * s(145), side, this.terrain, n));
      if (type === "helicopter") this.units.push(new Helicopter(s(120) - n * s(95), side, this.terrain, n));
      if (type === "drone") this.units.push(new Drone(s(72) - n * s(18), side, this.terrain, n));
      if (type === "castle") this.units.push(new Castle(s(86) - n * s(76), side, this.terrain));
      if (type === "soldier") this.units.push(new Soldier(s(140) - n * s(18), side, this.terrain));
    } else {
      if (type === "tank") this.units.push(new Tank(W - s(255) + n * s(64), side, this.terrain));
      if (type === "motorcycle") this.units.push(new Motorcycle(W - s(197) + n * s(46), side, this.terrain));
      if (type === "airplane") this.units.push(new Airplane(W + s(70) + n * s(125), side, this.terrain, n));
      if (type === "bomber") this.units.push(new Bomber(W + s(150) + n * s(145), side, this.terrain, n));
      if (type === "helicopter") this.units.push(new Helicopter(W - s(120) + n * s(95), side, this.terrain, n));
      if (type === "drone") this.units.push(new Drone(W - s(72) + n * s(18), side, this.terrain, n));
      if (type === "castle") this.units.push(new Castle(W - s(86) + n * s(76), side, this.terrain));
      if (type === "soldier") this.units.push(new Soldier(W - s(140) + n * s(18), side, this.terrain));
    }
  }

  update(dt) {
    this.clouds.forEach((c) => {
      c.x += c.speed * dt;
      if (c.x - 100 * c.scale > W) c.x = -100 * c.scale;
    });
    this.updateWreckage(dt);
    this.titleTimer = Math.max(0, this.titleTimer - dt);
    if (this.noticeBubble) this.noticeBubble.timer = Math.max(0, this.noticeBubble.timer - dt);
    this.units.forEach((u) => {
      if (u.labelTimer !== undefined) u.labelTimer = Math.max(0, u.labelTimer - dt);
    });
    if (this.winner) return;
    this.roundTime += dt;
    this.powerUpCooldown = Math.max(0, this.powerUpCooldown - dt);

    const blue = this.living(RIGHT);
    const red = this.living(LEFT);
    if (!blue.length || !red.length) {
      this.finishRound(blue.length > 0, red.length === 0);
      return;
    }
    if (this.roundTime >= this.roundLimit) {
      this.finishRound(this.armyScore(blue) >= this.armyScore(red), false);
      return;
    }

    for (const u of this.living()) {
      const enemies = u.side === RIGHT ? red : blue;
      if (this.canSpeak(u)) u.updateSpeech(dt);
      u.move(dt, enemies);
      if (u instanceof Drone && u.impactTarget) {
        this.detonateDrone(u, u.impactTarget);
        continue;
      }
      if (u instanceof Drone) continue;
      if (u.ready(dt)) this.fire(u, enemies);
    }

    for (const e of [...this.eggs]) {
      e.update(dt);
      const enemies = e.side === RIGHT ? red : blue;
      for (const t of enemies) {
        if (dist(e.x, e.y, t.x, t.y) <= e.radius + t.radius()) {
          t.takeHit();
          this.maybeSay(t, settings.speechHitComments, 1.05);
          if (t.dead) {
            this.playUnitDestroyed(t);
            this.addWreckage(t);
          } else {
            this.playUnitHit(t);
          }
          if (e.burst) this.burst(e, e.x, e.y, false);
          this.removeEgg(e);
          break;
        }
      }
      if (!this.eggs.includes(e)) continue;
      if (e.vy > 0 && e.y + e.radius >= this.terrain.yAt(e.x)) {
        if (e.burst) this.burst(e, e.x, this.terrain.yAt(e.x), true);
        else this.addTerrainSplat(e.x);
        this.removeEgg(e);
      }
      if (e.x < -80 || e.x > W + 80 || e.y > H + 80) this.removeEgg(e);
    }

    this.units = this.units.filter((u) => !u.dead);
  }

  detonateDrone(drone, target) {
    if (drone.dead || target.dead) return;
    target.takeHit();
    this.maybeSay(target, settings.speechHitComments, 1.05);
    this.playUnitHit(target);
    if (target.dead) {
      this.playUnitDestroyed(target);
      this.addWreckage(target);
    }
    drone.dead = true;
    this.playUnitDestroyed(drone);
    this.addWreckage(drone);
    for (let i = 0; i < drone.bombBurst; i++) {
      const angle = (145 - i * 70) * Math.PI / 180;
      const speed = rand(105, 145);
      this.eggs.push(new Egg(
        drone.x,
        drone.y,
        Math.cos(angle) * speed,
        -Math.abs(Math.sin(angle) * speed) - rand(10, 45),
        drone.side,
      ));
    }
  }

  addWreckage(unit) {
    if (!settings.showWreckage) return;
    if (unit instanceof Airplane) {
      this.addAircraftDebris(unit);
      return;
    }
    let kind = null;
    if (unit instanceof Tank) kind = "tank";
    if (unit instanceof Motorcycle) kind = "motorcycle";
    if (unit instanceof Castle) kind = "castle";
    if (!kind) return;
    this.wreckage.push({ kind, x: unit.x, y: this.terrain.yAt(unit.x) });
    this.wreckage = this.wreckage.slice(-80);
  }

  addAircraftDebris(unit) {
    const count = unit instanceof Drone ? 3 : unit instanceof Bomber ? 7 : 5;
    const baseSpeed = unit.speed * unit.direction();
    for (let i = 0; i < count; i++) {
      this.wreckage.push({
        kind: "air_debris",
        x: unit.x + rand(-s(18), s(18)),
        y: unit.y + rand(-s(10), s(10)),
        vx: baseSpeed * rand(0.25, 0.75) + rand(-55, 55),
        vy: rand(-80, 25),
        angle: rand(0, Math.PI * 2),
        spin: rand(-4.5, 4.5),
        length: rand(14, 34),
        landed: false,
      });
    }
    this.wreckage = this.wreckage.slice(-100);
  }

  updateWreckage(dt) {
    if (!settings.showWreckage) return;
    for (const w of this.wreckage) {
      if (w.kind !== "air_debris" || w.landed) continue;
      w.x += w.vx * dt;
      w.y += w.vy * dt;
      w.vy += GRAVITY * dt;
      w.angle += w.spin * dt;
      const surfaceY = this.terrain.yAt(w.x);
      if (w.y >= surfaceY) {
        w.y = surfaceY;
        w.vx = 0;
        w.vy = 0;
        w.spin = 0;
        w.landed = true;
      }
    }
  }

  living(side = null) {
    return this.units.filter((u) => !u.dead && (side === null || u.side === side));
  }

  canSpeak(u) {
    return settings.speechBubbleFrequency > 0 && !(u instanceof Airplane);
  }

  maybeSay(u, comments, duration = 1.2) {
    if (comments.length && this.canSpeak(u) && Math.random() < Math.min(1, settings.speechBubbleFrequency)) {
      u.say(choice(comments), duration);
    }
  }

  fire(u, enemies) {
    if (!enemies.length) return;
    if (u instanceof Helicopter) {
      const enemyAir = enemies.filter((e) => e instanceof Airplane);
      const enemyGroundGone = !enemies.some((e) => e instanceof Castle || e instanceof Tank || e instanceof Motorcycle || e instanceof Soldier);
      if (enemyAir.length && enemyGroundGone) return this.shootAir(u, enemyAir);
      return this.dropHelicopterBomb(u, enemies);
    }
    if (u instanceof Airplane) {
      const enemyAir = enemies.filter((e) => e instanceof Airplane);
      const enemyGroundGone = !enemies.some((e) => e instanceof Castle || e instanceof Tank || e instanceof Motorcycle || e instanceof Soldier);
      if (enemyAir.length && enemyGroundGone) return this.shootAir(u, enemyAir);
      return this.dropBomb(u, enemies);
    }
    const targets = this.targetsInRangeFor(u, enemies);
    if (!targets.length) {
      u.fireClock = 0.08;
      return;
    }
    const target = targets.reduce((a, b) => Math.abs(a.x - u.x) < Math.abs(b.x - u.x) ? a : b);
    const [sx, sy] = u.muzzle();
    const tx = target.x + rand(-16, 16);
    const ty = target.y - target.size * 0.55 + rand(-12, 10);
    const t = clamp(Math.abs(tx - sx) / rand(215, 275), 0.85, 2.6);
    const vx = (tx - sx) / t;
    const vy = (ty - sy - 0.5 * GRAVITY * t * t) / t;
    if (u.aim) u.aim(vx, vy);
    this.eggs.push(new Egg(sx, sy, vx, vy, u.side, u instanceof Castle ? u.bombBurst : u instanceof Tank ? 3 : 0));
    this.maybeSay(u, settings.speechFireComments, 0.95);
    audio.play("fire");
  }

  projectileRangeMultiplierFor(u) {
    if (u instanceof Motorcycle) return settings.motorcycleProjectileRangeMultiplier;
    if (u instanceof Soldier) return settings.soldierProjectileRangeMultiplier;
    return 1;
  }

  targetsInRangeFor(u, enemies) {
    const rangeMultiplier = this.projectileRangeMultiplierFor(u);
    if (rangeMultiplier >= 1) return enemies;
    const maxRange = W * rangeMultiplier;
    return enemies.filter((enemy) => Math.abs(enemy.x - u.x) <= maxRange);
  }

  dropHelicopterBomb(u, enemies) {
    const ground = enemies.filter((e) => e instanceof Castle || e instanceof Tank || e instanceof Motorcycle || e instanceof Soldier);
    const targets = ground.length ? ground : enemies;
    const [sx, sy] = u.bombBay();
    const target = targets.reduce((a, b) => Math.abs(a.x - sx) + Math.abs(a.y - sy) < Math.abs(b.x - sx) + Math.abs(b.y - sy) ? a : b);
    const dx = target.x + rand(-s(12), s(12)) - sx;
    const dy = target.y - target.size * 0.25 - sy;
    const time = clamp(Math.sqrt(Math.abs(dy) / GRAVITY) * 1.45, 0.6, 1.8);
    const vx = clamp(dx / time, -u.bombSpeed, u.bombSpeed);
    const vy = (dy - 0.5 * GRAVITY * time * time) / time;
    this.eggs.push(new Egg(sx, sy, vx, vy, u.side, u.bombBurst));
    this.maybeSay(u, settings.speechFireComments, 0.95);
    audio.play("fire");
  }

  dropBomb(u, enemies) {
    const [sx, sy] = u.bombBay();
    const vx = u.side * u.bombSpeed;
    const ground = enemies.filter((e) => e instanceof Castle || e instanceof Tank || e instanceof Motorcycle || e instanceof Soldier);
    const targets = ground.length ? ground : enemies;
    const candidates = targets.map((target) => {
      const dx = target.x - sx;
      if (dx * u.side <= 0) return null;
      const time = dx / vx;
      const vy = (target.y - sy - 0.5 * GRAVITY * time * time) / time;
      return vy >= -55 && vy <= 95 ? { vy, score: Math.abs(vy - 20) } : null;
    }).filter(Boolean);
    if (!candidates.length) {
      u.fireClock = 0.08;
      return;
    }
    candidates.sort((a, b) => a.score - b.score);
    this.eggs.push(new Egg(sx, sy, vx, candidates[0].vy, u.side, u.bombBurst));
    this.maybeSay(u, settings.speechFireComments, 0.95);
    audio.play("fire");
  }

  shootAir(u, enemies) {
    const close = enemies.filter((e) => dist(e.x, e.y, u.x, u.y) <= settings.airplaneFireRange);
    if (!close.length) {
      u.fireClock = 0.08;
      return;
    }
    const target = close[0];
    const [sx, sy] = u.muzzle();
    const tx = target.x + rand(-settings.airplaneShotSpread, settings.airplaneShotSpread);
    const ty = target.y + rand(-settings.airplaneShotSpread * 0.6, settings.airplaneShotSpread * 0.6);
    const d = Math.max(1, Math.hypot(tx - sx, ty - sy));
    this.eggs.push(new Egg(sx, sy, (tx - sx) / d * settings.airplaneShotSpeed, (ty - sy) / d * settings.airplaneShotSpeed, u.side));
    this.maybeSay(u, settings.speechFireComments, 0.95);
    audio.play("fire");
  }

  burst(egg, x, y, leaveSplat) {
    if (leaveSplat) this.splats.push(new Splat(x, y + rand(0, s(10)), this.terrain.slopeAt(x)));
    for (let i = 0; i < egg.burst; i++) {
      const p = i / Math.max(1, egg.burst - 1);
      const angle = (160 - p * 140) * Math.PI / 180;
      const speed = rand(115, 175);
      this.eggs.push(new Egg(x, y - egg.radius, Math.cos(angle) * speed, -Math.abs(Math.sin(angle) * speed) - rand(20, 65), egg.side));
    }
    audio.play("egg_splat");
  }

  addTerrainSplat(x) {
    const surfaceY = this.terrain.yAt(x);
    this.splats.push(new Splat(x, surfaceY + rand(0, s(10)), this.terrain.slopeAt(x)));
    this.splats = this.splats.slice(-90);
    audio.play("egg_splat");
  }

  playUnitDestroyed(unit) {
    if (unit instanceof Soldier) audio.play("soldier_destroyed");
    else audio.play("tank_destroyed");
  }

  playUnitHit(unit) {
    if (unit instanceof Soldier) audio.play("soldier_hit");
    else audio.play("tank_hit");
  }

  dropPowerUp(x) {
    if (this.winner || this.powerUpCooldown > 0) return false;
    const targetX = clamp(x, s(40), W - s(40));
    this.eggs.push(new Egg(targetX, 72, rand(-18, 18), 30, RIGHT, settings.powerUpBurst));
    this.powerUpCooldown = settings.powerUpCooldown;
    audio.play("fire");
    return true;
  }

  removeEgg(e) {
    const i = this.eggs.indexOf(e);
    if (i >= 0) this.eggs.splice(i, 1);
  }

  draw() {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1010, 130, 36, 0, Math.PI * 2);
    ctx.stroke();
    this.clouds.forEach((c) => drawCloud(c.x, c.y, c.scale));
    this.terrain.draw();
    this.splats.forEach((splat) => splat.draw());
    if (settings.showWreckage) this.wreckage.forEach((w) => drawWreckage(w));
    this.eggs.forEach((e) => e.draw());
    this.units.sort((a, b) => a.y - b.y).forEach((u) => u.draw());
    this.units.sort((a, b) => a.y - b.y).forEach((u) => {
      if (this.canSpeak(u)) drawSpeechBubble(u);
    });
    this.drawUnitLabels();
    this.drawProgressHud();
    this.drawTally();
    this.drawNoticeBubble();
    this.drawStartTitle();
    if (this.winner) this.drawEnd();
    drawScreenBorder();
  }

  drawStartTitle() {
    if (this.titleTimer <= 0 || this.winner) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.titleTimer / 0.8);
    ctx.fillStyle = LINE;
    ctx.font = "bold 54px Courier New";
    centerText("EGG WARS", H / 2);
    ctx.restore();
  }

  drawNoticeBubble() {
    if (!this.noticeBubble || this.noticeBubble.timer <= 0) return;
    ctx.font = "bold 18px Courier New";
    const padX = 8;
    const padY = 5;
    const text = this.noticeBubble.text;
    const textW = ctx.measureText(text).width;
    const bubbleW = textW + padX * 2;
    const bubbleH = 30;
    const x = clamp(this.noticeBubble.x - bubbleW / 2, 8, W - bubbleW - 8);
    const y = clamp(this.noticeBubble.y, 8, H - bubbleH - 8);
    ctx.fillStyle = PAPER;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, bubbleW, bubbleH);
    ctx.strokeRect(x, y, bubbleW, bubbleH);
    const tailX = clamp(this.noticeBubble.x, x + 8, x + bubbleW - 8);
    ctx.beginPath();
    ctx.moveTo(tailX - 5, y + 1);
    ctx.lineTo(tailX + 5, y + 1);
    ctx.lineTo(tailX, y - 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = LINE;
    ctx.fillText(text, x + padX, y + bubbleH - padY - 4);
  }

  drawProgressHud() {
    ctx.font = "bold 20px Courier New";
    ctx.fillStyle = LINE;
    const timeLeft = Math.max(0, Math.ceil(this.roundLimit - this.roundTime));
    const scoreText = settings.showScore ? `   SCORE ${this.points}` : "";
    centerText(`STAGE ${this.stage}   GOLD $ ${this.gold}${scoreText}   TIME ${timeLeft}`, 104);
    ctx.font = "bold 18px Courier New";
    const power = this.powerUpCooldown <= 0 ? "YOLK DROP READY" : `YOLK DROP ${this.powerUpCooldown.toFixed(1)}s`;
    centerText(`Tap battlefield: ${power}`, H - 22);
    if (this.lastUnlock && !this.winner) {
      ctx.font = "bold 20px Courier New";
      centerText(`UNLOCKED: ${this.lastUnlock}`, 132);
    }
  }

  drawUnitLabels() {
    ctx.font = "bold 14px Courier New";
    ctx.fillStyle = LINE;
    this.units.forEach((u) => {
      if (!u.label || !u.labelTimer) return;
      const width = ctx.measureText(u.label).width;
      ctx.fillText(u.label, u.x - width / 2, u.y - u.radius() - 12);
    });
  }

  drawTally() {
    this.buttons = [];
    this.drawTeamTally("BLUE", RIGHT, 24, 20, true);
    this.drawTeamTally("RED", LEFT, W - this.tallyWidth("RED", false) - 24, 20, false);
  }

  drawTeamTally(label, side, x, y, buttons) {
    const rows = [
      [["C", "castle"], ["B", "bomber"], ["H", "helicopter"], ["A", "airplane"]],
      [["T", "tank"], ["M", "motorcycle"], ["S", "soldier"], ["D", "drone"]],
    ];
    drawText(label, x, y);
    const labelWidth = ctx.measureText(label + "  ").width;
    rows.forEach((types, row) => {
      let rowX = row === 0 ? x + labelWidth : x;
      const rowY = y + row * 28;
      for (const [letter, type] of types) {
        const rect = { x: rowX, y: rowY - 17, w: 28, h: 28, side, type };
        if (buttons) {
          ctx.strokeStyle = LINE;
          ctx.lineWidth = 2;
          ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
          drawText(letter, rowX + 8, rowY);
          this.buttons.push(rect);
          rowX += rect.w + 8;
          const meta = ` ${this.units.filter((u) => u.side === side && unitType(u) === type).length} $${settings.unitSpawnCosts[type]} `;
          drawText(meta, rowX, rowY);
          rowX += ctx.measureText(meta).width + 18;
        } else {
          const meta = `${letter}:${this.units.filter((u) => u.side === side && unitType(u) === type).length} `;
          drawText(meta, rowX, rowY);
          rowX += ctx.measureText(meta).width + 14;
        }
      }
    });
  }

  tallyWidth(label, buttons = true) {
    ctx.font = "bold 22px Courier New";
    const rows = [
      [["C", "castle"], ["B", "bomber"], ["H", "helicopter"], ["A", "airplane"]],
      [["T", "tank"], ["M", "motorcycle"], ["S", "soldier"], ["D", "drone"]],
    ];
    const rowWidth = (types) => types.reduce((width, [letter, type]) => {
      if (!buttons) return width + ctx.measureText(`${letter}:00 `).width + 14;
      return width + 28 + 8 + ctx.measureText(` 00 $${settings.unitSpawnCosts[type]} `).width + 18;
    }, 0);
    const firstRow = ctx.measureText(label + "  ").width + rowWidth(rows[0]);
    const secondRow = rowWidth(rows[1]);
    return Math.max(firstRow, secondRow);
  }

  drawEnd() {
    ctx.fillStyle = rgbaFromHex(PAPER, 0.9);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = LINE;
    ctx.font = "bold 44px Courier New";
    centerText(this.winner, H / 2 - 62);
    ctx.font = "bold 22px Courier New";
    if (this.endGameTitle) centerText(this.endGameTitle, H / 2 - 12);
    const bonusText = this.lastGoldBonus ? `   WIPEOUT BONUS +${this.lastGoldBonus}` : "";
    const rewardText = this.lastGoldReward ? `   REWARD +${this.lastGoldReward}${bonusText}` : "";
    const scoreText = settings.showScore ? `   SCORE ${this.points}` : "";
    const shownStage = this.resultMode === "won" ? this.stage - 1 : this.stage;
    centerText(`STAGE ${shownStage}   GOLD $ ${this.gold}${scoreText}${rewardText}`, H / 2 + 32);
    centerText(`TOTAL WINS  BLUE ${this.score.blue}   RED ${this.score.red}`, H / 2 + 64);
    if (this.resultMode === "won" && this.lastUnlock) centerText(`NEW UNIT: ${this.lastUnlock}`, H / 2 + 96);
    const prompt = this.resultMode === "lost" ? "Click to Try Again" : "Click for Next Stage";
    centerText(prompt, H / 2 + (this.resultMode === "won" && this.lastUnlock ? 130 : 96));
    this.drawEndTextPanel("Unit Keys", settings.unitLegend, 52, 206, 300);
    this.drawEndTextPanel("Battle Tip", [this.selectedGameplayHint], W - 345, 206, 285);
    ctx.font = "bold 14px Courier New";
    ctx.fillStyle = LINE;
    const credit = "EGG WARS © copyright 2026. Created by Michael K. Davis, MD.";
    ctx.fillText(credit, W - ctx.measureText(credit).width - 18, H - 18);
  }

  drawEndTextPanel(title, lines, x, y, maxWidth = 300) {
    ctx.font = "bold 22px Courier New";
    ctx.fillStyle = LINE;
    drawText(title, x, y);
    ctx.font = "bold 18px Courier New";
    let lineY = y + 34;
    lines.forEach((line) => {
      this.wrapText(line, maxWidth).forEach((wrappedLine) => {
        drawText(wrappedLine, x, lineY);
        lineY += 28;
      });
    });
  }

  wrapText(text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let current = "";
    for (const word of words) {
      if (ctx.measureText(word).width > maxWidth) {
        if (current) {
          lines.push(current);
          current = "";
        }
        lines.push(...this.splitLongWord(word, maxWidth));
        continue;
      }
      if (!current) {
        current = word;
        continue;
      }
      const candidate = `${current} ${word}`;
      if (ctx.measureText(candidate).width <= maxWidth) current = candidate;
      else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  splitLongWord(word, maxWidth) {
    const parts = [];
    let current = "";
    for (const char of word) {
      const candidate = current + char;
      if (current && ctx.measureText(candidate).width > maxWidth) {
        parts.push(current);
        current = char;
      } else {
        current = candidate;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  click(x, y) {
    if (this.winner) {
      this.startStage();
      return;
    }
    const b = this.buttonAt(x, y);
    if (b) this.buyUnit(b);
    else this.dropPowerUp(x);
  }

  buyUnit(button) {
    if (button.side !== RIGHT) return;
    const cost = settings.unitSpawnCosts[button.type] || 0;
    if (this.gold < cost) {
      const bubbleX = Number.isFinite(button.x) ? button.x + button.w / 2 : 120;
      const bubbleY = Number.isFinite(button.y) ? button.y + button.h + 8 : 72;
      this.noticeBubble = {
        text: "Not enough gold.",
        x: bubbleX,
        y: bubbleY,
        timer: 1.25,
      };
      return;
    }
    this.gold -= cost;
    this.addUnit(button.side, button.type);
  }

  buttonAt(x, y) {
    return this.buttons.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  }

  restart() {
    this.startStage();
  }
}

function drawCloud(x, y, scale) {
  const pts = [[-84, 18], [-62, 2], [-36, 7], [-22, -16], [6, -8], [26, -24], [50, -3], [76, 4], [88, 22], [-84, 18]];
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 3;
  ctx.beginPath();
  pts.forEach(([px, py], i) => i ? ctx.lineTo(x + px * scale, y + py * scale) : ctx.moveTo(x + px * scale, y + py * scale));
  ctx.stroke();
}

function drawScreenBorder() {
  const inset = settings.terrainLine / 2;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = settings.terrainLine;
  ctx.strokeRect(inset, inset, W - settings.terrainLine, H - settings.terrainLine);
}

function drawWreckage(w) {
  const { x, y, kind } = w;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = sw(2);
  if (kind === "tank") {
    ctx.beginPath();
    [[-28, -8], [-12, -18], [20, -10], [34, -15]].forEach(([px, py], i) => i ? ctx.lineTo(x + s(px), y + s(py)) : ctx.moveTo(x + s(px), y + s(py)));
    ctx.stroke();
    line(x + s(6), y - s(17), x + s(32), y - s(28), LINE, sw(3));
    [-20, 4, 24].forEach((off) => {
      circle(x + s(off), y - s(4), s(8), LINE);
      line(x + s(off - 5), y - s(9), x + s(off + 5), y + s(1), LINE);
    });
  }
  if (kind === "motorcycle") {
    circle(x - s(17), y - s(4), s(7), LINE);
    circle(x + s(16), y - s(5), s(7), LINE);
    ctx.beginPath();
    [[-17, -4], [-2, -18], [16, -5], [5, -20]].forEach(([px, py], i) => i ? ctx.lineTo(x + s(px), y + s(py)) : ctx.moveTo(x + s(px), y + s(py)));
    ctx.stroke();
    line(x - s(2), y - s(18), x - s(12), y - s(28), LINE);
  }
  if (kind === "castle") {
    ctx.beginPath();
    [[-31, 0], [-27, -42], [-9, -25], [3, -58], [18, -32], [31, 0]].forEach(([px, py], i) => i ? ctx.lineTo(x + s(px), y + s(py)) : ctx.moveTo(x + s(px), y + s(py)));
    ctx.stroke();
    ctx.beginPath();
    [[-26, -42], [-16, -51], [-4, -42], [8, -52], [20, -40]].forEach(([px, py], i) => i ? ctx.lineTo(x + s(px), y + s(py)) : ctx.moveTo(x + s(px), y + s(py)));
    ctx.stroke();
    line(x - s(38), y - s(4), x + s(36), y - s(10), LINE);
  }
  if (kind === "air_debris") {
    const len = s(w.length || 22);
    const dx = Math.cos(w.angle || 0) * len * 0.5;
    const dy = Math.sin(w.angle || 0) * len * 0.5;
    line(x - dx, y - dy, x + dx, y + dy, LINE, sw(2));
    line(x - dy * 0.35, y + dx * 0.35, x + dy * 0.35, y - dx * 0.35, LINE, sw(1));
  }
}

function drawSpeechBubble(unit) {
  if (!unit.speechText || unit.speechTimer <= 0) return;
  ctx.font = "bold 16px Courier New";
  const padX = 7;
  const padY = 4;
  const textWidth = ctx.measureText(unit.speechText).width;
  const bubbleW = textWidth + padX * 2;
  const bubbleH = 24;
  const x = clamp(unit.x - bubbleW / 2, 8, W - bubbleW - 8);
  const y = Math.max(56, unit.y - unit.radius() - bubbleH - 10);
  ctx.fillStyle = PAPER;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, bubbleW, bubbleH);
  ctx.strokeRect(x, y, bubbleW, bubbleH);
  const tailX = clamp(unit.x, x + 6, x + bubbleW - 6);
  ctx.beginPath();
  ctx.moveTo(tailX - 5, y + bubbleH - 1);
  ctx.lineTo(tailX + 5, y + bubbleH - 1);
  ctx.lineTo(tailX, y + bubbleH + 7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = LINE;
  ctx.fillText(unit.speechText, x + padX, y + bubbleH - padY - 2);
}

function drawHelicopterShape(x, y, facing, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = sw(2);
  ctx.beginPath();
  ctx.ellipse(x, y + s(6), s(37), s(12), 0, 0, Math.PI * 2);
  ctx.stroke();
  line(x, y + s(6), x + facing * s(46), y + s(6), color);
  circle(x + facing * s(46), y + s(6), s(3), color);
  line(x, y - s(6), x, y - s(18), color);
  line(x - s(62), y - s(18), x + s(62), y - s(18), color);
  line(x - s(30), y - s(23), x + s(30), y - s(13), color);
  line(x - facing * s(34), y + s(4), x - facing * s(78), y - s(3), color);
  line(x - facing * s(78), y - s(13), x - facing * s(78), y + s(7), color);
  line(x - s(35), y + s(26), x + s(35), y + s(26), color);
  line(x - s(22), y + s(17), x - s(30), y + s(26), color);
  line(x + s(22), y + s(17), x + s(30), y + s(26), color);
}

function drawText(text, x, y) {
  ctx.fillStyle = LINE;
  ctx.font = "bold 22px Courier New";
  ctx.fillText(text, x, y);
}

function centerText(text, y) {
  ctx.fillText(text, (W - ctx.measureText(text).width) / 2, y);
}

function unitType(u) {
  if (u instanceof Castle) return "castle";
  if (u instanceof Drone) return "drone";
  if (u instanceof Helicopter) return "helicopter";
  if (u instanceof Bomber) return "bomber";
  if (u instanceof Airplane) return "airplane";
  if (u instanceof Tank) return "tank";
  if (u instanceof Motorcycle) return "motorcycle";
  return "soldier";
}

const game = new Game();
let last = performance.now();
const holdAdd = {
  button: null,
  delayTimer: null,
  repeatTimer: null,
};

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(dt);
  game.draw();
  requestAnimationFrame(frame);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * W / rect.width,
    y: (event.clientY - rect.top) * H / rect.height,
  };
}

function clearHoldAdd() {
  if (holdAdd.delayTimer) clearTimeout(holdAdd.delayTimer);
  if (holdAdd.repeatTimer) clearInterval(holdAdd.repeatTimer);
  holdAdd.button = null;
  holdAdd.delayTimer = null;
  holdAdd.repeatTimer = null;
}

function addHeldButton() {
  if (!holdAdd.button || game.winner) return;
  game.buyUnit(holdAdd.button);
}

function unlockAudio() {
  audio.ensure();
}

window.addEventListener("pointerdown", unlockAudio, { passive: true });
window.addEventListener("touchstart", unlockAudio, { passive: true });
window.addEventListener("keydown", unlockAudio);

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  audio.ensure();
  clearHoldAdd();
  const point = canvasPoint(event);
  const button = game.buttonAt(point.x, point.y);
  if (!button || game.winner) {
    game.click(point.x, point.y);
    return;
  }
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  holdAdd.button = { ...button };
  addHeldButton();
  holdAdd.delayTimer = setTimeout(() => {
    addHeldButton();
    holdAdd.repeatTimer = setInterval(addHeldButton, 120);
  }, 380);
});

canvas.addEventListener("pointerup", clearHoldAdd);
canvas.addEventListener("pointercancel", clearHoldAdd);
canvas.addEventListener("lostpointercapture", clearHoldAdd);

window.addEventListener("keydown", (event) => {
  unlockAudio();
  if (event.key === "r" || event.key === "R") game.restart();
  if (event.key === "Escape") game.winner = "PAUSED";
});

requestAnimationFrame(frame);

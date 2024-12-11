let p;
let player, playerbullet, playerexplosion;
let enemy, enemybullet, enemyexplosion;
let backgroundImg, cloud;
let b = [];
let NB = [];
let Ne = [];
let w = false, a = false, s = false, d = false;
let ne = false, c = false, ntc = false, dm = false;
let t = 0, sttt = 0, st = 0, st4 = 0;
let cdx = new Array(5);
let cdy = new Array(5);
let cdm = new Array(6).fill(0);
let score = 0, hp = 3;
let dmd = 0;
let r = new Array(5);

function preload() {
  player = loadImage("player_airplane-Sheet.png");
  playerbullet = loadImage("player_bullet.png");
  playerexplosion = loadImage("player_airplane_destroy-Sheet.png");
  enemy = loadImage("enemy_airplane-Sheet.png");
  enemybullet = loadImage("enemy_bullet.png");
  enemyexplosion = loadImage("enemy_airplane_destroy-Sheet.png");
  backgroundImg = loadImage("sea.png");
  cloud = loadImage("cloud-Sheet.png");
}

function setup() {
  createCanvas(600, 1000);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  p = new Player(width / 2, (height / 5) * 4);
  for (let i = 0; i < 5; i++) {
    if (i === 0 || i === 1) {
      cdx[i] = random(80, width / 2);
      cdy[i] = random(40, height / 2);
    } else if (i === 2 || i === 3) {
      cdx[i] = random(width / 2, width - 80);
      cdy[i] = random(height / 2, height - 40);
    } else if (i === 4) {
      cdx[i] = random(80, width - 80);
      cdy[i] = random(40, height - 40);
    }
  }
}

function draw() {
  t = millis();
  if (t - sttt >= 1000) {
    for (let i = 0; i < 6; i++) {
      cdm[i] += 10;
    }
    sttt = t;
  }

  image(backgroundImg, 0, 0);

  for (let i = 0; i < 5; i++) {
    image(cloud, cdx[i] - 80, cdy[i] - 40 + cdm[i], 160, 80,0,0,100,48);
    if (cdy[i] + cdm[i] > 1040) {
      cdy[i] = 0;
      cdm[i] = 0;
    }
  }

  if (Ne.length < 5) {
    for (let i = 0; i < 5; i++) {
      r[i] = int(random(-3, 14));
    }
    ne = true;
    if (ne) {
      for (let i = 0; i < 5; i++) {
        for (let q = 0; q < 5; q++) {
          if (i !== q) {
            while (r[i] === r[q]) {
              r[i] = int(random(-3, 14));
            }
          }
        }
        if (t - st >= random(300, 1000)) {
          Ne.push(new NormalEnemy(100 * r[i] + 30, -200));
          st = t;
        }
      }
      ne = false;
    }
  }

  for (let i = Ne.length - 1; i >= 0; i--) {
    let enemy = Ne[i];
    enemy.y += 1;
    for (let q = 0; q < Ne.length; q++) {
      if (enemy.x > Ne[q].x && enemy.x - Ne[q].x <= 60) {
        enemy.x += 3;
        enemy.ab = 1;
      } else if (enemy.x < Ne[q].x && Ne[q].x - enemy.x <= 60) {
        enemy.x -= 3;
        enemy.ab = 3;
      }
    }

    enemy.display();

    if (enemy.y > 1030) Ne.splice(i, 1);
  }

  for (let i = 0; i < Ne.length; i++) {
    for (let y = 0; y < 10; y++) {
      if (Ne[i].y === 100 * y) {
        if (Ne[i].y >= 0) NB.push(new NeBullet(Ne[i].x, Ne[i].y + 40));
      }
    }
  }

  for (let i = NB.length - 1; i >= 0; i--) {
    NB[i].display();
    if (NB[i].y - 5 > 1000) NB.splice(i, 1);
  }

  for (let q = b.length - 1; q >= 0; q--) {
    for (let i = Ne.length - 1; i >= 0; i--) {
      if (dist(Ne[i].x, Ne[i].y, b[q].x, b[q].y) <= 45) {
        Ne.splice(i, 1);
        score += 100;
        c = true;
      }
    }
    if (c) {
      b.splice(q, 1);
      c = false;
    }
  }

  for (let i = Ne.length - 1; i >= 0; i--) {
    let enemy = Ne[i];
    if (
      (enemy.x >= p.x && enemy.x - 30 < p.x + 30 &&
        enemy.y >= p.y && enemy.y - 30 < p.y + 40) ||
      (enemy.x < p.x && enemy.x + 30 > p.x - 30 &&
        enemy.y >= p.y && enemy.y - 40 < p.y + 40)
    ) {
      Ne.splice(i, 1);
      hp -= 1;
      dm = true;
    }
  }

  for (let i = NB.length - 1; i >= 0; i--) {
    let bullet = NB[i];
    if (
      bullet.y < p.y + 45 && bullet.y > p.y - 45 &&
      bullet.x < p.x + 35 && bullet.x > p.x - 35
    ) {
      NB.splice(i, 1);
      hp -= 1;
      dm = true;
    }
  }

  fill(0);
  textSize(25);
  text("hp = " + hp, 50, 950);
  text("score = " + score, 525, 950);

  for (let i = b.length - 1; i >= 0; i--) {
    b[i].display();
    if (b[i].y - 5 <= 0) b.splice(i, 1);
  }

  if (hp >= 0) p.display();
  else p.y = 30000000;

  if (dm) {
    if (t - st4 > 100) {
      image(playerexplosion, p.x - 30, p.y - 40, 60, 80,0,dmd*36,36,48);
      dmd++;
      st4 = t;
    }
    if (dmd === 5) {
      dmd = 0;
      dm = false;
    }
  }
}

function mousePressed() {
  b.push(new Bullet(p.x, p.y - 40));
}

function keyPressed() {
  if (key === 'w') w = true;
  if (key === 'a') a = true;
  if (key === 's') s = true;
  if (key === 'd') d = true;
}

function keyReleased() {
  if (key === 'w') w = false;
  if (key === 'a') a = false;
  if (key === 's') s = false;
  if (key === 'd') d = false;
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ab = 0;
  }

  display() {
    this.x = constrain(this.x, 30, width - 30);
    this.y = constrain(this.y, 40, height - 40);

    image(player, this.x - 30, this.y - 40, 60, 80,0,0,36,48);

    if (w) this.y -= 5;
    if (a) {
      this.x -= 5;
      this.ab = 1;
    }
    if (s) this.y += 5;
    if (d) {
      this.x += 5;
      this.ab = 3;
    }
    if (!a && !d) this.ab = 0;
  }
}

class NormalEnemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ab = 0;
  }

  display() {
    image(enemy, this.x - 30, this.y - 40, 60, 80,0,0,36,48);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    image(playerbullet, this.x, this.y, playerbullet.width * 4, playerbullet.height * 4);
    this.y -= 10;
  }
}

class NeBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    image(enemybullet, this.x, this.y, enemybullet.width * 4, enemybullet.height * 4);
    this.y += 10;
  }
}

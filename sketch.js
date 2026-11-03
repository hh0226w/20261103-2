
/*
==================================================
WORD QUEST：單字勇者傳說
16-bit 像素 RPG 英文學習遊戲
==================================================
特色：
1. 像素風角色與場景
2. 劍士、法師、弓箭手
3. 三個冒險關卡
4. 英文單字選擇題
5. 答對攻擊、答錯受到反擊
6. 英文語音發音
7. HP、EXP、等級、金幣、藥水
8. 返回角色選擇
9. 不需要外部圖片或 GIF

畫布使用 4 倍放大的低解析度畫面，
讓整體呈現復古像素風格。
*/

// ==========================================
// 1. 遊戲基本設定
// ==========================================

let gameState = "title";

let selectedJob = "劍士";

let hero;
let enemy;

let currentStage = 0;

let question;
let answered = false;
let feedback = "";

let buttons = [];

// 使用低解析度畫面
const SCALE = 4;
const W = 225;
const H = 162;

let pixelFont = "monospace";

// ==========================================
// 2. 題庫
// ==========================================

let questionBank = [
  { word: "Apple", meaning: "蘋果", options: ["蘋果", "香蕉", "橘子", "西瓜"] },
  { word: "Cat", meaning: "貓", options: ["狗", "貓", "兔子", "鳥"] },
  { word: "Dog", meaning: "狗", options: ["魚", "鳥", "狗", "馬"] },
  { word: "Fish", meaning: "魚", options: ["魚", "貓", "熊", "狗"] },
  { word: "Bird", meaning: "鳥", options: ["兔子", "鳥", "豬", "牛"] },
  { word: "Rabbit", meaning: "兔子", options: ["獅子", "老虎", "兔子", "大象"] },
  { word: "Banana", meaning: "香蕉", options: ["蘋果", "葡萄", "香蕉", "西瓜"] },
  { word: "Elephant", meaning: "大象", options: ["猴子", "大象", "熊", "狗"] },
  { word: "Cake", meaning: "蛋糕", options: ["麵包", "蛋糕", "牛奶", "糖果"] },
  { word: "Car", meaning: "汽車", options: ["腳踏車", "飛機", "汽車", "船"] }
];

// ==========================================
// 3. 關卡資料
// ==========================================

let stages = [
  { name: "綠葉森林", unlocked: true },
  { name: "烈焰火山", unlocked: false },
  { name: "魔王城堡", unlocked: false }
];

let monsterData = [
  { name: "森林史萊姆", hp: 50, damage: 12, exp: 30, gold: 15 },
  { name: "火焰小龍", hp: 75, damage: 18, exp: 45, gold: 25 },
  { name: "混亂魔王", hp: 150, damage: 25, exp: 100, gold: 80 }
];

// ==========================================
// 4. 初始化
// ==========================================

function setup() {
  createCanvas(900, 648);
  noSmooth();
  textFont(pixelFont);
  textAlign(CENTER, CENTER);

  resetGame();
  gameState = "title";
}

// ==========================================
// 5. 主畫面
// ==========================================

function draw() {

  // 將畫布縮小成低解析度座標
  push();
  scale(SCALE);

  buttons = [];

  if (gameState === "title") {
    drawTitle();
  } else if (gameState === "map") {
    drawMap();
  } else if (gameState === "battle") {
    drawBattle();
  } else if (gameState === "reward") {
    drawReward();
  } else if (gameState === "inventory") {
    drawInventory();
  } else if (gameState === "gameover") {
    drawGameOver();
  } else if (gameState === "ending") {
    drawEnding();
  }

  pop();
}

// ==========================================
// 6. 像素風背景
// ==========================================

function drawBackground() {

  // 天空
  background(65, 175, 220);

  // 遠方山脈
  noStroke();
  fill(45, 110, 165);

  triangle(0, 105, 35, 55, 75, 105);
  triangle(45, 105, 100, 35, 155, 105);
  triangle(125, 105, 180, 55, 225, 105);

  // 山上的雪
  fill(180, 225, 235);
  triangle(85, 55, 100, 35, 115, 55);
  triangle(165, 70, 180, 55, 195, 70);

  // 白雲
  drawCloud(20, 25);
  drawCloud(115, 18);
  drawCloud(185, 35);

  // 森林
  drawTree(12, 92);
  drawTree(38, 100);
  drawTree(185, 96);
  drawTree(210, 90);

  // 草地
  fill(105, 190, 55);
  rect(0, 108, W, 54);

  // 草地細節
  fill(75, 150, 45);

  for (let i = 0; i < 35; i++) {
    let x = (i * 37) % W;
    let y = 112 + (i * 13) % 45;

    rect(x, y, 3, 2);
    rect(x + 3, y - 2, 2, 2);
  }

  // 地面
  fill(70, 155, 45);
  rect(0, 151, W, 11);
}

// ==========================================
// 7. 像素雲朵
// ==========================================

function drawCloud(x, y) {

  noStroke();
  fill(245, 245, 220);

  rect(x + 4, y + 4, 18, 8);
  rect(x + 8, y, 12, 8);
  rect(x + 15, y + 3, 13, 8);
  rect(x, y + 8, 26, 5);
}

// ==========================================
// 8. 像素樹木
// ==========================================

function drawTree(x, y) {

  noStroke();

  // 樹幹
  fill(105, 65, 35);
  rect(x + 5, y + 13, 7, 15);

  // 樹葉
  fill(30, 115, 55);
  rect(x, y + 5, 17, 12);
  rect(x + 3, y, 11, 17);

  fill(55, 160, 65);
  rect(x + 3, y + 4, 5, 5);
  rect(x + 9, y + 8, 5, 5);
}

// ==========================================
// 9. 像素勇者
// ==========================================

function drawHero(x, y, size = 1) {

  push();
  translate(x, y);
  scale(size);

  noStroke();

  // 披風
  fill(155, 35, 35);
  rect(12, 12, 13, 35);
  rect(20, 20, 10, 28);
  rect(25, 30, 8, 17);

  fill(210, 55, 35);
  rect(15, 15, 10, 22);

  // 腿部
  fill(80, 45, 30);
  rect(-10, 35, 9, 19);
  rect(3, 35, 9, 19);

  // 靴子
  fill(65, 40, 30);
  rect(-13, 50, 13, 7);
  rect(2, 50, 14, 7);

  fill(125, 75, 40);
  rect(-10, 49, 8, 3);
  rect(5, 49, 8, 3);

  // 身體
  fill(30, 85, 160);
  rect(-13, 5, 27, 34);

  fill(45, 125, 205);
  rect(-9, 9, 20, 24);

  // 腰帶
  fill(90, 50, 25);
  rect(-14, 33, 29, 6);

  fill(245, 180, 40);
  rect(-3, 32, 9, 8);

  fill(90, 50, 25);
  rect(0, 34, 3, 4);

  // 手臂
  fill(245, 180, 115);
  rect(-20, 12, 8, 17);
  rect(13, 12, 8, 17);

  // 頭部
  fill(245, 185, 130);
  rect(-15, -19, 31, 28);

  fill(220, 145, 95);
  rect(-18, -12, 4, 15);
  rect(16, -12, 4, 15);

  // 頭髮
  fill(75, 40, 25);
  rect(-16, -23, 32, 8);
  rect(-16, -15, 5, 9);
  rect(11, -15, 5, 9);

  // 頭盔
  fill(20, 55, 120);
  rect(-17, -32, 34, 12);
  rect(-13, -39, 26, 9);
  rect(-7, -43, 14, 6);

  fill(40, 100, 190);
  rect(-9, -37, 18, 8);

  // 頭盔金色裝飾
  fill(240, 175, 45);
  rect(-17, -23, 34, 4);
  rect(-4, -31, 9, 9);

  fill(30, 80, 145);
  rect(-1, -29, 4, 5);

  // 眼睛
  fill(20);
  rect(-9, -12, 4, 8);
  rect(6, -12, 4, 8);

  // 嘴巴
  fill(50, 30, 25);
  rect(-3, 1, 8, 2);

  // 武器
  if (hero && hero.job === "劍士") {

    fill(40);
    rect(-29, -33, 3, 42);

    fill(225, 235, 235);
    rect(-27, -34, 5, 35);

    fill(245, 245, 220);
    rect(-26, -30, 2, 25);

    fill(180, 115, 40);
    rect(-32, 7, 14, 4);
    rect(-27, 10, 5, 5);
  }

  if (hero && hero.job === "法師") {

    fill(100, 60, 35);
    rect(25, -28, 4, 55);

    fill(170, 100, 255);
    rect(22, -34, 10, 8);

    fill(235, 190, 255);
    rect(25, -37, 4, 4);
  }

  if (hero && hero.job === "弓箭手") {

    noFill();
    stroke(120, 75, 35);
    strokeWeight(2);
    arc(27, 0, 25, 38, -HALF_PI, HALF_PI);

    stroke(230);
    line(27, -19, 27, 19);
    noStroke();
  }

  pop();
}

// ==========================================
// 10. 像素怪物
// ==========================================

function drawMonster(x, y, size = 1) {

  push();
  translate(x, y);
  scale(size);

  noStroke();

  if (currentStage === 0) {

    // 史萊姆
    fill(25, 120, 65);
    rect(-22, -5, 44, 25);
    rect(-16, -13, 32, 8);
    rect(-9, -18, 18, 6);

    fill(65, 220, 100);
    rect(-16, -7, 32, 22);
    rect(-10, -14, 20, 7);

    fill(255);
    rect(-10, -3, 6, 8);
    rect(5, -3, 6, 8);

    fill(20);
    rect(-8, 0, 3, 4);
    rect(7, 0, 3, 4);
  }

  else if (currentStage === 1) {

    // 火焰小龍
    fill(130, 35, 25);
    rect(-21, -7, 42, 30);
    rect(-15, -17, 30, 12);

    fill(225, 75, 35);
    rect(-17, -8, 34, 23);
    rect(-10, -18, 20, 10);

    fill(255, 160, 35);
    rect(-19, -25, 8, 12);
    rect(11, -25, 8, 12);

    fill(255);
    rect(-10, -8, 5, 7);
    rect(6, -8, 5, 7);

    fill(20);
    rect(-8, -6, 2, 4);
    rect(8, -6, 2, 4);
  }

  else {

    // 魔王
    fill(55, 25, 90);
    rect(-25, -5, 50, 35);
    rect(-19, -20, 38, 18);

    fill(120, 45, 155);
    rect(-20, -7, 40, 30);
    rect(-14, -22, 28, 15);

    fill(200, 35, 55);
    rect(-22, -31, 10, 14);
    rect(12, -31, 10, 14);

    fill(255, 70, 70);
    rect(-12, -12, 7, 7);
    rect(6, -12, 7, 7);

    fill(255);
    rect(-9, -10, 3, 3);
    rect(9, -10, 3, 3);
  }

  pop();
}

// ==========================================
// 11. 像素文字框
// ==========================================

function drawPanel(x, y, w, h) {

  noStroke();

  fill(20, 35, 60);
  rect(x, y, w, h);

  fill(235, 220, 175);
  rect(x + 1, y + 1, w - 2, h - 2);

  fill(50, 55, 70);
  rect(x + 3, y + 3, w - 6, h - 6);

  fill(30, 40, 60);
  rect(x + 4, y + 4, w - 8, h - 8);
}

// ==========================================
// 12. 像素按鈕
// ==========================================

function drawButton(label, x, y, w, h, type, value = "") {

  // 陰影
  noStroke();
  fill(15, 25, 40);
  rect(x + 1, y + 2, w, h);

  // 按鈕底色
  fill(160, 100, 45);
  rect(x, y, w, h);

  fill(230, 175, 75);
  rect(x + 1, y + 1, w - 2, h - 3);

  fill(90, 55, 35);
  rect(x + 3, y + 3, w - 6, h - 7);

  fill(255, 230, 175);
  textSize(7);
  text(label, x + w / 2, y + h / 2 - 1);

  buttons.push({
    x, y, w, h, type, value
  });
}

// ==========================================
// 13. 標題與角色選擇
// ==========================================

function drawTitle() {

  drawBackground();

  drawPanel(25, 8, 175, 38);

  fill(255, 210, 90);
  textSize(15);
  text("WORD QUEST", 112, 20);

  fill(255);
  textSize(7);
  text("單字勇者傳說", 112, 34);

  drawHero(112, 94, 1.25);

  drawPanel(20, 120, 185, 36);

  fill(255, 230, 160);
  textSize(7);
  text("選擇你的冒險職業", 112, 127);

  drawButton("劍士", 28, 135, 48, 15, "job", "劍士");
  drawButton("法師", 88, 135, 48, 15, "job", "法師");
  drawButton("弓箭手", 148, 135, 48, 15, "job", "弓箭手");

  drawButton("開始冒險", 80, 99, 65, 17, "start");
}

// ==========================================
// 14. HUD
// ==========================================

function drawHUD() {

  drawPanel(5, 3, 95, 15);

  fill(255);
  textSize(6);

  textAlign(LEFT, CENTER);

  text(
    "LV." + hero.level +
    " HP:" + hero.hp +
    " G:" + hero.gold,
    10,
    10
  );

  textAlign(CENTER, CENTER);
}

// ==========================================
// 15. 地圖
// ==========================================

function drawMap() {

  drawBackground();

  drawPanel(45, 8, 135, 22);

  fill(255, 220, 100);
  textSize(10);
  text("冒險世界地圖", 112, 19);

  drawHero(112, 76, 0.8);

  for (let i = 0; i < stages.length; i++) {

    let x = 12 + i * 72;

    drawPanel(x, 100, 63, 38);

    fill(255, 230, 160);
    textSize(7);
    text(stages[i].name, x + 31, 108);

    if (stages[i].unlocked) {
      drawButton("進入", x + 8, 117, 47, 15, "stage", i);
    } else {
      fill(180);
      textSize(7);
      text("未解鎖", x + 31, 125);
    }
  }

  drawHUD();

  drawButton("背包", 175, 4, 42, 14, "inventory");
  drawButton("返回角色", 7, 143, 55, 15, "character");
}

// ==========================================
// 16. 開始關卡
// ==========================================

function startStage(index) {

  currentStage = index;

  enemy = {
    ...monsterData[index],
    maxHp: monsterData[index].hp
  };

  newQuestion();

  gameState = "battle";
}

// ==========================================
// 17. 隨機題目
// ==========================================

function newQuestion() {

  question = random(questionBank);

  question.options = shuffle([...question.options]);

  answered = false;
  feedback = "";
}

// ==========================================
// 18. 血條
// ==========================================

function drawHealthBar(x, y, w, hp, maxHp, label) {

  fill(255);
  textSize(6);
  text(label, x + w / 2, y - 4);

  fill(50, 25, 35);
  rect(x, y, w, 5);

  let healthWidth = w * max(0, hp) / maxHp;

  fill(65, 210, 75);
  rect(x, y, healthWidth, 5);
}

// ==========================================
// 19. 戰鬥畫面
// ==========================================

function drawBattle() {

  drawBackground();

  drawPanel(60, 3, 105, 18);

  fill(255, 220, 100);
  textSize(9);
  text(stages[currentStage].name, 112, 12);

  // 角色與怪物
  drawHero(55, 75, 0.85);
  drawMonster(172, 78, 1.1);

  drawHealthBar(23, 103, 60, hero.hp, hero.maxHp, "HERO");
  drawHealthBar(140, 103, 60, enemy.hp, enemy.maxHp, "MONSTER");

  // 題目框
  drawPanel(8, 111, 209, 47);

  fill(255, 220, 100);
  textSize(7);
  text("ENGLISH CHALLENGE", 112, 119);

  fill(255);
  textSize(12);
  text(question.word, 112, 132);

  // 四個答案
  for (let i = 0; i < 4; i++) {

    let x = 17 + (i % 2) * 99;
    let y = 140 + floor(i / 2) * 9;

    drawButton(
      question.options[i],
      x,
      y,
      90,
      8,
      "answer",
      question.options[i]
    );
  }

  if (answered) {

    drawPanel(55, 75, 115, 22);

    fill(255, 225, 120);
    textSize(6);
    text(feedback, 112, 82);

    drawButton(
      enemy.hp <= 0 ? "領取獎勵" : "下一回合",
      83, 91, 60, 12, "next"
    );
  }

  drawButton("發音", 178, 4, 38, 13, "audio");
  drawButton("返回角色", 7, 4, 52, 13, "character");
}

// ==========================================
// 20. 答題
// ==========================================

function answerQuestion(answer) {

  if (answered) return;

  answered = true;

  if (answer === question.meaning) {

    let damage = hero.attack;

    if (hero.job === "法師") damage += 10;
    if (hero.job === "弓箭手") damage += 5;

    enemy.hp = max(0, enemy.hp - damage);

    feedback = "答對了！造成 " + damage + " 傷害！";

    playSound("correct");

  } else {

    hero.hp = max(0, hero.hp - enemy.damage);

    feedback = "答錯了！" + question.word + " = " + question.meaning;

    playSound("wrong");

    if (hero.hp <= 0) {
      gameState = "gameover";
    }
  }
}

// ==========================================
// 21. 下一回合
// ==========================================

function nextTurn() {

  if (enemy.hp <= 0) {
    winBattle();
  } else {
    newQuestion();
  }
}

// ==========================================
// 22. 戰鬥勝利
// ==========================================

function winBattle() {

  hero.gold += enemy.gold;
  hero.exp += enemy.exp;

  if (hero.exp >= hero.level * 50) {

    hero.exp -= hero.level * 50;

    hero.level++;
    hero.maxHp += 20;
    hero.hp = hero.maxHp;
    hero.attack += 5;
  }

  if (currentStage < 2) {
    stages[currentStage + 1].unlocked = true;
    gameState = "reward";
  } else {
    gameState = "ending";
  }
}

// ==========================================
// 23. 獎勵畫面
// ==========================================

function drawReward() {

  drawBackground();

  drawPanel(35, 15, 155, 35);

  fill(255, 220, 80);
  textSize(13);
  text("VICTORY!", 112, 27);

  drawHero(112, 85, 1.2);

  drawPanel(35, 105, 155, 40);

  fill(255);
  textSize(8);
  text("EXP +" + enemy.exp, 112, 115);
  text("GOLD +" + enemy.gold, 112, 128);

  drawButton("返回地圖", 80, 143, 65, 14, "map");
  drawButton("返回角色", 7, 143, 55, 14, "character");
}

// ==========================================
// 24. 背包
// ==========================================

function drawInventory() {

  drawBackground();

  drawPanel(40, 10, 145, 22);

  fill(255, 220, 100);
  textSize(11);
  text("勇者背包", 112, 21);

  drawHero(112, 65, 0.85);

  drawPanel(35, 95, 155, 48);

  fill(255);
  textSize(7);

  text("職業：" + hero.job, 112, 103);
  text("等級：LV." + hero.level, 112, 113);
  text("攻擊力：" + hero.attack, 112, 123);
  text("生命值：" + hero.hp + "/" + hero.maxHp, 112, 133);

  drawButton("使用藥水", 80, 147, 62, 12, "potion");
  drawButton("返回角色", 7, 147, 60, 12, "character");
  drawButton("返回地圖", 158, 147, 60, 12, "map");
}

// ==========================================
// 25. 遊戲失敗
// ==========================================

function drawGameOver() {

  background(35, 20, 45);

  drawPanel(35, 35, 155, 75);

  fill(255, 80, 80);
  textSize(15);
  text("GAME OVER", 112, 55);

  fill(255);
  textSize(8);
  text("勇者倒下了！", 112, 73);
  text("再努力挑戰一次吧！", 112, 87);

  drawButton("重新開始", 80, 120, 65, 15, "restart");
  drawButton("返回角色", 7, 143, 55, 14, "character");
}

// ==========================================
// 26. 最終結局
// ==========================================

function drawEnding() {

  drawBackground();

  drawPanel(30, 15, 165, 100);

  fill(255, 220, 70);
  textSize(13);
  text("QUEST CLEAR!", 112, 30);

  drawHero(112, 75, 1.1);

  fill(255);
  textSize(7);
  text("你成功擊敗混亂魔王！", 112, 108);

  drawButton("再次冒險", 80, 123, 65, 14, "restart");
  drawButton("返回角色", 7, 143, 55, 14, "character");
}

// ==========================================
// 27. 重置遊戲
// ==========================================

function resetGame() {

  hero = {
    job: selectedJob,
    hp: 100,
    maxHp: 100,
    attack: 25,
    level: 1,
    exp: 0,
    gold: 0,
    potion: 2
  };

  stages[0].unlocked = true;
  stages[1].unlocked = false;
  stages[2].unlocked = false;

  answered = false;
  feedback = "";
}

// ==========================================
// 28. 返回角色選擇
// ==========================================

function backToCharacterSelect() {

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  gameState = "title";

  answered = false;
  feedback = "";
}

// ==========================================
// 29. 滑鼠點擊
// ==========================================

function mousePressed() {

  // 將實際滑鼠座標換算成低解析度座標
  let mx = mouseX / SCALE;
  let my = mouseY / SCALE;

  for (let i = buttons.length - 1; i >= 0; i--) {

    let btn = buttons[i];

    if (
      mx >= btn.x &&
      mx <= btn.x + btn.w &&
      my >= btn.y &&
      my <= btn.y + btn.h
    ) {

      handleButton(btn);
      return;
    }
  }
}

// ==========================================
// 30. 按鈕事件
// ==========================================

function handleButton(btn) {

  if (btn.type === "job") {

    selectedJob = btn.value;
    hero.job = selectedJob;

  }

  else if (btn.type === "start") {

    resetGame();
    gameState = "map";

  }

  else if (btn.type === "stage") {

    if (stages[btn.value].unlocked) {
      startStage(btn.value);
    }

  }

  else if (btn.type === "answer") {

    if (gameState === "battle") {
      answerQuestion(btn.value);
    }

  }

  else if (btn.type === "audio") {

    speak(question.word);

  }

  else if (btn.type === "next") {

    nextTurn();

  }

  else if (btn.type === "map") {

    gameState = "map";

  }

  else if (btn.type === "inventory") {

    gameState = "inventory";

  }

  else if (btn.type === "potion") {

    if (hero.potion > 0 && hero.hp < hero.maxHp) {

      hero.potion--;
      hero.hp = min(hero.maxHp, hero.hp + 40);

    }

  }

  else if (btn.type === "restart") {

    resetGame();
    gameState = "map";

  }

  else if (btn.type === "character") {

    backToCharacterSelect();

  }
}

// ==========================================
// 31. 英文語音
// ==========================================

function speak(word) {

  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  let speech = new SpeechSynthesisUtterance(word);

  speech.lang = "en-US";
  speech.rate = 0.8;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// ==========================================
// 32. 音效
// ==========================================

function playSound(type) {

  if (type === "correct") {
    speak("Great job!");
  }

  if (type === "wrong") {
    speak("Try again!");
  }
}

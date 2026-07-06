"use strict";
let engine; // 物理エンジン
let ctx; // 描画コンテキスト
let colors = ["yellow", "green", "orange", "blue", "white"]; // 色の配列
let azarashiImg; // ★アザラシの画像を入れる変数

function rand(v) {
  return Math.floor(Math.random() * v); // 0～vまでの乱数（整数）を返す
}

// 初期化関数
function init() {
  // ★HTMLに追加した画像要素を取得
  azarashiImg = document.getElementById("azarashi");

  let r;
  engine = new Engine(0, 0, 600, 800, 0, 9.8); // 物理エンジン作成

  r = new RectangleEntity(500, 50, 50, 400); // 矩形を作成しエンジンに追加
  r.color = "green";
  engine.entities.push(r);

  r = new RectangleEntity(0, 50, 50, 400);
  r.color = "yellow";
  engine.entities.push(r);

  r = new LineEntity(50, 300, 400, 350); // 線分を作成しエンジンに追加
  r.color = "orange";
  engine.entities.push(r);

  r = new LineEntity(500, 400, 100, 450);
  r.color = "orange";
  engine.entities.push(r);

  // 7 x 3 = 21 個の円（固定ピン）を作成
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 3; j++) {
      r = new CircleEntity(i * 60 + 100, j * 60 + 100, 5, BodyStatic);
      r.color = colors[j];
      engine.entities.push(r);
    }
  }

  // 20 個の円（移動：アザラシ用）を作成
  for (let i = 0; i < 20; i++) {
    r = new CircleEntity(rand(400) + 50, rand(200), 15, BodyDynamic); // ★見やすいように半径を10から15に大きくしました
    r.color = colors[rand(5)];
    r.velocity.x = rand(10) - 5;
    r.velocity.y = rand(10) - 5;
    engine.entities.push(r);
  }

  ctx = document.getElementById("canvas").getContext("2d");
  setInterval(tick, 50);
}

// メインループ
function tick() {
  engine.step(0.01); // 物理エンジンの時刻を進める
  repaint();
}

function repaint() {
  ctx.fillStyle = "black"; // 背景をクリア
  ctx.fillRect(0, 0, 600, 600);
  
  // 物理世界のモノを描画
  engine.entities.forEach((e) => {
    ctx.fillStyle = e.color;
    ctx.strokeStyle = e.color;
    switch (e.shape) {
      case ShapeRectangle: // 矩形の場合
        ctx.fillRect(e.x, e.y, e.w, e.h);
        break;

      case ShapeCircle: // 円の場合
        if (e.type === BodyDynamic) {
          // ★動く円（アザラシ）の場合は画像を描画する
          // 引数：(画像, X座標, Y座標, 横幅, 縦幅)
          // 中心座標から半径分引いて、ちょうど円の枠内に画像が収まるようにします
          ctx.drawImage(
            azarashiImg, 
            e.x - e.radius, 
            e.y - e.radius, 
            e.radius * 2, 
            e.radius * 2
          );
        } else {
          // 固定されているピンは、今まで通り普通の円として描画
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case ShapeLine: // 線分の場合
        ctx.beginPath();
        ctx.moveTo(e.x0, e.y0);
        ctx.lineTo(e.x1, e.y1);
        ctx.stroke();
        break;
    }
  });
}
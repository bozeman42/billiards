import Circle from './Circle.js';

window.addEventListener('load',main);
function main() {
  const canvas = document.createElement('canvas');
  const app = document.querySelector('#app');
  canvas.height = window.innerHeight;
  canvas.width= window.innerWidth;
  const ctx = canvas.getContext('2d');
  app.appendChild(canvas);
  drawBackground(ctx);
  let circle = new Circle(
    ctx,
    100 + Math.random() * 1500,
    100 + Math.random() * 1000,
    -100 + Math.random() * 200,
    -100 + Math.random() * 200,
    50,
    `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
  );
  let circle2 = new Circle(
    ctx,100 + Math.random() * 1500,
    100 + Math.random() * 1000,
    -100 + Math.random() * 200,
    -100 + Math.random() * 200,
    50,
    `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
  );
  let circles = [circle,circle2];
  animate(circles,ctx)();
}

function drawBackground(ctx) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
}

function animate(things,ctx) {
  return function (timestamp) {
    drawBackground(ctx);
    things.forEach(thing => {
      thing.update();
    })
    requestAnimationFrame(animate(things,ctx));
  }
}



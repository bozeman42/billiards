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
  animate(makeCircles(ctx,10),ctx)();
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
    // window.addEventListener('click',(event) => {
      requestAnimationFrame(animate(things,ctx));
    // },{once: true});
  }
}

function makeCircles(ctx,number) {
  let circles = [];
  for(let i = 0; i < number; i++) {
    const xPos = 100 + Math.random() * 1500;
    const yPos = 100 + Math.random() * 1000;
    const xVel = -50 + Math.random() * 100;
    const yVel = -50 + Math.random() * 100;
    // const color = `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
    const color = `red`;
    let circle = new Circle(
      ctx,
      xPos,
      yPos,
      xVel,
      yVel,
      100 * Math.random(),
      color
    );
    circles.push(circle);
    console.log(circles);
  }
  return circles;
}

function randomColor() {
  return `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
}
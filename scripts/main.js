import Circle from './Circle.js';
import { vec2Subtraction } from './math.js';

['click'].forEach(eventName => {
  window.addEventListener(eventName, main);
});
const canvas = document.createElement('canvas');
const app = document.querySelector('#app');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext('2d');
app.appendChild(canvas);
let circles = []
animate(ctx)()

function main() {
  circles = []
  drawBackground(ctx);
  circles = makeCircles(ctx, 15)
}

function drawBackground(ctx) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function animate(ctx) {
  return function (timestamp) {
    drawBackground(ctx);
    circles.forEach(thing => {
      thing.update(circles);
    })
    requestAnimationFrame(animate(ctx));
  }
}

function makeCircles(ctx, number) {
  let circles = [];
  for (let i = 0; i < number; i++) {
    // const radius = 100 * Math.random() + 10;
    const radius = 50;
    // const xPos = radius + Math.random() * (window.innerWidth - radius);
    // const yPos = radius + Math.random() * (window.innerHeight - radius);
    const xPos = radius + Math.random() * (window.innerWidth - radius);
    const yPos = radius + Math.random() * (window.innerHeight - radius);
    const xVel = -50 + Math.random() * 100;
    const yVel = -50 + Math.random() * 100;
    // const xVel = i%2?-50 + Math.random() * 100:0;
    // const yVel = i%2?0:-50 + Math.random() * 100;
    const color = randomColor();
    // const color = `red`;
    let circle = new Circle(
      ctx,
      xPos,
      yPos,
      xVel,
      yVel,
      radius,
      color
    );
    circles.push(circle);
  }
  return circles;
}

function drawNormals(ctx, c1, c2) {
  let dist = vec2Subtraction(c1.pos, c2.pos);
  let normal = dist.projectionOf(c1.vel);
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(c1.pos.x, c1.pos.y);
  ctx.lineTo(c2.pos.x, c2.pos.y)
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.moveTo(c1.pos.x, c1.pos.y);
  ctx.lineTo(c1.pos.x + normal.x * 10, c1.pos.y + normal.y * 10);
  ctx.stroke();
  // if (dist.length <= c1.radius + c2.radius) {
  //   console.table({
  //     c1: c1.radius, c2: c2.radius, normal: normal.length
  //   })
  //   alert("collision!");
  // }
}

function randomColor() {
  return `RGB(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
}
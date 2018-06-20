import { Vec2 } from './math.js';

export default class Circle {
  constructor(ctx,x,y,vx,vy,radius,color) {
    this.ctx = ctx;
    this.pos = new Vec2(x,y);
    this.vel = new Vec2(vx, vy)
    this.radius = radius;
    this.c1 = `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    this.c2 = `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    this.color = color;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
    this.ctx.fillStyle = this.color;
    // this.ctx.fillStyle = randomColor();
    this.ctx.fill();
    // this.ctx.fillStyle = 'white';
    // this.ctx.font = "10px Arial";
    this.ctx.beginPath();
    this.ctx.strokeStyle= 'white';
    this.ctx.moveTo(this.pos.x,this.pos.y);
    this.ctx.lineTo(this.pos.x + this.vel.x * 10,this.pos.y + this.vel.y * 10);
    this.ctx.stroke();
  }

  collide(circle) {
    const x = circle.pos.x - this.pos.x;
    const y = circle.pos.y - this.pos.y;
    const dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    if (dist < circle.radius + this.radius) {
      console.alert('Collision!');
    }
  }

  update() {
    const dampening = 0.95; // 0.8 recommended
    const friction = .071; // 0.07 recommended
    this.pos.x += this.vel.x;
    let xOverlap;
    if (this.vel.x > 0 && this.pos.x > window.innerWidth - this.radius) {
      xOverlap = this.pos.x + this.radius - window.innerWidth;
      this.pos.x -= 2 * xOverlap;
      this.vel.x = -this.vel.x;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    } else if (this.vel.x < 0 && this.pos.x < this.radius) {
      xOverlap = this.pos.x - this.radius;
      this.pos.x -= 2 * xOverlap;
      this.vel.x = -this.vel.x;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    }
    this.pos.y += this.vel.y;
    let yOverlap = this.pos.y - this.radius
    if (this.vel.y > 0 && this.pos.y > window.innerHeight - this.radius) {
      yOverlap = this.pos.y + this.radius - window.innerHeight;
      this.pos.y -= 2 * yOverlap;
      this.vel.y = -this.vel.y;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    } else if (this.vel.y < 0 && this.pos.y < this.radius) {
      yOverlap = this.pos.y - this.radius
      this.pos.y -= 2 * yOverlap;
      this.vel.y = -this.vel.y;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    }
    let speed = Math.sqrt(Math.pow(this.vel.x,2) + Math.pow(this.vel.y,2));
    this.vel.x -= (friction * this.vel.x / speed);
    this.vel.y -= (friction * this.vel.y / speed);
    if (speed < friction) {
      this.vel.x = 0;
      this.vel.y = 0;
    }
    this.draw();
  }
}

function randomColor() {
  return `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
}
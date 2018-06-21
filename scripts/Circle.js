import { Vec2 } from './math.js';
import { vec2Subtraction } from './math.js';

export default class Circle {
  constructor(ctx,x,y,vx,vy,radius,color) {
    this.ctx = ctx;
    this.pos = new Vec2(x,y);
    this.vel = new Vec2(vx, vy)
    this.radius = radius;
    this.color = color;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black"
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.fillStyle = "white";
    // this.ctx.font = "50px Arial";
    // this.ctx.fillText(`Speed: ${Math.sqrt(Math.pow(this.vel.x,2) + Math.pow(this.vel.y,2))}`,this.pos.x - 15, this.pos.y + 10);
    // this.ctx.beginPath();
    // this.ctx.strokeStyle= 'white';
    // this.ctx.moveTo(this.pos.x,this.pos.y);
    // this.ctx.lineTo(this.pos.x + this.vel.x * 10,this.pos.y + this.vel.y * 10);
    // this.ctx.stroke();
  }


  // implement circle collision here?
  collide(circle) {
    let dist2 = vec2Subtraction(this.pos, circle.pos);
    let dist1 = vec2Subtraction(circle.pos,this.pos)
    if (dist1.length < circle.radius + this.radius) {
      const sound = new Audio(`../assets/hit${Math.floor(Math.random() * 10)}.mp3`);
      sound.play();
      let normal1 = dist1.projectionOf(this.vel);
      let normal2 = dist2.projectionOf(circle.vel)
      // console.log('vel1',this.vel,'normal1:',normal1,'vel2',circle.vel,"normal2:",normal2);
      this.vel.x += normal2.x - normal1.x;
      this.vel.y += normal2.y - normal1.y;
      circle.vel.x += normal1.x - normal2.x;
      circle.vel.y += normal1.y - normal2.y;
      
    }
  }

  update() {
    const dampening = 0.95; // 0.8 recommended
    const friction = .071; // 0.07 recommended
    this.pos.x += this.vel.x;
    let xOverlap;
    let collision = false;
    if (this.vel.x > 0 && this.pos.x > window.innerWidth - this.radius) {
      collision = true;
      xOverlap = this.pos.x + this.radius - window.innerWidth;
      this.pos.x -= 2 * xOverlap;
      this.vel.x = -this.vel.x;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    } else if (this.vel.x < 0 && this.pos.x < this.radius) {
      collision = true;
      xOverlap = this.pos.x - this.radius;
      this.pos.x -= 2 * xOverlap;
      this.vel.x = -this.vel.x;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    }
    this.pos.y += this.vel.y;
    let yOverlap = this.pos.y - this.radius
    if (this.vel.y > 0 && this.pos.y > window.innerHeight - this.radius) {
      collision = true;
      yOverlap = this.pos.y + this.radius - window.innerHeight;
      this.pos.y -= 2 * yOverlap;
      this.vel.y = -this.vel.y;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    } else if (this.vel.y < 0 && this.pos.y < this.radius) {
      collision = true;
      yOverlap = this.pos.y - this.radius
      this.pos.y -= 2 * yOverlap;
      this.vel.y = -this.vel.y;
      this.vel.x = this.vel.x * dampening;
      this.vel.y = this.vel.y * dampening;
    }
    if (collision) {
      const sound = new Audio(`../assets/wall${Math.floor(Math.random() * 4)}.mp3`);
      sound.play();
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
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
    // this.ctx.fillText(`Speed: ${Math.sqrt(Math.pow(this.vel.x,2) + Math.pow(this.vel.y,2)).toFixed(3)}`,this.pos.x - 15, this.pos.y + 10);
    // this.ctx.beginPath();

    // this.ctx.strokeStyle= 'white';
    // this.ctx.moveTo(this.pos.x,this.pos.y);
    // this.ctx.lineTo(this.pos.x + 10*this.vel.x,this.pos.y + 10*this.vel.y);
    // this.ctx.stroke();
  }


  // testing if this circle is colliding with another circle and calculating their new positions and velocities
  collide(circle) {
    let dist2 = vec2Subtraction(this.pos, circle.pos);
    let dist1 = vec2Subtraction(circle.pos,this.pos);
    let min = circle.radius + this.radius;
    if (dist1.length < circle.radius + this.radius) {
      const remainder = this.rollBackToCollision(circle);
      console.log("dist:",dist1.length,dist2.length,"min:",min);

      const sound = new Audio(`../assets/hit${Math.floor(Math.random() * 10)}.mp3`);
      sound.play();
      let normal1 = dist1.projectionOf(this.vel);
      let normal2 = dist2.projectionOf(circle.vel);
      if (this.vel.x === 0) {
        console.log('vel1',this.vel,'normal1:',normal1,'vel2',circle.vel,"normal2:",normal2,this.vel.x + normal2.x - normal1.x);
      }
      this.vel.x += normal2.x - normal1.x;
      this.vel.y += normal2.y - normal1.y;
      circle.vel.x += normal1.x - normal2.x;
      circle.vel.y += normal1.y - normal2.y;
      this.pos.x += this.vel.x * remainder;
      this.pos.y += this.vel.y * remainder;
      circle.pos.x += circle.vel.x * remainder;
      circle.pos.y += circle.vel.y * remainder;
      return true;
    }
    return false;
  }

  // calculate how much of the last frames movement for this and a colliding circle
  // to roll back so that their surfaces are touching, not overlapping
  // roll back that movement, then return the amount of time remaining in the frame
  // to move at the post-collision velocity
  rollBackToCollision(circle){
    const x1 = this.pos.x;
    const y1 = this.pos.y;
    const xv1 = this.vel.x;
    const yv1 = this.vel.y;
    const r1 = this.radius+0.00000000001;
    const x2 = circle.pos.x;
    const y2 = circle.pos.y;
    const xv2 = circle.vel.x;
    const yv2 = circle.vel.y;
    const r2 = circle.radius+0.00000000001;
    
    const a = Math.pow(yv1,2) - (2*yv1*yv2) + Math.pow(yv2,2) + Math.pow(xv1,2) - (2*xv1*xv2) + Math.pow(xv2,2);
    const b = 2*(-x2*xv1+x2*xv2+yv1*y1-yv1*y2-yv2*y1+yv2*y2+xv1*x1-xv2*x1);
    const c = Math.pow(x2,2)-(2*x1*x2)-Math.pow(r1,2)-(2*r1*r2)-Math.pow(r2,2)+Math.pow(x1,2)+Math.pow(y1,2)-(2*y1*y2)+Math.pow(y2,2);
    let root = Math.pow(b,2)-4*a*c;
    console.log(root);
    let t = ((-b - Math.sqrt(root))/(2*a));
    let t2 = ((-b + Math.sqrt(root))/(2*a));
    if (isNaN(t)) {
      console.table({x1,y1,xv1,yv1,speed1:this.vel.length,r1,x2,y2,xv2,yv2,speed2:circle.vel.length,r2,a,b,c,root,t2})
    } 
    t = -Math.abs(t<t2?t:t2);
    this.pos = new Vec2(t*this.vel.x+this.pos.x,t*this.vel.y+this.pos.y);
    circle.pos = new Vec2(t*circle.vel.x+circle.pos.x,t*circle.vel.y+circle.pos.y);
    console.log('After:',vec2Subtraction(this.pos,circle.pos).length);
    return -t;
  }

  update(circles) {
    const dampening = 0.8; // 0.8 recommended
    const friction = 0.04; // 0.07 recommended
    let speed = Math.sqrt(Math.pow(this.vel.x,2) + Math.pow(this.vel.y,2));
    if (speed !== 0){
      this.vel.x -= (friction * this.vel.x / speed);
      this.vel.y -= (friction * this.vel.y / speed);
    }
    if (speed < friction) {
      this.vel.x = 0;
      this.vel.y = 0;
    }
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
    circles.forEach((circle, index, arr) => {
      if (circle !== this) {
        this.collide(circle);
      }
    });
    this.draw();
  }
}

function randomColor() {
  return `RGB(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
}
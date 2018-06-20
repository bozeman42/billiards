export class Vec2 {
  constructor(x,y){
    this.set(x,y)
  }
  set(x,y) {
    this.x = x;
    this.y = y;
  }
  dotProd(v){
    return (this.x*v.x)+(this.y*v.y);
  }

  projectionOf(v){
    const factor = this.dotProd(v) / Math.pow(this.length,2);
    return new Vec2(this.x * factor, this.y * factor);
  }

  get length(){
    return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
  }
}

export function vec2Subtraction(v1,v2) {
  const result = new Vec2(v1.x - v2.x,v1.y - v2.y)
  return result;
}

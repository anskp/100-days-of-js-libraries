/**
 * Circle point model for noisy circle visualization
 */
export class CirclePointModel {
  /**
   * Create a circle point 
   * @param {p5} p - The p5 instance
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
  constructor(p, x, y) {
    this.pos = p.createVector(x, y);
    this.basePos = p.createVector(x, y);
    this.offset = p.random(1000);
  }

  /**
   * Update the point based on noise
   * @param {p5} p - The p5 instance
   * @param {number} noiseVal - The perlin noise value
   * @returns {p5.Vector} - The updated position
   */
  update(p, noiseVal) {
    const offset = p.map(noiseVal, 0, 1, -30, 30);
    return p5.Vector.add(
      this.basePos, 
      p5.Vector.fromAngle(p.atan2(this.basePos.y - p.height/2, this.basePos.x - p.width/2), offset)
    );
  }
} 
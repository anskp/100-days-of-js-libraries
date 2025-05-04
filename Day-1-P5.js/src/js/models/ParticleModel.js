/**
 * Particle model for p5.js visualizations
 */
export class ParticleModel {
  /**
   * Create a particle
   * @param {p5} p - The p5 instance
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
  constructor(p, x, y) {
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.color = p.color(p.random(360), 80, 90, 70);
    this.size = p.random(3, 8);
  }

  /**
   * Update particle position based on forces
   * @param {p5} p - The p5 instance
   * @param {p5.Vector} force - Force to apply to the particle
   */
  update(p, force) {
    this.acc = force.copy();
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);
    
    // Wrap around edges
    if (this.pos.x < 0) this.pos.x = p.width;
    if (this.pos.x > p.width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = p.height;
    if (this.pos.y > p.height) this.pos.y = 0;
  }

  /**
   * Draw the particle
   * @param {p5} p - The p5 instance
   */
  draw(p) {
    p.noStroke();
    p.fill(this.color);
    p.circle(this.pos.x, this.pos.y, this.size);
  }
} 
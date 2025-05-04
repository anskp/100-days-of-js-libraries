// Models for different sketch types
export class ParticleModel {
  constructor(p, x, y) {
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.color = p.color(p.random(360), 80, 90, 70);
    this.size = p.random(3, 8);
  }

  update(p, noise) {
    this.acc = noise.mult(0.1);
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);
    
    // Wrap around edges
    if (this.pos.x < 0) this.pos.x = p.width;
    if (this.pos.x > p.width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = p.height;
    if (this.pos.y > p.height) this.pos.y = 0;
  }

  draw(p) {
    p.noStroke();
    p.fill(this.color);
    p.circle(this.pos.x, this.pos.y, this.size);
  }
}

export class CirclePointModel {
  constructor(p, x, y) {
    this.pos = p.createVector(x, y);
    this.basePos = p.createVector(x, y);
    this.offset = p.random(1000);
  }

  update(p, noiseVal) {
    const offset = p.map(noiseVal, 0, 1, -30, 30);
    return p5.Vector.add(
      this.basePos, 
      p5.Vector.fromAngle(p.atan2(this.basePos.y - p.height/2, this.basePos.x - p.width/2), offset)
    );
  }
}

export class FlowFieldModel {
  constructor(p, cols, rows, resolution) {
    this.flowField = [];
    this.cols = cols;
    this.rows = rows;
    this.resolution = resolution;
    
    // Initialize flow field
    for (let i = 0; i < cols; i++) {
      this.flowField[i] = [];
      for (let j = 0; j < rows; j++) {
        this.flowField[i][j] = p.createVector(0, 0);
      }
    }
  }

  update(p, noiseScale, noiseStrength) {
    // Update flow field
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const x = i * this.resolution;
        const y = j * this.resolution;
        const angle = p.noise(x * noiseScale, y * noiseScale, p.frameCount * 0.005) * p.TWO_PI * noiseStrength;
        this.flowField[i][j] = p5.Vector.fromAngle(angle);
      }
    }
  }

  getForce(x, y) {
    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      return this.flowField[x][y].copy();
    }
    return null;
  }
}

export class SketchModel {
  constructor() {
    this.sketchTypes = ['particles', 'noisyCircle', 'flowField'];
  }

  getSketchTypes() {
    return this.sketchTypes;
  }
} 
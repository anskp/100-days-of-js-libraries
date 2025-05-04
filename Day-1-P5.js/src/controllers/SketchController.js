import { ParticleModel, CirclePointModel, FlowFieldModel } from '../models/SketchModels';

export class SketchController {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.particles = [];
    this.circlePoints = [];
    this.flowField = null;
    this.resolution = 10;
    this.noiseScale = 0.1;
    this.noiseStrength = 1;
  }

  init() {
    // Initialize particles
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push(new ParticleModel(
        this.p, 
        this.p.random(this.p.width), 
        this.p.random(this.p.height)
      ));
    }
    
    // Initialize circle points
    this.circlePoints = [];
    const totalPoints = 200;
    for (let i = 0; i < totalPoints; i++) {
      const angle = this.p.map(i, 0, totalPoints, 0, this.p.TWO_PI);
      const radius = this.p.min(this.p.width, this.p.height) * 0.3;
      const x = this.p.width/2 + this.p.cos(angle) * radius;
      const y = this.p.height/2 + this.p.sin(angle) * radius;
      this.circlePoints.push(new CirclePointModel(this.p, x, y));
    }
    
    // Initialize flow field
    const cols = this.p.floor(this.p.width / this.resolution);
    const rows = this.p.floor(this.p.height / this.resolution);
    this.flowField = new FlowFieldModel(this.p, cols, rows, this.resolution);
  }

  drawParticles() {
    this.p.background(230, 10, 90, 10);
    
    this.particles.forEach(particle => {
      // Add some random movement
      const noise = this.p.createVector(
        this.p.map(this.p.noise(particle.pos.x * 0.01, particle.pos.y * 0.01, this.p.frameCount * 0.01), 0, 1, -1, 1),
        this.p.map(this.p.noise(particle.pos.x * 0.01, particle.pos.y * 0.01, this.p.frameCount * 0.01 + 100), 0, 1, -1, 1)
      );
      
      particle.update(this.p, noise);
      particle.draw(this.p);
    });
  }

  drawNoisyCircle() {
    this.p.background(230, 10, 90, 20);
    this.p.noFill();
    
    this.p.beginShape();
    this.circlePoints.forEach(point => {
      const noiseVal = this.p.noise(
        point.basePos.x * 0.01, 
        point.basePos.y * 0.01, 
        this.p.frameCount * 0.01 + point.offset
      );
      
      const newPos = point.update(this.p, noiseVal);
      
      const hue = this.p.map(noiseVal, 0, 1, 170, 270);
      this.p.stroke(hue, 80, 90, 80);
      this.p.strokeWeight(2);
      this.p.curveVertex(newPos.x, newPos.y);
    });
    this.p.endShape(this.p.CLOSE);
  }

  drawFlowField() {
    this.p.background(230, 10, 90, 5);
    
    // Update flow field
    this.flowField.update(this.p, this.noiseScale, this.noiseStrength);
    
    // Move and draw particles
    this.particles.forEach(particle => {
      const x = this.p.floor(particle.pos.x / this.resolution);
      const y = this.p.floor(particle.pos.y / this.resolution);
      
      const force = this.flowField.getForce(x, y);
      if (force) {
        particle.acc = force.mult(0.5);
        particle.vel.add(particle.acc);
        particle.vel.limit(3);
        particle.pos.add(particle.vel);
      }
      
      // Wrap around edges
      if (particle.pos.x < 0) particle.pos.x = this.p.width;
      if (particle.pos.x > this.p.width) particle.pos.x = 0;
      if (particle.pos.y < 0) particle.pos.y = this.p.height;
      if (particle.pos.y > this.p.height) particle.pos.y = 0;
      
      // Draw particle
      particle.draw(this.p);
    });
  }

  draw(sketchType) {
    if (sketchType === "particles") {
      this.drawParticles();
    } else if (sketchType === "noisyCircle") {
      this.drawNoisyCircle();
    } else if (sketchType === "flowField") {
      this.drawFlowField();
    }
  }

  windowResized() {
    this.p.resizeCanvas(window.innerWidth - 40, 500);
    // Reinitialize with new dimensions
    this.init();
  }
} 
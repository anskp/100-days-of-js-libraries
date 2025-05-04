import { ParticleModel } from '../models/ParticleModel.js';
import { CirclePointModel } from '../models/CirclePointModel.js';
import { FlowFieldModel } from '../models/FlowFieldModel.js';

/**
 * Class for the advanced visualization view
 */
export class AdvancedSketchView {
  /**
   * Create a new advanced visualization view
   * @param {p5} p - The p5 instance
   * @param {HTMLElement} container - The container element
   */
  constructor(p, container) {
    this.p = p;
    this.container = container;
    this.sketchType = 'particles';
    this.particles = [];
    this.circlePoints = [];
    this.flowField = null;
    this.resolution = 10;
    this.noiseScale = 0.1;
    this.noiseStrength = 1;
    this.width = 800;
    this.height = 500;
  }

  /**
   * Initialize the sketch
   */
  setup() {
    // Create canvas
    const canvas = this.p.createCanvas(this.width, this.height);
    canvas.parent(this.container);
    this.p.colorMode(this.p.HSB, 360, 100, 100, 100);
    this.p.background(230, 10, 90);
    
    // Initialize particles
    this.initParticles();
    
    // Initialize circle points
    this.initCirclePoints();
    
    // Initialize flow field
    this.initFlowField();
  }

  /**
   * Initialize particles
   */
  initParticles() {
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push(new ParticleModel(
        this.p, 
        this.p.random(this.p.width), 
        this.p.random(this.p.height)
      ));
    }
  }

  /**
   * Initialize circle points
   */
  initCirclePoints() {
    this.circlePoints = [];
    const totalPoints = 200;
    for (let i = 0; i < totalPoints; i++) {
      const angle = this.p.map(i, 0, totalPoints, 0, this.p.TWO_PI);
      const radius = this.p.min(this.p.width, this.p.height) * 0.3;
      const x = this.p.width/2 + this.p.cos(angle) * radius;
      const y = this.p.height/2 + this.p.sin(angle) * radius;
      this.circlePoints.push(new CirclePointModel(this.p, x, y));
    }
  }

  /**
   * Initialize flow field
   */
  initFlowField() {
    const cols = this.p.floor(this.p.width / this.resolution);
    const rows = this.p.floor(this.p.height / this.resolution);
    this.flowField = new FlowFieldModel(this.p, cols, rows, this.resolution);
  }

  /**
   * Draw the appropriate visualization based on sketchType
   */
  draw() {
    if (this.sketchType === "particles") {
      this.drawParticles();
    } else if (this.sketchType === "noisyCircle") {
      this.drawNoisyCircle();
    } else if (this.sketchType === "flowField") {
      this.drawFlowField();
    }
  }

  /**
   * Draw particles visualization
   */
  drawParticles() {
    this.p.background(230, 10, 90, 10);
    
    this.particles.forEach(particle => {
      // Add some random movement using perlin noise
      const noise = this.p.createVector(
        this.p.map(this.p.noise(particle.pos.x * 0.01, particle.pos.y * 0.01, this.p.frameCount * 0.01), 0, 1, -1, 1),
        this.p.map(this.p.noise(particle.pos.x * 0.01, particle.pos.y * 0.01, this.p.frameCount * 0.01 + 100), 0, 1, -1, 1)
      );
      
      particle.update(this.p, noise);
      particle.draw(this.p);
    });
  }

  /**
   * Draw noisy circle visualization
   */
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

  /**
   * Draw flow field visualization
   */
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
        force.mult(0.5); // Scale the force
        particle.update(this.p, force);
      }
      
      particle.draw(this.p);
    });
  }

  /**
   * Switch to a different visualization type
   * @param {string} type - The visualization type to switch to
   */
  setSketchType(type) {
    this.sketchType = type;
  }

  /**
   * Handle window resize
   */
  windowResized() {
    // Update canvas size if needed
    // this.p.resizeCanvas(this.p.windowWidth - 40, 500);
    // Reinitialize with new dimensions
    this.initParticles();
    this.initCirclePoints();
    this.initFlowField();
  }
} 
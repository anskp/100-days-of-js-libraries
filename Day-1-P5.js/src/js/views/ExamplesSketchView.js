/**
 * Class for the examples visualizations
 */
export class ExamplesSketchView {
  /**
   * Create a new examples view
   * @param {p5} p - The p5 instance
   * @param {HTMLElement} container - The container element
   */
  constructor(p, container) {
    this.p = p;
    this.container = container;
    this.sketchType = 'bouncingBall';
    this.width = 600;
    this.height = 400;
    
    // Bouncing ball properties
    this.x = 50;
    this.y = 50;
    this.speedX = 2;
    this.speedY = 3;
    
    // Circular motion properties
    this.angle = 0;
    this.radius = 100;
    this.speed = 0.02;
  }

  /**
   * Initialize the sketch
   */
  setup() {
    const canvas = this.p.createCanvas(this.width, this.height);
    canvas.parent(this.container);
    this.p.background(220);
    this.p.colorMode(this.p.RGB);
  }

  /**
   * Draw the appropriate example based on sketchType
   */
  draw() {
    if (this.sketchType === "bouncingBall") {
      this.drawBouncingBall();
    } else if (this.sketchType === "coloredRectangles") {
      this.drawColoredRectangles();
    } else if (this.sketchType === "circularMotion") {
      this.drawCircularMotion();
    }
  }

  /**
   * Draw the bouncing ball example
   * Based on Context7 example from p5.js library
   */
  drawBouncingBall() {
    this.p.background(220);
    this.p.ellipse(this.x, this.y, 80, 80);
    
    // Update position
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Check boundaries and reverse direction
    if (this.x > this.p.width - 40 || this.x < 40) {
      this.speedX = -this.speedX;
    }
    if (this.y > this.p.height - 40 || this.y < 40) {
      this.speedY = -this.speedY;
    }
  }

  /**
   * Draw the colored rectangles example
   * Based on Context7 example from p5.js library
   */
  drawColoredRectangles() {
    this.p.background(220);
    
    // Yellow rectangle
    const c = this.p.color(255, 204, 0);
    this.p.fill(c);
    this.p.rect(15, 20, 170, 200);
    
    // Red rectangle - use the red value from the yellow
    const redValue = this.p.red(c);
    this.p.fill(redValue, 0, 0);
    this.p.rect(205, 20, 170, 200);
    
    // Add text labels
    this.p.fill(0);
    this.p.textSize(16);
    this.p.text("Original Color (RGB: 255,204,0)", 15, 240);
    this.p.text("Red Component Only (RGB: 255,0,0)", 205, 240);
  }

  /**
   * Draw the circular motion example
   * Inspired by p5.js trigonometry examples
   */
  drawCircularMotion() {
    this.p.background(220, 20);
    this.p.translate(this.p.width / 2, this.p.height / 2);
    
    // Draw orbit path
    this.p.noFill();
    this.p.stroke(200);
    this.p.ellipse(0, 0, this.radius * 2);
    
    // Multiple orbiting elements
    for (let i = 0; i < 5; i++) {
      const offsetAngle = this.angle + (i * this.p.TWO_PI / 5);
      const x = this.p.cos(offsetAngle) * this.radius;
      const y = this.p.sin(offsetAngle) * this.radius;
      
      // Vary the size and color based on position
      const size = this.p.map(this.p.sin(offsetAngle * 2), -1, 1, 10, 30);
      const hue = this.p.map(i, 0, 5, 0, 255);
      
      this.p.fill(hue, 150, 200);
      this.p.noStroke();
      this.p.ellipse(x, y, size);
      
      // Draw line to center
      this.p.stroke(hue, 150, 200, 100);
      this.p.line(0, 0, x, y);
    }
    
    // Update angle for rotation
    this.angle += this.speed;
  }

  /**
   * Switch to a different example type
   * @param {string} type - The example type to switch to
   */
  setSketchType(type) {
    this.sketchType = type;
    this.p.background(220);
  }
  
  /**
   * Handle window resize
   */
  windowResized() {
    // Optionally resize canvas
    // this.p.resizeCanvas(this.p.windowWidth - 40, 400);
  }
} 
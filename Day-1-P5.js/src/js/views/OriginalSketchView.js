/**
 * Class for the original p5.js sketch
 */
export class OriginalSketchView {
  /**
   * Create a new original sketch view
   * @param {p5} p - The p5 instance
   * @param {HTMLElement} container - The container element
   */
  constructor(p, container) {
    this.p = p;
    this.container = container;
    this.width = 600;
    this.height = 400;
  }

  /**
   * Initialize the sketch
   */
  setup() {
    const canvas = this.p.createCanvas(this.width, this.height);
    canvas.parent(this.container);
    this.p.background(51);
  }

  /**
   * Draw the sketch
   */
  draw() {
    this.p.fill(255, 0, 200, 25);
    this.p.noStroke();
    this.p.ellipse(this.p.mouseX, this.p.mouseY, 48, 48);
  }

  /**
   * Handle window resize
   */
  windowResized() {
    // Optionally resize canvas
    // this.p.resizeCanvas(this.p.windowWidth - 40, 400);
  }
} 
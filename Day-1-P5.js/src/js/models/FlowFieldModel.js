/**
 * Flow field model for flow field visualization
 */
export class FlowFieldModel {
  /**
   * Create a flow field
   * @param {p5} p - The p5 instance
   * @param {number} cols - Number of columns in the flow field grid
   * @param {number} rows - Number of rows in the flow field grid
   * @param {number} resolution - Cell size of the flow field grid
   */
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

  /**
   * Update the flow field with noise values
   * @param {p5} p - The p5 instance
   * @param {number} noiseScale - Scale factor for perlin noise
   * @param {number} noiseStrength - Strength factor for perlin noise
   */
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

  /**
   * Get the force vector at a specific cell
   * @param {number} x - The x index of the cell
   * @param {number} y - The y index of the cell
   * @returns {p5.Vector|null} - The force vector or null if out of bounds
   */
  getForce(x, y) {
    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
      return this.flowField[x][y].copy();
    }
    return null;
  }
} 
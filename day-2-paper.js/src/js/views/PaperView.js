/**
 * PaperView - Handles rendering of the paper.js canvas
 */
import Paper from 'paper';
import CanvasUI from './CanvasUI';

class PaperView {
  constructor(model, canvas) {
    this.model = model;
    this.canvas = canvas;
    
    // Initialize Paper.js with the canvas
    Paper.setup(canvas);
    
    // Create UI
    this.ui = new CanvasUI(model, this);
    
    // Register as observer of the model
    this.model.addObserver(this);
  }
  
  // Create Paper.js items from model shapes
  createItem(shape) {
    let item;
    
    switch(shape.type) {
      case 'circle':
        item = new Paper.Path.Circle({
          center: [shape.x, shape.y],
          radius: shape.radius,
          fillColor: shape.color
        });
        break;
      case 'rectangle':
        item = new Paper.Path.Rectangle({
          point: [shape.x, shape.y],
          size: [shape.width, shape.height],
          fillColor: shape.color
        });
        break;
      default:
        console.warn('Unknown shape type:', shape.type);
        return null;
    }
    
    return item;
  }
  
  // Update the view based on the model state
  update(model) {
    // Refresh canvas if needed
    Paper.view.draw();
  }
  
  // Refresh the entire view
  updateView() {
    Paper.view.draw();
  }
}

export default PaperView; 
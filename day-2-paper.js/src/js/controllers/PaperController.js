/**
 * PaperController - Handles user interactions and events
 */
import Paper from 'paper';
import DemosManager from '../models/DemosManager';

class PaperController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    
    // Create tools
    this.selectTool = new Paper.Tool();
    this.circleTool = new Paper.Tool();
    this.rectangleTool = new Paper.Tool();
    this.freedrawTool = new Paper.Tool();
    this.resizeTool = new Paper.Tool();
    
    // Initialize demos manager
    this.demos = new DemosManager(model, view, this);
    
    // Setup tool event handlers
    this.setupTools();
    
    // Setup keyboard events
    this.setupKeyboardEvents();
    
    // Set initial tool
    this.setTool('select');
  }
  
  // Setup event handlers for each tool
  setupTools() {
    // Select tool
    this.selectTool.onMouseDown = (event) => {
      // Skip if clicking on UI elements
      if (this.isClickOnUILayer(event.point)) {
        return;
      }
      
      // Get the hit item at the mouse position
      const hitResult = Paper.project.hitTest(event.point, {
        fill: true,
        stroke: true,
        tolerance: 5
      });
      
      if (hitResult && hitResult.item) {
        // Select the item
        this.model.selectItem(hitResult.item);
        this.dragItem = hitResult.item;
        this.dragStart = event.point;
        this.itemStartPosition = this.dragItem.position.clone();
      } else {
        // Clear selection if clicking on empty space
        this.model.clearSelection();
      }
      
      this.view.updateView();
    };
    
    this.selectTool.onMouseDrag = (event) => {
      if (this.dragItem) {
        // Move the item
        const delta = event.point.subtract(this.dragStart);
        this.dragItem.position = this.itemStartPosition.add(delta);
        this.view.updateView();
      }
    };
    
    this.selectTool.onMouseUp = (event) => {
      // Clean up drag state
      this.dragItem = null;
      this.dragStart = null;
      this.itemStartPosition = null;
    };
    
    // Circle tool
    this.circleTool.onMouseDown = (event) => {
      // Skip if clicking on UI elements
      if (this.isClickOnUILayer(event.point)) {
        return;
      }
      
      this.startPoint = event.point;
    };
    
    this.circleTool.onMouseDrag = (event) => {
      // Remove previous preview if it exists
      if (this.previewItem) {
        this.previewItem.remove();
      }
      
      // Calculate radius based on drag distance
      const radius = this.startPoint.getDistance(event.point);
      
      // Create preview circle
      this.previewItem = new Paper.Path.Circle({
        center: this.startPoint,
        radius: radius,
        fillColor: this.model.getColor(),
        strokeColor: '#000',
        strokeWidth: 1
      });
    };
    
    this.circleTool.onMouseUp = (event) => {
      // Convert preview to final shape
      if (this.previewItem) {
        // Replace with final shape
        const finalCircle = new Paper.Path.Circle({
          center: this.previewItem.position,
          radius: this.previewItem.bounds.width / 2,
          fillColor: this.model.getColor(),
          strokeColor: '#000',
          strokeWidth: 1
        });
        
        // Clean up preview
        this.previewItem.remove();
        this.previewItem = null;
        
        // Add to model
        this.model.addItem(finalCircle);
      }
    };
    
    // Rectangle tool
    this.rectangleTool.onMouseDown = (event) => {
      // Skip if clicking on UI elements
      if (this.isClickOnUILayer(event.point)) {
        return;
      }
      
      this.startPoint = event.point;
    };
    
    this.rectangleTool.onMouseDrag = (event) => {
      // Remove previous preview if it exists
      if (this.previewItem) {
        this.previewItem.remove();
      }
      
      // Create preview rectangle
      this.previewItem = new Paper.Path.Rectangle({
        from: this.startPoint,
        to: event.point,
        fillColor: this.model.getColor(),
        strokeColor: '#000',
        strokeWidth: 1
      });
    };
    
    this.rectangleTool.onMouseUp = (event) => {
      // Convert preview to final shape
      if (this.previewItem) {
        // Replace with final shape
        const finalRect = new Paper.Path.Rectangle({
          from: this.previewItem.bounds.topLeft,
          to: this.previewItem.bounds.bottomRight,
          fillColor: this.model.getColor(),
          strokeColor: '#000',
          strokeWidth: 1
        });
        
        // Clean up preview
        this.previewItem.remove();
        this.previewItem = null;
        
        // Add to model
        this.model.addItem(finalRect);
      }
    };
    
    // Free draw tool
    this.freedrawTool.minDistance = 2;
    this.freedrawTool.maxDistance = 30;
    
    this.freedrawTool.onMouseDown = (event) => {
      // Skip if clicking on UI elements
      if (this.isClickOnUILayer(event.point)) {
        return;
      }
      
      // Create a new path
      this.path = new Paper.Path({
        segments: [event.point],
        strokeColor: this.model.getColor(),
        strokeWidth: 3,
        strokeCap: 'round',
        strokeJoin: 'round'
      });
      
      // Add the path to the project to make it visible immediately
      Paper.project.activeLayer.addChild(this.path);
    };
    
    this.freedrawTool.onMouseDrag = (event) => {
      // Add a point to the path
      if (this.path) {
        this.path.add(event.point);
      }
    };
    
    this.freedrawTool.onMouseUp = (event) => {
      // Simplify the path and add to model
      if (this.path) {
        this.path.simplify(10);
        this.model.addItem(this.path);
        this.path = null;
      }
    };
    
    // Resize tool
    this.resizeTool.onMouseDown = (event) => {
      // Skip if clicking on UI elements
      if (this.isClickOnUILayer(event.point)) {
        return;
      }
      
      // Get the hit item at the mouse position
      const hitResult = Paper.project.hitTest(event.point, {
        fill: true,
        stroke: true,
        tolerance: 5
      });
      
      if (hitResult && hitResult.item) {
        // Select the item and store initial state
        this.model.selectItem(hitResult.item);
        this.resizeItem = hitResult.item;
        this.initialSize = {
          width: this.resizeItem.bounds.width,
          height: this.resizeItem.bounds.height
        };
        this.initialPoint = event.point;
        
        // Store the original bounds for reference
        this.originalBounds = this.resizeItem.bounds.clone();
        
        this.view.updateView();
      }
    };
    
    this.resizeTool.onMouseDrag = (event) => {
      if (this.resizeItem) {
        // Calculate the distance moved
        const dragVector = event.point.subtract(this.initialPoint);
        
        // Calculate new size based on drag distance
        const scaleFactor = 1 + (dragVector.length / 200);
        
        // Reset to original bounds first to prevent cumulative scaling
        this.resizeItem.bounds = this.originalBounds.clone();
        
        // Now apply the scale from the center
        this.resizeItem.scale(scaleFactor, this.resizeItem.bounds.center);
        
        this.view.updateView();
      }
    };
    
    this.resizeTool.onMouseUp = (event) => {
      // Clean up resize state
      this.resizeItem = null;
      this.initialSize = null;
      this.initialPoint = null;
      this.originalBounds = null;
    };
  }
  
  // Setup keyboard event handlers
  setupKeyboardEvents() {
    // Use keydown event for keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Skip if in input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        // Tool shortcuts
        case 's':
          this.setTool('select');
          break;
        case 'c':
          this.setTool('circle');
          break;
        case 'r':
          this.setTool('rectangle');
          break;
        case 'f':
          this.setTool('freedraw');
          break;
        case 'z':
          this.setTool('resize');
          break;
        
        // Demo shortcuts
        case '1':
          this.startDemo('bezier');
          break;
        case '2':
          this.startDemo('morphing');
          break;
        case '3':
          this.startDemo('particles');
          break;
          
        // View navigation
        case 'h':
          this.view.ui.showView('help');
          break;
        case 'escape':
          // Exit demo mode and return to select tool
          this.stopDemo();
          this.setTool('select');
          this.view.ui.showView('main');
          break;
        
        // Delete selected item
        case 'delete':
        case 'backspace':
          if (this.model.selectedItem) {
            this.model.removeItem(this.model.selectedItem);
          }
          break;
      }
    });
  }
  
  // Set the active tool
  setTool(toolName) {
    // Stop any active demo
    this.demos.stopCurrentDemo();
    
    // Update model
    this.model.setTool(toolName);
    
    // Activate the appropriate tool
    switch(toolName) {
      case 'select':
        this.selectTool.activate();
        break;
      case 'circle':
        this.circleTool.activate();
        break;
      case 'rectangle':
        this.rectangleTool.activate();
        break;
      case 'freedraw':
        this.freedrawTool.activate();
        break;
      case 'resize':
        this.resizeTool.activate();
        break;
      default:
        // Default to select tool
        this.selectTool.activate();
        break;
    }
    
    // Update view
    this.view.updateView();
  }
  
  // Set the active color
  setColor(colorName) {
    this.model.setColor(colorName);
    this.view.updateView();
  }
  
  // Start a specific demo
  startDemo(demoName) {
    // Clear any selection
    this.model.clearSelection();
    
    // Start the demo
    this.demos.startDemo(demoName);
    
    // Update view
    this.view.updateView();
  }
  
  // Check if a point is on the UI layer
  isClickOnUILayer(point) {
    const hitResult = this.view.ui.uiLayer.hitTest(point, {
      fill: true,
      stroke: true,
      tolerance: 5
    });
    
    return !!hitResult;
  }
}

export default PaperController; 
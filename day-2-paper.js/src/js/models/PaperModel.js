/**
 * PaperModel - Manages the state of the drawing application
 */
import Paper from 'paper';

class PaperModel {
  constructor() {
    // Current tool state
    this.currentTool = 'select';
    
    // Current color
    this.currentColor = 'blue';
    
    // Color mapping
    this.colors = {
      'blue': '#2196F3',
      'red': '#F44336',
      'green': '#4CAF50',
      'yellow': '#FFEB3B',
      'purple': '#9C27B0',
      'orange': '#FF9800'
    };
    
    // Items in the drawing
    this.items = [];
    
    // Currently selected item
    this.selectedItem = null;
    
    // Current demo mode
    this.currentDemo = null;
    
    // Observers for view updates
    this.observers = [];
  }
  
  // Register observers for model changes
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  // Notify all observers of model changes
  notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
  
  // Set the active tool
  setTool(toolName) {
    this.currentTool = toolName;
    this.notifyObservers();
  }
  
  // Set the active color
  setColor(colorName) {
    // Check if it's a hex color string
    if (typeof colorName === 'string' && colorName.startsWith('#')) {
      this.currentColor = colorName; // Store the hex string directly
    } else if (this.colors[colorName]) {
      this.currentColor = colorName; // Store the color name
    }
    
    this.notifyObservers();
  }
  
  // Get the active color as an actual color value
  getColor() {
    // If it's already a hex string, use it directly
    if (typeof this.currentColor === 'string' && this.currentColor.startsWith('#')) {
      return this.currentColor;
    }
    
    // Otherwise, look up in the predefined colors
    return this.colors[this.currentColor] || '#000000';
  }
  
  // Add an item to the drawing
  addItem(item) {
    this.items.push(item);
    this.notifyObservers();
    return item;
  }
  
  // Remove an item from the drawing
  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items.splice(index, 1);
      item.remove();
      
      // Clear selection if the removed item was selected
      if (this.selectedItem === item) {
        this.selectedItem = null;
      }
      
      this.notifyObservers();
    }
  }
  
  // Select an item
  selectItem(item) {
    // Clear previous selection
    if (this.selectedItem) {
      this.selectedItem.shadowColor = null;
      this.selectedItem.shadowBlur = 0;
      this.selectedItem.shadowOffset = null;
    }
    
    // Set new selection
    this.selectedItem = item;
    
    // Highlight selected item
    if (item) {
      item.shadowColor = '#2196F3';
      item.shadowBlur = 10;
      item.shadowOffset = new Paper.Point(5, 5);
    }
    
    this.notifyObservers();
  }
  
  // Clear selection
  clearSelection() {
    if (this.selectedItem) {
      this.selectedItem.shadowColor = null;
      this.selectedItem.shadowBlur = 0;
      this.selectedItem.shadowOffset = null;
      this.selectedItem = null;
      this.notifyObservers();
    }
  }
  
  // Set the current demo mode
  setDemo(demoName) {
    this.currentDemo = demoName;
    this.notifyObservers();
  }
}

export default PaperModel; 
/**
 * CanvasUI - Manages UI elements directly on Paper.js canvas
 */
import Paper from 'paper';

class CanvasUI {
  constructor(model, controller) {
    this.model = model;
    this.controller = controller;
    this.uiLayer = new Paper.Layer();
    this.uiLayer.name = 'UI Layer';
    
    this.contentLayer = Paper.project.getActiveLayer();
    this.contentLayer.name = 'Content Layer';
    
    // UI elements
    this.buttons = [];
    this.panels = {};
    this.colorPickers = [];
    
    // Current view/screen
    this.currentView = 'main';
    
    // Constants for UI layout
    this.PANEL_WIDTH = 200;
    this.BUTTON_SIZE = 40;
    this.BUTTON_MARGIN = 10;
    this.PANEL_MARGIN = 15;
    
    // Create UI elements
    this.createUI();
    
    // Handle window resize
    Paper.view.onResize = () => {
      this.layoutUI();
    };
  }
  
  // Create all UI elements
  createUI() {
    this.uiLayer.activate();
    
    // Create sidebar panel background
    this.panels.sidebar = new Paper.Path.Rectangle({
      point: [Paper.view.size.width - this.PANEL_WIDTH, 0],
      size: [this.PANEL_WIDTH, Paper.view.size.height],
      fillColor: '#f0f0f0',
      shadowColor: new Paper.Color(0, 0, 0, 0.1),
      shadowBlur: 10,
      shadowOffset: new Paper.Point(-3, 0)
    });
    
    // Create title for sidebar
    this.panels.sidebarTitle = new Paper.PointText({
      point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, 30],
      content: 'Tool Panel',
      fillColor: '#444',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 16
    });
    
    // Create tool buttons
    this.createToolButtons();
    
    // Create color picker
    this.createColorPicker();
    
    // Create demo selection section
    this.createDemoSection();
    
    // Create view navigation buttons
    this.createViewButtons();
    
    // Set default active tool button
    this.highlightActiveButton();
    
    // Return to the content layer for drawing
    this.contentLayer.activate();
  }
  
  // Create tool buttons for select, circle, and rectangle
  createToolButtons() {
    const tools = [
      { id: 'select', icon: 'pointer', label: 'Select' },
      { id: 'circle', icon: 'circle', label: 'Circle' },
      { id: 'rectangle', icon: 'rectangle', label: 'Rectangle' }
    ];
    
    const startY = 60;
    
    tools.forEach((tool, index) => {
      const y = startY + index * (this.BUTTON_SIZE + this.BUTTON_MARGIN);
      
      // Button background
      const buttonBg = new Paper.Path.Rectangle({
        point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, y],
        size: [this.PANEL_WIDTH - this.PANEL_MARGIN * 2, this.BUTTON_SIZE],
        radius: 5,
        fillColor: '#fff',
        strokeColor: '#ddd',
        strokeWidth: 1
      });
      
      // Button label
      const buttonLabel = new Paper.PointText({
        point: [buttonBg.bounds.left + 15, buttonBg.bounds.center.y + 5],
        content: tool.label,
        fillColor: '#333',
        fontFamily: 'Arial',
        fontSize: 14
      });
      
      // Create group for the button
      const button = new Paper.Group([buttonBg, buttonLabel]);
      button.data = {
        id: tool.id,
        type: 'tool'
      };
      
      // Add click handler
      button.onClick = (event) => {
        this.handleButtonClick(button);
      };
      
      this.buttons.push(button);
    });
  }
  
  // Create color picker with color swatches
  createColorPicker() {
    const colors = [
      { id: 'blue', color: '#2196F3' },
      { id: 'red', color: '#F44336' },
      { id: 'green', color: '#4CAF50' },
      { id: 'yellow', color: '#FFEB3B' },
      { id: 'purple', color: '#9C27B0' },
      { id: 'orange', color: '#FF9800' }
    ];
    
    // Color section title
    const colorTitle = new Paper.PointText({
      point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, 200],
      content: 'Colors',
      fillColor: '#444',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 16
    });
    
    const colorSize = 30;
    const colorMargin = 10;
    const colorsPerRow = 3;
    
    colors.forEach((colorObj, index) => {
      const row = Math.floor(index / colorsPerRow);
      const col = index % colorsPerRow;
      
      const colorSwatch = new Paper.Path.Circle({
        center: [
          Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN + (colorSize / 2) + col * (colorSize + colorMargin), 
          230 + row * (colorSize + colorMargin)
        ],
        radius: colorSize / 2,
        fillColor: colorObj.color,
        strokeColor: '#ccc',
        strokeWidth: 1
      });
      
      // Set data for the color swatch
      colorSwatch.data = {
        id: colorObj.id,
        type: 'color'
      };
      
      // Add click handler
      colorSwatch.onClick = (event) => {
        this.handleButtonClick(colorSwatch);
      };
      
      this.colorPickers.push(colorSwatch);
    });
  }
  
  // Create demo section with buttons for the different demos
  createDemoSection() {
    // Demo section title
    const demoTitle = new Paper.PointText({
      point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, 310],
      content: 'Interactive Demos',
      fillColor: '#444',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 16
    });
    
    const demos = [
      { id: 'bezier', label: 'Bezier Designer', color: '#FF9800' },
      { id: 'morphing', label: 'Shape Morphing', color: '#E91E63' },
      { id: 'particles', label: 'Particle System', color: '#4CAF50' }
    ];
    
    const startY = 340;
    
    demos.forEach((demo, index) => {
      const y = startY + index * (this.BUTTON_SIZE + this.BUTTON_MARGIN);
      
      // Demo button with special styling
      const buttonBg = new Paper.Path.Rectangle({
        point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, y],
        size: [this.PANEL_WIDTH - this.PANEL_MARGIN * 2, this.BUTTON_SIZE],
        radius: 5,
        fillColor: demo.color,
        strokeColor: '#ccc',
        strokeWidth: 1
      });
      
      // Button label
      const buttonLabel = new Paper.PointText({
        point: [buttonBg.bounds.left + 15, buttonBg.bounds.center.y + 5],
        content: demo.label,
        fillColor: '#fff',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 14
      });
      
      // Create group for the button
      const button = new Paper.Group([buttonBg, buttonLabel]);
      button.data = {
        id: demo.id,
        type: 'demo'
      };
      
      // Add click handler
      button.onClick = (event) => {
        this.handleButtonClick(button);
      };
      
      this.buttons.push(button);
    });
  }
  
  // Create view navigation buttons
  createViewButtons() {
    const views = [
      { id: 'main', label: 'Main View' },
      { id: 'preview', label: 'Preview' },
      { id: 'help', label: 'Help' }
    ];
    
    // Create view section title
    const navTitle = new Paper.PointText({
      point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, 460],
      content: 'Navigation',
      fillColor: '#444',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 16
    });
    
    views.forEach((view, index) => {
      const y = 490 + index * (this.BUTTON_SIZE + this.BUTTON_MARGIN);
      
      // Button background
      const buttonBg = new Paper.Path.Rectangle({
        point: [Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN, y],
        size: [this.PANEL_WIDTH - this.PANEL_MARGIN * 2, this.BUTTON_SIZE],
        radius: 5,
        fillColor: view.id === this.currentView ? '#e6e6e6' : '#fff',
        strokeColor: '#ddd',
        strokeWidth: 1
      });
      
      // Button label
      const buttonLabel = new Paper.PointText({
        point: [buttonBg.bounds.left + 15, buttonBg.bounds.center.y + 5],
        content: view.label,
        fillColor: '#333',
        fontFamily: 'Arial',
        fontSize: 14
      });
      
      // Create group for the button
      const button = new Paper.Group([buttonBg, buttonLabel]);
      button.data = {
        id: view.id,
        type: 'view'
      };
      
      // Add click handler
      button.onClick = (event) => {
        this.handleButtonClick(button);
      };
      
      this.buttons.push(button);
    });
    
    // Create help text panel (initially hidden)
    this.createHelpPanel();
  }
  
  // Create help panel with keyboard shortcuts
  createHelpPanel() {
    this.panels.helpPanel = new Paper.Group();
    
    // Help panel background
    const helpBg = new Paper.Path.Rectangle({
      point: [Paper.view.size.width / 2 - 200, Paper.view.size.height / 2 - 150],
      size: [400, 300],
      radius: 10,
      fillColor: '#fff',
      strokeColor: '#ddd',
      strokeWidth: 2
    });
    
    // Help panel title
    const helpTitle = new Paper.PointText({
      point: [Paper.view.size.width / 2, Paper.view.size.height / 2 - 120],
      content: 'Keyboard Shortcuts',
      fillColor: '#444',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 18,
      justification: 'center'
    });
    
    // Help panel content
    const shortcuts = [
      'S - Select Tool',
      'C - Circle Tool',
      'R - Rectangle Tool',
      'DELETE - Remove Selected',
      'ESC - Exit Current Mode',
      '1 - Bezier Designer Demo',
      '2 - Shape Morphing Demo',
      '3 - Particle System Demo'
    ];
    
    const shortcutTexts = shortcuts.map((shortcut, index) => {
      return new Paper.PointText({
        point: [Paper.view.size.width / 2 - 150, Paper.view.size.height / 2 - 70 + index * 30],
        content: shortcut,
        fillColor: '#333',
        fontFamily: 'Arial',
        fontSize: 14
      });
    });
    
    // Close button
    const closeButton = new Paper.Path.Circle({
      center: [Paper.view.size.width / 2 + 180, Paper.view.size.height / 2 - 130],
      radius: 15,
      fillColor: '#f0f0f0',
      strokeColor: '#ddd',
      strokeWidth: 1
    });
    
    const closeCross1 = new Paper.Path.Line({
      from: [closeButton.position.x - 5, closeButton.position.y - 5],
      to: [closeButton.position.x + 5, closeButton.position.y + 5],
      strokeColor: '#888',
      strokeWidth: 2
    });
    
    const closeCross2 = new Paper.Path.Line({
      from: [closeButton.position.x + 5, closeButton.position.y - 5],
      to: [closeButton.position.x - 5, closeButton.position.y + 5],
      strokeColor: '#888',
      strokeWidth: 2
    });
    
    const closeButtonGroup = new Paper.Group([closeButton, closeCross1, closeCross2]);
    closeButtonGroup.data = {
      id: 'closeHelp',
      type: 'action'
    };
    
    closeButtonGroup.onClick = (event) => {
      this.showView('main');
    };
    
    // Add all elements to the help panel group
    this.panels.helpPanel.addChild(helpBg);
    this.panels.helpPanel.addChild(helpTitle);
    shortcutTexts.forEach(text => this.panels.helpPanel.addChild(text));
    this.panels.helpPanel.addChild(closeButtonGroup);
    
    // Initially hide the help panel
    this.panels.helpPanel.visible = false;
  }
  
  // Layout UI elements based on current canvas size
  layoutUI() {
    // Adjust sidebar position and size
    this.panels.sidebar.bounds.right = Paper.view.size.width;
    this.panels.sidebar.bounds.height = Paper.view.size.height;
    
    // Adjust sidebar title position
    this.panels.sidebarTitle.position.x = Paper.view.size.width - this.PANEL_WIDTH + this.PANEL_MARGIN;
    
    // Adjust tool buttons
    this.buttons.forEach(button => {
      if (button.data && button.data.type === 'tool') {
        // Find position in array to calculate Y position
        const index = this.buttons.findIndex(b => b.data.id === button.data.id && b.data.type === 'tool');
        if (index !== -1) {
          const y = 60 + index * (this.BUTTON_SIZE + this.BUTTON_MARGIN);
          button.position.x = Paper.view.size.width - this.PANEL_WIDTH / 2;
          button.position.y = y + this.BUTTON_SIZE / 2;
        }
      }
    });
    
    // Adjust help panel position
    if (this.panels.helpPanel) {
      this.panels.helpPanel.position = new Paper.Point(
        Paper.view.size.width / 2,
        Paper.view.size.height / 2
      );
    }
  }
  
  // Handle button clicks
  handleButtonClick(button) {
    if (!button.data) return;
    
    if (button.data.type === 'tool') {
      this.controller.setTool(button.data.id);
      this.highlightActiveButton();
    }
    else if (button.data.type === 'color') {
      this.controller.setColor(button.data.id);
      this.highlightActiveColor();
    }
    else if (button.data.type === 'view') {
      this.showView(button.data.id);
    }
    else if (button.data.type === 'demo') {
      this.controller.startDemo(button.data.id);
      this.highlightActiveDemo(button.data.id);
    }
  }
  
  // Highlight the active tool button
  highlightActiveButton() {
    this.buttons.forEach(button => {
      if (button.data && button.data.type === 'tool') {
        // Get the background rectangle (first child)
        const bg = button.children[0];
        
        // Update the fill color based on whether it's the active tool
        if (button.data.id === this.model.currentTool) {
          bg.fillColor = '#e4e4e4';
        } else {
          bg.fillColor = '#ffffff';
        }
      }
    });
  }
  
  // Highlight the active color
  highlightActiveColor() {
    this.colorPickers.forEach(swatch => {
      // Update the stroke based on whether it's the active color
      if (swatch.data.id === this.model.currentColor) {
        swatch.strokeColor = '#000';
        swatch.strokeWidth = 2;
      } else {
        swatch.strokeColor = '#ccc';
        swatch.strokeWidth = 1;
      }
    });
  }
  
  // Highlight the active demo button
  highlightActiveDemo(demoId) {
    this.buttons.forEach(button => {
      if (button.data && button.data.type === 'demo') {
        // Get the background rectangle (first child)
        const bg = button.children[0];
        
        // Slightly dim non-active demo buttons
        if (button.data.id === demoId) {
          bg.opacity = 1;
          button.children[1].opacity = 1;
        } else {
          bg.opacity = 0.6;
          button.children[1].opacity = 0.8;
        }
      }
    });
  }
  
  // Show a specific view/screen
  showView(viewId) {
    this.currentView = viewId;
    
    // Update view buttons
    this.buttons.forEach(button => {
      if (button.data && button.data.type === 'view') {
        // Get the background rectangle (first child)
        const bg = button.children[0];
        
        // Update the fill color based on whether it's the active view
        if (button.data.id === viewId) {
          bg.fillColor = '#e4e4e4';
        } else {
          bg.fillColor = '#ffffff';
        }
      }
    });
    
    // Show/hide specific panels based on the view
    if (viewId === 'help') {
      this.panels.helpPanel.visible = true;
    } else {
      this.panels.helpPanel.visible = false;
    }
    
    // Show/hide the content layer based on the view
    if (viewId === 'preview') {
      // In preview mode, we might apply different styling or filters
      this.contentLayer.opacity = 0.8;
    } else {
      this.contentLayer.opacity = 1;
    }
  }
  
  // Update the UI based on model changes
  update(model) {
    this.highlightActiveButton();
    this.highlightActiveColor();
  }

  createDemoButtons() {
    const buttonWidth = 150;
    const buttonHeight = 40;
    const startX = this.BUTTON_MARGIN;
    const startY = 120;
    const padding = 10;
    
    // Bezier Curve Designer
    this.buttons.push(this.createButton({
      x: startX,
      y: startY,
      width: buttonWidth,
      height: buttonHeight,
      text: 'Bezier Designer',
      fillColor: '#FF9800',
      textColor: '#fff',
      callback: () => this.controller.handleDemoButtonClick('bezier')
    }));
    
    // Shape Morphing
    this.buttons.push(this.createButton({
      x: startX,
      y: startY + buttonHeight + padding,
      width: buttonWidth,
      height: buttonHeight,
      text: 'Shape Morphing',
      fillColor: '#E91E63',
      textColor: '#fff',
      callback: () => this.controller.handleDemoButtonClick('morphing')
    }));
    
    // Particle System
    this.buttons.push(this.createButton({
      x: startX,
      y: startY + (buttonHeight + padding) * 2,
      width: buttonWidth,
      height: buttonHeight,
      text: 'Particle System',
      fillColor: '#4CAF50',
      textColor: '#fff',
      callback: () => this.controller.handleDemoButtonClick('particles')
    }));
  }
}

export default CanvasUI; 
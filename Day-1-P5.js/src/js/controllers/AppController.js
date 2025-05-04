import { AdvancedSketchView } from '../views/AdvancedSketchView.js';
import { OriginalSketchView } from '../views/OriginalSketchView.js';
import { ExamplesSketchView } from '../views/ExamplesSketchView.js';

/**
 * Main controller class for the p5.js application
 */
export class AppController {
  /**
   * Create a new app controller
   */
  constructor() {
    this.p5Instances = {};
    this.views = {};
    this.activeTab = 'advanced';
    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;
    
    // Set up tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.setActiveTab(button.dataset.tab);
      });
    });
    
    // Set up visualization buttons in advanced tab
    const advancedVisButtons = document.querySelectorAll('#advanced-tab .vis-button');
    advancedVisButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.setAdvancedVisualization(button.dataset.vis);
        this.updateActiveButton(advancedVisButtons, button);
      });
    });
    
    // Set up visualization buttons in examples tab
    const examplesVisButtons = document.querySelectorAll('#examples-tab .vis-button');
    examplesVisButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.setExampleVisualization(button.dataset.vis);
        this.updateActiveButton(examplesVisButtons, button);
      });
    });
    
    // Initialize p5 sketches
    this.initializeP5Sketches();
    
    this.initialized = true;
  }

  /**
   * Initialize p5 sketches for each tab
   */
  initializeP5Sketches() {
    // Advanced visualizations
    this.p5Instances.advanced = new p5(p => {
      let view;
      
      p.setup = () => {
        view = new AdvancedSketchView(p, document.getElementById('advanced-canvas'));
        view.setup();
        this.views.advanced = view;
      };
      
      p.draw = () => {
        if (view) view.draw();
      };
      
      p.windowResized = () => {
        if (view) view.windowResized();
      };
    });
    
    // Original sketch
    this.p5Instances.original = new p5(p => {
      let view;
      
      p.setup = () => {
        view = new OriginalSketchView(p, document.getElementById('original-canvas'));
        view.setup();
        this.views.original = view;
      };
      
      p.draw = () => {
        if (view) view.draw();
      };
      
      p.windowResized = () => {
        if (view) view.windowResized();
      };
    });
    
    // Examples
    this.p5Instances.examples = new p5(p => {
      let view;
      
      p.setup = () => {
        view = new ExamplesSketchView(p, document.getElementById('examples-canvas'));
        view.setup();
        this.views.examples = view;
      };
      
      p.draw = () => {
        if (view) view.draw();
      };
      
      p.windowResized = () => {
        if (view) view.windowResized();
      };
    });
  }

  /**
   * Set the active tab
   * @param {string} tab - The tab to activate
   */
  setActiveTab(tab) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.add('hidden');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(`${tab}-tab`);
    if (selectedTab) {
      selectedTab.classList.remove('hidden');
    }
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      if (button.dataset.tab === tab) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    this.activeTab = tab;
  }

  /**
   * Set the active visualization in the advanced tab
   * @param {string} visType - The visualization type to activate
   */
  setAdvancedVisualization(visType) {
    if (this.views.advanced) {
      this.views.advanced.setSketchType(visType);
    }
  }

  /**
   * Set the active visualization in the examples tab
   * @param {string} visType - The visualization type to activate
   */
  setExampleVisualization(visType) {
    if (this.views.examples) {
      this.views.examples.setSketchType(visType);
    }
  }

  /**
   * Update active button styling within a group
   * @param {NodeList} buttons - Collection of buttons
   * @param {HTMLElement} activeButton - The active button
   */
  updateActiveButton(buttons, activeButton) {
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    activeButton.classList.add('active');
  }
} 
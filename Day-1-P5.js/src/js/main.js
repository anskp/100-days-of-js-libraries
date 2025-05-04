import { AppController } from './controllers/AppController.js';

/**
 * Initialize the application once the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize the app controller
  const appController = new AppController();
  appController.init();
  
  // Make controller available globally for debugging
  window.appController = appController;
  
  console.log('P5.js Creative Gallery initialized');
}); 
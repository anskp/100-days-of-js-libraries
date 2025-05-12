import React, { useRef, useEffect, useState } from 'react';
import Paper from 'paper';
import './PaperCanvas.css';
import PaperModel from '../js/models/PaperModel';
import PaperView from '../js/views/PaperView';
import PaperController from '../js/controllers/PaperController';
import Toolbar from './Toolbar';

const PaperCanvas = () => {
  const canvasRef = useRef(null);
  // Create state to track current tool and color
  const [currentTool, setCurrentTool] = useState('select');
  const [currentColor, setCurrentColor] = useState('blue');
  
  // Create refs for MVC components to persist across renders
  const modelRef = useRef(null);
  const viewRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    // Initialize only once
    if (canvasRef.current && !modelRef.current) {
      // Create model
      modelRef.current = new PaperModel();
      
      // Create view
      viewRef.current = new PaperView(modelRef.current, canvasRef.current);
      
      // Create controller
      controllerRef.current = new PaperController(modelRef.current, viewRef.current);
      
      // Handle window resize to keep canvas responsive
      const handleResize = () => {
        // Update Paper.js view size
        Paper.view.viewSize = new Paper.Size(
          canvasRef.current.offsetWidth,
          canvasRef.current.offsetHeight
        );
        
        // Redraw
        Paper.view.draw();
      };
      
      // Initial resize
      handleResize();
      
      // Listen for window resize events
      window.addEventListener('resize', handleResize);
      
      // Setup observer to update UI state when model changes
      modelRef.current.addObserver({
        update: (model) => {
          setCurrentTool(model.currentTool);
          setCurrentColor(model.currentColor);
        }
      });
      
      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        Paper.project.clear();
      };
    }
  }, []);
  
  // Handle tool change
  const handleToolChange = (toolName) => {
    if (controllerRef.current) {
      controllerRef.current.setTool(toolName);
      setCurrentTool(toolName);
    }
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    if (controllerRef.current) {
      controllerRef.current.setColor(color);
      setCurrentColor(color);
    }
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} id="paper-canvas" className="paper-canvas" />
      <Toolbar 
        onToolChange={handleToolChange}
        onColorChange={handleColorChange}
        currentTool={currentTool}
        currentColor={currentColor}
      />
    </div>
  );
};

export default PaperCanvas; 
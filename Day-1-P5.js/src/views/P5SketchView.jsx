import React, { useState, useEffect, useRef } from 'react';
import { SketchController } from '../controllers/SketchController';

const P5SketchView = () => {
  const sketchRef = useRef(null);
  const [sketchType, setSketchType] = useState('particles');
  
  useEffect(() => {
    // Only import p5 on client side
    const p5 = window.p5 || require('p5');
    if (!p5) return;
    
    let myP5;
    let controller;
    
    // Create a new p5 instance
    myP5 = new p5((p) => {
      // Initialize the controller with the p5 instance
      controller = new SketchController(p);
      
      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth - 40, 500);
        canvas.parent(sketchRef.current);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(230, 10, 90);
        
        // Initialize the controller
        controller.init();
      };
      
      p.draw = () => {
        controller.draw(sketchType);
      };
      
      p.windowResized = () => {
        controller.windowResized();
      };
    });
    
    return () => {
      myP5.remove();
    };
  }, [sketchType]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2">P5.js Visualization</h2>
        <div 
          ref={sketchRef} 
          className="w-full h-full bg-white rounded-lg shadow-md"
        ></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setSketchType('particles')}
          className={`px-4 py-2 rounded-md ${sketchType === 'particles' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Particles
        </button>
        <button 
          onClick={() => setSketchType('noisyCircle')}
          className={`px-4 py-2 rounded-md ${sketchType === 'noisyCircle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Noisy Circle
        </button>
        <button 
          onClick={() => setSketchType('flowField')}
          className={`px-4 py-2 rounded-md ${sketchType === 'flowField' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Flow Field
        </button>
      </div>
    </div>
  );
};

export default P5SketchView; 
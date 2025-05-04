import React, { useState, useEffect, useRef } from 'react';

const BouncingBallExample = () => {
  const sketchRef = useRef(null);
  
  useEffect(() => {
    // Only import p5 on client side
    const p5 = window.p5 || require('p5');
    if (!p5) return;
    
    let myP5;
    
    myP5 = new p5((p) => {
      let x = 50;
      let y = 50;
      let speedX = 2;
      let speedY = 3;
      
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.parent(sketchRef.current);
      };
      
      p.draw = () => {
        p.background(220);
        p.ellipse(x, y, 80, 80);
        
        // Update position
        x = x + speedX;
        y = y + speedY;
        
        // Check boundaries and reverse direction
        if (x > p.width - 40 || x < 40) {
          speedX = -speedX;
        }
        if (y > p.height - 40 || y < 40) {
          speedY = -speedY;
        }
      };
    });
    
    return () => {
      myP5.remove();
    };
  }, []);
  
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-8">
      <h2 className="text-xl font-bold mb-2">Bouncing Ball Example</h2>
      <div 
        ref={sketchRef} 
        className="w-full h-[400px] bg-white rounded-lg shadow-md"
      ></div>
      <p className="mt-2 text-gray-700">
        A simple animation showing physics with a bouncing ball.
      </p>
    </div>
  );
};

const ColoredRectanglesExample = () => {
  const sketchRef = useRef(null);
  
  useEffect(() => {
    // Only import p5 on client side
    const p5 = window.p5 || require('p5');
    if (!p5) return;
    
    let myP5;
    
    myP5 = new p5((p) => {
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.parent(sketchRef.current);
      };
      
      p.draw = () => {
        p.background(220);
        
        // Yellow rectangle
        const c = p.color(255, 204, 0);
        p.fill(c);
        p.rect(15, 20, 170, 200);
        
        // Red rectangle
        const redValue = p.red(c);
        p.fill(redValue, 0, 0);
        p.rect(205, 20, 170, 200);
      };
    });
    
    return () => {
      myP5.remove();
    };
  }, []);
  
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-8">
      <h2 className="text-xl font-bold mb-2">Colored Rectangles Example</h2>
      <div 
        ref={sketchRef} 
        className="w-full h-[400px] bg-white rounded-lg shadow-md"
      ></div>
      <p className="mt-2 text-gray-700">
        Demonstrates color extraction with the red() function.
      </p>
    </div>
  );
};

export { BouncingBallExample, ColoredRectanglesExample }; 
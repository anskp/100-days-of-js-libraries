import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Sketch = () => {
  const sketchRef = useRef(null);

  useEffect(() => {
    // Define the sketch
    const sketch = (p) => {
      // Setup function
      p.setup = () => {
        p.createCanvas(600, 400);
        p.background(51);
      };

      // Draw function
      p.draw = () => {
        p.fill(255, 0, 200, 25);
        p.noStroke();
        p.ellipse(p.mouseX, p.mouseY, 48, 48);
      };
    };

    // Create a new p5 instance
    const p5Instance = new p5(sketch, sketchRef.current);

    // Cleanup function
    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Sketch; 
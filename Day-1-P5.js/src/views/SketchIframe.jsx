import React from 'react';

const SketchIframe = () => {
  const iframeContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Original P5.js Sketch</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #333;
        }
        canvas {
          border: 1px solid #444;
        }
      </style>
    </head>
    <body>
      <script>
        function setup() {
          createCanvas(600, 400);
          background(51);
        }
        
        function draw() {
          fill(255, 0, 200, 25);
          noStroke();
          ellipse(mouseX, mouseY, 48, 48);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-8">
      <h2 className="text-xl font-bold mb-2">Original P5.js Sketch</h2>
      <iframe
        title="Original P5.js Sketch"
        srcDoc={iframeContent}
        className="w-full h-[450px] border border-gray-300 rounded-lg shadow-md"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default SketchIframe; 
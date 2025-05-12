import React, { useState } from 'react';
import './App.css';
import P5SketchView from './views/P5SketchView';
import SketchIframe from './views/SketchIframe';
import { BouncingBallExample, ColoredRectanglesExample } from './views/ExampleSketchView';

// App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('advanced');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">P5.js Creative Gallery</h1>
        <p className="text-gray-600">Interactive visualizations made with p5.js in React</p>
      </header>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('advanced')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'advanced'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Advanced Visualizations
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'original'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Original Sketch
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'examples'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              More Examples
            </button>
          </nav>
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto">
        {activeTab === 'advanced' && <P5SketchView />}
        
        {activeTab === 'original' && <SketchIframe />}
        
        {activeTab === 'examples' && (
          <div>
            <BouncingBallExample />
            <ColoredRectanglesExample />
          </div>
        )}
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">About This Application</h2>
          <p className="text-gray-700 mb-4">
            This React application demonstrates the integration of p5.js, 
            a creative coding JavaScript library, with React using an MVC architecture pattern:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Model</h3>
              <p className="text-sm">Defines the data structures for particles, circle points, and flow fields.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">View</h3>
              <p className="text-sm">Renders the p5.js sketches and provides user interface components for interaction.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Controller</h3>
              <p className="text-sm">Manages the logic for updating and animating the sketches based on user input.</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-lg">Visualizations:</h3>
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              <li><strong>Particles</strong> - Interactive particles with perlin noise movement</li>
              <li><strong>Noisy Circle</strong> - A circle with perlin noise distortion</li>
              <li><strong>Flow Field</strong> - Particles moving through an invisible flow field</li>
              <li><strong>Original Sketch</strong> - The first p5.js example in an iframe</li>
              <li><strong>Additional Examples</strong> - More p5.js creative coding samples</li>
            </ul>
          </div>
        </div>
      </main>
      </div>
  );
}

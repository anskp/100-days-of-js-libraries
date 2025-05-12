import React, { useState } from 'react';
import './Toolbar.css';

const Toolbar = ({ onToolChange, onColorChange, currentTool, currentColor }) => {
  const [showColorWheel, setShowColorWheel] = useState(false);
  
  const tools = [
    { id: 'select', label: 'Select' },
    { id: 'circle', label: 'Circle' },
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'freedraw', label: 'Free Draw' },
    { id: 'resize', label: 'Resize' }
  ];
  
  const colors = [
    { id: 'blue', label: 'Blue', hex: '#2196F3' },
    { id: 'red', label: 'Red', hex: '#F44336' },
    { id: 'green', label: 'Green', hex: '#4CAF50' },
    { id: 'yellow', label: 'Yellow', hex: '#FFEB3B' },
    { id: 'purple', label: 'Purple', hex: '#9C27B0' },
    { id: 'orange', label: 'Orange', hex: '#FF9800' }
  ];
  
  const handleColorWheelClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate color from wheel position
    const radius = Math.sqrt(x * x + y * y);
    const maxRadius = rect.width / 2;
    if (radius > maxRadius) return; // Outside the wheel
    
    const angle = Math.atan2(y, x);
    const hue = ((angle / Math.PI / 2) + 0.5) * 360; // Convert angle to hue (0-360)
    
    const saturation = Math.min(radius / maxRadius, 1.0); // Distance from center (0-1)
    
    // Convert HSV to RGB
    const hex = hsvToHex(hue, saturation, 1.0);
    onColorChange(hex);
  };
  
  // Convert HSV color values to hex string
  const hsvToHex = (h, s, v) => {
    let r, g, b;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      default: r = v; g = p; b = q; break;
    }
    
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <div className="toolbar">
      <h2 className="toolbar-title">Paper.js Examples</h2>
      
      <div className="toolbar-section">
        <h3>Tools</h3>
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`toolbar-button ${currentTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
          >
            {tool.label}
          </button>
        ))}
      </div>
      
      <div className="toolbar-section">
        <h3>Colors</h3>
        <div className="color-options">
          {colors.map(color => (
            <div
              key={color.id}
              className={`color-option ${currentColor === color.id ? 'active' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => onColorChange(color.id)}
            />
          ))}
          <button 
            className="color-wheel-toggle"
            onClick={() => setShowColorWheel(!showColorWheel)}
          >
            {showColorWheel ? 'Hide Color Wheel' : 'Show Color Wheel'}
          </button>
        </div>
        
        {showColorWheel && (
          <div className="color-wheel-container">
            <div 
              className="color-wheel" 
              onClick={handleColorWheelClick}
              style={{
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
              }}
            >
              <div className="color-wheel-inner"></div>
            </div>
            <div className="current-color-display" style={{ backgroundColor: typeof currentColor === 'string' && currentColor.startsWith('#') ? currentColor : colors.find(c => c.id === currentColor)?.hex || '#000' }}></div>
          </div>
        )}
      </div>
      
      <div className="toolbar-section">
        <h3>Help</h3>
        <p className="help-text">
          <strong>Keyboard shortcuts:</strong>
          <br />S - Select tool
          <br />C - Circle tool
          <br />R - Rectangle tool
          <br />F - Free Draw tool
          <br />Z - Resize tool
          <br />Delete - Remove selected
        </p>
      </div>
    </div>
  );
};

export default Toolbar; 
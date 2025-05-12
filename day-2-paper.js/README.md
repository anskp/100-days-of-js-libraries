# Paper.js Interactive Demo Application

A feature-rich interactive drawing application built with React and Paper.js, demonstrating various capabilities of the Paper.js library through an MVC architecture and canvas-based UI.

## Features

### Core Drawing Tools
- **Select Tool**: Choose and manipulate existing shapes
- **Circle Tool**: Draw circles by clicking and dragging
- **Rectangle Tool**: Create rectangles by setting opposite corners

### Canvas-Based UI
- **Fully canvas-rendered UI**: No HTML UI components
- **Tool Selection**: Easy switching between tools
- **Color Picker**: Choose from a palette of colors
- **View Navigation**: Switch between different application views
- **Keyboard Shortcuts**: For faster workflow

### Interactive Demos

#### Bezier Curve Designer
- Click to place points and draw animated Bézier curves
- Watch an animated dot traverse the curve
- Dynamic visualization of different curve types (linear, quadratic, cubic)
- Control points can be dragged to adjust the curve shape

#### Shape Morphing Animation
- Smooth transitions between different geometric shapes
- Continuous color transitions with complementary colors
- Morphs through circle → star → polygon sequence
- Demonstrates smooth path interpolation techniques

#### Colorful Particle System
- Emit particles from mouse cursor position
- Particles feature dynamic fading trails and realistic physics
- High-performance particle rendering with opacity and scale effects
- Demonstrates Paper.js performance with many animated elements

## Architecture

This application follows the Model-View-Controller (MVC) architecture:

- **Models**: Manage application state and data
- **Views**: Handle rendering and user interface
- **Controllers**: Manage user interactions and events

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Keyboard Shortcuts

- `S` - Select tool
- `C` - Circle tool
- `R` - Rectangle tool
- `1` - Bezier Designer demo
- `2` - Shape Morphing demo
- `3` - Particle System demo
- `H` - Help panel
- `ESC` - Exit current mode
- `DELETE` - Remove selected item

## Technologies Used

- **React**: For component-based UI structure
- **Paper.js**: For canvas drawing and interaction
- **JavaScript**: ES6+ features for clean implementation

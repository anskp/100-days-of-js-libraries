# 🎨 P5.js Creative Gallery

![P5.js Banner](https://p5js.org/assets/img/p5js.svg)

A structured p5.js application showcasing various visual effects and creative coding techniques using an MVC (Model-View-Controller) architecture.

## 🚀 Features

- **Multiple Visualizations** - Explore particles, flow fields, and noisy circles
- **Interactive UI** - Switch between different sketches with a clean interface
- **Clean Architecture** - Organized with MVC pattern for better code structure
- **Pure p5.js** - Built with vanilla JavaScript and p5.js only

## 🏗️ Project Structure

```
src/
├── js/
│   ├── models/          # Data structures and properties
│   │   ├── ParticleModel.js
│   │   ├── CirclePointModel.js
│   │   └── FlowFieldModel.js
│   ├── views/           # Visual rendering components
│   │   ├── AdvancedSketchView.js
│   │   ├── OriginalSketchView.js
│   │   └── ExamplesSketchView.js
│   ├── controllers/     # Application logic
│   │   └── AppController.js
│   └── main.js          # Application entry point
└── index.html           # Main HTML file
```

## 🖌️ Visualizations

### Advanced Visualizations

1. **Particles** - Interactive particle system with perlin noise-based movement
2. **Flow Field** - Vector field visualization with flowing particles
3. **Noisy Circle** - Organic, animated circle using perlin noise

### Examples Visualizations

1. **Bouncing Ball** - Classic bouncing ball animation
2. **Colored Rectangles** - Color component demonstration
3. **Circular Motion** - Orbital movement with trigonometry

## 🛠️ Technical Implementation

This project demonstrates:

- **Instance Mode p5.js** - Using p5 in a more object-oriented way
- **Clean Separation of Concerns** - Data, rendering, and logic are separated
- **Responsive Design** - Works across different screen sizes
- **Event-Driven Programming** - Uses event listeners for user interactions

## 🧠 Learning Goals

- Understanding creative coding fundamentals
- Implementing MVC architecture in JavaScript
- Working with p5.js's particle systems and perlin noise
- Creating responsive and interactive visualizations

## 🏃‍♂️ Running the Project

Simply open the `index.html` file in a modern browser or use a local server:

```bash
# Using Node.js http-server (install if needed: npm install -g http-server)
http-server

# Or with Python
python -m http.server
```

## 🔄 Extending the Project

To add new visualizations:

1. Create a new model in `src/js/models/` if needed
2. Add the rendering logic to the appropriate view in `src/js/views/`
3. Update the controller to handle the new visualization
4. Add UI elements to `index.html` to enable user selection

## 📝 Guidelines

- Keep the code modular and maintainable
- Follow the established MVC pattern
- Document your code with JSDoc comments
- Optimize for performance, especially with large particle systems
- Ensure browser compatibility

---

Created as part of the [100 Days of JavaScript Libraries](../../README.md) challenge - Day 1.

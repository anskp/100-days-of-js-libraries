/**
 * DemosManager - Manages interactive demos
 */
import Paper from 'paper';

class DemosManager {
  constructor(model, view, controller) {
    this.model = model;
    this.view = view;
    this.controller = controller;
    this.currentDemo = null;
    this.demoTools = {};
    this.demoObjects = {};
    this.animationFrameId = null;
    
    // Demo parameters
    this.params = {
      bezier: {
        maxPoints: 6,
        pointSize: 10,
        curveWidth: 3,
        animationSpeed: 0.01
      },
      morphing: {
        sides: 5,
        radius: 100,
        transitionSpeed: 0.02,
        rotationSpeed: 0.5
      },
      particles: {
        emitRate: 5,
        particleLifetime: 100,
        particleSize: 10,
        speedVariation: 2
      }
    };
    
    // Initialize demo tools
    this.initializeDemoTools();
  }
  
  // Initialize all demo-specific tools
  initializeDemoTools() {
    // Bezier curve designer tool
    this.demoTools.bezier = new Paper.Tool();
    
    this.demoTools.bezier.onMouseDown = (event) => {
      // Skip if clicking on UI elements
      if (this.controller.isClickOnUILayer(event.point)) {
        return;
      }
      
      if (!this.demoObjects.bezierPoints) {
        this.demoObjects.bezierPoints = [];
      }
      
      // Add a control point
      if (this.demoObjects.bezierPoints.length < this.params.bezier.maxPoints) {
        const point = new Paper.Path.Circle({
          center: event.point,
          radius: this.params.bezier.pointSize,
          fillColor: new Paper.Color({
            hue: (this.demoObjects.bezierPoints.length * 60) % 360,
            saturation: 0.7,
            brightness: 1
          }),
          strokeColor: '#fff',
          strokeWidth: 2
        });
        
        this.demoObjects.bezierPoints.push(point);
        this.updateBezierCurve();
      }
    };
    
    this.demoTools.bezier.onMouseDrag = (event) => {
      // Check if we're dragging one of the control points
      const hitResult = Paper.project.hitTest(event.downPoint, {
        tolerance: this.params.bezier.pointSize,
        fill: true
      });
      
      if (hitResult && hitResult.item && this.demoObjects.bezierPoints.includes(hitResult.item)) {
        // Move the point
        hitResult.item.position = event.point;
        this.updateBezierCurve();
      }
    };
    
    // Particle system tool
    this.demoTools.particles = new Paper.Tool();
    
    this.demoTools.particles.onMouseMove = (event) => {
      // Skip if over UI elements
      if (this.controller.isClickOnUILayer(event.point)) {
        return;
      }
      
      if (!this.demoObjects.mousePosition) {
        this.demoObjects.mousePosition = event.point.clone();
      } else {
        this.demoObjects.mousePosition = event.point.clone();
      }
    };
    
    this.demoTools.particles.onMouseDrag = (event) => {
      // Skip if dragging on UI elements
      if (this.controller.isClickOnUILayer(event.point)) {
        return;
      }
      
      // Update mouse position for particle emission
      this.demoObjects.mousePosition = event.point.clone();
      
      // Emit more particles while dragging
      this.emitParticles(10);
    };
  }
  
  // Start a specific demo
  startDemo(demoName) {
    // Stop any current demo
    this.stopCurrentDemo();
    
    // Set the current demo
    this.currentDemo = demoName;
    
    // Clear the canvas of previous shapes
    this.clearCanvas();
    
    // Start the specific demo
    switch(demoName) {
      case 'bezier':
        this.startBezierDesigner();
        break;
      case 'morphing':
        this.startShapeMorphing();
        break;
      case 'particles':
        this.startParticleSystem();
        break;
      default:
        this.currentDemo = null;
        break;
    }
  }
  
  // Stop the current demo
  stopCurrentDemo() {
    if (this.currentDemo) {
      // Stop animation frame if running
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      
      // Remove any demo-specific tool
      if (this.demoTools[this.currentDemo]) {
        this.demoTools[this.currentDemo].remove();
      }
      
      // Reset variables
      this.currentDemo = null;
    }
  }
  
  // Clear the canvas for fresh demo
  clearCanvas() {
    // Get content layer
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    if (contentLayer) {
      contentLayer.removeChildren();
    }
    
    // Clear demo objects
    this.demoObjects = {};
  }
  
  // Start Bezier curve designer demo
  startBezierDesigner() {
    // Activate the Bezier design tool
    this.demoTools.bezier.activate();
    
    // Create instructions text
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    
    const instructions = new Paper.PointText({
      point: [20, 30],
      content: 'Click to add points (max 6). Drag points to adjust the curve.',
      fillColor: '#555',
      fontFamily: 'Arial',
      fontSize: 14
    });
    
    contentLayer.addChild(instructions);
    
    // Initialize bezier points array
    this.demoObjects.bezierPoints = [];
    
    // Create a reset button
    const buttonBg = new Paper.Path.Rectangle({
      point: [20, 50],
      size: [80, 30],
      radius: 5,
      fillColor: '#4285F4',
      strokeColor: '#3367D6',
      strokeWidth: 1
    });
    
    const buttonText = new Paper.PointText({
      point: [35, 70],
      content: 'Reset',
      fillColor: '#fff',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 14
    });
    
    const resetButton = new Paper.Group([buttonBg, buttonText]);
    contentLayer.addChild(resetButton);
    
    resetButton.onClick = () => {
      // Remove all points and curves
      if (this.demoObjects.bezierPoints) {
        this.demoObjects.bezierPoints.forEach(point => point.remove());
        this.demoObjects.bezierPoints = [];
      }
      
      if (this.demoObjects.bezierCurve) {
        this.demoObjects.bezierCurve.remove();
        this.demoObjects.bezierCurve = null;
      }
      
      if (this.demoObjects.bezierAnimation) {
        this.demoObjects.bezierAnimation.forEach(item => item.remove());
        this.demoObjects.bezierAnimation = null;
      }
    };
    
    // Start animation for bezier animation demo
    const animate = () => {
      this.animateBezier();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Update the bezier curve based on control points
  updateBezierCurve() {
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    
    // Remove previous curve if exists
    if (this.demoObjects.bezierCurve) {
      this.demoObjects.bezierCurve.remove();
      this.demoObjects.bezierCurve = null;
    }
    
    // Need at least 2 points to draw a curve
    if (this.demoObjects.bezierPoints.length >= 2) {
      const points = this.demoObjects.bezierPoints.map(p => p.position);
      
      this.demoObjects.bezierCurve = new Paper.Path();
      this.demoObjects.bezierCurve.strokeColor = new Paper.Color({
        hue: 210,
        saturation: 0.8,
        brightness: 0.8
      });
      this.demoObjects.bezierCurve.strokeWidth = this.params.bezier.curveWidth;
      this.demoObjects.bezierCurve.strokeCap = 'round';
      
      // Draw the path differently based on number of points
      if (points.length === 2) {
        // Just a line for 2 points
        this.demoObjects.bezierCurve.add(points[0], points[1]);
      } else if (points.length === 3) {
        // Quadratic bezier with 3 points
        this.demoObjects.bezierCurve.moveTo(points[0]);
        this.demoObjects.bezierCurve.quadraticCurveTo(points[1], points[2]);
      } else {
        // Cubic or more complex curve
        this.demoObjects.bezierCurve.moveTo(points[0]);
        
        if (points.length === 4) {
          // Cubic bezier with 4 points
          this.demoObjects.bezierCurve.cubicCurveTo(points[1], points[2], points[3]);
        } else {
          // More complex curve with more points
          // We'll use the through() method to create a smooth curve through all points
          for (let i = 1; i < points.length; i++) {
            this.demoObjects.bezierCurve.add(points[i]);
          }
          this.demoObjects.bezierCurve.smooth();
        }
      }
      
      contentLayer.addChild(this.demoObjects.bezierCurve);
      this.demoObjects.bezierCurve.sendToBack();
      
      // Prepare animation
      this.prepareBezierAnimation();
    }
  }
  
  // Prepare animation for the bezier curve
  prepareBezierAnimation() {
    if (!this.demoObjects.bezierCurve) return;
    
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    
    // Remove previous animation objects
    if (this.demoObjects.bezierAnimation) {
      this.demoObjects.bezierAnimation.forEach(item => item.remove());
    }
    
    // Create animation ball
    this.demoObjects.bezierAnimation = [];
    
    // Animation dot
    const animationDot = new Paper.Path.Circle({
      center: this.demoObjects.bezierCurve.firstSegment.point,
      radius: 8,
      fillColor: 'red',
      shadowColor: new Paper.Color(0, 0, 0, 0.3),
      shadowBlur: 10,
      shadowOffset: new Paper.Point(2, 2)
    });
    
    this.demoObjects.bezierAnimation.push(animationDot);
    contentLayer.addChild(animationDot);
    
    // Animation progress
    this.demoObjects.animationProgress = 0;
  }
  
  // Animate the bezier curve
  animateBezier() {
    if (!this.demoObjects.bezierCurve || !this.demoObjects.bezierAnimation) return;
    
    const animationDot = this.demoObjects.bezierAnimation[0];
    
    // Update animation progress
    this.demoObjects.animationProgress += this.params.bezier.animationSpeed;
    if (this.demoObjects.animationProgress > 1) {
      this.demoObjects.animationProgress = 0;
    }
    
    // Get point at current progress along the curve
    const point = this.demoObjects.bezierCurve.getPointAt(
      this.demoObjects.bezierCurve.length * this.demoObjects.animationProgress
    );
    
    if (point) {
      animationDot.position = point;
      
      // Update color based on position
      animationDot.fillColor = new Paper.Color({
        hue: (this.demoObjects.animationProgress * 360) % 360,
        saturation: 1,
        brightness: 1
      });
    }
  }
  
  // Start shape morphing animation demo
  startShapeMorphing() {
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    
    // Create instructions text
    const instructions = new Paper.PointText({
      point: [20, 30],
      content: 'Morphing Animation: Circle ↔ Star ↔ Polygon',
      fillColor: '#555',
      fontFamily: 'Arial',
      fontSize: 14
    });
    
    contentLayer.addChild(instructions);
    
    // Create the initial shape (circle)
    const center = new Paper.Point(
      Paper.view.center.x - 100, // Offset left from center to account for sidebar
      Paper.view.center.y
    );
    const radius = this.params.morphing.radius;
    
    this.demoObjects.morphingShape = new Paper.Path.Circle({
      center: center,
      radius: radius,
      strokeColor: new Paper.Color({
        hue: 0,
        saturation: 0.8,
        brightness: 0.8
      }),
      strokeWidth: 2,
      fillColor: new Paper.Color({
        hue: 0,
        saturation: 0.5,
        brightness: 0.9
      })
    });
    
    contentLayer.addChild(this.demoObjects.morphingShape);
    
    // Initialize morphing state
    this.demoObjects.morphingState = {
      currentShape: 'circle',
      targetShape: 'star',
      progress: 0,
      hue: 0
    };
    
    // Generate shape paths for each shape
    this.demoObjects.shapePaths = {
      circle: this.generateCirclePath(center, radius),
      star: this.generateStarPath(center, radius, 5),
      polygon: this.generatePolygonPath(center, radius, 6)
    };
    
    // Start morphing animation
    const animate = () => {
      this.animateMorphing();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Generate circle path
  generateCirclePath(center, radius) {
    const circle = new Paper.Path.Circle({
      center: center,
      radius: radius
    });
    
    const segments = circle.segments.map(seg => ({
      point: seg.point.clone(),
      handleIn: seg.handleIn ? seg.handleIn.clone() : null,
      handleOut: seg.handleOut ? seg.handleOut.clone() : null
    }));
    
    circle.remove();
    return segments;
  }
  
  // Generate star path
  generateStarPath(center, radius, points) {
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    const star = new Paper.Path();
    
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;
      star.add(new Paper.Point(x, y));
    }
    
    star.closePath();
    
    const segments = star.segments.map(seg => ({
      point: seg.point.clone(),
      handleIn: seg.handleIn ? seg.handleIn.clone() : null,
      handleOut: seg.handleOut ? seg.handleOut.clone() : null
    }));
    
    star.remove();
    return segments;
  }
  
  // Generate polygon path
  generatePolygonPath(center, radius, sides) {
    const polygon = new Paper.Path.RegularPolygon({
      center: center,
      sides: sides,
      radius: radius
    });
    
    const segments = polygon.segments.map(seg => ({
      point: seg.point.clone(),
      handleIn: seg.handleIn ? seg.handleIn.clone() : null,
      handleOut: seg.handleOut ? seg.handleOut.clone() : null
    }));
    
    polygon.remove();
    return segments;
  }
  
  // Animate morphing between shapes
  animateMorphing() {
    if (!this.demoObjects.morphingShape || !this.demoObjects.shapePaths) return;
    
    const state = this.demoObjects.morphingState;
    
    // Update progress
    state.progress += this.params.morphing.transitionSpeed;
    
    // Update hue (continuously rotating through the color wheel)
    state.hue = (state.hue + this.params.morphing.rotationSpeed) % 360;
    
    // Update color based on hue
    this.demoObjects.morphingShape.fillColor = new Paper.Color({
      hue: state.hue,
      saturation: 0.7,
      brightness: 0.9
    });
    this.demoObjects.morphingShape.strokeColor = new Paper.Color({
      hue: (state.hue + 180) % 360, // Complementary color for stroke
      saturation: 0.8,
      brightness: 0.7
    });
    
    if (state.progress >= 1) {
      // Transition complete, move to next shape
      state.progress = 0;
      state.currentShape = state.targetShape;
      
      // Determine next target shape
      if (state.currentShape === 'circle') {
        state.targetShape = 'star';
      } else if (state.currentShape === 'star') {
        state.targetShape = 'polygon';
      } else {
        state.targetShape = 'circle';
      }
    }
    
    // Get source and target shapes
    const sourceShape = this.demoObjects.shapePaths[state.currentShape];
    const targetShape = this.demoObjects.shapePaths[state.targetShape];
    
    // Create intermediate shape by interpolating between source and target
    const newPath = new Paper.Path({
      closed: true,
      fillColor: this.demoObjects.morphingShape.fillColor,
      strokeColor: this.demoObjects.morphingShape.strokeColor,
      strokeWidth: this.demoObjects.morphingShape.strokeWidth
    });
    
    // We need to handle different segment counts for interpolation
    // For simplicity, we'll use the minimum number of segments from both shapes
    const minSegments = Math.min(sourceShape.length, targetShape.length);
    
    for (let i = 0; i < minSegments; i++) {
      // Get source and target segments
      const sourceSegment = sourceShape[i % sourceShape.length];
      const targetSegment = targetShape[i % targetShape.length];
      
      // Interpolate points
      const point = sourceSegment.point.multiply(1 - state.progress)
        .add(targetSegment.point.multiply(state.progress));
      
      // Add new segment
      newPath.add(point);
    }
    
    newPath.closePath();
    newPath.smooth();
    
    // Replace current shape with new interpolated shape
    this.demoObjects.morphingShape.remove();
    this.demoObjects.morphingShape = newPath;
  }
  
  // Start particle system demo
  startParticleSystem() {
    // Activate the particles tool
    this.demoTools.particles.activate();
    
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    
    // Create instructions text
    const instructions = new Paper.PointText({
      point: [20, 30],
      content: 'Move or drag your mouse to emit particles',
      fillColor: '#555',
      fontFamily: 'Arial',
      fontSize: 14
    });
    
    contentLayer.addChild(instructions);
    
    // Initialize particles array
    this.demoObjects.particles = [];
    this.demoObjects.lastEmitTime = 0;
    
    // Start particle animation
    const animate = () => {
      this.updateParticles();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Update particles animation
  updateParticles() {
    if (!this.demoObjects.particles) return;
    
    const now = Date.now();
    
    // Emit new particles if mouse is moving
    if (this.demoObjects.mousePosition && now - this.demoObjects.lastEmitTime > 50) {
      this.emitParticles(this.params.particles.emitRate);
      this.demoObjects.lastEmitTime = now;
    }
    
    // Update existing particles
    for (let i = this.demoObjects.particles.length - 1; i >= 0; i--) {
      const p = this.demoObjects.particles[i];
      
      // Update lifetime
      p.life--;
      
      // Remove dead particles
      if (p.life <= 0) {
        p.particle.remove();
        this.demoObjects.particles.splice(i, 1);
        continue;
      }
      
      // Update position
      p.particle.position = p.particle.position.add(p.velocity);
      
      // Update scale and opacity based on remaining life
      const lifeRatio = p.life / p.maxLife;
      p.particle.opacity = lifeRatio;
      p.particle.scale(0.97); // Gradually shrink
      
      // Apply some gravity
      p.velocity.y += 0.05;
      
      // Slow down over time
      p.velocity = p.velocity.multiply(0.97);
    }
  }
  
  // Emit new particles
  emitParticles(count) {
    if (!this.demoObjects.mousePosition) return;
    
    const contentLayer = Paper.project.layers.find(layer => layer.name === 'Content Layer');
    
    for (let i = 0; i < count; i++) {
      // Random angle and speed for the particle
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * this.params.particles.speedVariation + 1;
      
      // Create velocity vector
      const velocity = new Paper.Point(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
      
      // Random size
      const size = Math.random() * this.params.particles.particleSize + 3;
      
      // Random color
      const color = new Paper.Color({
        hue: Math.random() * 360,
        saturation: 0.8,
        brightness: 0.9
      });
      
      // Create particle
      const particle = new Paper.Path.Circle({
        center: this.demoObjects.mousePosition,
        radius: size,
        fillColor: color
      });
      
      contentLayer.addChild(particle);
      
      // Add to particles array with lifecycle data
      this.demoObjects.particles.push({
        particle: particle,
        velocity: velocity,
        life: this.params.particles.particleLifetime,
        maxLife: this.params.particles.particleLifetime
      });
    }
  }
  
  // Update demo parameters
  updateParams(demoType, paramName, value) {
    if (this.params[demoType] && this.params[demoType][paramName] !== undefined) {
      this.params[demoType][paramName] = value;
    }
  }
}

export default DemosManager;
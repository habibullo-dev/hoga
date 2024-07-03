thCosy()

async function thCosy(){



    console.log("Content finished loading. deleting Loading Screen")
    loadingScreen.style.opacity="0";
    setTimeout(()=>{
        loadingScreen.innerHTML="";
    }, 150)
}

(function(global) {

    "use strict";
  
    //object that will be exported to the global namespace
    var MODULE = {};
  
    //convert radians to degress...
    function rad2deg(rad) {
      var deg = 180 / Math.PI * rad;
      return deg;
    }
  
    //and vice versa
    function deg2rad(deg) {
      var rad = Math.PI / 180 * deg;
      return rad;
    }
  
    //calculate the distance between 2 points
    function dist2points(p0, p1) {
      var distance = Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));
      return distance;
    }
  
    //get the angle between two given points
    function angle2points(p0, p1) {
      var angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      return angle;
    }
  
    //return a "random" number from a given range
    function randomInRange(min, max) {
      var n = Math.random() * (max - min) + min;
      return n;
    }
  
    //choose a random element from a given array
    function chooseRandomFrom(array) {
      var randomIndex = Math.floor(Math.random() * array.length);
      var choice = array[randomIndex];
      return choice;
    }
  
    //paint an entire canvas of a given color
    function paintWholeCanvas(ctx, color) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fill();
      ctx.restore();
    }
  
    //check if object is empty or nah
    function isEmpty(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    }
  
    //extend function for inheritance
    function extend(parent, sub) {
      sub.prototype = Object.create(parent.prototype);
      sub.prototype.constructor = sub;
    }
  
    //////////////////////
    // -- UTLILITIES -- //
    //////////////////////
  
    //object containig a bunch of useful functions
    var utils = {
  
      rad2deg: rad2deg,
  
      paintWholeCanvas: paintWholeCanvas,
  
      angle2points: angle2points,
  
      isEmpty: isEmpty,
  
      deg2rad: deg2rad,
  
      chooseRandomFrom: chooseRandomFrom,
  
      dist2points: dist2points,
  
      randomInRange: randomInRange,
  
      extend: extend
  
    };
  
    /////////////////
    // -- QUEUE -- //
    /////////////////
  
    function Queue() {
      this.queue = [];
    }
  
    Queue.prototype.enqueue = function(element) {
      this.queue.unshift(element);
    };
  
    Queue.prototype.dequeue = function() {
      this.queue.pop();
    };
  
    Queue.prototype.getLength = function() {
      return this.queue.length;
    };
  
    Queue.prototype.getLast = function() {
      return this.queue[this.queue.lenght - 1];
    };
  
    Queue.prototype.getFirst = function() {
      return this.queue[0];
    };
  
    Queue.prototype.empty = function() {
      this.queue = [];
    };
  
    //////////////////////////
    // -- PARTICLE TRAIL -- //
    //////////////////////////
  
    function ParticleTrail(length, color, width) {
      Queue.call(this);
      this.length = length || 10;
      this.color = color;
      this.width = width;
    }
  
    extend(Queue, ParticleTrail);
  
    ParticleTrail.prototype.update = function(point) {
      var p = {
        x: point.x,
        y: point.y
      };
      this.enqueue(p);
      if (this.getLength() >= this.length) {
        this.dequeue();
      }
    };
  
    ParticleTrail.prototype.render = function(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      if (this.color) {
        ctx.strokeStyle = this.color;
      }
      ctx.lineWidth = this.width;
      ctx.moveTo(this.getFirst().x, this.getFirst().y);
      for (var i = 1; i < this.queue.length; i++) {
        ctx.lineTo(this.queue[i].x, this.queue[i].y);
      }
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    };
  
    //////////////////
    // -- VECTOR -- //
    //////////////////
  
    //vector constructor
    function Vector(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
  
    //set X component of the vector
    Vector.prototype.setX = function(value) {
      this.x = value;
      return this;
    };
  
    //set Y component of the vector
    Vector.prototype.setY = function(value) {
      this.y = value;
      return this;
    };
  
    //add two vectors
    Vector.prototype.add = function(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    };
  
    //subract two vectors
    Vector.prototype.subtract = function(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    };
  
    //multiply the vectors by a scalar value
    Vector.prototype.multiply = function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    };
  
    //divide the vectors by a scalar value
    Vector.prototype.divide = function(scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    };
  
    //normalise the vector
    Vector.prototype.normalize = function() {
      var x = this.x / this.getMagnitude(),
        y = this.y / this.getMagnitude();
      var normalizedVector = new Vector(x, y);
      return normalizedVector;
    };
  
    //rotate the vector about an angle
    Vector.prototype.rotate = function(angle) {
      var angleCos = Math.cos(angle),
        angleSin = Math.sin(angle),
        rotatedX = this.x * angleCos - this.y * angleSin,
        rotatedY = this.y * angleCos + this.x * angleSin;
      this.setX(rotatedX);
      this.setY(rotatedY);
    };
  
    //clone vector
    Vector.prototype.clone = function() {
      var newVector = new Vector(this.x, this.y);
      return newVector;
    };
  
    //scalar product between vectors
    Vector.prototype.dot = function(v) {
      var scalarProduct = this.x * v.x + this.y * v.y;
      return scalarProduct;
    };
  
    //cross product between vectors
    Vector.prototype.cross = function(v) {
      var crossProduct = this.x * v.y - v.x * this.y;
      return crossProduct;
    };
  
    //return the vector's magnitude
    Vector.prototype.getMagnitude = function() {
      var magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
      return magnitude;
    };
  
    //return the vector's direction
    Vector.prototype.getDirection = function() {
      var direction = Math.atan2(this.y, this.x);
      return direction;
    };
  
    ////////////////////
    // -- PARTICLE -- //
    ////////////////////
  
    //particle constructor
    function Particle(x, y, radius, options) {
      this.position = new Vector(x || 0, y || 0);
      this.radius = radius || 5;
      for (var option in options) {
        if (options.hasOwnProperty(option)) {
          this[option] = options[option];
        }
      }
      this.initialize();
    }
  
    //make sure that needed properties are initialized
    Particle.prototype.initialize = function() {
      if (!this.velocity) {
        this.velocity = new Vector();
        this.previousPosition = this.position.clone();
      }
      if (!this.previousPosition) {
        var startingPosition = this.position.clone();
        this.previousPosition = startingPosition.subtract(this.velocity);
      }
      if (this.affectedByGravity !== false) {
        this.affectedByGravity = true;
      }
      if (!this.force) {
        this.force = new Vector();
      }
      if (!this.mass) {
        this.mass = 1;
      }
      if (!this.friction) {
        this.friction = 0;
      }
      if (this.isControlled && !this.commands) {
        this.commands = {};
      }
      if (!this.events) {
        this.events = {};
      }
      if (this.trail) {
        var trailLength = this.trail.length || 10,
          trailColor = this.trail.color || 'black',
          trailWidth = this.trail.width || 0.2;
        this.trail = new ParticleTrail(trailLength, trailColor, trailWidth);
      }
    };
  
    //gravitate a particle
    Particle.prototype.gravitate = function(star) {
      var d = dist2points(this.position, star.position);
      var angle = angle2points(this.position, star.position);
      var attractiveForceMagnitude = star.mass * this.mass / (d * d);
      var attractiveForceX = attractiveForceMagnitude * Math.cos(angle);
      var attractiveForceY = attractiveForceMagnitude * Math.sin(angle);
      var attractiveForce = new Vector(attractiveForceX, attractiveForceY);
      this.force.add(attractiveForce);
    };
  
    Particle.prototype.setVelocity = function(vector) {
      this.velocity = vector;
      this.previousPosition.x = this.position.x - vector.x;
      this.previousPosition.y = this.position.y - vector.y;
    };
  
    //handle input
    Particle.prototype.handleInput = function(input) {
      for (var inp in input) {
        if (this.commands[inp]) {
          this.commands[inp](this);
        }
      }
    };
  
    //add one or more particles to the array "attractedTo"
    Particle.prototype.addToAttractedTo = function(particle) {
      var particleIndex = this.attractedTo.indexOf(particle);
      if (particleIndex === -1) {
        this.attractedTo.push(particle);
      }
    };
  
    //remove a particle from the array "attractedTo"
    Particle.prototype.removeFromAttractedTo = function(particle) {
      var particleIndex = this.attractedTo.indexOf(particle);
      if (particleIndex !== -1) {
        this.attractedTo.splice(particleIndex, 1);
      }
    };
  
    //remove a command
    Particle.prototype.addCommand = function(trigger, f) {
      this.commands[trigger] = f;
    };
  
    //add a command
    Particle.prototype.removeCommand = function(trigger) {
      delete this.commands[trigger];
    };
  
    //determine whether the particle in on screen or not
    Particle.prototype.isOnScreen = function(world) {
      return this.position.x - this.radius < world.w && this.position.x + this.radius > 0 && this.position.y - this.radius < world.h && this.position.y + this.radius > 0;
    };
  
    //determine if the particle in on the edge of the world
    Particle.prototype.isTouchingEdge = function(world) {
      return this.position.x + this.radius > world.w || this.position.x - this.radius < 0 || this.position.y + this.radius > world.h || this.position.y - this.radius < 0;
    };
  
    //clear force applied to particle
    Particle.prototype.resetForce = function() {
      this.force.x = this.force.y = 0;
    };
  
    //check if the particle overlps a given other or not
    Particle.prototype.overlaps = function(particle) {
      if (dist2points(this.position, particle.position) < this.radius + particle.radius) {
        return true;
      }
      return false;
    };
  
    //determine whether two particles are moving towards each other
    Particle.prototype.isMovingTowards = function(particle) {
      var thisVel = this.velocity.clone();
      var otherVel = particle.velocity.clone();
      var thisPosition = this.position.clone();
      var otherPosition = particle.position.clone();
      var positionsDifferenceVector = otherPosition.subtract(thisPosition);
      var velocitiesDifferenceVector = thisVel.subtract(otherVel);
      var positionsVelocitiesDotProduct = positionsDifferenceVector.dot(velocitiesDifferenceVector);
      return positionsVelocitiesDotProduct > 0;
    };
  
    //detect if this is colliding with a given particle
    Particle.prototype.collidingWith = function(particle) {
      if (this.overlaps(particle) && this.isMovingTowards(particle)) {
        return true;
      }
      return false;
    };
  
    //detect collision with specified particle
    //https://blogs.msdn.microsoft.com/faber/2013/01/09/elastic-collisions-of-balls/ <-- couldn't have done it without this great article
    Particle.prototype.handleCollision = function(particle) {
      var impactAngle = angle2points(this.position, particle.position);
      var otherImpactAngle = angle2points(particle.position, this.position);
      var impactPoint = {
        x: this.position.x - particle.position.x,
        y: this.position.y - particle.position.y
      };
      this.velocity.rotate(-impactAngle);
      particle.velocity.rotate(-impactAngle);
      var thisFinalVXInNewCCS = ((this.mass - particle.mass) * this.velocity.x + (2 * particle.mass) * particle.velocity.x) / (this.mass + particle.mass);
      var otherFinalVXInNewCCS = ((2 * this.mass) * this.velocity.x + (particle.mass - this.mass) * particle.velocity.x) / (this.mass + particle.mass);
      this.velocity.setX(thisFinalVXInNewCCS).rotate(impactAngle);
      particle.velocity.setX(otherFinalVXInNewCCS).rotate(impactAngle);
      this.setVelocity(this.velocity);
      particle.setVelocity(particle.velocity);
      if (this.events.collision) {
        this.events.collision(this, particle, impactAngle, otherImpactAngle, impactPoint);
      }
    };
  
    //move particle
    Particle.prototype.translate = function() {
      var friction = 1 - this.friction;
      var previousVelocityX = this.position.x - this.previousPosition.x,
        previousVelocityY = this.position.y - this.previousPosition.y;
      this.velocity.setX((previousVelocityX * friction) + (this.force.x / this.mass));
      this.velocity.setY((previousVelocityY * friction) + (this.force.y / this.mass));
      this.previousPosition = this.position.clone();
      this.position.add(this.velocity);
    };
  
    //gravitate other particle(s)
    Particle.prototype.handleGravitation = function() {
      if (this.attractedTo.length) {
        for (var i = 0; i < this.attractedTo.length; i++) {
          this.gravitate(this.attractedTo[i]);
        }
      } else if (this.attractedTo instanceof Particle) {
        this.gravitate(this.attractedTo);
      }
    };
  
    //function to add event handlers to particle instances
    Particle.prototype.on = function(e, f) {
      this.events[e] = f;
    };
  
    //function that removes a specifies event handler from the particle
    Particle.prototype.removeEventHandler = function(e) {
      delete this.events[e];
    };
  
    //update particle's state
    Particle.prototype.update = function(world) {
      if (this.isControlled && !isEmpty(this.input)) {
        this.handleInput(this.input);
      }
      if (this.attractedTo) {
        this.handleGravitation();
      }
      if (world) {
        if (world.gravity && this.affectedByGravity) {
          this.force.add(world.gravity);
        }
        if (this.isTouchingEdge(world) && this.events.edge) {
          this.events.edge(this, world);
        }
        if (this.collidable && world.collidables) {
          for (var i = 0; i < world.collidables.length; i++) {
            if (world.collidables[i] !== this && this.collidingWith(world.collidables[i])) {
              this.handleCollision(world.collidables[i]);
            }
          }
        }
      }
      this.translate();
      if (this.trail) {
        this.trail.update(this.position);
      }
      this.resetForce();
      if (this.events.update) {
        this.events.update(this, world);
      }
    };
  
    //draw particle
    Particle.prototype.render = function(context) {
      if (this.trail) {
        this.trail.render(context);
      }
      context.save();
      context.beginPath();
      if (this.fillColor) {
        context.fillStyle = this.fillColor;
      }
      context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      context.fill();
      if (this.strokeColor) {
        context.lineWidth = this.radius / 15;
        context.strokeStyle = this.strokeColor;
        context.stroke();
      }
      context.restore();
    };
  
    /////////////////
    // -- WORLD -- //
    /////////////////
  
    //world constructor
    function World(context, options) {
      this.context = context;
      this.w = context.canvas.width;
      this.h = context.canvas.height;
      this.particles = [];
      this.collidables = [];
      this.frameID = -1;
      for (var option in options) {
        if (options.hasOwnProperty(option)) {
          this[option] = options[option];
        }
      }
    }
  
    //add particle to the world
    World.prototype.addParticle = function(particle) {
      if (particle.length) {
        for (var i = 0; i < particle.length; i++) {
          if (particle[i].collidable) {
            this.collidables.push(particle[i]);
          }
          this.particles.push(particle[i]);
        }
      } else if (this.particles.indexOf(particle) === -1) {
        if (particle.collidable) {
          this.collidables.push(particle);
        }
        this.particles.push(particle);
      }
    };
  
    //remove a particle (or all of them) from the world
    World.prototype.removeParticle = function(particle) {
      if (particle && this.particles.indexOf(particle) !== -1) {
        var index = this.particles.indexOf(particle);
        this.particles.splice(index, 1);
        if (particle.collidable) {
          var indexInCollidables = this.collidables.indexOf(particle);
          this.collidables.splice(indexInCollidables, 1);
        }
        for (var i = 0; i < this.particles.length; i++) {
          if (this.particles[i].attractedTo && this.particles[i].attractedTo.indexOf(particle) !== -1) {
            var particleIndex = this.particles[i].attractedTo.indexOf(particle);
            this.particles[i].removeFromAttractedTo(particle);
          }
        }
      } else {
        this.particles = [];
      }
    };
  
    //update world and its particles
    World.prototype.update = function() {
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].update(this);
      }
    };
  
    //render world and its elements
    World.prototype.render = function() {
      this.context.clearRect(0, 0, this.w, this.h);
      if (this.color) {
        paintWholeCanvas(this.context, this.color);
      }
      for (var i = 0; i < this.particles.length; i++) {
        if (this.particles[i].isOnScreen(this)) {
          this.particles[i].render(this.context);
        }
      }
    };
  
    //loop the update and render methods of the world object
    World.prototype.animate = function() {
      this.update(this);
      this.render(this.context);
      this.frameID = requestAnimationFrame(this.animate.bind(this, this.context));
    };
  
    //add things as properties to the object that will be exported
    MODULE.utils = utils;
    MODULE.Vector = Vector;
    MODULE.Particle = Particle;
    MODULE.World = World;
  
    //export module to the global namespace (remember to never pollute it with too many objects!)
    global.myParticles = MODULE;
  
  }(this));
  
  //////////////////////////////////////////////
  // -- MY GOOFY ENGINE'S DEMO STARTS HERE -- //
  //////////////////////////////////////////////
  
  (function() {
  
    //set up
    var c = document.getElementById('c'),
      $ = c.getContext('2d'),
      w = c.width = window.innerWidth,
      h = c.height = window.innerHeight;
  
    //get things from the myParticles object
    var randomInRange = myParticles.utils.randomInRange;
    var rad2deg = myParticles.utils.rad2deg;
    var Vector = myParticles.Vector;
    var Particle = myParticles.Particle;
    var World = myParticles.World;
  
    //create the world object that will contain all the thangs
    var world = new World($, {
      color: 'black'
    });
  
    //function that will be passed as collision event handler (changes hue of stroke based on impact angle)
    function changeStrokeHueBasedOnImpactAngle(p0, p1, impactAnglep0, impactAnglep1) {
      if (impactAnglep0 < 0) {
        impactAnglep0 = rad2deg(Math.PI * 2 + impactAnglep0);
      } else {
        impactAnglep0 = rad2deg(impactAnglep0);
      }
      if (impactAnglep1 < 0) {
        impactAnglep1 = rad2deg(Math.PI * 2 + impactAnglep1);
      } else {
        impactAnglep1 = rad2deg(impactAnglep1);
      }
      p0.strokeColor = 'hsl(' + impactAnglep0 + ', 100%, 50%)';
      p1.strokeColor = 'hsl(' + impactAnglep1 + ', 100%, 50%)';
    }
  
    //bounce edge handling
    function bounce(particle, world) {
      if (particle.position.x + particle.radius > world.w) {
        particle.position.setX(world.w - particle.radius);
        particle.velocity.setX(-particle.velocity.x);
        particle.setVelocity(particle.velocity);
      }
      if (particle.position.x - particle.radius < 0) {
        particle.position.setX(0 + particle.radius);
        particle.velocity.setX(-particle.velocity.x);
        particle.setVelocity(particle.velocity);
      }
      if (particle.position.y + particle.radius > world.h) {
        particle.position.setY(world.h - particle.radius);
        particle.velocity.setY(-particle.velocity.y);
        particle.setVelocity(particle.velocity);
      }
      if (particle.position.y - particle.radius < 0) {
        particle.position.setY(0 + particle.radius);
        particle.velocity.setY(-particle.velocity.y);
        particle.setVelocity(particle.velocity);
      }
    }
  
    //choose number of particles based on how big the screen roughly is
    var numberOfParticles;
    if (w * h < 300000) {
      numberOfParticles = 100;
    } else if (w * h < 600000) {
      numberOfParticles = 150;
    } else if (w * h < 800000) {
      numberOfParticles = 200;
    } else {
      numberOfParticles = 300;
    }
    
    //function to make sure the particles aren't overlapping when put into the world (will put ~50 less particles in the world than specified)
    function checkInitialOverlap (particle, world, tries) {
          if(tries === undefined){ tries = 0; }
          if(tries >= 0){
              for(var i=0; i < world.particles.length; i++){
                  if(particle.overlaps(world.particles[i])){
                      particle.x = w * Math.random(); 
                      particle.y = h * Math.random();
                      particle.radius = randomInRange(5, 20);
                      return checkInitialOverlap(particle, world, tries - 1);
                  }
              }
              world.addParticle(randomParticle);
          }
      }
  
    //create particles, add them to the world object and add event handlers
    for (var i = 0; i < numberOfParticles; i++) {
      var randomParticle = new Particle(w * Math.random(), h * Math.random(), randomInRange(5, 20), {
        fillColor: 'black',
        strokeColor: 'white',
        collidable: true,
        mass: randomInRange(1, 4),
        velocity: new Vector(randomInRange(-2, 2), randomInRange(-2, 2))
      });
      randomParticle.on('collision', changeStrokeHueBasedOnImpactAngle);
      randomParticle.on('edge', bounce);
      if(world.particles.length){
              checkInitialOverlap(randomParticle, world);
          } else {
              world.addParticle(randomParticle);
          }
    }
  
    //start animation!
    world.animate();
  
  }());
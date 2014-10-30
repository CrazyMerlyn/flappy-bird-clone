'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);
  
  // Create and add the Top pipe in the group
  this.topPipe = new Pipe(this.game, 0, 0, 0);
  this.add(this.topPipe);
  
  // Create and add the Top pipe in the group
  // 440 is height of pipe + 5 * height of bird
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.bottomPipe);
  
  // A variable to check if this pipe has already been counted in the score
  this.hasScored = false;
  
  // Make the pipes move left
  this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
    this.checkWorldBounds();
};

PipeGroup.prototype.checkWorldBounds = function() {
    if (!this.topPipe.inWorld) {
        this.exists = false;
    }
};

PipeGroup.prototype.reset = function(x, y) {
    // Reset both the pipes
    this.topPipe.reset(0, 0);
    this.bottomPipe.reset(0, 440);
    
    // Set the new position of pipeGroup
    this.x = x;
    this.y = y;
    
    // Reset the velocity of the pipes
    this.setAll('body.velocity.x', -200);
    
    // Reset hasScored variable
    this.hasScored = false;
    
    // Reset exists variable
    this.exists = true;
};

module.exports = PipeGroup;

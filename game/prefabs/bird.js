'use strict';

var Bird = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'bird', frame);
    
    // Set the sprite's anchor to the center
    this.anchor.setTo(0.5, 0.5);
    
    // Set a bird to be dead by default
    this.alive = false;
    
    // Add and play animation
    this.animations.add('flap');
    this.animations.play('flap', 12, true);
    
    // Enable Physics on the bird
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
    // Increse angle untill it reaches 90 degrees
    if (this.angle < 90 && this.alive)
    {
        this.angle += 2.5;
    }
};

Bird.prototype.flap = function() {
    // Give the bird an upvard velocity
    this.body.velocity.y = -400;
    
    // Rotate the bird when flapping
    this.game.add.tween(this).to({angle: -40}, 100).start();
};

module.exports = Bird;

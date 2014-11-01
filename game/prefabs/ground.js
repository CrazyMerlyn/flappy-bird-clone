'use strict';

var Ground = function(game) {
    Phaser.TileSprite.call(this, game, 0, 400, 335, 112, 'ground');
    
    // Start scrolling the ground
    this.autoScroll(-200, 0);
    
    // Enable physics on the ground for collision detection
    this.game.physics.arcade.enableBody(this);
    
    // Don't allow ground to fall by gravity
    this.body.allowGravity = false;
    
    // Make ground immovable
    this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {

    // write your prefab's specific update code here

};

module.exports = Ground;

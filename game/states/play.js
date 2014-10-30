
  'use strict';
  
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  
  function Play() {}
  Play.prototype = {
    create: function() {
        // Start the arcade physcocs system 
        // and set global gravity
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;
        
        // Add the background sprite
        this.background = this.game.add.sprite(0, 0, 'background');
        
        // Create a new Bird Object
        // and add it to the game
        this.bird = new Bird(this.game, 100, this.game.height/2);
        this.game.add.existing(this.bird);
        
        // Create and add the ground
        this.ground = new Ground(this.game, 0, 400, 335, 112);
        this.game.add.existing(this.ground);
        
        // Keep the spacebar key from propagating to the browser
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
        // Add keyboard controls to the game
        var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        flapKey.onDown.add(this.bird.flap, this.bird);
        
        // Add mouse/touch controls
        this.input.onDown.add(this.bird.flap, this.bird);
    },
    update: function() {
        // Make the bird collide with ground
        this.game.physics.arcade.collide(this.bird, this.ground);
    }
  };
  
  module.exports = Play;

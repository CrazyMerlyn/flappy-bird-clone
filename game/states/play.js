
  'use strict';
  
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');
  
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
        
        // A group to hold and recycle pipes
        this.pipes = this.game.add.group();
        
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
        
        // Add a timer
        this.pipeGenerator = this.game.time.events.loop(
                Phaser.Timer.SECOND * 1.5,
                this.generatePipes,
                this
        );
        this.pipeGenerator.timer.start();
    },
    
    update: function() {
        // Make the bird collide with ground
        this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
        
        // Make bird collide with the pipes
        this.pipes.forEach(function (pipeGroup){
            this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
        }, this);
    },
    
    generatePipes: function() {
        var pipeY = this.game.rnd.integerInRange(-100, 100);
        
        // Get the first non-existant pipe in the group 'pipes'
        var pipeGroup = this.pipes.getFirstExists(false);
        
        // If there was no non-exisant pipe, make a new one
        if (!pipeGroup)
        {
            pipeGroup = new PipeGroup(this.game, this.pipes);
        }
        
        pipeGroup.reset(this.game.width, pipeY);
    },
    
    deathHandler: function() {
        this.game.state.start('gameover');
    },
    
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        this.pipes.destroy();
    }
  };
  
  module.exports = Play;

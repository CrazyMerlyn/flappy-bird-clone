
  'use strict';
  
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');
  var Scoreboard = require('../prefabs/scoreboard');
  
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
        flapKey.onDown.addOnce(this.startGame, this);
        
        // Add mouse/touch controls
        this.input.onDown.add(this.bird.flap, this.bird);
        this.input.onDown.addOnce(this.startGame, this);
        
        // Add a group to show instructions on how to play the game
        this.instructionGroup = this.game.add.group();
        this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
        this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'));
        this.instructionGroup.setAll('anchor.x', 0.5);
        this.instructionGroup.setAll('anchor.y', 0.5);
        
        // Add scoring
        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(), 24);
        this.scoreText.visible = false;
        
        this.scoreboard = new Scoreboard(this.game);
        
        // Sound made when the player scores
        this.scoreSound = this.game.add.audio('score');
    },
    
    update: function() {
        // Make the bird collide with ground
        this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
        
        // Make bird collide with the pipes
        this.pipes.forEach(function (pipeGroup){
            this.checkScore(pipeGroup);
            this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
        }, this);
    },
    
    startGame: function() {
        // Activate gravity and rotation on bird
        this.bird.body.allowGravity = true;
        this.bird.alive = true;
        
        // Add a timer
        this.pipeGenerator = this.game.time.events.loop(
                Phaser.Timer.SECOND * 1.5,
                this.generatePipes,
                this
        );
        this.pipeGenerator.timer.start();
        
        // Make score visible
        this.scoreText.visible = true;
        
        // Remove the instructions
        this.instructionGroup.destroy();
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
    
    checkScore: function(pipeGroup) {
        // Nothing to do if bird is dead
        if (!this.bird.alive) return;
        
        if (pipeGroup.exists && !pipeGroup.hasScored &&
                pipeGroup.topPipe.world.x <= this.bird.world.x)
        {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
    },
    
    deathHandler: function() {
        // Kill the bird
        this.bird.alive = false;
        this.input.onDown.removeAll();
        
        // Stop the pipes and ground
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
        
        // Add scoreboard to the game
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
    },
    
    shutdown: function() {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.bird.destroy();
        this.pipes.destroy();
        this.scoreboard.destroy();
    }
  };
  
  module.exports = Play;

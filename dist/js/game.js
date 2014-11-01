(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappy-bird');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
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
    
    // Sound made when the bird flaps
    this.flapSound = this.game.add.audio('flap');
    
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
    this.flapSound.play();
    // Give the bird an upvard velocity
    this.body.velocity.y = -400;
    
    // Rotate the bird when flapping
    this.game.add.tween(this).to({angle: -40}, 100).start();
};

module.exports = Bird;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'pipe', frame);
    
    this.anchor.setTo(0.5, 0.5);
    
    // Enable physics on the pipe and make it immovable
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
    
};

module.exports = Pipe;

},{}],5:[function(require,module,exports){
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

},{"./pipe":4}],6:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) {
    Phaser.Group.call(this, game);
    
    var gameover = this.create(this.game.width/2, 100, 'gameover');
    gameover.anchor.setTo(0.5, 0.5);
    
    var scoreboard = this.create(this.game.width/2, 200, 'scoreboard');
    scoreboard.anchor.setTo(0.5, 0.5);
    
    this.scoreText = this.game.add.bitmapText(this.width, 180, 'flappyfont', '', 18);
    this.add(this.scoreText);

    this.bestScoreText = this.game.add.bitmapText(this.width, 230, 'flappyfont', '', 18);
    this.add(this.bestScoreText);
    
    // add our start button with a callback
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5,0.5);
    this.add(this.startButton);
    
    this.y = this.game.height;
    this.x = 0;
    
    //this.setAll('body.enable', false);
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {
    
};

Scoreboard.prototype.startClick = function() {
    this.game.state.start('play');
};

Scoreboard.prototype.show = function(score) {
    var medal, bestScore;
    
    // Set the score in the score board
    this.scoreText.setText(score.toString());
    
    if (!!localStorage)
    {
        bestScore = localStorage.getItem('bestScore');
        
        if (!bestScore || bestScore < score)
        {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
    }
    else
    {
        // Local Storage is not available
        bestScore = 'N/A';
    }
    
    this.bestScoreText.setText(bestScore.toString());
    
    /*if(score >= 1 && score < 20)
    {
        //medal = this.game.add.sprite(-65 , 7, 'medals', 1);
        medal = this.create(65 , 7, 'medals', 1);
        this.add(medal);
        medal.anchor.setTo(0.5, 0.5);
    }
    else if(score >= 20)
    {
        medal = this.game.add.sprite(-65 , 7, 'medals', 0);
        medal.anchor.setTo(0.5, 0.5);
        this.add(medal);
    }*/
    
    /*if (medal)
    {
        var emitter = this.game.add.emitter(medal.x, medal.y, 5);
        this.addChild(emitter);
        emitter.width = medal.width;
        emitter.height = medal.height;

        emitter.makeParticles('particle');

        emitter.setRotation(-100, 100);
        emitter.setXSpeed(0,0);
        emitter.setYSpeed(0,0);
        emitter.minParticleScale = 0.25;
        emitter.maxParticleScale = 0.5;
        emitter.setAll('body.allowGravity', false);
        emitter.setAll('body.enable', false);

        emitter.start(false, 1000, 1000);
  }*/
  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Linear.None, true);
};

module.exports = Scoreboard;

},{}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';

var Ground = require('../prefabs/ground');

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
      // Add background to the game
      this.background = this.game.add.sprite(0, 0, 'background');
      
      // Add the ground sprite to the game
      this.ground = new Ground(this.game);
      this.game.add.existing(this.ground);
      
      // A group to hold the the title and the bird
      this.titleGroup = this.game.add.group();
      
      // Create and the title sprite to the group
      this.title = this.game.add.sprite(0, 0, 'title');
      this.titleGroup.add(this.title);
      
      // Create and add the bird sprite to the title group
      this.bird = this.game.add.sprite(200, 5, 'bird');
      this.titleGroup.add(this.bird);
      
      // Add animation to the bird
      this.bird.animations.add('flap');
      this.bird.animations.play('flap', 12, true);
      
      // Set the origin of the title group
      this.titleGroup.x = 30;
      this.titleGroup.y = 100;
      
      // Make the whole title group oscillate
      // Format is:
      // this.game.add.tween(object).to(properties, duration, ease, autoStart, delay, repeat, yoyo);  
      this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
      
      // Add a start button with a callback
      this.startButton = this.game.add.button(
          this.game.width/2,
          300,
          'startButton',
          this.startClick,
          this
      );
      this.startButton.anchor.setTo(0.5, 0.5);
  },
  startClick: function() {
      // Start the 'play' state
      this.game.state.start('play');
  },
  update: function() {
      
  }
};

module.exports = Menu;

},{"../prefabs/ground":3}],9:[function(require,module,exports){

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

},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipeGroup":5,"../prefabs/scoreboard":6}],10:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
    preload: function() {
        this.asset = this.add.sprite(this.game.width/2, this.game.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);
        
        // Set the preloader gif
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);
        
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('startButton', 'assets/start-button.png');
        
        // Load 3 34x24 px frames frome the spritesheet
        this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
        
        // Load 2 54x320 px frames from pipes spritesheet
        this.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2);
        
        this.load.image('instructions', 'assets/instructions.png');
        this.load.image('getReady', 'assets/get-ready.png');
        
        this.load.image('scoreboard', 'assets/scoreboard.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);
        
        // Sounds used in the game
        this.load.audio('score', 'assets/score.wav');
        this.load.audio('flap', 'assets/flap.wav');
        this.load.audio('pipeHit', 'assets/pipe-hit.wav');
        this.load.audio('groundHit', 'assets/ground-hit.wav');
        
        this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png',
                            'assets/fonts/flappyfont/flappyfont.fnt');
    },
    create: function() {
        this.asset.cropEnabled = false;
    },
    update: function() {
        if (!!this.ready) {
            this.game.state.start('menu');
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preload;

},{}]},{},[1])
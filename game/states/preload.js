
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
    preload: function() {
        this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader');
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

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

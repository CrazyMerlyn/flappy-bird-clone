
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
      // Add background to the game
      this.background = this.game.add.sprite(0, 0, 'background');
      
      // Add the ground sprite as a tile
      // And start Scrolling in the negative x direction
      this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
      this.ground.autoScroll(-200, 0);
      
      // A group to hold the the title and the bird
      this.titleGroup = this.game.add.group();
      
      // Create and the title sprite to the group
      this.title = this.game.add.sprite(0, 0, 'title');
      this.titleGroup.add(this.title);
      
      // Create and add the bird sprite to the title group
      this.bird = this.game.add.sprite(200, 5, 'bird');
      this.titleGroup.add(this.bird);
      
      // Add an animation to the bird
      // and play it in a loop (@12 frames/sec)
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

'use strict';

var Game = {
  // Initialize and start our game
  start: function () {
    Crafty.load(['images/disk.png', 'images/arm.png'], function () {

      // Start crafty and set a background color so that we can see it's working
      Crafty.init(500, 500);

      // Show the load scene
      Crafty.scene('Main');
    });
  }
};

Game.start();

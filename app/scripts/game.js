'use strict';

window.Game = {
    armMinRotation: -12,
    armMaxRotation: 30,
    // Initialize and start our game
    start: function() {
        Crafty.load(['images/disk.png', 'images/arm.png'], function() {

            // Start crafty and set a background color so that we can see it's working
            Crafty.init(250, 250, document.getElementById('game'));

            // Show the load scene
            Crafty.scene('Main');
        });
    },
    startDiskRotation: function() {
        var disk = Crafty("disk");
        if (disk) {
            disk.bind('EnterFrame', function() {
                this.rotation = this.rotation - 1;
            });
        } else {
            console.log('error getting disk entity');
        }
    },
    stopDiskRotation: function() {
        var disk = Crafty("disk");
        if (disk) {
            disk.unbind('EnterFrame');
        } else {
            console.log('error getting disk entity');
        }
    },
    moveArm: function(track, maxTrack, time) {
        var arm = Crafty("arm");
        if (arm) {
            var rotation = track*(this.armMaxRotation - this.armMinRotation)/maxTrack + this.armMinRotation;
            arm.tween({rotation: rotation}, time);
        } else {
            console.log('error getting disk entity');
        }
    }
};

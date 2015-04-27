Crafty.scene('Main', function() {
    Crafty.background('#FFFFFF');
    Crafty.sprite(350, "images/disk.png", {
        disk: [0, 0]
    });
    Crafty.sprite(424, "images/arm.png", {
        arm: [0, 0]
    });
    var disk = Crafty.e("2D, Canvas, disk")
        .attr({
            x: 0,
            y: 0,
            w: 200,
            h: 200
        });
        disk.origin(100,100);
    var armSize = 150;
    var arm = Crafty.e("2D, Canvas, arm, Tween")
        .attr({
            x: 75,
            y: 100,
            w: armSize,
            h: armSize
        });
    arm.origin(364*armSize/424, 206*armSize/424);
}, function() {
    // destructor
});

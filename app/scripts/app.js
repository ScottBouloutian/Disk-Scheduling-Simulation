require('scripts/components/*');
require('scripts/scenes/*');

require('scripts/game');

Crafty.debugBar.show();

$(document).ready(function() {
    Game.start();
    $('#run_sim-btn').click(function() {
        console.log('clicked');
        $('#simulator').css('height', '1500px');
        $('#results-controls').css('visibility', 'visible');
        $('html, body').animate({
            scrollTop: $(document).height()
        }, 'slow');
        runSimulation();
    });
});

function runSimulation() {
    // Start rotating the disk
    Game.startDiskRotation();

    // Retrieve and parse the initial track text
    var initialTrack = parseInt($('#init_track-text').val());
    if(isNaN(initialTrack)) {
        console.log('invalid initial track');
        return;
    }

    // Retrieve and parse the tail track text
    var tailTrack = parseInt($('#tail_track-text').val());
    if(isNaN(tailTrack)) {
        console.log('invalid tail track');
        return;
    }

    // Retrieve and parse the queue text
    var queue = parseQueueText();
    if(queue.length > 0) {
        console.log(queue);
    } else {
        console.log('queue text could not be parsed');
        return;
    }

    // Retrieve and parse the algorithm to use
    var checkedValue = $(':radio:checked').val();
    var algorNum = parseInt(checkedValue);
    var result;
    switch(algorNum) {
        case 0:
            result = fcfs(queue);
            break;
        case 1:
            result = sstf(queue, initialTrack);
            break;
        case 2:
            result = scan(queue);
            break;
        case 3:
            result = fcfs(queue);
            break;
        case 4:
            result = fcfs(queue);
            break;
        case 5:
            result = fcfs(queue);
            break;
        default:
            console.log('problem selecting an algorithm');
            return;
    }

    // Stringify and display the results
    $('#results-controls textarea').val(result);

    // Run a simulation of the results
    simulate(result, initialTrack, tailTrack, function() {

        // Stop disk rotation
        Game.stopDiskRotation();

    });

}

function parseQueueText(tailTrack) {
    var text = $('#queue-controls textarea').val();
    var queueStrings = text.split(',');
    var queue = [];
    for(var i=0;i<queueStrings.length;i++) {
        var num = parseInt(queueStrings[i]);
        if(isNaN(num) || num<0 || num>tailTrack) {
            return [];
        } else {
            queue.push(num);
        }
    }
    return queue;
}

// First Come-First Serve
function fcfs(queue) {
    return queue;
}

// Shortest Seek Time First
function sstf(queue, initialTrack) {
    var result = [];
    var currentTrack = initialTrack;
    for(var j = 0;j<8;j++) {
        var min = {
            track: queue[0],
            index: 0
        }
        for(var i=1;i<queue.length;i++) {
            if(Math.abs(queue[i]-currentTrack) < Math.abs(min.track-currentTrack)) {
                min.track = queue[i];
                min.index = i;
            }
        }
        result.push(min.track);
        currentTrack = min.track;
        queue.splice(min.index,1);
    }
    return result;
}

// Elevator
function scan(queue, initialTrack) {

}

// Circular SCAN
function cscan() {

}

// LOOK
function look() {

}

// C-LOOK
function clook() {

}

function simulate(trackNumbers, initialTrack, maxTrack, callback) {
    var currentTrackText = $('#current-text');
    var nextTrackText = $('#next-text');
    var headMovementsText = $('#total-text');
    var currentHeadPosition = initialTrack;
    var headMovements = 0;
    var index = 0;
    var time = 100;
    var interval = setInterval(function() {
        var current = trackNumbers[index];
        var next;
        if(index===trackNumbers.length - 1) {
            next = 'none';
        } else {
            next = trackNumbers[index+1];
        }
        headMovements += Math.abs(currentHeadPosition - current);
        var total = headMovements;
        currentHeadPosition = current;
        currentTrackText.text('Current Track: ' + current);
        nextTrackText.text('Next Track: ' + next);
        headMovementsText.text('HeadMovements: ' + total);
        Game.moveArm(current, maxTrack, time/2);
        index++;
        if(index === trackNumbers.length) {
            clearInterval(interval);
            callback();
        }
    }, time);
}

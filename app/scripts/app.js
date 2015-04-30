require('scripts/components/*');
require('scripts/scenes/*');

require('scripts/game');
require('scripts/algorithm');

Crafty.debugBar.show();

// The descriptions of the algorithms to use on the ui
var algorDesc = [
    'The first come first serve scheduling algorithm is the most intuitive one. Requests are serviced in the order in which they arrive. While this approach is fair in terms of not leading to starvation, it is the least optimal requiring the most track movements.',
    'The shortest seek time first algorithm services requests by accepting the track closest to where the head is currently located. While this appraoch requires fewer head movements than FCFS, it may lead to starvation.',
    'The elevator algorithm initially seeks towards the closest end of the disk. When it reached the end, the seek direction is reversed until all remaining requests are serviced.',
    'The Circular SCAN algorithm initially seeks towards the closest end of the disk. When the end is reached, the disk head jumps to the other end of the disk. Remaining requests are serviced by scanning in the same initial direction.',
    'The LOOK algorithm initially seeks towards the closest end of the disk. When the last request in this direction is serviced, the scan direction is reversed. All remaining requests are then serviced.',
    'The C-LOOK algorithm initially seeks towards the closest end of teh disk. When the last request in this direction is serviced, the disk head jumps to the furthest track in need of attention. All remaining requests are then serviced by scanning in the same initial direction.',
];

// When the document is ready
$(document).ready(function() {
    createRadios();
    Game.start();

    // Algorithm description element
    var algorDescElem = $('p#algor_desc');

    // Set the initial content of the algorithm descriptor
    algorDescElem.text(algorDesc[0]);

    // Fetch the required elements from the DOM
    var ui = {
        running_sim: $('.animation_only'),
        headMovements: $('#total-text')
    }

    // Run simulation button click
    $('#run_sim-btn').click(function() {
        console.log('clicked');
        $('#simulator').css('height', '1500px');
        $('#results-controls').css('visibility', 'visible');
        $('html, body').animate({
            scrollTop: $(document).height()
        }, 'slow');
        runSimulation(ui);
    });

    // Algorithm selection hover event
    $('label.radio').hover(function() {
        var value = parseInt($(this).find('input:radio').val());
        if(isNaN(value)) {
            console.log('error getting radio value');
        } else {
            algorDescElem.text(algorDesc[value]);
        }
    }, function() {
        var algorNum = parseInt($(':radio:checked').val());
        if(isNaN(algorNum)) {
            console.log('error finding checked radio');
        } else {
            algorDescElem.text(algorDesc[algorNum]);
        }
    });


});

function createRadios() {
    var radioLabels = ['First Come-First Serve (FCFS)', 'Shortest Seek Time First (SSTF)', 'Elevator (SCAN)', 'Circular SCAN (C-SCAN)', 'LOOK', 'C-LOOK'];
    radioLabels.forEach(function(label, index) {
        var radioId = 'radio' + (index + 1);
        var radioValue = '"' + index + '"';
        var inputParams = '';
        if(index===0) {
            inputParams = inputParams + 'checked="checked"';
        }
        var radioHtml = '<label class="radio" for="' + radioId + '"><input type="radio" name="algor" value=' + radioValue + ' id="' + radioId +
            '" data-toggle="radio" class="custom-radio"' + inputParams + '></input><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span>' + label + '</label>';
        var radioFragment = document.createElement('div');
        radioFragment.innerHTML = radioHtml;
        var element = document.getElementById('algor-radio');
        element.appendChild(radioFragment);
    });
}

function runSimulation(ui) {

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
            result = Algorithm.fcfs(queue);
            break;
        case 1:
            result = Algorithm.sstf(queue, initialTrack);
            break;
        case 2:
            result = Algorithm.scan(queue, initialTrack, tailTrack);
            break;
        case 3:
            result = Algorithm.cscan(queue, initialTrack, tailTrack);
            break;
        case 4:
            result = Algorithm.look(queue, initialTrack, tailTrack);
            break;
        case 5:
            result = Algorithm.clook(queue, initialTrack, tailTrack);
            break;
        default:
            console.log('problem selecting an algorithm');
            return;
    }

    // Stringify and display the results
    $('#results-controls textarea').val(result);

    // Retrieve the animation checkbox value
    var useAnimations = $('#anim-check').prop('checked');
    if(useAnimations) {
        ui.running_sim.css('visibility', 'visible');
        // Start rotating the disk
        Game.startDiskRotation();

        // Run a simulation of the results
        simulate(result, initialTrack, tailTrack, function() {

            // Stop disk rotation
            Game.stopDiskRotation();

        });
    } else {
        ui.running_sim.css('visibility', 'hidden');
        ui.headMovements.text('0');
    }

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

// Returns the closest element in the queue to the given track.
// Elements in the queue are only looked at in a certain sequential direction from the given track.
// -1 -> left scan direction
// 0 -> any scan direction
// 1 -> right scan direction
function closestTrack(queue, track, direction) {
    var min = {
        track: -1,
        index: -1,
        dist: Number.MAX_VALUE
    }
    for(var i=0;i<queue.length;i++) {
        var dist;
        if (direction === 0) {
            dist = Math.abs(queue[i] - track);
        } else {
            dist = direction * (queue[i] - track);
        }
        if(dist > -1 && dist < min.dist) {
            min.track = queue[i];
            min.index = i;
            min.dist = dist;
        }
    }
    return min;
}

function simulate(trackNumbers, initialTrack, maxTrack, callback) {
    // DOM elements
    var currentTrackText = $('#current-text');
    var nextTrackText = $('#next-text');
    var headMovementsText = $('#total-text');

    var currentHeadPosition = initialTrack;
    var headMovements = 0;
    var index = 0;
    var time = 500;
    var interval = setInterval(function() {
        var current = trackNumbers[index];
        var next;
        if(index===trackNumbers.length - 1) {
            next = 'none';
        } else {
            next = trackNumbers[index+1];
        }
        if(isNaN(current)) {
            switch(current) {
                case 'seek':
                    break;
                case 'jump':
                    // Discount a jump as a head movement
                    headMovements = headMovements - Math.abs(currentHeadPosition - next) % maxTrack;
                    break;
                default:
                    console.log('error has occurred');
            }
        } else {
            headMovements = headMovements + Math.abs(currentHeadPosition - current) % maxTrack;
            currentHeadPosition = current;

            // Update the user interface
            currentTrackText.text('Current Track: ' + current);
            nextTrackText.text('Next Track: ' + next);
            headMovementsText.text('HeadMovements: ' + headMovements);

            // Move the disk arm
            Game.moveArm(current, maxTrack, time/2);
        }
        index++;
        if(index === trackNumbers.length) {
            clearInterval(interval);
            callback();
        }
    }, time);
}

'use strict';

window.Algorithm = {
    // First Come-First Serve
    fcfs: function(queue) {
        var result = [];
        while (queue.length > 0) {
            var t = queue.shift();
            result.push(t);
        }
        return result;
    },
    // Shortest Seek Time First
    sstf: function(queue, initialTrack) {
        var result = [];
        var currentTrack = initialTrack;
        while (queue.length > 0) {
            var min = closestTrack(queue, initialTrack, 0);
            queue.splice(min.index, 1);
            result.push(min.track);
            currentTrack = min.track;
        }
        return result;
    },
    // Elevator
    scan: function(queue, initialTrack, tailTrack) {
        var result = [];
        var scanDirection = 1;
        if (initialTrack < tailTrack / 2) {
            scanDirection = -1;
        }
        var currentTrack = initialTrack;
        while (queue.length > 0) {
            var min = closestTrack(queue, currentTrack, scanDirection);
            if (min.track === -1) {
                if (scanDirection === 1) {
                    result.push('seek');
                    result.push(tailTrack);
                    currentTrack = tailTrack;
                } else {
                    result.push('seek');
                    result.push(0);
                    currentTrack = 0;
                }
                scanDirection *= -1;
            } else {
                queue.splice(min.index, 1);
                result.push(min.track);
                currentTrack = min.track;
            }
        }
        return result;
    },
    // Circular SCAN
    cscan: function(queue, initialTrack, tailTrack) {
        var result = [];
        var scanDirection = 1;
        if (initialTrack < tailTrack / 2) {
            scanDirection = -1;
        }
        var currentTrack = initialTrack;
        while (queue.length > 0) {
            var min = closestTrack(queue, currentTrack, scanDirection);
            if (min.track === -1) {
                if (scanDirection === 1) {
                    result.push('seek');
                    result.push(tailTrack);
                    result.push('jump');
                    result.push(0);
                    currentTrack = 0;
                } else {
                    result.push('seek');
                    result.push(0);
                    result.push('jump');
                    result.push(tailTrack);
                    currentTrack = tailTrack;
                }
            } else {
                queue.splice(min.index, 1);
                result.push(min.track);
                currentTrack = min.track;
            }
        }
        return result;
    },
    // LOOK
    look: function(queue, initialTrack, tailTrack) {
        var result = [];
        var scanDirection = 1;
        if (initialTrack < tailTrack / 2) {
            scanDirection = -1;
        }
        var currentTrack = initialTrack;
        while (queue.length > 0) {
            var min = closestTrack(queue, currentTrack, scanDirection);
            if (min.track === -1) {
                scanDirection *= -1;
            } else {
                queue.splice(min.index, 1);
                result.push(min.track);
                currentTrack = min.track;
            }
        }
        return result;
    },
    // C-LOOK
    clook: function(queue, initialTrack, tailTrack) {
        var result = [];
        var scanDirection = 1;
        if (initialTrack < tailTrack / 2) {
            scanDirection = -1;
        }
        var currentTrack = initialTrack;
        console.log(queue);
        while (queue.length > 0) {
            var min = closestTrack(queue, currentTrack, scanDirection);
            console.log(min);
            if (min.track === -1) {
                result.push('jump');
                if (scanDirection === 1) {
                    currentTrack = 0;
                } else {
                    currentTrack = tailTrack;
                }
            } else {
                queue.splice(min.index, 1);
                result.push(min.track);
                currentTrack = min.track;
            }
        }
        return result;
    }
};

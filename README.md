# Disk-Scheduling-Simulation
This project is a disk scheduling simulation program for my Operating Systems class. Some background on the algorithms used in this simulation can be found at the following link:

http://www.cs.iit.edu/~cs561/cs450/disksched/disksched.html

## Get Up and Running

First, clone this repository. Install the necessary dependencies with the following commands:

```
bower install
npm install
```

Run `grunt serve` to launch the app in a browser.

Run `grunt build` to create a distribution-ready version of the app. This is what would be used if you wanted to launch this app as a website.

## Using this Fantastic App

![alt tag](https://github.com/ScottBouloutian/Disk-Scheduling-Simulation/blob/master/ui.png?raw=true)

**Disk Queue** - The disk queue is the current queue of tracks that need to be visited on the disk. These values must be in the range of *zero* to *tail track* inclusive.

**Scheduling Algorithm** - This is where you can select the scheduling algorithm you want to simulate.

**Options** - This is where you can adjust some options pertaining to the simulator. The initial track field lets you choose which track the arm of the disk starts at. The tail track field lets you choose a number that will correspond to the largest possible track number. If the randomize queue checkbox is checked a queue size field will also become visible. This field specifies the size of the queue that you want to be randomly generated. Lastly, there is a use animations checkbox. When checked, an animated disk will appear in the results pane upon running the simulation.

**Run Simulation** - When you click run simulation, the window will scroll to the bottom, and a results pane will become visible.

**Simulation Results** - The simulation results section contains a text area displaying the order of event taken by the disk arm under the selected scheduling algorithm. Sometimes the output may contain the words "seek" or "jump". Each word will be followed by a number.

**seek,0** - Means that the arm seeked to track zero but did not do anything along the way.

**jump,199** - Means that the arm jumped to track 199. Note that jump length does not contribute to head movements.

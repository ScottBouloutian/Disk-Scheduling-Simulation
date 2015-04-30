# Disk-Scheduling-Simulation
A disk scheduling simulation program for my Operating Systems class.

bower install
npm install
grunt serve

Disk Queue
The disk queue is the current queue of tracks that need to be visited on the disk.

Scheduling Algorithm
This is where you can select the scheduling algorithm you want to simulate.

Options
This is where you can adjust some options pertaining to the simulator. The initial track field lets you choose which track the arm of the disk starts at. The tail track field lets you choose a number that will correspond to the largest possible track number.

Run Simulation
When you click run simulation, the window will scroll to the bottom, and a results pane will become visible.

Simulation Results
The simulation results section contains a text area displaying the order of event taken by the disk arm under the selected scheduling algorithm. Sometimes the output may contain the words "seek" or "jump". Each word will be followed by a number.

seek,0 Means that the arm seeked to track zero but did not do anything along the way

jump,199 Means that the arm jumped to track 199. Note that jump length does not contribute to head movements.

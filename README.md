# Project Echo: Network Fault Diagnosis and Resilience Analysis System
1. Project Overview
Project Echo is an interactive network simulation and automated fault-diagnosis system designed to help users create virtual computer networks, test communication between devices, identify network failures, and analyze the impact of those failures.
In simple words, Echo allows users to build a computer network virtually, send data between computers, intentionally create network problems, and then find out what went wrong, why it happened, which devices are affected, and how the problem can be solved.
Unlike a basic network simulator that mainly demonstrates how networks work, Echo focuses on understanding and diagnosing network failures.

2. How does it work?
Imagine creating a network containing:
3 Routers
3 Switches
9 Computers
Computer 1 wants to send data to Computer 8.
Now if the connection between Router 1 and Router 2 is broken.
When Computer 1 tries to communicate with Computer 8:
Echo simulates the packet transmission.
The packet cannot reach its destination.
Echo examines the network connections and routing information.
It identifies the likely cause of the failure.
It checks whether another route is available.
It identifies other computers that might be affected.
It generates a diagnostic report explaining the problem and possible solution.
This is the central idea behind Echo.

3. Main Functionalities
   Network Topology Designer
Users can:
Add computers, routers, and switches.
Connect devices through virtual cables.
Move, edit, and remove devices.
Configure basic device properties, such as IP addresses and ports.

   Network Simulation
Users can:
Select a source and destination computer.
Send simulated packets.
Watch packets travel through the network.
See the transmission path and delivery status.

   Fault Injection
Users can intentionally introduce network problems:
Break a connection.
Disable a router or switch.
Remove or misconfigure a routing entry.
Restore a failed connection or device.

   Automated Fault Diagnosis
Echo analyzes failed communication and identifies possible causes.
For example:
Broken connection between two routers.
Destination network unreachable.
Router unavailable.
Missing routing entry.
It also explains the evidence supporting its diagnosis.

   Alternative Route Detection
If the primary communication path fails, Echo:
Searches for another available path.
Displays the alternative route.
Checks whether the destination can still be reached.

   Network Resilience Analysis
Echo evaluates how the network behaves when devices or connections fail.
It can:
Count reachable and unreachable computers.
Identify affected devices.
Compare network connectivity before and after a failure.
Show whether alternative routes maintain communication.

   Diagnostic Reports
Echo generates reports containing:
Source and destination.
Transmission status.
Detected fault.
Supporting evidence.
Affected devices.
Alternative route, if available.
Recommended solution.

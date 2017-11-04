# **Inquisitor**

## **Team Members**

* ### Christopher Tran
  #### RIT Computer Security Class of 2018
  #### ctt1414@rit.edu

* ### Alex Lunderman
  #### RIT Computer Security Class of 2018
  #### aml5666@rit.edu

## ** Requirements **
  * [Moloch](https://molo.ch)

## **What Inquisitor Does....**
The goal of our project is to utilize various Layer 7 data by inspecting protocols that may identify a machine through intricacies in protocol usage. For example, we may identify a Windows machine by observing its usage of MDNS, WINS, and WPAD. This information would be useful in detecting rogue or unauthorized nodes on a network. This approach involves creating a model of the system in a known-good state and tagging behavior that does not match that model. We will present this information to the analyst through utilizing different symbols attached to the common identifier (in this case, it will be the machine’s MAC address) and displaying it next to the known-good model so that the analyst can visually see the differences. We will be utilizing Netflow to collect and map information and potentially D3.js and other web frameworks to develop our front-end interface. This project will investigate the potential for utilizing machine-learning to build models automatically and recognize differences and may implement them if feasible.

## **Implementation Details**
Inquisitor will function as a standalone Node.js application that queries Moloch for periodic data through the use of it's JSON API. It will then process that data to determine whether it meets the predefined model.

## **License**
We will be using the MIT License for our Network Analysis Tool. We are not concerned with others using our code and we believe the more contributions made the more efficient the tool will be. To view the MIT License please see LICENSE file.

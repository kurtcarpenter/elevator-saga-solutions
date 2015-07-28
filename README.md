# elevator-saga-solutions

This is my attempt at solving Elevator Saga, "The elevator programming game". It is a game in which players write JavaScript to control elevators optimally.

See the game at http://play.elevatorsaga.com/

##Solutions
Current solutions work for levels 1-5 using a somewhat semi-intelligent approach.

* Elevators are distributed across floors at idle
* When a person calls an elevator, a fitness function evaluates each elevator on its distance, direction, and fillage
* Elevators will immediately pick up a person who called an elevator if they are passing the floor and it is already queued up

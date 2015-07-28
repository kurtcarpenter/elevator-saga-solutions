{
    init: function(elevators, floors) {
        _.each(elevators, function(elevator, index) {
            elevator.on("idle", function() {
                elevator.goToFloor(determineIdle(index));
            });

            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (elevator.destinationQueue.indexOf(floorNum) > -1) {
                    elevator.destinationQueue = _.without(elevator.destinationQueue, floorNum);
                    elevator.checkDestinationQueue();
                    elevator.goToFloor(floorNum, true);
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                elevator.destinationQueue = _.without(elevator.destinationQueue, floorNum);
                elevator.checkDestinationQueue();
            });
        });

        _.each(floors, function(floor, index) {
            floor.on("up_button_pressed", function() {
                callElevator(floor, "up");
            });
            floor.on("down_button_pressed", function() {
                callElevator(floor, "down");
            });
        });

        function callElevator(floor, direction) {
            var fitnesses = [];
            _.each(elevators, function(elevator, index) {
                var floorDifference = Math.abs(elevator.currentFloor() - floor.floorNum());
                var directionDifference;
                if (elevator.destinationDirection() === "stopped") {
                    directionDifference = 0;
                } else {
                    directionDifference = (direction === elevator.destinationDirection()) ? 0 : 1;
                }
                var weightFitness = elevator.loadFactor();
                fitnesses.push(floorDifference + directionDifference + weightFitness);
            });
            elevators[_.indexOf(elevators, _.min(fitnesses))].goToFloor(floor.floorNum);
        }

        function elevatorCanTakeMore(elevator) {
            return elevator.loadFactor() < 1 - 1.5 / elevator.maxPassengerCount();
        }

        function determineIdle(elevatorNum) {
            if (elevators.length === 1) { //one elevator takes middle
                return Math.floor(floors.length / 2);
            } else if (elevatorNum == 0) { //leave the first elevator on floor 0
                return 0;
            } else if (elevators.length === 2) { //distribute
                return Math.floor(floors.length / 3 * (elevatorNum + 1));
            }
            var idleFloor;
            switch (elevators.length % 2) { //MATH
                case 0: //even number of elevators
                    idleFloor = (1 / (elevators.length)) * (elevatorNum) * floors.length;
                    break;
                case 1: //odd number of elevators
                    idleFloor = (1 / (elevators.length)) * (elevatorNum) * floors.length;
                    break;
            }
            return Math.floor(idleFloor);
        }
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}

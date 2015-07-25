{
    init: function(elevators, floors) {
        function determineIdle(elevatorNum) {
            var idleFloor;
            if (elevators.length === 1) {
                return Math.floor(floors.length / 2);
            }
            switch (elevators.length % 2) {
                case 0: //even number of elevators
                    idleFloor = (1 / (floors.length + 1)) * (elevatorNum);
                    break;
                case 1: //odd number of elevators
                    idleFloor = (1 / (floors.length - 1)) * (elevatorNum + 1);
                    break;
            }
            return Math.floor(idleFloor);
        };

        var elevator = elevators[0]; // Let's use the first elevator

        elevator.on("idle", function() {
            // The elevator is idle, so let's go to all the floors (or did we forget one?)
            elevator.goToFloor(determineIdle(0));
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

        for (var i = 0; i < floors.length; i++) {
            callElevator(floors[i]);
        }

        function callElevator(floor) {
            floor.on("up_button_pressed down_button_pressed", function() {
                elevator.goToFloor(floor.floorNum());
            });
        };

        function elevatorCanTakeMore(elevator) {
            return elevator.loadFactor() < 1 - 1.5 / elevator.maxPassengerCount();
        };

        function removeFromArray(array, item) {

        };
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}

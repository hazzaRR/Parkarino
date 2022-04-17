class Request {

    id;
    driverId;
    location;
    arrivalDate;
    departureDate;
    arrivalTime;
    departureTime;
    approved;



    constructor(id, driverId, location,  arrivalDate, departureDate, arrivalTime, departureTime) {
        this.id = id;
        this.driverId = driverId;
        this.location = location;
        this.arrivalDate = arrivialDate;
        this.departureDate = departureDate;
        this.arrivalTime = arrivialTime;
        this.departureTime = departureTime;
        this.approved = null;
    
    }


    get id() {
        return this.id;
    }
    set id(value) {
        this.id = value;
    }

    get driverId() {
        return this.driverId;
    }
    set driverId(value) {
        this.driverId = value;
    }

    get location() {
        return this.location;
    }
    set location(value) {
        this.location = value;
    }

    get arrivalDate() {
        return this.arrivalDate;
    }
    set arrivalDate(value) {
        this.arrivalDate = value;
    }
    get departureDate() {
        return this.departureDate;
    }
    set departureDate(value) {
        this.departureDate = value;
    }

    get arrivalTime() {
        return this.arrivalTime;
    }
    set arrivalTime(value) {
        this.arrivalTime = value;
    }

    get departureTime() {
        return this.departureTime;
    }
    set departureTime(value) {
        this.departureTime = value;
    }
    get approved() {
        return this.approved;
    }
    set approved(value) {
        this.approved = value;
    }

}
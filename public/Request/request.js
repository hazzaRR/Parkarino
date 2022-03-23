class Request {

    id;
    driverId;
    location;
    date;
    arrivialTime;
    departureTime;



    constructor(id, driverId, location,  date, arrivialTime, departureTime) {
        this.id = id;
        this.driverId = driverId;
        this.location = location;
        this.date = date;
        this.arrivialTime = arrivialTime;
        this.departureTime = departureTime;
    
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

    get date() {
        return this.date;
    }
    set date(value) {
        this.date = value;
    }

    get arrivialTime() {
        return this.arrivialTime;
    }
    set arrivialTime(value) {
        this.arrivialTime = value;
    }

    get departureTime() {
        return this.departureTime;
    }
    set departureTime(value) {
        this.departureTime = value;
    }

}
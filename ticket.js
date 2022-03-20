class Ticket {
    id;
    driver;
    arrivialTime;
    departureTime;
    date;
    parkingSpace;
    chargePrice;
    
    constructor(id, driver, arrivial, departure, date, parkingSpace, price) {
        this.id = id;
        this.driver = driver;
        this.arrivialTime = arrivial;
        this.departureTime = departure;
        this.date = date;
        this.parkingSpace = parkingSpace;
        this.chargePrice = price;
    }
}


let ticket = new Ticket(1, "Harry Redman", "12:08", "15:00", "12/03/22", 1, 3);

console.log(ticket.arrivialTime);
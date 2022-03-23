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

    get id() {
        return this.id;
    }

    set id(value) {
        this.id = value;
    }
    
    get driver() {
        return this.driver;
    }

    set driver(value) {
        this.driver = value;
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
    get date() {
        return this.date;
    }

    set date(value) {
        this.date = value;
    }
    get parkingSpace() {
        return this.parkingSpace;
    }

    set parkingSpace(value) {
        this.parkingSpace = value;
    }
    get chargePrice() {
        return this.chargePrice;
    }

    set chargePrice(value) {
        this.chargePrice = value;
    }

}


const displayTicket = (ticketToDisplay) => {
    const displayTicketId = document.getElementById("ticketId").textContent = ticketToDisplay.id;
    const displayTicketDriver = document.getElementById("ticketDriver").textContent = ticketToDisplay.driver;
    const displayTicketArrivial = document.getElementById("ticketArrivial").textContent = ticketToDisplay.arrivialTime;
    const displayTicketDeparture = document.getElementById("ticketDeparture").textContent = ticketToDisplay.departureTime;
    const displayTicketDate = document.getElementById("ticketDate").textContent = ticketToDisplay.date;
    const displayTicketSpace = document.getElementById("ticketSpace").textContent = ticketToDisplay.parkingSpace;
    const displayTicketPrice = document.getElementById("ticketPrice").textContent = ticketToDisplay.chargePrice;




}


let ticket1 = new Ticket(1, "Harry Redman", "12:08", "15:00", "12/03/22", 1, "£3.50");

console.log(ticket1.arrivialTime);

displayTicket(ticket1);
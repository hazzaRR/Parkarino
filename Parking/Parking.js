class ParkingSpace 
{
    constructor(location, id, available)
    {
        this.location = location;
        this.id = id;
        this.available = available;
    }
}

class CarPark
{
    name;
    id;
    parkingSpaces;

    constructor(id, name, parkingSpaces=[])
    {
        this.id = id;
        this.name = name;
        this.parkingSpaces = parkingSpaces;
    }

    get total() 
    {
        return parkingSpaces.length;   
    }
}


//testing

/*
evergreenSpaces = [new ParkingSpace("Evergreen", 1, true), new ParkingSpace("Evergreen", 2, true), new ParkingSpace("Evergreen", 3, true), new ParkingSpace("Evergreen", 4, true), new ParkingSpace("Evergreen", 5, true), new ParkingSpace("Evergreen", 6, true), new ParkingSpace("Evergreen", 7, true), new ParkingSpace("Evergreen", 8, true)];
let Evergreen = new CarPark(1, "Evergreen", evergreenSpaces); 
console.log(Evergreen);
(Evergreen.parkingSpaces[3]).available = false;
console.log(Evergreen);
*/
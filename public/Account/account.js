//account.js
class Account {
    id;
    userName;
    email;
    password;
    firstName;
    lastName;



    constructor(email, password, firstName, lastName) {
        this.id = this.genID();
        this.userName = this.genUser(firstName, lastName);
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    genUser(firstName, lastName) {
        const num = Math.floor(Math.random() * 100);
        return firstName.substring(0, 3) + lastName.substring(0, 3) + num.toString();
    }

    genID() {
        return 3;
    }


    get email() {
        return this.email;
    }

    set email(value) {
        this.email = value;
    }

    get password() {
        return this.password;
    }

    set password(value) {
        this.password = value;
    }

    get firstName() {
        return this.firstName;
    }

    set firstName(value) {
        this.firstName = value;
    }

    get lastName() {
        return this.lastName;
    }

    set lastName(value) {
        this.lastName = value;
    }

    get id() {
        return this.id;
    }

    set id(value) {
        this.id = value;
    }

    get userName() {
        return this.userName;
    }

    set userName(value) {
        this.userName = value;
    }
}

class Driver extends Account{
    carReg;
    address;
    isAdmin;
    constructor(email, password, firstName, lastName,carReg,address,isAdmin) {
        super(email, password, firstName, lastName);
        this.carReg = carReg;
        this.address = address;
        this.isAdmin = isAdmin;
    }


    get carReg() {
        return this.carReg;
    }

    set carReg(value) {
        this.carReg = value;
    }

    get address() {
        return this.address;
    }

    set address(value) {
        this.address = value;
    }

    get isAdmin() {
        return this.isAdmin;
    }

    set isAdmin(value) {
        this.isAdmin = value;
    }

    requestSpace(a,b,c,d,e){}
    notifyArrival(a){}
    notifyDeparture(a){}
    payTicket(a){}
    sendMessage(){}
}
class Admin extends Account{
    isAdmin;
    constructor(email, password, firstName, lastName,isAdmin) {
        super(email, password, firstName, lastName);
        this.isAdmin = isAdmin;
    }


    get isAdmin() {
        return this.isAdmin;
    }

    set isAdmin(value) {
        this.isAdmin = value;
    }

    isSpaceEmpty(a){}
    approveRequest(a,b,c,d,e){}
    sendMessage(){}
    blockSpace(a){}
    addParkingLot(a,b){}
    changeAssignedLocation(a,b){}
    editUser(a){}
    banUser(a){}
    removeUser(a){}
}

let account = new Account("test@email.com", "bepsdof", "Zak"
    ,"Brook");
let account2 = new Driver("test@email.com", "bepsdof", "Zak"
    ,"Brook","sdfsd","sdfsdf","sfsdfs","maybe");
let account3 = new Admin("test@email.com", "bepsdof", "Zak"
    ,"Brook","maybe");

console.log(account3);
console.log(account2);
console.log(account);

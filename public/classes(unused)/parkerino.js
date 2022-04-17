//parkerino.js
class controller{
    constructor(){
        if(!!controller.instance){
            return controller.instance;
        }
        controller.instance = this;
        return this;
    }

    registration(){}
    login(){}
    checkAdmin(a){}
    validatePassword(a){}
    checkEmail(){}
    handleMessage(a,b){}
    alert(){}
}
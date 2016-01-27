'use strict';
var numbers = [1,2,3,4];
var evens = numbers.map(x => x + 1);
console.log(evens);

class FClass {

    constructor(n){
        var _name = n;
        this._name = n;
    }

    get Name(){
        return this._name;
    }

    get FullName(){
        return this._name + ' T';
    }
}


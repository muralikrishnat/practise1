
class Utils{
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() ;
    }
}

class Hub{
    constructor(obj){
        this._id = obj['_id'] || Utils.guid();
        this._name = obj['_name'];
        this.ModelType = "HUB";
        this.__createdTime = obj['__createdTime'] || new Date().getTime();
        this.__updatedTime = obj['__updatedTime'] || new Date().getTime();
    }

    get Id(){
        return this._id;
    }

    get Name(){
        return this._name;
    }

    set Id(val){
        this._id = val;
        this.__updatedTime = new Date().getTime();
    }

    set Name(val){
        this._name = val;
        this.__updatedTime = new Date().getTime();
    }

    static fromString(fData){
        var hubObject, parsingPassed = false;

        try{
            hubObject = JSON.parse(fData);
            parsingPassed = true;
        }catch (r){
            //eat error for now
        }

        return new Hub(hubObject);
    }

}


class User{
    contructor(obj){
        this._id = obj['_id'] || Utils.guid();
        this._uname = obj['_uname'];
        this._pwd = obj['_pwd'];
        this.ModelType = "User";
        this.__createdTime = obj['__createdTime'] || new Date().getTime();
        this.__updatedTime = obj['__updatedTime'] || new Date().getTime();
    }

    static fromString(fData){
        var parseObject = {}, parsingPassed = false;

        try{
            parseObject = JSON.parse(fData);
            parsingPassed = true;
        }catch (r){
            //eat error for now
        }

        return new User(parseObject);
    }

}



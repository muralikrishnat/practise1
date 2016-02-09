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


class Question{
    constructor(obj){
        this._id = obj["_id"] || Utils.guid();
        this._text = obj["_text"];
        this._type = obj["_type"];
    }

    get Id(){
        return this._id;
    }
    set Id(val){
        this._id = val;
    }

    get Text(){
        return this._text;
    }

    set Text(val){
        this._text = val;
    }
    get Type(){
        return this._type;
    }

    set Type(val){
        this._type = val;
    }
}

class Answer{
    constructor(obj){
        this._id = obj["_id"] || Utils.guid();
        this._text = obj["_text"];
    }

    get Id(){
        return this._id;
    }
    set Id(val){
        this._id = val;
    }

    get Text(){
        return this._text;
    }

    set Text(val){
        this._text = val;
    }
}

class User{
    constructor(obj){
        this._id = obj["_id"] || Utils.guid();
        this._uname = obj["_uname"];
        this._pwd = obj["_pwd"];
    }
}

class QuestionAnswer{
    constructor(obj){
        this._id = obj["_id"] || Utils.guid();
        this._qid = obj["_qid"];
        this._aid = obj["_aid"];
    }

    get Id(){
        return this._id;
    }
    set Id(val){
        this._id = val;
    }
    get QuestionId(){
        return this._qid;
    }
    set QuestionId(val){
        this._qid = val;
    }
    get AnswerId(){
        return this._aid;
    }
    set AnswerId(val){
        this._aid = val;
    }
}

class UserQuestionAnswer{
    constructor(obj){
        this._id = obj["_id"] || Utils.guid();
        this._qid = obj["_qid"];
        this._aid = obj["_aid"];
        this._uid = obj["_uid"];
    }
}


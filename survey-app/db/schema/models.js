
var UtilClass = function () {
    this.guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() ;
    };
};

var Utils = Utils || new UtilClass();
//
//var ModelProperties = [];
//
//var ModelProperty = function (n, p) {
//    this.ModelName = n;
//    this.ModelProperties = p || [];
//
//    this.addProperty = function (pName) {
//        this.ModelProperties.push(pName)
//    };
//
//};
//
//ModelProperties.push(new ModelProperty("Question", ['id', 'text', 'type', '_createdTime', '_updatedTime', '__modelType']));

var exportObject = {};

exportObject.Question = function (obj) {
    this.id = obj['id'] || Utils.guid();
    this.text = obj['text'];
    this.type = obj['type'];
    this._createdTime = new Date().getTime();
    this._updatedTime = new Date().getTime();

    this.__modelType = "Question";

    this.attr = function (attrname, attrval) {
        if(attrname){
            if(this[attrname]){
                if(attrval){
                    if(this[attrname] !== attrval) {
                        this._updatedTime = new Date().getTime();
                        this[attrname] = attrval;
                    }
                }
                return this[attrname];
            }
        }
        return '';
    };
};


module.exports = exportObject;


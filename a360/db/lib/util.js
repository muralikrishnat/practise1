var Utils = {};

Utils.guid = function(len) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    if(len == 8){
        return s4() + s4();
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + (new Date).getTime().toString(16);
};


module.exports = Utils;
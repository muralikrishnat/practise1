var utils = require('./../lib/util');
var exportObject = {};

exportObject.Hub = function (obj) {
    this.Id = obj["Id"] || utils.guid();
    this.Name = obj["Name"];

};


exportObject.User = function (obj) {
    this.Id = obj["Id"] || utils.guid();

    this.Name = obj["Name"];

};

exportObject.Project = function (obj) {
    this.Id = obj["Id"] || utils.guid();

    this.Name = obj["Name"];

};


exportObject.ProjectMember = function (obj) {
    this.Id = obj["Id"] || utils.guid();

    this.Name = obj["Name"];

};


exportObject.HubMember = function (obj) {
    this.Id = obj["Id"] || utils.guid();

    this.Name = obj["Name"];

};






module.exports = exportObject;
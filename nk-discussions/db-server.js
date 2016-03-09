var nbServer = require('nb-json-db');
nbServer.rootPath = __dirname;

nbServer.dBFolderName = "data";
nbServer.dBPort = 5654;

nbServer.ModelHash["discussions"] = function (obj, isNew, isUpdate) {
    this.Id = obj["Id"] || nbServer.guid();
    this.Category = obj["Category"];

    this.Content = obj["Content"];

    if(isNew){
        this.CreatedTime = new Date().getTime();
    }else{
        this.CreatedTime = obj["CreatedTime"];
    }

    if(isUpdate){
        this.UpdatedTime = new Date().getTime();
    }else{
        this.UpdatedTime = obj["UpdatedTime"];
    }

    this.ParentId = obj["ParentId"];

    this.Likes = obj["Likes"];
    this.Views = obj["Views"];
};

nbServer.ModelHash["likeviews"] = function (obj, isNew, isUpdate) {
    this.Id = obj["Id"] || nbServer.guid();

    this.LikedBy = obj["LikedBy"];
    this.LikeId = obj["LikeId"];

    this.Type = obj["Type"]; // LIKE (or) VIEW

    this.Count = obj["Count"];
};

nbServer.ModelHash["users"] = function (obj, isNew, isUpdate) {
    this.Id = obj["Id"] || nbServer.guid();

    this.UserName = obj["UserName"];
    this.Password = obj["Password"];
};



nbServer.init();


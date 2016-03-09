angular.module('nk-forum', []).directive('nkDiscussion', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'js/discussions/views/discussions.html',
        controller: function ($scope, nkforumapi) {
            $scope.isLoading = true;
            $scope.AddDiscussionFlag = false;
            $scope.Discussions = [];


            nkforumapi.getDiscussions().then(function (resp) {
                $scope.Discussions = resp.list;
                $scope.isLoading = false;
            });

            $scope.openAddDiscussion = function () {
                $scope.AddDiscussionFlag = true;
            };

            $scope.addDiscussion = function (isAdd, content) {
                if (isAdd) {
                    var discussionObject = {};
                    discussionObject.Content = content;
                    console.log(' content of the discusssion ',content);
                    nkforumapi.addDiscussion(discussionObject).then(function (addedDiscussion) {
                        $scope.Discussions.push(addedDiscussion);
                    });
                }
                $scope.AddDiscussionFlag = false;

            };

            $scope.deleteDiscussion = function (discusItem) {
                nkforumapi.deleteDiscussion(discusItem).then(function (deletedItem) {
                    _.remove($scope.Discussions, { "Id": deletedItem.Id});
                });
            }
        }
    };
}).service('nkforumapi', function ($http) {

    var makeRequest = function (url, method, data) {
        return $http({method: method, url: url, data: data}).then(function (resp) {
            return resp.data.Body;
        }, function () {
            return {list: []};
        });
    };

    this.getDiscussions = function (parentId) {
        return makeRequest("http://localhost:5654/table/discussions", "GET", {});
    };

    this.addDiscussion = function (discussionData) {
        return makeRequest("http://localhost:5654/table/discussions", "POST", discussionData);
    };

    this.updateDiscussion = function (discussionData) {
        return makeRequest("http://localhost:5654/table/discussions", "POST", discussionData);
    };

    this.deleteDiscussion = function (discussionData) {
        return makeRequest("http://localhost:5654/table/discussions?Id=" + discussionData.Id, "DELETE", {});
    };


    this.Name = "Nk Forum Api";
});
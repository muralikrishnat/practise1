(function (window) {
    var $M = {};
    $M.RoutingList = [];
    $M.currentPage = '';
    $M.previousPage = '';

    var RoutingClass = function (u, f, t) {
        this.Params = u.split('/').filter(function(h){ return h.length > 0; });
        this.Url = u;
        this.Fn = f;

        this.Title = t;
    };


    var checkParams = function (urlParams, routeParams) {
        var paramMatchCount = 0, paramObject = {};

        for(var i =0 ; i < urlParams.length ; i++){
            var rtParam = routeParams[i];
            if(rtParam.indexOf(':') >= 0){
                paramObject[rtParam.split(':')[1]] = urlParams[i];
                paramMatchCount += 1;
            }
        }

        if(paramMatchCount === urlParams.length){
            return paramObject;
        }

        return false;
    };


    $M.loadController = function (urlToParse) {
        if($M.currentPage !== urlToParse) {
            $M.previousPage = $M.currentPage;
            $M.currentPage = urlToParse;
            var uParams = urlToParse.split('/').filter(function (h) {
                return h.length > 0;
            });
            var isRouteFound = 0;
            for (var i = 0; i < $M.RoutingList.length; i++) {
                var routeItem = $M.RoutingList[i];
                if (routeItem.Params.length === uParams.length) {
                    var _params = checkParams(uParams, routeItem.Params);
                    if (_params) {
                        _params.Title = routeItem.Title;
                        isRouteFound += 1;
                        routeItem.Fn.call(null, _params);
                    }
                }
            }
        }else{
            console.log('you are on same page dude!!!!');
        }
    };


    $M.navigateTo = function (navigateTo) {
        window.history.pushState(null, null, navigateTo);
        $M.loadController(navigateTo);
    };

    $M.addRoute = function (urlToMatch, fnToExecute, t) {
        if(typeof urlToMatch === 'string'){
            $M.RoutingList.push(new RoutingClass(urlToMatch, fnToExecute, t));
        }else if(typeof urlToMatch && urlToMatch instanceof Array){
            urlToMatch.forEach(function (lItem) {
                $M.RoutingList.push(new RoutingClass(lItem, fnToExecute, t));
            });
        }

    };

    window.$NB = $M;
})(window);
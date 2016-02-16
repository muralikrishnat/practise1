var App = {};

var addRoutes = function () {
    $NB.addRoute('/books/:id', function (params) {
        console.log('Route is ', params.Title, params.id);
    }, 'books');

    $NB.addRoute('/:category/:id', function (params) {
        console.log('Route is ', params.Title, params.category, params.id);
    }, 'category');

    $NB.addRoute('/:category/:id/:action', function (params) {
        console.log('Route is ', params.Title, params.category, params.id, params.action);
    }, 'category action');


    $NB.addRoute(['/', '/:pagename'], function (params) {
        console.log('Route is ', params.Title, params.pagename);
    }, 'page');
};



App.init = function () {
    addRoutes();
    $NB.loadController(location.pathname);
};

App.navigateTo = function (pageUrl) {
    $NB.navigateTo(pageUrl);
};


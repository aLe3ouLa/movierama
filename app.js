
window.onload = function () {
    console.log('DOM has loaded');
    var Router = function(name, routes) {
        return {
            name: name,
            routes: routes
        }
    }
      
    var myFirstRouter = new Router("myFirstRouter", [{ path: "/", name: 'Root' }, { path: "/about", name: 'About' }, { path: "/contact", name: 'Contact' }]);

    var currentPath = window.location.pathname;
    var view = document.getElementById("view");
    if(currentPath === '/') {
        view.innerHTML = 'You are on the root page';
    } else {
        var route = myFirstRouter.routes.filter(r => r.path === currentPath)[0];
        console.log(route)
        if (route !== null && route !== [] && route !== undefined) {
            view.innerHTML = 'You are on the ' + route? route.name : '' + 'path';
        } else {
            view.innerHTML = '404: Route not found';
        }
    }
}
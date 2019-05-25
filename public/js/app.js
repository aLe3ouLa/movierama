window.onload = function () {

    console.log('DOM has loaded');
    var view = document.getElementById("view");

    var activeRoutes = Array.from(document.querySelectorAll('[route]'));
    function navigate (event) {
        let route = event.target.attributes[0].value;
        let routeInfo = myFirstRouter.routes.filter(r => r.path === route)[0];
        console.log(routeInfo);
        if(!routeInfo) {
            view.innerHTML = 'No route exists with this path';
        } else {
            window.history.pushState({}, 'name', routeInfo.path)
            view.innerHTML = ' You have clicked the ' + routeInfo.name + ' route';
        }
    };

    activeRoutes.forEach((route) => {
        route.addEventListener('click', navigate, false);
    })

    var Router = function(name, routes) {
        return {
            name: name,
            routes: routes
        }
    }
      
    var myFirstRouter = new Router("myFirstRouter", [{ path: "/", name: 'Root' }, { path: "/about", name: 'About' }, { path: "/contact", name: 'Contact' }]);

    var currentPath = window.location.pathname;
    
    if(currentPath === '/') {
        view.innerHTML = 'You are on the root page';
    } else {
        var route = myFirstRouter.routes.filter(r => r.path === currentPath)[0];

        if (route) {
            view.innerHTML = 'You are on the ' + route? route.name : '' + 'path';
        } else {
            view.innerHTML = '404: Route not found';
        }
    }
}
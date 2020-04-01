
var homeRoutes = function($stateProvider,  $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/',
    template: require('../partials/home.html'),
    controller: 'HomeController',
    controllerAs: 'homeCtrl'
  })
  .state('about', {
    url: '/about',
    template: require('../partials/about.html')
  })
  .state('sponsors', {
    url: '/sponsors',
    template: require('../partials/sponsors.html')
  })
  .state('links', {
    url: '/useful-links',
    template: require('../partials/links.html'),
    controller: 'UsefulLinksController',
    controllerAs: 'usefulLinksCtrl'
  });


   $urlRouterProvider.otherwise('/');
};

module.exports = ['$stateProvider', '$urlRouterProvider', homeRoutes];

var carRoutes = function($stateProvider) {
  $stateProvider
  .state('car', {
    url: '/car',
    template: '<div id="myGrid" ag-grid="gridOptions" class="ag-theme-alpine" style="width: 100%; height: 500px;"></div>',
    resolve: {
      list: ['CarService', function(carService) {
        return carService.list();
      }]
    },
    controller: 'CarController',
    controllerAs: 'carCtrl'
  })
  .state('carArticle', {
    url: '/car/:id',
    template: 'something',
    resolve: {
      car: ['CarService', '$stateParams', function(carService, $stateParams) {
        return carService.get($stateParams.id);
      }]
    },
    controller: 'CarArticleController',
    controllerAs: 'carArticleCtrl'
  });
};

module.exports = ['$stateProvider', carRoutes];
var dpConfig = function() {
  return {
    template: require('../partials/config.html'),
    controller: 'BackendController',
    controllerAs: 'backendController'
  };
};

module.exports = [dpConfig];

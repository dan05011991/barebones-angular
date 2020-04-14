var dpConfig = function() {
  return {
    template: 'Snapshot Version: {{backendController.version}}',
    controller: 'BackendController',
    controllerAs: 'backendController'
  };
};

module.exports = [dpConfig];

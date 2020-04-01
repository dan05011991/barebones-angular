var CommsService = function(Restangular, $location) {
  var that = this;

  Restangular.setRequestInterceptor(function(element, operation, route, url) {
    var requestHeader = {
      "Access-Control-Allow-Origin": "http://localhost:9999/",
      "Content-Type": "application/x-www-form-urlencoded"
    };

    Restangular.setDefaultHeaders(requestHeader);

    console.log('Request', {
      element: element,
      operation: operation,
      route: route,
      url: url
    });
    return element;
  });

  that.getResource = function(resource) {
    return Restangular.all(resource);
  };

  Restangular.setErrorInterceptor(
    function(response) {
      if(response.status == 401) {
        tokenService.setToken('');
        $location.url('/login');
      }
    });

  return that;
};

module.exports = ['Restangular', '$location', CommsService];

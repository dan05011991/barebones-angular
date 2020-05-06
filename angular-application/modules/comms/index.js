import angular from 'angular'
import RestangularProvider from 'restangular'

var commsModule = angular.module('app.comms', ['restangular', 'site.config'])
  .config(['RestangularProvider', 'siteConfig', function(RestangularProvider, siteConfig) {

    RestangularProvider.setBaseUrl(siteConfig.backendBase);

    RestangularProvider.setResponseInterceptor(function(data, operation, what, url, response, deferred) {
      console.log('Response', {
        data: data,
        operation: operation,
        what: what,
        url: url,
        response: response,
        deferred: deferred
      });

      if (operation === 'getList') {
        var newResponse = data.elements ? data.element : [data];

        if (data.meta) {
            newResponse.meta = {
              pageIndex: data.meta.pageIndex,
              maxPerPage: data.meta.maxPerPage,
              totalCount: data.meta.totalCount
            };
        }
        return newResponse;
      }
      return data;
    });
  }]);
commsModule.factory('CommsService', require('./services/CommsService'));
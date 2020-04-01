
var appConfig = angular.module('app.config', [])
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  })
  .filter('subset', function() {
    return function(input, start, end) {
      if (input) {
        return input.slice(start, end);
      }
      return [];
    }
  })
  .filter("nl2br", function($filter) {
 return function(data) {
   if (!data) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
})
  .filter('iif', function() {
    return function(input, trueValue, falseValue) {
      return input ? trueValue : falseValue;
    };
  })
  .constant('lodash', window._)
  .constant('settings', {
    maxPerPageOptions: [2, 5, 10, 15, 50],
    pagesToDisplay: 5,
    snippetMaxLength: 200
  });

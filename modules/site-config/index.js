var siteConfig = angular.module('site.config', ['ezfb'])
  .constant('siteConfig', {
    root: 'http://localhost',
    backendBase: 'http://localhost:8090/',
    appName: 'Demo Application',
    appVersion: 1
  });
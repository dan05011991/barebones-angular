var siteConfig = angular.module('site.config', [])
  .constant('siteConfig', {
    root: 'http://something',
    backendBase: 'http://something:8090/',
    appName: 'Demo Application',
    appVersion: '1.0.3'
  });
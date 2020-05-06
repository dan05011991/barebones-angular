import angular from 'angular'

var backendMod = angular.module('app.backend', ['app.comms']);
backendMod.controller('BackendController', require('./controllers/BackendController'));backendMod.directive('dpConfig', require('./directives/dpConfig'));backendMod.factory('BackendService', require('./services/BackendService'));
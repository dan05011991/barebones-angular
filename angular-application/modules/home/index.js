import angular from 'angular'

var homeModule = angular.module('app.home', ['app.date', 'ui.router']);
homeModule.controller('HomeController', require('./controllers/HomeController'));homeModule.controller('UsefulLinksController', require('./controllers/UsefulLinksController'));homeModule.directive('gthFooterLinks', require('./directives/gthFooterLinks'));homeModule.config(require('./routes/homeRoutes'));
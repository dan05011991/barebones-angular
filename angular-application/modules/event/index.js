import angular from 'angular'

var eventMod = angular.module('app.event', ['ui.router', 'app.date', 'app.calendar']);
eventMod.controller('EventController', require('./controllers/EventController'));eventMod.directive('calendarEntry', require('./directives/calendarEntry'));eventMod.factory('EventService', require('./services/EventService'));
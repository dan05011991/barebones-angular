import angular from 'angular'

var calendar = angular.module('app.calendar', ['ui.router', 'angularMoment']);
calendar.controller('CalendarController', require('./controllers/CalendarController'));calendar.factory('CalendarService', require('./services/CalendarService'));
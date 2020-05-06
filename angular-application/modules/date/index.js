import angular from 'angular'
import angularMoment from 'angular-moment'

var mod = angular.module('app.date', ['angularMoment']);
mod.factory('DateService', require('./services/DateService'));
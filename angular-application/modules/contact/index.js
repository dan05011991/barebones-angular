import angular from 'angular'

var contactMod = angular.module('app.contact', ['ui.router']);
contactMod.config(require('./routes/contactRoutes'));
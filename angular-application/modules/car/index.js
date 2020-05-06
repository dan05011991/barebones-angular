import angular from 'angular'
import angular_ui_router from 'angular-ui-router'
import {initialiseAgGridWithAngular1, Grid} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.min.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

initialiseAgGridWithAngular1(angular);

var carMod = angular.module('app.car', ['ui.router', 'agGrid']);
carMod.controller('CarArticleController', require('./controllers/CarArticleController'));carMod.controller('CarController', require('./controllers/CarController'));carMod.factory('CarService', require('./services/CarService'));carMod.config(require('./routes/carRoutes'));
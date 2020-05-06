import angular from 'angular'
import bootstrap from 'angular-ui-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

require('./modules/site-config');
require('./modules/home');
require('./modules/event');
require('./modules/date');
require('./modules/contact');
require('./modules/comms');
require('./modules/calendar');
require('./modules/backend');
require('./modules/app-config');
require('./modules/spinner');
require('./modules/unorderedlist');
require('./modules/react');

var app = angular.module('app', [
  'app.react',
  'app.unorderedlist',
  // 'app.myspinner',
  'app.config',
  'app.comms',
  'app.car',
  'app.backend',
  'app.home',
  'app.contact',
  'app.calendar',
  'app.event',
  'ui.bootstrap',
  'site.config'
]);
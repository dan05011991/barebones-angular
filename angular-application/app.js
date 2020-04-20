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

var app = angular.module('app', [
  'app.unorderedlist',
  'app.myspinner',
  'app.config',
  'app.comms',
  'app.car',
  'app.backend',
  'app.home',
  'app.contact',
  'app.calendar',
  'app.event',
  'ui.bootstrap',
  'updateMeta',
  'site.config',
  'angulartics', 'angulartics.google.analytics'
]);
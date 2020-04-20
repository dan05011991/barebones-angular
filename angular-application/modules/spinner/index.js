import { react2angular } from 'react2angular';

angular
    .module('app.myspinner', [])
    .component('mySpincomponent', react2angular(require('./components/MySpinner').default, []));

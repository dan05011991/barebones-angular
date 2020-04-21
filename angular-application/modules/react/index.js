import { react2angular } from 'react2angular';

angular
    .module('app.react', [])
    .component('carType', react2angular(require('./components/CarType').default, []))
    .component('carSpec', react2angular(require('./components/CarSpec').default, []))
    .component('carOptions', react2angular(require('./components/CarOptions').default, []));

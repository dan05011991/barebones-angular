var calendarEntry = function() {
    return {
        template: require('../partials/calendarEntry.html'),
        controller: 'EventController',
        controllerAs: 'eventCtrl'
    };
};

module.exports = calendarEntry;

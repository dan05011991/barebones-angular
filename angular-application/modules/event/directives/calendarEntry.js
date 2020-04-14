var calendarEntry = function() {
    return {
        template: '<div data-ng-if="eventCtrl.list.length === 0">No upcoming events</div><div data-ng-repeat="event in eventCtrl.list" class="calendar-entry">  <div class="calendar-icon">    <div class="month">{{event.dateFrom * 1000 | date: \'MMM\'}}</div>    <div class="year">{{event.dateFrom * 1000 | date: \'yyyy\'}}</div>  </div>  <div class="calendar-info">    {{event.title}}  </div></div>',
        controller: 'EventController',
        controllerAs: 'eventCtrl'
    };
};

module.exports = calendarEntry;

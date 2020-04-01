var CalendarController = function(calendarService) {

  var self = this;

  this.list = calendarService.list();

}

module.exports = ['CalendarService', CalendarController];

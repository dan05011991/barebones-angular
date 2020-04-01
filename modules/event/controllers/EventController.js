var EventController = function (calendarService, dateService) {
  var that = this;

  var currentDate = dateService.get();

  this.list = calendarService.list();

};
module.exports = ['CalendarService', 'DateService', EventController];

var DateService = function(momentService) {
  var that = this;
  that.monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  that.createDate = function(unix) {
    return new Date(unix*1000);
  };

  that.addDateAndTime = function(date, time) {
    var momentDate = moment(date),
        momentTime = moment(time);
    momentDate.add(momentTime.hours(), 'h');
    momentDate.add(momentTime.minutes(), 'm');
    return momentDate;
  };

  that.getUnix = function(date) {
    if(date.unix === 'function') {
      return date.unix();
    }
    return momentService(date).unix();
  };

  that.get = function() {
    var d = new Date();
    return Math.floor(d.getTime() / 1000);
  };

  that.getPastMonths = function(noOfMonths) {
    var d = new Date();
    var currentMonth = d.getMonth();
    var currentYear = d.getYear();
    var dateObj = null;
    var dateObjArr = [];

    for(var i = 0; i < noOfMonths; i++) {
      dateObj = getMonthDateRange(currentYear, currentMonth);
      dateObj.display = that.monthNames[currentMonth] + ' ' + (currentYear + 1900);

      if(currentMonth - 1 < 0) {
        currentMonth = that.monthNames.length - 1;
        currentYear--;
      } else {
        currentMonth--;
      }
      dateObjArr.push(dateObj);
    }
    return dateObjArr;
  };

  function getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = momentService([year, month]);
    startDate.add(1900, 'year');
    // Clone the value before .endOf()
    var endDate = momentService(startDate).endOf('month');

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate.unix(), end: endDate.unix() };
}

  return that;
};

module.exports = ['moment', DateService];

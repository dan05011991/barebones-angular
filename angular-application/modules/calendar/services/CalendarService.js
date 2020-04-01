var CalendarService = function() {
  var self = this;

  self.list = function() {
    return [
        { title: 'Standup', description: 'description', category: 'category', dateFrom: 1581731046 },
        { title: 'Review', description: 'description', category: 'category', dateFrom: 1585736046 },
        { title: 'Retrospective', description: 'description', category: 'category', dateFrom: 1586736046 }
    ];
  };


  return self;
};

module.exports = [CalendarService];

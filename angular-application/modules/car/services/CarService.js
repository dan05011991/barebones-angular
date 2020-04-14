var CarService = function (commsService) {
    var self = this;

    self.comms = commsService.getResource('car');

    self.list = function() {
        return self.comms.getList();
    };

    self.get = function(id) {
        return self.comms.get(id);
    }

    return self;
};

module.exports = ['CommsService', CarService];

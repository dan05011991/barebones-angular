var BackendService = function (commsService) {
    var that = this;

    that.comms = commsService.getResource('config');

    that.getConfig = function() {
        return that.comms.getList().then(function(result) {
            return result.length > 0 ? result[0] : null;
        });
    };

    return that;
};

module.exports = ['CommsService', BackendService];

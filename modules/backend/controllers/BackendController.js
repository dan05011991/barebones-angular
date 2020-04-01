var BackendController = function (backendService) {
  var self = this;

  backendService.getConfig().then(function(result) {
    self.version = result.version;
    console.log(self.version);
  });


};
module.exports = ['BackendService', BackendController];

var footerLinks = function() {
  return {
    template: '<p>Here are some useful links would you might be interested in<ul class="footer-useful-links">  <li ng-repeat="link in usefulLinksCtrl.subset"><a ng-href="{{link.href}}" target="_blank">{{link.name}}</a></li></ul></p>',
    controller: 'UsefulLinksController',
    controllerAs: 'usefulLinksCtrl'
  };
};

module.exports = [footerLinks];

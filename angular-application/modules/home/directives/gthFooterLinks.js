var footerLinks = function() {
  return {
    template: require('../partials/footer-useful-links.html'),
    controller: 'UsefulLinksController',
    controllerAs: 'usefulLinksCtrl'
  };
};

module.exports = [footerLinks];


var contactRoutes = function($stateProvider) {
  $stateProvider
    .state('contact', {
      url: '/contact',
      template: '<!-- Page Heading --><div class="row">  <div class="col-lg-12">    <h1 class="page-header">Contact Us</h1>  </div></div><div class="row">  <div class="col-md-12">    <h4>Email Us</h4>    <p><a href="maltio:example@example.com">example@example.com</a></p>  </div>  <div class="col-md-12">    <h4>Visit us</h4>    <p>      This is where you put the location for the company    </a>    </p>  </div></div>'
    });
};

module.exports = ['$stateProvider', contactRoutes];

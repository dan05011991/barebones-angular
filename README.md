- [<span id="anchor"></span>Migrating from AngularJS to React](#-span-id--anchor----span-migrating-from-angularjs-to-react)
  * [<span id="anchor-1"></span>Benefits of migrating to React](#-span-id--anchor-1----span-benefits-of-migrating-to-react)
  * [<span id="anchor-2"></span>Terminology](#-span-id--anchor-2----span-terminology)
  * [<span id="anchor-3"></span>Adding a new React component to an AngularJS application](#-span-id--anchor-3----span-adding-a-new-react-component-to-an-angularjs-application)
    + [<span id="anchor-4"></span>1. Add dependencies to the project](#-span-id--anchor-4----span-1-add-dependencies-to-the-project)
    + [<span id="anchor-5"></span>2. Define the React component](#-span-id--anchor-5----span-2-define-the-react-component)
    + [<span id="anchor-6"></span>3. Define an Angular module for the React component](#-span-id--anchor-6----span-3-define-an-angular-module-for-the-react-component)
    + [<span id="anchor-7"></span>4. Create the top level Angular app module](#-span-id--anchor-7----span-4-create-the-top-level-angular-app-module)
    + [<span id="anchor-8"></span>5. Using the new component](#-span-id--anchor-8----span-5-using-the-new-component)
  * [<span id="anchor-9"></span>Replacing an existing AngularJS directive](#-span-id--anchor-9----span-replacing-an-existing-angularjs-directive)
    + [<span id="anchor-10"></span>1. Define the React component](#-span-id--anchor-10----span-1-define-the-react-component)
    + [<span id="anchor-11"></span>2. Define an Angular module for the React component](#-span-id--anchor-11----span-2-define-an-angular-module-for-the-react-component)
    + [<span id="anchor-12"></span>3. Create the top level Angular app module](#-span-id--anchor-12----span-3-create-the-top-level-angular-app-module)
    + [<span id="anchor-13"></span>4. Using the new component](#-span-id--anchor-13----span-4-using-the-new-component)
  * [<span id="anchor-14"></span>Useful React component libraries](#-span-id--anchor-14----span-useful-react-component-libraries)
    + [<span id="anchor-15"></span>React Bootstrap](#-span-id--anchor-15----span-react-bootstrap)
  * [<span id="anchor-16"></span>React testing techniques](#-span-id--anchor-16----span-react-testing-techniques)
    + [<span id="anchor-17"></span>Setting up Jest to test a React component](#-span-id--anchor-17----span-setting-up-jest-to-test-a-react-component)
    + [<span id="anchor-18"></span>Useful web links](#-span-id--anchor-18----span-useful-web-links)



<span id="anchor"></span>Migrating from AngularJS to React
==========================================================

This is an AngularJS application, demonstrating how React components can be integrated, with a view to migrating the whole application to React.

<span id="anchor-1"></span>Benefits of migrating to React
---------------------------------------------------------

-   It is beneficial to use an up to date technology stack. AngularJS is no longer being supported, or developed. It has been superceded by Angular 2+.
    React is currently the de-facto standard web UI framework. It has a lot of support and adoption, and is being actively maintained/developed.
-   React’s architecture is extremely structured. Based on components, it would create a very clean and maintainable Javascript codebase. We are also able to use state management frameworks e.g. Redux. This greatly improves the architecture, provides much better state management for the application, particularly between components. It also makes it easier to test the code.
-   Many developers are either learning to use React, or are already skilled. This means that there would be fewer problems in attracting and retaining developers in the team.
-   New developers on the team would be able to understand the code more easily, and become productive sooner.
-   Using React opens up possibilities of utilising more efficient development tools. E.g. headless Visual Studio debugging, and modern testing frameworks.
-   Improved UI testing. The current Jest/Karma JS tests are not ideal. Using React components allows us to engage a React based JS testing framework (e.g. testing-library <https://testing-library.com/docs/react-testing-library/intro>). This allows more focussed tests, and quicker turnaround during development. These tests can also be fully automatic, and triggered when a developer makes changes to the code. This instant feedback cycle allows earlier detection of problems, and better quality code.
-   There is a huge amount of useful React components to leverage. UI libraries such as Bootstrap now have versions based on React. We would have the potential to use many third party components.

<span id="anchor-2"></span>Terminology
--------------------------------------

AngularJS provides a component based architecture, which is structured using the “module”. Modules can contain “directives”, “services”, “filters” and “controllers”.

<span id="anchor-3"></span>Adding a new React component to an AngularJS application
-----------------------------------------------------------------------------------

We begin by describing the most simple case of adding a new React component into an existing AngularJS application.

### <span id="anchor-4"></span>1. Add dependencies to the project

We first require the following entries added in the ‘dependencies’ section of the package.json file located at the project root (Note that current versions may be different):

 "babel-eslint": "^10.1.0"
 "eslint": "^6.8.0"
 "prop-types": "^15.7.2",
 "react": "^16.13.1",
 "react-dom": "^16.13.1",
 "react2angular": "^4.0.6"

### <span id="anchor-5"></span>2. Define the React component

Consider the following simple React component. It’s irrelevant what the component does, it’s simply being used to illustrate the integration procedure:

```import React, { Component } from 'react'*
class MySpinner extends Component {
  render() {
    return
    &lt;div&gt;
    &lt;p&gt;HELLO WORLD&lt;/p&gt;
    &lt;/div&gt;
  }
}

export default MySpinner;
```

### <span id="anchor-6"></span>3. Define an Angular module for the React component

This React component can be defined as an AngularJS module by writing the following:

```
import { react2angular } from 'react2angular';
angular.module('app.myspinner', \[\]).component('mySpincomponent',
               react2angular(require('./components/MySpinner').default, \[\]));
```

### <span id="anchor-7"></span>4. Create the top level Angular app module

The entry point for an angular application is the top level module. In creating this, we specify all the required dependent modules, including the one we just defined.

```
require('./modules/site-config');
require('./modules/home');
require('./modules/event');
require('./modules/date');
require('./modules/contact');
require('./modules/comms');
require('./modules/calendar');
require('./modules/backend');
require('./modules/app-config');
require('./modules/spinner');

var app = angular.module('app', [
 'app.myspinner',
 'app.config',
 'app.comms',
 'app.car',
 ...
]);
```

### <span id="anchor-8"></span>5. Using the new component

The previously defined Angular module/React component can be used in the usual way, as part of a web page. Note the use of AngularJS naming convention: e.g. my-component = myComponent):

```
&lt;div class="collapse navbar-collapse" ng-class="!navCollapsed && 'in'"&gt;
 &lt;ul class="nav navbar-nav"&gt;
 &lt;li ui-sref-active="active" ng-click="navCollapsed = !navCollapsed"&gt;&lt;a ui-sref="home"&gt;Home&lt;/a&gt;&lt;/li&gt;
 &lt;li ui-sref-active="active" ng-click="navCollapsed = !navCollapsed"&gt;&lt;a ui-sref="car"&gt;Car&lt;/a&gt;&lt;/li&gt;
 &lt;li ui-sref-active="active" ng-click="navCollapsed = !navCollapsed"&gt;&lt;a ui-sref="about"&gt;About&lt;/a&gt;&lt;/li&gt;
 &lt;li ui-sref-active="active" ng-click="navCollapsed = !navCollapsed"&gt;**&lt;my-spincomponent&gt;&lt;/my-spincomponent&gt;**&lt;/li&gt;
 &lt;/ul&gt;
&lt;/div&gt;
```

<span id="anchor-9"></span>Replacing an existing AngularJS directive
--------------------------------------------------------------------

A more typical situation is that an angular module already exists, and contains a directive. Consider the following html which refers to an Angular element directive:

```
&lt;div ng-controller="defaultCtrl"&gt;
 &lt;unordered-list list-source="products" list-property="price | currency" /&gt;
&lt;/div&gt;
```

The corresponding definition of this directive could be:

```
angular.module("app.unorderedlist", []).directive("unorderedList", function () {
 return {
   link: function (scope, element, attrs) {
   var data = scope\[attrs\["unorderedList"\] || attrs\["listSource"\]\];
   var propertyExpression = attrs\["listProperty"\] || "price | currency";
   if (angular.isArray(data)) {
     var listElem = angular.element("&lt;ul&gt;");
     if (element\[0\].nodeName == "\#comment") {
       element.parent().append(listElem);
     } else {
       element.append(listElem);
   }

   for (var i = 0; i &lt; data.length; i++) {
     var itemElement = angular.element("&lt;li&gt;").text(scope.$eval(propertyExpression, data\[i\]));
     listElem.append(itemElement);
   }
  }},

   restrict: "EACM"
 }}).controller("defaultCtrl", function ($scope) {

   $scope.products = [
     { name: "Apples", category: "Fruit", price: 1.20, expiry: 10 },
     { name: "Bananas", category: "Fruit", price: 2.42, expiry: 7 },
     { name: "Pears", category: "Fruit", price: 2.02, expiry: 6 }
   ];
 })
 ```

So how would we convert this into a React component? Here are the steps:

### <span id="anchor-10"></span>1. Define the React component

First we need to create an equivalent React component for the Angular directive. This can be implemented as a class based component. Stateful React components use a ‘state’ object, which is analagous to the ‘scope’ in an Angular directive.

Notice also how much cleaner the generated HTML (JSX) code is in the render() function, compared to the code in the Angular directive.

```
import React, { Component } from 'react';

class MyList extends Component {
constructor(props) {
 super(props);
 this.state = {
     products : [
         { name: "Apples", category: "Fruit", price: 1.20, expiry: 10 },
         { name: "Bananas", category: "Fruit", price: 2.42, expiry: 7 },
         { name: "Pears", category: "Fruit", price: 2.02, expiry: 6 }
     ]
     };
 }

 render() {
     const productRows = this.state.products.map((product, index) =&gt;
     &lt;li key={index}&gt;{product.name}&lt;/li&gt;
 );

 return (
     &lt;div&gt;
     &lt;ul&gt;
     {productRows}
     &lt;/ul&gt;
     &lt;/div&gt;
 );
 }
}

export default MyList;
```

### <span id="anchor-11"></span>2. Define an Angular module for the React component

This React component can be defined as an AngularJS module by writing the following:

```
import { react2angular } from 'react2angular';

angular.module('app.unorderedlist', []).component('unorderedList', react2angular(require('./components/MyList').default, []));
```

### <span id="anchor-12"></span>3. Create the top level Angular app module

The entry point for an angular application is the top level module. In creating this, we specify all the required dependent modules, including the one we just defined.

```
require('./modules/site-config');
require('./modules/home');
require('./modules/event');
require('./modules/date');
require('./modules/contact');
require('./modules/comms');
require('./modules/calendar');
require('./modules/backend');
require('./modules/app-config');
require('./modules/spinner');
require('./modules/unorderedlist');

var app = angular.module('app', [
 'app.unorderedlist',
 'app.myspinner',
 'app.config',
 'app.comms',
 'app.car',
 ...
]);
```

### <span id="anchor-13"></span>4. Using the new component

The previously defined Angular module/React component can be used in the usual way, as part of a web page. Note the use of AngularJS naming convention: e.g. my-component = myComponent).

Note: We removed the ‘ng-controller’ attribute from the &lt;div&gt; element:

```
&lt;div&gt;
&lt;unordered-list list-source="products" list-property="price | currency" /&gt;
&lt;/div&gt;
```

<span id="anchor-14"></span>Useful React component libraries
------------------------------------------------------------

### <span id="anchor-15"></span>React Bootstrap

Web UI libraries have existed for some time. One of the most popular is Bootstrap. This provides a lot of useful UI components, such as spinner and accordian. A version of Bootstrap has been developed to work with React. <https://react-bootstrap.github.io/getting-started/introduction/>

To test this we initially used Webpack, which is a popular module bundler for Javascript files. In theory it can be used to include associated CSS files, but as we will describe, this caused some problems.

To start with, we can import the required React-Bootstrap items into our React component:

```
import React, { Component } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
```

We are now able to make use of Spinner and Button in our React component definition

```
class MySpinner extends Component {

 render() {
     return (
         &lt;div&gt;
         &lt;Button variant="primary" enabled="true"&gt;
         &lt;Spinner
         as="span"
         animation="border"
         size="sm"
         role="status"
         aria-hidden="true"
         /&gt;
         Loading...
         &lt;/Button&gt;
         &lt;/div&gt;
       );
   }
}
```

Webpack requires CSS loaders, which are specified in the webpack.config.js file:

```
*module: {
loaders: \[
 {
 test: /\\.css$/,
 loader: 'style-loader!css-loader'
 }
 ...
}*
```

This should be all we need to get the application working. But the following problem occurred at run time:

```
ERROR in ./~/css-loader/dist/cjs.js!./~/bootstrap/dist/css/bootstrap.css

Module build failed: TypeError: Cannot read property 'split' of undefined

 at Object.loader (/home/andrew/angular/barebones-angular/node\_modules/css-loader/dist/index.js:84:33)

 @ ./~/bootstrap/dist/css/bootstrap.css 2:26-86
 ```

The only workaround for this problem was to include the CSS file using a conventional &lt;link&gt; element in the main application index.html

```
&lt;link rel="stylesheet" href="./node\_modules/bootstrap/dist/css/bootstrap.css"&gt;
```

<span id="anchor-16"></span>React testing techniques
----------------------------------------------------

The recommended testing tools for React applications are:-

-   Jest
-   Enzyme
-   Testing-library (<https://testing-library.com/docs/react-testing-library/intro>)

Testing-library has superceded Enzyme as a React component tester. It also has mocking capabilities.

### <span id="anchor-17"></span>Setting up Jest to test a React component

When creating a pure React app, you would use the following command

npx create-react-app

However in the case of a hybrid AngularJS/React app, this command hasn’t been used to create the application, so we need to set up configuration files and dependencies manually. The following link is a useful tutorial on setting up React with Webpack, and also how to set up Jest/Enzyme:
<https://www.freecodecamp.org/news/how-to-combine-webpack-4-and-babel-7-to-create-a-fantastic-react-app-845797e036ff/>

<https://www.freecodecamp.org/news/how-to-set-up-jest-enzyme-like-a-boss-8455a2bc6d56/>

First thing is to specifiy the command to start the tests. This is done by adding the following to package.json:

```
"scripts": {
 "start": "webpack-dev-server --content-base --inline --hot --port 1234",
 **"test": "jest"**
},
```

There are a few dependencies required

```
"devDependencies": {
"@babel/plugin-proposal-class-properties": "^7.8.3",
"@babel/preset-env": "^7.9.5",
"@babel/preset-react": "^7.9.4",
"babel-core": "^6.22.1",
"babel-jest": "^25.4.0",
"babel-loader": "^6.2.10",
"babel-preset-es2015": "^6.22.0",
"babel-preset-react": "^6.22.0",
"babel-preset-stage-0": "^6.22.0",
"jest": "^25.4.0",
"jest-transform-stub": "^2.0.0",
"react-test-renderer": "^16.13.1",
"webpack": "^1.14.0",
"webpack-dev-server": "^1.16.2"
},
```

And because React uses JSX syntax, this needs to be translated into conventional Javascript. There’s a plugin called Babel which does this

```
"jest": {
 "transform": {
 "^.+\\\\.js?$": "babel-jest"
 }
}
```

There’s also a configuration file for babel, which is *.babelrc* in the top level directory of your application. Add the following to this file

```
{
 "presets": [
 "@babel/preset-env",
 "@babel/preset-react"
 ],
 "plugins": \["@babel/plugin-proposal-class-properties"\]
}
```

### <span id="anchor-18"></span>Useful web links

<https://www.robinwieruch.de/minimal-react-webpack-babel-setup>

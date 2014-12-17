'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Fitnessassessment = new Module('fitnessassessment');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Fitnessassessment.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Fitnessassessment.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Fitnessassessment.menus.add({
    title: 'fitnessassessment example page',
    link: 'fitnessassessment example page',
    roles: ['authenticated'],
    menu: 'main'
  }).add({
  	title: 'List Companies',
  	link: 'list companies',
  	roles: ['authenticated'],
  	menu: 'main'
  }).add({
  	title: 'Create Company',
  	link: 'create company',
  	roles: ['authenticated'],
  	menu: 'main'
  });
  
  Fitnessassessment.aggregateAsset('css', 'fitnessassessment.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Fitnessassessment.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Fitnessassessment.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Fitnessassessment.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Fitnessassessment;
});
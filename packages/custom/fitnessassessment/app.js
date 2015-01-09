'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Fitnessassessment = new Module('fitnessassessment', ['angular-chartist', 'ui.utils']);

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Fitnessassessment.register(function(app, auth, database) {

	var userModel = database.connection.model('User');
	userModel.schema.add({
		active: 'Boolean',
		companies: [{
			type: Schema.Types.ObjectId,
			ref: 'Company'
		}],
		trainers: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    clients: [Schema.Types.Mixed],
    goals: [Schema.Types.Mixed],
    imagesets: [Schema.Types.Mixed]
/*    imagesets: [{
      front: {
        name: 'String',
        src: 'String'
      },
      back: {
        name: 'String',
        src: 'String'
      },
      side: {
        name: 'String',
        src: 'String'
      }
    }]*/
	});

  //We enable routing. By default the Package Object is passed to the routes
  Fitnessassessment.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Fitnessassessment.menus
  /*.add({
    title: 'fitnessassessment example page',
    link: 'fitnessassessment example page',
    roles: [],
    menu: 'main'
  })*/
  .add({
  	title: 'My Profile',
  	link: 'my profile',
  	roles: [],
  	menu: 'main'
  })
  .add({
    title: 'Goals',
    link: 'user goals',
    roles: [],
    menu: 'main'
  })
  .add({
    title: 'Manage Trainers',
    link: 'list trainers',
    roles: ['owner'],
    menu: 'main'
  })
  .add({
    title: 'Client List',
    link: 'list clients',
    roles: ['owner', 'trainer']
  })
  .add({
    title: 'Manage Teams',
    link: 'list teams',
    roles: [],
    menu: 'main'
  })
  .add({
    title: 'Profiles',
    link: 'user profiles',
    roles: [],
    menu: 'main'
  })
/*  .add({
    title: 'List Companies',
    link: 'list companies',
    roles: ['owner'],
    menu: 'main'
  })
  .add({
    title: 'Create Company',
    link: 'create company',
    roles: ['owner'],
    menu: 'main'
  })*/
  .add({
  	title: 'Measurements',
  	link: 'measurements',
  	roles: ['trainer'],
  	menu: 'main'
  })
  .add({
    title: 'Print',
    link: 'print',
    roles: ['trainer'],
    menu: 'main'
  })
  .add({
    title: 'Progress Charts',
    link: 'progress charts',
    roles: ['trainer'],
    menu: 'main'
  })
  .add({
  	title: 'Support',
  	link: 'support',
  	roles: ['trainer'],
  	menu: 'main'
  });
  
  Fitnessassessment.aggregateAsset('css', 'fitnessassessment.css');
  Fitnessassessment.aggregateAsset('css', 'normalize.css');
  Fitnessassessment.aggregateAsset('css', 'chartist.css');

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

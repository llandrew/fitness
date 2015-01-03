'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Fitnessassessment = new Module('fitnessassessment', ['angular-chartist']);

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
    roles: ['authenticated'],
    menu: 'main'
  })*/
/*  .add({
  	title: 'My Profile',
  	link: 'my profile',
  	roles: ['authenticated'],
  	menu: 'main'
  })*/
  .add({
    title: 'Trainers',
    link: 'list trainers',
    roles: ['authenticated', 'owner'],
    menu: 'main'
  })
  .add({
    title: 'Clients',
    link: 'list clients',
    roles: ['authenticated', 'owner', 'trainer']
  })
  .add({
    title: 'Profiles',
    link: 'user profiles',
    roles: ['authenticated'],
    menu: 'main'
  })
  .add({
    title: 'Teams',
    link: 'list teams',
    roles: ['authenticated'],
    menu: 'main'
  })
/*  .add({
    title: 'List Companies',
    link: 'list companies',
    roles: ['authenticated', 'owner'],
    menu: 'main'
  })
  .add({
    title: 'Create Company',
    link: 'create company',
    roles: ['authenticated', 'owner'],
    menu: 'main'
  })*/
  .add({
  	title: 'Create Assessment',
  	link: 'create assessment',
  	roles: ['authenticated'],
  	menu: 'main'
  })
  .add({
  	title: 'Measurements',
  	link: 'measurements',
  	roles: ['authenticated'],
  	menu: 'main'
  })
  .add({
    title: 'Print',
    link: 'print',
    roles: ['authenticated'],
    menu: 'main'
  })
  .add({
    title: 'Progress Charts',
    link: 'progress charts',
    roles: ['authenticated'],
    menu: 'main'
  })
  .add({
  	title: 'Support',
  	link: 'support',
  	roles: ['authenticated'],
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

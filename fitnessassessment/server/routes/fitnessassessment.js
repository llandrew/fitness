'use strict';

var assessmentController = require('../controllers/fitnessassessment.js');

// The Package is past automatically as first parameter
module.exports = function(Fitnessassessment, app, auth, database) {

  app.get('/fitnessassessment/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/fitnessassessment/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/fitnessassessment/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/profiles/:profileId', auth.isMongoId, function(req, res, next) {
  	assessmentController.showUser(req, res);
  });
  app.put('/profiles/:profileId', auth.isMongoId, function(req, res, next) {
  	assessmentController.updateProfile(req, res);
  });

  app.get('/companies', auth.requiresLogin, function(req, res, next) {
  	assessmentController.listCompanies(req, res);
  });

  app.post('/companies', auth.requiresLogin, function(req, res, next) {
  	assessmentController.create(req, res);
  });

  app.get('/companies/:companyId', auth.isMongoId, function(req, res, next) {
  	assessmentController.show(req, res);
  });

  app.put('/companies/:companyId', auth.isMongoId, function(req, res, next) {
  	assessmentController.update(req, res);
  });

  app.delete('/companies/:companyId', auth.isMongoId, function(req, res, next) {
  	assessmentController.destroy(req, res);
  });

  app.get('/fitnessassessment/example/render', function(req, res, next) {
    Fitnessassessment.render('index', {
      package: 'fitnessassessment'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });

  app.param('companyId', assessmentController.findCompany);
  app.param('profileId', assessmentController.findProfile);
};

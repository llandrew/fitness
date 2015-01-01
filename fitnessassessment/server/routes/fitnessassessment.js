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

  app.get('/profiles/', auth.requiresLogin, function(req, res, next) {
  	assessmentController.listProfiles(req, res);
  });

  app.get('/profiles/trainers/', auth.requiresLogin, function(req, res, next) {
    assessmentController.listProfiles(req, res);
  });

  app.put('/profiles/trainers/:profileId', auth.isMongoId, function(req, res, next) {
    assessmentController.updateProfile(req, res);
  });

  app.get('/profiles/:profileId', auth.isMongoId, function(req, res, next) {
  	assessmentController.showProfile(req, res);
  });
  app.put('/profiles/:profileId', auth.isMongoId, function(req, res, next) {
  	assessmentController.updateProfile(req, res);
  });

  /**
   * COMPANIES
   */

  app.get('/companies', auth.requiresLogin, function(req, res, next) {
  	assessmentController.listCompanies(req, res);
  });

  app.post('/companies', auth.requiresLogin, function(req, res, next) {
  	assessmentController.createCompany(req, res);
  });

  app.get('/companies/:companyId', auth.isMongoId, function(req, res, next) {
  	assessmentController.showCompany(req, res);
  });

  app.put('/companies/:companyId', auth.isMongoId, function(req, res, next) {
  	assessmentController.updateCompany(req, res);
  });

  app.delete('/companies/:companyId', auth.isMongoId, function(req, res, next) {
  	assessmentController.destroyCompany(req, res);
  });

  /**
   * ASSESSMENTS
   */

  app.get('/assessments', auth.requiresLogin, function(req, res, next) {
  	assessmentController.listAssessments(req, res);
  });

  app.post('/assessments', auth.requiresLogin, function(req, res, next) {
  	assessmentController.createAssessment(req, res);
  });

  app.get('/assessments/user/:profileId', auth.isMongoId, function(req, res, next) {
  	assessmentController.getUserAssessments(req, res);
  });

  app.get('/assessments/:assessmentId', auth.isMongoId, function(req, res, next) {
  	assessmentController.showAssessment(req, res);
  });

  app.put('/assessments/:assessmentId', auth.isMongoId, function(req, res, next) {
  	assessmentController.updateAssessment(req, res);
  });

  app.delete('/assessments/:assessmentId', auth.isMongoId, function(req, res, next) {
  	assessmentController.destroyAssessment(req, res);
  });

  /**
   * TEAMS
   */
  
  app.get('/teams', auth.requiresLogin, function(req, res, next) {
    assessmentController.listTeams(req, res);
  });

  app.post('/teams', auth.requiresLogin, function(req, res, next) {
    assessmentController.createTeam(req, res);
  });

  /**
   * PROGRESS CHARTS
   */

  app.get('/progress-charts/:profileId', auth.isMongoId, function(req, res, next) {
  	assessmentController.getUserAssessments(req, res);
  });

  /**
   * EXAMPLE
   */

  app.get('/fitnessassessment/example/render', function(req, res, next) {
    Fitnessassessment.render('index', {
      package: 'fitnessassessment'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });

  /**
   * PARAMETERS
   */

  app.param('companyId', assessmentController.findCompany);
  app.param('profileId', assessmentController.findProfile);
  app.param('assessmentId', assessmentController.findAssessment);
};

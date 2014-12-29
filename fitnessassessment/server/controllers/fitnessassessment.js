'use strict';

var mongoose 	= require('mongoose'),
	Company  	= mongoose.model('Company'),
	User 	 	= mongoose.model('User'),
	Assessment 	= mongoose.model('Assessment'),
	_ 		 	= require('lodash');

/**
 * 
 * PROFILE CONTROLLERS
 * 
 */

exports.findProfile = function(req, res, next, id) {
	User.findOne({
		_id: id
	})
	//.populate('companies')
	.populate('trainers')
	//.populate('clients')
	.exec(function(err, profile) {
		if (err) return next(err);
		if (!profile) return next(new Error('Failed to load profile ' + id));

		req.profile = profile;

		Company.find().where('owner').equals(profile._id).exec(function(err, companies) {
			req.profile._doc.companies = companies;
		});

		User.find().where('trainers').equals(profile._id).exec(function(err, clients) {
			req.profile._doc.clients = clients;
			next();
		});
	});
};

exports.showProfile = function(req, res) {
	res.json(req.profile);
};

exports.listProfiles = function(req, res) {
	User.find().sort('-created').exec(function(err, profiles) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot list the profiles'
			});
		}
		res.json(profiles);
	});
};

exports.updateProfile = function(req, res) {
	var profile = req.profile;

	if (req.body.action === 'add trainer') {
		profile._doc.trainers.push(req.body.newTrainer);
		profile.markModified('trainers');
	}


	profile.save(function(err, doc) {

	});
};

/**
 *
 * CLIENT CONTROLLERS
 * 
 */

/**
 *
 * TRAINER CONTROLLERS
 * 
 */

/**
 *
 * COMPANY CONTROLLERS
 * 
 */

exports.findCompany = function(req, res, next, id) {
	Company.load(id, function(err, company) {
		if (err) return next(err);
		if (!company) return next(new Error('Failed to load company ' + id));

		req.company = company;
		next();
	});
};

exports.showCompany = function(req, res) {
	res.json(req.company);
};

exports.listCompanies = function(req, res) {
	Company.find().sort('-created').populate('owner', 'name username').exec(function(err, companies) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot list the companies'
			});
		}
		res.json(companies);
	});
};

exports.createCompany = function(req, res) {
	var company = new Company(req.body);
	company.owner = req.user;

	company.save(function(err) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot save the company'
			});
		}
		User.findByIdAndUpdate(req.user._id, { $push : { companies : company._id } }, function(err, user) {
			res.json(company);
		});
	});
};

/**
 * Delete a company
 */
exports.destroyCompany = function(req, res) {
  var company = req.company;

  company.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the company'
      });
    }
    res.json(company);

  });
};

/**
 * Update a company
 */
exports.updateCompany = function(req, res) {
  var company = req.company;

  company = _.extend(company, req.body);

  company.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the company'
      });
    }
    res.json(company);

  });
};

/**
 *
 * ASSESSMENT CONTROLLERS
 * 
 */

/**
 * Create an assessment
 */
exports.createAssessment = function(req, res) {
	var assessment = new Assessment(req.body);
	assessment.owner = req.user;

	assessment.save(function(err) {
		if(err) {
			return res.status(500).json({
				error: 'Cannot save the assessment'
			});
		}
		User.findByIdAndUpdate(req.user._id, { $push: { assessments : assessment._id } }, function(err, user) {
			res.json(assessment);
		});
	});
};

/**
 * Find an assessment
 */
exports.findAssessment = function(req, res, next, id) {
	Assessment.findOne({
		_id: id
	})
	.exec(function(err, assessment) {
		if (err) return next(err);
		if (!assessment) return next(new Error('Failed to load assessment ' + id));

		req.assessment = assessment;
		console.log(assessment);
	});
};

exports.showAssessment = function(req, res) {
	console.log('showAssessment');
	console.log(req.assessment);
	res.json(req.assessment);
};

exports.listAssessments = function(req, res) {
	Assessment.find().exec(function(err, assessments) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot list the assessments'
			});
		}
		res.json(assessments);
	});
};
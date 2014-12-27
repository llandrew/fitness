'use strict';

var mongoose = require('mongoose'),
	Company  = mongoose.model('Company'),
	User 	 = mongoose.model('User'),
	_ 		 = require('lodash');

/**
 * 
 * PROFILE CONTROLLERS
 * 
 */

exports.findProfile = function(req, res, next, id) {
	User.findOne({
		_id: id
	})
	.populate('companies')
	.populate('clients')
	.exec(function(err, profile) {
		if (err) return next(err);
		if (!profile) return next(new Error('Failed to load profile ' + id));
		req.profile = profile;
		next();
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

	console.log(req.body);
	console.log(profile);
	console.log(req.body.trainers);
	_.extend(profile.trainers, req.body.trainers);
	//profile = _.extend(profile, req.body);
	console.log(profile);
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
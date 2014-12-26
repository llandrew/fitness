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
	.exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));
		req.user = user;
		next();
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
	console.log('in company');
	Company.load(id, function(err, company) {
		if (err) return next(err);
		if (!company) return next(new Error('Failed to load company ' + id));
		req.company = company;
		next();
	});
};


exports.listCompanies = function(req, res) {
	Company.find().sort('-created').populate('user', 'name username').exec(function(err, companies) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot list the companies'
			});
		}
		res.json(companies);
	});
};

exports.create = function(req, res) {
	console.log('in create');
	var company = new Company(req.body);
	company.owner = req.user;

	company.save(function(err) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot save the company'
			});
		}
		console.log(company);
		User.findByIdAndUpdate(req.user._id, { $push : { companies : company._id } }, function(err, user) {
			console.log(user);
			console.log(err);
			res.json(company);
		});
	});
};

exports.show = function(req, res) {
/*	User.findOne({username: 'hyuugurt'}, function(err, client) {
		User.findByIdAndUpdate(req.user._id, { $push: {clients: client._id}}, function (err, doc) {
			console.log(doc._doc);
		});
	});*/
	res.json(req.company);
};

exports.showUser = function(req, res) {
	res.json(req.user);
};

/**
 * Delete a company
 */
exports.destroy = function(req, res) {
	//console.log('destroying company');
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
exports.update = function(req, res) {
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
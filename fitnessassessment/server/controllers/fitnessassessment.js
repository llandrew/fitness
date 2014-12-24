'use strict';

var mongoose = require('mongoose'),
	Company  = mongoose.model('Company'),
	User 	 = mongoose.model('User'),
	_ 		 = require('lodash');

exports.company = function(req, res, next, id) {
	console.log('in company');
	Company.load(id, function(err, company) {
		if (err) return next(err);
		if (!company) return next(new Error('Failed to load company ' + id));
		req.company = company;
		next();
	});
};
exports.user = function(req, res, next, id) {
	User.findOne({
		_id: id
	})
	.populate('companies')
	.exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));
		req.user = user;
		next();
	});
};

exports.all = function(req, res) {
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
	company.user = req.user;

	company.save(function(err) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot save the company'
			});
		}
		res.json(company);
	});
};

exports.show = function(req, res) {
	console.log('in show');
	console.log('after show');
	console.log(req.company);
	User.findByIdAndUpdate(req.user._id, { $set : { test: 'Second String', companies: req.company._id } }, function (err, doc) {
		console.log(doc);
	});
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
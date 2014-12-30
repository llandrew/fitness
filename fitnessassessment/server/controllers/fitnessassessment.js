'use strict';

var config   = require('meanio').loadConfig(),
	mongoose = require('mongoose'),
	Company  = mongoose.model('Company'),
	User 	 = mongoose.model('User'),
	Goal 	 = mongoose.model('Goal'),
	ImageSet = mongoose.model('ImageSet'),
	_ 		 = require('lodash'),
	fs 		 = require('fs');

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
	//.populate('imagesets')
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
	if (req.route.path === '/profiles/') {
		User.find().sort('-created').exec(function(err, profiles) {
			if (err) {
				return res.status(500).json({
					error: 'Cannot list the profiles'
				});
			}
			res.json(profiles);
		});
	}
	if (req.route.path === '/profiles/trainers/') {
		User.find().where('roles').equals('trainer').sort('-created').exec(function(err, profiles) {
			if (err) {
				return res.status(500).json({
					error: 'Cannot lsit the profiles'
				});
			}

			_.forEach(profiles, function (profile, key) {
				User.find().where('trainers').equals(profile._id).exec(function(err, clients) {
					console.log(profile);
					console.log(clients);
					profiles[key]._doc.clients = clients;
					if (key === profiles.length - 1) {
						res.json(profiles);
					}
				});
			});
				//console.log(profiles);
				//res.json(profiles);
		});
	}
};

exports.updateProfile = function(req, res) {
	var profile = req.profile;

	if (req.body.action === 'add trainer') {
		profile._doc.trainers.push(req.body.newTrainer);
		profile.markModified('trainers');
	}

	if (req.body.action === 'update goals') {
		console.log(req.body.goals);
		profile._doc.goals = req.body.goals;
		console.log(profile._doc);
		if (req.body.newGoal !== undefined) {
			console.log(req.body.newGoal);
			var newGoal = new Goal({
				title: req.body.newGoal,
				description: req.body.newGoal,
				trainer_assigned: (req.body.TrainerAssigned) ? true : false,
				complete: false
			});
			console.log(newGoal);
			profile._doc.goals.push(newGoal);
			//profile._doc.goals = [];
			profile.markModified('goals');
			//console.log(profile._doc);
		}
	}

	if (req.body.action === 'add imagesets') {

		for (var image in req.body.newImages) {
			console.log(image);
			var imageSet = new ImageSet({front: {name: req.body.newImages[image].name, src: req.body.newImages[image].src}, back: {name: '', src: ''}, side: {name: '', src: ''}});
			console.log(imageSet);
			//profile._doc.imagesets = [];
			profile._doc.imagesets.push(imageSet);
			profile.markModified('imagesets');
			console.log(profile._doc);
		}
	}

	if (req.body.action === 'remove imageset') {
		var removeId = _.difference(_.map(profile._doc.imagesets, '_id'), _.map(req.body.imagesets, '_id'))[0].toString();

		//removeId = removeId[0].toString();

		console.log(removeId);
		console.log(typeof removeId);

		_.forEach(profile._doc.imagesets, function(set, key) {
			console.log('in for each');
			console.log(set);
			if (set._id.toString() === removeId) {
				console.log('set in remove');
				_.forEach(set, function(image) {
					console.log(image);
					if (image.src && image.src !== '') {
						fs.unlink(config.root + image.src, function(err) {
							if (err) {
								console.log(err);
							}
						});
					}
				});
			}
		});
		profile._doc.imagesets = req.body.imagesets;
		profile.markModified('imagesets');
	}


	profile.save(function(err, doc) {
		console.log('saved profile');
		doc.populate('trainers', function(err, doc) {
			res.json(doc);
		});
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
 * FILE CONTROLLERS
 * 
 */

exports.uploadFinished = function(files) {
};
'use strict';

var config     = require('meanio').loadConfig(),
	mongoose   = require('mongoose'),
	Company    = mongoose.model('Company'),
	User 	   = mongoose.model('User'),
	Team 	   = mongoose.model('Team'),
	Goal 	   = mongoose.model('Goal'),
	ImageSet   = mongoose.model('ImageSet'),
	Assessment = mongoose.model('Assessment'),
	_ 		   = require('lodash'),
	fs 		   = require('fs');

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
	.populate('team')
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
		});

		Assessment.find().where('owner').equals(profile._id).exec(function(err, assessments) {
			req.profile._doc.assessments = assessments;
			next();
		});
	});
};

exports.showProfile = function(req, res) {
	res.json(req.profile);
};

exports.listProfiles = function(req, res) {
	if (req.route.path === '/profiles/') {
		User.find().sort('-created').populate('trainers').populate('team').exec(function(err, profiles) {
			if (err) {
				return res.status(500).json({
					error: 'Cannot list the profiles'
				});
			}
			res.json(profiles);
		});
	}
	if (req.route.path === '/profiles/trainers/') {
		User.find().where('roles').equals('trainer').sort('-created').populate('trainers').populate('team').exec(function(err, profiles) {
			if (err) {
				return res.status(500).json({
					error: 'Cannot lsit the profiles'
				});
			}

			_.forEach(profiles, function (profile, key) {
				console.log(profile);
				User.find().where('trainers').equals(profile._id).exec(function(err, clients) {
					console.log(clients);
					profiles[key]._doc.clients = clients;
					if (key === profiles.length - 1) {
						res.json(profiles);
					}
				});
			});
				//res.json(profiles);
		});
	}

	if (req.route.path === '/profiles/clients/') {
		User.find().where('roles').equals('client').sort('-created').populate('trainers').populate('team').exec(function(err, profiles) {
			if (err) {
				return res.status(500).json({
					error: 'Cannot list the profiles'
				});
			}

			res.json(profiles);
		});
	}
};

exports.updateProfile = function(req, res) {
	var profile = req.profile;

	if (req.body.action === 'add trainer') {
		profile._doc.trainers = [];
		profile._doc.trainers.push(mongoose.Types.ObjectId(req.body.newTrainer));
		profile.markModified('trainers');
	}

	if (req.body.action === 'add team') {
		profile._doc.team = req.body.team;
		profile.markModified('team');
	}

	if (req.body.action === 'toggle activation') {
		profile._doc.active = !profile._doc.active;
		profile.markModified('active');
		console.log(profile._doc);
	}

	if (req.body.action === 'update goals') {
		profile._doc.goals = req.body.goals;
		if (req.body.newGoal !== undefined) {
			var newGoal = new Goal(req.body.newGoal);
			profile._doc.goals.push(newGoal);
			//profile._doc.goals = [];
			profile.markModified('goals');
		}
	}

	if (req.body.action === 'delete goal') {
		var deleted_goal = req.body.goal;

		_.forEach(profile._doc.goals, function(goal, key) {
			if (goal._id.toString() === deleted_goal._id) {
				req.body.goals.splice(key, 1);
			}
		});
		profile._doc.goals = req.body.goals;
		profile.markModified('goals');
	}

	if(req.body.action === 'complete goal') {
		var completed_goal = req.body.goal;

		
	}

	if (req.body.action === 'add avatar') {
		var avatarFiles = req.body.newAvatar;
		if (avatarFiles[0]) {
			profile._doc.avatar = avatarFiles[0].src.replace(/\\/g, '/');
			profile.markModified('avatar');
		}
	}

	if (req.body.action === 'add imagesets') {

		for (var image in req.body.newImages) {
			var imageSet = new ImageSet({front: {name: req.body.newImages[image].name, src: req.body.newImages[image].src}, back: {name: '', src: ''}, side: {name: '', src: ''}});
			//profile._doc.imagesets = [];
			profile._doc.imagesets.push(imageSet);
			profile.markModified('imagesets');
		}
	}

	if (req.body.action === 'remove imageset') {
		var removeId = _.difference(_.map(profile._doc.imagesets, '_id'), _.map(req.body.imagesets, '_id'))[0].toString();

		//removeId = removeId[0].toString();


		_.forEach(profile._doc.imagesets, function(set, key) {
			if (set._id.toString() === removeId) {
				_.forEach(set, function(image) {
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
		doc.populate('trainers team', function(err, doc) {
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
 * TEAM CONTROLLERS
 * 
 */

exports.listTeams = function(req, res) {
	Team.find().sort('-create').exec(function(err, teams) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot list the teams'
			});
		}
		res.json(teams);
	});
};

exports.createTeam = function(req, res) {

	console.log(req.body);
	var team = new Team(req.body);

	team.save(function(err) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot create new team.'
			});
		}
		res.json(team);
	});
};

exports.createImageset = function(req, res) {

	var imageset = new ImageSet(req.body);

	imageset.save(function(err) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot save the image set'
			});
		}
		res.json(imageset);
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
	//assessment.owner = req.user;

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
	.populate('images')
	.exec(function(err, assessment) {
		if (err) return next(err);
		if (!assessment) return next(new Error('Failed to load assessment ' + id));

		req.assessment = assessment;
		next();
	});
};

/**
 * Show Assessment
 */
exports.showAssessment = function(req, res) {
	res.json(req.assessment);
};

/**
 * List Assessments
 */
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

/**
 * Get User Assessments
 */

exports.getUserAssessments = function(req, res) {
	var profileId = req.params.profileId;

	Assessment.find().where('owner').equals(profileId).exec(function(err, assessments) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot list the assessments'
			});
		}
		console.log(assessments);
		res.json(assessments);
	});
};

/**
 * Delete an assessment
 */
exports.destroyAssessment = function(req, res) {
  var assessment = req.assessment;

  assessment.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the assessment'
      });
    }
    res.json(assessment);

  });
};

/**
 * Update an assessment
 */
exports.updateAssessment = function(req, res) {
  var assessment = req.assessment;

  assessment = _.extend(assessment, req.body);

  assessment.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the assessment'
      });
    }
    res.json(assessment);

  });
};

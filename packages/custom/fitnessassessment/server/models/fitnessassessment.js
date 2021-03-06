'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var JournalSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	content: {
		type: String,
		required: true,
		trim: true
	},
	create_date: {
		type: Date,
		default: Date.now
	},
	modify_date: {
		type: Date,
		default: Date.now
	}
});

var GoalSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	trainer_assigned: {
		type: Boolean,
		default: false
	},
	complete: {
		type: Boolean,
		default: false
	},
	create_date: {
		type: Date,
		default: Date.now
	},
	modify_date: {
		type: Date,
		default: Date.now
	}
});

var AssessmentSchema = new Schema({
	entry_date: {
		type: Date,
		default: Date.now
	},
	weight: {
		type: Number
	},
	height: {
		type: Number
	},
	triceps: {
		type: Number
	},
	pectoral: {
		type: Number
	},
	midaxilla: {
		type: Number
	},
	subscapular: {
		type: Number
	},
	abdomen: {
		type: Number
	},
	suprailiac: {
		type: Number
	},
	quadriceps: {
		type: Number
	},
	chest_bust: {
		type: Number
	},
	arm_right: {
		type: Number
	},
	arm_left: {
		type: Number
	},
	waist: {
		type: Number
	},
	hips: {
		type: Number
	},
	thigh_right: {
		type: Number
	},
	thigh_left: {
		type: Number
	},
	knee_right: {
		type: Number
	},
	knee_left: {
		type: Number
	},
	calf_right: {
		type: Number
	}, 
	calf_left: {
		type: Number
	},
	trainer: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	images: {
		type: Schema.ObjectId,
		ref: 'ImageSet'
	}
});

var ClientSchema = new Schema({
	gender: {
		type: String,
		required: true,
		trim: true
	},
	birthdate: {
		type: Date,
		required: true,
		default: Date.now
	},
});

var TeamSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	}
});

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teams: [TeamSchema]
});

var ImageSetSchema = new Schema({
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	front: {
		name: {
			type: String
		},
		src: {
			type: String
		}
	},
	back: {
		name: {
			type: String
		},
		src: String
	},
	side: {
		name: {
			type: String
		},
		src: {
			type: String
		}
	}
});

/**
 * Validations
 */
CompanySchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

CompanySchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

GoalSchema.path('title').validate(function(title) {
	return !!title;
}, 'Title cannot be blank');

/**
 * Statics
 */
CompanySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('owner', 'name username').exec(cb);
};

/**
 * Instantiate the models
 */

mongoose.model('Company', CompanySchema);
mongoose.model('Client', ClientSchema);
mongoose.model('Journal', JournalSchema);
mongoose.model('Goal', GoalSchema);
mongoose.model('Assessment', AssessmentSchema);
mongoose.model('Team', TeamSchema);
mongoose.model('ImageSet', ImageSetSchema);

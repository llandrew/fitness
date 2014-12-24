'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

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
	trainer_assigned_flag: {
		type: Boolean,
		default: false
	},
	complete_flag: {
		type: Boolean,
		default: false
	}
});

var MeasurementSchema = new Schema({
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
	quadraceps: {
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
	photo_front: {
		type: String,
		trim: true
	},
	photo_side: {
		type: String,
		trim: true
	},
	photo_back: {
		type: String,
		trim: true
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
	journals: [JournalSchema],
	goals: [GoalSchema]
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
 * Validations
 */
CompanySchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

CompanySchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
CompanySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Company', CompanySchema);
mongoose.model('Client', ClientSchema);
mongoose.model('Journal', JournalSchema);
mongoose.model('Goal', GoalSchema);
mongoose.model('Measurement', MeasurementSchema);
mongoose.model('Team', TeamSchema);
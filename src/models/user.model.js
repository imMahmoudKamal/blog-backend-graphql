import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
	},

	lastName: {
		type: String,
		required: true,
		trim: true,
	},

	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
		minlength: 6,
	},

	ProfilePicture: {
		type: String,
		default: '/images/ProfilePicture.jpg',
	},

	role: {
		type: String,
		default: 'author',
		enum: {
			values: ['admin', 'author'],
			message: '{VALUE} is not supported role',
		},
	},

	blocked: {
		type: Boolean,
		default: false,
	},
});

// specify the transform schema option
if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret, options) {
	// remove the password and __v of every document before returning the result
	delete ret.password;
	delete ret.__v;
	return ret;
};

///////////////////////////////////////////////////// Hashing password befor saving //////////////

// Number of rounds to use, defaults to 10 if omitted
const saltRounds = process.env.SALT_ROUNDS;

schema.pre('save', function () {
	const currentUser = this;
	const salt = bcrypt.genSaltSync(saltRounds);
	currentUser.password = bcrypt.hashSync(currentUser.password, salt);
});

////////////////////////////////////////////////////////////////////// Check Password ////////////
schema.methods.checkPassword = function (plainPassword) {
	const currentUser = this;
	return bcrypt.compare(plainPassword, currentUser.password);
};

//////////////////////////////////////////////////////////////////////// JsonWebToken /////////////
schema.methods.generateToken = function () {
	const currentUser = this;
	const jwtSecret = process.env.JWT_SECRET;
	return jwt.sign({ id: currentUser.id }, jwtSecret, { expiresIn: '24h' });
};

////////////////////////////////////////////////////////////////////////////// verification of token /////////
schema.statics.getToken = async function (token) {
	const User = this;
	const { id } = await jwt.verify(token, process.env.JWT_SECRET);
	return await User.findById(id);
};

export const User = mongoose.model('User', schema);

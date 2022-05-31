import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
	fristName: {
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

	token: {
		type: String,
		required: true,
	},

	role: {
		type: String,
		default: 'viewer',
		enum: {
			values: ['admin', 'editor', 'viewer'],
			message: '{VALUE} is not supported role',
		},
	},

	blocked: {
		type: Boolean,
		default: false,
	},
});

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
	const currentDocument = this;
	const jwtSecret = process.env.JWT_SECRET;
	return jwt.sign({ id: currentDocument.id }, jwtSecret, { expiresIn: '10h' });
};

////////////////////////////////////////////////////////////////////////////// verification of token /////////
schema.statics.getToken = async function (token) {
	const User = this;
	const { id } = await jwt.verify(token, process.env.JWT_SECRET);
	return await User.findById(id);
};

export const User = mongoose.model('User', schema);

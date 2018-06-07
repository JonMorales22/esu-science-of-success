import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UsersSchema = new Schema({
	username: String,
	hash: String,
	salt: String
});

UsersSchema.methods.savePassword = function savePassword(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

UsersSchema.methods.validatePassword =  function validatePassword(password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};

export default mongoose.model('User', UsersSchema);

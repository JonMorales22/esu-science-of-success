import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const crypto = require('crypto');
//hash: 72b0afb122bd671c788f4f224f9245158666a8b09264ed9995e410923b5b2dd3b8ee9f410bcc2164b9f2cec966582b5307382788dd44bc0dd8c17ae3e5138d98
//salt: 1d007018f754fb536451264eeb50fb0a

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
	console.log(this.hash);
	console.log(this.salt);
	return this.hash === hash;
};

export default mongoose.model('User', UsersSchema);

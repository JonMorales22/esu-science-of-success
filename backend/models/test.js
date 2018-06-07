import mongoose from 'mongoose';
const Schema = mongoose.Schema;

function validateArray(arr) {
	if(arr.length>0==false)
		return false;
	else
		return true;
}

const TestsSchema = new Schema({
  name: { type: String, unique: true },
  trials: [{type: String}],
  questions: [{type: String}],
  debriefing: String,
}, { timestamps: true });


TestsSchema.pre('remove', function(next) {
	Response.remove({ testId: this._id }).exec();
});

export default mongoose.model('Test', TestsSchema);
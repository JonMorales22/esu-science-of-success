import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SubjectsSchema = new Schema({
	age: Number,
	gender: String,
	year: String,
	ethnicity: String,
	religion: Number,
	dropboxURL: String,
	responses: [{ trialsIndex: Number, questionsIndex: Number, transcript: String, latency: Number , startTime: Number}],
	testId: {type: Schema.Types.ObjectId, ref: 'Test'}
}, { timestamps: true });

export default mongoose.model('Subject', SubjectsSchema);
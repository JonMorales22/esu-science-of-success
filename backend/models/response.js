import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ResponsesSchema = new Schema({
	subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
	testId: { type: Schema.Types.ObjectId, ref: 'Test'},
	trialsIndex: Number,
	questionsIndex: Number,
	audio: String,
	data: {transcript: String, latency: Number },
});

export default mongoose.model('Response', ResponsesSchema);
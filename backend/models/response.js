import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ResponsesSchema = new Schema({
	subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
	testId: { type: Schema.Types.ObjectId, ref: 'Test'},
	data: {trialsIndex: Number, questionsIndex: Number, transcript: String, latency: Number, startTime: Number },
});

export default mongoose.model('Response', ResponsesSchema);
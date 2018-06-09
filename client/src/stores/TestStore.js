import { observable, action } from "mobx";

/*
	Used to keep track of test data. This is used to that we only have to pull from DB once.
*/

export class TestStore {
	@observable testId = '5b1c2cbdd2595a15e0dda206';
	@observable testName = 'testInformedConsent';
	@observable questions = [];
	@observalbe trials = [];
	@observable informed_consent = '';
	@observable debriefing = '';

	@action.bound
	setTestId(testId) {
		this.testId = testId; 
	}

	@action.bound
	setTestName(testName) {
		this.testName = testName;
	}

	@action.bound
	setQuestions(questions) {
		this.questions = questions;
	}

	@action.bound
	setTrials(trials) {
		this.trials = trials;
	}

	@action.bound
	setDisclose(disclose) {
		this.disclose = disclose;
	}

	@action.bound
	setInformedConsent(informed_consent) {
		this.informed_consent = informed_consent;
	}

}

const testStore = new TestStore();


export default testStore;
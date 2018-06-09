import { observable, action } from "mobx";

/*
	Used to keep track of user data.
	We store testId so we can pull the test data from database whenever we need it.
	Admittedly we could probably store the ENTIRE test in this store, but I ran out of time to test that.
*/

export class UserStore {
	@observable isLoggedIn = true;
	@observable answeredSurvey = false;
	@observable subjectId = '';
	@observable testId = '5b1c2cbdd2595a15e0dda206';
	@observable testName = 'testInformedConsent';
	

	@action.bound
	setSubjectId(subjectId) {
		this.subjectId = subjectId;
	}

	@action.bound
	setTestId(testId) {
		this.testId = testId; 
	}

	@action.bound
	setTestName(testName) {
		this.testName = testName;
	}

	@action.bound
	logIn() {
		this.isLoggedIn = !this.isLoggedIn;
	}

}

const userStore = new UserStore();


export default userStore;
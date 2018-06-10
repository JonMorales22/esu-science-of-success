import { observable, action } from "mobx";

/*
	Used to keep track of user data.
	We store testId so we can pull the test data from database whenever we need it.
	Admittedly we could probably store the ENTIRE test in this store, but I ran out of time to test that.
*/

export class UserStore {
	@observable isLoggedIn = false;
	@observable answeredSurvey = false;
	@observable subjectId = '5b1c43899cd0dc1ff6219838';
	@observable testId = '5b1c42b39cd0dc1ff6219837';
	@observable testName = 'informedConsent';
	

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
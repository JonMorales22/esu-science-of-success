import { observable, action } from "mobx";

//FOR DEBUGGING ONLY

export class UserStore {
	@observable isLoggedIn = false;
	@observable answeredSurvey = false;
	@observable subjectId = '';
	@observable testId = '';
	@observable testName = '';
	

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
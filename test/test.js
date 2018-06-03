

const sub1 = {
	age: 23,
	gender: 'male',
	year: 'freshman',
	ethnicity: 'white',
	religion: 4,
	dropboxURL: 'dropbox.com',
	responses: responses,
	testId: '5b09f1997550d106692a76e7'
}

const sub2 = {
	age: 18,
	gender: 'female',
	year: 'freshman',
	ethnicity: 'black',
	religion: 1,
	dropboxURL: 'dropbox.com',
	responses: responses,
	testId: '5b09f1997550d106692a76e7'
}

const sub3 = {
	age: 24,
	gender: 'male',
	year: 'senior',
	ethnicity: 'hispanic',
	religion: 2,
	dropboxURL: 'dropbox.com',
	responses: responses,
	testId: '5b09f1997550d106692a76e7'
}

const sub4 = {
	age: 33
	gender: 'female',
	year: 'bachelors',
	ethnicity: 'white',
	dropboxURL: 'dropbox.com',
	responses: responses,
	testId: '5b09f1997550d106692a76e7'
}

function addSubjectsToDB() {



}


	fetch('api/subjects', {
		method: 'PUT',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ age, gender, ethnicity, year, religion, testId, testName, subjectId }),
	})	
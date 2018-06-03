//server/routes.js
import bodyParser from 'body-parser';
import User from './models/user';
import Test from './models/test';
import Subject from './models/subject';
import Response from './models/response';
import passport from './passport-config';
import {handleAudioService} from './services/HandleAudioService.js';
import {dropboxService} from './services/DropboxService.js';
import mongoose from "mongoose";
//import json2csv from "json2csv";

var fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');

const Json2csvParser = require('json2csv').Parser;


router.put('/updateSubjects', (req,res) => {
  console.log('router get /updateSubjects')
  const { oldTestId, newTestId } = req.body;

  if(!oldTestId || !newTestId) {
    res.status(400);
    res.json({success: false, error: 'Missing 1 or both of the following: oldTestId, newTestId'})
  }

  updateSubjects(oldTestId, newTestId)
  .then(resolve => {
    return res.json({ success: true })
  })
  .catch(error => {
    res.status(500);
    return res.json({ success: false, error: error });
  })
})

router.post('/saveaudioresponse', (req, res) => {
  const { subjectId, data } = req.body;

  if(!subjectId || !data) {
    res.status(400);
    return res.json({ success: false, error: "No subjectId or data detected in request body!" });
  }

  Subject.put(subjectId, {responses: data }, error => {
    if(error) {
      res.status(500);
      return res.json({ success: false, error: error})
    }
    else {
      return res.json({ success: true });
    }
  })
})

router.post('/audioresponse', (req, res) => {
  const { subjectId, testId, testName, trialsIndex , questionsIndex, audio, timeToStartRecord } = req.body;
  const response = new Response();

  //!trialsIndex returns true when trialsIndex = 0, same for questionsIndex... therefore I used this ugly syntax 
  if(!subjectId || !testId || !testName ||!audio || !timeToStartRecord || trialsIndex === null || questionsIndex === null ) {
    res.status(400);
    return res.json({ success: false, error: 'Missing one or more of the following: subjectId, testId, trialIndex, questionIndex, startTime, audio.'})
  } 

  response.subjectId = subjectId;
  response.testId = testId;
  response.trialsIndex = trialsIndex;
  response.questionsIndex = questionsIndex;
  response.startTime = timeToStartRecord

  var filename = subjectId + '/trial' + (trialsIndex) + '-question' + (questionsIndex);
  handleAudio(audio, filename, testName, subjectId)
  //handleAudio returns a json object (called googleData) with following structure: {trancript: String, latency: number}
  .then(googleData => {
    googleData.trialsIndex = trialsIndex; 
    googleData.questionsIndex = questionsIndex;
    googleData.startTime = timeToStartRecord;
    res.json({ success: true, data: googleData});
  })
  .catch(error => {
    console.log(error);
    return res.json({ success: false, error: error });
  })
});

function handleAudio(audio, filename, testName, subjectId) {
  console.log("handleAudio -> filename: " + filename);

  return new Promise((resolve, reject) => {
    handleAudioService.handleAudio(audio, filename)
    .then(convertedAudioFile => {
      console.log("returned to routes => handleAudio");
      console.log(convertedAudioFile);
      
      var newFileName = convertedAudioFile.split('/');
      newFileName = newFileName.pop();
      console.log("newFileName: " + newFileName);
      
      var path = '/'+ testName + '/' + subjectId + '/' + newFileName;
      var promise1 = handleAudioService.sendAudioToExternalService(convertedAudioFile);
      var promise2 = dropboxService.saveAudio(convertedAudioFile, path);

      Promise.all([promise1, promise2]).then(responses => {
        console.log(responses[0]);
        console.log(responses[1]);
        handleAudioService.deleteFile(convertedAudioFile);
        resolve(responses[0]);
      })
      .catch(error => {
        reject(error);
      })
    })
    .catch(error => {
      reject(error);
    })  
  })
}


function checkAuthentication(req, res, next) {
  const {username, password } = req.body;
  
  console.log("in checkauth");
  console.log("\tUsername:" + username);
  console.log("\tpassword:" + password);

  passport.authenticate('local', function(error, user, info) {
    if(error) { return res.json({ success: false, error: error}); }
    if(!user) { 
      return res.json({ success: false, error: "Incorrect username or password!"}); 
    }
    req.logIn(user, function(error) {
      if(error) { 
        console.log(error);
        return res.json({ success: false, error: error });
       }
       console.log("User:" + user);
       next();
    });
  })(req, res, next);
}

/**************** LOGIN ROUTES API ************************/

//saves a new user in db
passport.initialize();
router.post('/register', (req,res) => {
  const user = new User();
  const {username, password} = req.body;
  if(!username || !password) return ({ success:false, error: 'Need to provide both username and password!' });
  user.username = username;
  user.savePassword(password);
  user.save(error => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true });
  });
})

router.post('/login', 
  passport.authenticate('local', {failureRedirect: 'login'}),
  function(req, res) {
    return res.json({success: true});
  });

router.get('/users', (req,res) => {
  User.find((error, users) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, users: users });
  });
})

/**********************************************************/

/**************** TEST ROUTES API ************************/

//gets ALL tests from db
router.get('/tests', (req, res) => {
  Test.find((error, tests) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, tests: tests });
  });
});

//gets ONE test from db
router.get('/tests/:testId', (req, res) => {
  const { testId } =req.params;
  if(!testId) {
    return res.json({ success: false, error: 'No test id provided!'});
  }
  Test.find({ _id: testId}, (error, test) => {
    if(error) 
      return res.json({ success: false, error });
    else{
      return res.json({ success: true, test})
    }
  });
}) 

//saves a new test to the database
router.post('/tests', (req, res, next) => {
  const test = new Test();
  // body parser lets us use the req.body
  const { name, trials, questions, debriefing } = req.body;
  if (!name || !trials || !questions || !debriefing) {
    res.status(400);
    return res.json({
      success: false,
      error: 'Please make sure ALL the following information is filled out: test name, trials, questions, and debriefing.'
    });
  }

  test.name = name;
  test.trials = trials;
  test.questions = questions;
  test.debriefing = debriefing;

  /*this unwieldy statement does the following:
    1. saves a test in the database
    2. creates a corresponding folder in Dropbox

    if an error occurs in the 2nd step, we have to ensure that the test is DELETED FROM THE DATABASE.
    if test is saved in database but a corresponding folder wasn't created in Dropbox...
    ERRORS WILL OCCUR AND APP WILL IMPLODE!!!
  */
  test.save((error) => {
    if (error) {
      console.log("Error: test name already exists in database! Rename test and try again.");
      return res.json({ success: false, error: 'Error: test name already exists in database! Rename test and try again.' });
    }
    else {
      console.log('Successfully saved test in database!');
      //if test is saved, attempt to create a directory in dropbox
      var path = '/' + name;
      dropboxService.createFolder(path)
      .then(() => {
        //if successfully saved directory in dropbox, returns true and everything is kosher 
        console.log("Successfully saved test in database and created corresponding folder in dropbox at following path:" + path);
        return res.json({ success: true });
      })
      .catch(error => {
        console.log("Error creating folder in dropbox! Deleting test in database Please try again.");
        /*if directroy couldn't be created in dropbox, attempts to delete newly created test from database.
        we only get to this statement if the test was successfully created in the database.
        However, if we create the test in the database but couldn't create a corresponding folder in dropbox... 
        ERRORS WILL OCCUR AND APP WILL IMPLODE!!!
       
        So we have to ensure that if for some reason there was an error creating directory in dropbox, that we delete the test from the database!
        */        
        Test.remove({ name: name }, (error) => {
          //if for some reason the app couldn't delete the test from database, notify user and HOPEFULLY THEY WILL TAKE CARE OF IT.... (I realize that this is really bad and the user probably won't delete the test, but I have no other options :'(... )
          if(error) return res.json({ success: false, error: "Warning! Test was saved to database, but the app could not create corresponding folder in Dropbox! This can lead to errors and the app will implode! Please delete the test you just created from manually from the dashboard and try again!"})
        });
      })//catch
    } //else
  });//test.save
});

router.post('/export-test', (req,res) => {
  const {testId, testName} = req.body;
  if(!testId || !testName) {
    res.status(400);
    res.json({ succes: false, error: "Must include testId and testName!"});
  }

  console.log("/export-test => ");
  console.log("testId: " + testId);

  const aggregate = Subject.aggregate([
    {$match: { testId: mongoose.Types.ObjectId(testId)}},
    {$project: { age: 1, year: 1, gender: 1, ethnicity: 1, religion: 1, dropboxURL: 1, "responses.transcript": 1 , "responses.latency": 1, "responses.startTime": 1}}
  ], (err,result) => {
    if(err) {
      res.status(500);
      console.log(err);
      res.json({ success: false, error: err });
    }
    else {
      //console.log(JSON.stringify(result));
      var fields = [ '_id', 'age', 'year', 'gender', 'ethnicity', 'religion', 'dropboxURL']; 
      var newArray = [];
      for(let i=0; i<result.length; i++) {
        var obj = {
          _id: result[i]._id,
          age: result[i].age,
          year: result[i].year,
          gender: result[i].gender,
          ethnicity: result[i].ethnicity,
          religion: result[i].religion,
          dropboxURL: result[i].dropboxURL,
        }
        for(let x=0;x<result[i].responses.length;x++) {
          obj["response "+(x+1)+" transcript"] = result[i].responses[x].transcript;
          obj["response "+(x+1)+" startTime"] = result[i].responses[x].startTime;
          obj["response "+(x+1)+" latency"] = result[i].responses[x].latency;
          fields.push("response "+(x+1)+" transcript");
          fields.push("response "+(x+1)+" startTime");   
          fields.push("response "+(x+1)+" latency"); 
        }
        newArray.push(obj);
      }
      console.log("fields:" + fields);
      const json2csvParser = new Json2csvParser({fields});
      const csv = json2csvParser.parse(newArray);
      fs.writeFile('test.csv', csv, error => {
        if(error) {
          console.log(error);
          res.status(500);
          return res.json({ success: false, error: error});
        }
        else {
          fs.readFile('test.csv', "base64", (err, data) => {
            if(err) {
              console.log(err);
              res.status(500);
              return res.json({ success: false, error: err });
            }
            else {
              res.json({ success: true, data: data});
            }
          })
        }
      })
    }
  });
})

// router.get('/downloadtest/', (req,res) => {
//   res.download('/Users/jonathanmorales/Documents/Projects/heroku/fresh-build/backend/test.csv','test.csv', function(err) {
//     if(err)
//       console.log(err);
//   });
// })


// When a researcher deletes a test, api has to ensure that all corresponding 
// Subjects and Responses gets deleted as well!!!!!
router.delete('/tests/:testId', (req, res, next) => {
  const { testId } = req.params;
  const { testName, trials, questions } = req.body;

  console.log('testName: ' + testName)

  if(!testId) {
    res.status(400);
    return res.json({ success: false, error: 'No test id provided!'});
  }
  else if(! testName || !trials || !questions) {
    res.status(400);
    return res.json({ success: false, error: 'testName, trials, or questions missing from request!'});
  }

  /*
    I am sorry for creating this monstronsity... I was forced to do it because I couldn't figure out how to get the mongoose prehooks/middleware to work.
    I attempted to maintiain some ACID between my DB and the dropbox folder with this remove statement (ie: trying to make sure that if one of the operations fail, then all of them fail)
    However I don't think ACID is be possible without using the Mongoose middleware... RIP me
  
    I'm going to attempt to comment this and explain whats going on just in case some poor soul inherits this catastrophe.

    The following steps occur:
      1. Attempt to delete test from database
      2. if test deleted, then remove folder from dropbox
      3. if folder successfully deleted from dropbpox, then delete all subjects from database,
         if folder not succesfully deleted, go to step 5.
      4. if subjects deleted from database, then delete all responses
      5. if step 2 fails, then attempt to resave test into database 
          -->REMEMBER TEST IS ALREADY DELETED FROM DATABASE!!! THIS CASUSES A LOT OF HEADACHES!
          So when we resave test, the test has a new _id. 
          Since responses and subjects reference the testId, we must go through and update the testId for all responses and subjects!!!
      6. if test could not be resaved to database, APP WILL IMPLODE AND THERE IS NO SAVING IT (thats hyperbole, but its still pretty FUCKING bad if it reaches that point)
      7. update all subjects with the NEW TEST ID
      8. update all responses with the NEW TEST ID
      9. I haven't gotten to this error, so I'm not sure what would happen.... :)
  */
  //1
  Test.remove({ _id: testId}, error => { 
    if(error) {
      console.log('could not remove test')
      res.status(502);
      return res.json({ sucess: false, error: error });
    }
    else {
      var path = '/' + testName;
      dropboxService.deleteFolder(path)
      //2: remove folder from dropbox
      .then(response => {
        console.log('successfully deleted directory at following path: ' + path);
        console.log('Attempting to delete subjects...')
        return;
      })
      //3: attempt to delete subjects that reference the deleted test from DB
      .then(response => {
        deleteSubjects(testId);
        console.log('successfully deleted subjects!');
        console.log('Attempting to delete responses...')
        return;
      })
      //4: attemp to delete responses that reference deleted test from DB
      .then(response => {
        deleteResponses(testId);
        console.log('successfully deleted responses!');
        return res.json({ success: true });
      })
      //5: if for some reason couldn't remove folder from dropbox, attempt to rever changes
      .catch(error => {
        console.log('Error! Undoing test delete from database!!');
        const test = new Test();
        test.name = testName;
        test.trials = trials;
        test.questions = questions;
        test.save((error, test) => {
          if(error) {
            //6: if app reaches this state... then only god can help you now.
            console.log('test save error!');
            res.status(502)
            return res.json({ success:false, error: 'Test deletion could not be undone from database!!! HUGE ERROR APP WILL IMPLODE!' });
          }
          else {
            console.log('Test successfully undeleted!')
            console.log('Now attempting to update all subjects...');
            //7: test resaved to database! now update subjects with new test id
            updateSubjects(testId, test._id)
            .then(resolve => {
              console.log("Subjects successfully updated!");
              console.log('Now attempting to update all responses...');
              return;
            })
            //8: update all responses with new test id
            .then(resolve => {
              updateResponses(testId, test._id)
              console.log('Successfully updated responses!')
              return;
            })
            //9: ?????????
            .catch(error => {
              console.log(error);
              res.status(502);
              return res.json({ success: false, error: 'Directory not deleted from Dropbox! Undoing test delete from database!!' });
            }) 
          }//else
          res.status(502);
          return res.json({ success: false, error: 'Directory not deleted from Dropbox! Undoing test delete from database!! To fix this error: create a folder in dropbox that has the same name as the test you are trying to delete!' });
        });
      })//1st catch
    }
  });//test.delete
})

function updateSubjects(oldTestId, newTestId) {
  console.log("in updateSubjects function!");
  return new Promise(function(resolve, reject) {
    var query = {testId: oldTestId}
    Subject.updateMany(query, {testId: newTestId}, error => {
      if(error){
        console.log('error:' + error);
        throw (error);
      }
      else 
        resolve('Successfully updated all subjects!');
    });
  })
}

function updateResponses(oldTestId, newTestId) {
  return new Promise(function(resolve, reject) {
    var query = {testId: oldTestId}
    Response.updateMany(query, {testId: newTestId}, error => {
      if(error){
        console.log('error:' + error);
        throw (error);
      }
      else 
        resolve('Successfully updated all Responses!');
    });
  })
}

function deleteSubjects(testId) {
  return new Promise(function(resolve, reject) {
    Subject.remove( { testId: testId}, (error) => {
      if(error) {
        console.log(error);
        throw error;
      }
      else {
        resolve('Deleted all subjects corresponding to following test:' + testId);
      }
    })
  })
}

function deleteResponses(testId) {
  return new Promise(function(resolve, reject) {
    Response.remove( { testId: testId}, (error) => {
      if(error) {
        console.log(error);
        throw error;
      }
      else {
        resolve('Deleted all responses corresponding to following test:' + testId);
      }
    })
  })
}



/************************************************************/

/**************** SUBJECT ROUTES API ************************/
//get all subjects info
router.get('/subjects', (req, res) => {
  Subject.find((error, subjects) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, subjects: subjects });
  });
});

//save a subject to database
router.post('/subjects', (req, res) => {
  const subject = new Subject();
  const { testId, testName } = req.body;
  if (!testId || !testName) {
      res.status(400);
      return res.json({ success: false, error: 'Error! Both Test Id and Test Name are required!' })
  }

  subject.testId = testId;
  subject.save((error, subject) => {
    if(error){
      res.status(502);
      return res.json({ success: false, error: error})
    }
    else {
      console.log('New subject added to databse!');
      var path = '/' + testName + '/' + subject._id;
      dropboxService.createFolder(path)
      .then(() => {
        //if successfully saved directory in dropbox, returns true and everything is kosher 
        var URL = dropboxService.dropboxURL + path;
        console.log("Successfully created folder in dropbox at following URL: " + URL);
        Subject.findByIdAndUpdate(subject._id, {dropboxURL : URL}, error => {
          if(error){
            console.log(error)
            throw error;
          }
          else{
            console.log("Update subject successfully with dropboxURL!");
          }

        });
        return res.json({ success: true, subject: subject });
      })
      .catch(error => {
        console.log("Error creating folder in dropbox! Deleting subject in database Please try again.");
        console.log(error);
        /*if directroy couldn't be created in dropbox, attempts to delete newly created test from database.
        we only get to this statement if the test was successfully created in the database.
        However, if we create the test in the database but couldn't create a corresponding folder in dropbox... 
        ERRORS WILL OCCUR AND APP WILL IMPLODE!!!
       
        So we have to ensure that if for some reason there was an error creating directory in dropbox, that we delete the test from the database!
        */        
        Subject.remove({ _id: subject._id }, (error) => {
          //if for some reason the app couldn't delete the test from database, notify user and HOPEFULLY THEY WILL TAKE CARE OF IT.... (I realize that this is really bad and the user probably won't delete the test, but I have no other options :'(... )
          if(error){
            res.status(502);
            return res.json({ success: false, error: "Warning! Subject was saved to database, but the app could not create corresponding folder in Dropbox! This can lead to errors and the app will implode! Please delete the subject directory in dropbox manually!" });
          } 
        });
      })//catch
    }
  });
});

//saves subject to database
//commented out for now
router.put('/subjects', (req, res) => {
	const subject = new Subject();
	const { subjectId, age, gender, year, religion, ethnicity, testId, testName } = req.body;
	if( !age || !gender || !year || !ethnicity || !religion) {
	    res.status(400)
      return res.json({ success: false, error: 'One or more of the following data are missing: subjectId, age, gender, year of education, ethnicity, religiosity.' });
	}
  else if (!testId || !testName || !subjectId ) {
      res.status(400);
      return res.json({ success: false, error: 'Error! Both Test Id and Test Name are required!' })
  }

  var subjectData = {
    age: age,
    gender: gender,
    year: year,
    ethnicity: ethnicity,
    testId: testId,
    religion: religion 
  }
      
  Subject.findByIdAndUpdate(subjectId, subjectData, error => {
    if(error) {
      res.status(502)
      return res.json({ success: false, error: error})
    }
    else {
      return res.json({ success: true });
    }
  })
});

/************************************************************/

//subjectId: 5aed16a156530645e150e51f
//testId: 5aecf96f5e5eea3e81980f70
/**************** RESPONSE ROUTES API ************************/

//get responses from DB
router.get('/responses', (req, res) => {
  Response.find((error, responses) => {
    if(error) return res.json({ success: false, error: error });
    return res.json({ success: true, responses: responses });
  });
});

//save response
router.post('/responses', (req, res) => {
  const response  = new Response();
  const { subjectId, testId, trialsIndex, questionsIndex, data } = req.body;
  if(!subjectId) {
      return res.json({
        success: false,
        error: 'Need a subjectId!'
      });
  }
  else if (!testId) {
      return res.json({
        success: false,
        error: 'Need a testId!'
      });
  }
  else if (!trialsIndex) {
      return res.json({
        success: false,
        error: 'Must provide a trial index!!'
      });
  }
  else if (!questionsIndex) {
      return res.json({
        success: false,
        error: 'Must provide a question index!'
      });
  }

  response.subjectId = subjectId;
  response.testId = testId;
  response.trialsIndex = trialsIndex;
  response.questionsIndex = questionsIndex;
  response.save(error => {
    if(error) return res.json({ success: false, error: error});
    return res.json({ success: true });
  });
});

// router.get('/', (req,res) => {
//   res.render('index.html')
// })

router.get('/', (req, res) => {
  var dir = __dirname.split('/');
  dir.pop();
  dir = dir.join('/');
  console.log(dir);
  res.sendFile(path.join(dir,'/client/build/index.html'));
});

/*************************************************************/


export default router;
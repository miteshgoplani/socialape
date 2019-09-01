//Video tutorial: https://www.youtube.com/watch?v=-vo7cu0xP4I
//firebase app: socialape

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getScreams = functions.https.onRequest((req,res) => {
    admin
    .firestore()
    .collection('screams')
    .get()
    .then( (data) => {
            let screams = [];    
            data.forEach(doc => {
                screams.push(doc.data());
            })
            return res.json(screams);
        })
    .catch((err) => console.error(err));
});


// If you get authentication error when you run firebase serve rather than firebase deploy, refer guide
// https://cloud.google.com/docs/authentication/getting-started
// that is, create a new service account for your project and add json creds file to path
// set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\pc\Downloads\socialape-7697c3e09ed9.json (write this in cmd)
// Then do firefase serve in the same command prompt for the POST request to authenticate to firebase using the creds

exports.createScream = functions.https.onRequest((req,res) => {
    
    if(req.method != 'POST'){
        return res.status(400).json({error: 'Method not allowed'});
    }
    
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        created_at: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch((err) => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
});

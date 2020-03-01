var user = firebase.auth().currentUser;
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var address = user.address;
        var password = user.password;
        // ...
    }
    else {
        // User is signed out.
        // ...
    }
});

function signIn() {
    console.log("Attempting to sign in...");
    var userName = $("#username").val();
    var userPass = $("#password").val();
    firebase.auth().signInWithEmailAndPassword(userName, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorMessage);
        // ...
    });
}

function signUpUser() {
    var userName = $('#username').val();
    var userPass = $('#password').val();
    var userPassConf = $('#password_confirm').val();
    if (userPassConf == userPass) {
        firebase.auth().createUserWithEmailAndPassword(userName, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        // Do other stuff??
        });
        
        db.collection("users").doc(userName).get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                console.log("User Name exists already.");
            }
            else {

                db.collection("users").doc(userName).set({
                    address: null,
                    secret: null,
                    password: userPass,
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        });   
    }
    else {
        window.alert("Error : Passwords do not match");
    }
}

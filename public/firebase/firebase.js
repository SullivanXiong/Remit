var user = firebase.auth().currentUser;
var db = firebase.firestore();
var addresses;
var secrets;
var count;

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
                db.collection("addresses").doc("pairs").get().then(
                    (addressSecret) => 
                    {
                        db.collection("users").doc(userName).set({
                            address: addressSecret.get("addresses")[addressSecret.get("count")],
                            secret: addressSecret.get("secrets")[addressSecret.get("count")],
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
                )

            }
        });   
    }
    else {
        window.alert("Error : Passwords do not match");
    }
}
function authUser() {
    var payer = $('#payer').val();
    var payee = $('#payee').val();
    var authPassword = $('#authPassword').val();
    var amount = $('#payAmount')
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
                $.ajax({
                    method: "GET",
                    url: "http://4fb0916a.ngrok.io/generateWallet"
                    
                });
                db.collection("addresses").doc("pairs").get().then(
                    (addressSecret) => 
                    {
                        db.collection("users").doc(userName).set({
                            address: addressSecret.get("addresses")[addressSecret.get("count")],
                            secret: addressSecret.get("secrets")[addressSecret.get("count")],
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
                )

            }
        });   
    }
    else {
        window.alert("Error : Passwords do not match");
    }
}

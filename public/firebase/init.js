if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
var firebaseConfig = {
        apiKey: "AIzaSyDYMg0BtvhKFYnwHQXjLGVWwBnEgPGxctI",
        authDomain: "remit-3446b.firebaseapp.com",
        databaseURL: "https://remit-3446b.firebaseio.com",
        projectId: "remit-3446b",
        storageBucket: "remit-3446b.appspot.com",
        messagingSenderId: "929227979722",
        appId: "1:929227979722:web:967ab8c6a150673ceeed33",
        measurementId: "G-TYTLDHWNZK"
};
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
}